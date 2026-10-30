/*
  Parent page (parent.html). A parent signs in with Google, adds their children, links each
  child's phone or computer with a short code, and then sees:
  - totals: pearls, questions solved, day streak, last active
  - the child's sea (drawn by aquarium.js, read only)
  - minutes and questions per day for the last 14 days
  - exercises where the child needed help or has not finished
  - progress for every maths chapter and science lesson

  Lesson titles and question lists come from the lesson files themselves: this page reads the
  <script> list of index.html and science.html and loads the same files (without starting the
  engines), so a new lesson shows up here with no extra work.
*/
(function () {
  "use strict";
  var Cloud = window.AngleCloud, app = document.getElementById("app"), who = document.getElementById("who");
  var fb = null, user = null, kids = [], lessonsReady = null;
  var KID_COLORS = ["#2a78d6", "#d6532a", "#1d8a4f", "#8a4fd6", "#c2185b", "#00838f"];

  function E(tag, a, kids) {
    var n = document.createElement(tag);
    for (var k in a || {}) {
      if (k === "text") n.textContent = a[k];
      else if (k === "html") n.innerHTML = a[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), a[k]);
      else if (a[k] != null && a[k] !== false) n.setAttribute(k, a[k]);
    }
    (kids || []).forEach(function (c) { if (c != null && c !== false) n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c); });
    return n;
  }
  var NS = "http://www.w3.org/2000/svg";
  function S(tag, a, kids) {
    var n = document.createElementNS(NS, tag);
    for (var k in a || {}) if (a[k] != null) n.setAttribute(k, a[k]);
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function plain(s) { return String(s || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim(); }
  function cut(s, n) { s = plain(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function colorOf(id) { var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return KID_COLORS[h % KID_COLORS.length]; }
  function when(t) {
    if (!t) return "Not active yet";
    var ms = t.toMillis ? t.toMillis() : t, s = (Date.now() - ms) / 1000;
    if (s < 120) return "Active just now";
    if (s < 3600) return "Active " + Math.round(s / 60) + " minutes ago";
    if (s < 86400) return "Active " + Math.round(s / 3600) + " hour" + (s < 5400 ? "" : "s") + " ago";
    var d = Math.round(s / 86400);
    return "Active " + (d === 1 ? "yesterday" : d + " days ago");
  }
  function msgEl() { return E("p", { class: "msg", hidden: "hidden" }); }
  function say(el, text, bad) { el.textContent = text; el.className = "msg" + (bad ? " bad" : ""); el.hidden = !text; }
  function go(hash) { if (location.hash !== hash) location.hash = hash; else route(); }

  /* ---------- lesson files, loaded the same way the student pages load them ---------- */
  function loadLessons() {
    if (lessonsReady) return lessonsReady;
    function srcs(page) {
      return fetch(page, { cache: "no-cache" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (html) {
        var out = [], re = /<script\s+src="([^"]+)"/g, m;
        while ((m = re.exec(html))) if (!/^(cloud\/|https?:|\/\/)/.test(m[1]) && m[1] !== "aquarium.js") out.push(m[1]);
        return out;
      }, function () { return []; });
    }
    function addScript(src) {
      return new Promise(function (ok) {
        var s = document.createElement("script"); s.src = src; s.async = false;
        s.onload = ok; s.onerror = ok; document.head.appendChild(s);
      });
    }
    lessonsReady = Promise.all([srcs("index.html"), srcs("science.html")]).then(function (lists) {
      var seen = {}, all = lists[0].concat(lists[1], ["aquarium.js"]).filter(function (s) { return seen[s] ? false : (seen[s] = 1); });
      return Promise.all(all.map(addScript));
    });
    return lessonsReady;
  }
  function mathsLessons() { return (window.Practice && window.Practice.lessons) || []; }
  function sciLessons() { return (window.Science && window.Science.lessons) || []; }
  function chapterNum(l) { var m = /(\d+)\.\d+/.exec(l.title || ""); return m ? +m[1] : null; }

  /* ---------- reading one child's saved progress ---------- */
  function recOf(store, subj, l) { return store[(subj === "Maths" ? "practice:" : "science:") + l.id] || { q: {} }; }
  function statsOf(store, subj, l) {
    var p = recOf(store, subj, l), q = p.q || {}, done = 0, pts = 0, tried = 0, total = 0;
    (l.sections || []).forEach(function (s) {
      (s.questions || []).forEach(function (x) {
        total++;
        var r = q[x.id]; if (!r) return;
        if (r.solved) { done++; pts += r.points || 0; }
        if (r.solved || r.attempts || r.help) tried++;
      });
    });
    return { done: done, total: total, points: pts, tried: tried };
  }
  function secStats(store, subj, l, sec) {
    var q = recOf(store, subj, l).q || {}, d = 0, t = 0;
    (sec.questions || []).forEach(function (x) { if (q[x.id] && q[x.id].solved) d++; if (q[x.id] && (q[x.id].attempts || q[x.id].help || q[x.id].solved)) t++; });
    return { done: d, total: (sec.questions || []).length, tried: t };
  }
  function qLabel(sec, x) {
    var m = /^q?(\d+)([a-z]+)?$/i.exec(x.id);
    return m ? m[1] + (m[2] ? "(" + m[2] + ")" : "") : x.id;
  }

  // Exercises where the child struggled: tried but not solved, asked for help often, or needed many tries.
  function weakSpots(store) {
    var out = [];
    [["Maths", mathsLessons()], ["Science", sciLessons()]].forEach(function (pair) {
      pair[1].forEach(function (l) {
        var q = recOf(store, pair[0], l).q || {};
        (l.sections || []).forEach(function (sec) {
          var items = [], score = 0, open = 0, help = 0, many = 0;
          (sec.questions || []).forEach(function (x) {
            var r = q[x.id]; if (!r) return;
            var unsolved = !r.solved && (r.attempts || r.help), h = (r.help || 0) >= 2, a = (r.attempts || 0) >= 3;
            if (!unsolved && !h && !a) return;
            if (unsolved) open++; if (h) help++; if (a) many++;
            score += (unsolved ? 3 : 0) + (r.help || 0) + (r.attempts || 0) / 2;
            items.push({ label: qLabel(sec, x), text: x.prompt || x.text || x.q || "", unsolved: unsolved, help: r.help || 0, attempts: r.attempts || 0 });
          });
          if (items.length) out.push({ subj: pair[0], lesson: l, sec: sec, items: items, score: score, open: open, help: help, many: many });
        });
      });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }

  /* ---------- Firebase helpers ---------- */
  function fam() { return fb.firestore().collection("families").doc(user.uid); }
  function kidRef(id) { return fam().collection("children").doc(id); }
  function loadKids() {
    return fam().collection("children").get().then(function (snap) {
      kids = [];
      snap.forEach(function (d) { var x = d.data(); x.id = d.id; kids.push(x); });
      kids.sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });
      return kids;
    });
  }
  function recentDays(id, n) {
    var from = new Date(); from.setDate(from.getDate() - (n - 1));
    return kidRef(id).collection("days").where("d", ">=", dayStr(from)).get().then(function (snap) {
      var by = {}; snap.forEach(function (d) { var x = d.data(); by[x.d || d.id] = x; }); return by;
    });
  }
  function loadStore(id) {
    return kidRef(id).collection("store").get().then(function (snap) {
      var st = {};
      snap.forEach(function (d) { var x = d.data(); try { st[x.k] = JSON.parse(x.v); } catch (e) {} });
      return st;
    });
  }

  /* ---------- pages ---------- */
  function route() {
    if (window.SeaView) window.SeaView.stop();
    if (!Cloud || !Cloud.enabled) return showNoConfig();
    if (!user) return showSignedOut();
    var m = /^#child=(.+)$/.exec(location.hash);
    if (m) return showChild(decodeURIComponent(m[1]));
    showHome();
  }

  function showNoConfig() {
    app.innerHTML = "";
    app.appendChild(E("div", { class: "panel stack" }, [
      E("p", { class: "eyebrow", text: "For parents" }),
      E("h1", { text: "Cloud save is not turned on yet" }),
      E("p", { class: "lede", text: "This page shows a child's progress once the site is connected to a free Firebase project. The steps are in cloud/SETUP.md. Until then, the maths and science pages keep progress on each device only." })
    ]));
  }

  function googleIcon() {
    return S("svg", { viewBox: "0 0 48 48", "aria-hidden": "true" }, [
      S("path", { fill: "#EA4335", d: "M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.2C12.5 13.6 17.8 9.5 24 9.5z" }),
      S("path", { fill: "#4285F4", d: "M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" }),
      S("path", { fill: "#FBBC05", d: "M10.6 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.2C1 16.6 0 20.2 0 24s1 7.4 2.7 10.8l7.9-6.1z" }),
      S("path", { fill: "#34A853", d: "M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z" })
    ]);
  }
  function showSignedOut() {
    app.innerHTML = "";
    var note = msgEl();
    var btn = E("button", { type: "button", class: "btn primary g-btn", onclick: function () {
      btn.disabled = true; say(note, "Opening Google sign-in…");
      Cloud.signInGoogle(fb).catch(function (e) { btn.disabled = false; say(note, Cloud.friendly(e), true); });
    } }, [googleIcon(), "Sign in with Google"]);
    app.appendChild(E("div", { class: "hero" }, [
      E("div", {}, [
        E("p", { class: "eyebrow", text: "For parents" }),
        E("h1", { text: "See how your child's practice is going" }),
        E("ul", {}, [
          E("li", { text: "How many questions they solved, and on which days" }),
          E("li", { text: "Which exercises they found hard or have not finished" }),
          E("li", { text: "Their sea world, with every chapter animal they have grown" })
        ]),
        btn, note,
        E("p", { class: "lede", text: "Only you and your child's linked devices can see their progress." })
      ]),
      E("div", { class: "hero-art", "aria-hidden": "true", text: "🐠🐬\n🦜🦉" })
    ]));
  }

  function showHome() {
    app.innerHTML = "";
    app.appendChild(E("p", { class: "eyebrow", text: "For parents" }));
    app.appendChild(E("h1", { text: "Your children" }));
    var grid = E("div", { class: "kids" }, [E("p", { class: "loading", text: "Loading…" })]);
    app.appendChild(grid);
    var note = msgEl();
    var name = E("input", { maxlength: "30", placeholder: "Child's name", "aria-label": "Child's name", autocomplete: "off" });
    var add = E("button", { type: "button", class: "btn primary", text: "Add a child", onclick: function () {
      var n = name.value.trim(); if (!n) { name.focus(); return; }
      add.disabled = true;
      fam().collection("children").add({ name: n, members: {}, created: Cloud.ts() }).then(function (ref) {
        go("#child=" + encodeURIComponent(ref.id));
      }).catch(function (e) { add.disabled = false; say(note, Cloud.friendly(e), true); });
    } });
    name.addEventListener("keydown", function (e) { if (e.key === "Enter") add.click(); });
    app.appendChild(E("div", { class: "add-kid" }, [name, add]));
    app.appendChild(note);

    loadKids().then(function () {
      grid.innerHTML = "";
      if (!kids.length) {
        grid.appendChild(E("div", { class: "panel" }, [E("h2", { text: "Add your first child" }),
          E("p", { class: "lede", text: "Type their name below. Then link the phone or computer they practise on, and their progress appears here." })]));
        return;
      }
      kids.forEach(function (k) {
        var week = E("div", { class: "kid-week" }, [E("span", { text: "…" })]);
        grid.appendChild(E("button", { type: "button", class: "kid", onclick: function () { go("#child=" + encodeURIComponent(k.id)); } }, [
          E("div", { class: "kid-top" }, [E("span", { class: "avatar", style: "--kc:" + colorOf(k.id), text: String(k.name || "?").charAt(0).toUpperCase() }),
            E("div", {}, [E("div", { class: "kid-name", text: k.name }), E("div", { class: "kid-when" }, [isRecent(k.lastActive) ? E("span", { class: "dot-on" }) : null, when(k.lastActive)])])]),
          week
        ]));
        recentDays(k.id, 7).then(function (by) {
          var mins = 0, solved = 0; Object.keys(by).forEach(function (d) { mins += by[d].minutes || 0; solved += by[d].solved || 0; });
          week.innerHTML = "";
          week.appendChild(E("span", {}, [E("b", { text: commas(solved) }), " solved this week"]));
          week.appendChild(E("span", {}, [E("b", { text: String(mins) }), " minutes"]));
          if (!Object.keys(k.members || {}).length && !k.lastActive) week.appendChild(E("span", { text: "No device linked yet" }));
        }).catch(function () { week.textContent = ""; });
      });
    }).catch(function (e) { grid.innerHTML = ""; say(note, Cloud.friendly(e), true); });
  }
  function isRecent(t) { return t && t.toMillis && Date.now() - t.toMillis() < 10 * 60000; }

  function showChild(id) {
    app.innerHTML = "";
    app.appendChild(E("button", { type: "button", class: "link-btn", text: "← All children", onclick: function () { go("#"); } }));
    var body = E("div", { class: "stack" }, [E("p", { class: "loading", text: "Loading progress…" })]);
    app.appendChild(body);
    Promise.all([kidRef(id).get(), loadStore(id), recentDays(id, 14), loadLessons()]).then(function (r) {
      if (!r[0].exists) { body.innerHTML = ""; body.appendChild(E("p", { text: "This child was not found." })); return; }
      var k = r[0].data(); k.id = id;
      drawChild(body, k, r[1], r[2]);
    }).catch(function (e) { body.innerHTML = ""; var n = msgEl(); body.appendChild(n); say(n, Cloud.friendly(e), true); });
  }

  function drawChild(body, k, store, days) {
    body.innerHTML = "";
    var st = { stats: function (l, subj) { return statsOf(store, subj, l); } };
    var all = mathsLessons().map(function (l) { return statsOf(store, "Maths", l); }).concat(sciLessons().map(function (l) { return statsOf(store, "Science", l); }));
    var pearls = all.reduce(function (s, x) { return s + x.points; }, 0), solved = all.reduce(function (s, x) { return s + x.done; }, 0);
    if (!all.length) { // lesson files did not load: fall back to the summary the sea keeps
      var sum = store["sea:summary"] || {};
      Object.keys(sum).forEach(function (c) { pearls += sum[c].points || 0; solved += sum[c].done || 0; });
    }
    var streak = (function () {
      var set = {}, n = 0, d = new Date();
      (store["practice:days"] || []).forEach(function (x) { set[x] = 1; });
      if (!set[dayStr(d)]) d.setDate(d.getDate() - 1);
      while (set[dayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
      return n;
    })();

    // header and actions
    var note = msgEl(), pairBox = E("div", {}), renameBox = E("div", {});
    var linked = Object.keys(k.members || {}).length;
    body.appendChild(E("div", { class: "d-head" }, [
      E("div", { class: "kid-top" }, [E("span", { class: "avatar", style: "--kc:" + colorOf(k.id), text: String(k.name || "?").charAt(0).toUpperCase() }),
        E("div", {}, [E("h1", { text: k.name }), E("div", { class: "kid-when" }, [isRecent(k.lastActive) ? E("span", { class: "dot-on" }) : null,
          when(k.lastActive) + " · " + (linked ? linked + " linked device" + (linked === 1 ? "" : "s") : "no device linked with a code")])])]),
      E("div", { class: "d-actions" }, [
        E("button", { type: "button", class: "btn primary small", text: "Link a device", onclick: function () { makeCode(k, pairBox, note); } }),
        E("button", { type: "button", class: "btn small ghost", text: "Rename", onclick: function () { renameForm(k, renameBox, note); } }),
        linked ? E("button", { type: "button", class: "btn small ghost", text: "Unlink devices", onclick: function () {
          if (!confirm("Unlink all of " + k.name + "'s devices? Their progress stays saved here. To link a device again, make a new code.")) return;
          kidRef(k.id).update({ members: {} }).then(function () { showChild(k.id); }, function (e) { say(note, Cloud.friendly(e), true); });
        } }) : null,
        E("button", { type: "button", class: "btn small danger", text: "Remove", onclick: function () { removeKid(k, note); } })
      ])
    ]));
    body.appendChild(note);
    body.appendChild(renameBox);
    body.appendChild(pairBox);
    if (!linked && !Object.keys(store).length) makeCode(k, pairBox, note, true);

    body.appendChild(E("div", { class: "tiles" }, [
      tile(commas(pearls), "pearls (points)"), tile(commas(solved), "questions solved"),
      tile(streak ? "🔥 " + streak : "0", streak === 1 ? "day streak" : "day streak"),
      tile(String(sumDays(days, "minutes", 7)), "minutes in the last 7 days")
    ]));

    // the sea
    if (window.SeaView) {
      try { body.appendChild(window.SeaView.render({ store: store, name: k.name, stats: mathsLessons().length || sciLessons().length ? st.stats : null })); }
      catch (e) { if (window.console) console.error(e); }
    }

    // activity
    var charts = E("div", { class: "charts" }, [
      barChart(days, "minutes", "Minutes of practice", "min", "var(--bar)"),
      barChart(days, "solved", "Questions solved", "solved", "var(--bar-2)")
    ]);
    body.appendChild(E("section", { class: "panel" }, [E("div", { class: "sec-h" }, [E("h2", { text: "Last 14 days" }),
      E("p", { text: "A minute counts when the page was open and in use." })]), charts]));

    // weak spots
    var ws = weakSpots(store).slice(0, 8);
    var wl = E("section", { class: "panel" }, [E("div", { class: "sec-h" }, [E("h2", { text: "Where a little help would go far" }),
      E("p", { text: "Exercises with unfinished questions, or where help was used a lot." })])]);
    if (!ws.length) wl.appendChild(E("p", { class: "empty-note", text: mathsLessons().length ? "Nothing here yet. Questions that were hard will show up here." : "Lesson details could not be loaded, so this list is not available." }));
    else wl.appendChild(E("ul", { class: "weak" }, ws.map(function (w) {
      var bits = [];
      if (w.open) bits.push(w.open + " not solved yet");
      if (w.help) bits.push(w.help + " needed help twice or more");
      if (w.many) bits.push(w.many + " took 3 or more tries");
      var where = w.subj === "Maths" ? (w.lesson.unit ? w.lesson.unit + " · " : "") + w.lesson.title : "Science · " + w.lesson.title;
      return E("li", {}, [
        E("div", { class: "w-t" }, [where + " · " + (w.sec.title || "")]),
        E("div", { class: "w-s", text: bits.join(" · ") }),
        E("ul", { class: "w-q" }, w.items.slice(0, 3).map(function (it) {
          return E("li", {}, ["Q" + it.label + ": " + cut(it.text, 90), it.unsolved ? E("span", { class: "tag", text: "not solved" }) : it.help >= 2 ? E("span", { class: "tag", text: "help ×" + it.help }) : E("span", { class: "tag", text: it.attempts + " tries" })]);
        }))
      ]);
    })));
    body.appendChild(wl);

    // chapter progress
    body.appendChild(progressPanel(store));
  }
  function tile(n, l) { return E("div", { class: "tile" }, [E("div", { class: "tile-n", text: n }), E("div", { class: "tile-l", text: l })]); }
  function sumDays(days, f, n) {
    var d = new Date(), s = 0;
    for (var i = 0; i < n; i++) { var x = days[dayStr(d)]; if (x) s += x[f] || 0; d.setDate(d.getDate() - 1); }
    return s;
  }

  // One measure per chart, 14 bars, hover or tap a bar for its value.
  function barChart(days, f, title, unit, color) {
    var W = 420, H = 150, L = 28, B = 22, T = 8, n = 14, vals = [], labels = [], d = new Date();
    d.setDate(d.getDate() - (n - 1));
    for (var i = 0; i < n; i++) { var x = days[dayStr(d)]; vals.push(x ? x[f] || 0 : 0); labels.push(new Date(d)); d.setDate(d.getDate() + 1); }
    var max = Math.max.apply(null, vals), top = max <= 4 ? 4 : max <= 10 ? 10 : Math.ceil(max / 10) * 10;
    var bw = (W - L) / n, sv = S("svg", { viewBox: "0 0 " + W + " " + (H + B + T), role: "img", "aria-label": title + " per day for 14 days" });
    [0, 0.5, 1].forEach(function (g) {
      var y = T + H - H * g;
      sv.appendChild(S("line", { class: "gridl", x1: L, x2: W, y1: y, y2: y }));
      sv.appendChild(S("text", { class: "axis", x: L - 6, y: y + 4, "text-anchor": "end" }, [String(Math.round(top * g))]));
    });
    var wrap = E("div", { class: "chart" }), tip = E("div", { class: "tip", hidden: "hidden" });
    var total = vals.reduce(function (a, b) { return a + b; }, 0);
    vals.forEach(function (v, i) {
      var h = v ? Math.max(3, H * v / top) : 0, x = L + i * bw + 3, w = bw - 6, y = T + H - h;
      var dl = labels[i], name = dl.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
      var hit = S("rect", { class: "hit", x: L + i * bw, y: T, width: bw, height: H, tabindex: "0", "aria-label": name + ": " + v + " " + unit });
      function show() { tip.textContent = name + ": " + v + " " + unit; tip.style.left = (100 * (L + i * bw + bw / 2) / W) + "%"; tip.style.top = (100 * Math.max(y, T + 10) / (H + B + T)) + "%"; tip.hidden = false; }
      hit.addEventListener("mouseenter", show); hit.addEventListener("focus", show); hit.addEventListener("click", show);
      hit.addEventListener("mouseleave", function () { tip.hidden = true; }); hit.addEventListener("blur", function () { tip.hidden = true; });
      sv.appendChild(hit);
      // rounded top, square bottom on the baseline
      if (h) { var r = Math.min(4, h / 2, w / 2); sv.appendChild(S("path", { class: "bar", fill: color, "pointer-events": "none",
        d: "M" + x + " " + (T + H) + "V" + (y + r) + "Q" + x + " " + y + " " + (x + r) + " " + y + "H" + (x + w - r) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + r) + "V" + (T + H) + "Z" })); }
      if (i % 2 === 1 || n <= 7) sv.appendChild(S("text", { class: "axis", x: L + i * bw + bw / 2, y: T + H + 16, "text-anchor": "middle" }, [i === n - 1 ? "Today" : String(dl.getDate())]));
    });
    wrap.appendChild(E("h3", { text: title }));
    wrap.appendChild(E("p", { class: "sum", text: commas(total) + " " + (unit === "min" ? "minutes" : "questions") + " in 14 days" }));
    wrap.appendChild(sv); wrap.appendChild(tip);
    return wrap;
  }

  function progressPanel(store) {
    var panel = E("section", { class: "panel" }, [E("div", { class: "sec-h" }, [E("h2", { text: "Progress by chapter" }),
      E("p", { text: "Tap a chapter to see each exercise." })])]);
    var ms = mathsLessons(), ss = sciLessons();
    if (!ms.length && !ss.length) {
      var sum = store["sea:summary"] || {};
      var keys = Object.keys(sum).sort(function (a, b) { return (sum[a].order || 0) - (sum[b].order || 0); });
      if (!keys.length) panel.appendChild(E("p", { class: "empty-note", text: "No progress yet." }));
      keys.forEach(function (c) { var x = sum[c]; panel.appendChild(row(x.title, "", x.done, x.total, x.subject === "Science")); });
      return panel;
    }
    if (ms.length) {
      panel.appendChild(E("h3", { class: "subj-h", text: "📐 Maths" }));
      var map = {}, order = [];
      ms.forEach(function (l) {
        var n = chapterNum(l), key = n != null ? "c" + n : "u" + (l.unit || l.title);
        if (!map[key]) { map[key] = { num: n, unit: l.unit || l.title, lessons: [] }; order.push(map[key]); }
        map[key].lessons.push(l);
      });
      order.sort(function (a, b) { return (a.num == null ? 999 : a.num) - (b.num == null ? 999 : b.num); });
      order.forEach(function (c) {
        var tot = { done: 0, total: 0, tried: 0 };
        var rows = c.lessons.map(function (l) {
          var s = statsOf(store, "Maths", l); tot.done += s.done; tot.total += s.total; tot.tried += s.tried;
          return E("div", { class: "row" }, [E("span", { text: l.title }), meter(s.done, s.total), E("span", { class: "chap-n", text: s.done + "/" + s.total })]);
        });
        panel.appendChild(chap((c.num != null ? "Chapter " + c.num + " · " : "") + c.unit, c.lessons.length + " exercise" + (c.lessons.length === 1 ? "" : "s"), tot, rows, false));
      });
    }
    if (ss.length) {
      panel.appendChild(E("h3", { class: "subj-h", text: "🔬 Science" }));
      ss.forEach(function (l) {
        var s = statsOf(store, "Science", l), seen = (recOf(store, "Science", l).seen) || {};
        var nSeen = (l.learn || []).filter(function (x) { return seen[x.id]; }).length;
        var rows = [E("div", { class: "row" }, [E("span", { text: "Learn pages read" }), meter(nSeen, (l.learn || []).length, true), E("span", { class: "chap-n", text: nSeen + "/" + (l.learn || []).length })])]
          .concat((l.sections || []).map(function (sec) {
            var x = secStats(store, "Science", l, sec);
            return E("div", { class: "row" }, [E("span", { text: sec.title }), meter(x.done, x.total, true), E("span", { class: "chap-n", text: x.done + "/" + x.total })]);
          }));
        panel.appendChild(chap(l.title, (l.sections || []).length + " exercises", s, rows, true));
      });
    }
    return panel;
  }
  function meter(d, t, sci) { return E("span", { class: "meter" + (sci ? " sci" : ""), role: "img", "aria-label": d + " of " + t }, [E("span", { style: "width:" + (t ? Math.round(100 * d / t) : 0) + "%" })]); }
  function chap(title, sub, s, rows, sci) {
    return E("details", { class: "chap" + (s.tried ? "" : " cold") }, [
      E("summary", {}, [E("span", { class: "chap-t" }, [title, E("small", { text: s.tried ? sub : sub + " · not started" })]), meter(s.done, s.total, sci), E("span", { class: "chap-n", text: s.done + "/" + s.total })]),
      E("div", { class: "chap-ex" }, rows)
    ]);
  }
  function row(title, sub, d, t, sci) { return E("div", { class: "chap-ex" }, [E("div", { class: "row" }, [E("span", { text: title }), meter(d, t, sci), E("span", { class: "chap-n", text: d + "/" + t })])]); }

  /* ---------- actions ---------- */
  var CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function newCode() {
    var a = new Uint32Array(6), s = "";
    (window.crypto || window.msCrypto).getRandomValues(a);
    for (var i = 0; i < 6; i++) s += CODE_CHARS[a[i] % CODE_CHARS.length];
    return s;
  }
  function makeCode(k, box, note, soft) {
    box.innerHTML = "";
    var tries = 0;
    function attempt() {
      var code = newCode(), exp = new Date(Date.now() + 30 * 60000);
      return fb.firestore().collection("pairs").doc(code).set({ p: user.uid, c: k.id, name: k.name, exp: window.firebase.firestore.Timestamp.fromDate(exp) })
        .then(function () { return { code: code, exp: exp }; }, function (e) { if (++tries < 4 && /permission-denied/.test(e.code || "")) return attempt(); throw e; });
    }
    attempt().then(function (r) {
      box.innerHTML = "";
      box.appendChild(E("div", { class: "panel pair" }, [
        E("h2", { text: soft ? "Link " + k.name + "'s device" : "Code for " + k.name + "'s device" }),
        E("div", { class: "pair-code", text: r.code }),
        E("ol", {}, [
          E("li", { text: "On the phone or computer " + k.name + " uses, open Angle Quest (maths or science page)." }),
          E("li", { text: "Press the ☁️ button at the top (it says Save progress), then type this code under \"I have a code\"." }),
          E("li", { text: "Done. Progress already on that device comes here too." })
        ]),
        E("p", { class: "lede", text: "The code works once, until " + r.exp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + "." })
      ]));
    }).catch(function (e) { say(note, Cloud.friendly(e), true); });
  }
  function renameForm(k, box, note) {
    box.innerHTML = "";
    var inp = E("input", { value: k.name, maxlength: "30", "aria-label": "New name" });
    var save = E("button", { type: "button", class: "btn primary small", text: "Save", onclick: function () {
      var n = inp.value.trim(); if (!n) return;
      kidRef(k.id).update({ name: n }).then(function () { showChild(k.id); }, function (e) { say(note, Cloud.friendly(e), true); });
    } });
    box.appendChild(E("div", { class: "rename" }, [inp, save, E("button", { type: "button", class: "btn small ghost", text: "Cancel", onclick: function () { box.innerHTML = ""; } })]));
    inp.focus();
  }
  function removeKid(k, note) {
    if (!confirm("Remove " + k.name + " and all of their saved progress from the cloud? Progress on their own device stays there.")) return;
    var ref = kidRef(k.id);
    Promise.all(["store", "days"].map(function (c) {
      return ref.collection(c).get().then(function (snap) {
        var b = fb.firestore().batch(), n = 0, jobs = [];
        snap.forEach(function (d) { b.delete(d.ref); if (++n === 400) { jobs.push(b.commit()); b = fb.firestore().batch(); n = 0; } });
        jobs.push(b.commit()); return Promise.all(jobs);
      });
    })).then(function () { return ref.delete(); }).then(function () { go("#"); }, function (e) { say(note, Cloud.friendly(e), true); });
  }

  /* ---------- start ---------- */
  function showWho() {
    who.innerHTML = "";
    if (!user) return;
    who.appendChild(E("span", { text: user.email || user.displayName || "" }));
    who.appendChild(E("button", { type: "button", class: "btn small ghost", text: "Sign out", onclick: function () { fb.auth().signOut(); } }));
  }
  window.addEventListener("hashchange", route);
  if (!Cloud || !Cloud.enabled) { route(); return; }
  loadLessons();
  Cloud.load().then(function (f) {
    fb = f;
    fb.auth().onAuthStateChanged(function (u) {
      user = u && !u.isAnonymous ? u : null;
      if (user) fam().set({ email: user.email || "", name: user.displayName || "", seen: Cloud.ts() }, { merge: true }).catch(function () {});
      showWho(); route();
    });
  }).catch(function (e) {
    app.innerHTML = "";
    var n = msgEl(); app.appendChild(n); say(n, "Could not reach Firebase. " + Cloud.friendly(e), true);
  });
})();
