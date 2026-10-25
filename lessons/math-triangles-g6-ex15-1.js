/*
  Exercise 15.1: Types of triangles.
  Source: Vedanta Excel in Mathematics, Book 6, pages 218-219.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function n(id, label, answer, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: "°", mistakes: mistakes }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function rad(d) { return d * Math.PI / 180; }
  function polar(o, deg, r) { return [o[0] + r * Math.cos(rad(deg)), o[1] + r * Math.sin(rad(deg))]; }
  function beyond(a, b, d) { var L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [b[0] + (b[0] - a[0]) / L * d, b[1] + (b[1] - a[1]) / L * d]; }

  var SIDES = ["Equilateral", "Isosceles", "Scalene"];
  var ANGLES = ["Acute-angled", "Right-angled", "Obtuse-angled"];
  var ALL = SIDES.concat(ANGLES);
  var YN = ["Yes", "No"];

  var FIG_Q3 = {
    type: "geo",
    points: { A: [0, 0, 200], B: [170, 0, 315], C: [170, 202.6, 45] },
    lines: [["A", "B"], ["B", "C"], ["C", "A"]],
    marks: [{ at: "A", a: "B", b: "C", label: "50°", r: 26 }, { at: "B", a: "A", b: "C", right: true, r: 18 }, { at: "C", a: "A", b: "B", label: "x°", r: 26 }]
  };

  var FIG_Q4A = {
    type: "geo",
    points: { _A: [0, 0], _B: [220, 0], _C: [0, 184.6] },
    lines: [["_A", "_B"], ["_B", "_C"], ["_C", "_A"]],
    marks: [{ at: "_A", a: "_B", b: "_C", right: true, r: 16 }, { at: "_B", a: "_A", b: "_C", label: "40°", r: 30 }, { at: "_C", a: "_A", b: "_B", label: "x°", r: 24 }]
  };
  var FIG_Q4B = {
    type: "geo",
    points: { _A: [0, 180], _B: [104, 180], _C: [104, 0] },
    lines: [["_A", "_B"], ["_B", "_C"], ["_C", "_A"]],
    marks: [{ at: "_A", a: "_B", b: "_C", label: "60°", r: 22 }, { at: "_B", a: "_A", b: "_C", right: true, r: 16 }, { at: "_C", a: "_A", b: "_B", label: "y°", r: 30 }]
  };
  var FIG_Q4C = {
    type: "geo",
    points: { _A: [0, 0], _B: [200, 0], _C: [200, 115.5] },
    lines: [["_A", "_B"], ["_B", "_C"], ["_C", "_A"]],
    marks: [{ at: "_A", a: "_B", b: "_C", label: "x", r: 34 }, { at: "_B", a: "_A", b: "_C", right: true, r: 16 }, { at: "_C", a: "_A", b: "_B", label: "2x", r: 22 }]
  };
  var T4D = polar([0, 0], 40, 168.5);
  var FIG_Q4D = {
    type: "geo",
    points: { _L: [0, 0], _R: [220, 0], _T: T4D, _E: [-60, 0] },
    lines: [["_E", "_R"], ["_R", "_T"], ["_T", "_L"]],
    marks: [{ at: "_L", a: "_E", b: "_T", label: "140°", r: 16 }, { at: "_L", a: "_R", b: "_T", label: "a°", r: 30 },
            { at: "_T", a: "_L", b: "_R", right: true, r: 16 }, { at: "_R", a: "_L", b: "_T", label: "b°", r: 26 }]
  };

  var FIG_Q5 = {
    type: "geo",
    points: { P: [0, 180, 135], Q: [180, 180, 45], R: [90, 51.5, 270] },
    lines: [["P", "Q"], ["Q", "R"], ["R", "P"]],
    ticks: [["P", "R"], ["Q", "R"]],
    marks: [{ at: "P", a: "Q", b: "R", label: "55°", r: 24 }, { at: "Q", a: "P", b: "R", label: "x°", r: 24 }]
  };

  var FIG_Q6A = {
    type: "geo",
    points: { _A: [0, 0], _B: [200, 0], _C: [100, 119.2] },
    lines: [["_A", "_B"], ["_B", "_C"], ["_C", "_A"]],
    ticks: [["_A", "_C"], ["_B", "_C"]],
    marks: [{ at: "_A", a: "_B", b: "_C", label: "x°", r: 24 }, { at: "_B", a: "_A", b: "_C", label: "50°", r: 24 }]
  };
  var FIG_Q6B = {
    type: "geo",
    points: { _L: [28.4, 80], _T: [200, 160], _B: [200, 0] },
    lines: [["_L", "_T"], ["_T", "_B"], ["_B", "_L"]],
    ticks: [["_L", "_T"], ["_L", "_B"]],
    marks: [{ at: "_T", a: "_L", b: "_B", label: "z°", r: 26 }, { at: "_B", a: "_L", b: "_T", label: "65°", r: 26 }]
  };
  var FIG_Q6C = {
    type: "geo",
    points: { _A: [0, 0], _B: [120, 0], _C: [60, 128.7], _E: [190, 0] },
    lines: [["_A", "_E"], ["_B", "_C"], ["_C", "_A"]],
    ticks: [["_A", "_C"], ["_B", "_C"]],
    marks: [{ at: "_A", a: "_B", b: "_C", label: "y°", r: 18 }, { at: "_B", a: "_A", b: "_C", label: "x°", r: 18 }, { at: "_B", a: "_E", b: "_C", label: "115°", r: 18 }]
  };
  var A6D = [0, 0], C6D = [100, 111.1];
  var FIG_Q6D = {
    type: "geo",
    points: { _A: A6D, _B: [200, 0], _C: C6D, _E: [-70, 0], _F: beyond(C6D, A6D, 60) },
    lines: [["_E", "_B"], ["_B", "_C"], ["_C", "_F"]],
    ticks: [["_A", "_C"], ["_B", "_C"]],
    marks: [{ at: "_A", a: "_E", b: "_F", label: "48°", r: 22 }, { at: "_A", a: "_B", b: "_C", label: "x°", r: 26 }, { at: "_B", a: "_A", b: "_C", label: "y°", r: 26 }]
  };

  Practice.register({
    id: "math-triangles-g6-ex15-1",
    subject: "Mathematics",
    unit: "Triangles and Polygons",
    title: "Exercise 15.1",
    topic: "Types of triangles",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 218–219",

    reference: {
      title: "Types of triangles",
      columns: ["Name", "What it means"],
      rows: [
        ["Equilateral", "All three sides equal (all angles 60°)"],
        ["Isosceles", "Two sides equal. The two angles opposite them (base angles) are equal."],
        ["Scalene", "No sides equal"],
        ["Acute-angled", "All three angles less than 90°"],
        ["Right-angled", "One angle is 90°. The other two add up to 90°."],
        ["Obtuse-angled", "One angle more than 90°"],
        ["Angle sum", "The three angles of any triangle add up to 180°"],
        ["Tick marks", "Sides with the same tick mark are equal"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Name the triangle", instruction: "Say and write the type of triangle as quickly as possible.",
        questions: [
          { id: "q1a", prompt: "All three sides are equal: ____ triangle.", parts: [ch("v", "", SIDES, "Equilateral")],
            help: [{ text: "\"Equi\" means equal and \"lateral\" means side." }, { text: "Answer: **equilateral** triangle." }] },
          { id: "q1b", prompt: "Two sides are equal: ____ triangle.", parts: [ch("v", "", SIDES, "Isosceles")],
            help: [{ text: "A triangle with exactly two equal sides looks like a roof or a tent." }, { text: "Answer: **isosceles** triangle." }] },
          { id: "q1c", prompt: "None of the sides are equal: ____ triangle.", parts: [ch("v", "", SIDES, "Scalene")],
            help: [{ text: "All three sides have different lengths." }, { text: "Answer: **scalene** triangle." }] },
          { id: "q1d", prompt: "All three angles are acute: ____ triangle.", parts: [ch("v", "", ANGLES, "Acute-angled")],
            help: [{ text: "An acute angle is less than 90°. When all three are acute, the triangle is named after them." }, { text: "Answer: **acute-angled** triangle." }] },
          { id: "q1e", prompt: "One angle is a right angle: ____ triangle.", parts: [ch("v", "", ANGLES, "Right-angled")],
            help: [{ text: "A right angle is exactly 90°." }, { text: "Answer: **right-angled** triangle." }] },
          { id: "q1f", prompt: "One angle is obtuse: ____ triangle.", parts: [ch("v", "", ANGLES, "Obtuse-angled")],
            help: [{ text: "An obtuse angle is between 90° and 180°." }, { text: "Answer: **obtuse-angled** triangle." }] }
        ]
      },
      {
        id: "q2", title: "Quick answers", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          { id: "q2a", prompt: "How many acute angles are there in an acute-angled triangle?", parts: [{ id: "v", label: "", type: "number", answer: 3 }],
            help: [{ text: "In an acute-angled triangle, **all** the angles are acute." }, { text: "Answer: **3**." }] },
          { id: "q2b", prompt: "How many obtuse angles are there in an obtuse-angled triangle?", parts: [{ id: "v", label: "", type: "number", answer: 1 }],
            help: [{ text: "The angles add up to 180°. Two obtuse angles would already be more than 180°." }, { text: "Answer: **1**." }] },
          { id: "q2c", prompt: "Are two obtuse angles possible in a triangle?", parts: [ch("v", "", YN, "No")],
            help: [{ text: "Try 91° + 91°. Is that more than 180°?", ask: ask(182) }, { text: "Two obtuse angles add up to more than 180°, so there is no room for the third angle. Answer: **No**." }] },
          { id: "q2d", prompt: "How many right angles and acute angles are there in a right-angled triangle?",
            parts: [{ id: "r", label: "Right angles", type: "number", answer: 1 }, { id: "a", label: "Acute angles", type: "number", answer: 2 }],
            help: [{ text: "One angle is 90°. The other two share the remaining 180 − 90 = ? degrees.", ask: ask(90) }, { text: "Two angles that add up to 90° must both be less than 90°. Answer: **1 right angle and 2 acute angles**." }] },
          { id: "q2e", prompt: "Is an obtuse angle possible in a right-angled triangle?", parts: [ch("v", "", YN, "No")],
            help: [{ text: "90° + an obtuse angle is already more than 180°." }, { text: "Answer: **No**." }] },
          { id: "q2f", prompt: "One acute angle of a right-angled triangle is 50°. What is the other acute angle?", parts: [n("v", "Other angle =", 40)],
            help: [{ text: "The two acute angles of a right-angled triangle add up to 90°." }, { text: "90 − 50 = ?", ask: ask(40) }, { text: "Answer: **40°**." }] }
        ]
      },
      {
        id: "q3", title: "Triangle ABC", instruction: "From the triangle ABC, answer the questions.",
        questions: [
          { id: "q3a", prompt: "What is the type of △ABC?", figure: FIG_Q3, parts: [ch("v", "", ANGLES, "Right-angled")],
            help: [{ text: "Look at the corner at B. The small square means 90°." }, { text: "Answer: **right-angled** triangle." }] },
          { id: "q3b", prompt: "What is the relation of ∠ABC with ∠BAC and ∠ACB?", figure: FIG_Q3,
            parts: [ch("v", "", ["∠ABC = ∠BAC + ∠ACB", "∠ABC = ∠BAC − ∠ACB", "∠ABC + ∠BAC = ∠ACB"], "∠ABC = ∠BAC + ∠ACB")],
            help: [{ text: "∠ABC = 90°. All three angles add up to 180°, so the other two add up to 180 − 90 = 90°." }, { text: "Answer: **∠ABC = ∠BAC + ∠ACB** (the right angle equals the sum of the two acute angles)." }] },
          { id: "q3c", prompt: "Find the size of x°.", figure: FIG_Q3, parts: [n("x", "x =", 40, [{ answer: 130, say: "That is 180 − 50. Remember the 90° at B too." }])],
            help: [{ text: "x + 50 + 90 = 180" }, { text: "x = 180 − 140 = ?", ask: ask(40) }, { text: "Answer: **x = 40°**." }] }
        ]
      },
      {
        id: "q4", title: "Unknown angles", instruction: "Find the sizes of unknown angles of these triangles.",
        questions: [
          { id: "q4a", prompt: "Find x°.", figure: FIG_Q4A, parts: [n("x", "x =", 50)],
            help: [{ text: "The square corner is 90°. So x + 40 + 90 = 180." }, { text: "x = 180 − 130 = ?", ask: ask(50) }, { text: "Answer: **x = 50°**." }] },
          { id: "q4b", prompt: "Find y°.", figure: FIG_Q4B, parts: [n("y", "y =", 30)],
            help: [{ text: "y + 60 + 90 = 180" }, { text: "y = 180 − 150 = ?", ask: ask(30) }, { text: "Answer: **y = 30°**." }] },
          { id: "q4c", prompt: "Find x. Then find 2x.", figure: FIG_Q4C, parts: [n("x", "x =", 30), n("x2", "2x =", 60)],
            help: [{ text: "x + 2x + 90 = 180, so 3x = 90." }, { text: "x = 90 ÷ 3 = ?", ask: ask(30) }, { text: "2x = 2 × 30 = 60°. Check: 30 + 60 + 90 = 180 ✓" }] },
          { id: "q4d", prompt: "Find a° and b°.", figure: FIG_Q4D, parts: [n("a", "a =", 40), n("b", "b =", 50)],
            help: [{ text: "a and 140° sit side by side on a straight line (a linear pair), so a + 140 = 180." }, { text: "a = ?", ask: ask(40) },
                   { text: "The top angle is 90°. b = 180 − 90 − 40 = ?", ask: ask(50) }, { text: "Answer: **a = 40°, b = 50°**." }] }
        ]
      },
      {
        id: "q5", title: "Triangle PQR", instruction: "From the triangle PQR, answer the questions.",
        questions: [
          { id: "q5a", prompt: "What type of triangle is △PQR?", figure: FIG_Q5, parts: [ch("v", "", SIDES, "Isosceles")],
            help: [{ text: "Sides with the same tick mark are equal. PR and QR both have a tick." }, { text: "Two equal sides, so it is an **isosceles** triangle." }] },
          { id: "q5b", prompt: "Name the two equal sides of △PQR.", figure: FIG_Q5, parts: [{ id: "v", label: "", type: "segments", answer: ["PR", "QR"] }],
            help: [{ text: "Look for the small tick marks across the sides." }, { text: "Answer: **PR and QR**." }] },
          { id: "q5c", prompt: "What is the relation between ∠QPR and ∠PQR?", figure: FIG_Q5,
            parts: [ch("v", "", ["∠QPR = ∠PQR", "∠QPR + ∠PQR = 90°", "∠QPR + ∠PQR = 180°"], "∠QPR = ∠PQR")],
            help: [{ text: "In an isosceles triangle, the angles opposite the equal sides (the base angles) are equal." }, { text: "∠QPR is opposite QR and ∠PQR is opposite PR. Answer: **∠QPR = ∠PQR**." }] },
          { id: "q5d", prompt: "Find the size of x°.", figure: FIG_Q5, parts: [n("x", "x =", 55)],
            help: [{ text: "x is the base angle at Q. The other base angle, at P, is 55°." }, { text: "Base angles are equal. Answer: **x = 55°**." }] }
        ]
      },
      {
        id: "q6", title: "Isosceles triangles", instruction: "Find the sizes of unknown angles of these triangles.",
        questions: [
          { id: "q6a", prompt: "Find x°.", figure: FIG_Q6A, parts: [n("x", "x =", 50)],
            help: [{ text: "The two slanting sides have ticks, so they are equal. The angles at the bottom (base angles) are equal." }, { text: "Answer: **x = 50°**." }] },
          { id: "q6b", prompt: "Find z°.", figure: FIG_Q6B, parts: [n("z", "z =", 65)],
            help: [{ text: "The two sides with ticks meet at the left corner. So the two angles on the right are the base angles." }, { text: "Base angles are equal. Answer: **z = 65°**." }] },
          { id: "q6c", prompt: "Find x° and y°.", figure: FIG_Q6C,
            parts: [n("x", "x =", 65, [{ answer: 115, say: "115° is outside the triangle. x is the inside angle next to it." }]), n("y", "y =", 65)],
            help: [{ text: "x and 115° sit side by side on the straight base line, so x + 115 = 180." }, { text: "x = ?", ask: ask(65) },
                   { text: "The two sides have ticks, so y and x are equal base angles. Answer: **x = 65°, y = 65°**." }] },
          { id: "q6d", prompt: "Find x° and y°.", figure: FIG_Q6D, parts: [n("x", "x =", 48), n("y", "y =", 48)],
            help: [{ text: "At the left corner two straight lines cross. x and 48° face each other: vertically opposite angles are equal." }, { text: "So x = 48°." },
                   { text: "The two sides have ticks, so y is the other base angle: y = x = 48°." }] }
        ]
      }
    ]
  });
})();
