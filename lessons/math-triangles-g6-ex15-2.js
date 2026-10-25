/*
  Exercise 15.2: Sum of the angles of a triangle, and exterior angles.
  Source: Vedanta Excel in Mathematics, Book 6, pages 220-222.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function n(id, label, answer, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: "°", mistakes: mistakes }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function rad(d) { return d * Math.PI / 180; }
  function polar(o, deg, r) { return [o[0] + r * Math.cos(rad(deg)), o[1] + r * Math.sin(rad(deg))]; }
  function beyond(a, b, d) { var L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [b[0] + (b[0] - a[0]) / L * d, b[1] + (b[1] - a[1]) / L * d]; }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function lab(p, d) { return [p[0], p[1], d]; }
  var EXT = "Exterior angle = sum of the two opposite interior angles";

  /* Q4: isosceles ABC with A = 108° and BC produced to D */
  var FIG_Q4 = {
    type: "geo",
    points: { A: [100, 72.7, 90], B: [0, 0, 225], C: [200, 0, 270], D: [270, 0, 315] },
    lines: [["B", "D"], ["B", "A"], ["A", "C"]],
    ticks: [["A", "B"], ["A", "C"]],
    marks: [{ at: "A", a: "B", b: "C", label: "108°", r: 16 }, { at: "B", a: "C", b: "A", label: "x°", r: 24 },
            { at: "C", a: "B", b: "A", label: "y°", r: 18 }, { at: "C", a: "A", b: "D", label: "z°", r: 18 }]
  };

  /* Q5 figures */
  var a_L = [0, 0], a_R = polar(a_L, 25, 240), a_T = polar(a_L, 45, 240);
  var FIG_A = {
    type: "geo",
    points: { _L: a_L, _R: a_R, _T: a_T, _U1: beyond(a_L, a_T, 45), _U2: beyond(a_R, a_T, 45) },
    lines: [["_L", "_R"], ["_R", "_U2"], ["_L", "_U1"]],
    marks: [{ at: "_L", a: "_R", b: "_T", label: "20°", r: 40 }, { at: "_T", a: "_L", b: "_R", label: "x°", r: 18 },
            { at: "_T", a: "_U1", b: "_U2", label: "80°", r: 16 }, { at: "_R", a: "_L", b: "_T", label: "y°", r: 18 }]
  };
  var b_L = [0, 0], b_R = polar(b_L, -10, 220), b_T = polar(b_L, 78, 212.7);
  var FIG_B = {
    type: "geo",
    points: { _L: b_L, _R: b_R, _T: b_T, _E1: beyond(b_L, b_R, 60), _E2: beyond(b_T, b_R, 60) },
    lines: [["_L", "_E1"], ["_T", "_E2"], ["_L", "_T"]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "b°", r: 22 }, { at: "_L", a: "_R", b: "_T", label: "88°", r: 20 },
            { at: "_R", a: "_L", b: "_T", label: "a°", r: 22 }, { at: "_R", a: "_E1", b: "_E2", label: "45°", r: 22 }]
  };
  var c_B = [0, 0], c_R = polar(c_B, 20, 100), c_T = polar(c_B, 60, 214.5);
  var FIG_C = {
    type: "geo",
    points: { _B: c_B, _R: c_R, _T: c_T, _E: beyond(c_R, c_B, 60) },
    lines: [["_E", "_R"], ["_R", "_T"], ["_T", "_B"]],
    marks: [{ at: "_T", a: "_B", b: "_R", label: "25°", r: 34 }, { at: "_R", a: "_B", b: "_T", label: "115°", r: 16 },
            { at: "_B", a: "_E", b: "_T", label: "a°", r: 16 }]
  };
  var d_L = [0, 0], d_R = [220, 0], d_T = polar(d_L, 65, 165.5);
  var FIG_D = {
    type: "geo",
    points: { _L: d_L, _R: d_R, _T: d_T, _E: beyond(d_L, d_T, 50) },
    lines: [["_L", "_R"], ["_R", "_T"], ["_L", "_E"]],
    marks: [{ at: "_L", a: "_R", b: "_T", label: "65°", r: 22 }, { at: "_R", a: "_L", b: "_T", label: "45°", r: 26 },
            { at: "_T", a: "_E", b: "_R", label: "w°", r: 18 }]
  };
  var e_L = [0, 0], e_R = [160, 0], e_T = polar(e_L, 60, 218.6);
  var FIG_E = {
    type: "geo",
    points: { _L: e_L, _R: e_R, _T: e_T, _E: [230, 0] },
    lines: [["_L", "_E"], ["_R", "_T"], ["_T", "_L"]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "45°", r: 30 }, { at: "_L", a: "_R", b: "_T", label: "a°", r: 22 },
            { at: "_R", a: "_E", b: "_T", label: "105°", r: 16 }]
  };
  var f_P = [0, 0], f_Q = polar(f_P, -20, 220), f_T = polar(f_P, 62, 226.8);
  var FIG_F = {
    type: "geo",
    points: { _P: f_P, _Q: f_Q, _T: f_T, _E: beyond(f_P, f_Q, 60) },
    lines: [["_P", "_E"], ["_Q", "_T"], ["_T", "_P"]],
    marks: [{ at: "_T", a: "_P", b: "_Q", label: "48°", r: 30 }, { at: "_P", a: "_Q", b: "_T", label: "p°", r: 20 },
            { at: "_Q", a: "_E", b: "_T", label: "130°", r: 16 }]
  };
  var g_R = [220, 60], g_T = polar(g_R, 156, 200), g_L = polar(g_R, 204, 200);
  var FIG_G = {
    type: "geo",
    points: { _R: g_R, _T: g_T, _L: g_L, _E: beyond(g_T, g_L, 55) },
    lines: [["_T", "_E"], ["_T", "_R"], ["_R", "_L"]],
    ticks: [["_T", "_R"], ["_L", "_R"]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "a°", r: 20 }, { at: "_R", a: "_T", b: "_L", label: "48°", r: 32 },
            { at: "_L", a: "_T", b: "_R", label: "b°", r: 20 }, { at: "_L", a: "_E", b: "_R", label: "c°", r: 18 }]
  };
  var h_L = [0, 0], h_R = [200, 0], h_T = [100, 107.2];
  var FIG_H = {
    type: "geo",
    points: { _L: h_L, _R: h_R, _T: h_T, _U1: beyond(h_L, h_T, 45), _U2: beyond(h_R, h_T, 45) },
    lines: [["_L", "_R"], ["_L", "_U1"], ["_R", "_U2"]],
    ticks: [["_L", "_T"], ["_R", "_T"]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "a°", r: 20 }, { at: "_T", a: "_U1", b: "_U2", label: "86°", r: 16 },
            { at: "_L", a: "_R", b: "_T", label: "b°", r: 24 }, { at: "_R", a: "_L", b: "_T", label: "c°", r: 24 }]
  };
  var i_L = [0, 0], i_R = [240, 0], i_T = polar(i_L, 60, 156.6);
  var FIG_I = {
    type: "geo",
    points: { _L: i_L, _R: i_R, _T: i_T, _E1: beyond(i_L, i_T, 55), _E2: [300, 0] },
    lines: [["_L", "_E2"], ["_R", "_T"], ["_L", "_E1"]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "x°", r: 18 }, { at: "_T", a: "_E1", b: "_R", label: "100°", r: 16 },
            { at: "_L", a: "_R", b: "_T", label: "y°", r: 22 }, { at: "_R", a: "_L", b: "_T", label: "z°", r: 26 },
            { at: "_R", a: "_E2", b: "_T", label: "140°", r: 16 }]
  };
  var j_L = [0, 0], j_R = [200, 0], j_T = polar(j_L, 50, 217);
  var FIG_J = {
    type: "geo",
    points: { _L: j_L, _R: j_R, _T: j_T, _E1: [-60, 0], _E2: [260, 0] },
    lines: [["_E1", "_E2"], ["_L", "_T"], ["_T", "_R"]],
    marks: [{ at: "_L", a: "_E1", b: "_T", label: "130°", r: 16 }, { at: "_L", a: "_R", b: "_T", label: "x°", r: 22 },
            { at: "_R", a: "_L", b: "_T", label: "y°", r: 18 }, { at: "_R", a: "_E2", b: "_T", label: "110°", r: 16 },
            { at: "_T", a: "_L", b: "_R", label: "z°", r: 24 }]
  };
  var k_L = [0, 0], k_R = [240, 0], k_T = polar(k_L, 75, 224.4), k_M1 = lerp(k_L, k_T, 0.55), k_M2 = lerp(k_R, k_T, 0.55);
  var FIG_K = {
    type: "geo",
    points: { _L: k_L, _R: k_R, _T: k_T, _M1: k_M1, _M2: k_M2 },
    lines: [["_L", "_R", 1, 0.6], ["_M1", "_M2", 1, 0.6], ["_L", "_T"], ["_R", "_T"]],
    marks: [{ at: "_T", a: "_L", b: "_R", label: "55°", r: 22 }, { at: "_M1", a: "_M2", b: "_T", label: "75°", r: 18 },
            { at: "_M2", a: "_M1", b: "_T", label: "a°", r: 18 }, { at: "_L", a: "_R", b: "_T", label: "c°", r: 20 },
            { at: "_R", a: "_L", b: "_T", label: "b°", r: 20 }]
  };
  var FIG_L = {
    type: "geo",
    points: { _T: [0, 300], _A1: [-175, 180], _A2: [105, 180], _B1: [-175, 60], _B2: [105, 60], _L0: [-148.9, 20], _R0: [59.5, 20] },
    meet: { _UL: ["_A1", "_A2", "_T", "_L0"], _UR: ["_A1", "_A2", "_T", "_R0"], _LL: ["_B1", "_B2", "_T", "_L0"], _LR: ["_B1", "_B2", "_T", "_R0"] },
    lines: [["_A1", "_A2", 1, 0.12], ["_B1", "_B2", 1, 0.12], ["_T", "_L0"], ["_T", "_R0"]],
    marks: [{ at: "_T", a: "_L0", b: "_R0", label: "m°", r: 28 }, { at: "_UL", a: "_A1", b: "_L0", label: "62°", r: 16 },
            { at: "_UR", a: "_A1", b: "_T", label: "a°", r: 16 }, { at: "_UR", a: "_A2", b: "_R0", label: "78°", r: 16 },
            { at: "_LL", a: "_B2", b: "_T", label: "x°", r: 18 }, { at: "_LR", a: "_B1", b: "_T", label: "y°", r: 16 }]
  };

  Practice.register({
    id: "math-triangles-g6-ex15-2",
    subject: "Mathematics",
    unit: "Triangles and Polygons",
    title: "Exercise 15.2",
    topic: "Angles of a triangle",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 220–222",

    reference: {
      title: "Angles of a triangle",
      columns: ["Rule", "In symbols"],
      rows: [
        ["The three angles add up to 180°", "x + y + z = 180°"],
        ["Exterior angle = sum of the two opposite interior angles", "ext = y + z"],
        ["Exterior and its interior angle make a straight line", "ext + interior = 180°"],
        ["Base angles of an isosceles triangle are equal", "ticks on two sides → angles opposite them equal"],
        ["Vertically opposite angles are equal", "two crossing lines"],
        ["Corresponding angles between parallel lines are equal", "arrows on lines mean parallel"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Quick answers", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          { id: "q1a", prompt: "If x°, y° and z° are the angles of a triangle, then x° + y° + z° = ____.", parts: [n("v", "x + y + z =", 180)],
            help: [{ text: "The three angles of every triangle add up to the same number. It is the size of a straight angle." }, { text: "Answer: **180°**." }] },
          { id: "q1b", prompt: "If x°, 110° and 40° are the angles of a triangle, then x° = ____.", parts: [n("x", "x =", 30)],
            help: [{ text: "x + 110 + 40 = 180" }, { text: "110 + 40 = ?", ask: ask(150) }, { text: "x = 180 − 150 = 30°." }] },
          { id: "q1c", prompt: "If x° is the exterior angle and y° and z° are the two opposite interior angles of a triangle, then x° = ____.",
            parts: [ch("v", "", ["y° + z°", "y° − z°", "180° − y°", "y° × z°"], "y° + z°")],
            help: [{ text: "An exterior angle equals the sum of the two interior angles that are **not** next to it." }, { text: "Answer: **x° = y° + z°**." }] },
          { id: "q1d", prompt: "If p° is the exterior angle and 40° and 60° are the two opposite interior angles, then p° = ____.", parts: [n("p", "p =", 100)],
            help: [{ text: EXT + "." }, { text: "p = 40 + 60 = ?", ask: ask(100) }] },
          { id: "q1e", prompt: "x°, y° and z° are the three angles of a triangle. If x° = y° = 50°, then z° = ____.", parts: [n("z", "z =", 80)],
            help: [{ text: "z = 180 − 50 − 50" }, { text: "z = ?", ask: ask(80) }] },
          { id: "q1f", prompt: "a°, b° and c° are the three angles of a triangle. If a° + b° = 140°, then c° = ____.", parts: [n("c", "c =", 40)],
            help: [{ text: "a + b + c = 180 and a + b = 140." }, { text: "c = 180 − 140 = ?", ask: ask(40) }] }
        ]
      },
      {
        id: "q2", title: "Angles with letters", instruction: "Use x + y + z = 180° to find the angles.",
        questions: [
          { id: "q2a", prompt: "a°, 2a° and 60° are the angles of a triangle. Find a° and 2a°.", parts: [n("a", "a =", 40), n("a2", "2a =", 80)],
            help: [{ text: "a + 2a + 60 = 180, so 3a + 60 = 180." }, { text: "3a = 180 − 60 = ?", ask: ask(120) }, { text: "a = 120 ÷ 3 = ?", ask: ask(40) }, { text: "2a = 80°. Check: 40 + 80 + 60 = 180 ✓" }] },
          { id: "q2b", prompt: "p°, 2p° and 3p° are the angles of a triangle. Find them.", parts: [n("p", "p =", 30), n("p2", "2p =", 60), n("p3", "3p =", 90)],
            help: [{ text: "p + 2p + 3p = 6p, so 6p = 180." }, { text: "p = 180 ÷ 6 = ?", ask: ask(30) }, { text: "2p = 60° and 3p = 90°." }] },
          { id: "q2c", prompt: "The angles of a triangle are in the ratio 2 : 3 : 4. Find them.", parts: [n("a", "Smallest =", 40), n("b", "Middle =", 60), n("c", "Largest =", 80)],
            help: [{ text: "Call the angles 2x, 3x and 4x. Then 2x + 3x + 4x = 9x = 180." }, { text: "x = 180 ÷ 9 = ?", ask: ask(20) },
                   { text: "2x = 40°, 3x = 60°, 4x = 80°. Check: 40 + 60 + 80 = 180 ✓" }] }
        ]
      },
      {
        id: "q3", title: "Exterior angles", instruction: "Exterior angle = sum of the two opposite interior angles.",
        questions: [
          { id: "q3a", prompt: "x° is the exterior angle and 30° and 50° are the two opposite interior angles. Find x°.", parts: [n("x", "x =", 80)],
            help: [{ text: "x = 30 + 50 = ?", ask: ask(80) }] },
          { id: "q3b", prompt: "110° is the exterior angle and 70° and y° are the opposite interior angles. Find y°.", parts: [n("y", "y =", 40)],
            help: [{ text: "70 + y = 110" }, { text: "y = 110 − 70 = ?", ask: ask(40) }] },
          { id: "q3c", prompt: "2x° is the exterior angle and x° and 45° are the opposite interior angles. Find x°.", parts: [n("x", "x =", 45)],
            help: [{ text: "2x = x + 45" }, { text: "Take x away from both sides: x = 45°." }, { text: "Check: 2 × 45 = 90 and 45 + 45 = 90 ✓" }] }
        ]
      },
      {
        id: "q4", title: "Triangle ABC", instruction: "BC is produced to D. Answer the questions.",
        questions: [
          { id: "q4a", prompt: "What type of triangle is △ABC?", figure: FIG_Q4,
            parts: [ch("v", "", ["Isosceles", "Equilateral", "Scalene"], "Isosceles")],
            help: [{ text: "AB and AC have tick marks, so they are equal." }, { text: "Two equal sides: **isosceles**. (It is also obtuse-angled, because 108° > 90°.)" }] },
          { id: "q4b", prompt: "Write the relation between x° and y°, with the reason.", figure: FIG_Q4,
            parts: [ch("v", "", ["x = y, base angles of an isosceles triangle", "x + y = 180°, linear pair", "x = y, vertically opposite angles"], "x = y, base angles of an isosceles triangle")],
            help: [{ text: "x and y are opposite the two equal sides AC and AB." }, { text: "Answer: **x° = y°**, because base angles of an isosceles triangle are equal." }] },
          { id: "q4c", prompt: "Find x° and y°.", figure: FIG_Q4, parts: [n("x", "x =", 36), n("y", "y =", 36)],
            help: [{ text: "x + y + 108 = 180, so x + y = 72." }, { text: "x and y are equal, so each is 72 ÷ 2 = ?", ask: ask(36) }] },
          { id: "q4d", prompt: "Write the relation of z° with ∠B and ∠A. Then find z°.", figure: FIG_Q4,
            parts: [ch("r", "", ["z = ∠A + ∠B", "z = ∠A − ∠B", "z + ∠A = 180°"], "z = ∠A + ∠B"), n("z", "z =", 144)],
            help: [{ text: "z is the exterior angle at C. ∠A and ∠B are the two interior angles opposite it." }, { text: "z = 108 + 36 = ?", ask: ask(144) }] },
          { id: "q4e", prompt: "Can you find z° using the relation with y°? Give the reason.", figure: FIG_Q4,
            parts: [ch("v", "", ["Yes: y + z = 180°, a linear pair on BD", "Yes: z = y, vertically opposite", "No, it is not possible"], "Yes: y + z = 180°, a linear pair on BD")],
            help: [{ text: "y and z sit side by side on the straight line BD." }, { text: "So z = 180 − 36 = 144°. Same answer as before ✓" }] }
        ]
      },
      {
        id: "q5", title: "Find the unknown angles", instruction: "Find the sizes of unknown angles of these triangles.",
        questions: [
          { id: "q5a", prompt: "Find x° and y°.", figure: FIG_A, parts: [n("x", "x =", 80), n("y", "y =", 80)],
            help: [{ text: "At the top corner two straight lines cross. x and 80° face each other: vertically opposite, so x = 80°." },
                   { text: "y = 180 − 20 − 80 = ?", ask: ask(80) }] },
          { id: "q5b", prompt: "Find a° and b°.", figure: FIG_B, parts: [n("a", "a =", 45), n("b", "b =", 47)],
            help: [{ text: "a and 45° are vertically opposite, so a = 45°." }, { text: "b = 180 − 88 − 45 = ?", ask: ask(47) }] },
          { id: "q5c", prompt: "Find a°.", figure: FIG_C, parts: [n("a", "a =", 140, [{ answer: 40, say: "40° is the inside angle. a is outside, on the straight line." }])],
            help: [{ text: "a is an exterior angle. The two interior angles opposite it are 25° and 115°." }, { text: "a = 25 + 115 = ?", ask: ask(140) }] },
          { id: "q5d", prompt: "Find w°.", figure: FIG_D, parts: [n("w", "w =", 110, [{ answer: 70, say: "70° is the inside angle at the top. w is outside it." }])],
            help: [{ text: "w is an exterior angle at the top. The opposite interior angles are 65° and 45°." }, { text: "w = 65 + 45 = ?", ask: ask(110) }] },
          { id: "q5e", prompt: "Find a°.", figure: FIG_E, parts: [n("a", "a =", 60)],
            help: [{ text: "105° is an exterior angle, so 105 = a + 45." }, { text: "a = 105 − 45 = ?", ask: ask(60) }] },
          { id: "q5f", prompt: "Find p°.", figure: FIG_F, parts: [n("p", "p =", 82)],
            help: [{ text: "130° is an exterior angle, so 130 = p + 48." }, { text: "p = 130 − 48 = ?", ask: ask(82) }] },
          { id: "q5g", prompt: "Find a°, b° and c°.", figure: FIG_G, parts: [n("a", "a =", 66), n("b", "b =", 66), n("c", "c =", 114)],
            help: [{ text: "The two sides with ticks meet at the 48° corner. So a and b are the equal base angles." },
                   { text: "a + b = 180 − 48 = ?", ask: ask(132) }, { text: "a = b = 132 ÷ 2 = ?", ask: ask(66) },
                   { text: "c and b are a linear pair: c = 180 − 66 = 114°." }] },
          { id: "q5h", prompt: "Find a°, b° and c°.", figure: FIG_H, parts: [n("a", "a =", 86), n("b", "b =", 47), n("c", "c =", 47)],
            help: [{ text: "a and 86° are vertically opposite, so a = 86°." }, { text: "The ticked sides are equal, so b = c. b + c = 180 − 86 = ?", ask: ask(94) },
                   { text: "b = c = 94 ÷ 2 = 47°." }] },
          { id: "q5i", prompt: "Find x°, y° and z°.", figure: FIG_I, parts: [n("x", "x =", 80), n("y", "y =", 60), n("z", "z =", 40)],
            help: [{ text: "x and 100° are a linear pair: x = 180 − 100 = ?", ask: ask(80) }, { text: "z and 140° are a linear pair: z = 180 − 140 = ?", ask: ask(40) },
                   { text: "y = 180 − 80 − 40 = 60°." }] },
          { id: "q5j", prompt: "Find x°, y° and z°.", figure: FIG_J, parts: [n("x", "x =", 50), n("y", "y =", 70), n("z", "z =", 60)],
            help: [{ text: "x = 180 − 130 = ?", ask: ask(50) }, { text: "y = 180 − 110 = ?", ask: ask(70) }, { text: "z = 180 − 50 − 70 = 60°." }] },
          { id: "q5k", prompt: "Find a°, b° and c°. (The arrows show parallel lines.)", figure: FIG_K, parts: [n("a", "a =", 50), n("b", "b =", 50), n("c", "c =", 75)],
            help: [{ text: "In the small top triangle: a = 180 − 55 − 75 = ?", ask: ask(50) },
                   { text: "The two lines with arrows are parallel. c and 75° are in the same position: corresponding angles, so c = 75°." },
                   { text: "b and a are corresponding angles too, so b = 50°." }] },
          { id: "q5l", prompt: "Find x°, y°, a° and m°. (The arrows show parallel lines.)", figure: FIG_L,
            parts: [n("x", "x =", 62), n("y", "y =", 78), n("a", "a =", 78), n("m", "m =", 40)],
            help: [{ text: "62° and the angle inside the triangle at that crossing are vertically opposite. That inside angle and x are corresponding. So x = 62°." },
                   { text: "a and 78° are vertically opposite, so a = 78°." },
                   { text: "y and a are corresponding angles, so y = 78°." },
                   { text: "In the top triangle: m = 180 − 62 − 78 = ?", ask: ask(40) }] }
        ]
      }
    ]
  });
})();
