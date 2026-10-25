/*
  Exercise 13.1: Point and line - parallel and perpendicular lines, rays, segments.
  Source: Vedanta Excel in Mathematics, Book 6, pages 197-200.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit) { var o = { id: id, label: label, type: "number", answer: answer }; if (unit) o.unit = unit; return o; }
  function rot(id, opts) { var k = id.charCodeAt(id.length - 1) % opts.length; return opts.slice(k).concat(opts.slice(0, k)); }
  var PP = ["Parallel", "Perpendicular"];
  function rel(a, b) { return [a + " ∥ " + b, a + " ⊥ " + b, a + " and " + b + " meet at a point"]; }
  function R(at, a, b) { return { at: at, a: a, b: b, right: true, r: 9 }; }

  // Two lines both perpendicular to a third line.
  var figB = { type: "geo", points: { A: [0, 0, 180], B: [220, 0, 0], Q: [60, 0, 270], S: [160, 0, 270], P: [60, 110, 90], R: [160, 110, 90] },
    lines: [["A", "B"], ["Q", "P"], ["S", "R"]], marks: [R("Q", "B", "P"), R("S", "B", "R")] };
  var figC = { type: "geo", points: { K: [40, 150, 90], L: [40, 0, 270], P: [-20, 0, 180], Q: [200, 0, 0], M: [40, 100, 180], N: [200, 100, 0] },
    lines: [["K", "L"], ["P", "Q"], ["M", "N"]], marks: [R("L", "Q", "K"), R("M", "N", "K")] };
  var figD = { type: "geo", points: { A: [40, 150, 90], B: [40, 0, 270], X: [-20, 0, 180], Y: [200, 0, 0], D: [40, 110, 180], C: [200, 110, 0] },
    lines: [["A", "B"], ["X", "Y"], ["D", "C"]], marks: [R("B", "Y", "A"), R("D", "C", "A")] };
  var figE = { type: "geo", points: { A: [0, 110, 180], B: [220, 110, 0], C: [0, 0, 180], D: [220, 0, 0], E: [50, 110, 90], G: [160, 110, 90], F: [50, 0, 270], H: [160, 0, 270] },
    lines: [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"]], marks: [R("E", "B", "F"), R("G", "B", "H"), R("F", "D", "E"), R("H", "D", "G")] };
  var figF = { type: "geo", points: { C: [0, 110, 180], D: [220, 110, 0], A: [0, 0, 180], B: [220, 0, 0], W: [60, 110, 90], Y: [160, 110, 90], X: [60, 0, 270], Z: [160, 0, 270] },
    lines: [["A", "B"], ["C", "D"], ["W", "X"], ["Y", "Z"]], marks: [R("X", "B", "W"), R("Z", "B", "Y")] };
  var figI = { type: "geo", points: { P: [0, 70, 180], Q: [220, 110, 0], X: [0, 0, 180], Y: [220, 0, 0], K: [120, 88, 90], L: [120, 0, 270] },
    lines: [["P", "Q"], ["X", "Y"], ["K", "L"]], marks: [R("L", "Y", "K")] };
  var figQ3 = { type: "geo", points: { A: [0, 0, 225], B: [150, 0, 315], C: [240, 120, 45], D: [90, 120, 135], P: [90, 0, 270] }, meet: { O: ["A", "C", "B", "D"] },
    lines: [["A", "B", 1, 0.3], ["D", "C", 1, 0.5], ["A", "D", 2, 0.5], ["B", "C", 2, 0.5], ["A", "C"], ["B", "D"], ["D", "P"]], marks: [R("P", "B", "D"), R("O", "C", "D")] };

  function kind(id, k, a, b) {
    var name = { ray: "Ray", line: "Straight line", segment: "Line segment", curve: "Curved line" }[k];
    var tip = { ray: "It starts at a point (" + a + ") and goes on forever in one direction (the arrow at " + b + ").",
      line: "It has arrows at both ends: it goes on forever both ways.", segment: "It has two end points, " + a + " and " + b + ". It does not go on.",
      curve: "It bends. It is not straight." }[k];
    return { id: id, prompt: "What is **" + a + b + "**?", figure: { type: "lk", kind: k, a: a, b: b },
      parts: [ch("v", "", ["Straight line", "Curved line", "Ray", "Line segment"], name)], help: [{ text: tip }, { text: "Answer: **" + name.toLowerCase() + " " + a + b + "**." }] };
  }

  Practice.register({
    id: "math-lines-g6-ex13-1",
    subject: "Mathematics",
    unit: "Point and line",
    title: "Exercise 13.1",
    topic: "Parallel and perpendicular lines",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 197–200",

    reference: {
      title: "Lines",
      columns: ["Idea", "Example"],
      rows: [
        ["Parallel lines never meet; the distance between them stays the same", "AB ∥ CD"],
        ["Perpendicular lines meet at 90°", "CD ⊥ AB"],
        ["Two lines perpendicular to the same line are parallel", "PQ ⊥ AB and RS ⊥ AB, so PQ ∥ RS"],
        ["Two lines parallel to the same line are parallel", "AB ∥ CD and CD ∥ EF, so AB ∥ EF"],
        ["Line: arrows at both ends. Ray: one end point, one arrow. Segment: two end points", "line PQ, ray AB, segment RS"],
        ["Through one point: infinitely many lines. Through two points: only one straight line", ""],
        ["How to type", "Choose the answer. Segments are typed like AB, CD."]
      ]
    },

    sections: [
      {
        id: "q1", title: "Parallel or perpendicular?", instruction: "Choose the word that completes the sentence.",
        questions: [
          ["The opposite edges of a ruler are …", "Parallel", "They run side by side and never meet."],
          ["The arrangements of books in a bookshelf are …", "Parallel", "The books stand side by side, the same distance apart."],
          ["The X-axis and the Y-axis are …", "Perpendicular", "They meet at a right angle at O."],
          ["The adjacent sides of a rectangle are …", "Perpendicular", "Every corner of a rectangle is 90°."],
          ["The diagonals of a square are …", "Perpendicular", "The diagonals of a square cross at 90°."]
        ].map(function (r, i) { return { id: "q1" + "abcde"[i], prompt: r[0], parts: [ch("v", "", PP, r[1])], help: [{ text: r[2] }, { text: "Answer: **" + r[1].toLowerCase() + "**." }] }; })
      },
      {
        id: "q2", title: "Quick questions", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          { id: "q2a", prompt: "How many straight lines can be drawn from a point?", parts: [ch("v", "", ["One", "Two", "Infinitely many"], "Infinitely many")], help: [{ text: "Lines can go out from one point in every direction." }, { text: "Answer: **infinitely many**." }] },
          { id: "q2b", prompt: "How many straight lines can be drawn through two points?", parts: [ch("v", "", ["One", "Two", "Infinitely many"], "One")], help: [{ text: "Join the two points with a ruler. There is only one way." }, { text: "Answer: **one**." }] },
          { id: "q2c", prompt: "How many curved lines can be drawn through two points?", parts: [ch("v", "", ["One", "Two", "Infinitely many"], "Infinitely many")], help: [{ text: "A curve can bend a little or a lot, up or down." }, { text: "Answer: **infinitely many**." }] },
          { id: "q2d", prompt: "At how many points do two (crossing) straight lines intersect each other?", parts: [nm("v", "", 1)], help: [{ text: "Two straight lines can cross only once." }, { text: "Answer: **1** point." }] },
          { id: "q2e", prompt: "What is the angle made by two perpendicular lines?", parts: [nm("v", "", 90, "°")], help: [{ text: "Perpendicular means they meet at a right angle." }, { text: "Answer: **90°**." }] },
          { id: "q2f", prompt: "What angle do two parallel lines make with each other?", parts: [ch("v", "", ["90°", "180°", "None: they never meet"], "None: they never meet")], help: [{ text: "An angle needs two lines that meet. Parallel lines never meet." }, { text: "Answer: **they make no angle**." }] },
          { id: "q2g", prompt: "If the perpendicular distances between two lines are equal at every point, the lines are said to be …", parts: [ch("v", "", PP, "Parallel")], help: [{ text: "The same distance everywhere means they never get closer or meet." }, { text: "Answer: **parallel**." }] },
          { id: "q2h", prompt: "Are the opposite edges of your desk parallel?", parts: [ch("v", "", ["Yes", "No"], "Yes")], help: [{ text: "A desk top is a rectangle." }, { text: "Answer: **yes**." }] },
          { id: "q2i", prompt: "Are the breadths of your books perpendicular to their lengths?", parts: [ch("v", "", ["Yes", "No"], "Yes")], help: [{ text: "A book cover is a rectangle, so its corners are 90°." }, { text: "Answer: **yes**." }] },
          { id: "q2j", prompt: "How many plane (flat) surfaces does your exercise book have?", parts: [nm("v", "", 6)], help: [{ text: "Like a box: front, back, top, bottom, left and right." }, { text: "Answer: **6**." }] }
        ]
      },
      {
        id: "q3", title: "Parallels and perpendiculars in a figure", instruction: "Arrows show parallel lines. Small squares show right angles.",
        questions: [
          { id: "q3", prompt: "Look at the figure ABCD.", figure: figQ3,
            parts: [ch("a", "Parallel to AB", ["DC", "AD", "BD"], "DC"), ch("b", "Parallel to AD", ["AB", "BC", "AC"], "BC"), ch("c", "Perpendicular to AB", ["DP", "AD", "BC"], "DP"), ch("d", "Perpendicular to AC", ["BD", "AD", "DC"], "BD")],
            help: [{ text: "One arrow on AB and DC: AB ∥ DC. Two arrows on AD and BC: AD ∥ BC." }, { text: "Square at P: DP ⊥ AB. Square at O: BD ⊥ AC." }, { text: "Answer: **AB ∥ DC, AD ∥ BC, DP ⊥ AB, BD ⊥ AC**." }] }
        ]
      },
      {
        id: "q4", title: "What is the relation?", instruction: "Choose the right notation.",
        questions: [
          { id: "q4a", prompt: "If AB ∥ CD and CD ∥ EF, what is the relation between AB and EF?", parts: [ch("v", "", rel("AB", "EF"), "AB ∥ EF")], help: [{ text: "Both AB and EF are parallel to the same line CD." }, { text: "Answer: **AB ∥ EF**." }] },
          { id: "q4b", prompt: "If PQ ⊥ AB and RS ⊥ AB, what is the relation between PQ and RS?", figure: figB, parts: [ch("v", "", rel("PQ", "RS"), "PQ ∥ RS")], help: [{ text: "PQ and RS both stand straight up on AB." }, { text: "Two lines perpendicular to the same line are parallel." }, { text: "Answer: **PQ ∥ RS**." }] },
          { id: "q4c", prompt: "If KL ⊥ PQ and MN ⊥ KL, what is the relation between MN and PQ?", figure: figC, parts: [ch("v", "", rel("MN", "PQ"), "MN ∥ PQ")], help: [{ text: "MN and PQ are both perpendicular to KL." }, { text: "So they are parallel to each other." }, { text: "Answer: **MN ∥ PQ**." }] },
          { id: "q4d", prompt: "If AB ⊥ XY and CD ⊥ AB, what is the relation between XY and CD?", figure: figD, parts: [ch("v", "", rel("XY", "CD"), "XY ∥ CD")], help: [{ text: "XY and CD are both perpendicular to AB." }, { text: "Answer: **XY ∥ CD**." }] },
          { id: "q4e", prompt: "If AB ∥ CD, and EF and GH are perpendicular to AB and CD, what is the relation between EF and GH?", figure: figE, parts: [ch("v", "", rel("EF", "GH"), "EF ∥ GH")], help: [{ text: "EF and GH are both perpendicular to AB." }, { text: "Answer: **EF ∥ GH**." }] },
          { id: "q4f", prompt: "If WX = YZ (both perpendicular to AB), what is the relation between AB and CD?", figure: figF, parts: [ch("v", "", rel("AB", "CD"), "AB ∥ CD")], help: [{ text: "The perpendicular distance between AB and CD is the same in two places." }, { text: "Equal distances mean the lines are parallel." }, { text: "Answer: **AB ∥ CD**." }] },
          { id: "q4g", prompt: "How many perpendiculars can be drawn from a point P to a line AB?", parts: [ch("v", "", ["One", "Two", "Infinitely many"], "One")], help: [{ text: "Only one line from P meets AB at exactly 90°." }, { text: "Answer: **one**." }] },
          { id: "q4h", prompt: "How many lines parallel to PQ can be drawn through a point A?", parts: [ch("v", "", ["One", "Two", "Infinitely many"], "One")], help: [{ text: "Through A there is only one line that never meets PQ." }, { text: "Answer: **one**." }] },
          { id: "q4i", prompt: "KL is perpendicular to XY at L but it is not perpendicular to PQ. What can you say about XY and PQ?", figure: figI, parts: [ch("v", "", ["XY ∥ PQ", "XY and PQ are not parallel; they will meet", "XY ⊥ PQ"], "XY and PQ are not parallel; they will meet")],
            help: [{ text: "If XY and PQ were parallel, KL would be perpendicular to both." }, { text: "KL is not perpendicular to PQ, so XY and PQ get closer and will meet (intersect) if made longer." }, { text: "Answer: **they are not parallel; they intersect**." }] }
        ]
      },
      {
        id: "q5", title: "Name the vertices", instruction: "Creative section. Type the points with commas, like A, B, C.",
        questions: [
          { id: "q5a", prompt: "Triangle", figure: { type: "geo", points: { A: [100, 90, 90], B: [0, 0, 225], C: [200, 0, 315] }, lines: [["A", "B"], ["B", "C"], ["C", "A"]] }, parts: [{ id: "v", label: "", type: "set", answer: ["A", "B", "C"] }], help: [{ text: "The vertices are the corners." }, { text: "Answer: **A, B, C**." }] },
          { id: "q5b", prompt: "Square", figure: { type: "geo", points: { P: [0, 0, 225], Q: [120, 0, 315], R: [120, 120, 45], S: [0, 120, 135] }, lines: [["P", "Q"], ["Q", "R"], ["R", "S"], ["S", "P"]] }, parts: [{ id: "v", label: "", type: "set", answer: ["P", "Q", "R", "S"] }], help: [{ text: "Count the corners: 4." }, { text: "Answer: **P, Q, R, S**." }] },
          { id: "q5c", prompt: "Pentagon", figure: { type: "geo", points: { A: [31, 0, 225], B: [131, 0, 315], C: [162, 95, 0], D: [81, 154, 90], E: [0, 95, 180] }, lines: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "A"]] }, parts: [{ id: "v", label: "", type: "set", answer: ["A", "B", "C", "D", "E"] }], help: [{ text: "A pentagon has 5 corners." }, { text: "Answer: **A, B, C, D, E**." }] }
        ]
      },
      { id: "q6", title: "Lines, rays and segments", instruction: "Look at the ends: an arrow goes on forever; a dot is an end point.",
        questions: [kind("q6a", "ray", "A", "B"), kind("q6b", "curve", "C", "D"), kind("q6c", "line", "P", "Q"), kind("q6d", "segment", "R", "S"), kind("q6e", "curve", "X", "Y"), kind("q6f", "line", "M", "N"), kind("q6g", "ray", "E", "F")] },
      {
        id: "q7", title: "Segments and points of intersection", instruction: "Type the segments with commas, like AB, CD.",
        questions: [
          { id: "q7a", prompt: "Name the line segments and their point of intersection.", figure: { type: "geo", points: { A: [0, 120, 135], B: [160, 0, 315], C: [160, 120, 45], D: [0, 0, 225] }, meet: { O: ["A", "B", "C", "D"] }, lines: [["A", "B"], ["C", "D"]] },
            parts: [{ id: "s", label: "Segments", type: "segments", answer: ["AB", "CD"] }, { id: "o", label: "They meet at", type: "text", answer: "O" }],
            help: [{ text: "Two segments, AB and CD, cross each other." }, { text: "They cross at O. (They are not parallel: parallel lines never meet.)" }, { text: "Answer: **AB and CD, meeting at O**." }] },
          { id: "q7b", prompt: "Name the line segments and their point of intersection.", figure: { type: "geo", points: { R: [0, 140, 135], S: [140, 0, 315], T: [70, 150, 90], U: [70, -10, 270], M: [140, 140, 45], N: [0, 0, 225], P: [-10, 70, 180], Q: [150, 70, 0] }, meet: { A: ["R", "S", "T", "U"] }, lines: [["R", "S"], ["T", "U"], ["M", "N"], ["P", "Q"]] },
            parts: [{ id: "s", label: "Segments", type: "segments", answer: ["RS", "TU", "MN", "PQ"] }, { id: "o", label: "They meet at", type: "text", answer: "A" }],
            help: [{ text: "Four segments: RS, TU, MN and PQ." }, { text: "All four pass through the point A." }, { text: "Answer: **RS, TU, MN, PQ, meeting at A**." }] },
          { id: "q7c", prompt: "Name the line segments and their points of intersection.", figure: { type: "geo", points: { K: [0, 110, 180], L: [220, 80, 0], M: [0, 50, 180], N: [220, 10, 0], X: [170, 140, 45], Y: [70, -20, 225] }, meet: { P: ["K", "L", "X", "Y"], Q: ["M", "N", "X", "Y"] }, lines: [["K", "L"], ["M", "N"], ["X", "Y"]] },
            parts: [{ id: "s", label: "Segments", type: "segments", answer: ["KL", "MN", "XY"] }, { id: "p", label: "KL and XY meet at", type: "text", answer: "P" }, { id: "q", label: "MN and XY meet at", type: "text", answer: "Q" }],
            help: [{ text: "Three segments: KL, MN and XY." }, { text: "XY crosses KL at P and MN at Q." }, { text: "Answer: **KL, MN, XY; P and Q**." }] }
        ]
      },
      {
        id: "q8", title: "Name them in notation", instruction: "E.g. AB parallel to CD is AB ∥ CD; AB perpendicular to CD is AB ⊥ CD.",
        questions: [
          { id: "q8a", prompt: "Segments RS and PQ (with arrows).", figure: { type: "geo", points: { R: [0, 60, 180], S: [180, 60, 0], P: [0, 0, 180], Q: [180, 0, 0] }, lines: [["R", "S", 1, 0.6], ["P", "Q", 1, 0.6]] }, parts: [ch("v", "", ["RS ∥ PQ", "RS ⊥ PQ", "PS ∥ PQ"], "RS ∥ PQ")], help: [{ text: "Matching arrows mean parallel." }, { text: "Answer: **RS ∥ PQ**." }] },
          { id: "q8b", prompt: "Segments OP and MN.", figure: { type: "geo", points: { O: [90, 120, 90], P: [90, 0, 270], M: [0, 0, 180], N: [180, 0, 0] }, lines: [["O", "P"], ["M", "N"]], marks: [R("P", "N", "O")] }, parts: [ch("v", "", rot("q8b", ["OP ⊥ MN", "OP ∥ MN"]), "OP ⊥ MN")], help: [{ text: "The square at P shows a right angle." }, { text: "Answer: **OP ⊥ MN**." }] },
          { id: "q8c", prompt: "Segments XY and LK.", figure: { type: "geo", points: { X: [0, 140, 90], Y: [0, 0, 270], L: [0, 80, 180], K: [140, 80, 0] }, lines: [["X", "Y"], ["L", "K"]], marks: [R("L", "K", "Y")] }, parts: [ch("v", "", rot("q8c", ["LK ⊥ XY", "LK ∥ XY"]), "LK ⊥ XY")], help: [{ text: "The square at L shows a right angle." }, { text: "Answer: **LK ⊥ XY**." }] },
          { id: "q8d", prompt: "Segments CD and EF (with arrows).", figure: { type: "geo", points: { C: [0, 140, 135], D: [100, 0, 315], E: [50, 150, 135], F: [150, 10, 315] }, lines: [["C", "D", 1, 0.5], ["E", "F", 1, 0.5]] }, parts: [ch("v", "", rot("q8d", ["CD ∥ EF", "CD ⊥ EF"]), "CD ∥ EF")], help: [{ text: "Matching arrows mean parallel." }, { text: "Answer: **CD ∥ EF**." }] }
        ]
      },
      {
        id: "q9", title: "Parallels and perpendiculars in shapes", instruction: "Squares show right angles; matching arrows show parallel sides.",
        questions: [
          { id: "q9a", prompt: "Triangle ABC with AD, BE and CF.", figure: { type: "geo", points: { A: [100, 170, 90], B: [0, 0, 225], C: [200, 0, 315], D: [100, 0, 270], E: [161, 66, 30], F: [39, 66, 150] }, lines: [["A", "B"], ["B", "C"], ["C", "A"], ["A", "D"], ["B", "E"], ["C", "F"]], marks: [R("D", "C", "A"), R("E", "C", "B"), R("F", "A", "C")] },
            parts: [ch("a", "AD is perpendicular to", ["BC", "AB", "AC"], "BC"), ch("b", "BE is perpendicular to", ["AC", "AB", "BC"], "AC"), ch("c", "CF is perpendicular to", ["AB", "AC", "BC"], "AB")],
            help: [{ text: "Look at each small square: at D, at E and at F." }, { text: "Answer: **AD ⊥ BC, BE ⊥ AC, CF ⊥ AB**." }] },
          { id: "q9b", prompt: "Parallelogram PQRS.", figure: { type: "geo", points: { P: [0, 0, 225], Q: [150, 0, 315], R: [200, 110, 45], S: [50, 110, 135] }, lines: [["P", "Q", 2, 0.5], ["S", "R", 2, 0.5], ["P", "S", 1, 0.5], ["Q", "R", 1, 0.5]] },
            parts: [ch("a", "Parallel to PQ", ["SR", "PS", "QR"], "SR"), ch("b", "Parallel to PS", ["QR", "PQ", "SR"], "QR")],
            help: [{ text: "Double arrows: PQ and SR. Single arrows: PS and QR." }, { text: "Answer: **PQ ∥ SR, PS ∥ QR**." }] },
          { id: "q9c", prompt: "Trapezium ABCD with CP.", figure: { type: "geo", points: { A: [0, 0, 225], B: [210, 0, 315], C: [150, 120, 45], D: [20, 120, 135], P: [150, 0, 270] }, lines: [["A", "B", 1, 0.3], ["D", "C", 1, 0.5], ["A", "D"], ["B", "C"], ["C", "P"]], marks: [R("P", "B", "C")] },
            parts: [ch("a", "Parallel to AB", ["DC", "AD", "BC"], "DC"), ch("b", "CP is perpendicular to", ["AB", "DC", "BC"], "AB")],
            help: [{ text: "Arrows on AB and DC: AB ∥ DC." }, { text: "The square at P: CP ⊥ AB." }, { text: "Answer: **AB ∥ DC, CP ⊥ AB**." }] }
        ]
      },
      {
        id: "q10", title: "Measure the distances", instruction: "Equal perpendicular distances everywhere mean the lines are parallel.",
        questions: [
          { id: "q10a", prompt: "The perpendicular distances between AB and CD are PQ = **2 cm**, RS = **2 cm**, TU = **2 cm**.", parts: [ch("v", "Are AB and CD parallel?", ["Yes", "No"], "Yes")], help: [{ text: "All three distances are the same." }, { text: "Answer: **yes, AB ∥ CD**." }] },
          { id: "q10b", prompt: "The perpendicular distances between WX and YZ are KL = **1.7 cm**, MN = **1.4 cm**, OP = **1.1 cm**.", parts: [ch("v", "Are WX and YZ parallel?", ["Yes", "No"], "No")], help: [{ text: "The distances get smaller, so the lines get closer." }, { text: "Answer: **no, they are not parallel**." }] },
          { id: "q10c", prompt: "The perpendicular distances between PQ and RS are AB = **1.5 cm**, CD = **1.5 cm**, EF = **1.5 cm**.", parts: [ch("v", "Are PQ and RS parallel?", ["Yes", "No"], "Yes")], help: [{ text: "All three distances are the same." }, { text: "Answer: **yes, PQ ∥ RS**." }] }
        ]
      }
    ]
  });
})();
