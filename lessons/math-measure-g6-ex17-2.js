/*
  Exercise 17.2: Perimeter of plane figures.
  Source: Vedanta Excel in Mathematics, Book 6, pages 250-252.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop";
  function r2(v) { return Math.round(v * 100) / 100; }
  function nm(id, label, answer, unit) { return { id: id, label: label, type: "number", answer: r2(answer), unit: unit }; }
  function ex(id, label, answer, accept) { return { id: id, label: label, type: "expr", form: "any", answer: answer, example: answer }; }
  function rect(w, h) { return [[0, 0], [w, 0], [w, h], [0, h]]; }
  function fig(pts, sides, more) { var f = { type: "shape", polys: [{ pts: pts, tone: "a" }], sides: sides.map(function (s) { return [s[1], 0, s[0]]; }) }; for (var k in more || {}) f[k] = more[k]; return f; }
  function per(id, prompt, figure, ans, steps, unit) {
    return { id: id, prompt: prompt, figure: figure, parts: [nm("v", "Perimeter", ans, unit || "cm")],
      help: steps.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + r2(ans) + " " + (unit || "cm") + "**." }]) };
  }
  function multi(id, prompt, rows, figure) { // rows: [label, value, unit, step], [label, exprAnswer, "expr", step] or [label, answer, "choice", step, options]
    var q = { id: id, prompt: prompt, parts: rows.map(function (r, i) { return r[2] === "expr" ? ex(L[i], r[0], r[1]) : r[2] === "choice" ? { id: L[i], label: r[0], type: "choice", options: r[4], answer: r[1] } : nm(L[i], r[0], r[1], r[2]); }),
      help: rows.map(function (r) { return { text: r[3] }; }).concat([{ text: "Answer: **" + rows.map(function (r) { return r[2] === "expr" || r[2] === "choice" ? r[1] : r2(r[1]) + " " + r[2]; }).join(", ") + "**." }]) };
    if (figure) q.figure = figure;
    return q;
  }
  function sq(i, l) { return per("q4b" + (i + 1), "Find the perimeter of a square of side **l = " + l + " cm**.", null, 4 * l, ["Perimeter of a square = 4l = 4 × " + l + " = " + r2(4 * l) + " cm."]); }
  function tri(i, l) { return per("q4a" + (i + 1), "Find the perimeter of an equilateral triangle of side **l = " + l + " cm**.", null, 3 * l, ["All 3 sides are equal, so perimeter = 3l = 3 × " + l + " = " + r2(3 * l) + " cm."]); }
  function rc(i, l, b) { return per("q4c" + (i + 1), "Find the perimeter of a rectangle with **l = " + l + " cm** and **b = " + b + " cm**.", null, 2 * (l + b), ["Perimeter of a rectangle = 2(l + b) = 2(" + l + " + " + b + ") = 2 × " + r2(l + b) + " = " + r2(2 * (l + b)) + " cm."]); }
  function poly(i, name, n, l) { return per("q4d" + (i + 1), "Find the perimeter of a regular **" + name + "** with each side **l = " + l + " cm**.", null, n * l, [(name === "octagon" ? "An " : "A ") + name + " has " + n + " equal sides, so perimeter = " + n + " × " + l + " = " + r2(n * l) + " cm."]); }

  Practice.register({
    id: "math-measure-g6-ex17-2",
    subject: "Mathematics",
    unit: "Perimeter, Area and Volume",
    title: "Exercise 17.2",
    topic: "Perimeter",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 250–252",

    reference: {
      title: "Perimeter",
      columns: ["Shape", "Perimeter"],
      rows: [
        ["Any shape", "add the lengths of all its sides"],
        ["Triangle with sides a, b, c", "a + b + c"],
        ["Equilateral triangle, side l", "3l"],
        ["Square, side l", "4l"],
        ["Rectangle, length l, breadth b", "2(l + b)"],
        ["Regular polygon with n sides of length l", "n × l"],
        ["Side of a square from its perimeter", "l = P ÷ 4"],
        ["Breadth of a rectangle from its perimeter", "b = P ÷ 2 − l"],
        ["How to type a formula", "4l, 2(l + b), x + y + z"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick perimeters", instruction: "Say and write the perimeters of these figures as quickly as possible.",
        questions: [
          per("q1a", "Find the perimeter.", fig([[0, 2.4], [5, 2.4], [1.8, 0]], [[0, "5 cm"], [1, "4 cm"], [2, "3 cm"]]), 12, ["Add the three sides: 3 + 4 + 5 = 12 cm."]),
          per("q1b", "Find the perimeter.", fig(rect(3, 3), [[0, "3 cm"], [1, "3 cm"], [2, "3 cm"], [3, "3 cm"]]), 12, ["3 + 3 + 3 + 3 = 12 cm (or 4 × 3)."]),
          per("q1c", "Find the perimeter.", fig(rect(7, 3), [[0, "7 cm"], [1, "3 cm"], [2, "7 cm"], [3, "3 cm"]]), 20, ["7 + 3 + 7 + 3 = 20 cm (or 2 × (7 + 3))."])
        ] },
      { id: "q2", title: "Perimeter formulas", instruction: "Say and write the answers. Type formulas like 4l or 2(l + b).",
        questions: [
          multi("q2a", "If the sides of a triangle are x cm, y cm and z cm, its perimeter = …", [["Perimeter", "x + y + z", "expr", "Add the three sides."]]),
          multi("q2b", "If each side of a square is l cm, its perimeter = …", [["Perimeter", "4l", "expr", "Four equal sides: l + l + l + l = 4l."]]),
          multi("q2c", "If the length and breadth of a rectangle are l cm and b cm, its perimeter = …", [["Perimeter", "2(l + b)", "expr", "l + b + l + b = 2l + 2b = 2(l + b)."]]),
          multi("q2d", "If each side of a polygon is l cm and the number of sides is n, the perimeter = …", [["Perimeter", "nl", "expr", "n sides, each l long: n × l = nl."]]),
          multi("q2e", "If each side of a regular octagon is l, its perimeter = …", [["Perimeter", "8l", "expr", "An octagon has 8 equal sides: 8 × l = 8l."]])
        ] },
      { id: "q3", title: "Perimeters of figures", instruction: "Creative Section A. Find the perimeters of these figures.",
        questions: [
          per("q3a", "Find the perimeter.", fig([[0, 1.45], [4, 1.45], [1.375, 0]], [[0, "4 cm"], [1, "3 cm"], [2, "2 cm"]]), 9, ["2 + 3 + 4 = 9 cm."]),
          per("q3b", "The marks show all three sides are equal. Find the perimeter.", fig([[0, 3.46], [4, 3.46], [2, 0]], [[0, "4 cm"]], { ticks: [[0, 0, 1], [0, 1, 1], [0, 2, 1]] }), 12, ["The marks show it is an equilateral triangle, so every side is 4 cm.", "Perimeter = 3 × 4 = 12 cm."]),
          per("q3c", "The marked sides are equal. Find the perimeter.", fig([[0, 3.12], [5, 3.12], [2.5, 0]], [[0, "5 cm"], [1, "4 cm"]], { ticks: [[0, 1, 1], [0, 2, 1]] }), 13, ["The two marked sides are equal, so both are 4 cm.", "Perimeter = 4 + 4 + 5 = 13 cm."]),
          per("q3d", "Find the perimeter.", fig([[0, 4], [6, 4], [5, 0], [0, 3]], [[0, "6 cm"], [1, "5 cm"], [2, "4 cm"], [3, "1 cm"]]), 16, ["1 + 4 + 5 + 6 = 16 cm."]),
          per("q3e", "Find the perimeter.", fig([[1, 0], [5, 3], [3, 2.6], [2, 3.3], [0, 2.2]], [[0, "4 cm"], [1, "2 cm"], [2, "1 cm"], [3, "1.5 cm"], [4, "2.5 cm"]]), 11, ["2.5 + 4 + 2 + 1 + 1.5 = 11 cm."]),
          per("q3f", "Find the perimeter.", fig([[0, 0], [2, 0], [2, 2], [4, 2], [4, 3], [0, 3]], [[0, "2 cm"], [3, "1 cm"], [4, "4 cm"], [5, "3 cm"]]), 14,
            ["Two sides are not marked. The step down: 3 − 1 = 2 cm. The step across: 4 − 2 = 2 cm.", "Perimeter = 2 + 2 + 2 + 1 + 4 + 3 = 14 cm."]),
          per("q3g", "Find the perimeter.", fig([[0, 0], [7, 0], [7, 5], [5, 5], [5, 4], [2, 4], [2, 5], [0, 5]], [[0, "7 cm"], [7, "5 cm"], [6, "2 cm"], [5, "1 cm"], [2, "2 cm"]]), 26,
            ["The right side is 5 cm, like the left. The gap at the bottom is 7 − 2 − 2 = 3 cm wide, and both sides of the gap are 1 cm.", "Perimeter = 7 + 5 + 2 + 1 + 3 + 1 + 2 + 5 = 26 cm."]),
          per("q3h", "Find the perimeter.", fig([[0, 0], [4, 0], [4, 2], [6, 2], [6, 4], [8, 4], [8, 6], [0, 6]], [[0, "4 cm"], [4, "2 cm"], [5, "2 cm"], [6, "8 cm"], [7, "6 cm"]]), 28,
            ["The steps go up and across. Push them out and they make a full rectangle 8 cm by 6 cm with the same perimeter.", "Perimeter = 2(8 + 6) = 28 cm."])
        ] },
      { id: "q4", title: "Use the formulas", instruction: "Find the perimeters.",
        questions: [tri(0, 5), tri(1, 4.5), tri(2, 2.6), sq(0, 4), sq(1, 6.5), sq(2, 7.2), rc(0, 5.5, 4), rc(1, 6.3, 4.7), rc(2, 7.8, 4.7), poly(0, "pentagon", 5, 3), poly(1, "hexagon", 6, 4.5), poly(2, "octagon", 8, 6.5)] },
      { id: "q5", title: "Going round", instruction: "Find the distance in one round.",
        questions: [
          per("q5a", "A square field is **20 m** long. If you are running around it, how many metres do you travel in one round?", null, 80, ["One round = perimeter = 4 × 20 = 80 m."], "m"),
          per("q5b", "A rectangular garden is **35 m** long and **25 m** broad. How many metres does a girl cover in one complete round?", null, 120, ["One round = 2(l + b) = 2(35 + 25) = 2 × 60 = 120 m."], "m")
        ] },
      { id: "q6", title: "Park and ground", instruction: "Answer each part.",
        questions: [
          multi("q6a", "A square park is **80 m** long. (i) Write the formula for the perimeter of a square. (ii) Find the perimeter. (iii) How many metres of wire are needed to fence it with 5 rounds?", [
            ["(i) Perimeter", "4l", "expr", "Perimeter of a square = 4l."], ["(ii) Perimeter", 320, "m", "4 × 80 = 320 m."], ["(iii) Wire", 1600, "m", "5 rounds = 5 × 320 = 1600 m."]]),
          multi("q6b", "You are running around a rectangular ground of length **42 m** and breadth **24 m**. (i) Write the formula for the perimeter of a rectangle. (ii) Find the perimeter. (iii) How many metres do you cover in 6 rounds?", [
            ["(i) Perimeter", "2(l + b)", "expr", "Perimeter of a rectangle = 2(l + b)."], ["(ii) Perimeter", 132, "m", "2(42 + 24) = 2 × 66 = 132 m."], ["(iii) 6 rounds", 792, "m", "6 × 132 = 792 m."]])
        ] },
      { id: "q7", title: "Work backwards", instruction: "Find the missing side.",
        questions: [
          multi("q7a", "If the perimeter of a square is **84 cm**, find its length.", [["Length", 21, "cm", "4l = 84, so l = 84 ÷ 4 = 21 cm."]]),
          multi("q7b", "The perimeter of a rectangle is **56 cm** and its length is **18 cm**. Find its breadth.", [["Breadth", 10, "cm", "2(18 + b) = 56, so 18 + b = 28 and b = 10 cm."]]),
          multi("q7c", "A rectangular compound is **32 m** broad and its perimeter is **144 m**. Find its length.", [["Length", 40, "m", "2(l + 32) = 144, so l + 32 = 72 and l = 40 m."]])
        ] },
      { id: "q8", title: "Sides in a ratio", instruction: "Creative Section B.",
        questions: [
          multi("q8a", "Anuradha has drawn a triangle whose sides are in the ratio **2 : 3 : 4** and perimeter is **18 cm**. Find (i) the length of each side (ii) the difference between the longest and shortest sides.", [
            ["Shortest side", 4, "cm", "Let the sides be 2x, 3x and 4x. 2x + 3x + 4x = 18, so 9x = 18 and x = 2."], ["Middle side", 6, "cm", "3x = 3 × 2 = 6 cm. 2x = 4 cm."], ["Longest side", 8, "cm", "4x = 4 × 2 = 8 cm."], ["(ii) Difference", 4, "cm", "8 − 4 = 4 cm."]]),
          multi("q8b", "The sides of a triangular garden are in the ratio **4 : 5 : 2**. If the perimeter is **110 m**, find (i) the length of each side (ii) the length of wire needed to fence it with 3 rounds.", [
            ["Side (4 parts)", 40, "m", "Let the sides be 4x, 5x and 2x. 11x = 110, so x = 10."], ["Side (5 parts)", 50, "m", "5x = 50 m."], ["Side (2 parts)", 20, "m", "4x = 40 m, 2x = 20 m."], ["(ii) Wire", 330, "m", "3 rounds = 3 × 110 = 330 m."]])
        ] },
      { id: "q9", title: "Square or rectangle?", instruction: "Four square papers of side 1 ft are arranged in two ways.",
        questions: [
          multi("q9a", "Samriddhi arranges 4 square papers (each 1 ft) as a **square**; Saurav arranges them as a **rectangle**, in one row. (a) Write the formula for the perimeter of a square and of a rectangle. (b) Find the perimeter of the square arrangement. (c) Find the perimeter of the rectangle arrangement. (d) Which has more perimeter and by how much?", [
            ["Square formula", "4l", "expr", "Square: P = 4l. Rectangle: P = 2(l + b)."], ["Rectangle formula", "2(l + b)", "expr", "Rectangle: 2(l + b)."],
            ["(b) Square", 8, "ft", "The square is 2 ft by 2 ft: 4 × 2 = 8 ft."], ["(c) Rectangle", 10, "ft", "The rectangle is 4 ft by 1 ft: 2(4 + 1) = 10 ft."], ["(d) More by", 2, "ft", "The rectangle has more perimeter, by 10 − 8 = 2 ft."]],
            { type: "shape", polys: [{ pts: rect(2, 2), tone: "a" }, { pts: [[3, 1], [7, 1], [7, 2], [3, 2]], tone: "b" }], dashes: [[1, 0, 1, 2], [0, 1, 2, 1], [4, 1, 4, 2], [5, 1, 5, 2], [6, 1, 6, 2]],
              text: [[1, -0.35, "Samriddhi"], [5, 0.6, "Saurav"]] })
        ] },
      { id: "q10", title: "Re-bending wire", instruction: "The same wire keeps the same length, so the perimeter stays the same.",
        questions: [
          multi("q10a", "A wire is in the shape of a rectangle **6 cm** long and **4 cm** broad. The same wire is re-bent into a square. (i) What is the perimeter of the rectangle? (ii) Is it equal to the perimeter of the square? (iii) Find each side of the square.", [
            ["(i) Perimeter", 20, "cm", "2(6 + 4) = 20 cm."], ["(ii) Equal?", "Yes", "choice", "Yes. It is the same wire, so the square's perimeter is also 20 cm.", ["Yes", "No"]], ["(iii) Side of square", 5, "cm", "Side = 20 ÷ 4 = 5 cm."]],
            { type: "shape", polys: [{ pts: rect(6, 4), tone: "a" }], sides: [["6 cm", 0, 0], ["4 cm", 0, 1]] }),
          multi("q10b", "A rope is in a square shape with each side **6 cm**. If the same rope is re-bent into a rectangle **8 cm** long, what is its breadth?", [
            ["Breadth", 4, "cm", "Perimeter = 4 × 6 = 24 cm. For the rectangle: 2(8 + b) = 24, so 8 + b = 12 and b = 4 cm."]])
        ] }
    ]
  });
})();
