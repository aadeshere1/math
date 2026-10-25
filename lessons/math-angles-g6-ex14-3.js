/*
  Exercise 14.3: Angles made by a transversal with parallel lines
  (corresponding, alternate, co-interior angles).
  Source: Vedanta Excel in Mathematics, Book 6, pages 213-215.
  DATA ONLY. See lessons/README.md for the format.
  Diagrams use the "geo" figure: points in maths coordinates (y goes up),
  lines as [from, to, arrows], and angle marks between two directions.
*/
(function () {
  function n(id, label, answer, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: "°", mistakes: mistakes }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  // four letter labels round a crossing: upper-left, upper-right, lower-left, lower-right
  function quad(at, left, right, up, down, l) {
    return [{ at: at, a: left, b: up, label: l[0], bare: true, r: 12 }, { at: at, a: up, b: right, label: l[1], bare: true, r: 12 },
            { at: at, a: left, b: down, label: l[2], bare: true, r: 12 }, { at: at, a: down, b: right, label: l[3], bare: true, r: 12 }];
  }
  var TYPES = ["Corresponding", "Alternate", "Co-interior", "Alternate exterior", "Vertically opposite"];
  var REASONS = ["Corresponding angles", "Alternate angles", "Vertically opposite angles", "Co-interior angles"];
  var LETTERS = ["∠a", "∠b", "∠c", "∠d", "∠e", "∠f", "∠g", "∠h"];

  var FIG_Q1 = {
    type: "geo",
    points: { _T1: [0, 100], _T2: [230, 100], _B1: [0, 0], _B2: [230, 0], _X0: [60, -25], _X3: [150, 125] },
    meet: { _P: ["_T1", "_T2", "_X0", "_X3"], _Q: ["_B1", "_B2", "_X0", "_X3"] },
    lines: [["_T1", "_T2", 1, 0.85], ["_B1", "_B2", 1, 0.85], ["_X0", "_X3"]],
    marks: quad("_P", "_T1", "_T2", "_X3", "_X0", ["a", "b", "d", "c"]).concat(quad("_Q", "_B1", "_B2", "_X3", "_X0", ["e", "f", "h", "g"]))
  };

  var FIG_Q5 = {
    type: "geo",
    points: { _T1: [0, 160], _T2: [270, 160], _B1: [0, 30], _B2: [270, 30], _L1: [40, -10], _L2: [90, 200], _R1: [180, -10], _R2: [230, 200] },
    meet: { _TL: ["_T1", "_T2", "_L1", "_L2"], _TR: ["_T1", "_T2", "_R1", "_R2"], _BL: ["_B1", "_B2", "_L1", "_L2"], _BR: ["_B1", "_B2", "_R1", "_R2"] },
    lines: [["_T1", "_T2", 2, 0.5], ["_B1", "_B2", 2, 0.5], ["_L1", "_L2", 1, 0.5], ["_R1", "_R2", 1, 0.5]],
    marks: [].concat(
      quad("_TL", "_T1", "_T2", "_L2", "_L1", ["w", "x", "z", "y"]),
      quad("_TR", "_T1", "_T2", "_R2", "_R1", ["a", "b", "d", "c"]),
      quad("_BL", "_B1", "_B2", "_L2", "_L1", ["p", "q", "s", "r"]),
      quad("_BR", "_B1", "_B2", "_R2", "_R1", ["e", "f", "h", "g"]))
  };

  var FIG_Q6 = {
    type: "geo",
    points: { _A: [110, 150], _B: [30, 20], _C: [200, 20], _L: [0, 150], _R: [230, 150] },
    lines: [["_L", "_R", 1, 0.9], ["_B", "_C", 1, 0.6], ["_A", "_B"], ["_A", "_C"]],
    marks: [{ at: "_A", a: "_L", b: "_B", label: "x", r: 16 }, { at: "_A", a: "_B", b: "_C", label: "a", r: 18 }, { at: "_A", a: "_C", b: "_R", label: "y", r: 16 },
            { at: "_B", a: "_C", b: "_A", label: "b", r: 18 }, { at: "_C", a: "_B", b: "_A", label: "c", r: 18 }]
  };

  var FIG_Q7A = {
    type: "geo",
    points: { B: [0, 0, 200], C: [150, 0, 270], D: [240, 0, 0], A: [104.6, 124.7, 90], E: [233.6, 99.6, 45] },
    lines: [["B", "A", 1, 0.5], ["A", "C"], ["C", "E", 1, 0.6], ["B", "D"]],
    marks: [{ at: "B", a: "C", b: "A", label: "50°", r: 18 }, { at: "C", a: "A", b: "E", label: "60°", r: 18 }]
  };

  var FIG_Q7B = {
    type: "geo",
    points: { P: [9.3, 124.3, 135], Q: [108.9, 5.5, 300], R: [127.9, 185.5, 120], S: [275.7, 9.4, 300], _X: [80, 40], _Y: [250, 40], _H1: [20, 40], _H2: [300, 40], _X40: [156.6, 104.3] },
    meet: { _Z: ["_X", "_X40", "R", "S"] },
    lines: [["P", "Q", 1, 0.35], ["R", "S", 1, 0.6], ["_H1", "_H2"], ["_X", "_Z"]],
    marks: [{ at: "_X", a: "P", b: "_Z", label: "x°", r: 16 }, { at: "_X", a: "_Z", b: "_H2", label: "40°", r: 22 },
            { at: "_Y", a: "_H2", b: "R", label: "130°", r: 14 }, { at: "_Z", a: "S", b: "_X", label: "y°", r: 16 }]
  };

  var FIG_Q7C = {
    type: "geo",
    points: { A: [0, 0, 225], B: [160, 0, 315], C: [86, 122.9, 135], D: [246, 122.9, 300], E: [300, 122.9, 0], F: [274.7, 163.9, 60] },
    lines: [["A", "B", 2, 0.55], ["C", "E", 2, 0.5], ["A", "C", 1, 0.5], ["B", "F", 1, 0.4]],
    marks: [{ at: "D", a: "E", b: "F", label: "55°", r: 14 }, { at: "D", a: "C", b: "B", label: "w°", r: 16 },
            { at: "C", a: "D", b: "A", label: "x°", r: 16 }, { at: "A", a: "B", b: "C", label: "y°", r: 18 }, { at: "B", a: "A", b: "D", label: "z°", r: 16 }]
  };

  Practice.register({
    id: "math-angles-g6-ex14-3",
    subject: "Mathematics",
    unit: "Angles",
    title: "Exercise 14.3",
    topic: "Parallel lines and a transversal",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 213–215",

    reference: {
      title: "Parallel lines and a transversal",
      columns: ["Pair", "Where they are", "Rule"],
      rows: [
        ["Corresponding", "Same position at each crossing (F shape)", "Equal"],
        ["Alternate", "Between the parallel lines, on opposite sides of the transversal (Z shape)", "Equal"],
        ["Co-interior", "Between the parallel lines, on the same side of the transversal (C or U shape)", "Sum = 180°"],
        ["Alternate exterior", "Outside the parallel lines, on opposite sides", "Equal"],
        ["Vertically opposite", "Opposite each other at one crossing", "Equal"],
        ["Linear pair", "Side by side on a straight line", "Sum = 180°"]
      ]
    },

    sections: [
      /* ---------------- Q1 ---------------- */
      {
        id: "q1", title: "Name the angle pairs", instruction: "Look at the figure. Fill in the blanks.",
        questions: [
          { id: "q1a", prompt: "∠b and ____ are **corresponding** angles.", figure: FIG_Q1,
            parts: [ch("v", "", LETTERS, "∠f")],
            help: [
              { text: "Corresponding angles are in the **same position** at each crossing (top crossing and bottom crossing)." },
              { text: "∠b is the upper-right angle at the top crossing. Which letter is the upper-right angle at the bottom crossing?" },
              { text: "Answer: **∠f**." }
            ] },
          { id: "q1b", prompt: "∠c and ____ are **alternate** angles.", figure: FIG_Q1,
            parts: [ch("v", "", LETTERS, "∠e")],
            help: [
              { text: "Alternate angles are **between** the two parallel lines, on **opposite sides** of the slanting line. They make a Z shape." },
              { text: "∠c is between the lines, on the right. Find the angle between the lines on the left at the other crossing." },
              { text: "Answer: **∠e**." }
            ] },
          { id: "q1c", prompt: "∠e and ____ are **co-interior** angles.", figure: FIG_Q1,
            parts: [ch("v", "", LETTERS, "∠d")],
            help: [
              { text: "Co-interior angles are **between** the parallel lines, on the **same side** of the slanting line." },
              { text: "∠e is between the lines, on the left. Which other angle is between the lines on the left?" },
              { text: "Answer: **∠d**." }
            ] },
          { id: "q1d", prompt: "∠h and ____ are **alternate exterior** angles.", figure: FIG_Q1,
            parts: [ch("v", "", LETTERS, "∠b")],
            help: [
              { text: "Exterior means **outside** the two parallel lines. Alternate means on **opposite sides** of the slanting line." },
              { text: "∠h is outside (below the bottom line) on the left. Find the angle outside (above the top line) on the right." },
              { text: "Answer: **∠b**." }
            ] },
          { id: "q1e", prompt: "∠a and ∠e are ____ angles.", figure: FIG_Q1, parts: [ch("v", "", TYPES, "Corresponding")],
            help: [{ text: "∠a is upper-left at the top crossing. ∠e is upper-left at the bottom crossing. Same position at each crossing." }, { text: "Answer: **corresponding** angles." }] },
          { id: "q1f", prompt: "∠d and ∠f are ____ angles.", figure: FIG_Q1, parts: [ch("v", "", TYPES, "Alternate")],
            help: [{ text: "Both are between the parallel lines. ∠d is on the left of the slanting line, ∠f on the right: opposite sides." }, { text: "Answer: **alternate** angles." }] },
          { id: "q1g", prompt: "∠c and ∠f are ____ angles.", figure: FIG_Q1, parts: [ch("v", "", TYPES, "Co-interior")],
            help: [{ text: "Both are between the parallel lines, and both are on the right of the slanting line: same side." }, { text: "Answer: **co-interior** angles." }] }
        ]
      },

      /* ---------------- Q2 ---------------- */
      {
        id: "q2", title: "Quick answers", instruction: "Fill in the blanks.",
        questions: [
          { id: "q2a", prompt: "If x° and y° are **co-interior** angles between parallel lines, then x° + y° = ____.", parts: [n("v", "x + y =", 180)],
            help: [{ text: "Co-interior angles always add up to **180°**." }] },
          { id: "q2b", prompt: "If x° and 80° are **co-interior** angles between parallel lines, then x° = ____.", parts: [n("v", "x =", 100, [{ answer: 80, say: "Co-interior angles are not equal. They add up to 180°." }])],
            help: [{ text: "x + 80 = 180. What is 180 − 80?", ask: ask(100) }, { text: "Answer: **x = 100°**." }] },
          { id: "q2c", prompt: "If y° and 45° are **alternate** angles between parallel lines, then y° = ____.", parts: [n("v", "y =", 45)],
            help: [{ text: "Alternate angles between parallel lines are **equal**." }, { text: "Answer: **y = 45°**." }] },
          { id: "q2d", prompt: "If z° and 120° are **corresponding** angles between parallel lines, then z° = ____.", parts: [n("v", "z =", 120)],
            help: [{ text: "Corresponding angles between parallel lines are **equal**." }, { text: "Answer: **z = 120°**." }] }
        ]
      },

      /* ---------------- Q3 ---------------- */
      {
        id: "q3", title: "Find the unknown angles (1)", instruction: "Find the sizes of the unknown angles. Arrows show parallel lines.",
        questions: [
          { id: "q3a", prompt: "Find x°.",
            figure: { type: "geo", points: { _A0: [0, 100], _A: [120, 100], _B: [20, 0], _B1: [150, 0] },
              lines: [["_A0", "_A", 1, 0.5], ["_B", "_B1", 1, 0.6], ["_A", "_B"]],
              marks: [{ at: "_A", a: "_A0", b: "_B", label: "x°", r: 18 }, { at: "_B", a: "_B1", b: "_A", label: "40°", r: 20 }] },
            parts: [n("v", "x =", 40)],
            help: [
              { text: "The two arrow lines are parallel. The slanting line makes a **Z shape** between them." },
              { text: "x and 40° are inside the Z: they are alternate angles. Alternate angles are equal." },
              { text: "Answer: **x = 40°**." }
            ] },
          { id: "q3b", prompt: "Find y°.",
            figure: { type: "geo", points: { _A: [0, 0], _B: [0, 150], _C: [90, 0], _D: [90, 150] },
              lines: [["_A", "_B", 1, 0.6], ["_C", "_D", 1, 0.6], ["_B", "_C"]],
              marks: [{ at: "_B", a: "_A", b: "_C", label: "30°", r: 22 }, { at: "_C", a: "_D", b: "_B", label: "y°", r: 22 }] },
            parts: [n("v", "y =", 30)],
            help: [
              { text: "The two upright lines are parallel. The slanting line between them makes a Z (or N) shape." },
              { text: "30° and y are alternate angles, so they are equal." },
              { text: "Answer: **y = 30°**." }
            ] },
          { id: "q3c", prompt: "Find z°.",
            figure: { type: "geo", points: { _P: [0, 0], _P2: [150, 0], _T: [100, 173.2], _Q: [50, 86.6], _Q2: [170, 86.6] },
              lines: [["_P", "_P2", 1, 0.6], ["_Q", "_Q2", 1, 0.6], ["_P", "_T"]],
              marks: [{ at: "_P", a: "_P2", b: "_T", label: "60°", r: 22 }, { at: "_Q", a: "_Q2", b: "_T", label: "z°", r: 20 }] },
            parts: [n("v", "z =", 60)],
            help: [
              { text: "Both angles are on the right of the slanting line and above their parallel line: the **same position** (F shape)." },
              { text: "So they are corresponding angles, and corresponding angles are equal." },
              { text: "Answer: **z = 60°**." }
            ] },
          { id: "q3d", prompt: "Find w°.",
            figure: { type: "geo", points: { _A: [0, 150], _B: [210, 150], _M: [40, 150], _M2: [80, 0], _N: [170, 150], _N2: [210, 0] },
              lines: [["_A", "_B"], ["_M2", "_M", 1, 0.5], ["_N2", "_N", 1, 0.5]],
              marks: [{ at: "_M", a: "_A", b: "_M2", label: "105°", r: 16 }, { at: "_N", a: "_M", b: "_N2", label: "w°", r: 16 }] },
            parts: [n("v", "w =", 105)],
            help: [
              { text: "The two slanting lines are parallel. The top line crosses both." },
              { text: "105° and w are both on the left of their slanting line and below the top line: the same position." },
              { text: "Corresponding angles are equal. Answer: **w = 105°**." }
            ] },
          { id: "q3e", prompt: "Find a°.",
            figure: { type: "geo", points: { _A: [0, 150], _B: [140, 150], _A2: [-40, 0], _B2: [100, 0] },
              lines: [["_A", "_B"], ["_A2", "_A", 1, 0.5], ["_B2", "_B", 1, 0.5]],
              marks: [{ at: "_A", a: "_B", b: "_A2", label: "100°", r: 16 }, { at: "_B", a: "_A", b: "_B2", label: "a°", r: 16 }] },
            parts: [n("v", "a =", 80, [{ answer: 100, say: "These two angles are on the same side, between the parallel lines. They are co-interior, so they add to 180°." }])],
            help: [
              { text: "100° and a are both **between** the two parallel lines, on the **same side** (below the top line). They make a U shape." },
              { text: "Co-interior angles add up to 180°. a = 180 − 100 = ?", ask: ask(80) },
              { text: "Answer: **a = 80°**." }
            ] },
          { id: "q3f", prompt: "Find b°.",
            figure: { type: "geo", points: { _A: [0, 150], _A2: [150, 150], _B: [50, 0], _B2: [200, 0] },
              lines: [["_A", "_A2", 1, 0.7], ["_B", "_B2", 1, 0.7], ["_A", "_B"]],
              marks: [{ at: "_A", a: "_A2", b: "_B", label: "70°", r: 18 }, { at: "_B", a: "_A", b: "_B2", label: "b°", r: 18 }] },
            parts: [n("v", "b =", 110)],
            help: [
              { text: "70° and b are between the parallel lines, on the same side of the slanting line (a C shape). They are co-interior." },
              { text: "b = 180 − 70 = ?", ask: ask(110) },
              { text: "Answer: **b = 110°**." }
            ] },
          { id: "q3g", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _L1: [0, 140], _R1: [200, 140], _L2: [0, 0], _R2: [200, 0], _T0: [40, -30], _T3: [150, 190] },
              meet: { _X1: ["_L1", "_R1", "_T0", "_T3"], _X2: ["_L2", "_R2", "_T0", "_T3"] },
              lines: [["_L1", "_R1", 1, 0.2], ["_L2", "_R2", 1, 0.85], ["_T0", "_T3"]],
              marks: [{ at: "_X1", a: "_L1", b: "_T3", label: "120°", r: 14 }, { at: "_X1", a: "_R1", b: "_T0", label: "x°", r: 14 },
                      { at: "_X2", a: "_L2", b: "_T3", label: "y°", r: 14 }, { at: "_X2", a: "_T3", b: "_R2", label: "z°", r: 14 }] },
            parts: [n("x", "x =", 120), n("y", "y =", 120), n("z", "z =", 60)],
            help: [
              { text: "x is vertically opposite to 120° at the top crossing, so x = 120°." },
              { text: "y is in the same position at the bottom crossing as 120° is at the top (upper-left). Corresponding angles are equal, so y = 120°." },
              { text: "y and z make a straight line: z = 180 − 120 = ?", ask: ask(60) }
            ] },
          { id: "q3h", prompt: "Find a°, b° and c°.",
            figure: { type: "geo", points: { _P1: [20, 0], _P2: [50, 190], _Q1: [140, 0], _Q2: [170, 190], _T1: [0, 130], _T2: [200, 40] },
              meet: { _X: ["_P1", "_P2", "_T1", "_T2"], _Y: ["_Q1", "_Q2", "_T1", "_T2"] },
              lines: [["_P1", "_P2", 1, 0.85], ["_Q1", "_Q2", 1, 0.85], ["_T1", "_T2"]],
              marks: [{ at: "_X", a: "_P2", b: "_T2", label: "b°", r: 14 }, { at: "_X", a: "_T1", b: "_P1", label: "c°", r: 14 },
                      { at: "_Y", a: "_Q2", b: "_T2", label: "a°", r: 14 }, { at: "_Y", a: "_T2", b: "_Q1", label: "75°", r: 14 }] },
            parts: [n("a", "a =", 105), n("b", "b =", 105), n("c", "c =", 105)],
            help: [
              { text: "a and 75° make a straight line (the right arrow line): a = 180 − 75 = ?", ask: ask(105) },
              { text: "b is in the same position (upper-right) at the left crossing as a is at the right crossing. Corresponding angles: b = 105°." },
              { text: "c is vertically opposite to b, so c = 105°." }
            ] },
          { id: "q3i", prompt: "Find p°, q° and r°.",
            figure: { type: "geo", points: { _P1: [30, 0], _P2: [30, 160], _Q1: [130, 0], _Q2: [130, 170], _T1: [0, 60], _T2: [180, 90] },
              meet: { _X: ["_P1", "_P2", "_T1", "_T2"], _Y: ["_Q1", "_Q2", "_T1", "_T2"] },
              lines: [["_P1", "_P2", 1, 0.85], ["_Q1", "_Q2", 1, 0.85], ["_T1", "_T2"]],
              marks: [{ at: "_X", a: "_P1", b: "_T2", label: "95°", r: 14 }, { at: "_Y", a: "_T1", b: "_Q2", label: "q°", r: 14 },
                      { at: "_Y", a: "_T1", b: "_Q1", label: "p°", r: 14 }, { at: "_Y", a: "_T2", b: "_Q1", label: "r°", r: 14 }] },
            parts: [n("p", "p =", 85), n("q", "q =", 95), n("r", "r =", 95)],
            help: [
              { text: "r is lower-right at the right crossing; 95° is lower-right at the left crossing. Corresponding: r = 95°." },
              { text: "p and 95° are between the parallel lines, on the same side (below the slanting line). Co-interior: p = 180 − 95 = ?", ask: ask(85) },
              { text: "q is vertically opposite to r, so q = 95°." }
            ] },
          { id: "q3j", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _L1: [0, 150], _R1: [200, 150], _L2: [10, 0], _R2: [210, 0], _T0: [40, 190], _T3: [160, -40] },
              meet: { _X1: ["_L1", "_R1", "_T0", "_T3"], _X2: ["_L2", "_R2", "_T0", "_T3"] },
              lines: [["_L1", "_R1", 1, 0.85], ["_L2", "_R2", 1, 0.85], ["_T0", "_T3"]],
              marks: [{ at: "_X1", a: "_L1", b: "_T3", label: "2x°", r: 14 }, { at: "_X1", a: "_T3", b: "_R1", label: "y°", r: 14 },
                      { at: "_X2", a: "_L2", b: "_T0", label: "x°", r: 14 }, { at: "_X2", a: "_T3", b: "_R2", label: "z°", r: 14 }] },
            parts: [n("x", "x =", 60), n("y", "y =", 60), n("z", "z =", 60)],
            help: [
              { text: "2x and x are both between the parallel lines, on the left of the slanting line. They are co-interior: **2x + x = 180**." },
              { text: "3x = 180. What is x?", ask: ask(60) },
              { text: "y and 2x make a straight line: y = 180 − 120 = 60°. z is vertically opposite to x: z = 60°." }
            ] },
          { id: "q3k", prompt: "Find x°, a°, b° and c°.",
            figure: { type: "geo", points: { _P1: [20, 0], _P2: [20, 170], _Q1: [140, 0], _Q2: [140, 170], _T1: [0, 130], _T2: [200, 40] },
              meet: { _X: ["_P1", "_P2", "_T1", "_T2"], _Y: ["_Q1", "_Q2", "_T1", "_T2"] },
              lines: [["_P1", "_P2", 1, 0.9], ["_Q1", "_Q2", 1, 0.9], ["_T1", "_T2"]],
              marks: [{ at: "_X", a: "_P2", b: "_T2", label: "3x°", r: 14 }, { at: "_X", a: "_T2", b: "_P1", label: "2x°", r: 14 },
                      { at: "_Y", a: "_T1", b: "_Q2", label: "a°", r: 14 }, { at: "_Y", a: "_T1", b: "_Q1", label: "b°", r: 14 }, { at: "_Y", a: "_T2", b: "_Q1", label: "c°", r: 14 }] },
            parts: [n("x", "x =", 36), n("a", "a =", 72), n("b", "b =", 108), n("c", "c =", 72)],
            help: [
              { text: "3x and 2x make a straight line (the left arrow line): 3x + 2x = 180, so 5x = 180." },
              { text: "What is x?", ask: ask(36) },
              { text: "So 3x = 108° and 2x = 72°. a and 3x are co-interior (between the lines, above the slanting line): a = 180 − 108 = 72°." },
              { text: "b and 3x are alternate angles: b = 108°. c is vertically opposite to a: c = 72°." }
            ] },
          { id: "q3l", prompt: "Find x°, p°, q° and r°.",
            figure: { type: "geo", points: { _L1: [0, 150], _R1: [200, 110], _L2: [0, 30], _R2: [200, -10], _T0: [10, 190], _T3: [130, -50] },
              meet: { _X1: ["_L1", "_R1", "_T0", "_T3"], _X2: ["_L2", "_R2", "_T0", "_T3"] },
              lines: [["_L1", "_R1", 1, 0.75], ["_L2", "_R2", 1, 0.3], ["_T0", "_T3"]],
              marks: [{ at: "_X1", a: "_T0", b: "_R1", label: "4x°", r: 14 }, { at: "_X1", a: "_R1", b: "_T3", label: "x°", r: 14 },
                      { at: "_X2", a: "_L2", b: "_T0", label: "p°", r: 14 }, { at: "_X2", a: "_T0", b: "_R2", label: "q°", r: 14 }, { at: "_X2", a: "_T3", b: "_R2", label: "r°", r: 14 }] },
            parts: [n("x", "x =", 36), n("p", "p =", 36), n("q", "q =", 144), n("r", "r =", 36)],
            help: [
              { text: "4x and x make a straight line: 4x + x = 180, so 5x = 180." },
              { text: "What is x?", ask: ask(36) },
              { text: "p and x are alternate angles (a Z between the parallel lines): p = 36°." },
              { text: "q and p make a straight line: q = 144°. r is vertically opposite to p: r = 36°." }
            ] }
        ]
      },

      /* ---------------- Q4 ---------------- */
      {
        id: "q4", title: "Find the unknown angles (2)", instruction: "Find the sizes of the unknown angles. Matching arrows show parallel lines.",
        questions: [
          { id: "q4a", prompt: "Find x° and y°.",
            figure: { type: "geo", points: { _A0: [0, 150], _A: [110, 150], _B: [20, 0], _C: [140, 0], _D: [230, 150] },
              lines: [["_A0", "_A", 2, 0.5], ["_B", "_A", 1, 0.5], ["_B", "_C", 2, 0.6], ["_C", "_D", 1, 0.5]],
              marks: [{ at: "_A", a: "_A0", b: "_B", label: "45°", r: 18 }, { at: "_B", a: "_C", b: "_A", label: "x°", r: 18 }, { at: "_C", a: "_B", b: "_D", label: "y°", r: 16 }] },
            parts: [n("x", "x =", 45), n("y", "y =", 135)],
            help: [
              { text: "The double-arrow lines are parallel. 45° and x make a Z between them: alternate angles, so x = 45°." },
              { text: "The single-arrow lines are parallel too. x and y are between them on the same side of the bottom line: co-interior." },
              { text: "y = 180 − 45 = ?", ask: ask(135) }
            ] },
          { id: "q4b", prompt: "Find a° and b°.",
            figure: { type: "geo", points: { _L1: [0, 0], _L2: [70, 200], _R1: [230, 0], _R2: [160, 200], _A: [52.5, 150], _B: [177.5, 150], _C: [21, 60], _D: [209, 60] },
              lines: [["_L1", "_L2"], ["_R1", "_R2"], ["_A", "_B", 1, 0.5], ["_C", "_D", 1, 0.5]],
              marks: [{ at: "_A", a: "_B", b: "_L2", label: "80°", r: 14 }, { at: "_C", a: "_D", b: "_L2", label: "a°", r: 14 },
                      { at: "_B", a: "_A", b: "_R2", label: "b°", r: 14 }, { at: "_D", a: "_C", b: "_R2", label: "70°", r: 14 }] },
            parts: [n("a", "a =", 80), n("b", "b =", 70)],
            help: [
              { text: "The two arrow lines are parallel. 80° and a are in the same position at each line (above it, right of the left line)." },
              { text: "Corresponding angles are equal: a = 80°." },
              { text: "b and 70° are also corresponding (above each line, left of the right line): b = 70°." }
            ] },
          { id: "q4c", prompt: "Find p° and q°.",
            figure: { type: "geo", points: { _B: [0, 0], _B2: [150, 0], _T: [45, 170], _T2: [180, 170], _M: [29.1, 110], _M2: [170, 110] },
              lines: [["_B", "_T"], ["_B", "_B2", 1, 0.7], ["_M", "_M2", 1, 0.7], ["_T", "_T2", 1, 0.7]],
              marks: [{ at: "_B", a: "_B2", b: "_T", label: "75°", r: 18 }, { at: "_M", a: "_M2", b: "_T", label: "p°", r: 16 }, { at: "_T", a: "_T2", b: "_B", label: "q°", r: 16 }] },
            parts: [n("p", "p =", 75), n("q", "q =", 105)],
            help: [
              { text: "75° and p are both above their parallel line, right of the slanting line: corresponding angles. So p = 75°." },
              { text: "p and q are between the middle and top lines, on the same side: co-interior. q = 180 − 75 = ?", ask: ask(105) }
            ] },
          { id: "q4d", prompt: "Find w°, x°, y° and z°.",
            figure: { type: "geo", points: { _A: [0, 150], _B: [270, 150], _P1: [60, 0], _P2: [35, 200], _Q1: [220, 20], _Q2: [197.5, 200], _Z: [270, 20] },
              meet: { _X: ["_A", "_B", "_P1", "_P2"], _Y: ["_A", "_B", "_Q1", "_Q2"] },
              lines: [["_A", "_B", 2, 0.85], ["_P1", "_P2", 1, 0.85], ["_Q1", "_Q2", 1, 0.9], ["_Q1", "_Z", 2, 0.6]],
              marks: [{ at: "_X", a: "_A", b: "_P2", label: "w°", r: 14 }, { at: "_X", a: "_B", b: "_P1", label: "82°", r: 14 },
                      { at: "_Y", a: "_A", b: "_Q2", label: "x°", r: 14 }, { at: "_Y", a: "_Q2", b: "_B", label: "y°", r: 14 }, { at: "_Q1", a: "_Q2", b: "_Z", label: "z°", r: 16 }] },
            parts: [n("w", "w =", 82), n("x", "x =", 82), n("y", "y =", 98), n("z", "z =", 98)],
            help: [
              { text: "w is vertically opposite to 82°, so w = 82°." },
              { text: "x is in the same position as w (upper-left) on the other single-arrow line. Corresponding: x = 82°." },
              { text: "x and y make a straight line: y = 180 − 82 = ?", ask: ask(98) },
              { text: "The angle below y at the top line is 82° (opposite x). It and z are co-interior between the double-arrow lines: z = 180 − 82 = 98°." }
            ] },
          { id: "q4e", prompt: "Find a°, b° and c°.",
            figure: { type: "geo", points: { _A: [0, 150], _E: [220, 150], _A2: [45, 261], _S1: [59.4, 24.9], _S2: [155, 261.2], _F: [220, 24.9] },
              meet: { _X: ["_A", "_E", "_S1", "_S2"] },
              lines: [["_A", "_A2", 1, 0.6], ["_A", "_E", 2, 0.85], ["_S1", "_S2", 1, 0.85], ["_S1", "_F", 2, 0.6]],
              marks: [{ at: "_A", a: "_E", b: "_A2", label: "68°", r: 16 }, { at: "_X", a: "_A", b: "_S2", label: "a°", r: 14 },
                      { at: "_X", a: "_E", b: "_S1", label: "b°", r: 14 }, { at: "_S1", a: "_S2", b: "_F", label: "c°", r: 16 }] },
            parts: [n("a", "a =", 112), n("b", "b =", 112), n("c", "c =", 68)],
            help: [
              { text: "The single-arrow lines are parallel. 68° and a are both above the top line, between those two lines: co-interior." },
              { text: "a = 180 − 68 = ?", ask: ask(112) },
              { text: "b is vertically opposite to a, so b = 112°." },
              { text: "b and c are between the double-arrow lines, right of the slanting line: co-interior. c = 180 − 112 = 68°." }
            ] },
          { id: "q4f", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _T1: [0, 150], _T2: [220, 150], _B1: [0, 40], _B2: [220, 40], _L1: [40, 0], _L2: [55, 190], _R1: [170, 0], _R2: [185, 190] },
              meet: { _TL: ["_T1", "_T2", "_L1", "_L2"], _BL: ["_B1", "_B2", "_L1", "_L2"], _BR: ["_B1", "_B2", "_R1", "_R2"] },
              lines: [["_T1", "_T2", 2, 0.6], ["_B1", "_B2", 2, 0.45], ["_L1", "_L2", 1, 0.5], ["_R1", "_R2", 1, 0.5]],
              marks: [{ at: "_TL", a: "_T1", b: "_L1", label: "z°", r: 14 }, { at: "_BL", a: "_L2", b: "_B2", label: "y°", r: 14 },
                      { at: "_BR", a: "_B1", b: "_R2", label: "x°", r: 14 }, { at: "_BR", a: "_R1", b: "_B2", label: "100°", r: 14 }] },
            parts: [n("x", "x =", 100), n("y", "y =", 80), n("z", "z =", 80)],
            help: [
              { text: "x is vertically opposite to 100°, so x = 100°." },
              { text: "x and y are between the single-arrow lines, above the bottom line: co-interior. y = 180 − 100 = ?", ask: ask(80) },
              { text: "The upper-right angle at the top-left crossing is in the same position as y: it is 80° (corresponding). z is vertically opposite to it, so z = 80°." }
            ] },
          { id: "q4g", prompt: "Find p°, q°, r° and s°.",
            figure: { type: "geo", points: { _T1: [0, 150], _T2: [230, 150], _B1: [0, 30], _B2: [230, 30], _L1: [40, -20], _L2: [55, 200], _R1: [170, -20], _R2: [185, 200] },
              meet: { _TL: ["_T1", "_T2", "_L1", "_L2"], _TR: ["_T1", "_T2", "_R1", "_R2"], _BL: ["_B1", "_B2", "_L1", "_L2"], _BR: ["_B1", "_B2", "_R1", "_R2"] },
              lines: [["_T1", "_T2", 2, 0.5], ["_B1", "_B2", 2, 0.5], ["_L1", "_L2", 1, 0.5], ["_R1", "_R2", 1, 0.5]],
              marks: [{ at: "_TL", a: "_L2", b: "_T2", label: "p°", r: 14 }, { at: "_TR", a: "_T1", b: "_R2", label: "94°", r: 14 },
                      { at: "_BL", a: "_L2", b: "_B2", label: "q°", r: 14 }, { at: "_BR", a: "_B1", b: "_R1", label: "r°", r: 14 }, { at: "_BR", a: "_R1", b: "_B2", label: "s°", r: 14 }] },
            parts: [n("p", "p =", 86), n("q", "q =", 86), n("r", "r =", 86), n("s", "s =", 94)],
            help: [
              { text: "p and 94° are above the top line, between the two single-arrow lines: co-interior. p = 180 − 94 = ?", ask: ask(86) },
              { text: "q is in the same position as p (upper-right) at the bottom line: corresponding, so q = 86°." },
              { text: "The upper-left angle at the bottom-right crossing is 94° (corresponding to the 94° above). s is vertically opposite to it: s = 94°." },
              { text: "r and s make a straight line: r = 180 − 94 = 86°." }
            ] },
          { id: "q4h", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _V1: [20, 150], _T2: [210, 150], _M: [141, 80], _ML: [60, 80], _MR: [250, 80], _V3: [57.6, 10], _B2: [220, 10] },
              lines: [["_V1", "_T2", 1, 0.7], ["_ML", "_MR", 1, 0.85], ["_V3", "_B2", 1, 0.7], ["_V1", "_M"], ["_M", "_V3"]],
              marks: [{ at: "_V1", a: "_T2", b: "_M", label: "30°", r: 20 }, { at: "_M", a: "_ML", b: "_V1", label: "x°", r: 16 }, { at: "_M", a: "_ML", b: "_V3", label: "y°", r: 16 },
                      { at: "_M", a: "_V1", b: "_V3", label: "z°", r: 10, reflex: true }, { at: "_V3", a: "_B2", b: "_M", label: "40°", r: 20 }] },
            parts: [n("x", "x =", 30), n("y", "y =", 40), n("z", "z =", 290)],
            help: [
              { text: "All three arrow lines are parallel. 30° and x make a Z: alternate angles, so x = 30°." },
              { text: "40° and y also make a Z: y = 40°." },
              { text: "z goes the long way round the point. Angles at a point add up to 360°: z = 360 − 30 − 40 = ?", ask: ask(290) }
            ] },
          { id: "q4i", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _A0: [30, 170], _A: [106.6, 170], _B: [20, 20], _C: [130, 20], _D: [216.6, 170], _D2: [280, 170] },
              lines: [["_A0", "_A", 1, 0.5], ["_B", "_A", 1, 0.6], ["_B", "_C", 1, 0.6], ["_C", "_D", 1, 0.6], ["_D", "_D2", 1, 0.6]],
              marks: [{ at: "_A", a: "_A0", b: "_B", label: "z°", r: 16 }, { at: "_B", a: "_A", b: "_C", label: "y°", r: 18 },
                      { at: "_C", a: "_B", b: "_D", label: "x°", r: 16 }, { at: "_D", a: "_C", b: "_D2", label: "120°", r: 14 }] },
            parts: [n("x", "x =", 120), n("y", "y =", 60), n("z", "z =", 60)],
            help: [
              { text: "120° and x make a Z between the top line and the bottom line: alternate angles, so x = 120°." },
              { text: "x and y are between the two slanting parallel lines, above the bottom line: co-interior. y = 180 − 120 = ?", ask: ask(60) },
              { text: "y and z make a Z between the top and bottom lines: alternate angles, so z = 60°." }
            ] },
          { id: "q4j", prompt: "Find a° and b°.",
            figure: { type: "geo", points: { _A0: [0, 150], _A: [150, 150], _B: [10, 10], _B2: [220, 10], _K: [110, 67.7], _K2: [230, 67.7] },
              lines: [["_A0", "_A", 1, 0.5], ["_A", "_B"], ["_B", "_B2", 1, 0.7], ["_B", "_K"], ["_K", "_K2", 1, 0.7]],
              marks: [{ at: "_A", a: "_A0", b: "_B", label: "45°", r: 18 }, { at: "_B", a: "_A", b: "_K", label: "a°", r: 55 },
                      { at: "_B", a: "_K", b: "_B2", label: "b°", r: 22 }, { at: "_K", a: "_B", b: "_K2", label: "150°", r: 12, reflex: false }] },
            parts: [n("a", "a =", 15), n("b", "b =", 30)],
            help: [
              { text: "The whole angle at the bottom-left corner (a + b) makes a Z with 45°: alternate angles, so a + b = 45°." },
              { text: "b and 150° are between the middle and bottom lines, on the same side: co-interior. b = 180 − 150 = ?", ask: ask(30) },
              { text: "So a = 45 − 30 = ?", ask: ask(15) }
            ] },
          { id: "q4k", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _L: [-20, 150], _R: [230, 150], _T: [110, 150], _P: [9.3, 30], _Q: [179.3, 30] },
              lines: [["_L", "_R"], ["_P", "_Q", 1, 0.5], ["_T", "_P"], ["_T", "_Q"]],
              marks: [{ at: "_T", a: "_L", b: "_P", label: "50°", r: 16 }, { at: "_T", a: "_P", b: "_Q", label: "z°", r: 18 }, { at: "_T", a: "_Q", b: "_R", label: "60°", r: 16 },
                      { at: "_P", a: "_Q", b: "_T", label: "x°", r: 18 }, { at: "_Q", a: "_P", b: "_T", label: "y°", r: 18 }] },
            parts: [n("x", "x =", 50), n("y", "y =", 60), n("z", "z =", 70)],
            help: [
              { text: "The top line is parallel to the base (the arrow line). 50° and x make a Z: alternate, so x = 50°." },
              { text: "60° and y make a Z too: y = 60°." },
              { text: "On the top line: 50 + z + 60 = 180. z = ?", ask: ask(70) }
            ] },
          { id: "q4l", prompt: "Find x°, y° and z°.",
            figure: { type: "geo", points: { _A: [0, 0], _B: [150, 0], _D: [54.9, 117.8], _C: [204.9, 117.8] },
              lines: [["_A", "_B", 2, 0.5], ["_D", "_C", 2, 0.5], ["_A", "_D", 1, 0.5], ["_B", "_C", 1, 0.5]],
              marks: [{ at: "_A", a: "_B", b: "_D", label: "65°", r: 18 }, { at: "_D", a: "_A", b: "_C", label: "z°", r: 16 },
                      { at: "_C", a: "_D", b: "_B", label: "y°", r: 18 }, { at: "_B", a: "_A", b: "_C", label: "x°", r: 16 }] },
            parts: [n("x", "x =", 115), n("y", "y =", 65), n("z", "z =", 115)],
            help: [
              { text: "65° and z are between the double-arrow lines, on the same side: co-interior. z = 180 − 65 = ?", ask: ask(115) },
              { text: "65° and x are between the single-arrow lines, on the same side: co-interior. x = 115°." },
              { text: "x and y are co-interior too: y = 180 − 115 = 65°." }
            ] }
        ]
      },

      /* ---------------- Q5 ---------------- */
      {
        id: "q5", title: "Show that", instruction: "Use the figure to show each pair of angles is equal. Pick the reason for each step.",
        questions: [
          { id: "q5i", prompt: "Show that **∠w = ∠c**.", figure: FIG_Q5,
            parts: [ch("s1", "∠w = ∠a because they are", REASONS, "Corresponding angles"), ch("s2", "∠a = ∠c because they are", REASONS, "Vertically opposite angles")],
            help: [
              { text: "Find an angle that links ∠w to ∠c. ∠a is in the same position as ∠w (upper-left) at the next crossing on the top line." },
              { text: "The two slanting lines are parallel, so ∠w = ∠a (corresponding)." },
              { text: "∠a and ∠c face each other at one crossing, so ∠a = ∠c (vertically opposite). Therefore ∠w = ∠c." }
            ] },
          { id: "q5ii", prompt: "Show that **∠x = ∠s**.", figure: FIG_Q5,
            parts: [ch("s1", "∠x = ∠z because they are", REASONS, "Vertically opposite angles"), ch("s2", "∠z = ∠s because they are", REASONS, "Corresponding angles")],
            help: [
              { text: "∠x and ∠z face each other at the top-left crossing: vertically opposite, so ∠x = ∠z." },
              { text: "∠z (lower-left at the top line) and ∠s (lower-left at the bottom line) are in the same position: corresponding, so ∠z = ∠s." }
            ] },
          { id: "q5iii", prompt: "Show that **∠y = ∠g**.", figure: FIG_Q5,
            parts: [ch("s1", "∠y = ∠r because they are", REASONS, "Corresponding angles"), ch("s2", "∠r = ∠g because they are", REASONS, "Corresponding angles")],
            help: [
              { text: "∠y and ∠r are both lower-right, on the left slanting line, one at each parallel line: corresponding." },
              { text: "∠r and ∠g are both lower-right on the bottom line, one at each slanting line: corresponding again." }
            ] },
          { id: "q5iv", prompt: "Show that **∠a = ∠r**.", figure: FIG_Q5,
            parts: [ch("s1", "∠a = ∠e because they are", REASONS, "Corresponding angles"), ch("s2", "∠e = ∠p because they are", REASONS, "Corresponding angles"), ch("s3", "∠p = ∠r because they are", REASONS, "Vertically opposite angles")],
            help: [
              { text: "Walk from ∠a to ∠r one step at a time. ∠a and ∠e are upper-left on the right slanting line: corresponding." },
              { text: "∠e and ∠p are upper-left on the bottom line: corresponding." },
              { text: "∠p and ∠r face each other at the bottom-left crossing: vertically opposite." }
            ] },
          { id: "q5v", prompt: "Show that **∠d = ∠s**.", figure: FIG_Q5,
            parts: [ch("s1", "∠d = ∠z because they are", REASONS, "Corresponding angles"), ch("s2", "∠z = ∠s because they are", REASONS, "Corresponding angles")],
            help: [
              { text: "∠d and ∠z are both lower-left on the top line: corresponding." },
              { text: "∠z and ∠s are both lower-left on the left slanting line: corresponding." }
            ] },
          { id: "q5vi", prompt: "Show that **∠p = ∠c**.", figure: FIG_Q5,
            parts: [ch("s1", "∠p = ∠w because they are", REASONS, "Corresponding angles"), ch("s2", "∠w = ∠a because they are", REASONS, "Corresponding angles"), ch("s3", "∠a = ∠c because they are", REASONS, "Vertically opposite angles")],
            help: [
              { text: "∠p and ∠w are upper-left on the left slanting line: corresponding." },
              { text: "∠w and ∠a are upper-left on the top line: corresponding." },
              { text: "∠a and ∠c are vertically opposite." }
            ] }
        ]
      },

      /* ---------------- Q6 ---------------- */
      {
        id: "q6", title: "Angles of a triangle", instruction: "The top line is parallel to the base. Answer from the figure.",
        questions: [
          { id: "q6ab", prompt: "What type of angles are ∠x and ∠b? And ∠y and ∠c?", figure: FIG_Q6,
            parts: [ch("xb", "∠x and ∠b", TYPES.slice(0, 3), "Alternate"), ch("yc", "∠y and ∠c", TYPES.slice(0, 3), "Alternate")],
            help: [
              { text: "∠x and ∠b lie between the parallel lines, on opposite sides of the side AB. They make a Z shape." },
              { text: "Answer: both pairs are **alternate** angles." }
            ] },
          { id: "q6c", prompt: "Are ∠x = ∠b and ∠y = ∠c? Give a reason.", figure: FIG_Q6,
            parts: [ch("v", "", ["Yes, alternate angles between parallel lines are equal", "No, they add up to 180°", "Yes, they are vertically opposite"], "Yes, alternate angles between parallel lines are equal")],
            help: [{ text: "Alternate angles between parallel lines are always equal." }] },
          { id: "q6d", prompt: "If ∠x + ∠a + ∠y = 180°, show that ∠a + ∠b + ∠c = 180°.", figure: FIG_Q6,
            parts: [ch("r", "∠x + ∠a + ∠y = 180° because", ["They make a straight angle", "They are co-interior", "They are a triangle"], "They make a straight angle"),
                    ch("x", "Replace ∠x with", ["∠b", "∠c", "∠a"], "∠b"), ch("y", "Replace ∠y with", ["∠b", "∠c", "∠a"], "∠c")],
            help: [
              { text: "∠x, ∠a and ∠y sit together on the straight top line, so they add up to 180°." },
              { text: "We know ∠x = ∠b and ∠y = ∠c (alternate angles). Swap them in." },
              { text: "So ∠b + ∠a + ∠c = 180°. The angles of a triangle add up to 180°." }
            ] }
        ]
      },

      /* ---------------- Q7 ---------------- */
      {
        id: "q7a", no: "7a", title: "Triangle with a parallel line", instruction: "∠ABC = 50°, ∠ACE = 60° and AB ∥ EC.",
        questions: [
          { id: "q7a1", prompt: "Are ∠BAC and ∠ACE equal? Give a reason. Then find ∠BAC.", figure: FIG_Q7A,
            parts: [ch("r", "", ["Yes, they are alternate angles", "Yes, they are corresponding angles", "No"], "Yes, they are alternate angles"), n("v", "∠BAC =", 60)],
            help: [
              { text: "AB ∥ EC and AC crosses both. ∠BAC and ∠ACE are between the parallel lines on opposite sides of AC: alternate angles." },
              { text: "Alternate angles are equal, so ∠BAC = ∠ACE = 60°." }
            ] },
          { id: "q7a2", prompt: "Are ∠ABD and ∠DCE equal? Give a reason. Then find ∠DCE.", figure: FIG_Q7A,
            parts: [ch("r", "", ["Yes, they are corresponding angles", "Yes, they are alternate angles", "No"], "Yes, they are corresponding angles"), n("v", "∠DCE =", 50)],
            help: [
              { text: "BD crosses the parallel lines AB and EC. ∠ABD and ∠DCE are both above BD, on the left of their line: the same position." },
              { text: "Corresponding angles are equal, so ∠DCE = ∠ABD = 50°." }
            ] },
          { id: "q7a3", prompt: "Find ∠ACD. Is ∠ACD + ∠ACB = 180°? Then find ∠ACB.", figure: FIG_Q7A,
            parts: [n("acd", "∠ACD =", 110), ch("r", "Sum is 180° because", ["They are a linear pair on the straight line BD", "They are alternate angles", "They are vertically opposite"], "They are a linear pair on the straight line BD"), n("acb", "∠ACB =", 70)],
            help: [
              { text: "∠ACD = ∠ACE + ∠ECD = 60 + 50 = ?", ask: ask(110) },
              { text: "B, C and D are on one straight line, so ∠ACD and ∠ACB are a linear pair (sum 180°)." },
              { text: "∠ACB = 180 − 110 = ?", ask: ask(70) },
              { text: "Check: the triangle's angles are 50 + 60 + 70 = 180 ✓" }
            ] }
        ]
      },
      {
        id: "q7b", no: "7b", title: "Find x and y", instruction: "PQ ∥ RS.",
        questions: [
          { id: "q7b1", prompt: "Find x° and y°.", figure: FIG_Q7B,
            parts: [n("x", "x =", 90), n("y", "y =", 90)],
            help: [
              { text: "PQ ∥ RS and the flat line crosses both. The 130° angle at RS is in the same position as the whole angle (x + 40°) at PQ: corresponding angles." },
              { text: "So x + 40 = 130. x = ?", ask: ask(90) },
              { text: "The slanting middle line also crosses both parallel lines. x and y make a Z: alternate angles, so y = x = 90°." }
            ] }
        ]
      },
      {
        id: "q7c", no: "7c", title: "Find w, x, y and z", instruction: "CE ∥ AB and AC ∥ BF.",
        questions: [
          { id: "q7c1", prompt: "Find w°, x°, y° and z°.", figure: FIG_Q7C,
            parts: [n("w", "w =", 55), n("x", "x =", 125), n("y", "y =", 55), n("z", "z =", 125)],
            help: [
              { text: "w and 55° face each other at D: vertically opposite, so w = 55°." },
              { text: "x and w are between AC and BF, on the same side of CE: co-interior. x = 180 − 55 = ?", ask: ask(125) },
              { text: "x and y are between CE and AB, on the same side of AC: co-interior. y = 180 − 125 = 55°." },
              { text: "y and z are co-interior too (between AC and BF, above AB): z = 180 − 55 = 125°." }
            ] }
        ]
      }
    ]
  });
})();
