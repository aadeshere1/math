/*
  Exercise 11.5: Inequalities, solution sets and number lines.
  Source: Vedanta Excel in Mathematics, Book 6, pages 187-188.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
  Solution sets are sets of integers, as in the book.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, unit) { var p = { id: id, label: label, type: "number", answer: answer }; if (unit) p.unit = unit; return p; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function rel(id, label, answer) { return { id: id, label: label, type: "rel", answer: answer }; }
  function n(v) { return v < 0 ? "−" + (-v) : String(v); }
  var SIGN = { "<": "<", ">": ">", "<=": "≤", ">=": "≥" };
  // number-line figure for "x op k"
  function line(op, k, from, to) {
    var closed = op.length === 2, left = op.charAt(0) === "<";
    return { type: "nline", from: from, to: to, range: left ? [null, k, false, closed] : [k, null, closed, false] };
  }
  function words(op) { return { "<": "less than", ">": "greater than", "<=": "less than or equal to", ">=": "greater than or equal to" }[op]; }
  function circleText(op, k) {
    return (op.length === 2 ? "A **filled** circle at " + n(k) + " because " + n(k) + " is included" : "An **open** circle at " + n(k) + " because " + n(k) + " is not included") +
      ", and the arrow goes to the **" + (op.charAt(0) === "<" ? "left" : "right") + "** for numbers " + (op.charAt(0) === "<" ? "smaller" : "bigger") + " than " + n(k) + ".";
  }
  function setText(op, k) {
    var s = op === "<" ? k - 1 : op === "<=" ? k : op === ">" ? k + 1 : k, up = op.charAt(0) === ">";
    return "{" + [s, up ? s + 1 : s - 1, up ? s + 2 : s - 2].map(n).join(", ") + ", …}";
  }
  function drawParts(op, k) {
    return [nm("k", "Circle at", k), ch("c", "Circle", ["open ○", "filled ●"], op.length === 2 ? "filled ●" : "open ○"), ch("d", "Arrow goes", ["left ←", "right →"], op.charAt(0) === "<" ? "left ←" : "right →")];
  }

  var A = [1, 2, 3, 4, 5];
  function replace(id, expr, shown, f) {
    var sol = A.filter(f);
    return { id: id, prompt: "A = {1, 2, 3, 4, 5}. Find the solution set of **" + shown + "**.", parts: [{ id: "v", label: "Solution set", type: "set", answer: sol.map(String) }],
      help: A.map(function (v) { return { text: "x = " + v + ": " + expr(v) + (f(v) ? " ✓ true" : " ✗ false") }; }).concat([{ text: "Answer: **{" + sol.join(", ") + "}**." }]) };
  }

  Practice.register({
    id: "math-equations-g6-ex11-5",
    subject: "Mathematics",
    unit: "Equations and inequalities",
    title: "Exercise 11.5",
    topic: "Inequalities and number lines",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 187–188",

    reference: {
      title: "Inequalities",
      columns: ["Sign", "Meaning and number line"],
      rows: [
        ["x < 3", "less than 3: open circle ○ at 3, arrow to the left"],
        ["x > 3", "greater than 3: open circle ○ at 3, arrow to the right"],
        ["x ≤ 3", "less than or equal to 3: filled circle ● at 3, arrow to the left"],
        ["x ≥ 3", "greater than or equal to 3: filled circle ● at 3, arrow to the right"],
        ["Solving", "Do the same to both sides: x + 2 < 4 → x < 2"],
        ["Solution set (integers)", "x < 2 → {1, 0, −1, …}"],
        ["How to type", "x > 4, x <= 3 for x ≤ 3, x >= -2 for x ≥ −2"]
      ]
    },

    sections: [
      { id: "q1", title: "Write with inequality signs", instruction: "Make the statements using inequality symbols. Type ≤ as <= and ≥ as >=.",
        questions: [["x is greater than 4", "x > 4"], ["y is less than 7", "y < 7"], ["x is greater than or equal to 3", "x >= 3"], ["y is less than or equal to −2", "y <= -2"],
          ["x − 1 is greater than or equal to 3", "x - 1 >= 3"], ["x + 5 is less than or equal to −4", "x + 5 <= -4"]].map(function (m, i) {
          var shown = m[1].replace(">=", "≥").replace("<=", "≤").replace(/-/g, "−");
          return { id: "q1" + L[i], prompt: m[0] + ".", parts: [rel("v", "", m[1])],
            help: [{ text: "Greater than: >. Less than: <. \"Or equal to\" adds the line under the sign: ≥ or ≤ (type >= or <=)." }, { text: "Answer: **" + shown + "**." }] };
        }) },
      { id: "q2", title: "Quick solution sets", instruction: "Say and write the solution sets as quickly as possible. Example: x < 3 → {2, 1, 0, −1, …}",
        questions: [["<", 5, ["{4, 3, 2, …}", "{5, 4, 3, …}", "{6, 7, 8, …}"]], [">", 2, ["{3, 4, 5, …}", "{2, 3, 4, …}", "{1, 0, −1, …}"]],
          [">", -4, ["{−3, −2, −1, …}", "{−4, −3, −2, …}", "{−5, −6, −7, …}"]], ["<", -3, ["{−4, −5, −6, …}", "{−3, −4, −5, …}", "{−2, −1, 0, …}"]]].map(function (m, i) {
          var ans = setText(m[0], m[1]);
          return { id: "q2" + L[i], prompt: "**x " + m[0] + " " + n(m[1]) + "**", parts: [ch("v", "", m[2], ans)],
            help: [{ text: "x is " + words(m[0]) + " " + n(m[1]) + ", so " + n(m[1]) + " itself is not in the set. Start at the next integer " + (m[0] === "<" ? "below" : "above") + " it.", figure: line(m[0], m[1], -8, 8) },
              { text: "Answer: **" + ans + "**." }] };
        }) },
      { id: "q3", title: "Read the number line", instruction: "Write the inequalities represented by these number lines.",
        questions: [["<", 3], [">", -5], [">=", -4], ["<=", 8]].map(function (m, i) {
          var a = "x " + m[0] + " " + m[1];
          return { id: "q3" + L[i], prompt: "Write the inequality shown.", figure: line(m[0], m[1], -9, 9), parts: [rel("v", "", a)],
            help: [{ text: circleText(m[0], m[1]) }, { text: "So x is " + words(m[0]) + " " + n(m[1]) + "." }, { text: "Answer: **x " + SIGN[m[0]] + " " + n(m[1]) + "**." }] };
        }) },
      { id: "q4", title: "Replacement set", instruction: "A = {1, 2, 3, 4, 5} is the replacement set. Put in each element and find the solution set.",
        questions: [
          replace("q4a", function (x) { return x + " + 2 = " + (x + 2) + " < 7"; }, "x + 2 < 7", function (x) { return x + 2 < 7; }),
          replace("q4b", function (x) { return x + " + 4 = " + (x + 4) + " > 5"; }, "x + 4 > 5", function (x) { return x + 4 > 5; }),
          replace("q4c", function (x) { return x + " − 3 = " + n(x - 3) + " ≤ 5"; }, "x − 3 ≤ 5", function (x) { return x - 3 <= 5; }),
          replace("q4d", function (x) { return x + " − 1 = " + (x - 1) + " ≥ 1"; }, "x − 1 ≥ 1", function (x) { return x - 1 >= 1; })
        ] },
      { id: "q5", title: "Draw on a number line", instruction: "Represent the inequalities on number lines. Say where the circle goes, what kind it is, and which way the arrow goes.",
        questions: [["<", 5], ["<", -3], ["<=", 4], [">=", -2]].map(function (m, i) {
          return { id: "q5" + L[i], prompt: "Represent **x " + SIGN[m[0]] + " " + n(m[1]) + "** on a number line.", parts: drawParts(m[0], m[1]),
            help: [{ text: circleText(m[0], m[1]) }, { text: "Here it is:", figure: line(m[0], m[1], -9, 9) }, { text: "Answer: **" + (m[0].length === 2 ? "filled" : "open") + " circle at " + n(m[1]) + ", arrow " + (m[0].charAt(0) === "<" ? "left" : "right") + "**." }] };
        }) },
      { id: "q6", title: "Solve and draw", instruction: "Find the solution sets and represent them on number lines. Type the answer like x < 4.",
        questions: [["x + 3 < 7", "Subtract 3 from both sides: x < 7 − 3", "<", 4], ["x + 4 > 6", "Subtract 4 from both sides: x > 6 − 4", ">", 2],
          ["x − 2 ≤ 4", "Add 2 to both sides: x ≤ 4 + 2", "<=", 6], ["x − 5 ≥ −4", "Add 5 to both sides: x ≥ −4 + 5", ">=", 1]].map(function (m, i) {
          var a = "x " + SIGN[m[2]] + " " + m[3];
          return { id: "q6" + L[i], prompt: "**" + m[0] + "**", parts: [rel("v", "Solve", "x " + m[2] + " " + m[3])].concat(drawParts(m[2], m[3]).slice(1)),
            help: [{ text: m[1] + ", so **" + a + "**." }, { text: "Solution set = " + setText(m[2], m[3]) + "." }, { text: circleText(m[2], m[3]), figure: line(m[2], m[3], -9, 9) },
              { text: "Answer: **" + a + ", solution set " + setText(m[2], m[3]) + "**." }] };
        }) },
      { id: "q7", title: "Lines and solution sets", instruction: "Write the inequalities represented by the number lines. Also state the solution sets.",
        questions: [["<", 6], [">=", 3], ["<", -4], [">", -5]].map(function (m, i) {
          var a = "x " + SIGN[m[0]] + " " + n(m[1]), s = setText(m[0], m[1]), opts = [s, setText(m[0].length === 2 ? m[0].charAt(0) : m[0] + "=", m[1])];
          opts.sort();
          return { id: "q7" + L[i], prompt: "Write the inequality shown and its solution set.", figure: line(m[0], m[1], -9, 9), parts: [rel("v", "Inequality", "x " + m[0] + " " + m[1]), ch("s", "Solution set", opts, s)],
            help: [{ text: circleText(m[0], m[1]) }, { text: "So the inequality is **" + a + "**." }, { text: "Solution set = " + s + "." }, { text: "Answer: **" + a + ", " + s + "**." }] };
        }).concat([
          { id: "q7e", prompt: "Write the inequality shown and its solution set.", figure: { type: "nline", from: -9, to: 9, range: [1, 6, false, false] },
            parts: [ch("v", "Inequality", ["1 < x < 6", "1 ≤ x ≤ 6", "1 < x ≤ 6"], "1 < x < 6"), { id: "s", label: "Solution set", type: "set", answer: ["2", "3", "4", "5"] }],
            help: [{ text: "Open circles at 1 and 6, joined: x is between 1 and 6, and neither 1 nor 6 is included." }, { text: "So **1 < x < 6**." }, { text: "The whole numbers between them: 2, 3, 4, 5." }, { text: "Answer: **1 < x < 6, {2, 3, 4, 5}**." }] },
          { id: "q7f", prompt: "Write the inequality shown and its solution set.", figure: { type: "nline", from: -9, to: 9, range: [-3, 3, true, true] },
            parts: [ch("v", "Inequality", ["−3 < x < 3", "−3 ≤ x ≤ 3", "−3 ≤ x < 3"], "−3 ≤ x ≤ 3"), { id: "s", label: "Solution set", type: "set", answer: ["-3", "-2", "-1", "0", "1", "2", "3"] }],
            help: [{ text: "Filled circles at −3 and 3, joined: x is between them and both ends are included." }, { text: "So **−3 ≤ x ≤ 3**." }, { text: "The integers from −3 to 3: −3, −2, −1, 0, 1, 2, 3." }, { text: "Answer: **−3 ≤ x ≤ 3, {−3, −2, −1, 0, 1, 2, 3}**." }] }
        ]) },
      { id: "q8", title: "Inequalities in real life", instruction: "Answer the questions.",
        questions: [
          { id: "q8a", prompt: "x represents the number of members of a club. At least 15 members are needed to conduct the weekly club meeting. Represent this statement using an inequality symbol.",
            parts: [rel("v", "", "x >= 15")],
            help: [{ text: "\"At least 15\" means 15 or more, so x is greater than or equal to 15." }, { text: "Answer: **x ≥ 15**." }] },
          { id: "q8b", prompt: "The length of a square is x cm. Write an inequality to show its perimeter is at least 20 cm. Solve the inequality and find the minimum length of the square.",
            parts: [rel("e", "Inequality", "4x >= 20"), nm("v", "Minimum length", 5, "cm")],
            help: [{ text: "Perimeter of a square = 4x. \"At least 20\" means ≥ 20." }, { text: "Inequality: **4x ≥ 20**." }, { text: "Divide both sides by 4: x ≥ 5." }, { text: "Answer: **4x ≥ 20, minimum length 5 cm**." }] },
          { id: "q8c", prompt: "x represents the average quantity of rice to be sold every day to clear the stock of 350 kg of rice in a week. Represent it as an inequality and find the average quantity of rice to be sold every day.",
            parts: [rel("e", "Inequality", "7x >= 350"), nm("v", "At least", 50, "kg a day")],
            help: [{ text: "A week has 7 days, so 7x kg is sold in a week. To clear 350 kg, 7x must be at least 350." }, { text: "Inequality: **7x ≥ 350**." }, { text: "Divide both sides by 7: x ≥ 50." }, { text: "Answer: **7x ≥ 350, at least 50 kg a day**." }] }
        ] }
    ]
  });
})();
