/*
  Picture pack for "Earth and Space" (soil). Adds moving drawings to Science.figures.
  Every figure takes a spec and opts ({ small: true } inside help steps) and returns an element.
  Figures with buttons show their finished picture first, so they still make sense without pressing anything.
*/
(function () {
  "use strict";
  var S = window.Shared, el = S.el, sv = S.svg, F = window.Science.figures, f = S.f;
  var RM = S.reduceMotion;

  function frame(w, h, label, cls) {
    return sv("svg", { viewBox: "0 0 " + w + " " + h, class: "sfig" + (cls ? " " + cls : ""), role: "img", "aria-label": label });
  }
  function txt(x, y, s, cls, extra) {
    var a = { x: x, y: y, class: cls || "lbl" }; for (var k in extra || {}) a[k] = extra[k];
    return sv("text", a, [s]);
  }
  function emo(x, y, e, size, cls) { return sv("text", { x: x, y: y, class: "emo" + (cls ? " " + cls : ""), "font-size": size || 24 }, [e]); }
  function wrap(svgNode, buttons, caption, opts) {
    var kids = [svgNode];
    if (caption) kids.push(caption);
    if (buttons && buttons.length && !(opts && opts.small)) kids.push(el("div", { class: "fig-ctrl" }, buttons));
    return el("div", { class: "fig-box" }, kids);
  }
  function btn(label, fn) { return el("button", { type: "button", class: "tool-btn", onclick: fn }, [label]); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function seeded(seed) { var x = seed || 7; return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
  function later(ms, fn) { return setTimeout(fn, RM ? 0 : ms); }
  function move(node, x, y, ms, delay) {
    node.style.transition = RM ? "none" : "transform " + (ms || 0) + "ms cubic-bezier(.3,.1,.3,1) " + (delay || 0) + "ms";
    node.style.transform = "translate(" + f(x) + "px," + f(y) + "px)";
  }
  function plant(x, y, h, cls) {
    return sv("g", { class: "plant " + (cls || ""), transform: "translate(" + x + "," + y + ")" }, [
      sv("path", { d: "M0 0 V" + (-h), class: "stem" }),
      sv("path", { d: "M0 " + f(-h * 0.55) + " q-14 -10 -20 -2 q8 8 20 2z", class: "leaf" }),
      sv("path", { d: "M0 " + f(-h * 0.75) + " q14 -10 20 -2 q-8 8 -20 2z", class: "leaf" }),
      sv("path", { d: "M0 " + (-h) + " q-8 -12 0 -18 q8 6 0 18z", class: "leaf" })
    ]);
  }

  /* 1. A field: soil on the surface of the earth, a plant and an earthworm */
  F.field = function (spec, opts) {
    var s = frame(400, 240, "Soil on the surface of the earth, with a plant and an earthworm");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 400, height: 92, class: "sky" }));
    s.appendChild(sv("g", { class: "sun spin", transform: "translate(350,38)" }, [sv("circle", { r: 16, class: "sun-c" })].concat([0, 45, 90, 135, 180, 225, 270, 315].map(function (a) {
      return sv("line", { x1: 0, y1: -22, x2: 0, y2: -30, class: "sun-ray", transform: "rotate(" + a + ")" });
    }))));
    s.appendChild(sv("rect", { x: 0, y: 90, width: 400, height: 60, class: "topsoil" }));
    s.appendChild(sv("rect", { x: 0, y: 150, width: 400, height: 50, class: "subsoil" }));
    s.appendChild(sv("rect", { x: 0, y: 200, width: 400, height: 40, class: "bedrock" }));
    var r = seeded(3);
    for (var i = 0; i < 14; i++) s.appendChild(sv("ellipse", { cx: f(r() * 400), cy: f(205 + r() * 30), rx: f(10 + r() * 14), ry: f(6 + r() * 6), class: "stone" }));
    for (var j = 0; j < 40; j++) s.appendChild(sv("circle", { cx: f(r() * 400), cy: f(95 + r() * 100), r: f(0.8 + r() * 1.6), class: "grain" }));
    s.appendChild(sv("path", { d: "M0 92 " + Array.apply(null, Array(40)).map(function (_, k) { return "l5 -6 l5 6"; }).join(" "), class: "grass" }));
    s.appendChild(sv("g", { class: "grow" }, [plant(120, 92, 46)]));
    s.appendChild(sv("path", { d: "M120 92 v18 m0 -8 l-8 10 m8 -4 l7 9", class: "root" }));
    s.appendChild(sv("g", { class: "worm-move" }, [sv("path", { d: "M250 128 q6 -6 12 0 t12 0 t12 0", class: "worm" }), sv("circle", { cx: 286, cy: 128, r: 1.3, class: "eye" })]));
    s.appendChild(emo(60, 86, "🐜", 14)); s.appendChild(emo(300, 86, "🌼", 18));
    s.appendChild(txt(392, 122, "soil", "lbl big end"));
    return wrap(s, null, null, opts);
  };

  /* 2. Soil in a jar of water: stir it, leave it overnight, the parts settle in layers */
  var JAR = { x0: 70, x1: 200, top: 64, bot: 238 };
  var LAYERS = [
    { k: "gravel", name: "gravel (small stones)", y0: 212, y1: 236, n: 9, r: [5, 7.5], ms: 700 },
    { k: "coarse", name: "coarse sand", y0: 194, y1: 212, n: 34, r: [2.2, 3], ms: 1200 },
    { k: "fine", name: "fine sand", y0: 180, y1: 194, n: 50, r: [1.3, 1.8], ms: 1900 },
    { k: "silt", name: "silt", y0: 170, y1: 180, n: 60, r: [0.8, 1.1], ms: 2800 },
    { k: "clay", name: "water with clay", y0: 80, y1: 168, n: 70, r: [0.5, 0.7], ms: 4200 },
    { k: "humus", name: "humus (floats)", y0: 68, y1: 76, n: 14, r: [2, 3], ms: 2500 }
  ];
  F.jar = function (spec, opts) {
    var s = frame(360, 260, "A jar of water with soil. The parts of soil settle in layers: gravel at the bottom, then coarse sand, fine sand, silt, water with clay, and humus floating on top.");
    s.appendChild(sv("rect", { x: 74, y: 22, width: 122, height: 18, rx: 4, class: "lid" }));
    s.appendChild(sv("path", { d: "M70 44 h130 v188 a10 10 0 0 1 -10 10 h-110 a10 10 0 0 1 -10 -10z", class: "jar-glass" }));
    var water = sv("rect", { x: 72, y: 64, width: 126, height: 176, class: "jar-water" });
    s.appendChild(water);
    var parts = sv("g"); s.appendChild(parts);
    var r = seeded(11), dots = [];
    LAYERS.forEach(function (L) {
      for (var i = 0; i < L.n; i++) {
        var fx = JAR.x0 + 6 + r() * (JAR.x1 - JAR.x0 - 12), fy = L.y0 + r() * (L.y1 - L.y0);
        if (L.k === "clay") fy = L.y0 + Math.pow(r(), 0.6) * (L.y1 - L.y0);
        var rad = L.r[0] + r() * (L.r[1] - L.r[0]);
        var c = L.k === "humus" ? sv("rect", { x: -rad, y: -rad / 2, width: rad * 2, height: rad, class: "p-humus", transform: "rotate(" + Math.round(r() * 180) + ")" })
          : sv("circle", { r: f(rad), class: "p-" + L.k });
        var g = sv("g", {}, [c]); parts.appendChild(g);
        var d = { g: g, fx: fx, fy: fy, L: L }; dots.push(d); move(g, fx, fy, 0);
      }
    });
    s.appendChild(sv("path", { d: "M70 44 h130 v188 a10 10 0 0 1 -10 10 h-110 a10 10 0 0 1 -10 -10z", class: "jar-edge" }));
    var labels = sv("g", { class: "jar-labels" });
    LAYERS.slice().reverse().forEach(function (L, i) {
      var y = (L.y0 + L.y1) / 2, ty = 70 + i * 32;
      labels.appendChild(sv("path", { d: "M202 " + f(y) + " L222 " + f(y) + " L236 " + ty, class: "lead" }));
      labels.appendChild(txt(240, ty + 4, L.name, "lbl"));
    });
    s.appendChild(labels);
    var cap = el("p", { class: "fig-cap", text: "After one night, the heavy parts are at the bottom and the light parts are on top." });
    var busy = false;
    function stir() {
      busy = false; labels.classList.add("hide"); water.classList.add("muddy");
      cap.textContent = "Stir! Everything mixes. The water becomes muddy.";
      dots.forEach(function (d) { move(d.g, rnd(JAR.x0 + 6, JAR.x1 - 6), rnd(70, 234), 450); });
    }
    function settle() {
      cap.textContent = "Wait… Heavy gravel falls first. Light clay falls last. Humus floats.";
      water.classList.remove("muddy"); water.classList.add("clearing");
      dots.forEach(function (d) { move(d.g, d.fx, d.fy, d.L.ms + rnd(0, 500), rnd(0, 200)); });
      later(4200, function () { water.classList.remove("clearing"); labels.classList.remove("hide"); cap.textContent = "Next day: gravel at the bottom, then coarse sand, fine sand, silt, water with clay. Humus floats on top."; });
    }
    return wrap(s, [btn("🥄 Stir the jar", stir), btn("🌙 Leave it overnight", settle)], opts.small ? null : cap, opts);
  };

  /* 3. How soil is formed: rock → cracks → small pieces → soil */
  F.formation = function (spec, opts) {
    var s = frame(500, 170, "Soil formation: a big rock is heated by the sun and hit by rain and wind. It cracks, breaks into small pieces, and with humus becomes soil.");
    var titles = ["1. Big rock", "2. It cracks", "3. Small pieces", "4. Soil"];
    var panels = [];
    for (var i = 0; i < 4; i++) {
      var g = sv("g", { class: "panel", transform: "translate(" + (i * 125) + ",0)" });
      g.appendChild(sv("rect", { x: 4, y: 4, width: 112, height: 132, rx: 10, class: "panel-bg" }));
      g.appendChild(sv("rect", { x: 4, y: 110, width: 112, height: 26, class: "panel-ground" }));
      g.appendChild(txt(60, 158, titles[i], "lbl mid"));
      panels.push(g); s.appendChild(g);
      if (i < 3) s.appendChild(sv("path", { d: "M" + (i * 125 + 117) + " 70 l8 0 m-4 -4 l4 4 l-4 4", class: "arrow" }));
    }
    var rock = "M22 110 L30 72 L52 56 L80 60 L98 82 L100 110 Z";
    panels[0].appendChild(sv("path", { d: rock, class: "rock" }));
    panels[0].appendChild(sv("g", { class: "sun pulse", transform: "translate(96,24)" }, [sv("circle", { r: 9, class: "sun-c" })]));
    panels[0].appendChild(sv("g", { class: "rain" }, [0, 1, 2, 3].map(function (k) { return sv("line", { x1: 18 + k * 12, y1: 14, x2: 15 + k * 12, y2: 24, class: "drop d" + k }); })));
    panels[0].appendChild(sv("g", { class: "wind" }, [sv("path", { d: "M8 50 q10 -6 20 0 t20 0", class: "wind-l" }), sv("path", { d: "M8 60 q10 -6 20 0 t16 0", class: "wind-l w2" })]));
    panels[1].appendChild(sv("path", { d: rock, class: "rock" }));
    panels[1].appendChild(sv("path", { d: "M52 58 L56 76 L48 90 L56 110 M80 62 L74 84 L84 98", class: "crack draw" }));
    [[30, 100, 12], [56, 96, 14], [84, 100, 12], [44, 80, 10], [72, 78, 11]].forEach(function (p) {
      panels[2].appendChild(sv("path", { d: "M" + (p[0] - p[2]) + " " + (p[1] + 8) + " l" + f(p[2] * 0.4) + " -" + p[2] + " l" + p[2] + " -2 l" + f(p[2] * 0.6) + " " + (p[2] + 2) + " z", class: "rock" }));
    });
    var r = seeded(5);
    for (var k = 0; k < 4; k++) panels[2].appendChild(sv("circle", { cx: f(20 + r() * 80), cy: f(104 + r() * 5), r: 2.5, class: "rock" }));
    panels[3].appendChild(sv("path", { d: "M10 110 Q60 82 110 110 Z", class: "soil-heap" }));
    for (var m = 0; m < 30; m++) panels[3].appendChild(sv("circle", { cx: f(20 + r() * 80), cy: f(100 + r() * 9), r: f(0.8 + r()), class: "grain" }));
    panels[3].appendChild(emo(30, 98, "🍂", 13)); panels[3].appendChild(emo(78, 100, "🍂", 11));
    panels[3].appendChild(sv("g", { class: "grow" }, [plant(60, 94, 28)]));
    var caps = ["The sun heats the rock. Rain and wind hit it again and again.", "Slowly the rock cracks.", "It breaks into small pieces. This breaking is called weathering.", "Tiny rock pieces + humus (rotten leaves) = soil. Plants grow in it."];
    var cap = el("p", { class: "fig-cap", text: "Rock → cracks → small pieces → soil. This takes a very long time." });
    var timer = null;
    function play() {
      clearTimeout(timer);
      var step = 0;
      (function go() {
        panels.forEach(function (p, i) { p.classList.toggle("dim", i !== step); p.classList.toggle("on", i === step); });
        cap.textContent = caps[step];
        step++;
        if (step < 4) timer = later(2300, go);
        else timer = later(2600, function () { panels.forEach(function (p) { p.classList.remove("dim", "on"); }); cap.textContent = "Rock → cracks → small pieces → soil. This takes a very long time."; });
      })();
    }
    return wrap(s, [btn("▶ Play", play)], opts.small ? null : cap, opts);
  };

  /* 4. Humus: dead leaves rot and make the soil dark and fertile */
  F.humus = function (spec, opts) {
    var s = frame(360, 200, "Dead leaves fall, rot and become humus, a dark layer that makes soil fertile.");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 360, height: 120, class: "sky" }));
    s.appendChild(sv("rect", { x: 0, y: 120, width: 360, height: 80, class: "subsoil" }));
    var hum = sv("rect", { x: 0, y: 118, width: 360, height: 0, class: "humus-band" }); s.appendChild(hum);
    s.appendChild(sv("g", { class: "tree" }, [sv("rect", { x: 46, y: 50, width: 12, height: 70, class: "trunk" }), sv("circle", { cx: 52, cy: 44, r: 30, class: "crown" })]));
    var small = sv("g", { class: "plant-s" }, [plant(250, 120, 22)]); s.appendChild(small);
    var leaves = [];
    for (var i = 0; i < 7; i++) { var lf = sv("g", {}, [emo(0, 0, "🍂", 16)]); s.appendChild(lf); leaves.push(lf); move(lf, 70 + i * 34, 122 + (i % 2) * 3, 0); }
    s.appendChild(sv("g", { class: "worm-move" }, [sv("path", { d: "M150 160 q6 -6 12 0 t12 0 t12 0", class: "worm" })]));
    var lbl = txt(350, 138, "humus", "lbl end strong"); s.appendChild(lbl);
    hum.setAttribute("height", 16);
    var cap = el("p", { class: "fig-cap", text: "Rotten leaves and dead animals make humus. Humus is plant food, so the soil becomes fertile." });
    function play() {
      hum.setAttribute("height", 0); lbl.style.opacity = 0; small.classList.remove("big");
      cap.textContent = "Leaves fall from the tree…";
      leaves.forEach(function (lf, i) { lf.classList.remove("rot"); move(lf, 60 + i * 5, 40, 0); });
      later(60, function () { leaves.forEach(function (lf, i) { move(lf, 70 + i * 34, 122 + (i % 2) * 3, 1500, i * 180); }); });
      later(2600, function () { cap.textContent = "They rot (decay). Earthworms and tiny living things help."; leaves.forEach(function (lf) { lf.classList.add("rot"); }); });
      later(4400, function () { hum.setAttribute("height", 16); lbl.style.opacity = 1; small.classList.add("big"); cap.textContent = "Now there is humus. The plant gets food and grows well."; });
    }
    return wrap(s, [btn("▶ Play", play)], opts.small ? null : cap, opts);
  };

  /* 5. Three types of soil, with a water test */
  var TYPES = {
    sandy: { name: "Sandy soil", layers: [["sand", 0.78], ["clay", 0.12]], drain: 1, cap: "Water runs out fast. Few minerals, no humus." },
    loam: { name: "Loam soil", layers: [["gravel", 0.12], ["sand", 0.3], ["clay", 0.28], ["humus", 0.2]], drain: 0.45, cap: "Holds water well. Lots of humus. Best for crops." },
    clay: { name: "Clay soil", layers: [["sand", 0.12], ["clay", 0.72], ["humus", 0.04]], drain: 0.15, cap: "Holds water, dries very slowly. Sticky when wet, hard when dry." }
  };
  F.soiltypes = function (spec, opts) {
    var keys = spec.order || ["sandy", "loam", "clay"], names = spec.names, s = frame(390, spec.water === false ? 180 : 260, "Three jars: sandy soil, loam soil and clay soil");
    var cups = [], tops = [];
    keys.forEach(function (k, i) {
      var T = TYPES[k], x = 20 + i * 125, top = 40, bot = 170, H = bot - top;
      s.appendChild(sv("rect", { x: x + 6, y: top - 14, width: 88, height: 12, rx: 3, class: "lid" }));
      s.appendChild(sv("rect", { x: x, y: top, width: 100, height: H, rx: 8, class: "jar-glass" }));
      var y = bot;
      T.layers.forEach(function (L) {
        var h = L[1] * H; y -= h;
        s.appendChild(sv("rect", { x: x + 2, y: f(y), width: 96, height: f(h), class: "lay-" + L[0] }));
      });
      var wtop = sv("rect", { x: x + 2, y: top + 4, width: 96, height: f(y - top - 4), class: "jar-water light" }); s.appendChild(wtop); tops.push({ n: wtop, y: y, top: top });
      s.appendChild(sv("rect", { x: x, y: top, width: 100, height: H, rx: 8, class: "jar-edge" }));
      s.appendChild(txt(x + 50, 15, names ? names[i] : T.name, "lbl mid strong"));
      if (spec.water !== false) {
        s.appendChild(sv("path", { d: "M" + (x + 40) + " 172 v10 h20 v-10", class: "jar-edge" }));
        s.appendChild(sv("path", { d: "M" + (x + 25) + " 210 h50 l-5 40 h-40z", class: "cup" }));
        var cw = sv("rect", { x: x + 28, y: 248, width: 44, height: 0, class: "cup-water" });
        s.appendChild(cw); cups.push(cw);
        s.appendChild(sv("line", { x1: x + 50, y1: 184, x2: x + 50, y2: 206, class: "drip d" + i }));
      }
    });
    var cap = el("p", { class: "fig-cap", text: spec.caption || "Pour the same water on each jar. Which soil lets the water run out fastest?" });
    var caps = el("div", { class: "fig-cards three" }, spec.names ? [] : keys.map(function (k) { return el("p", {}, [el("b", { text: TYPES[k].name + ": " }), TYPES[k].cap]); }));
    function pour() {
      s.classList.add("pouring");
      cups.forEach(function (c, i) { var T = TYPES[keys[i]]; c.style.transition = "none"; c.setAttribute("height", 0); c.setAttribute("y", 248); });
      tops.forEach(function (t) { t.n.style.opacity = 1; });
      later(50, function () {
        cups.forEach(function (c, i) {
          var T = TYPES[keys[i]], ms = 1200 / T.drain;
          c.style.transition = RM ? "none" : "height " + ms + "ms linear, y " + ms + "ms linear";
          c.setAttribute("height", f(34 * T.drain)); c.setAttribute("y", f(248 - 34 * T.drain));
          tops[i].n.style.transition = RM ? "none" : "opacity " + ms + "ms linear"; tops[i].n.style.opacity = f(1 - T.drain * 0.9);
        });
      });
      later(8000, function () { s.classList.remove("pouring"); });
      cap.textContent = "Sandy soil drains first. Loam keeps some water. Clay keeps most water.";
    }
    var kids = [s]; if (!opts.small && !spec.names) kids.push(caps);
    var box = wrap(s, spec.water === false ? null : [btn("💧 Pour water", pour)], opts.small || spec.water === false ? null : cap, opts);
    if (!opts.small && !spec.names) box.insertBefore(caps, box.children[1] || null);
    return box;
  };

  /* 6. Soil profile: tap a layer to read about it */
  var PROF = [
    { k: "humus", name: "Humus", y0: 34, y1: 46, info: "Rotten leaves and dead bodies. Very dark. It makes soil fertile." },
    { k: "topsoil", name: "Topsoil (Horizon A)", y0: 46, y1: 100, info: "The top layer, about 8 inches (20 cm) deep. It has humus. It is the most fertile. Plant roots get food here." },
    { k: "subsoil", name: "Subsoil (Horizon B)", y0: 100, y1: 180, info: "The second layer. Much thicker. Little or no humus. Many pebbles." },
    { k: "weathered", name: "Weathered bedrock", y0: 180, y1: 235, info: "Broken pieces of rock, on top of the bedrock." },
    { k: "bedrock", name: "Bedrock (Horizon C)", y0: 235, y1: 290, info: "Hard, solid rock at the bottom." }
  ];
  F.profile = function (spec, opts) {
    var s = frame(330, 296, "Soil profile: humus, topsoil (Horizon A), subsoil (Horizon B), weathered bedrock and bedrock (Horizon C).");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 190, height: 34, class: "sky" }));
    var groups = [], r = seeded(9);
    PROF.forEach(function (L, i) {
      var g = sv("g", { class: "layer", tabindex: opts.small ? null : 0, role: opts.small ? null : "button", "aria-label": L.name });
      g.appendChild(sv("rect", { x: 0, y: L.y0, width: 190, height: L.y1 - L.y0, class: "pr-" + L.k }));
      if (L.k === "subsoil") for (var a = 0; a < 16; a++) g.appendChild(sv("ellipse", { cx: f(r() * 186 + 2), cy: f(L.y0 + 6 + r() * (L.y1 - L.y0 - 12)), rx: f(3 + r() * 4), ry: f(2 + r() * 2), class: "pebble" }));
      if (L.k === "weathered") for (var b = 0; b < 10; b++) g.appendChild(sv("path", { d: "M" + f(r() * 170 + 6) + " " + f(L.y0 + 10 + r() * 34) + " l10 -8 l14 4 l-2 12 l-16 2z", class: "chunk" }));
      if (L.k === "bedrock") for (var c = 0; c < 4; c++) g.appendChild(sv("rect", { x: c * 48 + (c % 2) * 10 - 6, y: L.y0 + 6 + (c % 2) * 22, width: 52, height: 22, rx: 4, class: "block" }));
      if (L.k === "topsoil") for (var d = 0; d < 26; d++) g.appendChild(sv("circle", { cx: f(r() * 190), cy: f(L.y0 + r() * 54), r: f(0.8 + r()), class: "grain" }));
      var ly = (L.y0 + L.y1) / 2, label = spec.numbers ? String(i + 1) : L.name;
      g.appendChild(sv("path", { d: "M196 " + (L.y0 + 2) + " h6 V" + (L.y1 - 2) + " h-6", class: "bracket" }));
      if (spec.numbers) { g.appendChild(sv("circle", { cx: 222, cy: ly, r: 11, class: "num-c" })); g.appendChild(txt(222, ly + 4.5, label, "lbl mid strong")); }
      else g.appendChild(txt(208, ly + (L.k === "humus" ? 0 : 4), label, "lbl" + (L.k === "humus" ? " small" : "")));
      groups.push(g); s.appendChild(g);
    });
    s.appendChild(sv("path", { d: "M0 34 " + Array.apply(null, Array(19)).map(function () { return "l5 -5 l5 5"; }).join(" "), class: "grass" }));
    s.appendChild(sv("g", {}, [plant(70, 34, 26)]));
    s.appendChild(sv("path", { d: "M70 34 V96 M70 52 l-12 16 M70 62 l14 18 M70 78 l-8 14", class: "root draw slow" }));
    if (spec.hl != null) groups.forEach(function (g, i) { g.classList.toggle("dim", i !== spec.hl); });
    var cap = el("p", { class: "fig-cap", text: "Tap a layer to read about it." });
    if (!opts.small && !spec.numbers) groups.forEach(function (g, i) {
      function pick() { groups.forEach(function (x, k) { x.classList.toggle("dim", k !== i); }); cap.innerHTML = "<b>" + S.esc(PROF[i].name) + ":</b> " + S.esc(PROF[i].info); S.speak(PROF[i].name + ". " + PROF[i].info); }
      g.addEventListener("click", pick); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
    return wrap(s, null, opts.small || spec.numbers ? null : cap, opts);
  };

  /* 7. Soil pollution: pollutants go into the soil, the soil turns dark, plants become weak */
  F.pollution = function (spec, opts) {
    var s = frame(380, 230, "A field. Plastic, batteries, cans and factory waste go into the soil. The soil becomes polluted and the plants become weak.");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 380, height: 130, class: "sky" }));
    var soil = sv("rect", { x: 0, y: 130, width: 380, height: 100, class: "topsoil clean-soil" }); s.appendChild(soil);
    s.appendChild(sv("g", {}, [emo(14, 112, "🏭", 44)]));
    var pipe = sv("path", { d: "M58 108 h20 q8 0 8 10 v24", class: "pipe-flow" }); s.appendChild(pipe);
    var plants = [150, 200, 250, 300, 345].map(function (x) { var g = sv("g", { class: "plant-w" }, [plant(x, 130, 34)]); s.appendChild(g); return g; });
    var junk = ["🧴", "🔋", "🛍️", "🥫", "🔋", "🧴"].map(function (e, i) { var g = sv("g", {}, [emo(0, 0, e, 18)]); s.appendChild(g); move(g, 120 + i * 40, -30, 0); return g; });
    var spray = sv("g", { class: "spray" }, [emo(320, 60, "🧪", 22), sv("circle", { cx: 300, cy: 80, r: 18, class: "spray-c" })]); s.appendChild(spray);
    var lbl = txt(370, 220, "clean soil", "lbl end strong light"); s.appendChild(lbl);
    var cap = el("p", { class: "fig-cap", text: "Healthy soil: plants grow well." });
    function setDirty(dirty, now) {
      soil.classList.toggle("dirty", dirty); s.classList.toggle("is-dirty", dirty);
      plants.forEach(function (p) { p.classList.toggle("sick", dirty); });
      junk.forEach(function (g, i) { move(g, 120 + i * 40, dirty ? 150 + (i % 3) * 18 : -30, now ? 0 : 1100, now ? 0 : i * 200); });
      lbl.textContent = dirty ? "polluted soil" : "clean soil";
      cap.textContent = dirty ? "Waste, chemicals and plastic go into the soil. The soil is polluted. Plants become weak, and crops grow badly." : "Healthy soil: plants grow well.";
    }
    if (spec.state === "polluted") setDirty(true, true);
    return wrap(s, [btn("🗑️ Add pollutants", function () { setDirty(true); }), btn("🧹 Clean soil", function () { setDirty(false); })], opts.small ? null : cap, opts);
  };

  /* 8. Acid rain */
  F.acidrain = function (spec, opts) {
    var s = frame(380, 240, "Acid rain: gases from factories and vehicles mix with water vapour in the sky. The rain becomes acidic and makes the soil acidic.");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 380, height: 180, class: "sky" }));
    s.appendChild(sv("rect", { x: 0, y: 180, width: 380, height: 60, class: "topsoil acid-soil" }));
    s.appendChild(emo(14, 178, "🏭", 46)); s.appendChild(emo(96, 178, "🚗", 30));
    var gas = sv("g", { class: "gas" }); s.appendChild(gas);
    [[40, 120], [52, 112], [110, 160], [64, 118]].forEach(function (p, i) { gas.appendChild(sv("circle", { cx: p[0], cy: p[1], r: 7, class: "puff p" + i })); });
    var cloud = sv("g", { class: "cloud" }, [sv("ellipse", { cx: 250, cy: 40, rx: 60, ry: 20 }), sv("ellipse", { cx: 215, cy: 48, rx: 36, ry: 16 }), sv("ellipse", { cx: 290, cy: 50, rx: 36, ry: 15 })]);
    s.appendChild(cloud);
    s.appendChild(txt(250, 45, "gases + water vapour → acid", "lbl mid small"));
    var rain = sv("g", { class: "acid-rain" }); s.appendChild(rain);
    for (var i = 0; i < 9; i++) rain.appendChild(sv("line", { x1: 200 + i * 13, y1: 66, x2: 196 + i * 13, y2: 78, class: "drop d" + (i % 4) }));
    s.appendChild(sv("g", { class: "plant-w sick" }, [plant(330, 180, 32)]));
    s.appendChild(txt(370, 232, "acidic soil", "lbl end strong light"));
    var cap = el("p", { class: "fig-cap", text: "1. Factories and vehicles give out gases. 2. The gases mix with water vapour and make acids. 3. Acidic rain falls. 4. The soil becomes acidic. Many crops cannot grow." });
    return wrap(s, null, opts.small ? null : cap, opts);
  };

  /* 9. Erosion and deposition on a slope */
  F.erosion = function (spec, opts) {
    var s = frame(380, 230, "Rain falls on a bare slope. Water carries soil down (erosion) and leaves it at the bottom (deposition).");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 380, height: 230, class: "sky" }));
    s.appendChild(sv("path", { d: "M0 70 L250 200 L380 200 L380 230 L0 230 Z", class: "topsoil" }));
    s.appendChild(sv("path", { d: "M250 200 L380 200 L380 230 L250 230 Z", class: "water-pool" }));
    var cloud = sv("g", { class: "cloud" }, [sv("ellipse", { cx: 90, cy: 26, rx: 46, ry: 15 }), sv("ellipse", { cx: 120, cy: 32, rx: 30, ry: 12 })]); s.appendChild(cloud);
    var rain = sv("g", { class: "rain-fall" }); s.appendChild(rain);
    for (var i = 0; i < 8; i++) rain.appendChild(sv("line", { x1: 50 + i * 12, y1: 44, x2: 46 + i * 12, y2: 56, class: "drop d" + (i % 4) }));
    var pile = sv("path", { d: "M262 200 Q300 200 340 200 Z", class: "deposit" }); s.appendChild(pile);
    var grains = [], r = seeded(4);
    for (var k = 0; k < 26; k++) {
      var t = 0.1 + r() * 0.75, x = t * 250, y = 70 + t * 130 - 3;
      var g = sv("g", {}, [sv("circle", { r: f(1.5 + r() * 1.5), class: "p-coarse" })]); s.appendChild(g);
      grains.push({ g: g, x: x, y: y, ex: 262 + r() * 76, ey: 196 + r() * 3 });
      move(g, x, y, 0);
    }
    s.appendChild(txt(80, 132, "erosion", "lbl strong big", { transform: "rotate(27 80 132)" }));
    var dl = txt(300, 222, "deposition", "lbl strong mid light"); s.appendChild(dl);
    var cap = el("p", { class: "fig-cap", text: "Erosion: water, air and gravity remove soil. Deposition: the soil is left in a new place." });
    function play() {
      rain.classList.add("on");
      pile.setAttribute("d", "M262 200 Q300 200 340 200 Z");
      grains.forEach(function (gr, i) { move(gr.g, gr.x, gr.y, 0); });
      later(60, function () { grains.forEach(function (gr, i) { move(gr.g, gr.ex, gr.ey, 1800 + i * 40, 300 + i * 60); }); });
      later(3600, function () { pile.setAttribute("d", "M262 200 Q300 184 340 200 Z"); rain.classList.remove("on"); });
      cap.textContent = "Rain water runs down the bare slope and carries the soil away (erosion). At the bottom the soil collects (deposition).";
    }
    pile.setAttribute("d", "M262 200 Q300 184 340 200 Z"); grains.forEach(function (gr) { move(gr.g, gr.ex, gr.ey, 0); });
    return wrap(s, [btn("🌧️ Make it rain", play)], opts.small ? null : cap, opts);
  };

  /* 10. Activity 11.4: bare tray and grass tray */
  F.trays = function (spec, opts) {
    var s = frame(390, 230, "Tray A has bare soil, tray B has grass. After watering, the water from tray A is muddy and the water from tray B is clear.");
    var cups = [];
    ["A", "B"].forEach(function (n, i) {
      var x = 20 + i * 195;
      s.appendChild(sv("path", { d: "M" + x + " 110 l120 60 l0 14 l-120 -60z", class: "tray" }));
      s.appendChild(sv("path", { d: "M" + x + " 106 l120 60", class: n === "A" ? "tray-soil" : "tray-grass" }));
      if (n === "B") for (var g = 0; g < 9; g++) s.appendChild(emo(x + 8 + g * 12, 112 + g * 6, "🌱", 12));
      s.appendChild(sv("path", { d: "M" + (x + 120) + " 170 v40", class: "leg" }));
      s.appendChild(sv("path", { d: "M" + (x + 128) + " 188 h30 l-3 32 h-24z", class: "cup" }));
      var w = sv("rect", { x: x + 131, y: 218, width: 24, height: 0, class: n === "A" ? "cup-mud" : "cup-water" }); s.appendChild(w); cups.push(w);
      s.appendChild(sv("line", { x1: x + 140, y1: 176, x2: x + 140, y2: 188, class: "drip d" + i }));
      s.appendChild(emo(x + 6, 70, "🚿", 26));
      var rain = sv("g", { class: "rain-fall" }); for (var d = 0; d < 5; d++) rain.appendChild(sv("line", { x1: x + 26 + d * 9, y1: 76, x2: x + 24 + d * 9, y2: 88, class: "drop d" + (d % 4) })); s.appendChild(rain);
      s.appendChild(txt(x + 60, 26, "Tray " + n + (n === "A" ? ": bare soil" : ": grass"), "lbl mid strong"));
    });
    var cap = el("p", { class: "fig-cap", text: "Pour water on both trays and look at the water that comes out." });
    function play() {
      s.classList.add("pouring");
      cups.forEach(function (c) { c.style.transition = "none"; c.setAttribute("height", 0); c.setAttribute("y", 218); });
      later(50, function () { cups.forEach(function (c) { c.style.transition = RM ? "none" : "height 2500ms linear, y 2500ms linear"; c.setAttribute("height", 26); c.setAttribute("y", 192); }); });
      later(3000, function () { s.classList.remove("pouring"); cap.textContent = "Tray A gives muddy water: the soil is washed away. Tray B gives clear water: the grass roots hold the soil."; });
    }
    cups.forEach(function (c) { c.setAttribute("height", 26); c.setAttribute("y", 192); });
    return wrap(s, [btn("💧 Pour water", play)], opts.small ? null : cap, opts);
  };

  /* 11. Terrace farming compared with a bare slope */
  F.terrace = function (spec, opts) {
    var s = frame(400, 220, "Left: a bare slope, water runs fast and takes the soil. Right: terrace farming, flat steps slow the water and keep the soil.");
    s.appendChild(sv("rect", { x: 0, y: 0, width: 400, height: 220, class: "sky" }));
    s.appendChild(sv("path", { d: "M10 200 L10 60 L180 200 Z", class: "topsoil" }));
    var steps = "M220 200 L220 60 L250 60 L250 88 L280 88 L280 116 L310 116 L310 144 L340 144 L340 172 L370 172 L370 200 Z";
    s.appendChild(sv("path", { d: steps, class: "topsoil" }));
    [[235, 58], [265, 86], [295, 114], [325, 142], [355, 170]].forEach(function (p) { s.appendChild(emo(p[0] - 9, p[1], "🌾", 16)); });
    var fast = sv("g"), slow = sv("g"); s.appendChild(fast); s.appendChild(slow);
    var fd = [], sd = [];
    for (var i = 0; i < 6; i++) { var a = sv("g", {}, [sv("circle", { r: 3, class: "drop-c mud" })]); fast.appendChild(a); fd.push(a); move(a, 14, 62, 0); }
    for (var j = 0; j < 4; j++) { var b = sv("g", {}, [sv("circle", { r: 3, class: "drop-c" })]); slow.appendChild(b); sd.push(b); move(b, 226, 58, 0); }
    s.appendChild(sv("ellipse", { cx: 196, cy: 200, rx: 24, ry: 6, class: "deposit" }));
    s.appendChild(txt(70, 214, "bare slope", "lbl mid strong")); s.appendChild(txt(300, 214, "terraces", "lbl mid strong"));
    var cap = el("p", { class: "fig-cap", text: "On a bare slope, water runs fast and takes the topsoil. Terraces (flat steps) slow the water. The topsoil stays." });
    var stepPts = [[246, 58], [276, 86], [306, 114], [336, 142], [366, 170], [380, 198]];
    function play() {
      fd.forEach(function (d, i) { move(d, 14, 62, 0); later(40, function () { move(d, 186 + i * 3, 198, 1100, i * 250); }); });
      sd.forEach(function (d, i) {
        move(d, 226, 58, 0);
        stepPts.forEach(function (p, k) { later(400 + k * 1100 + i * 300, function () { move(d, p[0] - 10 + (i % 2) * 4, p[1] - 2, 1000); }); });
      });
    }
    return wrap(s, [btn("🌧️ Rain", play)], opts.small ? null : cap, opts);
  };

  /* 12. Cards: a set of pictures with short words (causes, effects, methods). Tap to hear. */
  F.cards = function (spec, opts) {
    var box = el("div", { class: "fig-cards" + (opts.small ? " small" : "") + (spec.cols ? " c" + spec.cols : "") }, spec.cards.map(function (c, i) {
      return el("button", { type: "button", class: "card-pic", style: "--d:" + (i * 0.12) + "s", onclick: function () { S.speak(c[1] + ". " + (c[2] || "")); } }, [
        el("span", { class: "card-emo", text: c[0] }), el("b", { text: c[1] }), c[2] ? el("span", { class: "card-t", text: c[2] }) : null
      ]);
    }));
    return box;
  };

  /* 13. A flow: picture → picture → picture, with moving arrows */
  F.flow = function (spec, opts) {
    return el("div", { class: "flows" + (opts.small ? " small" : "") }, spec.rows.map(function (row) {
      var kids = [];
      row.forEach(function (c, i) {
        if (i) kids.push(el("span", { class: "flow-arr", "aria-hidden": "true", text: "➜" }));
        kids.push(el("span", { class: "flow-step" }, [el("span", { class: "card-emo", text: c[0] }), el("span", { text: c[1] })]));
      });
      return el("div", { class: "flow-row" }, kids);
    }));
  };

  /* 14. Soil conservation methods, one small scene each */
  var METHODS = [
    { k: "mulch", name: "Mulching", t: "Cover the soil with dry or wet plants. The soil stays wet and is not washed away." },
    { k: "cover", name: "Cover cropping", t: "Grow small plants to cover the soil. They give green fertilizer. We do not harvest them." },
    { k: "mixed", name: "Mixed farming", t: "Grow leguminous plants (beans, peas) and other plants (maize) in the same field, in the same season." },
    { k: "rotation", name: "Crop rotation", t: "Grow beans one season and maize the next season, in the same field, turn by turn." },
    { k: "tillage", name: "Reducing tillage", t: "Plough less: not so often, not so deep. The soil is less disturbed." },
    { k: "terrace", name: "Terrace farming", t: "Make flat steps on a slope. The water slows down and the topsoil stays." }
  ];
  function methodScene(k) {
    var s = frame(240, 120, k);
    s.appendChild(sv("rect", { x: 0, y: 0, width: 240, height: 80, class: "sky" }));
    s.appendChild(sv("rect", { x: 0, y: 80, width: 240, height: 40, class: "topsoil" }));
    if (k === "mulch") { for (var i = 0; i < 12; i++) s.appendChild(emo(4 + i * 20, 86, i % 2 ? "🍂" : "🌾", 18)); s.appendChild(emo(200, 30, "☀️", 22)); }
    if (k === "cover") { for (var j = 0; j < 12; j++) s.appendChild(emo(2 + j * 20, 82, "🌱", 18, "sway")); }
    if (k === "mixed") { for (var m = 0; m < 8; m++) s.appendChild(emo(6 + m * 29, 82, m % 2 ? "🌽" : "🫘", 22, "sway")); }
    if (k === "rotation") {
      var a = sv("g", { class: "rot-a" }), b = sv("g", { class: "rot-b" });
      for (var n = 0; n < 7; n++) { a.appendChild(emo(10 + n * 32, 82, "🫘", 22)); b.appendChild(emo(10 + n * 32, 82, "🌽", 24)); }
      s.appendChild(a); s.appendChild(b);
      s.appendChild(sv("g", { class: "rot-a" }, [txt(120, 26, "Season 1: beans", "lbl mid strong")]));
      s.appendChild(sv("g", { class: "rot-b" }, [txt(120, 26, "Season 2: maize", "lbl mid strong")]));
    }
    if (k === "tillage") { s.appendChild(sv("path", { d: "M0 88 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0", class: "furrow" })); s.appendChild(sv("g", { class: "plough" }, [emo(0, 78, "🚜", 30)])); }
    if (k === "terrace") { s.appendChild(sv("path", { d: "M0 120 V40 H50 V60 H100 V80 H150 V100 H200 V120 Z", class: "topsoil" })); [[20, 38], [70, 58], [120, 78], [170, 98]].forEach(function (p) { s.appendChild(emo(p[0], p[1], "🌾", 16)); }); }
    return s;
  }
  F.methods = function (spec, opts) {
    var list = METHODS.filter(function (m) { return !spec.only || spec.only.indexOf(m.k) >= 0; });
    if (opts.small) return el("div", { class: "fig-cards" + " small" }, list.map(function (m) { return el("div", { class: "card-pic" }, [methodScene(m.k), el("b", { text: m.name })]); }));
    var view = el("div", { class: "method-view" }), tabs = el("div", { class: "choices tabs" });
    function show(i) {
      var m = list[i]; view.innerHTML = "";
      view.appendChild(methodScene(m.k));
      view.appendChild(el("p", { class: "fig-cap" }, [el("b", { text: m.name + ": " }), m.t]));
      Array.prototype.forEach.call(tabs.children, function (b, k) { b.setAttribute("aria-checked", k === i ? "true" : "false"); });
    }
    list.forEach(function (m, i) { tabs.appendChild(el("button", { type: "button", class: "choice", role: "radio", onclick: function () { show(i); S.speak(m.name + ". " + m.t); } }, [m.name])); });
    show(spec.start || 0);
    return el("div", { class: "fig-box" }, [tabs, view]);
  };

  /* 15. Key concepts map */
  F.mindmap = function (spec, opts) {
    var items = [
      ["What", "Weathered rock is soil."], ["Formation", "Rocks break (weathering). Soil has minerals."],
      ["Profile", "Humus, topsoil, subsoil, weathered rock, bedrock."], ["Pollution", "Waste, volcano, industry, mining, acid rain, farm chemicals."],
      ["Erosion", "Removing soil. Deposition: collecting it in a new place."], ["Conservation", "Mulching, cover cropping, mixed farming, crop rotation, less tillage, terraces."]
    ];
    return el("div", { class: "mind" + (opts.small ? " small" : "") }, [el("div", { class: "mind-c", text: "Soil" })].concat(items.map(function (it, i) {
      return el("div", { class: "mind-i", style: "--d:" + (i * 0.15) + "s" }, [el("b", { text: it[0] }), el("span", { text: it[1] })]);
    })));
  };

  /* 16. Four pictures A–D (question 4d) */
  F.scenes = function (spec, opts) {
    var pics = {
      factory: ["🏭", "💨", "Factory with smoke"], planting: ["🧑‍🌾", "🌱🌳", "People planting trees and plants"],
      garbage: ["🗑️", "🥫🛍️🧴", "A heap of garbage"], eroded: ["⛰️", "🌧️", "Bare land washed by rain"]
    };
    return el("div", { class: "scenes" + (opts.small ? " small" : "") }, spec.items.map(function (k, i) {
      var p = pics[k];
      return el("div", { class: "scene s-" + k }, [el("span", { class: "scene-l", text: "ABCD"[i] }), el("span", { class: "scene-big", text: p[0] }), el("span", { class: "scene-sm", text: p[1] }), el("span", { class: "scene-t", text: p[2] })]);
    }));
  };
})();
