/*
  Fish sea: the motivation dashboard on the home page.
  One fish per chapter (science lessons are birds in the sky). A fish grows a little with every solved
  question in its chapter. Halfway it turns into its own species, picked at random once and saved:
  small chapters become small animals (clownfish, seahorse ...), big chapters big ones (dolphin, whale ...),
  and bigger chapters also grow bigger. Stages: Tiny fry, Little fish, Young <species>, Big <species>,
  King <species> (with a crown).
  Points are "pearls". Pearls unlock sea friends (shell, crab, turtle ...).
  Works on both pages. On the maths page it reads Practice (engine.js); on the science page it reads
  Science (science.js). Each page saves a short summary of its chapters in "sea:summary", so the
  other page can show those fish too. One sea, one set of pearls, for both subjects.
*/
(function () {
  "use strict";
  var P = window.Practice || null, SC = window.Science || null; if (!P && !SC) return;
  var NS = "http://www.w3.org/2000/svg";

  function S(tag, a, kids) {
    var n = document.createElementNS(NS, tag);
    for (var k in a || {}) if (a[k] != null) n.setAttribute(k, a[k]);
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function E(tag, a, kids) {
    var n = document.createElement(tag);
    for (var k in a || {}) {
      if (k === "text") n.textContent = a[k];
      else if (k === "html") n.innerHTML = a[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), a[k]);
      else if (a[k] != null && a[k] !== false) n.setAttribute(k, a[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null");
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function f1(n) { return Math.round(n * 10) / 10; }
  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  /* ---------- fish and friends ---------- */
  var NAMES = ["Bubbles", "Finn", "Splash", "Pearl", "Ziggy", "Marina", "Pip", "Goldie", "Sunny", "Wiggles", "Blue", "Coco", "Dash", "Lulu", "Momo", "Kiki", "Ripple", "Tiki", "Zuzu", "Olly", "Neptune", "Sandy", "Pebble", "Coral", "Sprout", "Mossy", "Clover", "Rocky", "Breeze", "Sunbeam"];
  // [body, fins, belly, pattern]
  var COLORS = [
    ["#ff8a3d", "#ff5f1f", "#ffe0c2", "#ffffff"],
    ["#ff6fa8", "#e8458a", "#ffd6e6", "#ffffff"],
    ["#9b6bff", "#7a45f0", "#e4d8ff", "#ffd23f"],
    ["#20c4b0", "#0f9a8a", "#c9f4ee", "#ffffff"],
    ["#ffd23f", "#f5a300", "#fff3c4", "#ff8a3d"],
    ["#4aa8ff", "#1f7fe0", "#d6ebff", "#ffffff"],
    ["#ff5a5f", "#d93a40", "#ffd9da", "#ffd23f"],
    ["#5ccf6a", "#2fa540", "#d8f5dc", "#ffffff"],
    ["#c77dff", "#a04de8", "#f0dcff", "#ffffff"],
    ["#ff9e5e", "#f06d2a", "#ffe6d3", "#4aa8ff"]
  ];
  var STAGES = ["Tiny fry", "Little fish", "Growing fish", "Big fish", "King fish"];
  var BIRD_STAGES = ["Tiny chick", "Little bird", "Growing bird", "Big bird", "King bird"];
  function isBird(c) { return c.subject === "Science"; }
  function stageName(c, k) {
    k = k == null ? c.stage : k;
    if (k >= 2 && c.sp) return ["", "", "Young ", "Big ", "King "][k] + c.sp.name.toLowerCase();
    return (isBird(c) ? BIRD_STAGES : STAGES)[k];
  }
  function kind(c) { return isBird(c) ? "bird" : "fish"; }
  var STAGE_AT = [0, 0.25, 0.5, 0.75, 1];
  function stageOf(p) { return p >= 1 ? 4 : p >= 0.75 ? 3 : p >= 0.5 ? 2 : p >= 0.25 ? 1 : 0; }
  function sizeOf(p, tier) { return 0.42 + (TIER_MAX[tier || 0] - 0.42) * p; }

  // Sea friends, unlocked by pearls (points). kind: bed (sits on the sand), walk, swim, float, bob
  var FRIENDS = [
    { at: 30, e: "🐚", name: "Shell", kind: "bed", x: 0.12 },
    { at: 100, e: "⭐", name: "Starfish", kind: "bed", x: 0.83 },
    { at: 250, e: "🦀", name: "Crab", kind: "walk" },
    { at: 450, e: "🪸", name: "Coral", kind: "bed", x: 0.33 },
    { at: 750, e: "🦐", name: "Shrimp", kind: "swim", y: 0.25 },
    { at: 1100, e: "🦑", name: "Squid", kind: "bob", x: 0.62 },
    { at: 1600, e: "🪼", name: "Jellyfish", kind: "float" },
    { at: 2300, e: "🦦", name: "Otter", kind: "swim", y: 0.14 },
    { at: 3200, e: "🦞", name: "Lobster", kind: "walk" },
    { at: 4500, e: "⚓", name: "Anchor", kind: "bed", x: 0.22, big: true },
    { at: 6500, e: "🏰", name: "Castle", kind: "bed", x: 0.5, big: true },
    { at: 9000, e: "💎", name: "Treasure", kind: "bed", x: 0.72 },
    { at: 12000, e: "🐠", name: "Tropical fish", kind: "swim", y: 0.45 },
    { at: 16000, e: "🦭", name: "Seal", kind: "swim", y: 0.3 },
    { at: 20000, e: "🧜", name: "Mermaid", kind: "float", big: true }
  ];

  function chapterNum(l) { var m = /(\d+)\.\d+/.exec(l.title || ""); return m ? +m[1] : null; }
  function hashIdx(str, n) { var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h % n; }
  // Chapters from the engine on this page
  function liveChapters() {
    var out = [];
    if (P) {
      var map = {}, ms = [];
      P.lessons.forEach(function (l) {
        var n = chapterNum(l), key = n != null ? "c" + n : "u" + (l.unit || l.title);
        if (!map[key]) { map[key] = { subject: "Maths", num: n, unit: l.unit || l.title, lessons: [], done: 0, total: 0, points: 0, tried: 0, open: P.open, stats: P.stats }; ms.push(map[key]); }
        var c = map[key], st = P.stats(l);
        c.lessons.push(l); c.done += st.done; c.total += st.total; c.points += st.points; c.tried += st.tried || 0;
      });
      ms.sort(function (a, b) { return (a.num == null ? 999 : a.num) - (b.num == null ? 999 : b.num); });
      ms.forEach(function (c, i) {
        c.idx = i; c.label = c.num != null ? String(c.num) : String(i + 1); c.key = c.label; c.order = c.num != null ? c.num : 900 + i;
        c.title = (c.num != null ? "Chapter " + c.num : "Chapter") + " · " + c.unit; c.short = "Chapter " + c.label; c.page = "index.html";
        out.push(c);
      });
    }
    if (SC) {
      SC.lessons.forEach(function (l, i) {
        var st = SC.stats(l), m = /^(\d+(?:\.\d+)?)/.exec(l.title || "");
        out.push({ subject: "Science", key: "sci:" + l.id, label: m ? m[1] : "S" + (i + 1), idx: 20 + hashIdx(l.id, 10), order: 1000 + i,
          unit: l.title, title: "Science · " + l.title, short: "Science " + (m ? m[1] : l.title), page: "science.html", lessonId: l.id,
          lessons: [l], done: st.done, total: st.total, points: st.points, tried: st.tried || 0, open: SC.open, stats: SC.stats });
      });
    }
    return out;
  }
  function chapters() {
    var live = liveChapters(), sum = store("sea:summary") || {}, here = {};
    live.forEach(function (c) {
      here[c.key] = 1;
      sum[c.key] = { subject: c.subject, key: c.key, label: c.label, idx: c.idx, order: c.order, unit: c.unit, title: c.title, short: c.short, page: c.page, lessonId: c.lessonId || null,
        done: c.done, total: c.total, points: c.points, tried: c.tried };
    });
    store("sea:summary", sum);
    var out = live.slice();
    Object.keys(sum).forEach(function (k) { if (!here[k]) { var c = sum[k], o = {}; for (var x in c) o[x] = c[x]; o.lessons = []; o.remote = true; out.push(o); } });
    out.sort(function (a, b) { return a.order - b.order; });
    out.forEach(function (c) {
      c.started = c.tried > 0 || c.done > 0; c.p = c.total ? c.done / c.total : 0; c.stage = stageOf(c.p);
      c.name = NAMES[c.idx % NAMES.length]; c.col = COLORS[c.idx % COLORS.length];
      c.tier = tierOf(c); c.sp = speciesFor(c); c.revealed = !!(c.sp && c.stage >= 2);
      if (c.revealed) c.col = c.sp.col;
    });
    return out;
  }
  function totalPoints(chs) { return chs.reduce(function (s, c) { return s + c.points; }, 0); }
  function chapterOf(l, chs) { for (var i = 0; i < chs.length; i++) if (chs[i].lessons.indexOf(l) >= 0) return chs[i]; return null; }
  function toNext(c) {
    if (c.stage >= 4) return 0;
    return Math.max(1, Math.ceil(STAGE_AT[c.stage + 1] * c.total) - c.done);
  }
  function nextLesson(c) {
    if (c.remote || !c.lessons.length) return null;
    for (var i = 0; i < c.lessons.length; i++) { var st = c.stats(c.lessons[i]); if (st.done < st.total) return c.lessons[i]; }
    return c.lessons[0];
  }

  /* ---------- streak ---------- */
  function recordDay() {
    var days = store("practice:days") || [], t = dayStr(new Date());
    if (days[days.length - 1] !== t) { days.push(t); if (days.length > 120) days = days.slice(-120); store("practice:days", days); }
  }
  function streak() {
    var days = store("practice:days") || [], set = {}, n = 0, d = new Date();
    days.forEach(function (x) { set[x] = 1; });
    if (!set[dayStr(d)]) d.setDate(d.getDate() - 1);
    while (set[dayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------- drawing one fish (faces right, centre 0,0, about 100 long) ---------- */
  function drawFish(c) {
    var col = c.col, pat = c.idx % 3;
    var tail = S("g", {}, [S("path", { d: "M0 0 L-28 -24 Q-19 0 -28 24 Z", fill: col[1], "stroke-linejoin": "round" })]);
    var kids = [
      S("g", { transform: "translate(-40,0)" }, [tail]),
      S("path", { d: "M-20 -24 Q-4 -50 22 -25 Z", fill: col[1] }),
      S("path", { d: "M-12 24 Q-2 38 12 25 Z", fill: col[1] }),
      S("ellipse", { rx: 46, ry: 30, fill: col[0] }),
      S("ellipse", { cx: 6, cy: 13, rx: 32, ry: 13, fill: col[2], opacity: 0.85 })
    ];
    if (pat === 0) {
      kids.push(S("path", { d: "M-6 -27 Q1 0 -6 27", stroke: col[3], "stroke-width": 6, fill: "none", "stroke-linecap": "round", opacity: 0.75 }));
      kids.push(S("path", { d: "M-24 -21 Q-19 0 -24 21", stroke: col[3], "stroke-width": 5, fill: "none", "stroke-linecap": "round", opacity: 0.75 }));
    } else if (pat === 1) {
      [[-14, -12, 5], [-2, -18, 4], [-24, 2, 4], [-8, 4, 3]].forEach(function (s) { kids.push(S("circle", { cx: s[0], cy: s[1], r: s[2], fill: col[3], opacity: 0.8 })); });
    }
    kids.push(
      S("ellipse", { cx: -4, cy: -16, rx: 22, ry: 6, fill: "#fff", opacity: 0.28 }),
      S("path", { d: "M2 4 Q-12 16 2 20 Q8 12 2 4 Z", fill: col[1], opacity: 0.9 }),
      S("circle", { cx: 24, cy: -6, r: 10, fill: "#fff" }),
      S("circle", { cx: 26.5, cy: -5, r: 6, fill: "#1b2a3a" }),
      S("circle", { cx: 28.5, cy: -8, r: 2.2, fill: "#fff" }),
      S("ellipse", { cx: 23, cy: 9, rx: 5, ry: 3, fill: "#ff7aa2", opacity: 0.6 }),
      S("path", { d: "M33 7 Q37.5 11.5 42 6", stroke: "#1b2a3a", "stroke-width": 2.2, fill: "none", "stroke-linecap": "round" })
    );
    var crown = S("g", { transform: "translate(4,-32)", class: "sea-crown" }, [
      S("path", { d: "M-13 0 L-13 -15 L-6.5 -7 L0 -18 L6.5 -7 L13 -15 L13 0 Z", fill: "#ffd23f", stroke: "#d99a00", "stroke-width": 2, "stroke-linejoin": "round" }),
      S("circle", { cx: 0, cy: -5, r: 2.6, fill: "#ff5a5f" })
    ]);
    if (c.stage < 4) crown.style.display = "none";
    kids.push(crown);
    var body = S("g", {}, kids);
    return { body: body, tail: tail, crown: crown };
  }

  /* ---------- drawing one bird (faces right, centre 0,0, about 80 wide) ---------- */
  function drawBird(c) {
    var col = c.col;
    var wing = S("g", {}, [S("path", { d: "M2 -2 Q-18 -34 -30 -20 Q-20 -6 2 4 Z", fill: col[1] })]);
    var kids = [
      S("path", { d: "M-24 -2 L-44 -14 L-38 0 L-44 12 Z", fill: col[1], "stroke-linejoin": "round" }),
      S("ellipse", { rx: 30, ry: 24, fill: col[0] }),
      S("ellipse", { cx: 7, cy: 9, rx: 19, ry: 12, fill: col[2], opacity: 0.9 }),
      S("ellipse", { cx: -4, cy: -14, rx: 14, ry: 5, fill: "#fff", opacity: 0.3 }),
      S("g", { transform: "translate(-2,-2)" }, [wing]),
      S("circle", { cx: 14, cy: -7, r: 8, fill: "#fff" }),
      S("circle", { cx: 16, cy: -6.5, r: 5, fill: "#1b2a3a" }),
      S("circle", { cx: 17.5, cy: -9, r: 1.8, fill: "#fff" }),
      S("ellipse", { cx: 13, cy: 7, rx: 4.5, ry: 2.8, fill: "#ff7aa2", opacity: 0.6 }),
      S("path", { d: "M27 -3 L41 1 L27 6 Z", fill: "#ffb300", stroke: "#e08a00", "stroke-width": 1.2, "stroke-linejoin": "round" }),
      S("path", { d: "M-2 -23 q4 -10 10 -6 q-2 -8 6 -6", stroke: col[1], "stroke-width": 3, fill: "none", "stroke-linecap": "round" })
    ];
    var crown = S("g", { transform: "translate(2,-26)", class: "sea-crown" }, [
      S("path", { d: "M-12 0 L-12 -14 L-6 -7 L0 -17 L6 -7 L12 -14 L12 0 Z", fill: "#ffd23f", stroke: "#d99a00", "stroke-width": 2, "stroke-linejoin": "round" }),
      S("circle", { cx: 0, cy: -5, r: 2.4, fill: "#ff5a5f" })
    ]);
    if (c.stage < 4) crown.style.display = "none";
    kids.push(crown);
    return { body: S("g", {}, kids), tail: wing, crown: crown, bird: true };
  }

  /* ---------- grown-up species (revealed at the Growing stage) ----------
     Each draw() returns parts in the same frame as the baby: faces right, centre 0,0.
     tail = the part that moves (tail, fin or wing), wrapped so it turns around its joint.
     crown = where the King crown sits. up/dn = room above/below, hw = half length, back = length behind. */
  function eyeA(x, y, r) {
    return [S("circle", { cx: x, cy: y, r: r, fill: "#fff" }), S("circle", { cx: f1(x + r * 0.25), cy: f1(y + r * 0.1), r: f1(r * 0.62), fill: "#1b2a3a" }),
      S("circle", { cx: f1(x + r * 0.45), cy: f1(y - r * 0.28), r: f1(r * 0.24), fill: "#fff" })];
  }
  function cheekA(x, y, s) { return S("ellipse", { cx: x, cy: y, rx: 5 * (s || 1), ry: 3 * (s || 1), fill: "#ff7aa2", opacity: 0.6 }); }
  function smileA(x, y, w) { return S("path", { d: "M" + x + " " + y + " q" + w / 2 + " " + w / 2 + " " + w + " -1", stroke: "#1b2a3a", "stroke-width": 2.2, fill: "none", "stroke-linecap": "round" }); }
  function P_(d, fill, more) { var a = { d: d, fill: fill, "stroke-linejoin": "round" }; for (var k in more || {}) a[k] = more[k]; return S("path", a); }
  function joint(x, y, kids) { var t = S("g", {}, kids); return { wrap: S("g", { transform: "translate(" + x + "," + y + ")" }, [t]), t: t }; }
  function crownAt(x, y, sc) {
    return S("g", { transform: "translate(" + x + "," + y + ") scale(" + (sc || 1) + ")", class: "sea-crown" }, [
      S("path", { d: "M-13 0 L-13 -15 L-6.5 -7 L0 -18 L6.5 -7 L13 -15 L13 0 Z", fill: "#ffd23f", stroke: "#d99a00", "stroke-width": 2, "stroke-linejoin": "round" }),
      S("circle", { cx: 0, cy: -5, r: 2.6, fill: "#ff5a5f" })]);
  }
  var DK = "#1b2a3a";

  var SPECIES = {
    /* ---- sea: small ---- */
    clownfish: { name: "Clownfish", e: "🐠", col: ["#ff7a1a", "#e85d00", "#ffd3b0", "#fff"], hw: 62, up: 44, dn: 36, draw: function (c) {
      var o = { stroke: DK, "stroke-width": 2.5 }, tl = joint(-36, 0, [P_("M0 0 L-24 -20 Q-16 0 -24 20 Z", c[1], o)]);
      return { tail: tl, crown: [18, -24], kids: [tl.wrap,
        P_("M-22 -20 Q-8 -40 14 -22 Z", c[1], o), P_("M-10 20 Q0 34 10 21 Z", c[1], o),
        S("ellipse", { rx: 40, ry: 25, fill: c[0] }),
        P_("M18 -21 Q25 0 18 21 L9 23.5 Q16 0 9 -23.5 Z", "#fff", { stroke: DK, "stroke-width": 2 }),
        P_("M-6 -24.8 Q3 0 -6 24.8 L-17 23.8 Q-8 0 -17 -23.8 Z", "#fff", { stroke: DK, "stroke-width": 2 }),
        P_("M-31 -15.5 Q-26 0 -31 15.5 L-37 9 Q-35 0 -37 -9 Z", "#fff", { stroke: DK, "stroke-width": 2 }),
        S("ellipse", { cx: -2, cy: -16, rx: 18, ry: 5, fill: "#fff", opacity: 0.25 })]
        .concat(eyeA(28, -6, 8), [cheekA(24, 10), smileA(31, 8, 8)]) };
    } },
    pufferfish: { name: "Pufferfish", e: "🐡", col: ["#ffd65a", "#f0a500", "#fff6d6", "#c98a00"], hw: 50, up: 52, dn: 42, draw: function (c) {
      var tl = joint(-30, 0, [P_("M0 0 L-16 -14 Q-10 0 -16 14 Z", c[1])]), spikes = [];
      for (var a = 40; a <= 320; a += 24) {
        var r1 = a * Math.PI / 180, b1 = r1 - 0.1, b2 = r1 + 0.1;
        spikes.push(P_("M" + f1(-29 * Math.cos(b1)) + " " + f1(-29 * Math.sin(b1)) + " L" + f1(-39 * Math.cos(r1)) + " " + f1(-39 * Math.sin(r1)) + " L" + f1(-29 * Math.cos(b2)) + " " + f1(-29 * Math.sin(b2)) + " Z", c[1]));
      }
      return { tail: tl, crown: [0, -32], kids: [tl.wrap].concat(spikes, [
        S("circle", { r: 31, fill: c[0] }), S("ellipse", { cx: 4, cy: 13, rx: 22, ry: 14, fill: c[2] }),
        S("circle", { cx: -10, cy: -16, r: 3, fill: c[3], opacity: 0.6 }), S("circle", { cx: 2, cy: -22, r: 2.5, fill: c[3], opacity: 0.6 }), S("circle", { cx: -18, cy: -4, r: 2.5, fill: c[3], opacity: 0.6 }),
        S("ellipse", { cx: -6, cy: -18, rx: 13, ry: 5, fill: "#fff", opacity: 0.35 }),
        P_("M-4 4 Q-16 12 -4 18 Q2 12 -4 4 Z", c[1])],
        eyeA(14, -8, 9), [cheekA(14, 10), S("circle", { cx: 28, cy: 6, r: 3.6, fill: "#ff7aa2", stroke: DK, "stroke-width": 1.5 })]) };
    } },
    seahorse: { name: "Seahorse", e: "🌊", col: ["#ff9ec7", "#e8609b", "#ffe0ee", "#fff"], hw: 34, up: 62, dn: 50, draw: function (c) {
      var fin = joint(-14, 4, [P_("M0 -11 Q-15 -4 -12 7 Q-6 11 0 8 Z", c[1], { opacity: 0.9 })]), ridges = [];
      for (var y = -8; y <= 18; y += 6.5) ridges.push(S("path", { d: "M-1 " + y + " q5 2 10 0", stroke: c[1], "stroke-width": 1.5, fill: "none", opacity: 0.55 }));
      return { tail: fin, crown: [3, -37], kids: [
        S("path", { d: "M-5 20 C-10 40 4 50 11 42 C15 36 7 31 2 37", stroke: c[0], "stroke-width": 9, fill: "none", "stroke-linecap": "round" }),
        fin.wrap, S("ellipse", { cx: -3, cy: 3, rx: 13, ry: 22, fill: c[0] }), S("ellipse", { cx: 3, cy: 5, rx: 7, ry: 15, fill: c[2] })].concat(ridges, [
        P_("M10 -29 L31 -26 Q33 -22 31 -19 L10 -18 Z", c[0]), S("circle", { cx: 4, cy: -24, r: 12, fill: c[0] }),
        P_("M-5 -33 l3 -9 l4 7 l4 -9 l3 9", c[1]), S("ellipse", { cx: 0, cy: -30, rx: 6, ry: 2.5, fill: "#fff", opacity: 0.35 })],
        eyeA(8, -26, 6), [cheekA(10, -17, 0.8)]) };
    } },
    /* ---- sea: medium ---- */
    turtle: { name: "Turtle", e: "🐢", col: ["#3f8f3a", "#2e6e2a", "#f3e2a0", "#8fd16a"], hw: 64, up: 40, dn: 34, draw: function (c) {
      var skin = c[3], fl = joint(16, 10, [P_("M0 0 Q14 22 32 22 Q26 8 6 -4 Z", skin)]), hex = [];
      [[0, -16, 10], [-21, -8, 8], [21, -8, 8], [-11, -27, 6], [11, -27, 6]].forEach(function (h) {
        var pts = []; for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i + Math.PI / 6; pts.push(f1(h[0] + h[2] * Math.cos(a)) + "," + f1(h[1] + h[2] * Math.sin(a))); }
        hex.push(S("polygon", { points: pts.join(" "), fill: "#6dbb4f", stroke: c[1], "stroke-width": 1.5 }));
      });
      return { tail: fl, crown: [46, -14, 0.8], kids: [
        P_("M-26 10 Q-44 22 -34 28 Q-24 24 -18 14 Z", skin), P_("M-40 4 L-50 8 L-38 11 Z", skin),
        S("ellipse", { cx: 34, cy: 2, rx: 12, ry: 8, fill: skin }), S("circle", { cx: 46, cy: -2, r: 14, fill: skin }),
        P_("M-40 8 Q-38 -36 0 -36 Q38 -36 40 8 Z", c[0]), P_("M-43 8 L43 8 Q43 15 36 15 L-36 15 Q-43 15 -43 8 Z", c[2])].concat(hex, [
        S("ellipse", { cx: -6, cy: -28, rx: 16, ry: 4, fill: "#fff", opacity: 0.25 }), fl.wrap],
        eyeA(50, -5, 6), [cheekA(46, 6, 0.8), smileA(51, 4, 6)]) };
    } },
    octopus: { name: "Octopus", e: "🐙", col: ["#a982ff", "#7c4dff", "#e6dbff", "#fff"], hw: 40, up: 54, dn: 50, draw: function (c) {
      var arms = [];
      for (var i = 0; i < 6; i++) {
        var x0 = -25 + i * 10, w = i % 2 ? 6 : -6;
        arms.push(S("path", { d: "M" + x0 + " 2 q" + w + " 12 0 22 q" + (-w) + " 8 " + (w / 3) + " 14", stroke: c[i % 2 ? 1 : 0], "stroke-width": 8, fill: "none", "stroke-linecap": "round" }));
      }
      var tl = joint(0, 4, arms);
      return { tail: tl, crown: [2, -28], kids: [tl.wrap, P_("M-31 10 C-35 -40 35 -40 31 10 Z", c[0]),
        S("circle", { cx: -14, cy: -18, r: 3.5, fill: c[1], opacity: 0.5 }), S("circle", { cx: -4, cy: -24, r: 2.5, fill: c[1], opacity: 0.5 }), S("circle", { cx: -20, cy: -6, r: 2.5, fill: c[1], opacity: 0.5 }),
        S("ellipse", { cx: -6, cy: -22, rx: 14, ry: 5, fill: "#fff", opacity: 0.3 })]
        .concat(eyeA(6, -4, 8), eyeA(23, -3, 6.5), [cheekA(2, 8), cheekA(26, 8, 0.8), smileA(11, 7, 9)]) };
    } },
    swordfish: { name: "Swordfish", e: "🐟", col: ["#3a6fd8", "#244ea8", "#dfe8ff", "#9cc0ff"], hw: 84, up: 52, dn: 32, draw: function (c) {
      var tl = joint(-44, 0, [P_("M0 0 Q-10 -12 -20 -28 Q-12 -6 -12 0 Q-12 6 -20 28 Q-10 12 0 0 Z", c[1])]);
      return { tail: tl, crown: [14, -17], kids: [tl.wrap,
        P_("M-30 -12 Q-22 -50 8 -16 Z", c[1]), P_("M-6 15 Q2 30 10 15 Z", c[1]),
        P_("M38 -7 L92 -3 L38 2 Z", "#b8c4d0", { stroke: "#7b8b9c", "stroke-width": 1.5 }),
        S("ellipse", { rx: 46, ry: 18, fill: c[0] }), S("ellipse", { cx: 4, cy: 8, rx: 36, ry: 8, fill: c[2] }),
        S("path", { d: "M-30 -2 Q0 -8 30 -2", stroke: c[3], "stroke-width": 3, fill: "none", opacity: 0.6, "stroke-linecap": "round" })]
        .concat(eyeA(30, -5, 7), [cheekA(26, 7, 0.8), smileA(33, 5, 6)]) };
    } },
    /* ---- sea: big ---- */
    dolphin: { name: "Dolphin", e: "🐬", col: ["#6aa9d8", "#4a86b8", "#eaf4fb", "#fff"], hw: 82, up: 46, dn: 30, draw: function (c) {
      var tl = joint(-46, 4, [P_("M0 0 Q-8 -14 -20 -17 Q-12 -4 -14 0 Q-12 4 -20 17 Q-8 14 0 0 Z", c[1])]);
      return { tail: tl, crown: [18, -25], kids: [tl.wrap, P_("M-8 -20 Q-2 -42 12 -24 Z", c[1]),
        P_("M-47 2 C-30 -26 20 -30 40 -10 L60 -5 Q65 0 59 3 L40 5 C24 22 -20 20 -47 7 Z", c[0]),
        P_("M-30 9 C-10 17 20 16 38 5 L56 3 Q58 5 54 6 L38 8 C20 20 -16 19 -30 9 Z", c[2]),
        P_("M8 8 Q4 23 -7 25 Q1 14 0 6 Z", c[1]),
        S("ellipse", { cx: 4, cy: -17, rx: 20, ry: 4.5, fill: "#fff", opacity: 0.3 })]
        .concat(eyeA(32, -10, 6), [cheekA(32, 2, 0.8), smileA(41, -1, 13)]) };
    } },
    shark: { name: "Shark", e: "🦈", col: ["#8fa4b8", "#6b8299", "#f4f7fa", "#fff"], hw: 76, up: 52, dn: 32, draw: function (c) {
      var tl = joint(-47, 0, [P_("M0 0 L-12 -32 Q-15 -10 -9 0 Q-12 8 -17 19 Z", c[1])]);
      return { tail: tl, crown: [18, -25], kids: [tl.wrap, P_("M-12 -22 L-2 -48 L14 -24 Z", c[1]),
        P_("M-48 0 C-30 -25 30 -29 54 -5 Q59 2 52 6 C30 22 -30 20 -48 0 Z", c[0]),
        P_("M-30 8 C-6 18 30 16 52 6 Q40 19 0 20 C-20 18 -28 14 -30 8 Z", c[2]),
        P_("M8 8 L-2 30 L22 10 Z", c[1]),
        S("path", { d: "M20 -5 q-3 6 0 12 M25 -6 q-3 6 0 12 M30 -6 q-3 6 0 12", stroke: c[1], "stroke-width": 2, fill: "none", "stroke-linecap": "round" }),
        S("ellipse", { cx: 0, cy: -16, rx: 22, ry: 4.5, fill: "#fff", opacity: 0.3 })]
        .concat(eyeA(37, -9, 6), [cheekA(35, 5, 0.8), smileA(39, 6, 12),
          P_("M41.5 7.4 l2 3 l2 -2.6 Z", "#fff"), P_("M46 7.6 l2 2.8 l2 -3 Z", "#fff")]) };
    } },
    whale: { name: "Whale", e: "🐳", col: ["#4a7fd8", "#2f5fb3", "#cfe3ff", "#bfe6ff"], hw: 82, up: 64, dn: 40, draw: function (c) {
      var tl = joint(-50, 4, [P_("M0 0 Q-10 -6 -18 -22 Q-21 -10 -12 -2 Q-21 8 -22 20 Q-10 10 0 0 Z", c[1])]), gr = [];
      for (var i = 0; i < 4; i++) gr.push(S("path", { d: "M" + (-14 + i * 12) + " " + (20 + (i === 1 || i === 2 ? 1 : 0)) + " q5 3 10 2", stroke: "#9ec3ee", "stroke-width": 1.6, fill: "none" }));
      return { tail: tl, crown: [-6, -33], kids: [tl.wrap,
        S("path", { class: "sea-spout", d: "M24 -32 q-6 -12 -14 -10 M24 -32 q6 -12 14 -10 M24 -32 l0 -14", stroke: c[3], "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }),
        P_("M-51 6 C-51 -34 30 -40 56 -8 C64 6 56 27 30 29 L-30 27 C-44 25 -51 16 -51 6 Z", c[0]),
        P_("M-28 18 C0 22 30 22 54 12 C50 24 38 30 26 31 L-26 29 Z", c[2])].concat(gr, [
        P_("M14 18 Q8 36 -6 36 Q2 26 4 16 Z", c[1]),
        S("ellipse", { cx: -6, cy: -24, rx: 26, ry: 6, fill: "#fff", opacity: 0.22 })],
        eyeA(40, -4, 6.5), [cheekA(40, 10), smileA(46, 9, 10)]) };
    } },

    /* ---- sky: small ---- */
    sparrow: { name: "Sparrow", e: "🐦", bird: true, col: ["#b07a4a", "#8a5a32", "#f3e3c8", "#6e4626"], back: 46, draw: function (c) {
      return smallBird(c, { tail: c[3], beak: "#f2b84b", extra: [P_("M4 -20 Q16 -27 27 -12 Q15 -17 4 -14 Z", c[3])],
        wingExtra: [S("path", { d: "M-10 -12 l-6 -6 M-16 -8 l-8 -4", stroke: "#fff", "stroke-width": 2, "stroke-linecap": "round", opacity: 0.7 })] });
    } },
    parrot: { name: "Parrot", e: "🦜", bird: true, col: ["#3fbf4a", "#2f9b3a", "#c9f27a", "#2f7fe0"], back: 66, draw: function (c) {
      return smallBird(c, { tail: null, beak: null,
        behind: [P_("M-22 -2 L-64 -6 L-62 4 L-22 8 Z", c[3]), P_("M-22 2 L-58 6 L-56 12 L-22 10 Z", "#ff4b4b")],
        extra: [S("circle", { cx: 15, cy: -9, r: 13, fill: "#ff4b4b" }), P_("M25 -9 Q39 -9 37 4 Q33 0 26 2 Z", "#fff3c4", { stroke: "#c9a65a", "stroke-width": 1.5 })],
        wingExtra: [P_("M-22 -24 Q-30 -20 -30 -20 Q-24 -12 -14 -8 Z", "#2f7fe0")] });
    } },
    canary: { name: "Canary", e: "🐤", bird: true, col: ["#ffd84a", "#f5b800", "#fff1a8", "#f0a500"], back: 46, draw: function (c) {
      return smallBird(c, { tail: c[3], beak: "#ff9a3d", extra: [P_("M6 -21 q3 -9 8 -3 q2 -7 6 -1", "none", { stroke: c[1], "stroke-width": 3, "stroke-linecap": "round" })] });
    } },
    /* ---- sky: medium ---- */
    owl: { name: "Owl", e: "🦉", bird: true, col: ["#9a6a42", "#7a4f2e", "#e9d2b0", "#f4e2c6"], back: 40, draw: function (c) {
      var wing = joint(-8, -2, [P_("M2 -2 Q-18 -36 -32 -20 Q-22 -6 2 6 Z", c[1])]), vs = [];
      [[0, 6], [10, 4], [-6, 14], [6, 16], [16, 14]].forEach(function (v) { vs.push(S("path", { d: "M" + v[0] + " " + v[1] + " l3 3 l3 -3", stroke: c[1], "stroke-width": 1.6, fill: "none" })); });
      function oe(x, y, r) { return [S("circle", { cx: x, cy: y, r: r, fill: "#ffcf33" }), S("circle", { cx: x + 1, cy: y, r: r * 0.55, fill: DK }), S("circle", { cx: x + 2.2, cy: y - 2, r: r * 0.2, fill: "#fff" })]; }
      return { tail: wing, crown: [12, -34, 0.9], kids: [P_("M-24 4 L-40 -2 L-36 10 Z", c[1]),
        P_("M-6 -24 L-4 -40 L5 -27 Z", c[1]), P_("M19 -27 L28 -40 L30 -24 Z", c[1]),
        S("circle", { r: 30, fill: c[0] }), S("ellipse", { cx: 6, cy: 12, rx: 18, ry: 15, fill: c[2] })].concat(vs, [
        S("circle", { cx: 5, cy: -9, r: 12, fill: c[3] }), S("circle", { cx: 24, cy: -9, r: 11, fill: c[3] })],
        oe(5, -9, 8), oe(24, -9, 7.5), [P_("M12 -3 L15 5 L19 -3 Z", "#f5a300"), cheekA(0, 3, 0.7), cheekA(28, 3, 0.7), wing.wrap]) };
    } },
    flamingo: { name: "Flamingo", e: "🦩", bird: true, col: ["#ff9ec2", "#ff6f9e", "#ffd3e3", "#ff7aa8"], back: 70, draw: function (c) {
      var wing = joint(-6, -4, [P_("M2 -2 Q-16 -38 -34 -26 Q-22 -8 2 6 Z", c[1]), P_("M-24 -32 Q-34 -28 -34 -26 Q-30 -20 -26 -18 Z", DK)]);
      return { tail: wing, crown: [48, -21, 0.65], kids: [
        S("path", { d: "M-26 6 L-66 8 M-26 10 L-64 14", stroke: c[3], "stroke-width": 3, "stroke-linecap": "round" }),
        P_("M-66 8 l-6 -4 M-64 14 l-6 -3", "none", { stroke: c[3], "stroke-width": 3, "stroke-linecap": "round" }),
        S("path", { d: "M12 -4 Q30 -12 44 -12", stroke: c[0], "stroke-width": 8, fill: "none", "stroke-linecap": "round" }),
        S("ellipse", { cx: -6, rx: 27, ry: 16, fill: c[0] }), S("ellipse", { cx: -2, cy: 6, rx: 16, ry: 7, fill: c[2] }),
        S("circle", { cx: 48, cy: -12, r: 8.5, fill: c[0] }),
        P_("M55 -15 Q66 -13 65 -3 Q61 -6 55 -8 Z", "#fff"), P_("M61 -12 Q66 -11 65 -3 Q62 -6 60 -7 Z", DK)]
        .concat(eyeA(49, -14, 3.8), [cheekA(46, -7, 0.6), wing.wrap]) };
    } },
    toucan: { name: "Toucan", e: "🐦", bird: true, col: ["#22262e", "#30353f", "#fff8e0", "#ff9a1f"], back: 50, draw: function (c) {
      var wing = joint(-4, -4, [P_("M2 -2 Q-18 -34 -32 -20 Q-20 -6 2 4 Z", c[1])]);
      return { tail: wing, crown: [8, -24], kids: [P_("M-24 -2 L-48 -10 L-46 6 L-24 8 Z", c[0]),
        S("ellipse", { rx: 28, ry: 22, fill: c[0] }), S("ellipse", { cx: 15, cy: 1, rx: 10, ry: 12, fill: c[2] }),
        S("ellipse", { cx: 6, cy: 17, rx: 8, ry: 3.5, fill: "#ff4b4b" }),
        P_("M22 -11 Q62 -16 68 2 Q50 5 24 6 Z", c[3]), P_("M22 -11 Q60 -15 66 -4 Q50 -9 24 -5 Z", "#ffd23f"), P_("M60 -7 Q67 -6 68 2 Q63 3 60 2 Z", "#ff4b4b"),
        S("circle", { cx: 18, cy: -8, r: 7.5, fill: "#5ccfff" })].concat(eyeA(18, -8, 5.5), [wing.wrap]) };
    } },
    /* ---- sky: big ---- */
    eagle: { name: "Eagle", e: "🦅", bird: true, col: ["#7a4a24", "#5e3818", "#fbfbf6", "#ffc21f"], back: 52, draw: function (c) {
      var wing = joint(-4, -6, [P_("M4 -2 Q-8 -50 -46 -42 Q-36 -36 -40 -30 Q-28 -26 -32 -18 Q-16 -10 4 6 Z", c[1])]);
      return { tail: wing, crown: [22, -21, 0.85], kids: [P_("M-28 -2 L-52 -12 L-50 10 L-28 6 Z", c[2]),
        S("path", { d: "M-4 18 l-4 6 M2 18 l0 7", stroke: c[3], "stroke-width": 3, "stroke-linecap": "round" }),
        S("ellipse", { rx: 32, ry: 20, fill: c[0] }), S("circle", { cx: 22, cy: -7, r: 14, fill: c[2] }),
        P_("M32 -10 Q47 -10 44 3 Q40 -2 32 0 Z", c[3], { stroke: "#d99a00", "stroke-width": 1.5 })]
        .concat(eyeA(26, -10, 5), [cheekA(23, -1, 0.7), wing.wrap]) };
    } },
    peacock: { name: "Peacock", e: "🦚", bird: true, col: ["#2f6fe0", "#1f4fb0", "#d6ebff", "#2fa540"], back: 96, draw: function (c) {
      var wing = joint(-4, -4, [P_("M2 -2 Q-16 -32 -30 -20 Q-20 -6 2 4 Z", "#9a7a4a")]), spots = [];
      [[-52, -6], [-68, 2], [-82, -6], [-80, 10], [-58, 12]].forEach(function (p) {
        spots.push(S("circle", { cx: p[0], cy: p[1], r: 5.5, fill: "#ffd23f" }), S("circle", { cx: p[0], cy: p[1], r: 3.2, fill: c[0] }));
      });
      return { tail: wing, crown: [17, -27, 0.75], kids: [P_("M-18 -2 Q-60 -28 -92 -10 Q-74 4 -92 18 Q-60 24 -18 8 Z", c[3])].concat(spots, [
        S("path", { d: "M17 -18 l-4 -11 M19 -18 l0 -12 M21 -18 l4 -11", stroke: c[1], "stroke-width": 1.6, "stroke-linecap": "round" }),
        S("circle", { cx: 13, cy: -29, r: 2.4, fill: "#2fa5ff" }), S("circle", { cx: 19, cy: -30, r: 2.4, fill: "#2fa5ff" }), S("circle", { cx: 25, cy: -29, r: 2.4, fill: "#2fa5ff" }),
        S("ellipse", { rx: 24, ry: 18, fill: c[0] }), S("circle", { cx: 18, cy: -8, r: 11, fill: c[0] }),
        S("ellipse", { cx: 22, cy: -9, rx: 6, ry: 4, fill: "#fff" }), P_("M28 -9 L37 -6 L28 -3 Z", "#c9b48a")],
        eyeA(22, -9, 3.6), [wing.wrap]) };
    } },
    swan: { name: "Swan", e: "🦢", bird: true, col: ["#fbfbff", "#dfe7f2", "#ffffff", "#ff8a1f"], back: 44, draw: function (c) {
      var wing = joint(-4, -4, [P_("M2 -2 Q-16 -40 -36 -26 Q-22 -8 2 6 Z", "#fff", { stroke: "#c9d6e6", "stroke-width": 1.8 })]);
      return { tail: wing, crown: [50, -20, 0.65], kids: [P_("M-28 -2 L-42 -9 L-38 5 Z", "#fff", { stroke: "#c9d6e6", "stroke-width": 1.5 }),
        S("path", { d: "M18 -4 Q36 -14 46 -12", stroke: "#c9d6e6", "stroke-width": 11, fill: "none", "stroke-linecap": "round" }),
        S("path", { d: "M18 -4 Q36 -14 46 -12", stroke: "#fff", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }),
        S("ellipse", { rx: 30, ry: 16, fill: "#fff", stroke: "#c9d6e6", "stroke-width": 1.8 }),
        S("circle", { cx: 50, cy: -12, r: 8.5, fill: "#fff", stroke: "#c9d6e6", "stroke-width": 1.5 }),
        P_("M56 -15 L69 -10 L56 -6 Z", c[3]), P_("M55 -16 L59 -11 L55 -6 Z", DK)]
        .concat(eyeA(51, -14, 3.4), [cheekA(48, -6, 0.6), wing.wrap]) };
    } }
  };
  function smallBird(c, o) {
    var wing = joint(-2, -4, [P_("M2 -2 Q-18 -34 -30 -20 Q-20 -6 2 4 Z", c[1])].concat(o.wingExtra || []));
    return { tail: wing, crown: [6, -24], kids: (o.behind || []).concat(o.tail ? [P_("M-24 -2 L-44 -13 L-38 0 L-44 11 Z", o.tail)] : [], [
      S("ellipse", { rx: 28, ry: 22, fill: c[0] }), S("ellipse", { cx: 7, cy: 9, rx: 18, ry: 11, fill: c[2] }),
      S("ellipse", { cx: -4, cy: -13, rx: 13, ry: 4.5, fill: "#fff", opacity: 0.3 })], o.extra || [],
      o.beak ? [P_("M26 -4 L39 0 L26 5 Z", o.beak, { stroke: "rgba(0,0,0,.18)", "stroke-width": 1 })] : [],
      eyeA(14, -7, 7), [cheekA(12, 7, 0.9), wing.wrap]) };
  }
  // Which species each size of chapter can become
  var POOLS = {
    fish: [["clownfish", "pufferfish", "seahorse"], ["turtle", "octopus", "swordfish"], ["dolphin", "shark", "whale"]],
    bird: [["sparrow", "parrot", "canary"], ["owl", "flamingo", "toucan"], ["eagle", "peacock", "swan"]]
  };
  var TIER_WORD = ["Small", "Medium", "Big"];
  var TIER_MAX = [1.0, 1.25, 1.5];
  // Chapter size by number of questions (science lessons are single topics, so they use smaller steps)
  function tierOf(c) { var t = c.total || 0; return isBird(c) ? (t < 40 ? 0 : t < 70 ? 1 : 2) : (t < 100 ? 0 : t < 250 ? 1 : 2); }
  // The species is picked at random once per chapter (when it hatches) and saved, so it never changes.
  function speciesFor(c) {
    var all = store("sea:species") || {}, cur = all[c.key], tier = c.tier, pool = POOLS[kind(c)][tier];
    if (cur && cur.t === tier && SPECIES[cur.s]) return SPECIES[cur.s];
    if (!c.started) return null;
    var used = {}; Object.keys(all).forEach(function (k) { if (k !== c.key) used[all[k].s] = (used[all[k].s] || 0) + 1; });
    var least = Math.min.apply(null, pool.map(function (s) { return used[s] || 0; }));
    var pick = pool.filter(function (s) { return (used[s] || 0) === least; });
    var id = pick[Math.floor(Math.random() * pick.length)];
    all[c.key] = { t: tier, s: id }; store("sea:species", all);
    return SPECIES[id];
  }
  function drawSpecies(c) {
    var sp = c.sp, d = sp.draw(sp.col), cr = crownAt(d.crown[0], d.crown[1], d.crown[2]);
    if (c.stage < 4) cr.style.display = "none";
    d.kids.push(cr);
    return { body: S("g", {}, d.kids), tail: d.tail.t, crown: cr, bird: !!sp.bird, hw: sp.hw || 60, up: sp.up || 50, dn: sp.dn || 36, back: sp.back || 46 };
  }

  /* ---------- the scene ---------- */
  var H = 490, SAND = 70, SKY = 124, running = null;

  function render() {
    var all = chapters(), pearls = totalPoints(all);
    var chs = all.filter(function (c) { return c.started; });
    var memo = store("practice:sea") || null;
    var grown = [], friendsNew = [], hatched = [], revealed = [];
    var unlocked = FRIENDS.filter(function (f) { return pearls >= f.at; });
    if (memo) {
      chs.forEach(function (c) { var was = memo.stages && memo.stages[c.key]; if (was != null && c.stage > was) { if (was < 2 && c.revealed) revealed.push(c); else grown.push(c); } });
      unlocked.forEach(function (f) { if ((memo.pearls || 0) < f.at) friendsNew.push(f); });
      if (memo.fish) chs.forEach(function (c) { if (memo.fish.indexOf(c.key) < 0) hatched.push(c); });
    }
    var stages = {}; chs.forEach(function (c) { stages[c.key] = c.stage; });
    store("practice:sea", { stages: stages, pearls: pearls, fish: chs.map(function (c) { return c.key; }) });

    var kings = chs.filter(function (c) { return c.stage === 4; }).length;
    var nextF = FRIENDS.filter(function (f) { return pearls < f.at; })[0];
    var prevAt = unlocked.length ? unlocked[unlocked.length - 1].at : 0;
    var st = streak();

    var wrap = E("section", { class: "sea-wrap", "aria-label": "Your sea world" });
    var chips = E("div", { class: "sea-chips" }, [
      E("span", { class: "sea-chip" }, [E("b", { text: commas(pearls) }), " pearls"]),
      E("span", { class: "sea-chip" }, [E("b", { text: kings + " of " + all.length }), " kings"]),
      E("span", { class: "sea-chip" + (st ? " hot" : "") }, [E("b", { text: st ? "🔥 " + st : "0" }), st === 1 ? " day streak" : " day streak"]),
      nextF ? E("span", { class: "sea-chip next" }, [
        E("span", { class: "sea-next-e", text: nextF.e }),
        E("span", { class: "sea-next-t" }, [E("span", { text: "Next friend: " + nextF.name }),
          E("span", { class: "sea-mini" }, [E("span", { style: "width:" + Math.round(100 * (pearls - prevAt) / (nextF.at - prevAt)) + "%" })]),
          E("span", { class: "sea-mini-t", text: (nextF.at - pearls) + " pearls to go" })])
      ]) : E("span", { class: "sea-chip" }, ["All sea friends found! 🌊"])
    ]);
    var head = E("div", { class: "sea-head" }, [
      E("div", {}, [E("h2", { text: "Your sea world" }),
        E("p", { class: "sea-sub", text: "Start an exercise and its chapter hatches here: maths chapters are fish in the sea, science chapters are birds in the sky. Solve questions to feed them. Halfway, each one turns into a surprise animal, and bigger chapters grow into bigger animals. Tap one to meet it." })]),
      chips
    ]);
    wrap.appendChild(head);

    var msgs = [];
    hatched.slice(0, 3).forEach(function (c) { msgs.push("🐣 A new " + kind(c) + " hatched: " + c.name + " for " + c.short + "!"); });
    revealed.slice(0, 3).forEach(function (c) { msgs.push("✨ Surprise! " + c.name + " (" + c.short + ") turned into a " + c.sp.name.toLowerCase() + " " + c.sp.e + "!"); });
    grown.slice(0, 3).forEach(function (c) { msgs.push("🎉 " + c.name + " (" + c.short + ") grew into a " + stageName(c) + "!"); });
    friendsNew.slice(0, 2).forEach(function (f) { msgs.push(f.e + " A " + f.name.toLowerCase() + " joined your sea!"); });
    if (msgs.length) wrap.appendChild(E("div", { class: "sea-toast", role: "status" }, msgs.map(function (m) { return E("p", { text: m }); })));

    var box = E("div", { class: "sea-box" });
    var svg = S("svg", { class: "sea", role: "img", "aria-label": "Sea with " + chs.length + " chapter fish", preserveAspectRatio: "xMidYMid meet" });
    box.appendChild(svg);
    var card = E("div", { class: "sea-card", hidden: "hidden" });
    box.appendChild(card);
    if (!chs.length) box.appendChild(E("div", { class: "sea-empty" }, [E("p", { class: "sea-empty-e", text: "🥚" }),
      E("p", { text: "Your sea is waiting for its first friend." }), E("p", { class: "sea-empty-s", text: "Start any exercise and its chapter will hatch here." })]));
    wrap.appendChild(box);

    // fish list for keyboard and screen readers
    var list = E("div", { class: "sea-list" }, chs.map(function (c) {
      return E("button", { type: "button", class: "sea-pill", style: "--fc:" + c.col[0], onclick: function () { showCard(c); } }, [
        E("span", { class: "sea-dot", text: c.label }), c.name + " · " + stageName(c) + (c.stage === 4 ? " 👑" : "")
      ]);
    }));
    wrap.appendChild(list);

    if (running) { running.stop(); running = null; }
    running = scene(svg, box, chs, unlocked, grown, revealed);

    function showCard(c) {
      var nl = nextLesson(c), need = toNext(c);
      card.innerHTML = "";
      card.appendChild(E("button", { type: "button", class: "sea-x", "aria-label": "Close", text: "×", onclick: function () { card.hidden = true; } }));
      card.appendChild(E("div", { class: "sea-card-top" }, [
        E("span", { class: "sea-dot big", style: "--fc:" + c.col[0], text: c.label }),
        E("div", {}, [E("p", { class: "sea-card-name", text: c.name + (c.stage === 4 ? " 👑" : "") }), E("p", { class: "sea-card-ch", text: c.title })])
      ]));
      card.appendChild(E("p", { class: "sea-stage", text: stageName(c) + (c.revealed ? " " + c.sp.e : "") }));
      if (!c.revealed) card.appendChild(E("p", { class: "sea-card-tier", text: "❓ " + TIER_WORD[c.tier] + " chapter: I might become a " + POOLS[kind(c)][c.tier].map(function (id) { return SPECIES[id].name.toLowerCase(); }).join(", ").replace(/, ([^,]*)$/, " or $1") + "!" }));
      else card.appendChild(E("p", { class: "sea-card-tier", text: TIER_WORD[c.tier] + " chapter (" + c.total + " questions)" + (c.tier ? ", so I grow extra big!" : "") }));
      card.appendChild(E("span", { class: "sea-meter" }, [E("span", { style: "width:" + Math.round(100 * c.p) + "%;background:" + c.col[0] })]));
      card.appendChild(E("p", { class: "sea-card-st", text: c.done + " of " + c.total + " questions solved · " + commas(c.points) + " pearls" }));
      var sayNext = c.stage + 1 === 2 ? " and you will see what I turn into!" : " and I become a " + stageName(c, c.stage + 1) + "!";
      card.appendChild(E("p", { class: "sea-card-say", text: need ? "Solve " + need + " more question" + (need === 1 ? "" : "s") + sayNext : (isBird(c) ? "I am the King of the sky!" : "I am the King of the sea!") + " Thank you for feeding me." }));
      if (nl) card.appendChild(E("button", { type: "button", class: "btn primary small", text: (need ? "Feed " + c.name + ": " : "Visit ") + nl.title + " →", onclick: function () { c.open(nl.id); } }));
      else card.appendChild(E("a", { class: "btn primary small", href: c.page + (c.lessonId ? "#lesson=" + c.lessonId : ""), text: (need ? "Feed " + c.name + " on the " : "Visit the ") + c.subject + " page →" }));
      card.hidden = false;
      if (running) running.cheer(c);
    }
    running.onTap = showCard;
    return wrap;
  }

  function scene(svg, box, chs, friends, grown, revealed) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W = 900, raf = 0, last = 0, t = 0, stopped = false, bubbleClock = 0;
    var stat = S("g"), bedL = S("g"), fishL = S("g"), swimL = S("g"), bubL = S("g"), tagL = S("g"), sparkL = S("g");
    svg.appendChild(S("defs", {}, [
      S("linearGradient", { id: "skyG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#9fdcff" }), S("stop", { offset: "1", "stop-color": "#e6f7ff" })]),
      S("linearGradient", { id: "seaG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#8be0f7" }), S("stop", { offset: ".45", "stop-color": "#2f9bd6" }), S("stop", { offset: "1", "stop-color": "#0e4c8c" })]),
      S("linearGradient", { id: "sandG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#f7dfa8" }), S("stop", { offset: "1", "stop-color": "#dcb56f" })])
    ]));
    [stat, bedL, swimL, fishL, bubL, tagL, sparkL].forEach(function (g) { svg.appendChild(g); });

    var fish = chs.map(function (c, i) {
      var baby = isBird(c) ? drawBird(c) : drawFish(c), adult = c.revealed ? drawSpecies(c) : null, d = adult || baby;
      if (!adult) { baby.hw = isBird(c) ? 44 : 64; baby.up = 50; baby.dn = 40; baby.back = 46; }
      var rev = adult && !reduce && revealed && revealed.indexOf(c) >= 0;
      var g = S("g", { class: "sea-fish" + (d.bird ? " sea-bird" : ""), tabindex: "-1" }, rev ? [baby.body, adult.body] : [d.body]);
      if (rev) adult.body.style.display = "none";
      var tw = Math.max(22, 8 + c.label.length * 7.5);
      var tag = S("g", { class: "sea-tag" }, [S("rect", { x: -tw / 2, y: -11, width: tw, height: 22, rx: 11, fill: c.subject === "Science" ? "#eafbe9" : "#fff", stroke: c.col[1], "stroke-width": 2.5 }),
        S("text", { "text-anchor": "middle", dy: "0.35em", fill: "#1b2a3a" }, [document.createTextNode(c.label)])]);
      var shine = S("g", { class: "sea-shine" });
      g.appendChild(shine);
      fishL.appendChild(g); tagL.appendChild(tag);
      var o = { c: c, g: g, tag: tag, tail: rev ? baby.tail : d.tail, bird: !!d.bird, shine: shine, s: sizeOf(c.p, c.tier), dir: Math.random() < 0.5 ? -1 : 1, face: 1, x: 0, y: 0, ty: 0,
        sp: rnd(28, 46) * (1.25 - 0.4 * c.p) * (c.tier === 2 ? 0.8 : 1), ph: rnd(0, 6.28), next: rnd(1, 4), jump: 0,
        hw: d.hw || 64, up: d.up || 50, dn: d.dn || 40, back: d.back || 46, flap: c.tier === 2 ? 6 : 9,
        rev: rev ? 2.4 : 0, baby: rev ? baby : null, adult: rev ? adult : null };
      o.face = o.dir;
      function tap(e) { e.stopPropagation(); if (api.onTap) api.onTap(c); }
      g.addEventListener("click", tap); tag.addEventListener("click", tap);
      return o;
    });
    grown.forEach(function (c) { fish.forEach(function (o) { if (o.c === c) o.jump = 2.4; }); });

    var swimmers = [];
    function layout() {
      var r = box.getBoundingClientRect(), nw = r.width && r.height ? Math.max(320, Math.round(H * r.width / r.height)) : 900;
      var first = !stat.firstChild; W = nw;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      while (stat.firstChild) stat.removeChild(stat.firstChild);
      while (bedL.firstChild) bedL.removeChild(bedL.firstChild);
      while (swimL.firstChild) swimL.removeChild(swimL.firstChild);
      stat.appendChild(S("rect", { width: W, height: SKY + 10, fill: "url(#skyG)" }));
      stat.appendChild(S("circle", { cx: W - 56, cy: 38, r: 20, fill: "#ffd23f", class: "sea-sun" }));
      [[0.18, 30, 1], [0.55, 52, 0.8], [0.82, 24, 0.7]].forEach(function (cl, ci) {
        stat.appendChild(S("g", { transform: "translate(" + f1(W * cl[0]) + "," + cl[1] + ") scale(" + cl[2] + ")" }, [S("g", { class: "sea-cloud c" + ci }, [
          S("ellipse", { cx: 0, cy: 0, rx: 34, ry: 12, fill: "#fff" }), S("ellipse", { cx: -14, cy: -8, rx: 16, ry: 11, fill: "#fff" }), S("ellipse", { cx: 10, cy: -10, rx: 18, ry: 13, fill: "#fff" })])]));
      });
      var wave = "M0 " + SKY; for (var wv = 0; wv * 40 < W + 40; wv++) wave += " q10 -6 20 0 t20 0";
      stat.appendChild(S("path", { d: wave + " V" + H + " H0 Z", fill: "url(#seaG)" }));
      stat.appendChild(S("path", { d: wave, fill: "none", stroke: "#fff", "stroke-width": 2.5, opacity: 0.7 }));
      for (var i = 0; i < 4; i++) {
        var x = W * (0.12 + i * 0.26);
        stat.appendChild(S("path", { class: "sea-ray r" + i, d: "M" + f1(x) + " " + (SKY + 4) + " L" + f1(x + 60) + " " + (SKY + 4) + " L" + f1(x + 170) + " " + (H - SAND) + " L" + f1(x + 70) + " " + (H - SAND) + " Z", fill: "#fff" }));
      }
      // far hills, seaweed, sand
      stat.appendChild(S("path", { d: "M0 " + (H - 95) + " Q" + f1(W * 0.2) + " " + (H - 140) + " " + f1(W * 0.42) + " " + (H - 100) + " T" + f1(W * 0.85) + " " + (H - 110) + " T" + W + " " + (H - 120) + " V" + H + " H0 Z", fill: "#0b3f75", opacity: 0.35 }));
      var nWeed = Math.round(W / 110);
      for (var k = 0; k < nWeed; k++) {
        var wx = (k + 0.5) * W / nWeed + rnd(-20, 20), wh = rnd(70, 140), green = ["#2fa540", "#3fbf6a", "#1f8a52"][k % 3];
        stat.appendChild(S("path", { class: "sea-weed w" + (k % 3), d: "M" + f1(wx) + " " + (H - SAND + 20) + " C" + f1(wx - 18) + " " + f1(H - SAND - wh * 0.4) + " " + f1(wx + 18) + " " + f1(H - SAND - wh * 0.7) + " " + f1(wx) + " " + f1(H - SAND - wh), stroke: green, "stroke-width": 9, fill: "none", "stroke-linecap": "round" }));
      }
      stat.appendChild(S("path", { d: "M0 " + (H - SAND + 6) + " Q" + f1(W * 0.25) + " " + (H - SAND - 14) + " " + f1(W * 0.5) + " " + (H - SAND + 2) + " T" + W + " " + (H - SAND - 4) + " V" + H + " H0 Z", fill: "url(#sandG)" }));
      [[0.07, 14], [0.27, 10], [0.55, 16], [0.9, 12]].forEach(function (rk) {
        stat.appendChild(S("ellipse", { cx: f1(W * rk[0]), cy: H - SAND + 22, rx: rk[1] * 2, ry: rk[1], fill: "#9aa7b4" }));
      });
      swimmers = [];
      friends.forEach(function (fr, i) {
        var size = fr.big ? 54 : 34;
        var tx = S("text", { class: "sea-friend", "font-size": size, "text-anchor": "middle", dy: "0.35em" }, [document.createTextNode(fr.e)]);
        var g = S("g", {}, [tx]);
        if (fr.kind === "bed") { g.setAttribute("transform", "translate(" + f1(W * fr.x) + "," + (H - SAND + 26) + ")"); bedL.appendChild(g); return; }
        var sw = { fr: fr, g: g, x: rnd(80, W - 80), y: 0, dir: i % 2 ? 1 : -1, ph: rnd(0, 6) };
        if (fr.kind === "walk") { sw.y = H - SAND + 30; sw.sp = 18; bedL.appendChild(g); }
        else if (fr.kind === "swim") { sw.y = SKY + 30 + fr.y * (H - SAND - SKY - 60); sw.sp = fr.big ? 14 : 24; swimL.appendChild(g); }
        else if (fr.kind === "float") { sw.y = SKY + 0.4 * (H - SAND - SKY); sw.sp = 8; swimL.appendChild(g); }
        else { sw.x = W * (fr.x || 0.6); sw.y = H - SAND + 18; sw.sp = 0; bedL.appendChild(g); }
        swimmers.push(sw);
      });
      var k = Math.max(0.62, Math.min(1, W / 820));
      fish.forEach(function (o, i) {
        o.s = sizeOf(o.c.p, o.c.tier) * k * (o.bird ? 0.8 : 1);
        if (first) {
          o.x = rnd(70, W - 70);
          if (o.bird) o.ty = o.y = rnd(52, SKY - 30);
          else o.ty = o.y = clampY(o, SKY + 40 + (i % 5) * ((H - SAND - SKY - 90) / 4) + rnd(-10, 10));
        } else { o.x = Math.min(Math.max(o.x, 70), W - 70); }
      });
      draw(0);
    }

    // keep each sea animal fully in the water, crown included
    function clampY(o, y) { var top = SKY + 14 + o.up * o.s, bot = H - SAND - 4 - o.dn * o.s; return bot < top ? (top + bot) / 2 : Math.min(bot, Math.max(top, y)); }
    function sparkle(x, y, s) {
      if (reduce) return;
      var cols = ["#ffd23f", "#ffffff", "#ff7aa2", "#7fe3ff"];
      for (var i = 0; i < 16; i++) {
        var a = i / 16 * Math.PI * 2, r = (80 + 30 * (i % 3)) * Math.max(0.7, s);
        var st = S("path", { d: "M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z", fill: cols[i % 4], class: "sea-spark", style: "--dx:" + f1(Math.cos(a) * r) + "px;--dy:" + f1(Math.sin(a) * r) + "px;animation-delay:" + (i % 3) * 0.08 + "s" });
        sparkL.appendChild(S("g", { transform: "translate(" + f1(x) + "," + f1(y) + ")" }, [st]));
      }
      setTimeout(function () { while (sparkL.firstChild) sparkL.removeChild(sparkL.firstChild); }, 1600);
    }

    function draw(dt) {
      fish.forEach(function (o) {
        var spin = 1;
        if (o.rev > 0 && dt) {
          var before = o.rev; o.rev = Math.max(0, o.rev - dt);
          if (before > 1.2 && o.rev <= 1.2) {
            o.baby.body.style.display = "none"; o.adult.body.style.display = ""; o.tail = o.adult.tail;
            sparkle(o.x, o.y, o.s);
          }
        }
        if (o.rev > 0) { var q = (2.4 - o.rev) / 2.4; spin = Math.cos(q * Math.PI * 6) * (1 + 0.25 * Math.sin(q * Math.PI)); }
        if (dt) {
          o.next -= dt;
          if (o.next <= 0) { o.next = rnd(2, 5); o.ty = o.bird ? rnd(52, SKY - 30) : clampY(o, rnd(SKY + 30, H - SAND - 30)); if (Math.random() < 0.25) o.dir = -o.dir; }
          var m = o.hw * o.s;
          if (o.x > W - m) o.dir = -1; else if (o.x < m) o.dir = 1;
          o.x += o.dir * o.sp * dt * (o.jump > 0 ? 2 : 1);
          o.y += (o.ty - o.y) * Math.min(1, dt * 0.6);
          o.face += (o.dir - o.face) * Math.min(1, dt * 6);
          if (o.jump > 0) o.jump = Math.max(0, o.jump - dt);
        }
        var bob = Math.sin(t * 1.6 + o.ph) * 4 + (o.jump > 0 ? -Math.abs(Math.sin(o.jump * 5)) * 22 : 0);
        var y = o.y + bob, tilt = (o.ty - o.y) * 0.08 * o.dir;
        tilt = Math.max(-14, Math.min(14, tilt));
        o.g.setAttribute("transform", "translate(" + f1(o.x) + "," + f1(y) + ") rotate(" + f1(tilt) + ") scale(" + f1(o.face * o.s * spin * 100) / 100 + "," + f1(o.s * 100) / 100 + ")");
        if (o.bird) o.tail.setAttribute("transform", "rotate(" + f1(Math.sin(t * o.flap + o.ph) * 28) + ")");
        else o.tail.setAttribute("transform", "rotate(" + f1(Math.sin(t * (7 - 2 * o.c.p) + o.ph) * 16) + ")");
        o.tag.setAttribute("transform", "translate(" + f1(o.bird ? o.x - o.face * (o.back * o.s + 18) : o.x) + "," + f1(o.bird ? y : y + o.dn * o.s + 12) + ")");
      });
      swimmers.forEach(function (sw) {
        if (dt && sw.sp) {
          sw.x += sw.dir * sw.sp * dt;
          if (sw.x > W - 40) sw.dir = -1; else if (sw.x < 40) sw.dir = 1;
        }
        var y = sw.y, extra = "";
        if (sw.fr.kind === "float") y += Math.sin(t * 0.8 + sw.ph) * 30;
        else if (sw.fr.kind === "swim") y += Math.sin(t * 1.1 + sw.ph) * 8;
        else if (sw.fr.kind === "bob") { y += Math.sin(t * 1.4 + sw.ph) * 5; }
        if (sw.fr.kind === "swim" || sw.fr.kind === "walk") extra = " scale(" + (sw.dir > 0 ? -1 : 1) + ",1)";
        sw.g.setAttribute("transform", "translate(" + f1(sw.x) + "," + f1(y) + ")" + extra);
      });
      if (dt) {
        bubbleClock -= dt;
        if (bubbleClock <= 0) { bubbleClock = rnd(0.25, 0.7); bubble(rnd(10, W - 10), H - SAND, rnd(2, 6)); }
        Array.prototype.slice.call(bubL.childNodes).forEach(function (b) {
          b._y -= b._v * dt; b._x += Math.sin(t * 3 + b._p) * 0.4;
          if (b._y < SKY + 6) bubL.removeChild(b);
          else b.setAttribute("transform", "translate(" + f1(b._x) + "," + f1(b._y) + ")");
        });
      }
    }
    function bubble(x, y, r) {
      if (bubL.childNodes.length > 40) return;
      var b = S("circle", { r: f1(r), fill: "#fff", "fill-opacity": 0.25, stroke: "#fff", "stroke-opacity": 0.7, "stroke-width": 1.2 });
      b._x = x; b._y = y; b._v = rnd(30, 60); b._p = rnd(0, 6);
      b.setAttribute("transform", "translate(" + f1(x) + "," + f1(y) + ")");
      bubL.appendChild(b);
    }
    function frame(now) {
      if (stopped) return;
      if (!svg.isConnected) { api.stop(); return; }
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; t += dt;
      if (!document.hidden) draw(dt);
      raf = requestAnimationFrame(frame);
    }
    var api = {
      stop: function () { stopped = true; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); },
      cheer: function (c) {
        fish.forEach(function (o) {
          if (o.c !== c) return;
          o.jump = 1.6; o.ty = o.bird ? Math.max(52, o.y - 20) : clampY(o, o.y - 30);
          for (var i = 0; i < 8; i++) bubble(o.x + rnd(-20, 20) * o.s, o.y + rnd(-10, 10), rnd(2, 5));
          if (reduce) draw(0);
        });
      },
      onTap: null
    };
    function onResize() { layout(); }
    window.addEventListener("resize", onResize);
    requestAnimationFrame(function () { layout(); if (!reduce) raf = requestAnimationFrame(frame); });
    return api;
  }

  /* ---------- called by the engine when a question is solved ---------- */
  function onSolve(l, pts) {
    recordDay();
    var chs = chapters(), c = chapterOf(l, chs); if (!c) return "";
    var before = stageOf(c.total ? (c.done - 1) / c.total : 0), out;
    if (c.stage > before && before < 2 && c.revealed) out = "✨ Surprise! <b>" + c.name + "</b>, your " + c.short + " " + kind(c) + ", is turning into a <b>" + c.sp.name.toLowerCase() + "</b> " + c.sp.e + "! Visit the sea to see it.";
    else if (c.stage > before) out = "🎉 <b>" + c.name + "</b>, your " + c.short + " " + kind(c) + ", grew into a <b>" + stageName(c) + "</b>!";
    else out = (isBird(c) ? "🐦 " : "🐟 ") + c.name + " (" + c.short + ") grew a little bigger.";
    var pearls = totalPoints(chs), was = pearls - (pts || 0);
    FRIENDS.forEach(function (f) { if (was < f.at && pearls >= f.at) out += " " + f.e + " A " + f.name.toLowerCase() + " joined your sea!"; });
    return out;
  }

  var api = { render: render, onSolve: onSolve, chapters: chapters };
  if (P) P.aquarium = api;
  if (SC) SC.aquarium = api;
})();
