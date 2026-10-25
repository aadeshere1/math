/*
  Exercise 10.6: Multiplying two binomials (and longer expressions).
  Source: Vedanta Excel in Mathematics, Book 6, pages 164-165.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ex(id, label, answer, mistakes) { return { id: id, label: label, type: "expr", answer: answer, mistakes: mistakes }; }
  function pretty(s) { return Practice.prettyAlg(s); }

  // (v + a)(v + b) trick: v² + (a + b)v + ab
  function trick(id, v, a, b) {
    var s = a + b, p = a * b;
    function sg(n) { return n < 0 ? " − " + (-n) : " + " + n; }
    var ans = v + "^2" + (s ? (s > 0 ? "+" : "-") + (Math.abs(s) === 1 ? "" : Math.abs(s)) + v : "") + (p > 0 ? "+" : "-") + Math.abs(p);
    return { id: id, prompt: "(" + v + sg(a) + ")(" + v + sg(b) + ")", parts: [ex("v", "=", ans, [{ answer: v + "^2" + (p > 0 ? "+" : "-") + Math.abs(p), say: "You missed the middle term. Add the two numbers: " + a + " + " + b + " = " + s + "." }])],
      help: [{ text: "First terms: " + v + " × " + v + " = " + v + "²." },
             { text: "Middle term: add the numbers " + a + " and " + b + " to get " + s + ", so " + (s === 0 ? "no middle term" : s + v) + "." },
             { text: "Last term: multiply the numbers: " + a + " × " + b + " = " + p + "." },
             { text: "Answer: **" + pretty(ans) + "**." }] };
  }
  function q(id, prompt, answer, steps) {
    return { id: id, prompt: prompt, parts: [ex("v", "=", answer)], help: steps.concat([{ text: "Answer: **" + pretty(answer) + "**." }]) };
  }
  var EACH = "Multiply **each** term of the first bracket by **each** term of the second, then add the like terms.";

  Practice.register({
    id: "math-algebra-g6-ex10-6",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.6",
    topic: "Multiplying two binomials",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 164–165",

    reference: {
      title: "Multiplying brackets",
      columns: ["Rule", "Example"],
      rows: [
        ["Quick trick for (x + a)(x + b)", "x² + (a + b)x + ab"],
        ["Example", "(x + 2)(x + 3) = x² + 5x + 6"],
        ["With minus numbers", "(y + 4)(y − 1) = y² + 3y − 4"],
        ["Both minus", "(a − 3)(a − 5) = a² − 8a + 15"],
        ["General: every term × every term", "(4a − b)(2a − 3b + 5) = 8a² − 14ab + 3b² + 20a − 5b"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Tricky calculation", instruction: "Use the trick: x², then (sum of numbers)x, then (product of numbers).",
        questions: [
          trick("q1a", "x", 1, 1), trick("q1b", "x", 1, 2), trick("q1c", "x", 2, 3), trick("q1d", "x", 2, -1),
          trick("q1e", "a", 3, -2), trick("q1f", "a", -2, 5), trick("q1g", "y", -3, -4), trick("q1h", "y", -4, -2)
        ]
      },
      {
        id: "q2", title: "Simplify", instruction: "Multiply out both parts, then add the like terms.",
        questions: [
          q("q2a", "x(x + 1) + 2(x + 1)", "x^2+3x+2", [{ text: "x² + x + 2x + 2" }]),
          q("q2b", "a(a + 2) − 1(a + 2)", "a^2+a-2", [{ text: "a² + 2a − a − 2" }]),
          q("q2c", "x(x + 2) − 3(x + 2)", "x^2-x-6", [{ text: "x² + 2x − 3x − 6" }]),
          q("q2d", "a(a + b) + b(a + b)", "a^2+2ab+b^2", [{ text: "a² + ab + ab + b²" }]),
          q("q2e", "x(x + y) − y(x + y)", "x^2-y^2", [{ text: "x² + xy − xy − y²" }, { text: "xy and −xy cancel out." }]),
          q("q2f", "2p(2p − 3q) + 3q(2p − 3q)", "4p^2-9q^2", [{ text: "4p² − 6pq + 6pq − 9q²" }, { text: "−6pq and +6pq cancel out." }]),
          q("q2g", "3x(x + 2y) − y(x + 2y)", "3x^2+5xy-2y^2", [{ text: "3x² + 6xy − xy − 2y²" }]),
          q("q2h", "4a(3a − 5b) − 3b(3a − 5b)", "12a^2-29ab+15b^2", [{ text: "12a² − 20ab − 9ab + 15b²" }, { text: "−20ab − 9ab = −29ab." }]),
          q("q2i", "p(7p − 2q) + 4q(7p − 2q)", "7p^2+26pq-8q^2", [{ text: "7p² − 2pq + 28pq − 8q²" }, { text: "−2pq + 28pq = 26pq." }])
        ]
      },
      {
        id: "q3", title: "Multiply", instruction: EACH,
        questions: [
          q("q3a", "(x + 1)(x + 2)", "x^2+3x+2", [{ text: "x × x + x × 2 + 1 × x + 1 × 2 = x² + 2x + x + 2" }]),
          q("q3b", "(x + 3)(x + 4)", "x^2+7x+12", [{ text: "x² + 4x + 3x + 12" }]),
          q("q3c", "(a + 2)(a − 1)", "a^2+a-2", [{ text: "a² − a + 2a − 2" }]),
          q("q3d", "(a − 3)(a − 2)", "a^2-5a+6", [{ text: "a² − 2a − 3a + 6 (minus × minus = plus)" }]),
          q("q3e", "(b − 5)(b + 5)", "b^2-25", [{ text: "b² + 5b − 5b − 25" }, { text: "The middle terms cancel out." }]),
          q("q3f", "(p + 4)(p − 4)", "p^2-16", [{ text: "p² − 4p + 4p − 16" }]),
          q("q3g", "(a + b)(a + b)", "a^2+2ab+b^2", [{ text: "a² + ab + ab + b²" }]),
          q("q3h", "(a + b)(a − b)", "a^2-b^2", [{ text: "a² − ab + ab − b²" }]),
          q("q3i", "(a − b)(a − b)", "a^2-2ab+b^2", [{ text: "a² − ab − ab + b²" }]),
          q("q3j", "(x + y)(2x + 3y)", "2x^2+5xy+3y^2", [{ text: "2x² + 3xy + 2xy + 3y²" }]),
          q("q3k", "(x − y)(2x + 3y)", "2x^2+xy-3y^2", [{ text: "2x² + 3xy − 2xy − 3y²" }]),
          q("q3l", "(x − y)(2x − 3y)", "2x^2-5xy+3y^2", [{ text: "2x² − 3xy − 2xy + 3y²" }]),
          q("q3m", "(3x + 4y)(3x − 4y)", "9x^2-16y^2", [{ text: "9x² − 12xy + 12xy − 16y²" }]),
          q("q3n", "(5a − 2b)(5a + 2b)", "25a^2-4b^2", [{ text: "25a² + 10ab − 10ab − 4b²" }]),
          q("q3o", "(x − 3y)(2x + 5y)", "2x^2-xy-15y^2", [{ text: "2x² + 5xy − 6xy − 15y²" }])
        ]
      },
      {
        id: "q4", title: "Longer expressions", instruction: EACH,
        questions: [
          q("q4a", "(x + 1)(x² + x + 1)", "x^3+2x^2+2x+1", [{ text: "x(x² + x + 1) = x³ + x² + x" }, { text: "1(x² + x + 1) = x² + x + 1" }, { text: "Add: x³ + 2x² + 2x + 1." }]),
          q("q4b", "(x − 2)(x² − 2x + 3)", "x^3-4x^2+7x-6", [{ text: "x(x² − 2x + 3) = x³ − 2x² + 3x" }, { text: "−2(x² − 2x + 3) = −2x² + 4x − 6" }, { text: "Add the like terms." }]),
          q("q4c", "(x − 3)(2x² + 3x − 4)", "2x^3-3x^2-13x+12", [{ text: "x(2x² + 3x − 4) = 2x³ + 3x² − 4x" }, { text: "−3(2x² + 3x − 4) = −6x² − 9x + 12" }, { text: "Add the like terms." }]),
          q("q4d", "(2a + b)(a + b + 2)", "2a^2+3ab+b^2+4a+2b", [{ text: "2a(a + b + 2) = 2a² + 2ab + 4a" }, { text: "b(a + b + 2) = ab + b² + 2b" }, { text: "Add the like terms: 2ab + ab = 3ab." }]),
          q("q4e", "(3a + 2b)(2a − 4b − 5)", "6a^2-8ab-8b^2-15a-10b", [{ text: "3a(2a − 4b − 5) = 6a² − 12ab − 15a" }, { text: "2b(2a − 4b − 5) = 4ab − 8b² − 10b" }, { text: "−12ab + 4ab = −8ab." }]),
          q("q4f", "(4a − 5b)(3a + 2b − 7)", "12a^2-7ab-10b^2-28a+35b", [{ text: "4a(3a + 2b − 7) = 12a² + 8ab − 28a" }, { text: "−5b(3a + 2b − 7) = −15ab − 10b² + 35b" }, { text: "8ab − 15ab = −7ab." }])
        ]
      },
      {
        id: "q5", title: "Show that", instruction: "Multiply out, then compare.",
        questions: [
          q("q5a", "If x = a + 2 and y = a − 2, find xy. (Show that xy = a² − 4.)", "a^2-4", [{ text: "xy = (a + 2)(a − 2) = a² − 2a + 2a − 4" }]),
          q("q5b", "If x = p − 3 and y = p + 3, find xy + 9. (Show that it equals p².)", "p^2", [{ text: "xy = (p − 3)(p + 3) = p² − 9" }, { text: "xy + 9 = p² − 9 + 9" }]),
          q("q5c", "If a = 2x − 3 and b = 2x + 3, find (ab + 9) ÷ 4. (Show that it equals x².)", "x^2", [{ text: "ab = (2x − 3)(2x + 3) = 4x² − 9" }, { text: "ab + 9 = 4x², and 4x² ÷ 4 = x²." }]),
          q("q5d", "If a = p + q, b = p − q and c = q² − p², find ab + c. (Show that it equals 0.)", "0", [{ text: "ab = (p + q)(p − q) = p² − q²" }, { text: "ab + c = p² − q² + q² − p²" }]),
          q("q5e", "If x = 2a − 3b, y = 2a + 3b and z = 9b² − 4a², find xy + z. (Show that it equals 0.)", "0", [{ text: "xy = (2a − 3b)(2a + 3b) = 4a² − 9b²" }, { text: "xy + z = 4a² − 9b² + 9b² − 4a²" }])
        ]
      }
    ]
  });
})();
