/*
  Picture pack for "Earth and Space" (11.2 the solar system, 11.3 structure of the earth).
  Adds moving drawings to Science.figures, in the same style as figures-earth.js.
  Every figure takes a spec and opts ({ small: true } inside help steps) and returns an element.
  Moving pictures stop by themselves when they leave the page, and stand still when the device asks for less motion.
*/
(function () {
  "use strict";
  var S = window.Shared, el = S.el, sv = S.svg, F = window.Science.figures, f = S.f;
  var RM = S.reduceMotion, uid = 0;

  function frame(w, h, label, cls) {
    return sv("svg", { viewBox: "0 0 " + w + " " + h, class: "sfig" + (cls ? " " + cls : ""), role: "img", "aria-label": label });
  }
  function txt(x, y, s, cls, extra) {
    var a = { x: x, y: y, class: cls || "lbl" }; for (var k in extra || {}) a[k] = extra[k];
    return sv("text", a, [s]);
  }
  function wrap(svgNode, buttons, caption, opts) {
    var kids = [svgNode];
    if (caption && !(opts && opts.small)) kids.push(caption);
    if (buttons && buttons.length && !(opts && opts.small)) kids.push(el("div", { class: "fig-ctrl" }, buttons));
    return el("div", { class: "fig-box" }, kids);
  }
  function btn(label, fn) { return el("button", { type: "button", class: "tool-btn", onclick: fn }, [label]); }
  function cap(t) { return el("p", { class: "fig-cap", text: t }); }
  function seeded(seed) { var x = seed || 7; return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
  function set(n, a) { for (var k in a) n.setAttribute(k, a[k]); }
  function tr(n, x, y, extra) { n.setAttribute("transform", "translate(" + f(x) + "," + f(y) + ")" + (extra || "")); }
  // Run fn(seconds) every frame while the picture is on the page. Without motion: draw once.
  function loop(node, fn) {
    fn(0);
    if (RM) return { stop: function () {} };
    var t0 = null, seen = false, born = Date.now(), stopped = false;
    function step(ts) {
      if (stopped) return;
      if (node.isConnected) seen = true;
      else if (seen || Date.now() - born > 8000) return;
      if (t0 === null) t0 = ts;
      if (!document.hidden && seen) fn((ts - t0) / 1000);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    return { stop: function () { stopped = true; } };
  }
  function stars(s, w, h, n, seed) {
    var r = seeded(seed || 9), g = sv("g", { class: "stars" });
    for (var i = 0; i < n; i++) g.appendChild(sv("circle", { cx: f(r() * w), cy: f(r() * h), r: f(0.4 + r() * 1.1), class: "star s" + (i % 3) }));
    s.appendChild(g);
  }

  /* ---------- planets ---------- */
  var PL = {
    Mercury: { col: "#a29d97", rot: "59 days", orbit: "88 days", moons: 0, note: "The smallest planet and the closest to the sun. No air (atmosphere). Very hot by day, very cold at night." },
    Venus: { col: "#e5c07b", rot: "243 days", orbit: "225 days", moons: 0, note: "The brightest and the hottest planet. Thick carbon dioxide air. Called the morning or evening star, and the earth's twin." },
    Earth: { col: "#3a7bd5", rot: "24 hours", orbit: "365 days", moons: 1, note: "Our home, the blue planet. It has water and air, so living things can survive." },
    Mars: { col: "#c9502d", rot: "24.5 hours", orbit: "687 days", moons: 2, note: "The red planet. Two moons: Phobos and Deimos. There may be living things on it." },
    Jupiter: { col: "#d8b48c", rot: "10 hours", orbit: "12 years", moons: 95, note: "The largest planet. A big spot and coloured cloud bands. The most moons." },
    Saturn: { col: "#e3c98a", rot: "10.5 hours", orbit: "29.5 years", moons: 146, note: "The second-largest planet, with rings. So light it could float on water." },
    Uranus: { col: "#a6e4ee", rot: "17 hours 14 minutes", orbit: "84 years", moons: 28, note: "The third-largest planet. It has 13 rings. Very cold." },
    Neptune: { col: "#3557c7", rot: "16 hours", orbit: "164 years", moons: 16, note: "The farthest planet from the sun. Very cold. Blue, like its twin Uranus." },
    Moon: { col: "#cfd3d8" }, Pluto: { col: "#c9a27e" }, Eris: { col: "#b9bcc0" }, Sun: { col: "#ffc93c" }
  };
  var ORDER = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
  function planet(name, r) {
    var id = "spc" + (++uid), c = PL[name].col, g = sv("g", { class: "planet p-" + name.toLowerCase() });
    g.appendChild(sv("clipPath", { id: id }, [sv("circle", { r: r })]));
    var inner = sv("g", { "clip-path": "url(#" + id + ")" });
    if (name === "Saturn") g.appendChild(sv("ellipse", { rx: f(r * 2.1), ry: f(r * 0.55), class: "ring back", transform: "rotate(-14)" }));
    inner.appendChild(sv("circle", { r: r, fill: c }));
    var rr = seeded(name.length * 13 + 3);
    if (name === "Jupiter" || name === "Saturn") {
      [-0.55, -0.2, 0.15, 0.5].forEach(function (y, i) { inner.appendChild(sv("rect", { x: -r, y: f(y * r), width: 2 * r, height: f(r * 0.16), fill: i % 2 ? "#b07a52" : "#f2dcc0", opacity: 0.8 })); });
      if (name === "Jupiter") inner.appendChild(sv("ellipse", { cx: f(r * 0.3), cy: f(r * 0.3), rx: f(r * 0.22), ry: f(r * 0.13), fill: "#c4553a" }));
    } else if (name === "Earth") {
      [[-0.3, -0.3, 0.38, 0.28], [0.35, 0.1, 0.3, 0.42], [-0.45, 0.45, 0.25, 0.18]].forEach(function (b) { inner.appendChild(sv("ellipse", { cx: f(b[0] * r), cy: f(b[1] * r), rx: f(b[2] * r), ry: f(b[3] * r), fill: "#4caf50" })); });
      inner.appendChild(sv("ellipse", { cx: 0, cy: f(-r * 0.95), rx: f(r * 0.6), ry: f(r * 0.2), fill: "#fff", opacity: 0.85 }));
    } else if (name === "Mars") {
      [[-0.3, -0.2, 0.35], [0.3, 0.35, 0.25]].forEach(function (b) { inner.appendChild(sv("circle", { cx: f(b[0] * r), cy: f(b[1] * r), r: f(b[2] * r), fill: "#8f3420", opacity: 0.55 })); });
    } else if (name === "Venus") {
      [-0.4, 0.05, 0.45].forEach(function (y) { inner.appendChild(sv("path", { d: "M" + f(-r) + " " + f(y * r) + " q" + f(r * 0.6) + " " + f(-r * 0.25) + " " + f(r) + " 0 t" + f(r) + " 0", stroke: "#fff3d6", "stroke-width": f(r * 0.12), fill: "none", opacity: 0.6 })); });
    } else if (name === "Mercury" || name === "Moon" || name === "Eris" || name === "Pluto") {
      for (var i = 0; i < 6; i++) inner.appendChild(sv("circle", { cx: f((rr() - 0.5) * 1.4 * r), cy: f((rr() - 0.5) * 1.4 * r), r: f(r * (0.08 + rr() * 0.14)), fill: "#000", opacity: 0.16 }));
      if (name === "Pluto") inner.appendChild(sv("ellipse", { cx: f(r * 0.2), cy: f(r * 0.25), rx: f(r * 0.4), ry: f(r * 0.3), fill: "#f2dcc4", opacity: 0.8 }));
    } else if (name === "Neptune") {
      inner.appendChild(sv("ellipse", { cx: f(-r * 0.2), cy: f(-r * 0.2), rx: f(r * 0.3), ry: f(r * 0.12), fill: "#1d3a96" }));
    }
    inner.appendChild(sv("circle", { cx: f(r * 0.55), cy: f(r * 0.35), r: f(r * 1.05), fill: "#000", opacity: 0.28 }));
    inner.appendChild(sv("circle", { cx: f(-r * 0.35), cy: f(-r * 0.35), r: f(r * 0.32), fill: "#fff", opacity: 0.18 }));
    g.appendChild(inner);
    if (name === "Saturn") g.appendChild(sv("path", { d: "M" + f(-r * 2.1) + " 0 A" + f(r * 2.1) + " " + f(r * 0.55) + " 0 0 0 " + f(r * 2.1) + " 0", class: "ring front", transform: "rotate(-14)" }));
    return g;
  }
  function sunG(r, glow) {
    var gid = "sgl" + (++uid);
    return sv("g", { class: "sun-g" }, [
      glow === false ? null : sv("radialGradient", { id: gid }, [sv("stop", { offset: "0.55", "stop-color": "#ffd23f", "stop-opacity": "0.55" }), sv("stop", { offset: "1", "stop-color": "#ffd23f", "stop-opacity": "0" })]),
      glow === false ? null : sv("circle", { r: f(r * 1.6), class: "sun-glow pulse", fill: "url(#" + gid + ")" }),
      sv("circle", { r: r, class: "sun-body" }),
      sv("circle", { cx: f(-r * 0.3), cy: f(-r * 0.3), r: f(r * 0.45), fill: "#fff6c8", opacity: 0.45 })
    ]);
  }
  function factText(n) { var p = PL[n]; return n + ": spins once in " + p.rot + ", goes around the sun in " + p.orbit + ", " + p.moons + (p.moons === 1 ? " moon" : " moons") + ". " + p.note; }

  /* 1. The solar system: the sun in the middle, 8 planets going around on their orbits */
  F.solar = function (spec, opts) {
    var W = 520, H = 330, cx = 260, cy = 165;
    var s = frame(W, H, "The solar system: the sun in the centre and eight planets going around it: Mercury, Venus, Earth, Mars, then the asteroid belt, then Jupiter, Saturn, Uranus and Neptune.", "space");
    stars(s, W, H, 70, 4);
    var RX = [44, 60, 77, 94, 146, 178, 207, 234], RAD = [3.5, 5.5, 6, 4.5, 13, 10.5, 8, 8], K = 0.45, PER = [6, 10, 14, 20, 40, 60, 80, 100];
    var orbits = sv("g", { class: "orbits" });
    RX.forEach(function (rx) { orbits.appendChild(sv("ellipse", { cx: cx, cy: cy, rx: rx, ry: f(rx * K), class: "orbit" })); });
    s.appendChild(orbits);
    var belt = sv("g", { class: "belt" + (spec.focus === "belt" ? " hot" : "") }), rb = seeded(21), rocks = [];
    for (var i = 0; i < 110; i++) {
      var a = rb() * Math.PI * 2, rx = 110 + rb() * 18;
      var c = sv("circle", { r: f(0.7 + rb() * 1.3), class: "rock-dot" }); belt.appendChild(c); rocks.push({ c: c, a: a, rx: rx });
    }
    var back = sv("g"), mid = sv("g"), front = sv("g"), labels = sv("g", { class: "pl-labels" });
    s.appendChild(back); s.appendChild(belt); s.appendChild(mid);
    var sun = sunG(17); tr(sun, cx, cy); mid.appendChild(sun);
    s.appendChild(front); s.appendChild(labels);
    var caption = cap(spec.focus === "belt" ? "The asteroid belt (rocks) lies between Mars and Jupiter." : "Tap a planet to learn about it.");
    var ps = ORDER.map(function (n, k) {
      var g = planet(n, RAD[k]), hit = sv("g", { class: "pl-hit", tabindex: "0", role: "button", "aria-label": n }, [g, sv("circle", { r: RAD[k] + 7, class: "hit" })]);
      var grp = spec.groups ? (k < 4 ? " inner" : " outer") : "";
      var lb = txt(0, 0, n, "lbl mid light small pl-name" + grp);
      function pick() { caption.textContent = factText(n); S.speak(factText(n)); ps.forEach(function (q) { q.hit.classList.toggle("sel", q.n === n); }); }
      hit.addEventListener("click", pick); hit.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      labels.appendChild(lb); front.appendChild(hit);
      return { n: n, hit: hit, lb: lb, rx: RX[k], r: RAD[k], per: PER[k], a0: k * 1.7 + 0.6, side: 0 };
    });
    if (spec.focus === "belt" || spec.groups) s.classList.add("dim-some");
    if (spec.groups) {
      s.appendChild(txt(12, 22, "● Inner planets: small, rocky, hotter", "lbl small inner"));
      s.appendChild(txt(12, 38, "● Outer planets: large, colder", "lbl small outer"));
      s.appendChild(txt(12, 54, "● Asteroid belt: the border", "lbl small beltc"));
    }
    if (spec.focus === "belt") { s.appendChild(txt(cx, 28, "Asteroid belt: between Mars and Jupiter", "lbl mid light strong")); }
    var paused = false, tp = 0, last = 0;
    loop(s, function (t) {
      if (!paused) tp += t - last; last = t;
      ps.forEach(function (p) {
        var a = p.a0 + tp * Math.PI * 2 / p.per, x = cx + p.rx * Math.cos(a), y = cy + p.rx * K * Math.sin(a);
        var side = Math.sin(a) < 0 ? -1 : 1;
        if (side !== p.side) { (side < 0 ? back : front).appendChild(p.hit); p.side = side; }
        tr(p.hit, x, y); set(p.lb, { x: f(x), y: f(y + p.r + 10) });
      });
      rocks.forEach(function (k) { var a = k.a + tp * 0.05; set(k.c, { cx: f(cx + k.rx * Math.cos(a)), cy: f(cy + k.rx * K * Math.sin(a)) }); });
    });
    var pb = btn("⏸ Pause", function () { paused = !paused; pb.textContent = paused ? "▶ Play" : "⏸ Pause"; });
    return wrap(s, RM ? null : [pb], caption, opts);
  };

  /* 2. Planet cards: a picture and the facts of each planet */
  F.planets = function (spec, opts) {
    var names = spec.names || ORDER;
    return el("div", { class: "planet-cards" + (opts.small ? " small" : "") }, names.map(function (n, i) {
      var p = PL[n], s = frame(90, 70, n, "space mini");
      var g = planet(n, n === "Saturn" ? 17 : 24); tr(g, 45, 35); s.appendChild(g);
      var rows = [el("b", { class: "pc-name", text: n })];
      if (p.rot) {
        rows.push(el("span", { class: "pc-row" }, ["🔄 Spins once: ", el("b", { text: p.rot })]));
        rows.push(el("span", { class: "pc-row" }, ["☀️ Around the sun: ", el("b", { text: p.orbit })]));
        rows.push(el("span", { class: "pc-row" }, ["🌙 Moons: ", el("b", { text: String(p.moons) })]));
        if (!opts.small) rows.push(el("span", { class: "pc-note", text: p.note }));
      } else if (spec.notes && spec.notes[n]) rows.push(el("span", { class: "pc-note", text: spec.notes[n] }));
      return el("button", { type: "button", class: "planet-card", style: "--d:" + (i * 0.12) + "s", onclick: function () { S.speak(p.rot ? factText(n) : n + ". " + ((spec.notes || {})[n] || "")); } }, [s, el("span", { class: "pc-text" }, rows)]);
    }));
  };

  /* 3. How big is the sun? A giant wall of sun beside the small earth and the tiny moon */
  F.sizes = function (spec, opts) {
    var s = frame(520, 240, "The sun is about 109 times wider than the earth. The moon is much smaller than the earth.", "space");
    stars(s, 520, 240, 40, 2);
    s.appendChild(sv("circle", { cx: -1180, cy: 120, r: 1308, class: "sun-body" }));
    var e = planet("Earth", 12); tr(e, 330, 120); s.appendChild(e);
    var m = planet("Moon", 3.3); tr(m, 400, 120); s.appendChild(m);
    s.appendChild(txt(12, 30, "the sun (a star)", "lbl strong"));
    s.appendChild(txt(330, 150, "earth", "lbl mid light"));
    s.appendChild(txt(400, 140, "moon", "lbl mid light"));
    s.appendChild(txt(300, 196, "The sun is about 109 times wider than the earth.", "lbl mid light"));
    s.appendChild(txt(300, 214, "About 1 million earths could fit inside the sun.", "lbl mid light"));
    s.appendChild(txt(300, 232, "About 50 moons could fit inside the earth.", "lbl mid light"));
    return wrap(s, null, null, opts);
  };

  /* a turning earth seen from the side: land moves across the ball */
  function turningEarth(r, tilt) {
    var id = "spc" + (++uid), g = sv("g", { transform: "rotate(" + (tilt || 0) + ")" });
    g.appendChild(sv("clipPath", { id: id }, [sv("circle", { r: r })]));
    var inner = sv("g", { "clip-path": "url(#" + id + ")" });
    inner.appendChild(sv("circle", { r: r, fill: "#3a7bd5" }));
    var land = sv("g"), blobs = [[-0.4, -0.35, 0.45, 0.3], [0.5, 0.15, 0.35, 0.45], [1.3, -0.3, 0.4, 0.3], [1.6, 0.45, 0.3, 0.2]];
    [0, 1].forEach(function (copy) { blobs.forEach(function (b) { land.appendChild(sv("ellipse", { cx: f((b[0] + copy * 2.4) * r), cy: f(b[1] * r), rx: f(b[2] * r), ry: f(b[3] * r), fill: "#4caf50" })); }); });
    inner.appendChild(land);
    inner.appendChild(sv("ellipse", { cx: 0, cy: f(-r), rx: f(r * 0.6), ry: f(r * 0.22), fill: "#fff", opacity: 0.85 }));
    inner.appendChild(sv("circle", { cx: f(r * 0.6), cy: f(r * 0.3), r: f(r * 1.05), fill: "#000", opacity: 0.14 }));
    g.appendChild(inner);
    g.appendChild(sv("line", { x1: 0, y1: f(-r * 1.4), x2: 0, y2: f(r * 1.4), class: "axis" }));
    return { g: g, turn: function (t, speed) { var x = -((t * (speed || 0.5) * r) % (2.4 * r)); tr(land, x, 0); } };
  }

  /* 4. Two motions of the earth: rotation (spin) and revolution (around the sun) */
  F.motion = function (spec, opts) {
    var s = frame(520, 270, "The earth spins on its axis (rotation, one day) and goes around the sun (revolution, one year).", "space");
    stars(s, 520, 270, 50, 6);
    var cx = 260, cy = 140, rx = 190, ry = 82;
    s.appendChild(sv("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, class: "orbit bright" }));
    var sun = sunG(26); tr(sun, cx, cy); s.appendChild(sun);
    var E = turningEarth(17, 23.5), eg = sv("g", {}, [E.g, sv("path", { d: "M-24 -30 a30 30 0 0 1 48 0", class: "spin-arrow" }), sv("path", { d: "M20 -34 l4 4 l-6 1", class: "spin-arrow" })]);
    s.appendChild(eg);
    s.appendChild(txt(12, 22, "🔄 Rotation: the earth spins on its axis. One turn = 1 day (24 hours).", "lbl light"));
    s.appendChild(txt(12, 258, "☀️ Revolution: the earth goes around the sun on its orbit. One round = 1 year (365¼ days).", "lbl light"));
    loop(s, function (t) {
      var a = Math.PI / 2 + t * Math.PI * 2 / 16;
      tr(eg, cx + rx * Math.cos(a), cy + ry * Math.sin(a));
      E.turn(t, 1.2);
    });
    return wrap(s, null, null, opts);
  };

  /* 5. The sun, the earth and the moon: the moon goes around the earth, the earth goes around the sun */
  F.sem = function (spec, opts) {
    var s = frame(520, 300, "The sun is in the centre. The earth goes around the sun. The moon goes around the earth.", "space");
    stars(s, 520, 300, 60, 8);
    var cx = 260, cy = 150, rx = 190, ry = 108;
    s.appendChild(sv("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, class: "orbit bright" }));
    var sun = sunG(34); tr(sun, cx, cy); s.appendChild(sun);
    s.appendChild(txt(cx, cy + 52, "Sun: a star, in the centre", "lbl mid light strong"));
    var mo = sv("circle", { r: 30, class: "orbit moon-orbit" }), e = planet("Earth", 12), m = planet("Moon", 4.5);
    var eg = sv("g", {}, [mo, e]); s.appendChild(eg); s.appendChild(m);
    var el1 = txt(0, 0, "Earth: a planet", "lbl mid light"), el2 = txt(0, 0, "Moon: a satellite", "lbl mid light small");
    s.appendChild(el1); s.appendChild(el2);
    s.appendChild(txt(10, 20, "Sun → Earth: about 150,000,000 km", "lbl light small"));
    s.appendChild(txt(10, 34, "Earth → Moon: 384,400 km", "lbl light small"));
    loop(s, function (t) {
      var a = 2.3 + t * Math.PI * 2 / 24, ex = cx + rx * Math.cos(a), ey = cy + ry * Math.sin(a);
      var b = t * Math.PI * 2 / 2.2, mx = ex + 30 * Math.cos(b), my = ey + 30 * Math.sin(b);
      tr(eg, ex, ey); set(m, { transform: "translate(" + f(mx) + "," + f(my) + ")" });
      set(el1, { x: f(ex), y: f(ey + 46) }); set(el2, { x: f(mx), y: f(my - 9) });
    });
    return wrap(s, null, null, opts);
  };

  /* 6. Day and night: the earth turns. Seen from above the North Pole, sunlight comes from the left. */
  F.daynight = function (spec, opts) {
    var s = frame(520, 300, "Day and night. Sunlight comes from the left. The earth turns. The half facing the sun has day; the other half has night. Morning when a place enters the light, evening when it leaves the light.", "space");
    stars(s, 520, 300, 40, 12);
    var sun = sunG(70, false); tr(sun, -30, 150); s.appendChild(sun);
    for (var i = 0; i < 6; i++) s.appendChild(sv("line", { x1: 60, y1: 50 + i * 40, x2: 215, y2: 50 + i * 40, class: "ray-line" }));
    var cx = 330, cy = 150, R = 100, id = "spc" + (++uid);
    s.appendChild(sv("clipPath", { id: id }, [sv("circle", { cx: cx, cy: cy, r: R })]));
    var globe = sv("g", { "clip-path": "url(#" + id + ")" });
    globe.appendChild(sv("circle", { cx: cx, cy: cy, r: R, fill: "#3a7bd5" }));
    var spin = sv("g");
    [[-40, -40, 34, 22], [30, -50, 24, 18], [50, 30, 36, 26], [-30, 50, 28, 20], [-70, 5, 16, 24], [10, 75, 18, 12]].forEach(function (b) { spin.appendChild(sv("ellipse", { cx: cx + b[0], cy: cy + b[1], rx: b[2], ry: b[3], fill: "#4caf50" })); });
    var home = sv("g", {}, [sv("circle", { cx: cx + 80, cy: cy, r: 9, class: "home-dot" }), txt(cx + 80, cy + 4, "🏠", "emo-mid", { "font-size": 12, "text-anchor": "middle" })]);
    spin.appendChild(home);
    globe.appendChild(spin);
    globe.appendChild(sv("path", { d: "M" + cx + " " + (cy - R) + " A" + R + " " + R + " 0 0 1 " + cx + " " + (cy + R) + " Z", class: "night" }));
    s.appendChild(globe);
    s.appendChild(sv("circle", { cx: cx, cy: cy, r: 4, fill: "#fff" }));
    s.appendChild(txt(cx + 6, cy - 6, "N", "lbl light small"));
    s.appendChild(txt(cx, cy - R - 10, "morning ↓ (entering the light)", "lbl mid light"));
    s.appendChild(txt(cx, cy + R + 18, "evening ↑ (leaving the light)", "lbl mid light"));
    s.appendChild(txt(cx - R - 8, cy + 4, "noon", "lbl end light strong"));
    s.appendChild(txt(cx + R + 8, cy + 4, "night", "lbl light strong"));
    s.appendChild(txt(12, 290, "Seen from above the North Pole. The earth turns once in 24 hours.", "lbl light small"));
    var caption = cap("The half facing the sun has day. The other half has night.");
    var lastPart = "";
    loop(s, function (t) {
      var deg = -(t * 360 / 14) % 360;
      set(spin, { transform: "rotate(" + f(deg) + " " + cx + " " + cy + ")" });
      var a = ((-deg % 360) + 360) % 360; // where the house is, anticlockwise from the right
      var part = a < 80 || a > 340 ? "🌙 Night at the house." : a < 110 ? "🌅 Morning: the house is entering the light." : a < 250 ? "☀️ Day at the house." : "🌇 Evening: the house is leaving the light.";
      if (part !== lastPart && !RM) { caption.textContent = part; lastPart = part; }
    });
    return wrap(s, null, caption, opts);
  };

  /* 7. Axis and tilt: the axis leans 23.5° from the upright line */
  F.tilt = function (spec, opts) {
    var s = frame(420, 300, "The earth's axis is an imaginary line through the North and South Poles. It leans about 23.5 degrees from the upright line. The earth spins around its axis.", "space");
    stars(s, 420, 300, 40, 14);
    var cx = 210, cy = 150, R = 78;
    s.appendChild(sv("ellipse", { cx: cx, cy: cy, rx: 190, ry: 26, class: "orbit bright" }));
    s.appendChild(txt(400, cy + 40, "orbit (plane of ecliptic)", "lbl end light small"));
    s.appendChild(sv("line", { x1: cx, y1: cy - 128, x2: cx, y2: cy + 128, class: "upright" }));
    var E = turningEarth(R, 23.5); tr(E.g, cx, cy, " rotate(23.5)"); s.appendChild(E.g);
    s.appendChild(sv("ellipse", { cx: 0, cy: 0, rx: R, ry: 10, class: "equator", transform: "translate(" + cx + "," + cy + ") rotate(23.5)" }));
    var nx = cx + 112 * Math.sin(23.5 * Math.PI / 180), ny = cy - 112 * Math.cos(23.5 * Math.PI / 180);
    s.appendChild(txt(f(nx + 8), f(ny), "North Pole", "lbl light strong"));
    s.appendChild(txt(f(2 * cx - nx - 8), f(2 * cy - ny + 8), "South Pole", "lbl end light strong"));
    s.appendChild(sv("path", { d: "M" + cx + " " + (cy - 118) + " A118 118 0 0 1 " + f(cx + 118 * Math.sin(0.41)) + " " + f(cy - 118 * Math.cos(0.41)), class: "tilt-arc" }));
    s.appendChild(txt(cx + 26, cy - 122, "23.5° (axial tilt)", "lbl light strong"));
    s.appendChild(txt(cx - 10, cy - 132, "upright line", "lbl end light small"));
    s.appendChild(txt(f(cx - R * Math.cos(0.41) - 6), f(cy - R * Math.sin(0.41) - 4), "equator", "lbl end light small"));
    s.appendChild(txt(12, 290, "Axis: an imaginary line through the poles.", "lbl light small"));
    loop(s, function (t) { E.turn(t, 0.35); });
    return wrap(s, null, null, opts);
  };

  /* 8. Seasons: the earth at four places on its orbit. The axis always leans the same way. */
  var SEAS = [
    { k: "jun", date: "June 21", name: "Summer solstice", x: 70, y: 160,
      t: "June 21, summer solstice: the northern half leans towards the sun. It gets straight rays for a long time: hot summer, the longest day and the shortest night." },
    { k: "sep", date: "September 23", name: "Autumn equinox", x: 260, y: 268,
      t: "September 23, autumn equinox: neither half leans towards the sun. Both halves get equal sunlight: day and night are equal everywhere." },
    { k: "dec", date: "December 22", name: "Winter solstice", x: 450, y: 160,
      t: "December 22, winter solstice: the northern half leans away from the sun. It gets slanted rays for a short time: cold winter, the shortest day and the longest night." },
    { k: "mar", date: "March 22", name: "Spring equinox", x: 260, y: 52,
      t: "March 22, spring equinox: neither half leans towards the sun. Day and night are equal everywhere." }
  ];
  F.seasons = function (spec, opts) {
    var lettered = spec.labels === "E";
    var s = frame(520, 320, "The earth goes around the sun. Its axis always leans the same way. On June 21 the northern half leans towards the sun (summer). On December 22 it leans away (winter). On March 22 and September 23 day and night are equal.", "space");
    stars(s, 520, 320, 50, 16);
    var cx = 260, cy = 160;
    s.appendChild(sv("ellipse", { cx: cx, cy: cy, rx: 190, ry: 108, class: "orbit bright dashed" }));
    [[126, 242, "→"], [394, 242, "→"], [394, 88, "←"], [126, 88, "←"]].forEach(function (a) { s.appendChild(txt(a[0], a[1], a[2], "lbl mid light big")); });
    var sun = sunG(28); tr(sun, cx, cy); s.appendChild(sun);
    s.appendChild(txt(cx, cy + 4, "Sun", "lbl mid strong"));
    var caption = cap(lettered ? "Tap a position of the earth." : "Tap an earth to see its season.");
    var nodes = SEAS.map(function (p, i) {
      var r = 21, ang = Math.atan2(cy - p.y, cx - p.x), id = "spc" + (++uid), g = sv("g", { class: "season-e", tabindex: "0", role: "button", "aria-label": lettered ? "E" + (i + 1) : p.date });
      g.appendChild(sv("circle", { r: r + 8, class: "sel-ring" }));
      g.appendChild(sv("clipPath", { id: id }, [sv("circle", { r: r })]));
      var body = sv("g", { "clip-path": "url(#" + id + ")" }, [sv("circle", { r: r, fill: "#3a7bd5" }),
        sv("ellipse", { cx: -6, cy: -6, rx: 9, ry: 6, fill: "#4caf50" }), sv("ellipse", { cx: 8, cy: 8, rx: 7, ry: 9, fill: "#4caf50" }),
        sv("rect", { x: 0, y: -r, width: r, height: 2 * r, fill: "#061028", opacity: 0.62, transform: "rotate(" + f(ang * 180 / Math.PI + 180) + ")" })]);
      g.appendChild(body);
      g.appendChild(sv("line", { x1: 0, y1: -r - 9, x2: 0, y2: r + 9, class: "axis", transform: "rotate(23.5)" }));
      g.appendChild(sv("line", { x1: -r, y1: 0, x2: r, y2: 0, class: "eq-line", transform: "rotate(23.5)" }));
      g.appendChild(txt(f((r + 12) * Math.sin(0.41)), f(-(r + 12) * Math.cos(0.41)), "N", "lbl mid light small"));
      tr(g, p.x, p.y); s.appendChild(g);
      var ly = p.k === "mar" ? p.y - 4 : p.y + 38, lx = p.k === "mar" ? p.x + 82 : p.x;
      if (lettered) s.appendChild(txt(p.k === "dec" ? p.x - 30 : p.k === "jun" ? p.x + 30 : p.x + 34, p.y - 22, "E" + (i + 1), "lbl mid light big strong"));
      else { s.appendChild(txt(lx, ly, p.date, "lbl mid light strong")); s.appendChild(txt(lx, ly + 13, p.name, "lbl mid light small")); }
      function pick() { nodes.forEach(function (n) { n.classList.toggle("sel", n === g); }); if (lettered) { caption.textContent = "This is E" + (i + 1) + ". Look where its N end leans."; return; } caption.textContent = p.t; S.speak(p.t); }
      g.addEventListener("click", pick); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      g._pick = pick;
      return g;
    });
    if (spec.hl != null && nodes[spec.hl]) nodes[spec.hl].classList.add("sel");
    var timer = null;
    function tour() {
      clearInterval(timer); var i = 0; nodes[0]._pick();
      timer = setInterval(function () { i++; if (i >= 4 || !s.isConnected) { clearInterval(timer); return; } nodes[i]._pick(); }, RM ? 4000 : 4500);
    }
    return wrap(s, lettered ? null : [btn("▶ Go around the sun", tour)], caption, opts);
  };

  /* 9. Seasons and Ritus on one wheel: the year goes round like a clock */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var SEASON4 = [
    { k: "spring", name: "Spring", from: 2, to: 5, col: "#7fd36b", sub: "Mar 1 – May 31", t: "Spring: March 1 to May 31. The spring equinox is on March 21. It slowly gets warmer. In our calendar: mid Falgun to mid Jestha." },
    { k: "summer", name: "Summer", from: 5, to: 8, col: "#ffc93c", sub: "Jun 1 – Aug 31", t: "Summer: June 1 to August 31. The summer solstice is on June 21. It is hot. In our calendar: mid Jestha to mid Bhadra." },
    { k: "autumn", name: "Autumn", from: 8, to: 11, col: "#f08a4b", sub: "Sep 1 – Nov 30", t: "Autumn: September 1 to November 30. The autumn equinox is on September 23. It slowly gets colder. In our calendar: mid Bhadra to mid Mangsir." },
    { k: "winter", name: "Winter", from: 11, to: 14, col: "#7fb8f0", sub: "Dec 1 – Feb 28/29", t: "Winter: December 1 to February 28 or 29. The winter solstice is in December. It is cold. In our calendar: mid Mangsir to mid Falgun." }
  ];
  var RITU = [
    { k: "vasanta", name: "Vasanta", en: "spring", m: "Chaitra–Baisakh", from: 2.5, to: 4.5, col: "#ffb3d1" },
    { k: "grishma", name: "Grishma", en: "summer", m: "Jestha–Asar", from: 4.5, to: 6.5, col: "#ff9a6b" },
    { k: "varsha", name: "Varsha", en: "monsoon", m: "Srawan–Bhadra", from: 6.5, to: 8.5, col: "#6fb6ff" },
    { k: "sharad", name: "Sharad", en: "autumn", m: "Asoj–Kartik", from: 8.5, to: 10.5, col: "#ffd27a" },
    { k: "hemanta", name: "Hemanta", en: "early winter", m: "Mangsir–Poush", from: 10.5, to: 12.5, col: "#b7d6f5" },
    { k: "shishir", name: "Shishir", en: "late winter", m: "Magh–Falgun", from: 12.5, to: 14.5, col: "#c9b6f2" }
  ];
  var RITU_RANGE = { vasanta: "mid-March to mid-May", grishma: "mid-May to mid-July", varsha: "mid-July to mid-September", sharad: "mid-September to mid-November", hemanta: "mid-November to mid-January", shishir: "mid-January to mid-March" };
  function arcPath(cx, cy, r0, r1, m0, m1) {
    function pt(r, m) { var a = (-90 + m * 30) * Math.PI / 180; return f(cx + r * Math.cos(a)) + " " + f(cy + r * Math.sin(a)); }
    var big = (m1 - m0) * 30 > 180 ? 1 : 0;
    return "M" + pt(r1, m0) + " A" + r1 + " " + r1 + " 0 " + big + " 1 " + pt(r1, m1) + " L" + pt(r0, m1) + " A" + r0 + " " + r0 + " 0 " + big + " 0 " + pt(r0, m0) + " Z";
  }
  function at(cx, cy, r, m) { var a = (-90 + m * 30) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  F.wheel = function (spec, opts) {
    var show = spec.show || "both", s = frame(380, 380, "A year wheel. Outer ring: the four seasons. Inner ring: the six Ritus of the Nepali calendar, two months each.", "wheel");
    var cx = 190, cy = 190, caption = cap(show === "ritu" ? "Tap a Ritu." : show === "season" ? "Tap a season." : "Tap a season or a Ritu.");
    var segs = [];
    function seg(d, col, label, say, key) {
      var p = sv("path", { d: d, fill: col, class: "wseg" + (spec.hl === key ? " sel" : ""), tabindex: "0", role: "button", "aria-label": label });
      function pick() { segs.forEach(function (q) { q.classList.toggle("sel", q === p); }); caption.textContent = say; S.speak(say); }
      p.addEventListener("click", pick); p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      segs.push(p); s.appendChild(p); return p;
    }
    MONTHS.forEach(function (m, i) {
      var q = at(cx, cy, 178, i + 0.5);
      s.appendChild(txt(f(q[0]), f(q[1] + 3), m, "lbl mid small"));
      var a = at(cx, cy, 170, i), b = at(cx, cy, 160, i);
      s.appendChild(sv("line", { x1: f(a[0]), y1: f(a[1]), x2: f(b[0]), y2: f(b[1]), class: "tick" }));
    });
    if (show !== "ritu") SEASON4.forEach(function (q) {
      var alone = show === "season";
      seg(arcPath(cx, cy, alone ? 60 : 122, 162, q.from, q.to), q.col, q.name, q.t, q.k);
      var mid = (q.from + q.to) / 2, c = at(cx, cy, alone ? 112 : 142, mid);
      s.appendChild(txt(f(c[0]), f(c[1] + (alone ? -1 : 4)), q.name, "lbl mid strong nop"));
      if (alone) s.appendChild(txt(f(c[0]), f(c[1] + 11), q.sub, "lbl mid small nop"));
    });
    if (show !== "season") RITU.forEach(function (q) {
      var say = q.name + " Ritu (" + q.en + "): " + q.m.replace("–", " and ") + ", " + RITU_RANGE[q.k] + ".";
      seg(arcPath(cx, cy, show === "ritu" ? 60 : 62, show === "ritu" ? 162 : 120, q.from, q.to), q.col, q.name + " Ritu", say, q.k);
      var mid = (q.from + q.to) / 2, c = at(cx, cy, show === "ritu" ? 115 : 92, mid);
      s.appendChild(txt(f(c[0]), f(c[1] - 2), q.name, "lbl mid strong nop"));
      s.appendChild(txt(f(c[0]), f(c[1] + 10), q.m, "lbl mid small nop"));
    });
    s.appendChild(sv("circle", { cx: cx, cy: cy, r: show === "both" ? 60 : 58, class: "wheel-mid" }));
    s.appendChild(txt(cx, cy - 4, show === "ritu" ? "6 Ritus" : show === "season" ? "4 Seasons" : "Seasons", "lbl mid strong big nop"));
    s.appendChild(txt(cx, cy + 14, show === "both" ? "and Ritus" : "in a year", "lbl mid nop"));
    return wrap(s, null, caption, opts);
  };

  /* 10. The outside of the earth: water (hydrosphere), land (lithosphere), air (atmosphere) */
  F.spheres = function (spec, opts) {
    var s = frame(480, 250, "Three outer parts of the earth: the atmosphere is air, the lithosphere is land, the hydrosphere is water.");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 480, height: 170, class: "sky" }));
    [[90, 52], [330, 50], [430, 76]].forEach(function (c) { s.appendChild(sv("g", { transform: "translate(" + c[0] + "," + c[1] + ")" }, [sv("g", { class: "drift" }, [sv("ellipse", { rx: 26, ry: 9, fill: "#fff" }), sv("ellipse", { cx: -10, cy: -6, rx: 12, ry: 9, fill: "#fff" }), sv("ellipse", { cx: 8, cy: -8, rx: 14, ry: 10, fill: "#fff" })])])); });
    s.appendChild(sv("path", { d: "M0 175 L60 110 L100 140 L160 70 L220 150 L250 135 L280 175 Z", class: "mountain" }));
    s.appendChild(sv("path", { d: "M148 84 L160 70 L172 86 L164 82 L158 88 Z", fill: "#fff" }));
    s.appendChild(sv("rect", { x: 0, y: 170, width: 300, height: 80, class: "topsoil" }));
    s.appendChild(sv("path", { d: "M280 175 Q300 168 320 172 L480 172 L480 250 L300 250 Z", class: "sea-w" }));
    s.appendChild(sv("path", { d: "M300 190 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0", class: "wave-l" }));
    s.appendChild(txt(240, 22, "Atmosphere: the air around the earth (5 layers)", "lbl mid strong"));
    s.appendChild(txt(130, 214, "Lithosphere: land", "lbl mid light strong"));
    s.appendChild(txt(130, 228, "plains, plateaus, hills, mountains", "lbl mid light small"));
    s.appendChild(txt(392, 214, "Hydrosphere: water", "lbl mid light strong"));
    s.appendChild(txt(392, 228, "oceans, seas, lakes, rivers, ponds", "lbl mid light small"));
    return wrap(s, null, null, opts);
  };

  /* 11. A boiled egg cut in half is like the earth inside */
  F.egg = function (spec, opts) {
    var s = frame(500, 250, "A boiled egg cut in half. The shell is like the crust, the white is like the mantle, the yolk is like the core.");
    s.appendChild(sv("rect", { width: 500, height: 250, fill: "#fff7e8" }));
    var ex = 120, ey = 128;
    s.appendChild(sv("ellipse", { cx: ex, cy: ey, rx: 78, ry: 100, class: "egg-shell" }));
    s.appendChild(sv("ellipse", { cx: ex, cy: ey, rx: 73, ry: 95, class: "egg-white" }));
    s.appendChild(sv("circle", { cx: ex, cy: ey + 8, r: 40, class: "egg-yolk" }));
    var cap1 = sv("g", { class: "egg-cap" }, [sv("ellipse", { cx: ex, cy: ey, rx: 78, ry: 100, class: "egg-whole" }), sv("ellipse", { cx: ex - 24, cy: ey - 40, rx: 14, ry: 24, fill: "#fff", opacity: 0.5 })]);
    s.appendChild(cap1);
    var gx = 390, gy = 128;
    s.appendChild(sv("circle", { cx: gx, cy: gy, r: 92, class: "crust" }));
    s.appendChild(sv("circle", { cx: gx, cy: gy, r: 85, class: "mantle" }));
    s.appendChild(sv("circle", { cx: gx, cy: gy, r: 48, class: "core-o" }));
    s.appendChild(sv("circle", { cx: gx, cy: gy, r: 20, class: "core-i" }));
    [["shell", "crust", 60, 177, 334], ["white", "mantle", 100, 186, 322], ["yolk", "core", 136, 160, 362]].forEach(function (p) {
      s.appendChild(sv("path", { d: "M" + p[3] + " " + p[2] + " L" + p[4] + " " + p[2], class: "lead dashed" }));
      s.appendChild(sv("circle", { cx: p[3], cy: p[2], r: 2.5, fill: "#1b2a3a" })); s.appendChild(sv("circle", { cx: p[4], cy: p[2], r: 2.5, fill: "#1b2a3a" }));
      s.appendChild(txt(255, p[2] - 6, p[0] + " = " + p[1], "lbl mid strong"));
    });
    s.appendChild(txt(ex, 244, "boiled egg", "lbl mid"));
    s.appendChild(txt(gx, 244, "the earth inside", "lbl mid"));
    var caption = cap("The shell is like the crust, the white is like the mantle, the yolk is like the core.");
    function cut() {
      cap1.classList.remove("off"); void cap1.getBoundingClientRect();
      setTimeout(function () { cap1.classList.add("off"); }, RM ? 0 : 400);
    }
    cap1.classList.add("off");
    return wrap(s, [btn("🔪 Cut the egg", cut)], caption, opts);
  };

  /* 12. Inside the earth: crust, mantle, outer core, inner core. Tap a layer. */
  var LAY = [
    { k: "crust", name: "Crust", r0: 128, r1: 136, t: "Crust: the outermost and thinnest layer, about 40 km thick. Solid, hard rocks. Soil, water, coal, oil, natural gas and minerals are found in it. Main elements: oxygen, silicon, aluminium, iron, calcium." },
    { k: "mantle", name: "Mantle", r0: 74, r1: 128, t: "Mantle: the second layer, about 2,900 km thick. Molten rock (peridotite), but kept solid by great pressure. 1,000°C to 3,700°C. The boundary between the crust and the mantle is called the Moho." },
    { k: "core-o", name: "Outer core", r0: 28, r1: 74, t: "Outer core: about 2,200 km thick, 4,500°C to 5,500°C, under extreme pressure. The core is made of iron, cobalt and nickel." },
    { k: "core-i", name: "Inner core", r0: 0, r1: 28, t: "Inner core: the centre, about 1,300 km thick, 5,500°C to 6,000°C. The hottest layer. Its materials are pressed very tightly." }
  ];
  F.layers = function (spec, opts) {
    var lettered = !!spec.letters;
    var s = frame(520, 300, "Inside the earth: the crust on the outside, then the mantle, the outer core and the inner core in the centre.");
    s.appendChild(sv("rect", { width: 520, height: 300, fill: "#0d1b3d" }));
    stars(s, 520, 300, 30, 3);
    var cx = 170, cy = 150, id = "spc" + (++uid);
    s.appendChild(sv("clipPath", { id: id }, [sv("rect", { x: cx - 140, y: cy - 140, width: 140, height: 280 })]));
    var left = sv("g", { "clip-path": "url(#" + id + ")" }, [sv("circle", { cx: cx, cy: cy, r: 136, fill: "#3a7bd5" }),
      sv("ellipse", { cx: cx - 70, cy: cy - 50, rx: 40, ry: 30, fill: "#4caf50" }), sv("ellipse", { cx: cx - 40, cy: cy + 50, rx: 30, ry: 42, fill: "#4caf50" }), sv("ellipse", { cx: cx - 100, cy: cy + 30, rx: 18, ry: 20, fill: "#4caf50" })]);
    s.appendChild(left);
    var caption = cap(lettered ? "Tap a layer: A, B, C or D." : "Tap a layer to learn about it.");
    var segs = LAY.map(function (L, i) {
      var d = "M" + cx + " " + (cy - L.r1) + " A" + L.r1 + " " + L.r1 + " 0 0 1 " + cx + " " + (cy + L.r1) + (L.r0 ? " L" + cx + " " + (cy + L.r0) + " A" + L.r0 + " " + L.r0 + " 0 0 0 " + cx + " " + (cy - L.r0) : "") + " Z";
      var p = sv("path", { d: d, class: "lay " + L.k + (spec.hl === i ? " sel" : ""), tabindex: "0", role: "button", "aria-label": lettered ? String.fromCharCode(65 + i) : L.name });
      function pick() { segs.forEach(function (q) { q.classList.toggle("sel", q === p); }); if (lettered) { caption.textContent = "This is layer " + String.fromCharCode(65 + i) + "."; return; } caption.textContent = L.t; S.speak(L.t); }
      p.addEventListener("click", pick); p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      s.appendChild(p);
      var ly = 40 + i * 64, ax = cx + (L.r0 + L.r1) / 2 * Math.cos(-1.1 + i * 0.75), ay = cy + (L.r0 + L.r1) / 2 * Math.sin(-1.1 + i * 0.75);
      if (L.k === "core-i") { ax = cx + 10; ay = cy; }
      s.appendChild(sv("path", { d: "M" + f(ax) + " " + f(ay) + " L340 " + ly, class: "lead light" }));
      s.appendChild(sv("circle", { cx: f(ax), cy: f(ay), r: 2.5, fill: "#fff" }));
      if (lettered) s.appendChild(txt(348, ly + 6, String.fromCharCode(65 + i), "lbl light strong big"));
      else {
        s.appendChild(txt(348, ly + 2, L.name, "lbl light strong big"));
        s.appendChild(txt(348, ly + 17, ["about 40 km", "about 2,900 km · 1,000–3,700°C", "about 2,200 km · 4,500–5,500°C", "about 1,300 km · 5,500–6,000°C"][i], "lbl light small"));
      }
      return p;
    });
    return wrap(s, null, caption, opts);
  };

  /* 13. A comet: a long oval orbit. Near the sun its ice turns to gas and the tail grows, pointing away from the sun. */
  F.comet = function (spec, opts) {
    var s = frame(520, 260, "A comet goes around the sun on a long oval orbit. Far from the sun it is frozen. Near the sun its ice turns to gas and a long tail grows. The tail always points away from the sun.", "space");
    stars(s, 520, 260, 60, 18);
    var a = 220, b = 78, ocx = 290, ocy = 130, c = Math.sqrt(a * a - b * b), sx = ocx - c, sy = ocy;
    s.appendChild(sv("ellipse", { cx: ocx, cy: ocy, rx: a, ry: b, class: "orbit bright dashed" }));
    var sun = sunG(14); tr(sun, sx, sy); s.appendChild(sun);
    s.appendChild(txt(sx, sy + 32, "sun", "lbl mid light"));
    var tail = sv("path", { class: "comet-tail" }), tail2 = sv("path", { class: "comet-tail2" }), head = sv("circle", { r: 4.5, class: "comet-head" });
    s.appendChild(tail); s.appendChild(tail2); s.appendChild(head);
    s.appendChild(txt(500, 24, "far away: frozen, no tail", "lbl end light small"));
    s.appendChild(txt(12, 24, "near the sun: ice turns to gas, the tail grows", "lbl light small"));
    s.appendChild(txt(12, 250, "The tail always points away from the sun.", "lbl light small strong"));
    var E = 0.4, last = 0;
    loop(s, function (t) {
      var dt = Math.min(0.05, t - last); last = t;
      var x = ocx + a * Math.cos(E), y = ocy + b * Math.sin(E), dx = x - sx, dy = y - sy, d = Math.sqrt(dx * dx + dy * dy);
      if (!RM) E += dt * 0.7 * (a / Math.max(d, 25));
      if (RM) { E = Math.PI * 0.92; x = ocx + a * Math.cos(E); y = ocy + b * Math.sin(E); dx = x - sx; dy = y - sy; d = Math.sqrt(dx * dx + dy * dy); }
      var L = Math.max(0, Math.min(120, 5200 / d - 14)), ux = dx / d, uy = dy / d, px = -uy, py = ux, w = 2 + L * 0.09;
      set(head, { cx: f(x), cy: f(y) });
      set(tail, { d: "M" + f(x + px * 3) + " " + f(y + py * 3) + " L" + f(x + ux * L + px * w) + " " + f(y + uy * L + py * w) + " L" + f(x + ux * L - px * w) + " " + f(y + uy * L - py * w) + " L" + f(x - px * 3) + " " + f(y - py * 3) + " Z", opacity: f(Math.min(0.85, L / 60)) });
      var L2 = L * 0.7;
      set(tail2, { d: "M" + f(x) + " " + f(y) + " Q" + f(x + ux * L2 * 0.6 + px * 8) + " " + f(y + uy * L2 * 0.6 + py * 8) + " " + f(x + ux * L2 + px * 16) + " " + f(y + uy * L2 + py * 16), opacity: f(Math.min(0.6, L / 90)) });
    });
    return wrap(s, null, null, opts);
  };

  /* 14. Meteor and meteorite: a small rock burns up in the air; a big rock reaches the ground */
  F.meteor = function (spec, opts) {
    var s = frame(480, 270, "A rock from space falls towards the earth. It rubs against the air and burns. A small rock burns to ash: a meteor. A big rock reaches the ground and makes a crater: a meteorite.", "space");
    stars(s, 480, 90, 30, 22);
    s.appendChild(sv("rect", { x: 0, y: 80, width: 480, height: 140, class: "air-band" }));
    s.appendChild(txt(470, 98, "air (atmosphere)", "lbl end light small"));
    s.appendChild(sv("rect", { x: 0, y: 215, width: 480, height: 55, class: "topsoil" }));
    s.appendChild(sv("path", { d: "M0 216 h480", class: "grass" }));
    var crater = sv("g", { class: "crater" }, [sv("ellipse", { cx: 330, cy: 220, rx: 30, ry: 8, fill: "#3b2a1a" }), sv("path", { d: "M296 220 q6 -10 12 -2 M352 218 q6 -10 12 2", stroke: "#8a6a45", "stroke-width": 4, fill: "none" })]);
    s.appendChild(crater);
    var trailA = sv("path", { class: "m-trail", d: "M40 20 L150 150" }), trailB = sv("path", { class: "m-trail", d: "M200 10 L330 212" });
    s.appendChild(trailA); s.appendChild(trailB);
    var ash = sv("g", { class: "ash" }, [0, 1, 2, 3, 4].map(function (i) { return sv("circle", { cx: 150 + (i - 2) * 6, cy: 152 + (i % 2) * 5, r: 2.5, fill: "#9aa7b4" }); }));
    s.appendChild(ash);
    var rock = sv("g", { class: "m-rock" }, [sv("circle", { r: 9, class: "m-glow" }), sv("path", { d: "M-6 -4 L0 -7 L6 -3 L5 4 L-2 6 L-6 2 Z", class: "m-stone" })]);
    s.appendChild(rock); rock.style.display = "none";
    var l1 = txt(122, 176, "meteor: burns to ash", "lbl mid light strong"), l2 = txt(330, 250, "meteorite: reaches the ground", "lbl mid light strong");
    s.appendChild(l1); s.appendChild(l2);
    var caption = cap("Small rocks burn up in the air (meteors). Very big rocks reach the ground (meteorites).");
    var anim = null;
    function fall(big) {
      if (anim) anim.stop();
      var x0 = big ? 200 : 40, y0 = big ? 10 : 20, x1 = big ? 330 : 150, y1 = big ? 212 : 150, t0 = null;
      rock.style.display = ""; trailA.classList.add("faint"); trailB.classList.add("faint");
      caption.textContent = big ? "A big rock falls… it rubs the air, gets hot and glows…" : "A small rock falls… it rubs the air, gets hot and glows…";
      var done = false;
      anim = loop(s, function (t) {
        if (done) return;
        if (t0 === null) t0 = t;
        var p = RM ? 1 : Math.min(1, (t - t0) / 2.4), x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p, inAir = y > 80;
        var sc = big ? 1.4 - 0.4 * Math.max(0, (y - 80) / 140) : (inAir ? Math.max(0.05, 1 - (y - 80) / 70) : 1);
        tr(rock, x, y, " scale(" + f(sc) + ")"); rock.classList.toggle("hot", inAir);
        if (p >= 1) {
          rock.style.display = "none"; done = true;
          if (big) { crater.classList.add("boom"); setTimeout(function () { crater.classList.remove("boom"); }, 900); caption.textContent = "It did not burn up completely. It hit the ground and made a crater. This is a meteorite."; }
          else { ash.classList.add("show"); setTimeout(function () { ash.classList.remove("show"); }, 1500); caption.textContent = "It burnt up and became ash in the air. This is a meteor (a shooting star)."; }
        }
      });
    }
    return wrap(s, [btn("☄️ Small rock", function () { fall(false); }), btn("🪨 Big rock", function () { fall(true); })], caption, opts);
  };
})();
