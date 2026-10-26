/*
  Fish sea: the motivation dashboard on the home page.
  One fish per chapter. A fish grows a little with every solved question in its
  chapter and passes five stages: Tiny fry, Little fish, Growing fish, Big fish, King fish (with a crown).
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
  function stageName(c, k) { return (isBird(c) ? BIRD_STAGES : STAGES)[k == null ? c.stage : k]; }
  function kind(c) { return isBird(c) ? "bird" : "fish"; }
  var STAGE_AT = [0, 0.25, 0.5, 0.75, 1];
  function stageOf(p) { return p >= 1 ? 4 : p >= 0.75 ? 3 : p >= 0.5 ? 2 : p >= 0.25 ? 1 : 0; }
  function sizeOf(p) { return 0.42 + 0.78 * p; }

  // Sea friends, unlocked by pearls (points). kind: bed (sits on the sand), walk, swim, float, bob
  var FRIENDS = [
    { at: 30, e: "🐚", name: "Shell", kind: "bed", x: 0.12 },
    { at: 100, e: "⭐", name: "Starfish", kind: "bed", x: 0.83 },
    { at: 250, e: "🦀", name: "Crab", kind: "walk" },
    { at: 450, e: "🪸", name: "Coral", kind: "bed", x: 0.33 },
    { at: 750, e: "🐢", name: "Turtle", kind: "swim", y: 0.25 },
    { at: 1100, e: "🐙", name: "Octopus", kind: "bob", x: 0.62 },
    { at: 1600, e: "🪼", name: "Jellyfish", kind: "float" },
    { at: 2300, e: "🐬", name: "Dolphin", kind: "swim", y: 0.14 },
    { at: 3200, e: "🦞", name: "Lobster", kind: "walk" },
    { at: 4500, e: "🐳", name: "Whale", kind: "swim", y: 0.1, big: true },
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

  /* ---------- the scene ---------- */
  var H = 470, SAND = 70, SKY = 104, running = null;

  function render() {
    var all = chapters(), pearls = totalPoints(all);
    var chs = all.filter(function (c) { return c.started; });
    var memo = store("practice:sea") || null;
    var grown = [], friendsNew = [], hatched = [];
    var unlocked = FRIENDS.filter(function (f) { return pearls >= f.at; });
    if (memo) {
      chs.forEach(function (c) { var was = memo.stages && memo.stages[c.key]; if (was != null && c.stage > was) grown.push(c); });
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
        E("p", { class: "sea-sub", text: "Start an exercise and its chapter hatches here: maths chapters are fish in the sea, science chapters are birds in the sky. Solve questions to feed them and watch them grow into kings with crowns. Tap one to meet it." })]),
      chips
    ]);
    wrap.appendChild(head);

    var msgs = [];
    hatched.slice(0, 3).forEach(function (c) { msgs.push("🐣 A new " + kind(c) + " hatched: " + c.name + " for " + c.short + "!"); });
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
    running = scene(svg, box, chs, unlocked, grown);

    function showCard(c) {
      var nl = nextLesson(c), need = toNext(c);
      card.innerHTML = "";
      card.appendChild(E("button", { type: "button", class: "sea-x", "aria-label": "Close", text: "×", onclick: function () { card.hidden = true; } }));
      card.appendChild(E("div", { class: "sea-card-top" }, [
        E("span", { class: "sea-dot big", style: "--fc:" + c.col[0], text: c.label }),
        E("div", {}, [E("p", { class: "sea-card-name", text: c.name + (c.stage === 4 ? " 👑" : "") }), E("p", { class: "sea-card-ch", text: c.title })])
      ]));
      card.appendChild(E("p", { class: "sea-stage", text: stageName(c) }));
      card.appendChild(E("span", { class: "sea-meter" }, [E("span", { style: "width:" + Math.round(100 * c.p) + "%;background:" + c.col[0] })]));
      card.appendChild(E("p", { class: "sea-card-st", text: c.done + " of " + c.total + " questions solved · " + commas(c.points) + " pearls" }));
      card.appendChild(E("p", { class: "sea-card-say", text: need ? "Solve " + need + " more question" + (need === 1 ? "" : "s") + " and I become a " + stageName(c, c.stage + 1) + "!" : (isBird(c) ? "I am the King of the sky!" : "I am the King of the sea!") + " Thank you for feeding me." }));
      if (nl) card.appendChild(E("button", { type: "button", class: "btn primary small", text: (need ? "Feed " + c.name + ": " : "Visit ") + nl.title + " →", onclick: function () { c.open(nl.id); } }));
      else card.appendChild(E("a", { class: "btn primary small", href: c.page + (c.lessonId ? "#lesson=" + c.lessonId : ""), text: (need ? "Feed " + c.name + " on the " : "Visit the ") + c.subject + " page →" }));
      card.hidden = false;
      if (running) running.cheer(c);
    }
    running.onTap = showCard;
    return wrap;
  }

  function scene(svg, box, chs, friends, grown) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W = 900, raf = 0, last = 0, t = 0, stopped = false, bubbleClock = 0;
    var stat = S("g"), bedL = S("g"), fishL = S("g"), swimL = S("g"), bubL = S("g"), tagL = S("g");
    svg.appendChild(S("defs", {}, [
      S("linearGradient", { id: "skyG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#9fdcff" }), S("stop", { offset: "1", "stop-color": "#e6f7ff" })]),
      S("linearGradient", { id: "seaG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#8be0f7" }), S("stop", { offset: ".45", "stop-color": "#2f9bd6" }), S("stop", { offset: "1", "stop-color": "#0e4c8c" })]),
      S("linearGradient", { id: "sandG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#f7dfa8" }), S("stop", { offset: "1", "stop-color": "#dcb56f" })])
    ]));
    [stat, bedL, swimL, fishL, bubL, tagL].forEach(function (g) { svg.appendChild(g); });

    var fish = chs.map(function (c, i) {
      var d = isBird(c) ? drawBird(c) : drawFish(c), g = S("g", { class: "sea-fish" + (d.bird ? " sea-bird" : ""), tabindex: "-1" }, [d.body]);
      var tw = Math.max(22, 8 + c.label.length * 7.5);
      var tag = S("g", { class: "sea-tag" }, [S("rect", { x: -tw / 2, y: -11, width: tw, height: 22, rx: 11, fill: c.subject === "Science" ? "#eafbe9" : "#fff", stroke: c.col[1], "stroke-width": 2.5 }),
        S("text", { "text-anchor": "middle", dy: "0.35em", fill: "#1b2a3a" }, [document.createTextNode(c.label)])]);
      var shine = S("g", { class: "sea-shine" });
      g.appendChild(shine);
      fishL.appendChild(g); tagL.appendChild(tag);
      var o = { c: c, g: g, tag: tag, tail: d.tail, bird: !!d.bird, shine: shine, s: sizeOf(c.p), dir: Math.random() < 0.5 ? -1 : 1, face: 1, x: 0, y: 0, ty: 0,
        sp: rnd(28, 46) * (1.25 - 0.4 * c.p), ph: rnd(0, 6.28), next: rnd(1, 4), jump: 0 };
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
        o.s = sizeOf(o.c.p) * k * (o.bird ? 0.8 : 1);
        if (first) {
          o.x = rnd(70, W - 70);
          if (o.bird) o.ty = o.y = rnd(48, SKY - 26);
          else o.ty = o.y = SKY + 40 + (i % 5) * ((H - SAND - SKY - 90) / 4) + rnd(-10, 10);
        } else { o.x = Math.min(Math.max(o.x, 70), W - 70); }
      });
      draw(0);
    }

    function draw(dt) {
      var top = SKY + 36, bot = H - SAND - 34;
      fish.forEach(function (o) {
        if (dt) {
          o.next -= dt;
          if (o.next <= 0) { o.next = rnd(2, 5); o.ty = o.bird ? rnd(48, SKY - 26) : rnd(top, bot); if (Math.random() < 0.25) o.dir = -o.dir; }
          var m = 40 * o.s;
          if (o.x > W - m) o.dir = -1; else if (o.x < m) o.dir = 1;
          o.x += o.dir * o.sp * dt * (o.jump > 0 ? 2 : 1);
          o.y += (o.ty - o.y) * Math.min(1, dt * 0.6);
          o.face += (o.dir - o.face) * Math.min(1, dt * 6);
          if (o.jump > 0) o.jump = Math.max(0, o.jump - dt);
        }
        var bob = Math.sin(t * 1.6 + o.ph) * 4 + (o.jump > 0 ? -Math.abs(Math.sin(o.jump * 5)) * 22 : 0);
        var y = o.y + bob, tilt = (o.ty - o.y) * 0.08 * o.dir;
        tilt = Math.max(-14, Math.min(14, tilt));
        o.g.setAttribute("transform", "translate(" + f1(o.x) + "," + f1(y) + ") rotate(" + f1(tilt) + ") scale(" + f1(o.face * o.s * 100) / 100 + "," + f1(o.s * 100) / 100 + ")");
        if (o.bird) o.tail.setAttribute("transform", "rotate(" + f1(Math.sin(t * 9 + o.ph) * 28) + ")");
        else o.tail.setAttribute("transform", "rotate(" + f1(Math.sin(t * (7 - 2 * o.c.p) + o.ph) * 16) + ")");
        o.tag.setAttribute("transform", "translate(" + f1(o.bird ? o.x - o.face * (46 * o.s + 18) : o.x) + "," + f1(o.bird ? y : y + 34 * o.s + 16) + ")");
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
          o.jump = 1.6; o.ty = Math.max(60, o.y - 30);
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
    if (c.stage > before) out = "🎉 <b>" + c.name + "</b>, your " + c.short + " " + kind(c) + ", grew into a <b>" + stageName(c) + "</b>!";
    else out = (isBird(c) ? "🐦 " : "🐟 ") + c.name + " (" + c.short + ") grew a little bigger.";
    var pearls = totalPoints(chs), was = pearls - (pts || 0);
    FRIENDS.forEach(function (f) { if (was < f.at && pearls >= f.at) out += " " + f.e + " A " + f.name.toLowerCase() + " joined your sea!"; });
    return out;
  }

  var api = { render: render, onSolve: onSolve, chapters: chapters };
  if (P) P.aquarium = api;
  if (SC) SC.aquarium = api;
})();
