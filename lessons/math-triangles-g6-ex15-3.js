/*
  Exercise 15.3: Quadrilaterals (angle sum 360°, rectangles, squares, parallelograms).
  Source: Vedanta Excel in Mathematics, Book 6, pages 224-225.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function n(id, label, answer, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: "°", mistakes: mistakes }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function rad(d) { return d * Math.PI / 180; }
  function polar(o, deg, r) { return [o[0] + r * Math.cos(rad(deg)), o[1] + r * Math.sin(rad(deg))]; }
  function beyond(a, b, d) { var L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [b[0] + (b[0] - a[0]) / L * d, b[1] + (b[1] - a[1]) / L * d]; }
  function add(a, b, c) { return [a[0] + b[0] - c[0], a[1] + b[1] - c[1]]; }

  /* Q3: ABCD with AB produced to E and AD produced to F */
  var A3 = [0, 0], B3 = [200, 0], D3 = polar(A3, 110, 120);
  var FIG_Q3 = {
    type: "geo",
    points: { A: [0, 0, 225], B: [200, 0, 270], E: [265, 0, 315], D: [D3[0], D3[1], 200], F: beyond(A3, D3, 50).concat(135),
              _B2: polar(B3, 80, 100), _D2: polar(D3, 5, 100) },
    meet: { C: ["B", "_B2", "D", "_D2"] }, meetLab: { C: 45 },
    lines: [["A", "E"], ["A", "F"], ["B", "C"], ["D", "C"]],
    marks: [{ at: "A", a: "B", b: "D", label: "110°", r: 18 }, { at: "B", a: "A", b: "C", label: "x°", r: 22 }, { at: "B", a: "E", b: "C", label: "80°", r: 26, push: 4 },
            { at: "D", a: "F", b: "C", label: "105°", r: 16 }, { at: "D", a: "A", b: "C", label: "y°", r: 18 }, { at: "C", a: "B", b: "D", label: "z°", r: 20 }]
  };

  /* Q4 figures */
  var a_TL = [0, 160], a_TR = [200, 160], a_BL = [0, 20];
  var FIG_A = {
    type: "geo",
    points: { _TL: a_TL, _TR: a_TR, _BL: a_BL, _P1: polar(a_BL, -5, 100), _P2: polar(a_TR, 250, 100) },
    meet: { _BR: ["_BL", "_P1", "_TR", "_P2"] },
    lines: [["_TL", "_TR"], ["_TR", "_BR"], ["_BR", "_BL"], ["_BL", "_TL"]],
    marks: [{ at: "_TL", a: "_TR", b: "_BL", label: "90°", r: 18 }, { at: "_TR", a: "_TL", b: "_BR", label: "70°", r: 22 },
            { at: "_BR", a: "_BL", b: "_TR", label: "105°", r: 18 }, { at: "_BL", a: "_BR", b: "_TL", label: "x°", r: 18 }]
  };
  var b_BL = [0, 0], b_BR = [180, 0], b_L = polar(b_BL, 110, 90);
  var FIG_B = {
    type: "geo",
    points: { _BL: b_BL, _BR: b_BR, _L: b_L, _P1: polar(b_L, 20, 100), _P2: polar(b_BR, 75, 100) },
    meet: { _TR: ["_L", "_P1", "_BR", "_P2"] },
    lines: [["_BL", "_BR"], ["_BR", "_TR"], ["_TR", "_L"], ["_L", "_BL"]],
    marks: [{ at: "_L", a: "_BL", b: "_TR", label: "90°", r: 18 }, { at: "_TR", a: "_L", b: "_BR", label: "x°", r: 22 },
            { at: "_BR", a: "_BL", b: "_TR", label: "105°", r: 18 }, { at: "_BL", a: "_BR", b: "_L", label: "2x°", r: 18 }]
  };
  var c_LL = [0, 0], c_UL = [0, 90], c_T = polar(c_UL, 18, 110);
  var FIG_C = {
    type: "geo",
    points: { _LL: c_LL, _UL: c_UL, _T: c_T, _P1: polar(c_LL, 6, 100), _P2: polar(c_T, -36, 100) },
    meet: { _R: ["_LL", "_P1", "_T", "_P2"] },
    lines: [["_LL", "_UL"], ["_UL", "_T"], ["_T", "_R"], ["_R", "_LL"]],
    marks: [{ at: "_UL", a: "_LL", b: "_T", label: "108°", r: 16 }, { at: "_T", a: "_UL", b: "_R", label: "3a°", r: 18 },
            { at: "_R", a: "_T", b: "_LL", label: "a°", r: 30 }, { at: "_LL", a: "_R", b: "_UL", label: "2a°", r: 18 }]
  };
  function meet(a, b, c, d) { // where line ab crosses line cd
    var den = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]);
    var t = ((a[0] - c[0]) * (c[1] - d[1]) - (a[1] - c[1]) * (c[0] - d[0])) / den;
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
  }
  var d_L = [0, 0], d_TL = polar(d_L, 55, 80), d_TR = polar(d_TL, 15, 170);
  var d_B = meet(d_L, polar(d_L, -33, 100), d_TR, polar(d_TR, -113, 100));
  var FIG_D = {
    type: "geo",
    points: { _L: d_L, _TL: d_TL, _TR: d_TR, _B: d_B,
              _X1: beyond(d_L, d_TL, 40), _X2: beyond(d_TR, d_TL, 45), _Y1: beyond(d_L, d_B, 40), _Y2: beyond(d_TR, d_B, 40) },
    lines: [["_L", "_X1"], ["_TR", "_X2"], ["_L", "_Y1"], ["_TR", "_Y2"]],
    marks: [{ at: "_TL", a: "_X1", b: "_X2", label: "140°", r: 14 }, { at: "_TL", a: "_L", b: "_TR", label: "a°", r: 16 },
            { at: "_L", a: "_TL", b: "_B", label: "88°", r: 18 }, { at: "_TR", a: "_TL", b: "_B", label: "c°", r: 24 },
            { at: "_B", a: "_L", b: "_TR", label: "b°", r: 18 }, { at: "_B", a: "_Y1", b: "_Y2", label: "80°", r: 14 }]
  };
  var e_L = [0, 0], e_T = polar(e_L, 25, 180), e_B = polar(e_L, -25, 140), e_R = add(e_T, e_B, e_L);
  var FIG_E = {
    type: "geo",
    points: { _L: e_L, _T: e_T, _B: e_B, _R: e_R, _E: beyond(e_B, e_R, 60) },
    lines: [["_L", "_T", 1, 0.5], ["_B", "_E", 1, 0.4], ["_L", "_B", 2, 0.5], ["_T", "_R", 2, 0.5]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "x°", r: 18 }, { at: "_L", a: "_T", b: "_B", label: "y°", r: 22 },
            { at: "_B", a: "_L", b: "_R", label: "z°", r: 18 }, { at: "_R", a: "_T", b: "_B", label: "w°", r: 20 },
            { at: "_R", a: "_E", b: "_T", label: "130°", r: 16 }]
  };
  var f_BL = [0, 0], f_BR = [200, 0], f_TL = polar(f_BL, 45, 140), f_TR = add(f_TL, f_BR, f_BL);
  var FIG_F = {
    type: "geo",
    points: { _BL: f_BL, _BR: f_BR, _TL: f_TL, _TR: f_TR, _E: [265, 0] },
    lines: [["_BL", "_E", 2, 0.4], ["_TL", "_TR", 2, 0.5], ["_BL", "_TL", 1, 0.5], ["_BR", "_TR", 1, 0.5]],
    marks: [{ at: "_BL", a: "_BR", b: "_TL", label: "x°", r: 26 }, { at: "_TL", a: "_BL", b: "_TR", label: "y°", r: 18 },
            { at: "_TR", a: "_TL", b: "_BR", label: "z°", r: 26 }, { at: "_BR", a: "_BL", b: "_TR", label: "w°", r: 16 },
            { at: "_BR", a: "_E", b: "_TR", label: "45°", r: 26 }]
  };

  Practice.register({
    id: "math-triangles-g6-ex15-3",
    subject: "Mathematics",
    unit: "Triangles and Polygons",
    title: "Exercise 15.3",
    topic: "Quadrilaterals",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 224–225",

    reference: {
      title: "Quadrilaterals",
      columns: ["Rule", "What it means"],
      rows: [
        ["Angle sum", "The four angles of any quadrilateral add up to 360°"],
        ["Rectangle and square", "Every angle is 90°. Opposite sides are equal."],
        ["Parallelogram", "Opposite sides are parallel (arrows). Opposite angles are equal."],
        ["Parallelogram neighbours", "Two angles next to each other add up to 180°"],
        ["Linear pair", "Exterior angle + interior angle = 180°"],
        ["Vertically opposite", "Two crossing lines: opposite angles are equal"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Quick answers", instruction: "Say and write the correct answers as quickly as possible.",
        questions: [
          { id: "q1a", prompt: "The size of each angle of a rectangle is ____.", parts: [n("v", "", 90)],
            help: [{ text: "Every corner of a rectangle is a square corner." }, { text: "Answer: **90°**." }] },
          { id: "q1b", prompt: "The size of each angle of a square is ____.", parts: [n("v", "", 90)],
            help: [{ text: "A square is a rectangle with all sides equal, so its corners are square corners too." }, { text: "Answer: **90°**." }] },
          { id: "q1c", prompt: "If a side of a rectangle is 4.5 cm, the length of its opposite side is ____.", parts: [{ id: "v", label: "", type: "number", answer: 4.5, unit: "cm" }],
            help: [{ text: "Opposite sides of a rectangle are equal." }, { text: "Answer: **4.5 cm**." }] },
          { id: "q1d", prompt: "If x° and 65° are two opposite angles of a parallelogram, then x° = ____.", parts: [n("x", "x =", 65, [{ answer: 115, say: "115° would be the angle next to 65°. Opposite angles are equal." }])],
            help: [{ text: "Opposite angles of a parallelogram are equal." }, { text: "Answer: **x = 65°**." }] },
          { id: "q1e", prompt: "If a°, b°, c° and d° are the angles of a quadrilateral, then a° + b° + c° + d° = ____.", parts: [n("v", "a + b + c + d =", 360)],
            help: [{ text: "A diagonal cuts a quadrilateral into two triangles. Each triangle has 180°." }, { text: "180 + 180 = ?", ask: ask(360) }] },
          { id: "q1f", prompt: "w°, x°, y° and z° are the angles of a quadrilateral and w° + x° + y° = 300°. Then z° = ____.", parts: [n("z", "z =", 60)],
            help: [{ text: "z = 360 − 300" }, { text: "z = ?", ask: ask(60) }] }
        ]
      },
      {
        id: "q2", title: "Angles with letters", instruction: "The four angles add up to 360°.",
        questions: [
          { id: "q2a", prompt: "x°, 75°, 105° and 80° are the angles of a quadrilateral. Find x°.", parts: [n("x", "x =", 100)],
            help: [{ text: "Hint: x + 75 + 105 + 80 = 360" }, { text: "75 + 105 + 80 = ?", ask: ask(260) }, { text: "x = 360 − 260 = 100°." }] },
          { id: "q2b", prompt: "p°, 2p°, 90° and 120° are the angles of a quadrilateral. Find p° and 2p°.", parts: [n("p", "p =", 50), n("p2", "2p =", 100)],
            help: [{ text: "p + 2p + 90 + 120 = 360, so 3p + 210 = 360." }, { text: "3p = 360 − 210 = ?", ask: ask(150) }, { text: "p = 150 ÷ 3 = ?", ask: ask(50) }, { text: "2p = 100°." }] },
          { id: "q2c", prompt: "x°, 2x°, 3x° and 150° are the angles of a quadrilateral. Find x°, 2x° and 3x°.", parts: [n("x", "x =", 35), n("x2", "2x =", 70), n("x3", "3x =", 105)],
            help: [{ text: "x + 2x + 3x + 150 = 360, so 6x = 210." }, { text: "x = 210 ÷ 6 = ?", ask: ask(35) }, { text: "2x = 70° and 3x = 105°." }] },
          { id: "q2d", prompt: "2a°, 3a°, 4a° and 6a° are the angles of a quadrilateral. Find them.", parts: [n("a2", "2a =", 48), n("a3", "3a =", 72), n("a4", "4a =", 96), n("a6", "6a =", 144)],
            help: [{ text: "2a + 3a + 4a + 6a = 15a, so 15a = 360." }, { text: "a = 360 ÷ 15 = ?", ask: ask(24) },
                   { text: "2a = 48°, 3a = 72°, 4a = 96°, 6a = 144°. Check: 48 + 72 + 96 + 144 = 360 ✓" }] }
        ]
      },
      {
        id: "q3", title: "Quadrilateral ABCD", instruction: "AB is produced to E and AD is produced to F.",
        questions: [
          { id: "q3a", prompt: "Write the relation between x° and 80°, with the reason.", figure: FIG_Q3,
            parts: [ch("v", "", ["x + 80 = 180°, linear pair on AE", "x = 80°, vertically opposite", "x + 80 = 90°"], "x + 80 = 180°, linear pair on AE")],
            help: [{ text: "x and 80° sit side by side on the straight line AE." }, { text: "Answer: **x° + 80° = 180°** (linear pair)." }] },
          { id: "q3b", prompt: "Write the relation between y° and 105°, with the reason.", figure: FIG_Q3,
            parts: [ch("v", "", ["y + 105 = 180°, linear pair on AF", "y = 105°, opposite angles", "y + 105 = 360°"], "y + 105 = 180°, linear pair on AF")],
            help: [{ text: "y and 105° sit side by side on the straight line AF." }, { text: "Answer: **y° + 105° = 180°** (linear pair)." }] },
          { id: "q3c", prompt: "Find x° and y°.", figure: FIG_Q3, parts: [n("x", "x =", 100), n("y", "y =", 75)],
            help: [{ text: "x = 180 − 80 = ?", ask: ask(100) }, { text: "y = 180 − 105 = ?", ask: ask(75) }] },
          { id: "q3d", prompt: "Write the sum of the interior angles of quadrilateral ABCD.", figure: FIG_Q3, parts: [n("v", "∠A + ∠B + ∠C + ∠D =", 360)],
            help: [{ text: "The four angles of any quadrilateral add up to 360°." }] },
          { id: "q3e", prompt: "Find z°.", figure: FIG_Q3, parts: [n("z", "z =", 75)],
            help: [{ text: "z = 360 − 110 − 100 − 75" }, { text: "110 + 100 + 75 = ?", ask: ask(285) }, { text: "z = 360 − 285 = 75°." }] }
        ]
      },
      {
        id: "q4", title: "Find the unknown angles", instruction: "Find the unknown sizes of angles of these quadrilaterals.",
        questions: [
          { id: "q4a", prompt: "Find x°.", figure: FIG_A, parts: [n("x", "x =", 95)],
            help: [{ text: "90 + 70 + 105 = ?", ask: ask(265) }, { text: "x = 360 − 265 = 95°." }] },
          { id: "q4b", prompt: "Find x° and 2x°.", figure: FIG_B, parts: [n("x", "x =", 55), n("x2", "2x =", 110)],
            help: [{ text: "x + 2x + 90 + 105 = 360, so 3x + 195 = 360." }, { text: "3x = ?", ask: ask(165) }, { text: "x = 165 ÷ 3 = 55°, so 2x = 110°." }] },
          { id: "q4c", prompt: "Find a°, 2a° and 3a°.", figure: FIG_C, parts: [n("a", "a =", 42), n("a2", "2a =", 84), n("a3", "3a =", 126)],
            help: [{ text: "a + 2a + 3a + 108 = 360, so 6a = 252." }, { text: "a = 252 ÷ 6 = ?", ask: ask(42) }, { text: "2a = 84° and 3a = 126°." }] },
          { id: "q4d", prompt: "Find a°, b° and c°.", figure: FIG_D, parts: [n("a", "a =", 140), n("b", "b =", 80), n("c", "c =", 52)],
            help: [{ text: "At the top-left corner two straight lines cross. a and 140° face each other: vertically opposite, so a = 140°." },
                   { text: "At the bottom corner, b and 80° are vertically opposite too, so b = 80°." },
                   { text: "c = 360 − 140 − 88 − 80 = ?", ask: ask(52) }] },
          { id: "q4e", prompt: "Find w°, x°, y° and z°. (Arrows show parallel sides: it is a parallelogram.)", figure: FIG_E,
            parts: [n("w", "w =", 50), n("x", "x =", 130), n("y", "y =", 50), n("z", "z =", 130)],
            help: [{ text: "w and 130° are a linear pair: w = 180 − 130 = ?", ask: ask(50) },
                   { text: "y is opposite w, so y = 50°." }, { text: "x is next to w, so x = 180 − 50 = 130°. z is opposite x, so z = 130°." }] },
          { id: "q4f", prompt: "Find w°, x°, y° and z°. (Arrows show parallel sides: it is a parallelogram.)", figure: FIG_F,
            parts: [n("w", "w =", 135), n("x", "x =", 45), n("y", "y =", 135), n("z", "z =", 45)],
            help: [{ text: "w and 45° are a linear pair: w = 180 − 45 = ?", ask: ask(135) },
                   { text: "y is opposite w, so y = 135°." }, { text: "x and w are next to each other: x = 180 − 135 = 45°. z is opposite x, so z = 45°." }] }
        ]
      }
    ]
  });
})();
