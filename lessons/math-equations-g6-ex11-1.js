/*
  Exercise 11.1: Open statements and simple equations.
  Source: Vedanta Excel in Mathematics, Book 6, pages 171-173.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var E = Practice.eq, L = "abcdefghijklmnop";
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function rel(id, label, answer) { return { id: id, label: label, type: "rel", answer: answer }; }
  function tfo(id, text, ans, why) {
    return { id: id, prompt: text, parts: [ch("v", "It is a … statement.", ["true", "false", "open"], ans)],
      help: [{ text: "A statement with a letter whose value is not given is **open**. If all the numbers are known, check whether it is right (true) or wrong (false)." }, { text: why }, { text: "Answer: **" + ans + " statement**." }] };
  }
  function blank(id, text, ans, why) {
    return { id: id, prompt: text.replace("□", "**□**"), parts: [nm("v", "□ =", ans)], help: [{ text: why }, { text: "Answer: **" + ans + "**." }] };
  }
  // quick solve: "x + 4 = 7" with a one-step reason
  function quick(id, expr, prompt, how) {
    var q = E.solve(id, expr, { prompt: prompt, check: true });
    if (how) q.help.unshift({ text: how });
    return q;
  }
  var A = [1, 2, 3, 4, 5];
  function tryAll(id, expr) {
    var sides = E.sides(expr), F = Practice.fr, x = sides.v, sol = null, lhs = expr.split("=")[0].trim(), rhs = F.str(F.add(F.mul(sides.c, [0, 1]), sides.d));
    var lines = A.map(function (n) {
      var l = F.add(F.mul(sides.a, [n, 1]), sides.b), ok = l[0] * sides.d[1] === sides.d[0] * l[1] && !sides.c[0], lv = F.str(l).replace("-", "−");
      if (ok) sol = n;
      var shown = Practice.prettyAlg(lhs.replace(/(\d)([a-z])/g, "$1*$2")).replace(new RegExp(x, "g"), n).replace(/\*/g, " × ").replace(/(\S)×(\S)/g, "$1 × $2");
      return x + " = " + n + ": " + shown + " = " + lv + (ok ? " = " + rhs + " ✓ **true**" : ", not " + rhs + " ✗ false");
    });
    return { id: id, prompt: "Replace " + x + " by each element of A = {1, 2, 3, 4, 5} in **" + Practice.prettyAlg(expr) + "**. Which one makes it true?",
      parts: [nm("v", x + " =", sol)], help: lines.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + x + " = " + sol + "**." }]) };
  }

  Practice.register({
    id: "math-equations-g6-ex11-1",
    subject: "Mathematics",
    unit: "Equations and inequalities",
    title: "Exercise 11.1",
    topic: "Open statements and equations",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 171–173",

    reference: {
      title: "Equations",
      columns: ["Idea", "Example"],
      rows: [
        ["True statement: right as it stands", "The sum of 3 and 5 is 8."],
        ["False statement: wrong as it stands", "The product of 8 and 3 is 25."],
        ["Open statement: has a letter whose value is unknown", "x + 2 = 5"],
        ["An equation is an open statement with =", "3y = 18"],
        ["Add the same number to both sides", "x − 6 = 3 → x − 6 + 6 = 3 + 6 → x = 9"],
        ["Subtract the same number from both sides", "y + 3 = 7 → y = 7 − 3 = 4"],
        ["Multiply both sides by the same number", "a/2 = 3 → a = 3 × 2 = 6"],
        ["Divide both sides by the same number", "2x = 6 → x = 6 ÷ 2 = 3"],
        ["How to type", "Equations like x + 5 = 9, 7x = 21, x/2 = 5."]
      ]
    },

    sections: [
      { id: "q1", title: "True, false or open?", instruction: "Say and write.",
        questions: [
          tfo("q1a", "The sum of 3 and 5 is 8.", "true", "3 + 5 = 8. That is right."),
          tfo("q1b", "The product of 8 and 3 is 25.", "false", "8 × 3 = 24, not 25."),
          tfo("q1c", "The difference between x and 2 is 7.", "open", "We do not know x, so we cannot say yet."),
          tfo("q1d", "3 times y is 18.", "open", "We do not know y."),
          tfo("q1e", "If x = 5, then x² = 25.", "true", "x is given: 5² = 5 × 5 = 25."),
          tfo("q1f", "a + 6 = 9", "open", "We do not know a."),
          tfo("q1g", "x + 8 = 10, if x = 2.", "true", "2 + 8 = 10."),
          tfo("q1h", "2x = 6, if x = 4.", "false", "2 × 4 = 8, not 6.")
        ] },
      { id: "q2", title: "Fill the circle", instruction: "Find the number that makes the statement true.",
        questions: [
          blank("q2a", "The sum of □ and 6 is 9.", 3, "□ + 6 = 9, so □ = 9 − 6 = 3."),
          blank("q2b", "The difference of □ and 5 is 7.", 12, "□ − 5 = 7, so □ = 7 + 5 = 12."),
          blank("q2c", "The product of □ and 4 is 40.", 10, "□ × 4 = 40, so □ = 40 ÷ 4 = 10."),
          blank("q2d", "The quotient of 42 divided by □ is 6.", 7, "42 ÷ □ = 6, so □ = 42 ÷ 6 = 7."),
          blank("q2e", "□ is greater than 5 by 2.", 7, "□ = 5 + 2 = 7."),
          blank("q2f", "□ is less than 6 by 3.", 3, "□ = 6 − 3 = 3."),
          blank("q2g", "5 + □ = 8", 3, "□ = 8 − 5 = 3."),
          blank("q2h", "10 − □ = 7", 3, "□ = 10 − 7 = 3."),
          blank("q2i", "□ − 9 = 0", 9, "□ = 0 + 9 = 9."),
          blank("q2j", "3 × □ = 15", 5, "□ = 15 ÷ 3 = 5."),
          blank("q2k", "□ ÷ 4 = 2", 8, "□ = 2 × 4 = 8.")
        ] },
      { id: "q3", title: "Find the letter", instruction: "Say and write the values that make the statements true.",
        questions: [
          quick("q3a", "x + 4 = 7", "**x + 4 = 7**"),
          quick("q3b", "p - 6 = 9", "**p − 6 = 9**"),
          quick("q3c", "5y = 25", "**5y = 25**"),
          quick("q3d", "a/2 = 4", "**a/2 = 4**"),
          quick("q3e", "x/3 = 6", "**1/3 of x = 6**", "\"1/3 of x\" means x/3."),
          { id: "q3f", prompt: "**A = 7 cm × 5 cm**. Find A.", parts: [{ id: "v", label: "A =", type: "number", answer: 35, unit: "cm²" }],
            help: [{ text: "7 × 5 = 35, and cm × cm = cm² (square centimetres)." }, { text: "Answer: **A = 35 cm²**." }] }
        ] },
      { id: "q4", title: "What should be added?", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          quick("q4a", "x + 6 = 9", "What should be added to 6 to get 9? **x + 6 = 9**"),
          quick("q4b", "x + 10 = 16", "What should be added to 10 to get 16? **x + 10 = 16**"),
          quick("q4c", "x - 3 = 5", "From what should 3 be subtracted to get 5? **x − 3 = 5**"),
          quick("q4d", "x - 7 = 3", "From what should 7 be subtracted to get 3? **x − 7 = 3**"),
          quick("q4e", "3x = 6", "What should be multiplied by 3 to get 6? **3 × x = 6**"),
          quick("q4f", "5x = 20", "What should be multiplied by 5 to get 20? **5 × x = 20**"),
          quick("q4g", "x/3 = 2", "What should be divided by 3 to get 2? **x/3 = 2**"),
          quick("q4h", "x/5 = 4", "What should be divided by 5 to get 4? **x/5 = 4**")
        ] },
      { id: "q5", title: "Match the statements", instruction: "Pick the equation for each statement.",
        questions: [["The sum of 3 and a number x is 15.", "x + 3 = 15"], ["Three less than a number x is 15.", "x − 3 = 15"], ["The product of three and a number x is 15.", "3x = 15"], ["15 divided by a number x is 3.", "15 ÷ x = 3"]].map(function (m, i) {
          return { id: "q5" + L[i], prompt: m[0], parts: [ch("v", "", ["3x = 15", "15 ÷ x = 3", "x + 3 = 15", "x − 3 = 15"], m[1])],
            help: [{ text: "Sum means +, less means −, product means ×, divided by means ÷." }, { text: "Answer: **" + m[1] + "**." }] };
        }) },
      { id: "q6", title: "Write an equation", instruction: "Creative Section. Take x as the unknown number. Type like x + 5 = 9.",
        questions: [["5 more than a number is 9.", "x + 5 = 9", "5 more than x is x + 5."], ["4 less than a number is 6.", "x - 4 = 6", "4 less than x is x − 4."], ["7 multiplied by a number equals 21.", "7x = 21", "7 times x is 7x."], ["6 times a number is 30.", "6x = 30", "6 times x is 6x."], ["One-half of a number is 5.", "x/2 = 5", "One-half of x is x/2."]].map(function (m, i) {
          var sol = E.solve("t", m[1]).value[0];
          return { id: "q6" + L[i], prompt: m[0], parts: [rel("e", "Equation", m[1]), nm("x", "x =", sol)],
            help: [{ text: m[2] }, { text: "The equation is " + Practice.prettyAlg(m[1]) + "." }].concat(E.solve("t", m[1]).help.slice(0, -1)).concat([{ text: "Answer: **" + Practice.prettyAlg(m[1]) + ", x = " + sol + "**." }]) };
        }) },
      { id: "q7", title: "Try each value", instruction: "A = {1, 2, 3, 4, 5} is the solution set.",
        questions: [tryAll("q7a", "x + 2 = 5"), tryAll("q7b", "y - 3 = 1"), tryAll("q7c", "3x = 15"), tryAll("q7d", "x/2 = 2")] },
      { id: "q8", title: "Do the same to both sides", instruction: "Whatever you do to one side, do to the other.",
        questions: [
          quick("q8a", "x - 2 = 3", "Add 2 to both sides of **x − 2 = 3** and find x."),
          quick("q8b", "x - 5 = 2", "Add 5 to both sides of **x − 5 = 2** and find x."),
          quick("q8c", "y + 3 = 7", "Subtract 3 from both sides of **y + 3 = 7** and find y."),
          quick("q8d", "y + 6 = 9", "Subtract 6 from both sides of **y + 6 = 9** and find y."),
          quick("q8e", "a/2 = 3", "Multiply both sides of **a/2 = 3** by 2 and find a."),
          quick("q8f", "a/5 = 3", "Multiply both sides of **a/5 = 3** by 5 and find a."),
          quick("q8g", "2x = 6", "Divide both sides of **2x = 6** by 2 and find x."),
          quick("q8h", "5x = 10", "Divide both sides of **5x = 10** by 5 and find x.")
        ] },
      { id: "q9", title: "What should we do?", instruction: "Choose the step, then solve.",
        questions: [
          ["x - 3 = 5", "added to", 3, "What should be added to both sides of **x − 3 = 5**?"],
          ["y + 5 = 9", "subtracted from", 5, "What should be subtracted from both sides of **y + 5 = 9**?"],
          ["p/3 = 2", "multiplied by", 3, "By what should both sides of **p/3 = 2** be multiplied?"],
          ["5x = 20", "divided by", 5, "By what should both sides of **5x = 20** be divided?"]
        ].map(function (m, i) {
          var q = E.solve("q9" + L[i], m[0], { prompt: m[3] + " Then solve it." });
          q.parts.unshift(nm("n", "Number " + m[1] + " both sides", m[2]));
          q.help.unshift({ text: "We want the letter alone. The number " + m[2] + " is in the way, so it should be " + m[1] + " both sides." });
          return q;
        }) },
      { id: "q10", title: "Matchstick puzzles", instruction: "It's puzzle time! Move only one matchstick.",
        questions: [
          { id: "q10a", prompt: "Matchsticks show **V − II = VI** (Roman numerals). Move only one stick to make it correct.",
            parts: [ch("v", "", ["V + I = VI", "V − I = IV", "VI − I = V"], "V + I = VI")],
            help: [{ text: "V − II = VI says 5 − 2 = 6, which is wrong." }, { text: "Take one stick from II and stand it across the − to make a +. Now it says V + I = VI, that is 5 + 1 = 6." }, { text: "Answer: **V + I = VI**." }] },
          { id: "q10b", prompt: "Matchsticks show **5 + 7 = 2**. Move only one stick to make it correct.",
            parts: [ch("v", "", ["9 − 7 = 2", "5 + 7 = 12", "5 − 3 = 2"], "9 − 7 = 2")],
            help: [{ text: "5 + 7 = 12, not 2. We need a subtraction." }, { text: "Take the upright stick out of the + (it becomes −) and add it to the 5 to make a 9." }, { text: "Now it reads 9 − 7 = 2 ✓" }, { text: "Answer: **9 − 7 = 2**." }] }
        ] }
    ]
  });
})();
