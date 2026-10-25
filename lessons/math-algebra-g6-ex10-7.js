/*
  Exercise 10.7: Dividing algebraic terms and expressions.
  Source: Vedanta Excel in Mathematics, Book 6, pages 167-168.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ex(id, label, answer, mistakes) { return { id: id, label: label, type: "expr", answer: answer, mistakes: mistakes }; }
  function nm(id, label, answer, unit) { return { id: id, label: label, type: "number", answer: answer, unit: unit }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function pretty(s) { return Practice.prettyAlg(s); }

  function q(id, prompt, answer, steps, mistakes) {
    return { id: id, prompt: prompt, parts: [ex("v", "=", answer, mistakes)], help: steps.concat([{ text: "Answer: **" + pretty(answer) + "**." }]) };
  }
  function sub(id, prompt, answer, step, mistakes) {
    return q(id, prompt, answer, [{ text: "Same base: **subtract** the powers (top power − bottom power)." }, { text: step }], mistakes);
  }
  function each(id, prompt, answer, step) {
    return q(id, prompt, answer, [{ text: "Divide **each** term of the bracket by the divisor." }, { text: step }]);
  }
  function quo(id, top, bot, answer, a, b) {
    // (v² + (a+b)v + ab) ÷ (v + a) = v + b
    return q(id, "(" + pretty(top) + ") ÷ (" + bot + ")", answer,
      [{ text: "Look for two numbers that **add** to the middle number and **multiply** to the last number. One of them is already in the divisor." },
       { text: "Here they are " + a + " and " + b + ": they add to " + (a + b) + " and multiply to " + a * b + "." },
       { text: "So " + pretty(top) + " = " + bot + " × (" + pretty(answer) + "). Check by multiplying back." }]);
  }

  Practice.register({
    id: "math-algebra-g6-ex10-7",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.7",
    topic: "Dividing terms and expressions",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 167–168",

    reference: {
      title: "Dividing",
      columns: ["Rule", "Example"],
      rows: [
        ["Same base: subtract the powers", "x⁵ ÷ x³ = x⁵⁻³ = x²"],
        ["Anything (not 0) ÷ itself = 1", "a² ÷ a² = 1"],
        ["Divide the numbers, then the letters", "24x⁵ ÷ 6x³ = 4x²"],
        ["Signs: + ÷ − = −, − ÷ − = +", "9y⁶ ÷ (−3y⁴) = −3y²"],
        ["Expression ÷ term: divide each term", "(10x² − 15x) ÷ 5 = 2x² − 3x"],
        ["Length = area ÷ breadth", "Breadth = area ÷ length"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Subtract the powers", instruction: "Say and write the quotient as quickly as possible.",
        questions: [
          sub("q1a", "x² ÷ x", "x", "2 − 1 = 1, so x¹ = x."),
          sub("q1b", "x³ ÷ x", "x^2", "3 − 1 = 2."),
          sub("q1c", "x⁴ ÷ x²", "x^2", "4 − 2 = 2."),
          sub("q1d", "x⁴ ÷ x³", "x", "4 − 3 = 1."),
          sub("q1e", "a³ ÷ a²", "a", "3 − 2 = 1."),
          sub("q1f", "a² ÷ a²", "1", "2 − 2 = 0, and anything to the power 0 is 1. (a² ÷ a² is a number divided by itself.)", [{ answer: "a", say: "a² ÷ a² is something divided by itself, so the answer is 1." }]),
          sub("q1g", "y⁴ ÷ y", "y^3", "4 − 1 = 3."),
          sub("q1h", "y⁴ ÷ y⁴", "1", "Something divided by itself is 1."),
          sub("q1i", "y⁵ ÷ y³", "y^2", "5 − 3 = 2.")
        ]
      },
      {
        id: "q2", title: "Two letters", instruction: "Subtract the powers of each letter separately.",
        questions: [
          sub("q2a", "y²z² ÷ yz", "yz", "y: 2 − 1 = 1. z: 2 − 1 = 1."),
          sub("q2b", "y³z² ÷ yz", "y^2z", "y: 3 − 1 = 2. z: 2 − 1 = 1."),
          sub("q2c", "y²z³ ÷ yz", "yz^2", "y: 2 − 1 = 1. z: 3 − 1 = 2."),
          sub("q2d", "a³b³ ÷ a²b", "ab^2", "a: 3 − 2 = 1. b: 3 − 1 = 2."),
          sub("q2e", "a³b³ ÷ ab²", "a^2b", "a: 3 − 1 = 2. b: 3 − 2 = 1."),
          sub("q2f", "a³b³ ÷ a²b²", "ab", "a: 3 − 2 = 1. b: 3 − 2 = 1."),
          sub("q2g", "6x³ ÷ 2x", "3x^2", "6 ÷ 2 = 3. x: 3 − 1 = 2."),
          sub("q2h", "6a⁴ ÷ 3a", "2a^3", "6 ÷ 3 = 2. a: 4 − 1 = 3."),
          sub("q2i", "12p⁶ ÷ 4p³", "3p^3", "12 ÷ 4 = 3. p: 6 − 3 = 3.", [{ answer: "3p^2", say: "Subtract the powers: 6 − 3 = 3, so p³." }])
        ]
      },
      {
        id: "q3", title: "Expand, then divide", instruction: "Write the terms out in full and cancel. Example: 14x⁴ ÷ 7x² = (14 × x × x × x × x) ÷ (7 × x × x) = 2x².",
        questions: [
          q("q3a", "x² ÷ x", "x", [{ text: "(x × x) ÷ x: one x cancels." }]),
          q("q3b", "y³ ÷ y", "y^2", [{ text: "(y × y × y) ÷ y: one y cancels, two are left." }]),
          q("q3c", "a⁴ ÷ a²", "a^2", [{ text: "(a × a × a × a) ÷ (a × a): two a's cancel." }]),
          q("q3d", "6x³ ÷ 2x²", "3x", [{ text: "6 ÷ 2 = 3. (x × x × x) ÷ (x × x) leaves x." }]),
          q("q3e", "6y⁴ ÷ 3y³", "2y", [{ text: "6 ÷ 3 = 2. Four y's ÷ three y's leaves one y." }]),
          q("q3f", "16x⁵ ÷ 4x²", "4x^3", [{ text: "16 ÷ 4 = 4. Five x's ÷ two x's leaves three." }]),
          q("q3g", "24x³y⁴ ÷ 8x²y²", "3xy^2", [{ text: "24 ÷ 8 = 3. x: three ÷ two leaves one. y: four ÷ two leaves two." }]),
          q("q3h", "30a⁴b⁴ ÷ 5a²b³", "6a^2b", [{ text: "30 ÷ 5 = 6. a: 4 − 2 = 2. b: 4 − 3 = 1." }])
        ]
      },
      {
        id: "q4", title: "Divide by rule", instruction: "Divide the numbers, then subtract the powers. Example: 24x⁵ ÷ 6x³ = 4x⁵⁻³ = 4x².",
        questions: [
          q("q4a", "x³ ÷ x²", "x", [{ text: "3 − 2 = 1." }]),
          q("q4b", "a⁴ ÷ a", "a^3", [{ text: "4 − 1 = 3." }]),
          q("q4c", "9p² ÷ 3p", "3p", [{ text: "9 ÷ 3 = 3. p: 2 − 1 = 1." }]),
          q("q4d", "15m⁵ ÷ 5m²", "3m^3", [{ text: "15 ÷ 5 = 3. m: 5 − 2 = 3." }]),
          q("q4e", "9y⁶ ÷ (−3y⁴)", "-3y^2", [{ text: "9 ÷ (−3) = −3 (plus ÷ minus = minus)." }, { text: "y: 6 − 4 = 2." }]),
          q("q4f", "14x⁶ ÷ (−7x⁵)", "-2x", [{ text: "14 ÷ (−7) = −2. x: 6 − 5 = 1." }]),
          q("q4g", "a²b² ÷ ab", "ab", [{ text: "a: 2 − 1 = 1. b: 2 − 1 = 1." }]),
          q("q4h", "x³y³ ÷ xy", "x^2y^2", [{ text: "x: 3 − 1 = 2. y: 3 − 1 = 2." }]),
          q("q4i", "3x⁵y⁴ ÷ x²y", "3x^3y^3", [{ text: "3 ÷ 1 = 3. x: 5 − 2 = 3. y: 4 − 1 = 3." }]),
          q("q4j", "10x³y² ÷ (−2xy)", "-5x^2y", [{ text: "10 ÷ (−2) = −5. x: 3 − 1 = 2. y: 2 − 1 = 1." }]),
          q("q4k", "−12a⁴b⁴ ÷ 3a²b²", "-4a^2b^2", [{ text: "−12 ÷ 3 = −4. a: 4 − 2 = 2. b: 4 − 2 = 2." }]),
          q("q4l", "16x⁸y⁷ ÷ (−4x⁶y⁵)", "-4x^2y^2", [{ text: "16 ÷ (−4) = −4. x: 8 − 6 = 2. y: 7 − 5 = 2." }])
        ]
      },
      {
        id: "q5", title: "Expression ÷ term", instruction: "Divide each term by the divisor.",
        questions: [
          each("q5a", "(10x² − 15x) ÷ 5", "2x^2-3x", "10x² ÷ 5 = 2x², 15x ÷ 5 = 3x."),
          each("q5b", "(8x² − 16) ÷ 8", "x^2-2", "8x² ÷ 8 = x², 16 ÷ 8 = 2."),
          each("q5c", "(a² + a) ÷ a", "a+1", "a² ÷ a = a, a ÷ a = 1."),
          each("q5d", "(x² − 3x) ÷ x", "x-3", "x² ÷ x = x, 3x ÷ x = 3."),
          each("q5e", "(4b² + 6b) ÷ 2b", "2b+3", "4b² ÷ 2b = 2b, 6b ÷ 2b = 3."),
          each("q5f", "(9c³ − 6c²) ÷ 3c²", "3c-2", "9c³ ÷ 3c² = 3c, 6c² ÷ 3c² = 2."),
          each("q5g", "(8m³ − 6m²) ÷ 2m²", "4m-3", "8m³ ÷ 2m² = 4m, 6m² ÷ 2m² = 3."),
          each("q5h", "(6n⁴ − 9n³) ÷ 3n²", "2n^2-3n", "6n⁴ ÷ 3n² = 2n², 9n³ ÷ 3n² = 3n."),
          each("q5i", "(p³q − 2p²q³) ÷ pq", "p^2-2pq^2", "p³q ÷ pq = p², 2p²q³ ÷ pq = 2pq²."),
          each("q5j", "(3a⁴b − ab⁴) ÷ ab", "3a^3-b^3", "3a⁴b ÷ ab = 3a³, ab⁴ ÷ ab = b³."),
          each("q5k", "(3x³y² + 6x²y³) ÷ 3xy", "x^2y+2xy^2", "3x³y² ÷ 3xy = x²y, 6x²y³ ÷ 3xy = 2xy²."),
          each("q5l", "(15p⁴q³ − 20p²q⁴) ÷ 5pq", "3p^3q^2-4pq^3", "15p⁴q³ ÷ 5pq = 3p³q², 20p²q⁴ ÷ 5pq = 4pq³."),
          each("q5m", "(12a⁶x⁵ + 18a⁵x⁶) ÷ 6a³x³", "2a^3x^2+3a^2x^3", "12a⁶x⁵ ÷ 6a³x³ = 2a³x², 18a⁵x⁶ ÷ 6a³x³ = 3a²x³."),
          each("q5n", "(20b⁴c⁶ − 50b⁴c⁴) ÷ (−10b⁴c⁴)", "-2c^2+5", "20b⁴c⁶ ÷ (−10b⁴c⁴) = −2c². −50b⁴c⁴ ÷ (−10b⁴c⁴) = +5.")
        ]
      },
      {
        id: "q6", title: "Find the quotient", instruction: "Divide the expression by the binomial.",
        questions: [
          quo("q6a", "x^2+3x+2", "x + 2", "x+1", 2, 1),
          quo("q6b", "a^2+5a+6", "a + 3", "a+2", 3, 2),
          quo("q6c", "m^2+7m+12", "m + 4", "m+3", 4, 3),
          quo("q6d", "p^2+9p+20", "p + 5", "p+4", 5, 4),
          quo("q6e", "a^2+a-6", "a − 2", "a+3", -2, 3),
          quo("q6f", "b^2+2b-15", "b − 3", "b+5", -3, 5),
          quo("q6g", "x^2-3x-10", "x − 5", "x+2", -5, 2),
          quo("q6h", "y^2-4y-21", "y − 7", "y+3", -7, 3)
        ]
      },
      {
        id: "q7", title: "Find the other term", instruction: "Other term = product ÷ the term you know.",
        questions: [
          q("q7a", "The product of two algebraic terms is 6a³b². If one of the terms is 3ab, find the other term.", "2a^2b", [{ text: "6a³b² ÷ 3ab: 6 ÷ 3 = 2, a: 3 − 1 = 2, b: 2 − 1 = 1." }]),
          q("q7b", "The product of two expressions is 14x³y² − 35x²y³. If one of them is 7x²y², find the other.", "2x-5y", [{ text: "14x³y² ÷ 7x²y² = 2x." }, { text: "35x²y³ ÷ 7x²y² = 5y." }])
        ]
      },
      {
        id: "q8", title: "Rectangles", instruction: "Breadth = area ÷ length. Perimeter = 2(length + breadth).",
        questions: [
          { id: "q8a", prompt: "The length of a rectangle is 5x cm and its area is (15x² + 10x) cm². (i) Find the breadth. (ii) Find the perimeter. (iii) If x = 2, find the actual perimeter.",
            parts: [ex("b", "(i) Breadth =", "3x+2"), ex("p", "(ii) Perimeter =", "16x+4"), nm("r", "(iii)", 36, "cm")],
            help: [{ text: "Breadth = (15x² + 10x) ÷ 5x = 3x + 2." }, { text: "Perimeter = 2(5x + 3x + 2) = 2(8x + 2) = 16x + 4." }, { text: "When x = 2: 16 × 2 + 4 = ?", ask: ask(36) }] },
          { id: "q8b", prompt: "The width of a rectangular field is 6xy m and its area is (18x²y² + 24xy) sq. m. (i) Find the length. (ii) Find the perimeter. (iii) If x = 3 and y = 2, find the actual perimeter.",
            parts: [ex("l", "(i) Length =", "3xy+4"), ex("p", "(ii) Perimeter =", "18xy+8"), nm("r", "(iii)", 116, "m")],
            help: [{ text: "Length = (18x²y² + 24xy) ÷ 6xy = 3xy + 4." }, { text: "Perimeter = 2(3xy + 4 + 6xy) = 2(9xy + 4) = 18xy + 8." }, { text: "xy = 3 × 2 = 6, so 18 × 6 + 8 = ?", ask: ask(116) }] },
          { id: "q8c", prompt: "The area of a rectangular carpet is (x² + 4x + 3) sq. ft and its length is (x + 3) ft. (i) What is its width? (ii) If x = 4, find the actual length and width.",
            parts: [ex("w", "(i) Width =", "x+1"), nm("l", "(ii) Length", 7, "ft"), nm("w2", "Width", 5, "ft")],
            help: [{ text: "Width = (x² + 4x + 3) ÷ (x + 3). Two numbers that add to 4 and multiply to 3 are 3 and 1, so the width is x + 1." },
                   { text: "When x = 4: length = 4 + 3 = 7 ft, width = 4 + 1 = 5 ft." }] }
        ]
      },
      {
        id: "q9", title: "Find the value", instruction: "Put the terms in place of the letters, then divide.",
        questions: [
          q("q9a", "If a = 3x²y, b = 4xy² and c = 2xy, find ab ÷ c.", "6x^2y^2", [{ text: "ab = 3x²y × 4xy² = 12x³y³." }, { text: "12x³y³ ÷ 2xy = 6x²y²." }]),
          q("q9b", "If p = 5a²b², q = 4a³b³ and r = 10a⁴b⁴, find pq ÷ r. (Show that it equals 2ab.)", "2ab", [{ text: "pq = 20a⁵b⁵." }, { text: "20a⁵b⁵ ÷ 10a⁴b⁴ = 2ab ✓" }]),
          q("q9c", "If x = 12p³q⁴, y = 6p²q³ and z = 2p²q², find x/y + y/z. (Show that it equals 2pq + 3q.)", "2pq+3q", [{ text: "x ÷ y = 12p³q⁴ ÷ 6p²q³ = 2pq." }, { text: "y ÷ z = 6p²q³ ÷ 2p²q² = 3q." }, { text: "Add them: 2pq + 3q ✓" }])
        ]
      }
    ]
  });
})();
