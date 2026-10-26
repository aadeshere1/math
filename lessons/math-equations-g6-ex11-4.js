/*
  Exercise 11.4: Trichotomy (<, > or =) and negation.
  Source: Vedanta Excel in Mathematics, Book 6, pages 184-185.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop";
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function rel(id, label, answer) { return { id: id, label: label, type: "rel", answer: answer }; }
  function sgn(a, b) { return a < b ? "<" : a > b ? ">" : "="; }
  function n(v) { return v < 0 ? "−" + (-v) : String(v); }
  function p(v) { return v < 0 ? "(−" + (-v) + ")" : String(v); }
  // Pattern on 6 < 12
  function pattern(id, name, sym, f) {
    var ks = [3, 2, 1, -1, -2, -3], parts = [], lines = [];
    ks.forEach(function (k, i) {
      var a = f(6, k), b = f(12, k), s = sgn(a, b);
      parts.push(ch("p" + i, "6 " + sym + " " + p(k) + "  □  12 " + sym + " " + p(k), ["<", ">"], s));
      lines.push("6 " + sym + " " + p(k) + " = " + n(a) + " and 12 " + sym + " " + p(k) + " = " + n(b) + ", so " + n(a) + " " + s + " " + n(b) + ".");
    });
    var rule = sym === "+" || sym === "−" ? "Adding or subtracting the same number on both sides never changes the sign." : "Multiplying or dividing by a positive number keeps the sign. By a negative number, the sign turns round.";
    return { id: id, prompt: "**" + name + "** on 6 < 12. Insert < or > in each box.", parts: parts,
      help: lines.map(function (t) { return { text: t }; }).concat([{ text: rule }, { text: "Answer: **" + parts.map(function (q) { return q.answer; }).join(" ") + "**." }]) };
  }
  function tf(id, text, ans, why) {
    return { id: id, prompt: "**" + text + "**", parts: [ch("v", "", ["true", "false"], ans)], help: [{ text: why }, { text: "Answer: **" + ans + "**." }] };
  }
  function cmp(id, a, b, ans, why) {
    return { id: id, prompt: "**" + a + "  …  " + b + "**", parts: [ch("v", "", ["<", ">", "="], ans)], help: [{ text: why }, { text: "Answer: **" + a + " " + ans + " " + b + "**." }] };
  }
  var NEG = { "<": "≮", ">": "≯", "=": "≠" };
  function negOpts(lhs, rhs) { return [lhs + " ≮ " + rhs, lhs + " ≯ " + rhs, lhs + " ≠ " + rhs]; }
  function negQ(id, lhs, op, rhs) {
    var ans = lhs + " " + NEG[op] + " " + rhs, mean = { "<": "is not less than", ">": "is not greater than", "=": "is not equal to" }[op];
    return { id: id, prompt: "Write the negation of **" + lhs + " " + op + " " + rhs + "**.", parts: [ch("v", "", negOpts(lhs, rhs), ans)],
      help: [{ text: "A slash through the sign makes the negation: ≮ is \"not less than\", ≯ is \"not greater than\", ≠ is \"not equal to\"." },
        { text: lhs + " " + mean + " " + rhs + ": **" + ans + "**." }, { text: "Answer: **" + ans + "**." }] };
  }
  function stmt(id, words, lhs, op, rhs, typed, neg) {
    var w = lhs + " " + op + " " + rhs, parts = [rel("s", "Statement", typed)];
    if (neg) parts.push(ch("n", "Negation", negOpts(lhs, rhs), lhs + " " + NEG[op] + " " + rhs));
    var help = [{ text: "\"Greater than\" is >, \"less than\" is <, \"equal to\" is =. Positive means greater than 0; negative means less than 0." }, { text: words + " → **" + w + "**." }];
    if (neg) help.push({ text: "Negation: put a slash through the sign: **" + lhs + " " + NEG[op] + " " + rhs + "**." });
    help.push({ text: "Answer: **" + w + (neg ? "; " + lhs + " " + NEG[op] + " " + rhs : "") + "**." });
    return { id: id, prompt: words + (neg ? " Write it with a sign, then pick its negation." : ""), parts: parts, help: help };
  }

  Practice.register({
    id: "math-equations-g6-ex11-4",
    subject: "Mathematics",
    unit: "Equations and inequalities",
    title: "Exercise 11.4",
    topic: "Trichotomy and negation",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 184–185",

    reference: {
      title: "Trichotomy",
      columns: ["Sign", "Meaning"],
      rows: [
        ["<", "is less than (5 < 8)"],
        [">", "is greater than (8 > 5)"],
        ["=", "is equal to (4 + 1 = 5)"],
        ["Trichotomy", "For any two numbers a and b, exactly one is true: a < b, a = b or a > b."],
        ["≮  ≯  ≠", "is not less than, is not greater than, is not equal to (negations)"],
        ["Add or subtract the same number", "the sign stays the same"],
        ["Multiply or divide by a negative number", "the sign turns round (< becomes >)"],
        ["How to type", "x > 6, y < 2, x = -4"]
      ]
    },

    sections: [
      { id: "q1", title: "Patterns", instruction: "Each side of 6 < 12 is increased, decreased, multiplied or divided by the same non-zero number. Compare.",
        questions: [
          pattern("q1a", "Addition pattern", "+", function (a, k) { return a + k; }),
          pattern("q1b", "Subtraction pattern", "−", function (a, k) { return a - k; }),
          pattern("q1c", "Multiplication pattern", "×", function (a, k) { return a * k; }),
          pattern("q1d", "Division pattern", "÷", function (a, k) { return a / k; })
        ] },
      { id: "q2", title: "True or false", instruction: "Say and write true or false.",
        questions: [
          tf("q2a", "−3 > 0", "false", "Every negative number is less than 0."),
          tf("q2b", "−2 < −3", "false", "On the number line −2 is to the right of −3, so −2 > −3."),
          tf("q2c", "−4 > −7", "true", "−4 is to the right of −7."),
          tf("q2d", "4 > −7", "true", "A positive number is greater than a negative number."),
          tf("q2e", "−2 + 3 < −3 + 2", "false", "−2 + 3 = 1 and −3 + 2 = −1. 1 is not less than −1."),
          tf("q2f", "9 − 6 < 6 − 9", "false", "9 − 6 = 3 and 6 − 9 = −3. 3 > −3."),
          tf("q2g", "1 × (−6) < (−3) × 2", "false", "1 × (−6) = −6 and (−3) × 2 = −6. They are equal, so \"less than\" is false."),
          tf("q2h", "10/(−5) = (−10)/5", "true", "Both are −2."),
          tf("q2i", "(−21)/(−7) > 21/(−7)", "true", "(−21)/(−7) = 3 and 21/(−7) = −3. 3 > −3.")
        ] },
      { id: "q3", title: "Insert <, > or =", instruction: "Insert the right trichotomy symbol.",
        questions: [
          cmp("q3a", "8", "5", ">", "8 is bigger."),
          cmp("q3b", "7", "11", "<", "7 is smaller."),
          cmp("q3c", "−2", "−5", ">", "−2 is to the right of −5 on the number line."),
          cmp("q3d", "−4", "2", "<", "A negative number is less than a positive number."),
          cmp("q3e", "0", "6", "<", "0 is less than any positive number."),
          cmp("q3f", "−3", "2 − 5", "=", "2 − 5 = −3."),
          cmp("q3g", "(−2) × (−6)", "−12", ">", "(−2) × (−6) = 12, and 12 > −12."),
          cmp("q3h", "18/(−9)", "12/(−6)", "=", "18/(−9) = −2 and 12/(−6) = −2.")
        ] },
      { id: "q4", title: "Negation", instruction: "Rewrite the trichotomy statements using negation symbols.",
        questions: [negQ("q4a", "x", "<", "4"), negQ("q4b", "y", ">", "2"), negQ("q4c", "x + 5", "=", "8")] },
      { id: "q5", title: "Write with a sign", instruction: "Creative Section. Write the statement using <, > or =. Type like x > 6.",
        questions: [
          stmt("q5a", "x is greater than 6.", "x", ">", "6", "x > 6"),
          stmt("q5b", "y is less than 2.", "y", "<", "2", "y < 2"),
          stmt("q5c", "x is equal to −4.", "x", "=", "−4", "x = -4"),
          stmt("q5d", "m is a positive number.", "m", ">", "0", "m > 0"),
          stmt("q5e", "p is a negative number.", "p", "<", "0", "p < 0"),
          stmt("q5f", "k is neither positive nor negative.", "k", "=", "0", "k = 0")
        ] },
      { id: "q6", title: "Statement and negation", instruction: "Rewrite each statement with a trichotomy symbol, then pick its negation.",
        questions: [
          stmt("q6a", "x is greater than 5.", "x", ">", "5", "x > 5", true),
          stmt("q6b", "y is less than −3.", "y", "<", "−3", "y < -3", true),
          stmt("q6c", "z is equal to 6.", "z", "=", "6", "z = 6", true),
          stmt("q6d", "−p is greater than −2.", "−p", ">", "−2", "-p > -2", true),
          stmt("q6e", "−x is less than −4.", "−x", "<", "−4", "-x < -4", true),
          stmt("q6f", "x + 5 is equal to 9.", "x + 5", "=", "9", "x + 5 = 9", true),
          stmt("q6g", "y − 8 is greater than −2.", "y − 8", ">", "−2", "y - 8 > -2", true),
          stmt("q6h", "7 − x is less than x − 7.", "7 − x", "<", "x − 7", "7 - x < x - 7", true)
        ] }
    ]
  });
})();
