/*
  Exercise 10.5: Multiplying terms, indices, and a term times an expression.
  Source: Vedanta Excel in Mathematics, Book 6, pages 160-162.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ex(id, label, answer, form, mistakes) { return { id: id, label: label, type: "expr", answer: answer, form: form, mistakes: mistakes }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function pretty(s) { return Practice.prettyAlg ? Practice.prettyAlg(s) : s; }

  function q(id, prompt, answer, steps, mistakes) {
    return { id: id, prompt: prompt, parts: [ex("v", "=", answer, undefined, mistakes)], help: steps.concat([{ text: "Answer: **" + pretty(answer) + "**." }]) };
  }
  var MULT = "Multiply the numbers, then the letters. For the same letter, **add** the powers: x² × x³ = x⁵.";
  function rect(id, l, b, answer, steps) {
    return { id: id, prompt: "A rectangle has length **" + l + "** and breadth **" + b + "**. Find its area.",
      figure: { type: "geo", points: { _A: [0, 0], _B: [160, 0], _C: [160, 90], _D: [0, 90] }, lines: [["_A", "_B"], ["_B", "_C"], ["_C", "_D"], ["_D", "_A"]], marks: [],
        texts: [[80, -14, l], [182, 45, b]] },
      parts: [ex("v", "Area =", answer)], help: [{ text: "Area = length × breadth = " + l + " × " + b + "." }].concat(steps, [{ text: "Answer: **" + pretty(answer) + "**." }]) };
  }
  function box(id, l, b, h, answer, steps) {
    return { id: id, prompt: "A cuboid has length **" + l + "**, breadth **" + b + "** and height **" + h + "**. Find its volume.",
      parts: [ex("v", "V =", answer)], help: [{ text: "V = l × b × h = " + l + " × " + b + " × " + h + "." }].concat(steps, [{ text: "Answer: **" + pretty(answer) + "**." }]) };
  }
  function idx(id, prompt, answer, accept, why) {
    return { id: id, prompt: prompt, parts: [{ id: "v", label: "=", type: "expr", form: "exact", answer: answer, accept: accept }],
      help: [{ text: why }, { text: "Answer: **" + pretty(answer) + "**. Type powers with ^." }] };
  }
  function target(id, arrows, sum, prod) {
    return { id: id, prompt: "Arrows hitting the target: **" + arrows.join(", ") + "**. Top half = their **sum**. Bottom half = their **product**.",
      parts: [ex("s", "Sum =", sum), ex("p", "Product =", prod)],
      help: [{ text: "Sum: add the numbers in front: " + arrows.join(" + ") + "." }, { text: "Product: multiply them all. The number of letters multiplied becomes the power." },
             { text: "Answer: sum **" + pretty(sum) + "**, product **" + pretty(prod) + "**." }] };
  }
  function spread(id, prompt, answer, step) {
    return q(id, prompt, answer, [{ text: "Multiply the term outside by **each** term inside the brackets." }, { text: step }]);
  }

  Practice.register({
    id: "math-algebra-g6-ex10-5",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.5",
    topic: "Multiplying terms and indices",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 160–162",

    reference: {
      title: "Multiplying",
      columns: ["Rule", "Example"],
      rows: [
        ["Repeated multiplication as a power", "x × x × x = x³"],
        ["Same base: add the powers", "x² × x³ = x²⁺³ = x⁵"],
        ["Multiply numbers, then letters", "3a × 2a = 6a²"],
        ["Signs: − × − = +, − × + = −", "(−5qr) × (−2pqr) = +10pq²r²"],
        ["Term × expression: multiply each term", "2x(x − 3) = 2x² − 6x"],
        ["Area of rectangle = l × b", "Volume of cuboid = l × b × h"],
        ["How to type", "x^2 for x², 2^2*3^2 for 2² × 3²"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Area of rectangles", instruction: "Area of a rectangle = length × breadth.",
        questions: [
          rect("q1a", "4x", "3y", "12xy", [{ text: "4 × 3 = 12 and x × y = xy." }]),
          rect("q1b", "2p", "5q", "10pq", [{ text: "2 × 5 = 10 and p × q = pq." }]),
          rect("q1c", "3x", "2x", "6x^2", [{ text: "3 × 2 = 6 and x × x = x²." }]),
          rect("q1d", "5a", "2a", "10a^2", [{ text: "5 × 2 = 10 and a × a = a²." }]),
          rect("q1e", "(2x + 1)", "x", "2x^2+x", [{ text: "Multiply x by each term: x × 2x = 2x² and x × 1 = x." }]),
          rect("q1f", "3x", "(2x + 1)", "6x^2+3x", [{ text: "3x × 2x = 6x² and 3x × 1 = 3x." }])
        ]
      },
      {
        id: "q2", title: "Volume of cuboids", instruction: "Volume of a cuboid = length × breadth × height.",
        questions: [
          box("q2a", "a", "b", "c", "abc", [{ text: "a × b × c = abc." }]),
          box("q2b", "4x", "2y", "3z", "24xyz", [{ text: "4 × 2 × 3 = 24 and x × y × z = xyz." }]),
          box("q2c", "2x", "2x", "x", "4x^3", [{ text: "2 × 2 × 1 = 4 and x × x × x = x³." }]),
          box("q2d", "5p", "3p", "2p", "30p^3", [{ text: "5 × 3 × 2 = 30 and p × p × p = p³." }])
        ]
      },
      {
        id: "q3", title: "Write as indices", instruction: "Write the product of the same bases as a power.",
        questions: [
          idx("q3a", "2 × 2", "2^2", ["2²"], "2 is multiplied 2 times."),
          idx("q3b", "3 × 3 × 3", "3^3", ["3³"], "3 is multiplied 3 times."),
          idx("q3c", "2 × 2 × 3 × 3", "2^2×3^2", ["2²×3²", "3^2×2^2"], "Two 2s and two 3s."),
          idx("q3d", "x × x", "x^2", ["x²"], "x is multiplied 2 times."),
          idx("q3e", "y × y × y", "y^3", ["y³"], "y is multiplied 3 times."),
          idx("q3f", "x × x × y × y", "x^2y^2", ["x²y²", "x^2×y^2", "x²×y²"], "Two x's and two y's.")
        ]
      },
      {
        id: "q4", title: "Expanded form", instruction: "Write each power as a repeated multiplication. Use × or *.",
        questions: [
          idx("q4a", "3²", "3×3", [], "The power 2 means two 3s multiplied."),
          idx("q4b", "4³", "4×4×4", [], "Three 4s multiplied."),
          idx("q4c", "5⁴", "5×5×5×5", [], "Four 5s multiplied."),
          idx("q4d", "a²", "a×a", ["aa"], "Two a's multiplied."),
          idx("q4e", "p³", "p×p×p", ["ppp"], "Three p's multiplied."),
          idx("q4f", "c⁴", "c×c×c×c", ["cccc"], "Four c's multiplied.")
        ]
      },
      {
        id: "q5", title: "Quick products", instruction: "Say and write the products as quickly as possible.",
        questions: [
          q("q5a", "x × x", "x^2", [{ text: "Two x's multiplied: x²." }], [{ answer: "2x", say: "That is x + x. Here we multiply: x × x." }]),
          q("q5b", "2x × x", "2x^2", [{ text: "2 stays, x × x = x²." }]),
          q("q5c", "3a × 2a", "6a^2", [{ text: "3 × 2 = 6, a × a = a²." }]),
          q("q5d", "p² × p", "p^3", [{ text: "Add the powers: 2 + 1 = 3." }]),
          q("q5e", "3b² × 4b²", "12b^4", [{ text: "3 × 4 = 12. Powers: 2 + 2 = 4." }], [{ answer: "12b^2", say: "Same base: add the powers. b² × b² = b⁴." }]),
          q("q5f", "2x³ × 5x²", "10x^5", [{ text: "2 × 5 = 10. Powers: 3 + 2 = 5." }], [{ answer: "10x^6", say: "Add the powers, don't multiply them: 3 + 2 = 5." }]),
          spread("q5g", "x(x + 1)", "x^2+x", "x × x = x², x × 1 = x."),
          spread("q5h", "2x(x − 3)", "2x^2-6x", "2x × x = 2x², 2x × (−3) = −6x."),
          spread("q5i", "3x(x² + 2)", "3x^3+6x", "3x × x² = 3x³, 3x × 2 = 6x."),
          spread("q5j", "2a(a² − 5)", "2a^3-10a", "2a × a² = 2a³, 2a × (−5) = −10a.")
        ]
      },
      {
        id: "q6", title: "Targets", instruction: "Look at the targets and investigate the operation.",
        questions: [
          target("q6a", ["y", "y", "y"], "3y", "y^3"),
          target("q6b", ["a", "a", "a"], "3a", "a^3"),
          target("q6c", ["x", "x", "x", "x", "x"], "5x", "x^5"),
          target("q6d", ["2p", "p"], "3p", "2p^2"),
          target("q6e", ["2y", "y", "3y"], "6y", "6y^3"),
          target("q6f", ["2x", "2x", "3x", "3x", "x"], "11x", "36x^5")
        ]
      },
      {
        id: "q7", title: "Multiply", instruction: MULT,
        questions: [
          q("q7a", "x × x", "x^2", [{ text: "x × x = x²." }]),
          q("q7b", "2x × 3x", "6x^2", [{ text: "2 × 3 = 6, x × x = x²." }]),
          q("q7c", "3x × 4x", "12x^2", [{ text: "3 × 4 = 12, x × x = x²." }]),
          q("q7d", "x × 2x²", "2x^3", [{ text: "Numbers: 1 × 2 = 2. Powers of x: 1 + 2 = 3." }]),
          q("q7e", "2y × 3y²", "6y^3", [{ text: "2 × 3 = 6. y: 1 + 2 = 3." }]),
          q("q7f", "3xy × 2xy", "6x^2y^2", [{ text: "3 × 2 = 6. x × x = x², y × y = y²." }]),
          q("q7g", "4a²b × 3ab²", "12a^3b^3", [{ text: "4 × 3 = 12. a: 2 + 1 = 3. b: 1 + 2 = 3." }]),
          q("q7h", "−5xyz × 4xyz", "-20x^2y^2z^2", [{ text: "−5 × 4 = −20 (minus × plus = minus)." }, { text: "Each letter appears twice: x²y²z²." }])
        ]
      },
      {
        id: "q8", title: "Simplify products", instruction: MULT,
        questions: [
          q("q8a", "x × x × x²", "x^4", [{ text: "Powers of x: 1 + 1 + 2 = 4." }]),
          q("q8b", "2a² × 3a × 5a", "30a^4", [{ text: "2 × 3 × 5 = 30. a: 2 + 1 + 1 = 4." }]),
          q("q8c", "3x × 2y × 2x × y", "12x^2y^2", [{ text: "3 × 2 × 2 = 12. x: 1 + 1 = 2. y: 1 + 1 = 2." }]),
          q("q8d", "p² × 5q × 2p × 3q²", "30p^3q^3", [{ text: "5 × 2 × 3 = 30. p: 2 + 1 = 3. q: 1 + 2 = 3." }]),
          q("q8e", "3b³ × c² × 2b² × 4c³", "24b^5c^5", [{ text: "3 × 2 × 4 = 24. b: 3 + 2 = 5. c: 2 + 3 = 5." }]),
          q("q8f", "xyz × 2xy × yz × 5zx", "10x^3y^3z^3", [{ text: "1 × 2 × 1 × 5 = 10. Count each letter: x 3 times, y 3 times, z 3 times." }]),
          q("q8g", "(−3ab) × (−2bc) × (−abc)", "-6a^2b^3c^2", [{ text: "Three minus signs: − × − = +, then + × − = −." }, { text: "3 × 2 × 1 = 6. a: 2, b: 3, c: 2." }]),
          q("q8h", "(−5qr) × (−2pqr) × pq", "10p^2q^3r^2", [{ text: "Two minus signs make plus. 5 × 2 = 10." }, { text: "p: 1 + 1 = 2. q: 1 + 1 + 1 = 3. r: 1 + 1 = 2." }])
        ]
      },
      {
        id: "q9", title: "Multiply and combine", instruction: "Multiply each part first, then add or subtract.",
        questions: [
          q("q9a", "2x × 2x + 2x × 5", "4x^2+10x", [{ text: "2x × 2x = 4x². 2x × 5 = 10x." }]),
          q("q9b", "3a × 2a − 3a × 4", "6a^2-12a", [{ text: "3a × 2a = 6a². 3a × 4 = 12a." }]),
          q("q9c", "5x² × x² + 5x² × 8", "5x^4+40x^2", [{ text: "5x² × x² = 5x⁴. 5x² × 8 = 40x²." }]),
          q("q9d", "ab × 2a − ab × 3b", "2a^2b-3ab^2", [{ text: "ab × 2a = 2a²b. ab × 3b = 3ab²." }]),
          q("q9e", "ab × 5a² − ab × 3b²", "5a^3b-3ab^3", [{ text: "ab × 5a² = 5a³b. ab × 3b² = 3ab³." }]),
          q("q9f", "10x²y² × 3x − 10x²y² × 2y", "30x^3y^2-20x^2y^3", [{ text: "10x²y² × 3x = 30x³y². 10x²y² × 2y = 20x²y³." }]),
          q("q9g", "−2x × 4x − (−2x) × 3", "-8x^2+6x", [{ text: "−2x × 4x = −8x². (−2x) × 3 = −6x." }, { text: "−8x² − (−6x) = −8x² + 6x." }]),
          q("q9h", "−pq × 2p − (−pq) × 3q", "-2p^2q+3pq^2", [{ text: "−pq × 2p = −2p²q. (−pq) × 3q = −3pq²." }, { text: "−2p²q − (−3pq²) = −2p²q + 3pq²." }]),
          q("q9i", "−3abc × 2a² + (−3abc) × 5bc", "-6a^3bc-15ab^2c^2", [{ text: "−3abc × 2a² = −6a³bc." }, { text: "−3abc × 5bc = −15ab²c²." }])
        ]
      },
      {
        id: "q10", title: "Term × expression", instruction: "Multiply the outside term by each term inside.",
        questions: [
          spread("q10a", "3x(2x + 5)", "6x^2+15x", "3x × 2x = 6x², 3x × 5 = 15x."),
          spread("q10b", "4a(5a − 6)", "20a^2-24a", "4a × 5a = 20a², 4a × (−6) = −24a."),
          spread("q10c", "6p(8p² − 1)", "48p^3-6p", "6p × 8p² = 48p³, 6p × (−1) = −6p."),
          spread("q10d", "2y²(y² + 7)", "2y^4+14y^2", "2y² × y² = 2y⁴, 2y² × 7 = 14y²."),
          spread("q10e", "6m²(2 − 3m²)", "12m^2-18m^4", "6m² × 2 = 12m², 6m² × (−3m²) = −18m⁴."),
          spread("q10f", "7b³(8 + 3b²)", "56b^3+21b^5", "7b³ × 8 = 56b³, 7b³ × 3b² = 21b⁵."),
          spread("q10g", "xy(x − y)", "x^2y-xy^2", "xy × x = x²y, xy × (−y) = −xy²."),
          spread("q10h", "2xy(2x + 3y)", "4x^2y+6xy^2", "2xy × 2x = 4x²y, 2xy × 3y = 6xy²."),
          spread("q10i", "2ab(3a² − 4b²)", "6a^3b-8ab^3", "2ab × 3a² = 6a³b, 2ab × (−4b²) = −8ab³."),
          spread("q10j", "−3pq(2p + 5q)", "-6p^2q-15pq^2", "−3pq × 2p = −6p²q, −3pq × 5q = −15pq²."),
          spread("q10k", "−2bc(7b − 3c)", "-14b^2c+6bc^2", "−2bc × 7b = −14b²c, −2bc × (−3c) = +6bc²."),
          spread("q10l", "−5xy(5x² − 4y²)", "-25x^3y+20xy^3", "−5xy × 5x² = −25x³y, −5xy × (−4y²) = +20xy³."),
          spread("q10m", "−4x(x² − 2x + 1)", "-4x^3+8x^2-4x", "−4x × x² = −4x³, −4x × (−2x) = +8x², −4x × 1 = −4x."),
          spread("q10n", "−5a(3a² + 3a − 5)", "-15a^3-15a^2+25a", "−5a × 3a² = −15a³, −5a × 3a = −15a², −5a × (−5) = +25a."),
          spread("q10o", "−3xy(4x² − 5xy − 3y²)", "-12x^3y+15x^2y^2+9xy^3", "−3xy × 4x² = −12x³y, −3xy × (−5xy) = +15x²y², −3xy × (−3y²) = +9xy³.")
        ]
      },
      {
        id: "q11", title: "Show and find", instruction: "Put the values in place of the letters.",
        questions: [
          { id: "q11a", prompt: "If x = a + 5 and y = 2a, find xy. (Show that it equals 2a² + 10a.)", parts: [ex("v", "xy =", "2a^2+10a")],
            help: [{ text: "xy = (a + 5) × 2a = 2a × a + 2a × 5" }, { text: "= **2a² + 10a** ✓" }] },
          { id: "q11b", prompt: "If p = 5x and q = 3x − 1, find 2pq. (Show that it equals 30x² − 10x.)", parts: [ex("v", "2pq =", "30x^2-10x")],
            help: [{ text: "2pq = 2 × 5x × (3x − 1) = 10x(3x − 1)" }, { text: "= **30x² − 10x** ✓" }] },
          { id: "q11c", prompt: "If a = x − 3, b = 3x and x = 2, find the value of 4ab.", parts: [nm("v", "4ab =", -24)],
            help: [{ text: "a = 2 − 3 = −1 and b = 3 × 2 = 6." }, { text: "4ab = 4 × (−1) × 6 = ?", ask: ask(-24) }] },
          { id: "q11d", prompt: "If m = n = 2a and a = 3, find the value of √(mn).", parts: [nm("v", "√(mn) =", 6)],
            help: [{ text: "m = n = 2 × 3 = 6." }, { text: "mn = 36, and √36 = ?", ask: ask(6) }] },
          { id: "q11e", prompt: "If p = 2x, q = 3x and x = 3, find the value of √(6pq).", parts: [nm("v", "√(6pq) =", 18)],
            help: [{ text: "p = 6 and q = 9." }, { text: "6pq = 6 × 6 × 9 = 324." }, { text: "√324 = ? (Which number times itself is 324?)", ask: ask(18) }] }
        ]
      }
    ]
  });
})();
