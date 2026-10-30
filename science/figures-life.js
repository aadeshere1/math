/*
  Picture pack for "Living Organisms" (3.1 adaptation of animals and plants).
  Adds moving drawings to Science.figures, in the same style as figures-earth.js.
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
  // An emoji in a group, so CSS can move the group. flip: face the other way.
  function mover(x, y, e, size, cls, delay, flip) {
    var t = emo(0, 0, e, size);
    if (flip) t.setAttribute("transform", "scale(-1,1)");
    var inner = sv("g", { transform: "translate(" + x + "," + y + ")" }, [t]);
    return sv("g", { class: cls || "", style: delay ? "animation-delay:" + delay + "s" : null }, [inner]);
  }
  function wrap(svgNode, buttons, caption, opts) {
    var kids = [svgNode];
    if (caption && !(opts && opts.small)) kids.push(caption);
    if (buttons && buttons.length && !(opts && opts.small)) kids.push(el("div", { class: "fig-ctrl" }, buttons));
    return el("div", { class: "fig-box" }, kids);
  }
  function btn(label, fn) { return el("button", { type: "button", class: "tool-btn", onclick: fn }, [label]); }
  function cap(t) { return el("p", { class: "fig-cap", text: t }); }
  function later(ms, fn) { return setTimeout(fn, RM ? 0 : ms); }
  function seeded(seed) { var x = seed || 7; return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }

  /* ---------- pieces ---------- */
  function sky(s, h, cls) { s.appendChild(sv("rect", { x: 0, y: 0, width: 360, height: h, class: cls || "sky" })); }
  function ground(s, y, cls) { s.appendChild(sv("rect", { x: 0, y: y, width: 360, height: 200 - y, class: cls })); }
  function grass(s, y, x0, x1) {
    var d = "M" + (x0 || 0) + " " + y;
    for (var x = (x0 || 0); x < (x1 || 360); x += 10) d += " l5 -6 l5 6";
    s.appendChild(sv("path", { d: d, class: "grass" }));
  }
  function sun(s, x, y, r) {
    s.appendChild(sv("g", { class: "sun spin", transform: "translate(" + x + "," + y + ")" }, [sv("circle", { r: r || 14, class: "sun-c" })].concat([0, 45, 90, 135, 180, 225, 270, 315].map(function (a) {
      return sv("line", { x1: 0, y1: -(r || 14) - 5, x2: 0, y2: -(r || 14) - 12, class: "sun-ray", transform: "rotate(" + a + ")" });
    }))));
  }
  function cloud(s, x, y, k) {
    s.appendChild(sv("g", { class: "lf-cloud", style: "animation-delay:" + (k || 0) + "s" }, [sv("g", { transform: "translate(" + x + "," + y + ")" }, [
      sv("ellipse", { cx: 0, cy: 0, rx: 22, ry: 9, class: "lf-cl" }), sv("ellipse", { cx: 12, cy: -6, rx: 14, ry: 9, class: "lf-cl" }), sv("ellipse", { cx: -10, cy: -4, rx: 10, ry: 7, class: "lf-cl" })
    ])]));
  }
  function snowfall(s, n, seed) {
    var r = seeded(seed || 5), g = sv("g", { class: "lf-snowing" });
    for (var i = 0; i < n; i++) g.appendChild(sv("circle", { cx: f(r() * 360), cy: f(-10 - r() * 60), r: f(1.2 + r() * 1.6), class: "lf-flake", style: "animation-delay:-" + f(r() * 5) + "s;animation-duration:" + f(4 + r() * 3) + "s" }));
    s.appendChild(g);
  }
  function mountains(s, base, snowy) {
    s.appendChild(sv("path", { d: "M0 " + base + " L60 " + (base - 70) + " L110 " + (base - 30) + " L170 " + (base - 95) + " L240 " + (base - 25) + " L300 " + (base - 80) + " L360 " + (base - 35) + " V" + base + " Z", class: "lf-mtn" }));
    if (snowy) [[60, base - 70], [170, base - 95], [300, base - 80]].forEach(function (p) {
      s.appendChild(sv("path", { d: "M" + (p[0] - 18) + " " + (p[1] + 24) + " L" + p[0] + " " + p[1] + " L" + (p[0] + 18) + " " + (p[1] + 22) + " l-6 -4 l-6 5 l-6 -4 l-6 4z", class: "lf-cap" }));
    });
  }
  function water(s, y) {
    s.appendChild(sv("rect", { x: 0, y: y, width: 360, height: 200 - y, class: "lf-water" }));
    var d = "M0 " + y; for (var x = 0; x < 360; x += 20) d += " q5 -4 10 0 t10 0";
    s.appendChild(sv("path", { d: d, class: "lf-wave" }));
  }
  function bubbles(s, xs) {
    xs.forEach(function (x, i) { s.appendChild(sv("circle", { cx: x, cy: 190, r: 2.5, class: "lf-bubble", style: "animation-delay:-" + (i * 0.9) + "s" })); });
  }
  function weed(s, x, y, h, small) {
    // a submerged plant like Hydrilla: a wavy stem with small leaves
    var g = sv("g", { class: "sway" }), d = "M" + x + " " + y;
    for (var k = 1; k <= 4; k++) d += " q" + (k % 2 ? 6 : -6) + " " + (-h / 8) + " 0 " + (-h / 4);
    g.appendChild(sv("path", { d: d, class: "lf-stem" }));
    for (var j = 1; j < (small ? 6 : 9); j++) {
      var yy = y - j * h / (small ? 6 : 9);
      g.appendChild(sv("path", { d: "M" + x + " " + f(yy) + " l-7 -3 M" + x + " " + f(yy) + " l7 -3", class: "lf-tiny" }));
    }
    s.appendChild(g);
  }
  function pad(s, x, y, r) { s.appendChild(sv("path", { d: "M" + x + " " + y + " m-" + r + " 0 a" + r + " " + (r / 3) + " 0 1 0 " + (2 * r) + " 0 a" + r + " " + (r / 3) + " 0 1 0 -" + (2 * r) + " 0z", class: "lf-pad" })); }
  function roots(s, x, y, deep, wide) {
    var d = "M" + x + " " + y + " v" + deep;
    for (var i = 1; i <= 3; i++) d += " M" + x + " " + (y + i * deep / 4) + " l" + (-wide * i / 3) + " " + (deep / 5) + " M" + x + " " + (y + i * deep / 4) + " l" + (wide * i / 3) + " " + (deep / 5);
    s.appendChild(sv("path", { d: d, class: "root lf-root" }));
  }
  function tag(s, x, y, t, cls) { s.appendChild(txt(x, y, t, "lbl mid " + (cls || "lf-tag"))); }

  /* ---------- scenes: one habitat each ---------- */
  var SC = {};
  SC.home = { name: "Land and water", t: "Terrestrial organisms live on land. Aquatic organisms live in water. A frog can live in both.",
    draw: function (s) {
      sky(s, 200);
      s.appendChild(sv("rect", { x: 0, y: 120, width: 190, height: 80, class: "lf-grass" }));
      s.appendChild(sv("path", { d: "M190 120 Q200 114 210 120 H360 V200 H190Z", class: "lf-water" }));
      grass(s, 120, 0, 190);
      cloud(s, 120, 30, 0);
      s.appendChild(emo(16, 120, "🌳", 50));
      s.appendChild(mover(80, 160, "🐘", 34, "lf-bob"));
      s.appendChild(mover(140, 186, "🐄", 24, "lf-bob", -1));
      s.appendChild(emo(70, 116, "🌼", 16));
      s.appendChild(mover(290, 160, "🐟", 24, "lf-pace"));
      s.appendChild(mover(240, 186, "🐢", 22, "lf-pace", -2));
      s.appendChild(emo(300, 125, "🪷", 22));
      s.appendChild(mover(178, 124, "🐸", 22, "lf-hop"));
      bubbles(s, [270, 320]);
      tag(s, 95, 22, "Terrestrial (on land)", "lf-tag big");
      tag(s, 280, 100, "Aquatic (in water)", "lf-tag big");
    } };
  SC.aquatic = { name: "Aquatic animals", t: "Fish, dolphins, crocodiles, ducks and turtles live in water. Fins, gills, scales and a streamlined body help them.",
    draw: function (s) {
      sky(s, 60); water(s, 60);
      s.appendChild(mover(60, 66, "🦆", 26, "lf-bob"));
      s.appendChild(emo(300, 66, "🪷", 20));
      s.appendChild(mover(220, 100, "🐬", 34, "lf-jump"));
      [[400, 110, 0], [420, 140, -2.5], [400, 172, -5]].forEach(function (p) { s.appendChild(mover(p[0], p[1], "🐟", 22, "lf-swim", p[2])); });
      s.appendChild(mover(40, 150, "🐢", 26, "lf-pace", -1));
      s.appendChild(emo(120, 196, "🐊", 30));
      weed(s, 20, 200, 70); weed(s, 340, 200, 60, true);
      bubbles(s, [100, 200, 280]);
    } };
  SC.cursorial = { name: "Cursorial", t: "Cursorial animals run fast on land: tigers, lions, deer, zebras, horses, dogs, rabbits, kangaroos.",
    draw: function (s) {
      sky(s, 140); ground(s, 140, "lf-grass"); grass(s, 140);
      cloud(s, 80, 30, 0); cloud(s, 260, 46, -6);
      s.appendChild(emo(20, 112, "🌳", 40)); s.appendChild(emo(300, 110, "🌳", 34));
      s.appendChild(mover(250, 136, "🦓", 24, "lf-bob")); s.appendChild(mover(90, 136, "🐎", 22, "lf-bob", -1));
      s.appendChild(mover(380, 186, "🦌", 38, "lf-run", -1.6));
      s.appendChild(mover(450, 190, "🐅", 40, "lf-run", -1.6));
      [0, 1, 2].forEach(function (i) { s.appendChild(sv("line", { x1: 0, y1: 160 + i * 10, x2: 30, y2: 160 + i * 10, class: "wind-l lf-speed" })); });
    } };
  SC.arboreal = { name: "Arboreal", t: "Arboreal animals live in trees or on walls: monkeys, squirrels, lizards, chameleons.",
    draw: function (s) {
      sky(s, 200);
      s.appendChild(sv("rect", { x: 0, y: 180, width: 360, height: 20, class: "lf-grass" }));
      // tree
      s.appendChild(sv("path", { d: "M110 200 L118 70 L132 70 L140 200Z", class: "lf-trunk" }));
      s.appendChild(sv("path", { d: "M125 110 Q170 90 230 96", class: "lf-branch" }));
      s.appendChild(sv("path", { d: "M122 84 Q80 70 40 80", class: "lf-branch" }));
      [[125, 50, 60, 34], [60, 66, 36, 20], [215, 82, 34, 18]].forEach(function (c) { s.appendChild(sv("ellipse", { cx: c[0], cy: c[1], rx: c[2], ry: c[3], class: "lf-leaves" })); });
      var swing = sv("g", { class: "lf-swing" }, [sv("line", { x1: 200, y1: 98, x2: 200, y2: 120, class: "lf-tail" }), emo(184, 146, "🐒", 30)]);
      s.appendChild(swing);
      s.appendChild(mover(122, 160, "🐿️", 24, "lf-climb", -1));
      s.appendChild(emo(36, 80, "🦎", 18));
      // wall
      s.appendChild(sv("rect", { x: 280, y: 60, width: 80, height: 120, class: "lf-wall" }));
      for (var r = 0; r < 6; r++) s.appendChild(sv("path", { d: "M280 " + (80 + r * 20) + " H360 M" + (r % 2 ? 300 : 320) + " " + (60 + r * 20) + " v20 M" + (r % 2 ? 340 : 360) + " " + (60 + r * 20) + " v20", class: "lf-brick" }));
      var liz = sv("g", { class: "lf-climb" }, [sv("g", { transform: "translate(318,150) rotate(90)" }, [emo(0, 0, "🦎", 26)])]);
      s.appendChild(liz);
      tag(s, 320, 54, "wall"); tag(s, 200, 192, "monkey swings");
    } };
  SC.aerial = { name: "Aerial", t: "Aerial animals spend most of their time flying: eagles, sparrows, pigeons, parrots, crows, owls.",
    draw: function (s) {
      sky(s, 200, "lf-sky2");
      mountains(s, 200, false);
      cloud(s, 60, 40, 0); cloud(s, 230, 70, -8);
      s.appendChild(mover(400, 60, "🦅", 34, "lf-fly"));
      s.appendChild(mover(430, 110, "🕊️", 24, "lf-fly", -3));
      s.appendChild(mover(400, 90, "🐦", 20, "lf-fly", -6));
      s.appendChild(sv("path", { d: "M300 200 L304 130 L312 130 L316 200Z", class: "lf-trunk" }));
      s.appendChild(sv("path", { d: "M308 150 Q330 140 356 146", class: "lf-branch" }));
      s.appendChild(mover(326, 146, "🦜", 24, "lf-bob"));
      s.appendChild(mover(286, 132, "🦉", 22, "lf-bob", -1));
    } };
  SC.fossorial = { name: "Fossorial", t: "Fossorial (burrowing) animals live in underground burrows: rats, rabbits, moles, mongooses. Snakes use holes made by others.",
    draw: function (s) {
      sky(s, 70); ground(s, 70, "topsoil"); grass(s, 70);
      s.appendChild(sv("path", { d: "M70 70 Q74 60 86 62 Q98 60 100 70", class: "lf-mound" }));
      s.appendChild(sv("path", { d: "M84 70 C80 100 120 110 160 112 S250 120 270 150 M160 112 C170 140 140 160 110 170", class: "lf-tunnel" }));
      s.appendChild(sv("ellipse", { cx: 280, cy: 160, rx: 40, ry: 22, class: "lf-hole" }));
      s.appendChild(sv("ellipse", { cx: 100, cy: 172, rx: 34, ry: 18, class: "lf-hole" }));
      s.appendChild(emo(260, 174, "🐇", 32));
      s.appendChild(mover(90, 182, "🐀", 22, "lf-pace"));
      s.appendChild(sv("ellipse", { cx: 44, cy: 132, rx: 26, ry: 16, class: "lf-hole" }));
      s.appendChild(emo(30, 140, "🐍", 26));
      tag(s, 200, 100, "burrow (tunnel)", "lf-tag light");
      for (var i = 0; i < 6; i++) s.appendChild(emo(200 + i * 26, 64, "🌱", 12));
    } };
  SC.desert = { name: "Desert", t: "Desert animals live in hot, dry places: camels, desert foxes, rats, snakes, lizards.",
    draw: function (s) {
      sky(s, 200, "lf-hotsky"); sun(s, 310, 36, 18);
      s.appendChild(sv("path", { d: "M0 140 Q80 110 170 138 T360 132 V200 H0Z", class: "lf-sand" }));
      s.appendChild(sv("path", { d: "M0 170 Q100 150 200 172 T360 168 V200 H0Z", class: "lf-sand2" }));
      [0, 1, 2].forEach(function (i) { s.appendChild(sv("path", { d: "M" + (40 + i * 100) + " " + (104 - i * 4) + " q10 -5 20 0 t20 0 t20 0", class: "wind-l lf-heat" })); });
      s.appendChild(emo(30, 150, "🌵", 36)); s.appendChild(emo(290, 160, "🌵", 30));
      s.appendChild(mover(380, 172, "🐫", 50, "lf-walk", -5));
      s.appendChild(mover(60, 192, "🐍", 20, "lf-pace", -2));
      s.appendChild(emo(220, 194, "🦎", 18));
    } };
  SC.polar = { name: "Cold or polar", t: "Polar animals live in very cold places: yaks, snow leopards, polar bears, red pandas, snow owls.",
    draw: function (s) {
      sky(s, 200, "lf-coldsky"); mountains(s, 150, true);
      s.appendChild(sv("path", { d: "M0 150 Q90 140 180 150 T360 146 V200 H0Z", class: "lf-snowg" }));
      s.appendChild(mover(30, 186, "🐂", 40, "lf-bob")); tag(s, 52, 196, "yak");
      s.appendChild(mover(150, 186, "🐻‍❄️", 40, "lf-bob", -1)); tag(s, 172, 196, "polar bear");
      s.appendChild(mover(260, 168, "🐆", 34, "lf-bob", -2)); tag(s, 280, 182, "snow leopard");
      s.appendChild(emo(320, 128, "🦉", 22));
      snowfall(s, 40, 3);
    } };
  // plants
  SC.waterplants = { name: "Aquatic plants", t: "Lotus and water hyacinth float on water with broad leaves. Hydrilla grows under water (submerged) with small, scale-like leaves.",
    draw: function (s) {
      sky(s, 70); water(s, 70);
      pad(s, 70, 72, 22); pad(s, 110, 74, 16); s.appendChild(mover(78, 72, "🪷", 30, "lf-bob"));
      pad(s, 240, 72, 14); pad(s, 262, 74, 12); s.appendChild(emo(240, 70, "🪻", 22));
      s.appendChild(sv("path", { d: "M90 74 q4 40 -2 120 M250 76 q-3 12 0 20 m-6 -16 q-3 10 0 18 m12 -18 q3 10 0 18", class: "lf-stem" }));
      weed(s, 170, 200, 110); weed(s, 190, 200, 96, true); weed(s, 320, 200, 90);
      s.appendChild(mover(400, 150, "🐟", 18, "lf-swim", -2));
      tag(s, 90, 50, "lotus (floating)", "lf-tag"); tag(s, 250, 50, "water hyacinth", "lf-tag"); tag(s, 180, 194, "Hydrilla (submerged)", "lf-tag light");
    } };
  SC.mesophyte = { name: "Mesophytes", t: "Mesophytes grow in moderate climate, with enough water and air: marigold, peepal, mango, mustard. Strong stems and deep roots.",
    draw: function (s) {
      sky(s, 130); sun(s, 320, 32, 13); cloud(s, 120, 34, 0);
      ground(s, 130, "topsoil"); s.appendChild(sv("rect", { x: 0, y: 124, width: 360, height: 8, class: "lf-grass" }));
      s.appendChild(sv("path", { d: "M74 130 L78 70 L88 70 L92 130Z", class: "lf-trunk" }));
      s.appendChild(sv("ellipse", { cx: 83, cy: 58, rx: 52, ry: 36, class: "lf-leaves" }));
      [[60, 56], [96, 70], [104, 44]].forEach(function (p) { s.appendChild(emo(p[0], p[1], "🥭", 14)); });
      roots(s, 83, 130, 60, 40);
      for (var i = 0; i < 6; i++) s.appendChild(sv("g", { class: "sway", style: "animation-delay:-" + i * 0.4 + "s" }, [emo(170 + i * 28, 128, "🌼", 22)]));
      roots(s, 240, 130, 30, 12);
      tag(s, 83, 112, "mango", "lf-tag light"); tag(s, 250, 96, "marigold, mustard"); tag(s, 160, 186, "deep, strong roots", "lf-tag light");
    } };
  SC.xerophyte = { name: "Xerophytes", t: "Xerophytes live in dry, hot places: Opuntia, aloe vera, yucca, agave. Spines, thick fleshy stems, a waxy cuticle and long roots.",
    draw: function (s) {
      sky(s, 120, "lf-hotsky"); sun(s, 320, 34, 18);
      ground(s, 120, "lf-sand");
      [0, 1].forEach(function (i) { s.appendChild(sv("path", { d: "M" + (150 + i * 90) + " " + (80 - i * 6) + " q10 -5 20 0 t20 0 t20 0", class: "wind-l lf-heat" })); });
      s.appendChild(emo(40, 124, "🌵", 70));
      s.appendChild(emo(220, 124, "🪴", 40));
      s.appendChild(sv("path", { d: "M75 122 v30 M75 128 q-40 10 -70 6 M75 128 q50 8 110 4 M75 140 q-30 14 -60 20 M75 140 q40 16 90 20", class: "root lf-root" }));
      tag(s, 140, 52, "spines (not broad leaves)", "lf-tag"); tag(s, 150, 96, "thick, fleshy stem", "lf-tag");
      tag(s, 240, 136, "aloe vera"); tag(s, 110, 190, "long, wide-spread roots", "lf-tag light");
    } };
  SC.cold = { name: "Cold climate", t: "Cold climate plants grow on high mountains: pines, cedars, firs. Tall, straight, needle leaves, cone shape. Mosses and ferns grow in cool, shady places.",
    draw: function (s) {
      sky(s, 200, "lf-coldsky"); mountains(s, 140, true);
      s.appendChild(sv("path", { d: "M0 150 Q90 140 180 150 T360 146 V200 H0Z", class: "lf-snowg" }));
      [[20, 156, 56], [80, 150, 70], [150, 158, 50], [200, 154, 62]].forEach(function (p) { s.appendChild(emo(p[0], p[1], "🌲", p[2])); });
      s.appendChild(sv("path", { d: "M262 196 Q290 160 330 168 Q356 176 360 196Z", class: "lf-rock" }));
      s.appendChild(emo(272, 196, "🌿", 26)); s.appendChild(emo(306, 196, "🌿", 22));
      tag(s, 110, 196, "pine trees: cone shape", "lf-tag"); tag(s, 310, 154, "ferns, moss (shade)", "lf-tag");
      snowfall(s, 30, 9);
    } };
  SC.creepers = { name: "Creepers and climbers", t: "Creepers (strawberry, pumpkin, watermelon) grow along the ground. Climbers (peas, grapevine, money plant, gourd) climb a support with tendrils, hooks or sticky pads.",
    draw: function (s) {
      sky(s, 150); sun(s, 330, 30, 12); ground(s, 150, "topsoil"); grass(s, 150);
      s.appendChild(sv("path", { d: "M10 150 C40 140 70 156 100 146 S150 154 180 146", class: "lf-vine draw slow" }));
      s.appendChild(emo(30, 152, "🎃", 22)); s.appendChild(emo(90, 152, "🍉", 22)); s.appendChild(emo(150, 152, "🍓", 18));
      s.appendChild(sv("rect", { x: 256, y: 40, width: 6, height: 112, class: "lf-pole" }));
      var d = "M259 150"; for (var i = 0; i < 7; i++) d += " q" + (i % 2 ? -14 : 14) + " -8 0 -16";
      s.appendChild(sv("path", { d: d, class: "lf-vine draw slow" }));
      [[262, 130], [244, 106], [262, 82], [244, 60]].forEach(function (p, i) { s.appendChild(sv("path", { d: "M" + p[0] + " " + p[1] + " q" + (i % 2 ? -12 : 12) + " -2 " + (i % 2 ? -10 : 10) + " -10 q-4 -4 -6 0", class: "lf-tendril" })); });
      s.appendChild(emo(268, 118, "🫛", 16)); s.appendChild(emo(234, 96, "🍇", 16)); s.appendChild(emo(268, 70, "🫛", 16));
      tag(s, 96, 128, "creeper: along the ground"); tag(s, 260, 30, "climber: up a support");
      tag(s, 318, 108, "tendrils", "lf-tag");
    } };

  var ANIMALS = ["cursorial", "arboreal", "aerial", "fossorial", "desert", "polar"];
  var PLANTS = ["waterplants", "mesophyte", "xerophyte", "cold", "creepers"];
  function scene(k) { var c = SC[k], s = frame(360, 200, c.name + ". " + c.t); c.draw(s); return s; }

  /* 1. Habitats: one scene ({ k }), or tabs to switch scenes ({ only } or { set: "animals" | "plants" }) */
  F.habit = function (spec, opts) {
    var list = spec.k ? [spec.k] : (spec.only || (spec.set === "plants" ? PLANTS : ANIMALS));
    if (list.length === 1) return wrap(scene(list[0]), null, cap(SC[list[0]].t), opts);
    if (opts.small) return el("div", { class: "fig-cards small" }, list.map(function (k) { return el("div", { class: "card-pic" }, [scene(k), el("b", { text: SC[k].name })]); }));
    var view = el("div", { class: "method-view" }), tabs = el("div", { class: "choices tabs" });
    function show(i) {
      var c = SC[list[i]]; view.innerHTML = "";
      view.appendChild(scene(list[i]));
      view.appendChild(el("p", { class: "fig-cap" }, [el("b", { text: c.name + ": " }), c.t]));
      Array.prototype.forEach.call(tabs.children, function (b, k) { b.setAttribute("aria-checked", k === i ? "true" : "false"); });
    }
    list.forEach(function (k, i) { tabs.appendChild(el("button", { type: "button", class: "choice", role: "radio", onclick: function () { show(i); S.speak(SC[k].name + ". " + SC[k].t); } }, [SC[k].name])); });
    show(spec.start || 0);
    return el("div", { class: "fig-box" }, [tabs, view]);
  };

  /* 2. An animal or plant with its adaptive parts. Tap a part to hear it. */
  F.parts = function (spec, opts) {
    var hero = el("div", { class: "lf-hero" }, [el("span", { class: "lf-hero-e", text: spec.emo }), el("b", { text: spec.name })]);
    var list = el("div", { class: "lf-parts" + (opts.small ? " small" : "") }, spec.parts.map(function (p, i) {
      return el("button", { type: "button", class: "lf-part", style: "--d:" + (0.2 + i * 0.25) + "s", onclick: function () { S.speak(p[1] + ". " + p[2]); } }, [
        el("span", { class: "lf-part-e", text: p[0] }), el("span", {}, [el("b", { text: p[1] }), el("span", { class: "card-t", text: p[2] })])
      ]);
    }));
    return el("div", { class: "lf-anatomy" + (opts.small ? " small" : "") }, [hero, list]);
  };

  /* 3. A fish and its adaptive parts. letters: show A, B, C… instead of names. Swim shows the water flowing past. */
  var FISH = [
    { k: "gills", name: "Gills", t: "take in oxygen dissolved in water", at: [100, 104], lab: [40, 170] },
    { k: "fin", name: "Fins", t: "for swimming and steering", at: [168, 62], lab: [150, 26] },
    { k: "tail", name: "Tail fin", t: "pushes the fish forward", at: [276, 100], lab: [318, 150] },
    { k: "scales", name: "Scales", t: "smooth and waterproof; protect the body", at: [180, 98], lab: [200, 182] },
    { k: "body", name: "Streamlined body", t: "pointed at both ends; less friction in water", at: [62, 100], lab: [60, 40] }
  ];
  F.fish = function (spec, opts) {
    var s = frame(360, 200, "A fish with its gills, fins, tail fin, smooth scales and streamlined body", "lf-fishfig");
    var keys = spec.letters || FISH.map(function (p) { return p.k; });
    var flow = sv("g", { class: "lf-flow" });
    [[60, "M0 70 C60 70 90 50 170 50 S280 62 360 66"], [60, "M0 130 C60 130 90 150 170 150 S280 138 360 134"], [0, "M0 100 H40"], [0, "M300 100 H360"]].forEach(function (p) { flow.appendChild(sv("path", { d: p[1], class: "lf-flowline" })); });
    s.appendChild(flow);
    var fish = sv("g", { class: "lf-fishbody" });
    fish.appendChild(sv("path", { d: "M238 100 L292 64 L280 100 L292 136 Z", class: "lf-fin" + (spec.hl === "tail" ? " hl" : "") }));
    fish.appendChild(sv("path", { d: "M140 70 Q160 38 200 76 Z", class: "lf-fin" + (spec.hl === "fin" ? " hl" : "") }));
    fish.appendChild(sv("path", { d: "M186 122 Q204 146 222 116 Z", class: "lf-fin" + (spec.hl === "fin" ? " hl" : "") }));
    fish.appendChild(sv("path", { d: "M58 100 C96 58 190 60 242 96 L242 104 C190 140 96 142 58 100 Z", class: "lf-fishb" + (spec.hl === "body" ? " hl" : "") }));
    var sc = sv("g", { class: "lf-scales" + (spec.hl === "scales" ? " hl" : "") });
    for (var x = 120; x <= 225; x += 12) for (var y = 80; y <= 120; y += 10) {
      var dx = (x - 150) / 95, dy = (y - 100) / 30;
      if (dx * dx + dy * dy < 0.8) sc.appendChild(sv("path", { d: "M" + x + " " + y + " q5 5 0 10", class: "lf-scale" }));
    }
    fish.appendChild(sc);
    fish.appendChild(sv("path", { d: "M112 112 Q126 136 144 118 Z", class: "lf-fin" + (spec.hl === "fin" ? " hl" : "") }));
    fish.appendChild(sv("path", { d: "M102 80 Q90 100 102 122", class: "lf-gill" + (spec.hl === "gills" ? " hl" : "") }));
    fish.appendChild(sv("circle", { cx: 80, cy: 94, r: 5, class: "lf-eye" }));
    fish.appendChild(sv("circle", { cx: 81, cy: 93, r: 2, class: "eye" }));
    fish.appendChild(sv("path", { d: "M60 102 l10 1", class: "lf-gill" }));
    s.appendChild(fish);
    keys.forEach(function (k, i) {
      var p = FISH.filter(function (q) { return q.k === k; })[0]; if (!p) return;
      s.appendChild(sv("line", { x1: p.lab[0], y1: p.lab[1] - 4, x2: p.at[0], y2: p.at[1], class: "lf-lead" }));
      if (spec.letters) {
        s.appendChild(sv("circle", { cx: p.lab[0], cy: p.lab[1] - 4, r: 10, class: "num-c" }));
        s.appendChild(txt(p.lab[0], p.lab[1], "ABCDE"[i], "lbl mid strong big"));
      } else s.appendChild(txt(p.lab[0], p.lab[1], p.name, "lbl mid strong lf-tagbg"));
    });
    var c = cap(spec.letters ? "Look at the letters A, B, C… on the fish." : "Gills: breathing. Fins: swimming. Scales: smooth, waterproof. Streamlined body: less friction.");
    function swim() {
      s.classList.add("swimming"); c.textContent = "The pointed, streamlined body lets water slide past easily.";
      later(4000, function () { s.classList.remove("swimming"); });
    }
    return wrap(s, [btn("🌊 Swim", swim)], c, opts);
  };

  /* 4. Activity 3.9: polythene bags on aloe vera and a leafy plant, left in the sun */
  F.bags = function (spec, opts) {
    var s = frame(360, 220, "Polythene bags tied on an aloe vera plant and a leafy plant. In the sun, many water droplets collect in the bag of the leafy plant and very few in the bag of the aloe vera.");
    sky(s, 220);
    var sn = sv("g", { class: "lf-sunon" }); s.appendChild(sn); sun(sn, 180, 30, 16);
    function pot(x) { s.appendChild(sv("path", { d: "M" + (x - 30) + " 170 h60 l-8 40 h-44z", class: "lf-pot" })); }
    pot(90); pot(270);
    // aloe vera: thick pointed leaves
    [[-28, -60], [-14, -78], [0, -86], [14, -78], [28, -60]].forEach(function (p) {
      s.appendChild(sv("path", { d: "M90 170 Q" + (90 + p[0] * 0.4) + " " + (170 + p[1] * 0.5) + " " + (90 + p[0]) + " " + (170 + p[1]) + " Q" + (90 + p[0] * 0.2 + 4) + " " + (170 + p[1] * 0.5) + " 96 170Z", class: "lf-aloe" }));
    });
    // leafy plant
    s.appendChild(sv("path", { d: "M270 170 V84", class: "lf-stem" }));
    [[-1, 150], [1, 136], [-1, 120], [1, 106], [-1, 92]].forEach(function (p) {
      s.appendChild(sv("path", { d: "M270 " + p[1] + " q" + (p[0] * 20) + " -18 " + (p[0] * 34) + " -4 q" + (-p[0] * 16) + " 12 " + (-p[0] * 34) + " 4z", class: "lf-leafy" }));
    });
    function bag(x, top) { s.appendChild(sv("path", { d: "M" + (x - 42) + " 160 Q" + (x - 50) + " " + top + " " + x + " " + (top - 6) + " Q" + (x + 50) + " " + top + " " + (x + 42) + " 160 Z", class: "lf-bag" })); s.appendChild(sv("path", { d: "M" + (x - 42) + " 160 h84", class: "lf-tie" })); }
    bag(90, 86); bag(270, 80);
    var r = seeded(11), drops = [];
    function addDrops(x, n) { for (var i = 0; i < n; i++) { var d = sv("circle", { cx: f(x - 34 + r() * 68), cy: f(92 + r() * 60), r: f(1.6 + r() * 1.8), class: "drop-c lf-drop" }); s.appendChild(d); drops.push(d); } }
    addDrops(90, 3); addDrops(270, 26);
    tag(s, 90, 216, "aloe vera"); tag(s, 270, 216, "leafy plant");
    var c = cap("After a few hours in the sun: many droplets in the leafy plant's bag, very few in the aloe vera's bag.");
    function play() {
      drops.forEach(function (d) { d.style.transition = "none"; d.style.opacity = 0; });
      c.textContent = "The sun is shining… water goes out of the leaves.";
      drops.forEach(function (d, i) { later(400 + i * 110, function () { d.style.transition = "opacity .5s"; d.style.opacity = 1; }); });
      later(400 + drops.length * 110 + 300, function () { c.textContent = "Many droplets from the leafy plant, very few from aloe vera. Aloe vera's thick, waxy leaves save water."; });
    }
    return wrap(s, [btn("☀️ Leave in the sun", play)], c, opts);
  };

  /* 5. Snow on a cone-shaped pine and on a broad, flat tree */
  F.pinesnow = function (spec, opts) {
    var s = frame(360, 220, "Snow falls on a cone-shaped pine tree and on a broad tree. Snow slides off the pine. Snow piles up on the broad tree and its branch bends and breaks.");
    sky(s, 220, "lf-coldsky");
    s.appendChild(sv("rect", { x: 0, y: 196, width: 360, height: 24, class: "lf-snowg" }));
    // pine
    s.appendChild(sv("rect", { x: 84, y: 170, width: 12, height: 28, class: "lf-trunk" }));
    [[90, 40, 34, 70], [90, 76, 46, 112], [90, 112, 58, 172]].forEach(function (t) { s.appendChild(sv("path", { d: "M" + t[0] + " " + t[1] + " L" + (t[0] + t[2]) + " " + t[3] + " H" + (t[0] - t[2]) + " Z", class: "lf-pine" })); });
    var slide = sv("g"); s.appendChild(slide);
    var pile = sv("path", { d: "M40 198 Q60 186 80 198 M100 198 Q120 186 140 198", class: "lf-pile" }); s.appendChild(pile);
    // broad tree
    s.appendChild(sv("path", { d: "M262 198 L266 120 L278 120 L282 198Z", class: "lf-trunk" }));
    var br = sv("g", { class: "lf-bend" });
    br.appendChild(sv("path", { d: "M276 132 Q300 124 340 126", class: "lf-branch" }));
    br.appendChild(sv("ellipse", { cx: 326, cy: 120, rx: 28, ry: 9, class: "lf-leaves" }));
    var snowR = sv("ellipse", { cx: 326, cy: 110, rx: 26, ry: 6, class: "lf-snowcap" }); br.appendChild(snowR);
    s.appendChild(br);
    s.appendChild(sv("ellipse", { cx: 250, cy: 100, rx: 52, ry: 16, class: "lf-leaves" }));
    var snowT = sv("ellipse", { cx: 250, cy: 86, rx: 48, ry: 8, class: "lf-snowcap" }); s.appendChild(snowT);
    var crack = sv("path", { d: "M286 126 l4 6 l-3 3 l4 5", class: "lf-crack" }); s.appendChild(crack);
    snowfall(s, 30, 4);
    tag(s, 90, 30, "cone shape: snow slides off", "lf-tag"); tag(s, 270, 64, "broad, flat: snow piles up", "lf-tag");
    var c = cap("The cone shape sheds the snow. On the broad tree the heavy snow bends and breaks the branch.");
    function finalState(on) {
      br.classList.toggle("bent", on); crack.style.opacity = on ? 1 : 0;
      [snowR, snowT].forEach(function (n) { n.style.transform = on ? "scaleY(1)" : "scaleY(0.1)"; });
      pile.style.opacity = on ? 1 : 0;
    }
    finalState(true);
    function play() {
      finalState(false); slide.innerHTML = "";
      c.textContent = "Snow is falling on both trees…";
      later(300, function () { [snowR, snowT].forEach(function (n) { n.style.transition = RM ? "none" : "transform 3s"; n.style.transform = "scaleY(1)"; }); });
      [[70, 60], [110, 60], [64, 100], [116, 100], [54, 140], [126, 140]].forEach(function (p, i) {
        var g = sv("circle", { cx: p[0], cy: p[1], r: 4, class: "lf-flake big" }); slide.appendChild(g);
        later(600 + i * 300, function () { g.style.transition = RM ? "none" : "transform 1.4s ease-in"; g.style.transform = "translate(" + (p[0] < 90 ? -20 : 20) + "px," + (196 - p[1]) + "px)"; });
      });
      later(2600, function () { pile.style.transition = "opacity 1s"; pile.style.opacity = 1; });
      later(3400, function () { br.classList.add("bent"); crack.style.transition = "opacity .4s"; crack.style.opacity = 1; c.textContent = "The cone shape sheds the snow. On the broad tree the heavy snow bends and breaks the branch."; });
    }
    return wrap(s, [btn("❄️ Let it snow", play)], c, opts);
  };

  /* 6. Pictures with letters A, B, C… (for "identify" questions). names: show the names too. */
  var PICS = {
    lotus: ["🪷", "pond", "Lotus"], pine: ["🌲", "snow", "Pine"], cactus: ["🌵", "sand", "Cactus"], mustard: ["🌼", "field", "Mustard"],
    camel: ["🐫", "sand", "Camel"], polarbear: ["🐻‍❄️", "snow", "Polar bear"], fish: ["🐟", "pond", "Fish"], eagle: ["🦅", "skyb", "Eagle"],
    monkey: ["🐒", "forest", "Monkey"], rabbit: ["🐇", "soil", "Rabbit"], deer: ["🦌", "field", "Deer"], frog: ["🐸", "pond", "Frog"]
  };
  F.lettered = function (spec, opts) {
    return el("div", { class: "scenes" + (opts.small ? " small" : "") }, spec.items.map(function (k, i) {
      var p = PICS[k];
      return el("div", { class: "scene lf-bg-" + p[1] }, [el("span", { class: "scene-l", text: "ABCDEF"[i] }), el("span", { class: "scene-big", text: p[0] }), spec.names ? el("span", { class: "scene-t", text: p[2] }) : null]);
    }));
  };
})();
