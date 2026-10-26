/*
  Exercise 17.3: Area of plane figures.
  Source: Vedanta Excel in Mathematics, Book 6, pages 255-259.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
  Not included: 17.3 Q5 c-f (rough estimates by counting squares on a printed graph) and Q15 (project work).
*/
(function () {
  var L = "abcdefghijklmnop";
  function r2(v) { return Math.round(v * 100) / 100; }
  function nm(id, label, answer, unit) { return { id: id, label: label, type: "number", answer: r2(answer), unit: unit }; }
  function rect(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
  function multi(id, prompt, rows, figure) { // [label, value, unit, step] | [label, expr, "expr", step] | [label, ans, "choice", step, options]
    var q = { id: id, prompt: prompt, parts: rows.map(function (r, i) {
      return r[2] === "expr" ? { id: L[i], label: r[0], type: "expr", form: "any", answer: r[1], example: r[1] } : r[2] === "choice" ? { id: L[i], label: r[0], type: "choice", options: r[4], answer: r[1] } : nm(L[i], r[0], r[1], r[2]);
    }), help: rows.map(function (r) { return { text: r[3] }; }).concat([{ text: "Answer: **" + rows.map(function (r) { return r[2] === "expr" ? r[1].replace("^2", "²") : r[2] === "choice" ? r[1] : r[2] ? r2(r[1]) + " " + r[2] : "Rs " + r2(r[1]); }).join(", ") + "**." }]) };
    if (figure) q.figure = figure;
    return q;
  }
  function one(id, prompt, ans, unit, steps, figure) { return multi(id, prompt, [["Area", ans, unit, steps.join(" ")]], figure); }
  function shaded(id, polys, sides, ans, steps) {
    return multi(id, "Find the area of the shaded region.", [["Shaded area", ans, "cm²", steps.join(" ")]], { type: "shape", polys: polys, sides: sides });
  }
  // tilted 2 × 1 hole for Q11c
  function tilted(cx, cy, w, h, deg) {
    var a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(function (p) { return [cx + p[0] * c - p[1] * s, cy + p[0] * s + p[1] * c]; });
  }

  Practice.register({
    id: "math-measure-g6-ex17-3",
    subject: "Mathematics",
    unit: "Perimeter, Area and Volume",
    title: "Exercise 17.3",
    topic: "Area",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 255–259",

    reference: {
      title: "Area",
      columns: ["Shape", "Area"],
      rows: [
        ["Area", "the surface enclosed by the boundary; count the unit squares"],
        ["Rectangle, length l, breadth b", "A = l × b"],
        ["Square, side l", "A = l × l = l²"],
        ["Breadth from area", "b = A ÷ l"],
        ["Side of a square from area", "l = √A (7 × 7 = 49, so √49 = 7)"],
        ["Shaded region", "big area − cut-out area"],
        ["Joined shapes", "split into rectangles and add"],
        ["Units", "cm × cm = cm², m × m = m²"]
      ]
    },

    sections: [
      { id: "q1", title: "Count the squares", instruction: "Say and write the area of these figures from the graph. Each small square is 1 square unit.",
        questions: (function () {
          var fig = { type: "shape", grid: [13, 8], u: 22, polys: [{ pts: rect(1, 1, 3, 5), tone: "a" }, { pts: [[7, 1], [10, 1], [9, 4], [6, 4]], tone: "b" }, { pts: [[8, 5], [9, 5], [9, 6], [11, 6], [11, 5], [12, 5], [12, 7], [8, 7]], tone: "a" }],
            text: [[2.5, 3.5, "A", "big"], [8, 2.5, "B", "big"], [10, 6.5, "C", "big"]] };
          return [
            multi("q1a", "Area of figure **A** = ?", [["Area", 15, "squares", "A is 3 squares wide and 5 squares tall: 3 × 5 = 15 squares."]], fig),
            multi("q1b", "Area of figure **B** = ?", [["Area", 9, "squares", "B is a slanted shape. Cut the triangle off one end and fit it on the other end: it makes a 3 × 3 block, so 9 squares."]], fig),
            multi("q1c", "Area of figure **C** = ?", [["Area", 6, "squares", "C has a row of 4 squares and 2 more squares on top: 4 + 2 = 6 squares."]], fig)
          ];
        })() },
      { id: "q2", title: "Words and formulas", instruction: "Say and write the answers. Type a formula like x² as x^2.",
        questions: [
          multi("q2a", "The plane surface enclosed by the boundary lines of a figure is called … of the plane figure.", [["", "area", "choice", "The surface inside the boundary is the area.", ["area", "perimeter", "volume"]]]),
          multi("q2b", "The total length of the boundary lines of a plane figure is its …", [["", "perimeter", "choice", "The length all round the boundary is the perimeter.", ["area", "perimeter", "volume"]]]),
          multi("q2c", "Each side of a square is x cm. Its area is … cm².", [["Area", "x^2", "expr", "Area of a square = side × side = x × x = x²."]]),
          multi("q2d", "The length and breadth of a rectangle are a cm and b cm. Its area is …", [["Area", "ab", "expr", "Area = length × breadth = a × b = ab cm²."]])
        ] },
      { id: "q3", title: "Quick areas", instruction: "Say and write the areas quickly.",
        questions: [
          one("q3a", "**l = 5 cm, b = 3 cm**, area of rectangle = ?", 15, "cm²", ["5 × 3 = 15 cm²."]),
          one("q3b", "**l = 6.5 cm, b = 2 cm**, area of rectangle = ?", 13, "cm²", ["6.5 × 2 = 13 cm²."]),
          one("q3c", "**l = 7 cm**, area of square = ?", 49, "cm²", ["7 × 7 = 49 cm²."]),
          one("q3d", "**l = 8 cm**, area of square = ?", 64, "cm²", ["8 × 8 = 64 cm²."]),
          one("q3e", "Perimeter of a square = **20 cm**. Its area = ?", 25, "cm²", ["Side = 20 ÷ 4 = 5 cm.", "Area = 5 × 5 = 25 cm²."]),
          one("q3f", "Perimeter of a square = **40 cm**. Its area = ?", 100, "cm²", ["Side = 40 ÷ 4 = 10 cm.", "Area = 10 × 10 = 100 cm²."])
        ] },
      { id: "q4", title: "Complete the tables", instruction: "Find the missing values.",
        questions: [
          multi("q4a1", "Rectangle A: **l = 5 cm, b = 3 cm**. Find the area.", [["Area", 15, "cm²", "A = l × b = 5 × 3 = 15 cm²."]]),
          multi("q4a2", "Rectangle B: **l = 10 cm, A = 60 cm²**. Find the breadth.", [["Breadth", 6, "cm", "b = A ÷ l = 60 ÷ 10 = 6 cm."]]),
          multi("q4a3", "Rectangle C: **b = 4 cm, A = 28 cm²**. Find the length.", [["Length", 7, "cm", "l = A ÷ b = 28 ÷ 4 = 7 cm."]]),
          multi("q4b1", "Square A: **l = 5 cm**. Find its perimeter and area.", [["Perimeter", 20, "cm", "P = 4 × 5 = 20 cm."], ["Area", 25, "cm²", "A = 5 × 5 = 25 cm²."]]),
          multi("q4b2", "Square B: **P = 12 cm**. Find its side and area.", [["Side", 3, "cm", "l = 12 ÷ 4 = 3 cm."], ["Area", 9, "cm²", "A = 3 × 3 = 9 cm²."]]),
          multi("q4b3", "Square C: **A = 25 cm²**. Find its side and perimeter.", [["Side", 5, "cm", "5 × 5 = 25, so l = 5 cm."], ["Perimeter", 20, "cm", "P = 4 × 5 = 20 cm."]])
        ] },
      { id: "q5", title: "Areas from a graph", instruction: "Find the area of these figures by counting squares. Each small square is 1 square unit.",
        questions: [
          multi("q5a", "Find the area of the cross.", [["Area", 20, "squares", "The upright bar is 2 × 6 = 12 squares. Each arm is 2 × 2 = 4 squares: 12 + 4 + 4 = 20 squares."]],
            { type: "shape", grid: [8, 8], u: 24, polys: [{ pts: [[3, 1], [5, 1], [5, 3], [7, 3], [7, 5], [5, 5], [5, 7], [3, 7], [3, 5], [1, 5], [1, 3], [3, 3]], tone: "a" }] }),
          multi("q5b", "Find the area of the hexagon.", [["Area", 12, "squares", "The middle part is a 2 × 4 block = 8 squares. Each side has 4 half squares = 2 squares. 8 + 2 + 2 = 12 squares."]],
            { type: "shape", grid: [6, 6], u: 26, polys: [{ pts: [[2, 1], [4, 1], [5, 3], [4, 5], [2, 5], [1, 3]], tone: "a" }] })
        ] },
      { id: "q6", title: "Areas of figures", instruction: "Find the area of the following figures.",
        questions: [
          one("q6a", "Find the area.", 28, "cm²", ["A = 7 × 4 = 28 cm²."], { type: "shape", polys: [{ pts: rect(0, 0, 7, 4), tone: "a" }], sides: [["7 cm", 0, 2], ["4 cm", 0, 1]], right: [[0, 4, "bl"]] }),
          one("q6b", "Find the area.", 9, "cm²", ["A = 3 × 3 = 9 cm²."], { type: "shape", polys: [{ pts: rect(0, 0, 3, 3), tone: "a" }], sides: [["3 cm", 0, 2], ["3 cm", 0, 1]], right: [[0, 3, "bl"]] }),
          one("q6c", "Find the area.", 27, "cm²", ["A = 4.5 × 6 = 27 cm²."], { type: "shape", polys: [{ pts: rect(0, 0, 4.5, 6), tone: "a" }], sides: [["4.5 cm", 0, 2], ["6 cm", 0, 1]], right: [[0, 6, "bl"]] }),
          one("q6d", "Find the area.", 11, "cm²", ["Split it: the big part is 5 × 2 = 10 cm², the small part is 1 × 1 = 1 cm².", "Total = 10 + 1 = 11 cm²."],
            { type: "shape", polys: [{ pts: [[0, 0], [5, 0], [5, 1], [6, 1], [6, 2], [0, 2]], tone: "a" }], sides: [["5 cm", 0, 0], ["2 cm", 0, 5], ["1 cm", 0, 3], ["1 cm", 0, 4, { at: [5.5, 2.45] }]], dashes: [[5, 1, 5, 2]] }),
          one("q6e", "Find the area.", 12, "cm²", ["Split it: the top bar is 6 × 1 = 6 cm², the lower part is 3 × 2 = 6 cm².", "Total = 6 + 6 = 12 cm²."],
            { type: "shape", polys: [{ pts: [[0, 0], [6, 0], [6, 3], [3, 3], [3, 1], [0, 1]], tone: "a" }], sides: [["6 cm", 0, 0], ["1 cm", 0, 5], ["3 cm", 0, 2], ["2 cm", 0, 3]], dashes: [[3, 1, 6, 1]] }),
          one("q6f", "Find the area.", 40, "cm²", ["Split it: the bottom bar is 8 × 2 = 16 cm². Each leg is 3 × 4 = 12 cm².", "Total = 16 + 12 + 12 = 40 cm²."],
            { type: "shape", polys: [{ pts: [[0, 0], [3, 0], [3, 4], [5, 4], [5, 0], [8, 0], [8, 6], [0, 6]], tone: "a" }], sides: [["3 cm", 0, 0], ["3 cm", 0, 4], ["4 cm", 0, 2], ["6 cm", 0, 5], ["8 cm", 0, 6]], dashes: [[0, 4, 3, 4], [5, 4, 8, 4]] })
        ] },
      { id: "q7", title: "Rooms and carpets", instruction: "Answer each part.",
        questions: [
          multi("q7a", "A square room is **5 m** long. (i) Write the formula for the area of a square. (ii) Find the area of the floor. (iii) Find the area of carpet needed to cover the floor.", [
            ["(i) Area", "l^2", "expr", "Area of a square = l × l = l²."], ["(ii) Floor", 25, "m²", "5 × 5 = 25 m²."], ["(iii) Carpet", 25, "m²", "The carpet covers the whole floor: 25 m²."]]),
          multi("q7b", "A rectangular room is **6 m** long and **5.5 m** broad. (i) Write the formula for the area of a rectangle. (ii) Find the area of the floor. (iii) Find the area of carpet needed. (iv) Find the cost of carpet at Rs 150 per sq. m.", [
            ["(i) Area", "lb", "expr", "Area of a rectangle = l × b."], ["(ii) Floor", 33, "m²", "6 × 5.5 = 33 m²."], ["(iii) Carpet", 33, "m²", "Same as the floor: 33 m²."], ["(iv) Cost = Rs", 4950, "", "33 × 150 = Rs 4950."]]),
          multi("q7c", "A rectangular hall is **10 m** long and **8.5 m** broad. (i) Find the area of carpet needed. (ii) If 1 m² of carpet costs Rs 100, find the cost.", [
            ["(i) Carpet", 85, "m²", "10 × 8.5 = 85 m²."], ["(ii) Cost = Rs", 8500, "", "85 × 100 = Rs 8500."]])
        ] },
      { id: "q8", title: "From area to sides", instruction: "Answer each part.",
        questions: [
          multi("q8a", "The area of a square is **49 cm²**. (i) Find its length. (ii) Find its perimeter.", [["(i) Length", 7, "cm", "7 × 7 = 49, so l = 7 cm."], ["(ii) Perimeter", 28, "cm", "4 × 7 = 28 cm."]]),
          multi("q8b", "The area of a square garden is **196 m²**. (i) Write the formula. (ii) Find its length. (iii) Find its perimeter. (iv) Find the wire needed to fence it with 4 rounds.", [
            ["(i) Area", "l^2", "expr", "A = l²."], ["(ii) Length", 14, "m", "14 × 14 = 196, so l = 14 m."], ["(iii) Perimeter", 56, "m", "4 × 14 = 56 m."], ["(iv) Wire", 224, "m", "4 rounds = 4 × 56 = 224 m."]]),
          multi("q8c", "The area of a rectangle is **70 cm²** and it is **7 cm** broad. (i) Find its length. (ii) Find its perimeter. (The book prints 7 m, but the area is in cm², so we use cm.)", [
            ["(i) Length", 10, "cm", "l = 70 ÷ 7 = 10 cm."], ["(ii) Perimeter", 34, "cm", "2(10 + 7) = 34 cm."]]),
          multi("q8d", "The area of a rectangular table top is **6 m²** and it is **3 m** long. (i) Write the formula. (ii) Find the breadth. (iii) Find the perimeter.", [
            ["(i) Area", "lb", "expr", "A = l × b."], ["(ii) Breadth", 2, "m", "b = 6 ÷ 3 = 2 m."], ["(iii) Perimeter", 10, "m", "2(3 + 2) = 10 m."]])
        ] },
      { id: "q9", title: "From perimeter to area", instruction: "Answer each part.",
        questions: [
          multi("q9a", "The perimeter of a square is **12 cm**. (i) Find its length. (ii) Find its area.", [["(i) Length", 3, "cm", "12 ÷ 4 = 3 cm."], ["(ii) Area", 9, "cm²", "3 × 3 = 9 cm²."]]),
          multi("q9b", "The perimeter of a square field is **60 m**. (i) Write the formula for its perimeter. (ii) Find its length. (iii) Find its area.", [
            ["(i) Perimeter", "4l", "expr", "P = 4l."], ["(ii) Length", 15, "m", "60 ÷ 4 = 15 m."], ["(iii) Area", 225, "m²", "15 × 15 = 225 m²."]]),
          multi("q9c", "The perimeter of a rectangle is **28 cm** and its length is **8 cm**. (i) Find its breadth. (ii) Find its area.", [["(i) Breadth", 6, "cm", "2(8 + b) = 28, so 8 + b = 14 and b = 6 cm."], ["(ii) Area", 48, "cm²", "8 × 6 = 48 cm²."]]),
          multi("q9d", "The perimeter of a rectangular floor is **40 m** and it is **8 m** broad. Find its area.", [["Length", 12, "m", "2(l + 8) = 40, so l + 8 = 20 and l = 12 m."], ["Area", 96, "m²", "12 × 8 = 96 m²."]])
        ] },
      { id: "q10", title: "Length and breadth together", instruction: "Answer each part.",
        questions: [
          multi("q10a", "The area of a rectangle is **18 cm²**. Its length is double its breadth. (i) Find its length and breadth. (ii) Find its perimeter.", [
            ["Breadth", 3, "cm", "Let the breadth be x. Length = 2x. 2x × x = 18, so x² = 9 and x = 3 cm."], ["Length", 6, "cm", "Length = 2 × 3 = 6 cm."], ["(ii) Perimeter", 18, "cm", "2(6 + 3) = 18 cm."]]),
          multi("q10b", "The area of a rectangular floor is **32 m²**. Its breadth is half of its length. Find its perimeter.", [
            ["Length", 8, "m", "Let the length be 2x and the breadth x. 2x × x = 32, so x² = 16 and x = 4. Length = 8 m."], ["Breadth", 4, "m", "Breadth = 4 m."], ["Perimeter", 24, "m", "2(8 + 4) = 24 m."]])
        ] },
      { id: "q11", title: "Shaded regions", instruction: "Creative Section B. Find the area of the shaded regions.",
        questions: [
          shaded("q11a", [{ pts: rect(0, 0, 12, 8), tone: "a" }, { pts: rect(1, 1, 10, 6), tone: "w" }], [["12 cm", 0, 2], ["8 cm", 0, 1], ["10 cm", 1, 2, { in: true }], ["6 cm", 1, 1, { in: true }]], 36,
            ["Big rectangle = 12 × 8 = 96 cm². White rectangle = 10 × 6 = 60 cm².", "Shaded = 96 − 60 = 36 cm²."]),
          shaded("q11b", [{ pts: rect(0, 0, 10, 6), tone: "a" }, { pts: rect(5, 5, 5, 1), tone: "w" }], [["10 cm", 0, 0], ["6 cm", 0, 3], ["5 cm", 1, 2], ["1 cm", 1, 1]], 55,
            ["Big rectangle = 10 × 6 = 60 cm². White corner = 5 × 1 = 5 cm².", "Shaded = 60 − 5 = 55 cm²."]),
          shaded("q11c", [{ pts: rect(0, 0, 7, 9), tone: "a" }, { pts: tilted(3.6, 3.2, 2.4, 1.2, 45), tone: "w" }], [["7 cm", 0, 2], ["9 cm", 0, 1], ["2 cm", 1, 0, { at: [4.75, 2.45] }], ["1 cm", 1, 1, { at: [5.0, 4.45] }]], 61,
            ["Big rectangle = 7 × 9 = 63 cm². White rectangle = 2 × 1 = 2 cm² (turning it does not change its area).", "Shaded = 63 − 2 = 61 cm²."]),
          shaded("q11d", [{ pts: rect(0, 0, 14, 10), tone: "a" }, { pts: rect(2, 8, 6, 2), tone: "w" }], [["14 cm", 0, 0], ["10 cm", 0, 1], ["6 cm", 1, 2], ["2 cm", 1, 1, { in: true }]], 128,
            ["Big rectangle = 14 × 10 = 140 cm². White rectangle = 6 × 2 = 12 cm².", "Shaded = 140 − 12 = 128 cm²."]),
          shaded("q11e", [{ pts: rect(0, 0, 15, 12), tone: "a" }, { pts: rect(0, 5, 15, 2), tone: "w" }], [["15 cm", 0, 2], ["12 cm", 0, 1], ["2 cm", 1, 1, { in: true }]], 150,
            ["Big rectangle = 15 × 12 = 180 cm². White strip = 15 × 2 = 30 cm².", "Shaded = 180 − 30 = 150 cm²."]),
          shaded("q11f", [{ pts: rect(0, 0, 6, 7) }, { pts: [[2, 0], [4, 0], [4, 3], [6, 3], [6, 4], [4, 4], [4, 7], [2, 7], [2, 4], [0, 4], [0, 3], [2, 3]], tone: "a" }],
            [["2 cm", 1, 6, { at: [3, 7.45] }], ["2 cm", 0, 3, { at: [1, 7.45] }], ["2 cm", 0, 3, { at: [5, 7.45] }], ["3 cm", 0, 1, { at: [6.6, 1.5] }], ["1 cm", 0, 1, { at: [6.6, 3.5] }], ["3 cm", 0, 1, { at: [6.6, 5.5] }]], 18,
            ["The square is 2 + 2 + 2 = 6 cm wide and 3 + 1 + 3 = 7 cm tall.", "Upright strip = 2 × 7 = 14 cm². Cross strip = 6 × 1 = 6 cm². The middle 2 × 1 = 2 cm² is counted twice.", "Shaded = 14 + 6 − 2 = 18 cm²."])
        ] },
      { id: "q12", title: "Banners and carpets", instruction: "Answer each part.",
        questions: [
          multi("q12a", "Two banners have equal area. The first banner is **8 ft** long and **3 ft** wide. The second banner is **6 ft** long. (a) Find the area of the first banner. (b) What is the area of the second? (c) Find the width of the second.", [
            ["(a) First", 24, "sq. ft", "8 × 3 = 24 sq. ft."], ["(b) Second", 24, "sq. ft", "The areas are equal: 24 sq. ft."], ["(c) Width", 4, "ft", "24 ÷ 6 = 4 ft."]]),
          multi("q13a", "Mr. Khadka bought two carpets. Carpet X has area **48 sq. ft** and width **6 ft**. The area of carpet Y is half of carpet X. Both have the same length. (a) Find the length of X. (b) Find the area of Y. (c) What is the length of Y? (d) Find the width of Y.", [
            ["(a) Length of X", 8, "ft", "48 ÷ 6 = 8 ft."], ["(b) Area of Y", 24, "sq. ft", "48 ÷ 2 = 24 sq. ft."], ["(c) Length of Y", 8, "ft", "Same length as X: 8 ft."], ["(d) Width of Y", 3, "ft", "24 ÷ 8 = 3 ft."]]),
          multi("q14a", "A rectangle and a square both have perimeter **36 cm**. The rectangle is **12 cm** long. (a) Find the breadth of the rectangle. (b) Find the side of the square. (c) Do they have equal area? (d) Which has more area and by how much?", [
            ["(a) Breadth", 6, "cm", "2(12 + b) = 36, so b = 6 cm."], ["(b) Side", 9, "cm", "4l = 36, so l = 9 cm."], ["(c) Equal area?", "No", "choice", "Rectangle: 12 × 6 = 72 cm². Square: 9 × 9 = 81 cm². Not equal.", ["Yes", "No"]],
            ["(d) Which?", "Square", "choice", "The square has more area.", ["Rectangle", "Square"]], ["By", 9, "cm²", "81 − 72 = 9 cm²."]])
        ] }
    ]
  });
})();
