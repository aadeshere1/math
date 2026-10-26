/*
  Fish sea: the motivation dashboard on the home page.
  One fish per chapter. A fish grows a little with every solved question in its
  chapter and passes five stages: Tiny fry, Little fish, Growing fish, Big fish, King fish (with a crown).
  Points are "pearls". Pearls unlock sea friends (shell, crab, turtle ...).
  Uses only Practice.lessons, Practice.stats(lesson) and Practice.open(id) from engine.js.
*/
(function () {
  "use strict";
  var P = window.Practice; if (!P) return;
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
  var NAMES = ["Bubbles", "Finn", "Splash", "Pearl", "Ziggy", "Marina", "Pip", "Goldie", "Sunny", "Wiggles", "Blue", "Coco", "Dash", "Lulu", "Momo", "Kiki", "Ripple", "Tiki", "Zuzu", "Olly"];
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
  function chapters() {
    var map = {}, out = [];
    P.lessons.forEach(function (l) {
      var n = chapterNum(l), key = n != null ? "c" + n : "u" + (l.unit || l.title);
      if (!map[key]) { map[key] = { num: n, unit: l.unit || l.title, lessons: [], done: 0, total: 0, points: 0 }; out.push(map[key]); }
      var c = map[key], st = P.stats(l);
      c.lessons.push(l); c.done += st.done; c.total += st.total; c.points += st.points;
    });
    out.sort(function (a, b) { return (a.num == null ? 999 : a.num) - (b.num == null ? 999 : b.num); });
    out.forEach(function (c, i) {
      c.idx = i; c.p = c.total ? c.done / c.total : 0; c.stage = stageOf(c.p);
      c.name = NAMES[i % NAMES.length]; c.col = COLORS[i % COLORS.length];
      c.label = c.num != null ? String(c.num) : String(i + 1);
      c.title = (c.num != null ? "Chapter " + c.num : "Chapter") + " · " + c.unit;
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
    for (var i = 0; i < c.lessons.length; i++) { var st = P.stats(c.lessons[i]); if (st.done < st.total) return c.lessons[i]; }
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

  /* ---------- the scene ---------- */
  var H = 420, SAND = 70, running = null;

  function render() {
    var chs = chapters(), pearls = totalPoints(chs);
    var memo = store("practice:sea") || null;
    var grown = [], friendsNew = [];
    var unlocked = FRIENDS.filter(function (f) { return pearls >= f.at; });
    if (memo) {
      chs.forEach(function (c) { var was = memo.stages && memo.stages[c.label]; if (was != null && c.stage > was) grown.push(c); });
      unlocked.forEach(function (f) { if ((memo.pearls || 0) < f.at) friendsNew.push(f); });
    }
    var stages = {}; chs.forEach(function (c) { stages[c.label] = c.stage; });
    store("practice:sea", { stages: stages, pearls: pearls });

    var kings = chs.filter(function (c) { return c.stage === 4; }).length;
    var nextF = FRIENDS.filter(function (f) { return pearls < f.at; })[0];
    var prevAt = unlocked.length ? unlocked[unlocked.length - 1].at : 0;
    var st = streak();

    var wrap = E("section", { class: "sea-wrap", "aria-label": "Your fish sea" });
    var chips = E("div", { class: "sea-chips" }, [
      E("span", { class: "sea-chip" }, [E("b", { text: commas(pearls) }), " pearls"]),
      E("span", { class: "sea-chip" }, [E("b", { text: kings + " of " + chs.length }), " King fish"]),
      E("span", { class: "sea-chip" + (st ? " hot" : "") }, [E("b", { text: st ? "🔥 " + st : "0" }), st === 1 ? " day streak" : " day streak"]),
      nextF ? E("span", { class: "sea-chip next" }, [
        E("span", { class: "sea-next-e", text: nextF.e }),
        E("span", { class: "sea-next-t" }, [E("span", { text: "Next friend: " + nextF.name }),
          E("span", { class: "sea-mini" }, [E("span", { style: "width:" + Math.round(100 * (pearls - prevAt) / (nextF.at - prevAt)) + "%" })]),
          E("span", { class: "sea-mini-t", text: (nextF.at - pearls) + " pearls to go" })])
      ]) : E("span", { class: "sea-chip" }, ["All sea friends found! 🌊"])
    ]);
    var head = E("div", { class: "sea-head" }, [
      E("div", {}, [E("h2", { text: "Your fish sea" }),
        E("p", { class: "sea-sub", text: "Every chapter has a fish. Solve questions to feed it and watch it grow into a King fish. Tap a fish to meet it." })]),
      chips
    ]);
    wrap.appendChild(head);

    var msgs = [];
    grown.slice(0, 3).forEach(function (c) { msgs.push("🎉 " + c.name + " (Chapter " + c.label + ") grew into a " + STAGES[c.stage] + "!"); });
    friendsNew.slice(0, 2).forEach(function (f) { msgs.push(f.e + " A " + f.name.toLowerCase() + " joined your sea!"); });
    if (msgs.length) wrap.appendChild(E("div", { class: "sea-toast", role: "status" }, msgs.map(function (m) { return E("p", { text: m }); })));

    var box = E("div", { class: "sea-box" });
    var svg = S("svg", { class: "sea", role: "img", "aria-label": "Sea with " + chs.length + " chapter fish", preserveAspectRatio: "xMidYMid meet" });
    box.appendChild(svg);
    var card = E("div", { class: "sea-card", hidden: "hidden" });
    box.appendChild(card);
    wrap.appendChild(box);

    // fish list for keyboard and screen readers
    var list = E("div", { class: "sea-list" }, chs.map(function (c) {
      return E("button", { type: "button", class: "sea-pill", style: "--fc:" + c.col[0], onclick: function () { showCard(c); } }, [
        E("span", { class: "sea-dot", text: c.label }), c.name + " · " + STAGES[c.stage] + (c.stage === 4 ? " 👑" : "")
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
      card.appendChild(E("p", { class: "sea-stage", text: STAGES[c.stage] }));
      card.appendChild(E("span", { class: "sea-meter" }, [E("span", { style: "width:" + Math.round(100 * c.p) + "%;background:" + c.col[0] })]));
      card.appendChild(E("p", { class: "sea-card-st", text: c.done + " of " + c.total + " questions solved · " + commas(c.points) + " pearls" }));
      card.appendChild(E("p", { class: "sea-card-say", text: need ? "Solve " + need + " more question" + (need === 1 ? "" : "s") + " and I become a " + STAGES[c.stage + 1] + "!" : "I am the King of the sea! Thank you for feeding me." }));
      card.appendChild(E("button", { type: "button", class: "btn primary small", text: (need ? "Feed " + c.name + ": " : "Visit ") + nl.title + " →", onclick: function () { P.open(nl.id); } }));
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
      S("linearGradient", { id: "seaG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#8be0f7" }), S("stop", { offset: ".45", "stop-color": "#2f9bd6" }), S("stop", { offset: "1", "stop-color": "#0e4c8c" })]),
      S("linearGradient", { id: "sandG", x1: 0, y1: 0, x2: 0, y2: 1 }, [
        S("stop", { offset: "0", "stop-color": "#f7dfa8" }), S("stop", { offset: "1", "stop-color": "#dcb56f" })])
    ]));
    [stat, bedL, swimL, fishL, bubL, tagL].forEach(function (g) { svg.appendChild(g); });

    var fish = chs.map(function (c, i) {
      var d = drawFish(c), g = S("g", { class: "sea-fish", tabindex: "-1" }, [d.body]);
      var tag = S("g", { class: "sea-tag" }, [S("circle", { r: 11, fill: "#fff", stroke: c.col[1], "stroke-width": 2.5 }),
        S("text", { "text-anchor": "middle", dy: "0.35em", fill: "#1b2a3a" }, [document.createTextNode(c.label)])]);
      var shine = S("g", { class: "sea-shine" });
      g.appendChild(shine);
      fishL.appendChild(g); tagL.appendChild(tag);
      var o = { c: c, g: g, tag: tag, tail: d.tail, shine: shine, s: sizeOf(c.p), dir: Math.random() < 0.5 ? -1 : 1, face: 1, x: 0, y: 0, ty: 0,
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
      stat.appendChild(S("rect", { width: W, height: H, fill: "url(#seaG)" }));
      for (var i = 0; i < 4; i++) {
        var x = W * (0.12 + i * 0.26);
        stat.appendChild(S("path", { class: "sea-ray r" + i, d: "M" + f1(x) + " 0 L" + f1(x + 60) + " 0 L" + f1(x + 170) + " " + (H - SAND) + " L" + f1(x + 70) + " " + (H - SAND) + " Z", fill: "#fff" }));
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
        else if (fr.kind === "swim") { sw.y = H * fr.y + 20; sw.sp = fr.big ? 14 : 24; swimL.appendChild(g); }
        else if (fr.kind === "float") { sw.y = H * 0.35; sw.sp = 8; swimL.appendChild(g); }
        else { sw.x = W * (fr.x || 0.6); sw.y = H - SAND + 18; sw.sp = 0; bedL.appendChild(g); }
        swimmers.push(sw);
      });
      var k = Math.max(0.62, Math.min(1, W / 820));
      fish.forEach(function (o, i) {
        o.s = sizeOf(o.c.p) * k;
        if (first) {
          o.x = rnd(70, W - 70);
          o.ty = o.y = 60 + (i % 6) * ((H - SAND - 110) / 5) + rnd(-12, 12);
        } else { o.x = Math.min(Math.max(o.x, 70), W - 70); }
      });
      draw(0);
    }

    function draw(dt) {
      var top = 48, bot = H - SAND - 34;
      fish.forEach(function (o) {
        if (dt) {
          o.next -= dt;
          if (o.next <= 0) { o.next = rnd(2, 5); o.ty = rnd(top, bot); if (Math.random() < 0.25) o.dir = -o.dir; }
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
        o.tail.setAttribute("transform", "rotate(" + f1(Math.sin(t * (7 - 2 * o.c.p) + o.ph) * 16) + ")");
        o.tag.setAttribute("transform", "translate(" + f1(o.x) + "," + f1(y + 34 * o.s + 16) + ")");
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
          if (b._y < -10) bubL.removeChild(b);
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
    if (c.stage > before) out = "🎉 <b>" + c.name + "</b>, your Chapter " + c.label + " fish, grew into a <b>" + STAGES[c.stage] + "</b>!";
    else out = "🐟 " + c.name + " (Chapter " + c.label + ") grew a little bigger.";
    var pearls = totalPoints(chs), was = pearls - (pts || 0);
    FRIENDS.forEach(function (f) { if (was < f.at && pearls >= f.at) out += " " + f.e + " A " + f.name.toLowerCase() + " joined your sea!"; });
    return out;
  }

  P.aquarium = { render: render, onSolve: onSolve, chapters: chapters };
})();
