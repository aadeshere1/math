/*
  Exercise 17.4: Solid figures, nets and skeleton models.
  Source: Vedanta Excel in Mathematics, Book 6, pages 262-263.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop", H = 0.866;
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  var SOLIDS = ["cube", "cuboid", "cylinder", "cone", "sphere", "square pyramid", "tetrahedron", "triangular prism", "octahedron"];
  function quick(id, text, ans, why) { return { id: id, prompt: text, parts: [nm("v", "", ans)], help: [{ text: why }, { text: "Answer: **" + ans + "**." }] }; }
  function nameIt(id, kind, ans, why) {
    return { id: id, prompt: "Name this solid figure.", figure: { type: "solid", kind: kind, l: 4, b: 2, h: 1.6 }, parts: [ch("v", "", ["cuboid", "cylinder", "cone", "sphere"], ans)],
      help: [{ text: why }, { text: "Answer: **" + ans + "**." }] };
  }
  // nets
  var NETS = {
    cube: { type: "shape", polys: [{ pts: [[1, 0], [2, 0], [2, 1], [4, 1], [4, 2], [2, 2], [2, 3], [1, 3], [1, 2], [0, 2], [0, 1], [1, 1]], tone: "a" }],
      dashes: [[1, 1, 1, 2], [2, 1, 2, 2], [3, 1, 3, 2], [1, 1, 2, 1], [1, 2, 2, 2]] },
    cuboid: { type: "shape", polys: [{ pts: [[1, 0], [3, 0], [3, 1], [6, 1], [6, 2.2], [3, 2.2], [3, 3.2], [1, 3.2], [1, 2.2], [0, 2.2], [0, 1], [1, 1]].map(function (p) { return p; }), tone: "a" }],
      dashes: [[1, 1, 1, 2.2], [3, 1, 3, 2.2], [4, 1, 4, 2.2], [1, 1, 3, 1], [1, 2.2, 3, 2.2]] },
    pyramid: { type: "shape", polys: [{ pts: [[1, 1], [2, -0.4], [3, 1], [4.4, 2], [3, 3], [2, 4.4], [1, 3], [-0.4, 2]], tone: "a" }],
      dashes: [[1, 1, 3, 1], [3, 1, 3, 3], [3, 3, 1, 3], [1, 3, 1, 1]] },
    tetra: { type: "shape", polys: [{ pts: [[0, 2 * H * 2], [4, 2 * H * 2], [2, 0]], tone: "a" }], dashes: [[1, 2 * H, 3, 2 * H], [1, 2 * H, 2, 4 * H], [3, 2 * H, 2, 4 * H]] },
    octa: { type: "shape", polys: [{ pts: [[0, H], [0.5, 0], [1, -H], [1.5, 0], [3.5, 0], [3, H], [2.5, 2 * H], [2, H]], tone: "a" }],
      dashes: [[0.5, 0, 1, H], [1, H, 1.5, 0], [1.5, 0, 2, H], [2, H, 2.5, 0], [2.5, 0, 3, H], [0.5, 0, 1.5, 0], [2, H, 3, H]] }
  };
  function net(id, fig, ans, why, opts) {
    return { id: id, prompt: "Which solid does this net fold into? (Fold along the dotted lines.)", figure: fig, parts: [ch("v", "", opts || ["cube", "cuboid", "square pyramid", "octahedron"], ans)],
      help: [{ text: why }, { text: "Answer: **" + ans + "**." }] };
  }

  Practice.register({
    id: "math-measure-g6-ex17-4",
    subject: "Mathematics",
    unit: "Perimeter, Area and Volume",
    title: "Exercise 17.4",
    topic: "Solid figures and nets",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 262–263",

    reference: {
      title: "Solid figures",
      columns: ["Solid", "Faces · Vertices · Edges"],
      rows: [
        ["Cube (6 equal squares)", "6 · 8 · 12"],
        ["Cuboid (6 rectangles)", "6 · 8 · 12"],
        ["Square pyramid", "5 · 5 · 8"],
        ["Tetrahedron (4 triangles)", "4 · 4 · 6"],
        ["Triangular prism", "5 · 6 · 9"],
        ["Octahedron (8 triangles)", "8 · 6 · 12"],
        ["Cylinder", "2 flat faces and 1 curved face"],
        ["Euler's rule", "F + V − E = 2"],
        ["Net", "a flat shape that folds into a solid"]
      ]
    },

    sections: [
      { id: "q1", title: "Faces, edges, vertices", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          quick("q1a", "Number of faces of a cube = ?", 6, "A cube has 6 square faces: top, bottom, front, back, left and right."),
          quick("q1b", "Number of edges of a cuboid = ?", 12, "4 edges on top, 4 on the bottom and 4 standing up: 12."),
          quick("q1c", "Number of vertices of a cuboid = ?", 8, "4 corners on top and 4 on the bottom: 8."),
          quick("q1d", "Number of faces of a cylinder = ?", 3, "2 flat round faces (top and bottom) and 1 curved face: 3."),
          quick("q1e", "Number of vertices of a (square) pyramid = ?", 5, "4 corners of the square base and 1 at the top: 5.")
        ] },
      { id: "q2", title: "Name the solids", instruction: "Say the name of these solid figures.",
        questions: [
          nameIt("q2a", "cuboid", "cuboid", "It has 6 flat rectangular faces."),
          nameIt("q2b", "cylinder", "cylinder", "It has two round flat ends and a curved side."),
          nameIt("q2c", "cone", "cone", "It has one round flat face and a curved side coming to a point."),
          nameIt("q2d", "sphere", "sphere", "It is round like a ball, with no flat faces.")
        ] },
      { id: "q3", title: "Nets", instruction: "Look at the nets and identify the solid figures.",
        questions: [
          net("q3a", NETS.cube, "cube", "There are 6 faces and all of them are equal squares."),
          net("q3b", NETS.cuboid, "cuboid", "There are 6 faces, all rectangles, in pairs of the same size."),
          net("q3c", NETS.pyramid, "square pyramid", "A square base with a triangle on each side. The triangles meet at the top."),
          net("q3d", NETS.octa, "octahedron", "There are 8 equal triangles. A solid with 8 triangle faces is an octahedron.")
        ] },
      { id: "q4", title: "Examples", instruction: "Pick an example of each solid.",
        questions: [["cube", "a dice", ["a dice", "a football", "an ice-cream cone", "a pipe"]], ["cuboid", "a brick", ["a ball", "a brick", "a funnel", "a coin"]],
          ["sphere", "a football", ["a football", "a book", "a tin can", "a tent"]], ["cylinder", "a tin can", ["a marble", "a tin can", "a box of chalk", "a party hat"]],
          ["cone", "an ice-cream cone", ["a matchbox", "a globe", "an ice-cream cone", "a drum"]]].map(function (m, i) {
          return { id: "q4" + L[i], prompt: "Which of these is shaped like a **" + m[0] + "**?", parts: [ch("v", "", m[2], m[1])],
            help: [{ text: "Other examples: " + { cube: "an ice cube, a Rubik's cube", cuboid: "a book, a matchbox, a box of butter", sphere: "a globe, a marble", cylinder: "a pipe, a drum, a glass", cone: "a party hat, a funnel" }[m[0]] + "." }, { text: "Answer: **" + m[1] + "**." }] };
        }) },
      { id: "q5", title: "F + V − E = 2", instruction: "Count the faces (F), vertices (V) and edges (E). Check that F + V − E = 2.",
        questions: [["Cuboid", 6, 8, 12], ["Tetrahedron", 4, 4, 6], ["Triangular prism", 5, 6, 9], ["Square pyramid", 5, 5, 8]].map(function (m, i) {
          return { id: "q5" + L[i], prompt: "**" + m[0] + "**", parts: [nm("f", "Faces F", m[1]), nm("v", "Vertices V", m[2]), nm("e", "Edges E", m[3])],
            help: [{ text: { Cuboid: "6 rectangle faces; 4 corners on top and 4 below; 4 + 4 + 4 edges.", Tetrahedron: "4 triangle faces; 3 corners on the base and 1 on top; 3 base edges and 3 going up.",
              "Triangular prism": "2 triangle ends and 3 rectangle sides; 3 + 3 corners; 3 + 3 + 3 edges.", "Square pyramid": "1 square base and 4 triangles; 4 + 1 corners; 4 base edges and 4 going up." }[m[0]] },
              { text: "Check: " + m[1] + " + " + m[2] + " − " + m[3] + " = 2 ✓" }, { text: "Answer: **F = " + m[1] + ", V = " + m[2] + ", E = " + m[3] + "**." }] };
        }) },
      { id: "q6", title: "Fold the nets", instruction: "If you cut out these nets and fold them along the dotted lines, which solids do you make?",
        questions: [
          net("q6a", NETS.cube, "cube", "6 equal squares fold into a cube.", ["cube", "cuboid", "tetrahedron", "octahedron"]),
          net("q6b", NETS.cuboid, "cuboid", "6 rectangles, in pairs, fold into a cuboid.", ["cube", "cuboid", "tetrahedron", "square pyramid"]),
          net("q6c", NETS.tetra, "tetrahedron", "4 equal triangles: fold the three corner triangles up and they meet at a point. That is a tetrahedron.", ["square pyramid", "tetrahedron", "octahedron", "triangular prism"]),
          net("q6d", NETS.pyramid, "square pyramid", "A square base with 4 triangles folds into a square pyramid.", ["cube", "tetrahedron", "square pyramid", "octahedron"]),
          net("q6e", NETS.octa, "octahedron", "8 equal triangles fold into an octahedron.", ["tetrahedron", "square pyramid", "triangular prism", "octahedron"])
        ] },
      { id: "q7", title: "Matchstick models", instruction: "Each matchstick is one edge of a skeleton model. How many corners (vertices) will each model have?",
        questions: [["6 matchsticks make a tetrahedron.", 4, "3 corners on the base triangle and 1 at the top: 4."], ["8 matchsticks make a (square) pyramid.", 5, "4 corners on the base square and 1 at the top: 5."],
          ["12 matchsticks make a cube.", 8, "4 corners on top and 4 below: 8."], ["12 matchsticks make an octahedron.", 6, "1 corner on top, 1 at the bottom and 4 around the middle: 6."]].map(function (m, i) {
          return { id: "q7" + L[i], prompt: m[0] + " How many vertices does it have?", parts: [nm("v", "Vertices", m[1])], help: [{ text: m[2] }, { text: "Answer: **" + m[1] + "**." }] };
        }) }
    ]
  });
})();
