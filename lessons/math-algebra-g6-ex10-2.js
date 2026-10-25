/*
  Exercise 10.2: Evaluation of algebraic expressions (putting numbers in place of letters).
  Source: Vedanta Excel in Mathematics, Book 6, pages 150-151.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function nm(id, label, answer, unit) { return { id: id, label: label, type: "number", answer: answer, unit: unit }; }
  function ex(id, label, answer, form) { return { id: id, label: label, type: "expr", answer: answer, form: form }; }
  function ask(answer) { return { type: "number", answer: answer }; }

  function row(x) {
    return { id: "q1x" + x, prompt: "Input **x = " + x + "**. Find each output.",
      parts: [nm("a", "x + 1 =", x + 1), nm("b", "x + 5 =", x + 5), nm("c", "2x =", 2 * x), nm("d", "3x =", 3 * x)],
      help: [{ text: "Put " + x + " in place of x every time." }, { text: "x + 1 = " + x + " + 1. 2x means 2 × x = 2 × " + x + "." },
             { text: "Answer: " + (x + 1) + ", " + (x + 5) + ", " + 2 * x + ", " + 3 * x + "." }] };
  }
  // one question for each value in a list, e.g. squares with l = 4, 7, 3.5, 4.2
  function many(idp, intro, unit, list, f, how) {
    return list.map(function (v, i) {
      var r = f.apply(null, v);
      return { id: idp + (i + 1), prompt: intro + " " + v.label, parts: [nm("v", "Answer", r, unit)],
        help: [{ text: how.apply(null, v) }, { text: "Answer: **" + r + " " + unit + "**." }] };
    });
  }
  function L(label) { var a = Array.prototype.slice.call(arguments, 1); a.label = label; return a; }
  function r2(n) { return Math.round(n * 100) / 100; }

  Practice.register({
    id: "math-algebra-g6-ex10-2",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.2",
    topic: "Evaluating expressions and formulas",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 150–151",

    reference: {
      title: "Evaluating",
      columns: ["Idea", "Example"],
      rows: [
        ["Put the number in place of the letter", "If x = 2, 4x = 4 × 2 = 8"],
        ["Letters side by side are multiplied", "2xy = 2 × x × y"],
        ["Do brackets first", "2(x + y) = 2(2 + 3) = 10"],
        ["A minus number in brackets", "If x = −1, x − y = −1 − 2 = −3"],
        ["Square means times itself", "(ab)² = ab × ab"],
        ["π = 22/7", "Use it for circle area πr² and circumference 2πr"]
      ]
    },

    sections: [
      { id: "q1", title: "Input and output", instruction: "Input x = 1, 2, 3, … Then say and write the outputs.",
        questions: [row(1), row(2), row(3), row(4), row(5)] },
      {
        id: "q2", title: "Quick values", instruction: "Say and write the values as quickly as possible.",
        questions: [
          { id: "q2a", prompt: "If x = 2 and y = 3, find 4x, 5y and 2xy.", parts: [nm("a", "4x =", 8), nm("b", "5y =", 15), nm("c", "2xy =", 12)],
            help: [{ text: "4x = 4 × 2 = 8 and 5y = 5 × 3 = 15." }, { text: "2xy = 2 × 2 × 3 = ?", ask: ask(12) }] },
          { id: "q2b", prompt: "If x = −1 and y = 2, find x + y and x − y.", parts: [nm("a", "x + y =", 1), nm("b", "x − y =", -3)],
            help: [{ text: "x + y = −1 + 2. Start at −1 and move 2 up the number line: 1." }, { text: "x − y = −1 − 2. Start at −1 and move 2 down: ?", ask: ask(-3) }] },
          { id: "q2c", prompt: "If a = 3 and b = 2, find (ab)² and (a + b)².", parts: [nm("a", "(ab)² =", 36), nm("b", "(a + b)² =", 25)],
            help: [{ text: "ab = 3 × 2 = 6, so (ab)² = 6 × 6 = 36." }, { text: "a + b = 5, so (a + b)² = 5 × 5 = ?", ask: ask(25) }] },
          { id: "q2d", prompt: "If l = 5 and b = 4, find l × b and 2(l + b).", parts: [nm("a", "l × b =", 20), nm("b", "2(l + b) =", 18)],
            help: [{ text: "l × b = 5 × 4 = 20." }, { text: "l + b = 9, so 2(l + b) = 2 × 9 = ?", ask: ask(18) }] }
        ]
      },
      {
        id: "q3", title: "Replace one letter", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          { id: "q3a", prompt: "If x = 2y, write x + y in terms of y.", parts: [ex("v", "x + y =", "3y")],
            help: [{ text: "Put 2y in place of x: x + y = 2y + y." }, { text: "2y + y = 3y (2 y's and 1 more y)." }] },
          { id: "q3b", prompt: "If x = 3y, write 2xy in terms of y.", parts: [ex("v", "2xy =", "6y^2")],
            help: [{ text: "Put 3y in place of x: 2xy = 2 × 3y × y." }, { text: "2 × 3 = 6 and y × y = y², so 2xy = 6y². Type 6y^2." }] },
          { id: "q3c", prompt: "If a = 2b and b = 3, find a + b.", parts: [nm("v", "a + b =", 9)],
            help: [{ text: "a = 2 × 3 = 6." }, { text: "a + b = 6 + 3 = ?", ask: ask(9) }] },
          { id: "q3d", prompt: "If p = 3q and q = 2, find p − q.", parts: [nm("v", "p − q =", 4)],
            help: [{ text: "p = 3 × 2 = 6." }, { text: "p − q = 6 − 2 = ?", ask: ask(4) }] }
        ]
      },
      {
        id: "q4", title: "Evaluate", instruction: "If x = 2, y = 3 and z = 4, evaluate each expression.",
        questions: [
          { id: "q4a", prompt: "x + y + z", parts: [nm("v", "=", 9)], help: [{ text: "2 + 3 + 4 = ?", ask: ask(9) }] },
          { id: "q4b", prompt: "2x + 3y − z", parts: [nm("v", "=", 9)], help: [{ text: "2 × 2 + 3 × 3 − 4 = 4 + 9 − 4" }, { text: "= ?", ask: ask(9) }] },
          { id: "q4c", prompt: "3(x − y + z)", parts: [nm("v", "=", 9)], help: [{ text: "Brackets first: 2 − 3 + 4 = 3." }, { text: "3 × 3 = ?", ask: ask(9) }] },
          { id: "q4d", prompt: "5xy", parts: [nm("v", "=", 30)], help: [{ text: "5 × 2 × 3 = ?", ask: ask(30) }] },
          { id: "q4e", prompt: "x² + y²", parts: [nm("v", "=", 13)], help: [{ text: "x² = 2 × 2 = 4 and y² = 3 × 3 = 9." }, { text: "4 + 9 = ?", ask: ask(13) }] },
          { id: "q4f", prompt: "y² + z² − x²", parts: [nm("v", "=", 21)], help: [{ text: "9 + 16 − 4" }, { text: "= ?", ask: ask(21) }] },
          { id: "q4g", prompt: "(x + 2y) ÷ z", parts: [nm("v", "=", 2)], help: [{ text: "Top: 2 + 2 × 3 = 8." }, { text: "8 ÷ 4 = ?", ask: ask(2) }] },
          { id: "q4h", prompt: "(x − y + z)² ÷ y", parts: [nm("v", "=", 3)], help: [{ text: "x − y + z = 2 − 3 + 4 = 3." }, { text: "3² = 9, and 9 ÷ 3 = ?", ask: ask(3) }] }
        ]
      },
      {
        id: "q5", title: "Shapes for numbers", instruction: "If △ = 3, □ = 4 and ⬠ = 5, find the values.",
        questions: [
          { id: "q5a", prompt: "2△ − □", parts: [nm("v", "=", 2)], help: [{ text: "2 × 3 − 4 = ?", ask: ask(2) }] },
          { id: "q5b", prompt: "3△ + 2□ − ⬠", parts: [nm("v", "=", 12)], help: [{ text: "3 × 3 + 2 × 4 − 5 = 9 + 8 − 5" }, { text: "= ?", ask: ask(12) }] },
          { id: "q5c", prompt: "△(□ + ⬠)", parts: [nm("v", "=", 27)], help: [{ text: "Brackets first: 4 + 5 = 9." }, { text: "3 × 9 = ?", ask: ask(27) }] },
          { id: "q5d", prompt: "(□ + ⬠) ÷ △", parts: [nm("v", "=", 3)], help: [{ text: "4 + 5 = 9." }, { text: "9 ÷ 3 = ?", ask: ask(3) }] }
        ]
      },
      {
        id: "q6", title: "Squares", instruction: "Area of a square = l². Perimeter of a square = 4l.",
        questions: [].concat(
          many("q6a", "Find the **area** of the square with", "sq. cm", [L("l = 4 cm", 4), L("l = 7 cm", 7), L("l = 3.5 cm", 3.5), L("l = 4.2 cm", 4.2)],
            function (l) { return r2(l * l); }, function (l) { return "Area = l × l = " + l + " × " + l + "."; }),
          many("q6b", "Find the **perimeter** of the square with", "cm", [L("l = 6 cm", 6), L("l = 9 cm", 9), L("l = 8.5 cm", 8.5), L("l = 4.3 cm", 4.3)],
            function (l) { return r2(4 * l); }, function (l) { return "Perimeter = 4 × " + l + "."; }))
      },
      {
        id: "q7", title: "Rectangles", instruction: "Area of a rectangle = l × b. Perimeter = 2(l + b).",
        questions: [].concat(
          many("q7a", "Find the **area** of the rectangle with", "sq. cm", [L("l = 7 cm, b = 4 cm", 7, 4), L("l = 8 cm, b = 6 cm", 8, 6), L("l = 7.5 cm, b = 4 cm", 7.5, 4)],
            function (l, b) { return r2(l * b); }, function (l, b) { return "Area = " + l + " × " + b + "."; }),
          many("q7b", "Find the **perimeter** of the rectangle with", "cm", [L("l = 6 cm, b = 4 cm", 6, 4), L("l = 9 cm, b = 5 cm", 9, 5), L("l = 6.4 cm, b = 3.7 cm", 6.4, 3.7)],
            function (l, b) { return r2(2 * (l + b)); }, function (l, b) { return "l + b = " + r2(l + b) + ". Perimeter = 2 × " + r2(l + b) + "."; }))
      },
      {
        id: "q8", title: "Four walls", instruction: "The area of the four walls of a room = 2h(l + b).",
        questions: many("q8", "Find the area of the four walls when", "sq. m", [L("l = 10 m, b = 8 m, h = 5 m", 10, 8, 5), L("l = 12 m, b = 7.5 m, h = 4 m", 12, 7.5, 4)],
          function (l, b, h) { return r2(2 * h * (l + b)); }, function (l, b, h) { return "l + b = " + r2(l + b) + ". Then 2 × " + h + " × " + r2(l + b) + "."; })
      },
      {
        id: "q9", title: "Circles", instruction: "Area of a circle = πr². Perimeter (circumference) = 2πr. Use π = 22/7.",
        questions: [].concat(
          many("q9a", "Find the **area** of the circle with", "sq. cm", [L("r = 7 cm", 7), L("r = 14 cm", 14), L("r = 21 cm", 21)],
            function (r) { return r2(22 / 7 * r * r); }, function (r) { return "Area = 22/7 × " + r + " × " + r + ". Cancel 7 first: 22 × " + r / 7 + " × " + r + "."; }),
          many("q9b", "Find the **perimeter** of the circle with", "cm", [L("r = 7 cm", 7), L("r = 14 cm", 14), L("r = 21 cm", 21)],
            function (r) { return r2(2 * 22 / 7 * r); }, function (r) { return "Perimeter = 2 × 22/7 × " + r + " = 2 × 22 × " + r / 7 + "."; }))
      },
      {
        id: "q10", title: "Cubes", instruction: "Volume of a cube = l³. Area (all 6 faces) = 6l².",
        questions: [].concat(
          many("q10a", "Find the **volume** of the cube with", "cubic cm", [L("l = 2 cm", 2), L("l = 4 cm", 4), L("l = 5 cm", 5)],
            function (l) { return l * l * l; }, function (l) { return "l³ = " + l + " × " + l + " × " + l + "."; }),
          many("q10b", "Find the **area** of the cube with", "sq. cm", [L("l = 3 cm", 3), L("l = 5 cm", 5), L("l = 6 cm", 6)],
            function (l) { return 6 * l * l; }, function (l) { return "l² = " + l * l + ". Then 6 × " + l * l + "."; }))
      },
      {
        id: "q11", title: "Cuboids", instruction: "Volume of a cuboid = l × b × h. Area = 2(lb + bh + lh).",
        questions: [].concat(
          many("q11a", "Find the **volume** of the cuboid with", "cubic cm", [L("l = 5 cm, b = 4 cm, h = 3 cm", 5, 4, 3), L("l = 10 cm, b = 7 cm, h = 5.5 cm", 10, 7, 5.5)],
            function (l, b, h) { return r2(l * b * h); }, function (l, b, h) { return "V = " + l + " × " + b + " × " + h + "."; }),
          many("q11b", "Find the **area** of the cuboid with", "sq. cm", [L("l = 8 cm, b = 5 cm, h = 2 cm", 8, 5, 2), L("l = 10 cm, b = 6 cm, h = 4 cm", 10, 6, 4)],
            function (l, b, h) { return 2 * (l * b + b * h + l * h); },
            function (l, b, h) { return "lb = " + l * b + ", bh = " + b * h + ", lh = " + l * h + ". Add them, then double."; }))
      }
    ]
  });
})();
