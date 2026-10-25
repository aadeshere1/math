/*
  Exercise 12.1: Coordinates - reading, plotting and joining points.
  Source: Vedanta Excel in Mathematics, Book 6, pages 191-193.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit) { var o = { id: id, label: label, type: "number", answer: answer }; if (unit) o.unit = unit; return o; }
  function S(p) { return ("(" + p[0] + ", " + p[1] + ")").replace(/-/g, "−"); }
  function pt(id, label, p) { return { id: id, label: label, type: "point", answer: S(p) }; }
  function walk(p) {
    var x = p[0], y = p[1];
    return "Start at O. " + (x ? "Go " + Math.abs(x) + (x > 0 ? " right" : " left") : "Do not go left or right") + ", then " + (y ? Math.abs(y) + (y > 0 ? " up" : " down") : "do not go up or down") + ".";
  }
  function plot(id, name, p, range) {
    var q = { id: id, prompt: "Plot **" + name + S(p) + "**.", parts: [{ id: "v", label: "", type: "plot", answer: S(p) }],
      help: [{ text: "x = " + p[0] + " tells you left or right; y = " + p[1] + " tells you up or down." }, { text: walk(p) }, { text: "Answer: the point " + name + " is at **" + S(p) + "**." }] };
    if (range) q.parts[0].range = range;
    return q;
  }
  var L = "abcdefghijkl";

  // Q2 graph
  var G2 = { A: [2, 3], B: [-3, 2], C: [-2, -1], D: [4, -3], E: [3, 0], F: [-4, 0], G: [0, 4], H: [0, -4] };
  // Q5 graphs (read from the book's pictures)
  var G5a = { P: [-3, 7], Q: [0, 7], R: [-3, 4], S: [-6, 4], A: [2, 4], B: [5, 7], C: [7, 3], K: [-6, 0], L: [-4, 2], M: [-2, 0], N: [-4, -5], E: [0, -2], F: [4, 1], G: [3, -6] };
  var G5b = { A: [0, 1], B: [6, 3], C: [0, 5], D: [2, 3], E: [-7, 2], F: [-4, 0], G: [-6, 0], H: [-3, -3], I: [-7, -3], P: [3, 1], Q: [5, 1], R: [6, -2], S: [5, -5], T: [3, -5], U: [2, -2] };
  function shape(id, prompt, g, names, fig) {
    return { id: id, prompt: prompt, figure: fig, parts: names.map(function (n) { return pt(n, n, g[n]); }),
      help: [{ text: "For each corner: count across from the Y-axis for x (right +, left −), then up or down from the X-axis for y." }]
        .concat([{ text: "Answer: " + names.map(function (n) { return "**" + n + S(g[n]) + "**"; }).join(", ") + "." }]) };
  }
  var figA = { type: "coord", range: [-8, 8, -7, 8], points: G5a, polys: [["P", "Q", "R", "S"], ["A", "B", "C"], ["K", "L", "M", "N"], ["E", "F", "G"]] };
  var figB = { type: "coord", range: [-8, 7, -6, 6], points: G5b, polys: [["A", "B", "C", "D"], ["P", "Q", "R", "S", "T", "U"]], open: [["E", "F"], ["G", "H", "I", "E"]] };

  function join(id, pts, name, opts, helpTxt) {
    var g = {}, names = Object.keys(pts); names.forEach(function (n) { g[n] = pts[n]; });
    var xs = names.map(function (n) { return pts[n][0]; }), ys = names.map(function (n) { return pts[n][1]; });
    var r = [Math.min(-1, Math.min.apply(null, xs) - 1), Math.max(1, Math.max.apply(null, xs) + 1), Math.min(-1, Math.min.apply(null, ys) - 1), Math.max(1, Math.max.apply(null, ys) + 1)];
    return { id: id, prompt: "Join " + names.map(function (n) { return n + S(pts[n]); }).join(", ") + " in order (and back to " + names[0] + "). Name the figure.",
      parts: [ch("v", "", opts, name)],
      help: [{ text: "Plot the points and join them.", figure: { type: "coord", range: r, points: g, polys: [names] } }, { text: helpTxt }, { text: "Answer: **" + name.toLowerCase() + "**." }] };
  }
  var SHAPES = ["Triangle", "Square", "Rectangle", "Kite", "Quadrilateral"];

  Practice.register({
    id: "math-coordinates-g6-ex12-1",
    subject: "Mathematics",
    unit: "Coordinates",
    title: "Exercise 12.1",
    topic: "Reading and plotting points",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 191–193",

    reference: {
      title: "Coordinates",
      columns: ["Idea", "Example"],
      rows: [
        ["A point is written (x, y): x first, then y", "(4, 7): x = 4, y = 7"],
        ["x: go right (+) or left (−) from O", "(−3, 2): 3 left"],
        ["y: go up (+) or down (−)", "(−3, 2): then 2 up"],
        ["The origin O is (0, 0)", ""],
        ["On the X-axis, y = 0. On the Y-axis, x = 0", "(5, 0) and (0, 4)"],
        ["x is also called the abscissa; y the ordinate", ""],
        ["How to type", "Type points like (2, -3). For plotting, click the grid (or use the arrow keys)."]
      ]
    },

    sections: [
      {
        id: "q1", title: "Quick answers", instruction: "Type points like (2, 3).",
        questions: [
          { id: "q1a", prompt: "The coordinates of a point are **(4, 7)**.", parts: [nm("x", "x-coordinate", 4), nm("y", "y-coordinate", 7)], help: [{ text: "The first number is x, the second is y." }, { text: "Answer: **x = 4, y = 7**." }] },
          { id: "q1b", prompt: "The x-coordinate of a point is **5** and the y-coordinate is **3**. Write the point.", parts: [pt("v", "", [5, 3])], help: [{ text: "Write x first, then y, in brackets." }, { text: "Answer: **(5, 3)**." }] },
          { id: "q1c", prompt: "The coordinates of the origin are …", parts: [pt("v", "", [0, 0])], help: [{ text: "The origin O is where the axes cross. You do not move at all." }, { text: "Answer: **(0, 0)**." }] },
          { id: "q1d", prompt: "A point is **2 units right** along the x-axis and **6 units up** along the y-axis from the origin.", parts: [pt("v", "", [2, 6])], help: [{ text: "Right is +, up is +." }, { text: "Answer: **(2, 6)**." }] },
          { id: "q1e", prompt: "A point is **3 units left** along the x-axis and **2 units up** along the y-axis from the origin.", parts: [pt("v", "", [-3, 2])], help: [{ text: "Left is −, so x = −3. Up is +, so y = 2." }, { text: "Answer: **(−3, 2)**." }] },
          { id: "q1f", prompt: "A point on the **x-axis**, **5 units right** of the origin.", parts: [pt("v", "", [5, 0])], help: [{ text: "On the x-axis you do not go up or down, so y = 0." }, { text: "Answer: **(5, 0)**." }] },
          { id: "q1g", prompt: "A point on the **y-axis**, **4 units up** from the origin.", parts: [pt("v", "", [0, 4])], help: [{ text: "On the y-axis you do not go left or right, so x = 0." }, { text: "Answer: **(0, 4)**." }] }
        ]
      },
      { id: "q2", title: "Read the graph", instruction: "Type each point like (2, -3).",
        questions: [{ id: "q2", prompt: "Write the coordinates of the points A to H.", figure: { type: "coord", range: [-5, 5, -5, 5], points: G2 },
          parts: Object.keys(G2).map(function (n) { return pt(n, n, G2[n]); }),
          help: [{ text: "For each point, count across from O for x (right +, left −), then up or down for y." }, { text: "E and F are on the X-axis, so their y is 0. G and H are on the Y-axis, so their x is 0." },
                 { text: "Answer: " + Object.keys(G2).map(function (n) { return "**" + n + S(G2[n]) + "**"; }).join(", ") + "." }] }] },
      {
        id: "q3", title: "Points on the axes", instruction: "Choose or type the answer.",
        questions: [
          { id: "q3a", prompt: "What is the y-coordinate of a point on the x-axis?", parts: [nm("v", "", 0)], help: [{ text: "A point on the x-axis is not above or below O." }, { text: "Answer: **0**." }] },
          { id: "q3b", prompt: "What is the x-coordinate of a point on the y-axis?", parts: [nm("v", "", 0)], help: [{ text: "A point on the y-axis is not left or right of O." }, { text: "Answer: **0**." }] },
          { id: "q3c", prompt: "On which axis does the point **(4, 0)** lie? What is its ordinate (y)?", parts: [ch("a", "Axis", ["X-axis", "Y-axis"], "X-axis"), nm("o", "Ordinate", 0)], help: [{ text: "y = 0, so it is on the X-axis." }, { text: "The ordinate is the y-coordinate: 0." }, { text: "Answer: **X-axis, ordinate 0**." }] },
          { id: "q3d", prompt: "On which axis does the point **(0, −3)** lie? What is its abscissa (x)?", parts: [ch("a", "Axis", ["X-axis", "Y-axis"], "Y-axis"), nm("o", "Abscissa", 0)], help: [{ text: "x = 0, so it is on the Y-axis." }, { text: "The abscissa is the x-coordinate: 0." }, { text: "Answer: **Y-axis, abscissa 0**." }] }
        ]
      },
      { id: "q4", title: "Plot the points", instruction: "Click the grid to place each point. Arrow keys move it too.",
        questions: [["A", [2, 1]], ["B", [-3, 4]], ["C", [-4, -1]], ["D", [-1, 3]], ["E", [3, 0]], ["F", [0, 2]], ["G", [-2, 0]], ["H", [0, -4]]].map(function (r, i) { return plot("q4" + L[i], r[0], r[1]); }) },
      {
        id: "q5", title: "Vertices of shapes", instruction: "Creative section A. Hint: in PQRS, P(−3, 7), Q(0, 7), R(−3, 4), S(−6, 4).",
        questions: [
          shape("q5a1", "Graph (a): triangle ABC", G5a, ["A", "B", "C"], figA),
          shape("q5a2", "Graph (a): KLMN", G5a, ["K", "L", "M", "N"], figA),
          shape("q5a3", "Graph (a): triangle EFG", G5a, ["E", "F", "G"], figA),
          shape("q5b1", "Graph (b): ABCD", G5b, ["A", "B", "C", "D"], figB),
          shape("q5b2", "Graph (b): E, F, G, H, I", G5b, ["E", "F", "G", "H", "I"], figB),
          shape("q5b3", "Graph (b): hexagon PQRSTU", G5b, ["P", "Q", "R", "S", "T", "U"], figB)
        ]
      },
      { id: "q6", title: "Plot on a bigger grid", instruction: "Click the grid to place each point.",
        questions: [["A", [2, 3]], ["B", [5, 4]], ["C", [-3, 5]], ["D", [-6, 2]], ["E", [5, 0]], ["F", [0, 2]], ["G", [-1, -5]], ["H", [0, -6]], ["P", [5, -2]], ["Q", [-7, 2]], ["R", [-4, -2]], ["S", [-4, -6]]]
          .map(function (r, i) { return plot("q6" + L[i], r[0], r[1], [-8, 8, -8, 8]); }) },
      {
        id: "q7", title: "Join the points", instruction: "Plot the points on paper, join them in order, then name the figure.",
        questions: [
          join("q7a", { A: [3, 2], B: [5, 3], C: [1, 5] }, "Triangle", SHAPES, "Three corners make a triangle."),
          join("q7b", { P: [1, 1], Q: [3, 1], R: [3, 3], S: [1, 3] }, "Square", SHAPES, "All four sides are 2 units and every corner is a right angle."),
          join("q7c", { M: [3, 1], A: [3, 4], T: [-2, 4], H: [-2, 1] }, "Rectangle", SHAPES, "MA = TH = 3 units and AT = HM = 5 units, with right angles."),
          join("q7d", { L: [-1, -1], I: [3, -1], K: [3, 2], E: [-1, 2] }, "Rectangle", SHAPES, "LI = KE = 4 units and IK = EL = 3 units, with right angles."),
          join("q7e", { N: [-2, 2], I: [0, 5], C: [2, 2], E: [0, -7] }, "Kite", SHAPES, "NI = IC (short sides) and CE = EN (long sides): two pairs of equal sides next to each other."),
          join("q7f", { B: [-4, 2], E: [-7, -1], S: [-4, -4], T: [-1, -1] }, "Square", SHAPES, "It is a square turned on its corner: all sides equal, and the diagonals BS and ET are both 6 units."),
          join("q7g", { Y: [1, -2], E: [3, 0], A: [3, 3], R: [-1, 3] }, "Quadrilateral", SHAPES, "It has four sides, but no equal sides and no parallel pairs, so it is just a quadrilateral.")
        ]
      },
      {
        id: "q8", title: "Mid-points", instruction: "Creative section B. The mid-point is halfway: add the x's and halve, add the y's and halve.",
        questions: [
          { id: "q8a", prompt: "Plot **A(1, 2)** and **B(5, 2)** and join them. Mark the mid-point M of AB.", figure: { type: "coord", range: [-1, 7, -1, 6], points: { A: [1, 2], B: [5, 2] }, open: [["A", "B"]] },
            parts: [pt("v", "M =", [3, 2])], help: [{ text: "x: (1 + 5) ÷ 2 = 3. y: (2 + 2) ÷ 2 = 2." }, { text: "Answer: **M(3, 2)**." }] },
          { id: "q8b", prompt: "Plot **P(2, 3)** and **Q(6, 5)** and join them. Mark the mid-point N of PQ.", figure: { type: "coord", range: [-1, 7, -1, 6], points: { P: [2, 3], Q: [6, 5] }, open: [["P", "Q"]] },
            parts: [pt("v", "N =", [4, 4])], help: [{ text: "x: (2 + 6) ÷ 2 = 4. y: (3 + 5) ÷ 2 = 4." }, { text: "Answer: **N(4, 4)**." }] }
        ]
      },
      {
        id: "q9", title: "Shapes and area", instruction: "Count the unit squares.",
        questions: [
          { id: "q9a", prompt: "Join **A(2, 1), B(2, 4), C(−3, 4)** and **D(−3, 1)** in order.", figure: { type: "coord", range: [-5, 4, -1, 6], points: { A: [2, 1], B: [2, 4], C: [-3, 4], D: [-3, 1] }, polys: [["A", "B", "C", "D"]] },
            parts: [ch("n", "(ii) Name of the figure", ["Square", "Rectangle", "Triangle"], "Rectangle"), nm("l", "(iii) Length", 5, "units"), nm("b", "Breadth", 3, "units"), nm("a", "(iv) Area", 15, "sq. units")],
            help: [{ text: "BC goes from x = 2 to x = −3: 5 units. AB goes from y = 1 to y = 4: 3 units." }, { text: "Length 5 and breadth 3 are different, so it is a rectangle." }, { text: "Area = 5 × 3 = 15 square units." }, { text: "Answer: **rectangle, 5 and 3 units, 15 sq. units**." }] },
          { id: "q9b", prompt: "Join **P(−1, 3), Q(−1, −2), R(4, −2)** and **S(4, 3)** in order.", figure: { type: "coord", range: [-3, 6, -4, 5], points: { P: [-1, 3], Q: [-1, -2], R: [4, -2], S: [4, 3] }, polys: [["P", "Q", "R", "S"]] },
            parts: [ch("n", "(ii) Name of the figure", ["Square", "Rectangle", "Triangle"], "Square"), nm("a", "(iii) Area", 25, "sq. units")],
            help: [{ text: "PQ goes from y = 3 to y = −2: 5 units. QR goes from x = −1 to x = 4: 5 units." }, { text: "All sides are 5 units, so it is a square." }, { text: "Area = 5 × 5 = 25 square units." }, { text: "Answer: **square, 25 sq. units**." }] }
        ]
      }
    ]
  });
})();
