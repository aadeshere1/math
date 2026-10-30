/*
  Cloud save (optional). Copies a student's progress to Firebase so a parent can follow it on
  parent.html, and so progress follows the student to another phone or computer.

  It does nothing until cloud/firebase-config.js has a config (see cloud/SETUP.md).
  It does not change the engines: it watches what they save in localStorage, sends changed
  keys to Firestore a few seconds later, and on page load brings in what other devices saved.
  The two copies are merged question by question, so nothing is lost when two devices were
  used: a solved question stays solved, the best points are kept, and so on.

  Data in Firestore:
    families/{parentUid}                         the parent's account
    families/{p}/children/{c}                    { name, members: { deviceUid: true }, lastActive }
    families/{p}/children/{c}/store/{key}        { k: key, v: JSON text, ts }   one per saved key
    families/{p}/children/{c}/days/{yyyy-mm-dd}  { minutes, solved, points }
    pairs/{code}                                 { p, c, name, exp }   a short-lived pairing code
*/
(function () {
  "use strict";
  var CFG = window.ANGLE_FIREBASE || null;
  var SDK = window.ANGLE_FIREBASE_SDK || "https://www.gstatic.com/firebasejs/10.12.2/";
  var LINK_KEY = "cloud:link", PULL_KEY = "cloud:pulled", DIRTY_KEY = "cloud:dirty", DAY_KEY = "cloud:day";

  /* ---------- localStorage, without being seen by our own watcher ---------- */
  var rawGet = Storage.prototype.getItem, rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
  function lsGet(k) { try { return rawGet.call(localStorage, k); } catch (e) { return null; } }
  function lsSet(k, v) { try { rawSet.call(localStorage, k, v); } catch (e) {} }
  function lsDel(k) { try { rawRemove.call(localStorage, k); } catch (e) {} }
  function jget(k) { try { return JSON.parse(lsGet(k) || "null"); } catch (e) { return null; } }
  function jparse(s) { try { return JSON.parse(s); } catch (e) { return null; } }

  // Keys that are progress. Not synced: the sea's toast memo, the Nepali switch, and our own keys.
  function tracked(k) {
    if (k === "practice:sea" || k === "science:nepali") return false;
    return /^practice:/.test(k) || /^science:/.test(k) || k === "sea:summary" || k === "sea:species";
  }
  function isProg(k) { return /^(practice|science):/.test(k) && k !== "practice:days"; }

  /* ---------- merging two copies of the same key ---------- */
  function mergeQ(a, b) {
    if (!a) return b; if (!b) return a;
    if (a.solved && !b.solved) return a;
    if (b.solved && !a.solved) return b;
    if (a.solved && b.solved) return (b.points || 0) > (a.points || 0) ? b : a;
    var base = (b.attempts || 0) > (a.attempts || 0) ? b : a, r = {};
    for (var x in base) r[x] = base[x];
    r.attempts = Math.max(a.attempts || 0, b.attempts || 0);
    r.help = Math.max(a.help || 0, b.help || 0);
    return r;
  }
  function mergeProg(a, b) {
    var out = {}, x;
    for (x in a) out[x] = a[x];
    for (x in b) if (!(x in out)) out[x] = b[x];
    var qa = a.q || {}, qb = b.q || {};
    out.q = {};
    Object.keys(qa).concat(Object.keys(qb)).forEach(function (id) { if (!(id in out.q)) out.q[id] = mergeQ(qa[id], qb[id]); });
    if (a.seen || b.seen) {
      out.seen = {};
      [a.seen || {}, b.seen || {}].forEach(function (s) { for (var y in s) if (s[y]) out.seen[y] = s[y]; });
    }
    return out;
  }
  function better(a, b) { // sea:summary entries: the one with more done wins
    if (!a) return b; if (!b) return a;
    if ((b.done || 0) !== (a.done || 0)) return (b.done || 0) > (a.done || 0) ? b : a;
    if ((b.tried || 0) !== (a.tried || 0)) return (b.tried || 0) > (a.tried || 0) ? b : a;
    return (b.points || 0) > (a.points || 0) ? b : a;
  }
  // local and remote are parsed values. When both have a saved animal for a chapter, the cloud one wins.
  function mergeVal(k, local, remote) {
    if (local == null) return remote;
    if (remote == null) return local;
    var o = {}, x;
    if (k === "practice:days") {
      var set = {};
      (Array.isArray(local) ? local : []).concat(Array.isArray(remote) ? remote : []).forEach(function (d) { set[d] = 1; });
      return Object.keys(set).sort().slice(-120);
    }
    if (k === "sea:species") { for (x in local) o[x] = local[x]; for (x in remote) o[x] = remote[x]; return o; }
    if (k === "sea:summary") { for (x in local) o[x] = local[x]; for (x in remote) o[x] = better(o[x], remote[x]); return o; }
    if (isProg(k)) return mergeProg(local, remote);
    return remote;
  }
  // JSON with sorted keys, to compare two values
  function canon(v) {
    if (v === null || typeof v !== "object") return JSON.stringify(v === undefined ? null : v);
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    return "{" + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ":" + canon(v[k]); }).join(",") + "}";
  }
  function solvedOf(v) {
    var n = 0, pts = 0, q = (v && v.q) || {};
    for (var id in q) if (q[id] && q[id].solved) { n++; pts += q[id].points || 0; }
    return { n: n, pts: pts };
  }

  /* ---------- loading Firebase (only when a config exists) ---------- */
  var fbPromise = null;
  function addScript(src) {
    return new Promise(function (ok, bad) {
      var s = document.createElement("script"); s.src = src; s.async = false;
      s.onload = ok; s.onerror = function () { bad(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
  }
  function load() {
    if (!CFG) return Promise.reject(new Error("no-config"));
    if (fbPromise) return fbPromise;
    fbPromise = (window.firebase && window.firebase.firestore ? Promise.resolve() :
      addScript(SDK + "firebase-app-compat.js").then(function () {
        return Promise.all([addScript(SDK + "firebase-auth-compat.js"), addScript(SDK + "firebase-firestore-compat.js")]);
      })).then(function () {
      var fb = window.firebase;
      if (!fb.apps.length) {
        fb.initializeApp(CFG);
        var emu = window.ANGLE_FIREBASE_EMULATOR; // only for testing on a computer
        if (emu) { fb.auth().useEmulator(emu.auth); fb.firestore().useEmulator(emu.host, emu.port); }
      }
      return new Promise(function (ok) { var off = fb.auth().onAuthStateChanged(function () { off(); ok(fb); }); });
    });
    fbPromise.catch(function () { fbPromise = null; });
    return fbPromise;
  }
  function ts() { return window.firebase.firestore.FieldValue.serverTimestamp(); }
  function childRef(fb, link) { return fb.firestore().collection("families").doc(link.p).collection("children").doc(link.c); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  function signInGoogle(fb) {
    var prov = new fb.auth.GoogleAuthProvider();
    prov.setCustomParameters({ prompt: "select_account" });
    return fb.auth().signInWithPopup(prov).catch(function (e) {
      if (e && /popup-blocked|operation-not-supported/.test(e.code || "")) return fb.auth().signInWithRedirect(prov);
      throw e;
    });
  }
  function friendly(e) {
    var c = (e && e.code) || "";
    if (/permission-denied/.test(c)) return "Not allowed. This device may have been unlinked by the parent.";
    if (/unavailable|network/.test(c)) return "No internet right now. Progress is safe on this device and will be sent later.";
    if (/popup-closed|cancelled-popup/.test(c)) return "Sign-in was closed before it finished.";
    if (/unauthorized-domain/.test(c)) return "This website is not allowed to sign in yet. Add it under Authentication > Settings > Authorized domains in Firebase.";
    if (/admin-restricted|operation-not-allowed/.test(c)) return "This sign-in method is turned off in Firebase (Authentication > Sign-in method).";
    return (e && e.message) || "Something went wrong.";
  }

  var Cloud = window.AngleCloud = {
    enabled: !!CFG, load: load, signInGoogle: signInGoogle, friendly: friendly, ts: ts, today: today,
    merge: mergeVal, canon: canon, tracked: tracked
  };
  if (!CFG || window.ANGLE_PARENT_PAGE) return;

  /* ===================================================================================
     Student pages (maths and science): watch saves, push them, pull on load, small UI.
     =================================================================================== */
  var link = jget(LINK_KEY), fbase = null, status = "off", lastSync = 0, lastErr = "";
  var dirty = jget(DIRTY_KEY) || {}, day = jget(DAY_KEY) || null, timer = null, pushing = false, lastActiveSent = 0;
  function saveDirty() { lsSet(DIRTY_KEY, JSON.stringify(dirty)); lsSet(DAY_KEY, JSON.stringify(day)); }
  function addDay(f, n) {
    var t = today();
    if (!day || day.d !== t) {
      var prev = day && (day.minutes || day.solved || day.points) ? { d: day.d, minutes: day.minutes, solved: day.solved, points: day.points } : (day && day.prev) || null;
      day = { d: t, minutes: 0, solved: 0, points: 0, prev: prev };
    }
    day[f] += n;
  }
  var seq = 0;

  // Watch every save the engines make.
  Storage.prototype.setItem = function (k, v) {
    var watch = link && this === window.localStorage && tracked(k), old = watch ? rawGet.call(this, k) : null;
    rawSet.call(this, k, v);
    if (watch && old !== String(v)) {
      dirty[k] = ++seq + Date.now();
      if (isProg(k)) {
        var a = solvedOf(jparse(old)), b = solvedOf(jparse(v));
        if (b.n > a.n) { addDay("solved", b.n - a.n); addDay("points", Math.max(0, b.pts - a.pts)); }
      }
      saveDirty(); schedule(4000);
    }
  };

  // Minutes of practice: a minute counts when the page was open and touched in it.
  var activeNow = false;
  ["pointerdown", "keydown", "input"].forEach(function (ev) { document.addEventListener(ev, function () { activeNow = true; }, true); });
  setInterval(function () {
    if (!link) return;
    if (activeNow && !document.hidden) { addDay("minutes", 1); saveDirty(); schedule(4000); }
    activeNow = false;
  }, 60000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) schedule(0); });
  window.addEventListener("pagehide", function () { schedule(0); });
  window.addEventListener("online", function () { schedule(500); });

  function schedule(ms) {
    if (!link || !fbase) return;
    clearTimeout(timer);
    timer = setTimeout(push, ms);
  }

  function push() {
    if (!link || !fbase || pushing) return Promise.resolve();
    var keys = Object.keys(dirty), mark = {}, d = day && (day.minutes || day.solved || day.points || day.prev) ? day : null;
    var needActive = Date.now() - lastActiveSent > 120000 && (keys.length || d);
    if (!keys.length && !d && !needActive) return Promise.resolve();
    pushing = true; setStatus("sync");
    var ref = childRef(fbase, link), db = fbase.firestore(), inc = fbase.firestore.FieldValue.increment;
    keys.forEach(function (k) { mark[k] = dirty[k]; });
    var jobs = keys.map(function (k) {
      var doc = ref.collection("store").doc(k.replace(/\//g, "_"));
      return db.runTransaction(function (tx) {
        return tx.get(doc).then(function (snap) {
          var local = jget(k), remote = snap.exists ? jparse(snap.data().v) : null, m = mergeVal(k, local, remote);
          if (m == null || (remote != null && canon(m) === canon(remote))) return;
          tx.set(doc, { k: k, v: JSON.stringify(m), ts: ts() });
        });
      }).then(function () { if (dirty[k] === mark[k]) delete dirty[k]; });
    });
    if (d) {
      var sent = { d: d.d, minutes: d.minutes || 0, solved: d.solved || 0, points: d.points || 0 }, prev = d.prev;
      var w = function (x) { return ref.collection("days").doc(x.d).set({ d: x.d, minutes: inc(x.minutes || 0), solved: inc(x.solved || 0), points: inc(x.points || 0) }, { merge: true }); };
      jobs.push((prev && prev.d ? w(prev) : Promise.resolve()).then(function () {
        if (day && day.prev === prev) day.prev = null;
        return sent.minutes || sent.solved || sent.points ? w(sent).then(function () {
          if (day && day.d === sent.d) { day.minutes -= sent.minutes; day.solved -= sent.solved; day.points -= sent.points; }
        }) : null;
      }));
    }
    if (needActive) jobs.push(ref.update({ lastActive: ts() }).then(function () { lastActiveSent = Date.now(); }));
    return Promise.all(jobs).then(function () {
      pushing = false; saveDirty(); lastSync = Date.now(); setStatus("ok");
      if (Object.keys(dirty).length) schedule(4000);
    }, function (e) {
      pushing = false; saveDirty(); lastErr = friendly(e);
      if (/permission-denied/.test(e && e.code)) { setStatus("denied"); return; }
      setStatus("offline"); schedule(30000);
    });
  }

  // Bring in what other devices saved since the last pull. Resolves true when local progress changed.
  function pull() {
    var ref = childRef(fbase, link), pk = PULL_KEY + ":" + link.p + "/" + link.c, last = +(lsGet(pk) || 0);
    var q = ref.collection("store");
    if (last) q = q.where("ts", ">", fbase.firestore.Timestamp.fromMillis(last));
    return q.get().then(function (snap) {
      var changed = false, max = last;
      snap.forEach(function (doc) {
        var x = doc.data(), k = x.k; if (!k || !tracked(k)) return;
        var remote = jparse(x.v), local = jget(k), m = mergeVal(k, local, remote);
        if (canon(m) !== canon(local)) { lsSet(k, JSON.stringify(m)); changed = true; }
        if (canon(m) !== canon(remote)) dirty[k] = 1;
        if (x.ts && x.ts.toMillis) max = Math.max(max, x.ts.toMillis());
      });
      lsSet(pk, String(max)); saveDirty();
      return changed;
    });
  }
  function markAllDirty() {
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (tracked(k)) dirty[k] = 1; }
    saveDirty();
  }
  function reloadOnce() {
    var t = +(sessionStorage.getItem("cloud:reloaded") || 0);
    if (Date.now() - t < 20000) return false;
    sessionStorage.setItem("cloud:reloaded", String(Date.now()));
    location.reload();
    return true;
  }

  function start() {
    if (!link) return;
    setStatus("sync");
    load().then(function (fb) {
      var u = fb.auth().currentUser;
      if (!u || (link.mode === "parent" ? u.uid !== link.p : u.uid !== link.u)) { setStatus("signin"); return; }
      fbase = fb;
      return pull().then(function (changed) {
        lastSync = Date.now();
        if (changed && reloadOnce()) return;
        setStatus("ok"); schedule(1500);
      });
    }).catch(function (e) {
      lastErr = friendly(e);
      setStatus(/permission-denied/.test(e && e.code) ? "denied" : "offline");
      if (!/permission-denied/.test(e && e.code)) setTimeout(function () { if (status === "offline") start(); }, 60000);
    });
  }

  function setLink(l, fb) {
    link = l; lsSet(LINK_KEY, JSON.stringify(l)); fbase = fb;
    markAllDirty(); setStatus("sync");
    return pull().then(function (changed) {
      return push().then(function () { if (changed) { sessionStorage.removeItem("cloud:reloaded"); location.reload(); } });
    });
  }
  function unlink() {
    link = null; fbase = null; clearTimeout(timer);
    lsDel(LINK_KEY); lsDel(DIRTY_KEY); lsDel(DAY_KEY); dirty = {}; day = null;
    setStatus("off");
  }
  Cloud.sync = { push: push, pull: function () { return fbase ? pull() : Promise.resolve(false); }, status: function () { return status; } };

  /* ---------- the chip in the top bar and its dialog ---------- */
  var chip = null, dlg = null;
  function E(tag, a, kids) {
    var n = document.createElement(tag);
    for (var k in a || {}) {
      if (k === "text") n.textContent = a[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), a[k]);
      else if (a[k] != null && a[k] !== false) n.setAttribute(k, a[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function setStatus(s) {
    status = s;
    if (!chip) return;
    var name = link && link.name;
    var text = !link ? "Save progress" : s === "signin" ? "Sign in again" : s === "denied" ? "Unlinked" : name + (s === "offline" ? " · offline" : "");
    chip.querySelector(".cloud-t").textContent = text;
    chip.className = "cloud-chip " + (link ? "is-" + s : "is-off");
    chip.title = !link ? "Save progress to the cloud so a parent can follow it" : s === "ok" ? "Progress is saved to the cloud" : s === "sync" ? "Saving…" : lastErr || "";
    if (dlg && dlg.open) fillDialog();
  }
  function mountChip() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    chip = E("button", { type: "button", class: "cloud-chip is-off", onclick: openDialog }, [E("span", { class: "cloud-i", "aria-hidden": "true", text: "☁️" }), E("span", { class: "cloud-t", text: "Save progress" })]);
    nav.appendChild(chip);
    dlg = E("dialog", { class: "cloud-dlg", "aria-label": "Cloud save" });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    document.body.appendChild(dlg);
    setStatus(status);
  }
  function openDialog() { fillDialog(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
  function closeBtn() { return E("button", { type: "button", class: "cloud-x", "aria-label": "Close", text: "×", onclick: function () { dlg.close(); } }); }
  function msg(box, text, bad) { box.textContent = text; box.className = "cloud-msg" + (bad ? " bad" : ""); box.hidden = !text; }
  function ago(ms) {
    var s = Math.round((Date.now() - ms) / 1000);
    return s < 60 ? "just now" : s < 3600 ? Math.round(s / 60) + " min ago" : new Date(ms).toLocaleString();
  }

  function fillDialog() {
    dlg.innerHTML = "";
    dlg.appendChild(closeBtn());
    var note = E("p", { class: "cloud-msg", hidden: "hidden" });
    if (link) {
      dlg.appendChild(E("h2", { text: "☁️ Saving " + link.name + "'s progress" }));
      var line = status === "ok" ? "Everything is saved. Last sync " + (lastSync ? ago(lastSync) : "just now") + "." :
        status === "sync" ? "Saving…" :
        status === "signin" ? "The parent account on this device signed out. Sign in again to keep saving." :
        status === "denied" ? "This device is no longer linked. Unlink it here, then link it again with a new code." :
        "Can't reach the cloud right now. Progress is safe on this device and will be sent when the internet is back.";
      dlg.appendChild(E("p", { class: "cloud-p", text: line }));
      dlg.appendChild(E("p", { class: "cloud-p soft", text: "A parent can see it on the parent page. Progress made on another linked device is brought in when a page opens." }));
      var row = E("div", { class: "cloud-row" });
      if (status === "signin") row.appendChild(E("button", { type: "button", class: "btn primary small", text: "Sign in with Google", onclick: function () {
        load().then(function (fb) { return signInGoogle(fb).then(function () { start(); }); }).catch(function (e) { msg(note, friendly(e), true); });
      } }));
      else if (status !== "denied") row.appendChild(E("button", { type: "button", class: "btn small", text: "Sync now", onclick: function () {
        if (!fbase) { start(); return; }
        setStatus("sync"); pull().then(function (ch) { if (ch && reloadOnce()) return; return push(); }).catch(function (e) { msg(note, friendly(e), true); setStatus("offline"); });
      } }));
      row.appendChild(E("button", { type: "button", class: "btn small danger", text: "Unlink this device", onclick: function () {
        if (!confirm("Stop saving to the cloud on this device? Progress already made stays on this device and in the cloud.")) return;
        var wasCode = link.mode === "code";
        unlink();
        if (wasCode) load().then(function (fb) { if (fb.auth().currentUser && fb.auth().currentUser.isAnonymous) fb.auth().signOut(); }).catch(function () {});
      } }));
      dlg.appendChild(row);
      dlg.appendChild(note);
      dlg.appendChild(E("p", { class: "cloud-foot" }, [E("a", { href: "parent.html", text: "Parent page →" })]));
      return;
    }

    dlg.appendChild(E("h2", { text: "☁️ Save progress to the cloud" }));
    dlg.appendChild(E("p", { class: "cloud-p", text: "Then a parent can see how practice is going, and progress follows you to another phone or computer." }));

    // A: a code from the parent page
    var code = E("input", { class: "cloud-code", inputmode: "text", autocomplete: "off", autocapitalize: "characters", spellcheck: "false", maxlength: "6", placeholder: "ABC123", "aria-label": "Code from your parent" });
    code.addEventListener("input", function () { code.value = code.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
    var go = E("button", { type: "button", class: "btn primary small", text: "Link", onclick: function () {
      var c = code.value.trim();
      if (c.length !== 6) { msg(note, "The code has 6 letters and numbers.", true); return; }
      go.disabled = true; msg(note, "Linking…");
      linkWithCode(c).catch(function (e) { go.disabled = false; msg(note, e.mine ? e.message : friendly(e), true); });
    } });
    code.addEventListener("keydown", function (e) { if (e.key === "Enter") go.click(); });
    dlg.appendChild(E("section", { class: "cloud-sec" }, [
      E("h3", { text: "I have a code" }),
      E("p", { class: "cloud-p soft", text: "Ask your parent to open the parent page and press \"Link a device\"." }),
      E("div", { class: "cloud-row" }, [code, go])
    ]));

    // B: a parent signs in here (a shared family computer)
    var pbox = E("div", {});
    dlg.appendChild(E("section", { class: "cloud-sec" }, [
      E("h3", { text: "I am the parent, on this device" }),
      pbox
    ]));
    dlg.appendChild(note);
    dlg.appendChild(E("p", { class: "cloud-foot" }, [E("a", { href: "parent.html", text: "Parent page →" })]));
    parentPicker(pbox, note);
  }

  function linkWithCode(c) {
    return load().then(function (fb) {
      var auth = fb.auth(), u = auth.currentUser;
      var signIn = u && u.isAnonymous ? Promise.resolve(u) : auth.signInAnonymously().then(function (r) { return r.user; });
      return signIn.then(function (user) {
        var db = fb.firestore(), pref = db.collection("pairs").doc(c);
        return pref.get().then(function (snap) {
          var p = snap.exists ? snap.data() : null;
          if (!p || !p.exp || p.exp.toMillis() < Date.now()) { var er = new Error("That code does not work. It may be old: ask for a new one."); er.mine = true; throw er; }
          var upd = { pairCode: c }; upd["members." + user.uid] = true;
          return db.collection("families").doc(p.p).collection("children").doc(p.c).update(upd).then(function () {
            pref.delete().catch(function () {});
            return setLink({ p: p.p, c: p.c, name: p.name, mode: "code", u: user.uid }, fb);
          });
        }, function (e) { if (/permission-denied/.test(e.code || "")) { var er = new Error("That code does not work. It may be old: ask for a new one."); er.mine = true; throw er; } throw e; });
      });
    });
  }

  function parentPicker(box, note) {
    box.innerHTML = "";
    var signBtn = E("button", { type: "button", class: "btn small", text: "Sign in with Google", onclick: function () {
      signBtn.disabled = true;
      load().then(function (fb) { return signInGoogle(fb).then(function () { parentPicker(box, note); }); })
        .catch(function (e) { signBtn.disabled = false; msg(note, friendly(e), true); });
    } });
    var fbw = window.firebase && window.firebase.apps && window.firebase.apps.length ? window.firebase : null;
    var u = fbw && fbw.auth().currentUser;
    if (!u || u.isAnonymous) {
      box.appendChild(E("p", { class: "cloud-p soft", text: "Sign in, then choose which child uses this device." }));
      box.appendChild(signBtn);
      return;
    }
    box.appendChild(E("p", { class: "cloud-p soft", text: "Signed in as " + (u.email || u.displayName || "parent") + ". Who uses this device?" }));
    var list = E("div", { class: "cloud-kids", text: "Loading…" });
    box.appendChild(list);
    var fam = fbw.firestore().collection("families").doc(u.uid);
    fam.set({ email: u.email || "", name: u.displayName || "", seen: ts() }, { merge: true }).catch(function () {});
    fam.collection("children").orderBy("name").get().then(function (snap) {
      list.innerHTML = "";
      snap.forEach(function (d) {
        var name = d.data().name;
        list.appendChild(E("button", { type: "button", class: "btn small", text: name, onclick: function () {
          msg(note, "Linking…");
          setLink({ p: u.uid, c: d.id, name: name, mode: "parent" }, fbw).catch(function (e) { msg(note, friendly(e), true); });
        } }));
      });
      var nm = E("input", { class: "cloud-name", maxlength: "30", placeholder: "Child's name", "aria-label": "New child's name" });
      list.appendChild(E("div", { class: "cloud-row" }, [nm, E("button", { type: "button", class: "btn primary small", text: "Add and use", onclick: function () {
        var name = nm.value.trim(); if (!name) { nm.focus(); return; }
        msg(note, "Linking…");
        fam.collection("children").add({ name: name, members: {}, created: ts() }).then(function (ref) {
          return setLink({ p: u.uid, c: ref.id, name: name, mode: "parent" }, fbw);
        }).catch(function (e) { msg(note, friendly(e), true); });
      } })]));
    }).catch(function (e) { list.textContent = ""; msg(note, friendly(e), true); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { mountChip(); start(); });
  else { mountChip(); start(); }
})();
