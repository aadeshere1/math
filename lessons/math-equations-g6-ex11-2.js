/*
  Exercise 11.2: Solving equations.
  Source: Vedanta Excel in Mathematics, Book 6, pages 175-177.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var E = Practice.eq, L = "abcdefghijklmnop";
  function nm(id, label, answer, unit) { var p = { id: id, label: label, type: "number", answer: answer }; if (unit) p.unit = unit; return p; }
  function rel(id, label, answer) { return { id: id, label: label, type: "rel", answer: answer }; }
  // list of [expr, shown] -> questions
  function solveAll(pre, list) {
    return list.map(function (m, i) {
      var expr = m.join ? m[0] : m, shown = m.join ? m[1] : Practice.prettyAlg(m);
      return E.solve(pre + L[i], expr, { prompt: "**" + shown + "**", intro: m.join && m[2] ? [m[2]] : [] });
    });
  }
  function bal(id, left, right, expr) {
    var s = E.solve("t", expr), v = s.value[0], x = E.sides(expr).v;
    return { id: id, prompt: "Make the equation from the balance and solve it. Each bag holds **" + x + "** balls.",
      figure: { type: "balance", left: left, right: right },
      parts: [rel("e", "Equation", expr), nm("v", x + " =", v)],
      help: [{ text: "Each bag is " + x + ". Count the bags and balls on each pan. The pans are level, so the two sides are equal." },
        { text: "Equation: **" + Practice.prettyAlg(expr) + "**." }].concat(s.help.slice(0, -1)).concat([{ text: "Answer: **" + Practice.prettyAlg(expr) + ", " + x + " = " + v + "**." }]) };
  }

  Practice.register({
    id: "math-equations-g6-ex11-2",
    subject: "Mathematics",
    unit: "Equations and inequalities",
    title: "Exercise 11.2",
    topic: "Solving equations",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 175–177",

    reference: {
      title: "Solving an equation",
      columns: ["Step", "Example: 5x − 3 = 3x + 7"],
      rows: [
        ["Bring letter terms to one side (subtract 3x from both sides)", "2x − 3 = 7"],
        ["Bring numbers to the other side (add 3 to both sides)", "2x = 10"],
        ["Divide both sides by the number with x", "x = 5"],
        ["Check: put the value back", "5×5 − 3 = 22 and 3×5 + 7 = 22 ✓"],
        ["Fractions: multiply both sides by the L.C.M. of the denominators", "x/2 + x/3 = 5 → 3x + 2x = 30"],
        ["Mixed numbers: change to improper fractions first", "2 2/3 = 8/3"],
        ["How to type an equation", "2x = x + 4, 3a + 3 = 2a + 5"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick solves", instruction: "Say and write the values as quickly as possible.",
        questions: solveAll("q1", ["x + 5 = 8", "x + 7 = 10", "x + 9 = 14", "y - 2 = 4", "y - 5 = 2", "y - 6 = 6", "3a = 9", "5a = 20", "7a = 28", "p/2 = 5", "p/5 = 4", "p/9 = 6"]) },
      { id: "q2", title: "Solve and check (1)", instruction: "Solve the equations and check the answers.",
        questions: solveAll("q2", ["x + 4 = 9", "x + 8 = 15", "a + 6 = 16", "a - 5 = 4", "y - 6 = 2", "y - 10 = 6", "2x + 3 = x + 6", "3x - 4 = 2x + 5", "9x + 7 = 8x - 3", "5x - 8 = 4x - 3", "8p - 13 = 7p - 5", "5x + 2 = 4x - 7"]) },
      { id: "q3", title: "Solve and check (2)", instruction: "Solve the equations and check the answers.",
        questions: solveAll("q3", ["2x = 6", "3x = 12", "4y = 24", "7y = 42", "6m = 54", "8k = 56", "3p - 1 = p + 7", "5x - 3 = 3x + 7", "4a + 5 = a + 14", "6x + 11 = 3x + 2", "3a + 7 = 7a - 9",
          ["2y + 11 = 9y - 10", "2y + 11 = 9y − 10", "The book prints 9x − 10 here, which looks like a misprint for 9y − 10 (one letter only)."]]) },
      { id: "q4", title: "Equations with fractions", instruction: "Solve the equations.",
        questions: solveAll("q4", ["x/5 = 2", "y/7 = 5", "a/8 = 7", "2x/3 = 8", "3p/5 = 9", "4k/7 = 12", "a/4 = 3/4",
          ["2x/3 = 8/3", "2x/3 = 2 2/3", "Change 2 2/3 to an improper fraction: 2 2/3 = 8/3."],
          "4x/5 + 3 = 7", "5x/6 - 2 = 8",
          ["3a/4 - 1 = 7/2", "3a/4 − 1 = 3 1/2", "Change 3 1/2 to an improper fraction: 3 1/2 = 7/2."],
          ["4x/9 + 2 = 14/3", "4x/9 + 2 = 4 2/3", "Change 4 2/3 to an improper fraction: 4 2/3 = 14/3."]]) },
      { id: "q5", title: "More fractions", instruction: "Solve the equations. Type a fraction like 7/2 if the answer is not whole.",
        questions: solveAll("q5", ["(x + 1)/3 = 2", "(y - 3)/4 = 2", "(2a + 3)/5 = 3", "(3x - 1)/4 = 2", "(x + 1)/4 = 3/2", "(a - 5)/6 = 2/3", "(2x + 1)/3 = (x + 1)/2", "(3x - 2)/4 = (2x + 5)/3", "(2x - 1)/5 = (3x - 2)/7", "x/2 + x/3 = 5", "8x/9 - 2x/3 = 4", "4x/5 - 3x/10 = 2"]) },
      { id: "q6", title: "Balances", instruction: "From these balances, make the equations and solve them. Type the equation like 2x = x + 4.",
        questions: [
          bal("q6a", { bags: 2, v: "x" }, { bags: 1, v: "x", balls: 4 }, "2x = x + 4"),
          bal("q6b", { bags: 3, v: "a", balls: 3 }, { bags: 2, v: "a", balls: 5 }, "3a + 3 = 2a + 5"),
          bal("q6c", { bags: 4, v: "y" }, { bags: 2, v: "y", balls: 6 }, "4y = 2y + 6"),
          bal("q6d", { bags: 5, v: "x", balls: 2 }, { bags: 3, v: "x", balls: 8 }, "5x + 2 = 3x + 8")
        ] },
      { id: "q7", title: "Garden, ground and frame", instruction: "Write an equation, solve it, then answer.",
        questions: [
          { id: "q7a", prompt: "The length of a square garden is **2x metre** and its perimeter is **80 m**. (i) Write an equation for its perimeter. (ii) Find x. (iii) Find the actual length. (iv) Find the actual area.",
            parts: [rel("e", "Equation", "4*2x = 80"), nm("x", "x =", 10), nm("l", "Length", 20, "m"), nm("a", "Area", 400, "m²")],
            help: [{ text: "Perimeter of a square = 4 × length = 4 × 2x = 8x." }, { text: "Equation: **4 × 2x = 80**, that is 8x = 80." }, { text: "Divide both sides by 8: x = 10." },
              { text: "Length = 2x = 2 × 10 = 20 m." }, { text: "Area = length × length = 20 × 20 = 400 m²." }, { text: "Answer: **8x = 80, x = 10, length 20 m, area 400 m²**." }] },
          { id: "q7b", prompt: "The length of a rectangular ground is **(x + 2) m**, its breadth is **(x − 8) m** and its perimeter is **180 m**. (i) Write an equation for its perimeter. (ii) Find x. (iii) Find the actual length and breadth. (iv) Find the area.",
            parts: [rel("e", "Equation", "2(x + 2 + x - 8) = 180"), nm("x", "x =", 48), nm("l", "Length", 50, "m"), nm("b", "Breadth", 40, "m"), nm("a", "Area", 2000, "m²")],
            help: [{ text: "Perimeter of a rectangle = 2(l + b) = 2(x + 2 + x − 8)." }, { text: "Equation: **2(x + 2 + x − 8) = 180**, that is 2(2x − 6) = 180, so 4x − 12 = 180." },
              { text: "Add 12 to both sides: 4x = 192. Divide by 4: x = 48." }, { text: "Length = 48 + 2 = 50 m, breadth = 48 − 8 = 40 m." }, { text: "Area = 50 × 40 = 2000 m²." },
              { text: "Answer: **x = 48, length 50 m, breadth 40 m, area 2000 m²**." }] },
          { id: "q7c", prompt: "The area of a rectangular photo frame is **42 cm²**. Its length is **(x + 2) cm** and breadth is **6 cm**. (i) Make an equation for the area. (ii) Find x. (iii) Find the actual length. (iv) Find the perimeter.",
            parts: [rel("e", "Equation", "6(x + 2) = 42"), nm("x", "x =", 5), nm("l", "Length", 7, "cm"), nm("p", "Perimeter", 26, "cm")],
            help: [{ text: "Area = length × breadth = (x + 2) × 6." }, { text: "Equation: **6(x + 2) = 42**." }, { text: "Divide both sides by 6: x + 2 = 7. Subtract 2: x = 5." },
              { text: "Length = 5 + 2 = 7 cm." }, { text: "Perimeter = 2(l + b) = 2(7 + 6) = 26 cm." }, { text: "Answer: **x = 5, length 7 cm, perimeter 26 cm**." }] }
        ] }
    ]
  });
})();
