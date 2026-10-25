/*
  Exercise 10.4: Adding and subtracting algebraic expressions.
  Source: Vedanta Excel in Mathematics, Book 6, pages 155-157.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ex(id, label, answer, form, mistakes) { return { id: id, label: label, type: "expr", answer: answer, form: form, mistakes: mistakes }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }

  // a + b
  function add(id, a, b, answer, note) {
    return { id: id, prompt: "Add **" + a + "** and **" + b + "**.", parts: [ex("v", "=", answer)],
      help: [{ text: "Write them together: (" + a + ") + (" + b + "). Adding keeps every sign as it is." },
             { text: note || "Put like terms side by side and add their numbers." }, { text: "Answer: **" + answer.replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/-/g, " − ").replace(/\+/g, " + ") + "**." }] };
  }
  // b − a ("subtract a from b")
  function sub(id, a, b, answer, note) {
    return { id: id, prompt: "Subtract **" + a + "** from **" + b + "**.", parts: [ex("v", "=", answer)],
      help: [{ text: "\"Subtract " + a + " from " + b + "\" means (" + b + ") − (" + a + ")." },
             { text: "Opening the brackets after a minus sign changes every sign inside: + becomes −, − becomes +." },
             { text: note || "Then add the like terms." }, { text: "Answer: **" + answer.replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/-/g, " − ").replace(/\+/g, " + ") + "**." }] };
  }
  function simp(id, expr, answer, steps) {
    return { id: id, prompt: "Simplify **" + expr + "**.", parts: [ex("v", "=", answer)],
      help: [{ text: "A minus sign in front of brackets changes every sign inside when you remove the brackets." }].concat(steps) };
  }
  function cell(id, r, c, answer) {
    return { id: id, prompt: "Row **" + r + "**, column **" + c + "**: find (" + r + ") + (" + c + ").", parts: [ex("v", "=", answer)],
      help: [{ text: "Add the a terms together, then the other terms." }, { text: "Answer: **" + answer.replace(/-/g, " − ").replace(/\+/g, " + ") + "**." }] };
  }

  Practice.register({
    id: "math-algebra-g6-ex10-4",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.4",
    topic: "Adding and subtracting expressions",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 155–157",

    reference: {
      title: "Adding and subtracting",
      columns: ["Rule", "Example"],
      rows: [
        ["Add: keep all signs, then join like terms", "(3x + 5) + (x − 4) = 4x + 1"],
        ["Subtract: change every sign of the expression being taken away", "(5x + 4) − (x + 1) = 5x + 4 − x − 1 = 4x + 3"],
        ["\"Subtract A from B\" means B − A", "Subtract x from 5x: 5x − x"],
        ["Profit = selling price − cost price", "Loss = cost price − selling price"],
        ["Perimeter of a triangle", "Add the three sides"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Quick sums and differences", instruction: "Say and write the correct answers as quickly as possible.",
        questions: [
          add("q1a", "x + 1", "x + 2", "2x+3"),
          add("q1b", "3x + 5", "x − 4", "4x+1"),
          add("q1c", "a² + b²", "a² − b²", "2a^2", "b² and −b² cancel out, and a² + a² = 2a²."),
          { id: "q1d", prompt: "Difference of **2x + 3** and **x + 1**.", parts: [ex("v", "=", "x+2")],
            help: [{ text: "(2x + 3) − (x + 1) = 2x + 3 − x − 1" }, { text: "Answer: **x + 2**." }] },
          { id: "q1e", prompt: "Difference of **4y + 7** and **3y + 2**.", parts: [ex("v", "=", "y+5")],
            help: [{ text: "(4y + 7) − (3y + 2) = 4y + 7 − 3y − 2" }, { text: "Answer: **y + 5**." }] },
          { id: "q1f", prompt: "Difference of **8a + 5** and **4a − 3**.", parts: [ex("v", "=", "4a+8", undefined, [{ answer: "4a+2", say: "Careful: minus (−3) is plus 3. 5 + 3 = 8." }])],
            help: [{ text: "(8a + 5) − (4a − 3) = 8a + 5 − 4a **+ 3**" }, { text: "Answer: **4a + 8**." }] }
        ]
      },
      {
        id: "q2", title: "Addition table", instruction: "Each box is (row) + (column).",
        questions: [
          cell("q2a", "a + 5", "a + 2", "2a+7"), cell("q2b", "a + 5", "a − 1", "2a+4"),
          cell("q2c", "a − 3", "a + 2", "2a-1"), cell("q2d", "a − 3", "a + b", "2a+b-3"),
          cell("q2e", "a − b", "a − 1", "2a-b-1"), cell("q2f", "a − b", "a + b", "2a")
        ]
      },
      {
        id: "q3", title: "Add", instruction: "Add the expressions. Type powers with ^.",
        questions: [
          add("q3a", "x + 3", "x + 2", "2x+5"), add("q3b", "2x + 5", "3x + 1", "5x+6"), add("q3c", "3a + 8", "4a − 5", "7a+3"),
          add("q3d", "4 + 3a", "5 − 8a", "9-5a"), add("q3e", "9m − 2", "m − 7", "10m-9"), add("q3f", "11 − 2n", "4 − 5n", "15-7n"),
          add("q3g", "3a + 4b", "7a + 2b", "10a+6b"), add("q3h", "8a − 5b", "a − 3b", "9a-8b"), add("q3i", "p² + q²", "2p² + 3q²", "3p^2+4q^2"),
          add("q3j", "3a² − 5b²", "2a² + 7b²", "5a^2+2b^2"), add("q3k", "x² − xy + y²", "2x² + 6xy − y²", "3x^2+5xy", "y² and −y² cancel out."),
          add("q3l", "x² + x − 2", "2x² − 5x + 7", "3x^2-4x+5"), add("q3m", "2ab − 3bc + 4", "ab + 4bc − 5", "3ab+bc-1"),
          add("q3n", "8abc − 5ab + 3a", "2a + 7ab − 4abc", "4abc+2ab+5a")
        ]
      },
      {
        id: "q4", title: "Subtract", instruction: "Subtract the first expression from the second.",
        questions: [
          sub("q4a", "x + 1", "5x + 4", "4x+3"), sub("q4b", "2x + 3", "5x + 1", "3x-2"), sub("q4c", "6a − 7", "9a + 2", "3a+9"),
          sub("q4d", "2a + 5", "6a − 1", "4a-6"), sub("q4e", "3p − 2", "5p − 7", "2p-5"), sub("q4f", "8 − 3p", "1 − p", "2p-7"),
          sub("q4g", "5m + 3n", "7m − 2n", "2m-5n"), sub("q4h", "9mn − 5p", "6mn − p", "-3mn+4p"), sub("q4i", "4x² − 3y²", "9x² + 4y²", "5x^2+7y^2"),
          sub("q4j", "3a³ + 5b³", "8a³ − b³", "5a^3-6b^3"), sub("q4k", "2x³ − 5x² + x − 6", "4x³ + 2x² − 3x + 7", "2x^3+7x^2-4x+13"),
          sub("q4l", "4ax − 6by + 7", "6ax + 2by − 3", "2ax+8by-10"),
          sub("q4m", "abc + 2ab − 3bc − ca", "3ab − ab + bc + 2ca", "-abc+4bc+3ca", "First tidy the second expression: 3ab − ab = 2ab. Then 2ab − 2ab = 0, so ab disappears."),
          sub("q4n", "xyz − 4xy + 5", "5xyz + xy + 3yz − 4", "4xyz+5xy+3yz-9")
        ]
      },
      {
        id: "q5", title: "What is missing?", instruction: "Find the missing expression.",
        questions: [
          { id: "q5a", prompt: "What should be added to **2x − 3** to get **5x + 7**?", parts: [ex("v", "=", "3x+10")],
            help: [{ text: "Missing = (5x + 7) − (2x − 3) = 5x + 7 − 2x + 3" }, { text: "Answer: **3x + 10**." }] },
          { id: "q5b", prompt: "What should be added to **3a + 4b** to get **7a − 5b**?", parts: [ex("v", "=", "4a-9b")],
            help: [{ text: "Missing = (7a − 5b) − (3a + 4b) = 7a − 5b − 3a − 4b" }, { text: "Answer: **4a − 9b**." }] },
          { id: "q5c", prompt: "What should be subtracted from **5m − 3n** to get **2m + 5n**?", parts: [ex("v", "=", "3m-8n")],
            help: [{ text: "Taken away = start − end = (5m − 3n) − (2m + 5n) = 5m − 3n − 2m − 5n" }, { text: "Answer: **3m − 8n**." }] },
          { id: "q5d", prompt: "What should be subtracted from **5x − 3y** to get **2x − 5y**?", parts: [ex("v", "=", "3x+2y")],
            help: [{ text: "Taken away = (5x − 3y) − (2x − 5y) = 5x − 3y − 2x + 5y" }, { text: "Answer: **3x + 2y**." }] },
          { id: "q5e", prompt: "To what expression must **2a − 3b + 1** be added to get **4a + 7b − 3**?", parts: [ex("v", "=", "2a+10b-4")],
            help: [{ text: "Missing = (4a + 7b − 3) − (2a − 3b + 1) = 4a + 7b − 3 − 2a + 3b − 1" }, { text: "Answer: **2a + 10b − 4**." }] },
          { id: "q5f", prompt: "From what expression must **x² + 5y² − 3xy** be subtracted to get **2x² − y² + 4xy**?", parts: [ex("v", "=", "3x^2+4y^2+xy")],
            help: [{ text: "Unknown − (x² + 5y² − 3xy) = 2x² − y² + 4xy, so Unknown = (2x² − y² + 4xy) + (x² + 5y² − 3xy)." }, { text: "Answer: **3x² + 4y² + xy**." }] }
        ]
      },
      {
        id: "q6", title: "Show that", instruction: "Put the expressions in place of the letters.",
        questions: [
          { id: "q6a", prompt: "If x = a + 7 and y = b − a, find x + y. (Show that it equals b + 7.)", parts: [ex("v", "x + y =", "b+7")],
            help: [{ text: "x + y = (a + 7) + (b − a)" }, { text: "a and −a cancel out, leaving **b + 7** ✓" }] },
          { id: "q6b", prompt: "If x = 2m − n and y = m + n, find x − y. (Show that it equals m − 2n.)", parts: [ex("v", "x − y =", "m-2n")],
            help: [{ text: "x − y = (2m − n) − (m + n) = 2m − n − m − n" }, { text: "= **m − 2n** ✓" }] },
          { id: "q6c", prompt: "If x² = 2a² − b², y² = 2b² − c² and z² = 2c² − a², find x² + y² + z². (Show that it equals a² + b² + c².)", parts: [ex("v", "x² + y² + z² =", "a^2+b^2+c^2")],
            help: [{ text: "Add all three: 2a² − b² + 2b² − c² + 2c² − a²" }, { text: "a²: 2 − 1 = 1. b²: −1 + 2 = 1. c²: −1 + 2 = 1. So **a² + b² + c²** ✓" }] }
        ]
      },
      {
        id: "q7", title: "Remove brackets", instruction: "Simplify.",
        questions: [
          simp("q7a", "4x + 3y − (3x + y)", "x+2y", [{ text: "4x + 3y − 3x − y" }, { text: "Answer: **x + 2y**." }]),
          simp("q7b", "5a − 3b − (a + 6b)", "4a-9b", [{ text: "5a − 3b − a − 6b" }, { text: "Answer: **4a − 9b**." }]),
          simp("q7c", "8p + q − (5p − 3q)", "3p+4q", [{ text: "8p + q − 5p + 3q" }, { text: "Answer: **3p + 4q**." }]),
          simp("q7d", "6a − 5x − (2x − 3a)", "9a-7x", [{ text: "6a − 5x − 2x + 3a" }, { text: "Answer: **9a − 7x**." }]),
          simp("q7e", "−7m − 2n − 5 − (−8m − n + 1)", "m-n-6", [{ text: "−7m − 2n − 5 + 8m + n − 1" }, { text: "Answer: **m − n − 6**." }]),
          simp("q7f", "−a − 2t − (t − 4a) − (−3a − 5t)", "6a+2t", [{ text: "−a − 2t − t + 4a + 3a + 5t" }, { text: "a: −1 + 4 + 3 = 6. t: −2 − 1 + 5 = 2. Answer: **6a + 2t**." }]),
          simp("q7g", "−(b − z) − (−2b + z) − (−3b − z)", "4b+z", [{ text: "−b + z + 2b − z + 3b + z" }, { text: "b: −1 + 2 + 3 = 4. z: 1 − 1 + 1 = 1. Answer: **4b + z**." }]),
          simp("q7h", "−(a − b) − (−4b + 3c) − (c − 2a)", "a+5b-4c", [{ text: "−a + b + 4b − 3c − c + 2a" }, { text: "Answer: **a + 5b − 4c**." }])
        ]
      },
      {
        id: "q8", title: "Profit and loss", instruction: "C.P. = cost price, S.P. = selling price.",
        questions: [
          { id: "q8a", prompt: "The C.P. of a pen is Rs (2x + 5) and its S.P. is Rs (3x + 2). (i) Which formula finds profit? (ii) How much profit is made? (iii) If x = 10, find the actual profit.",
            parts: [ch("f", "(i)", ["Profit = S.P. − C.P.", "Profit = C.P. − S.P.", "Profit = S.P. + C.P."], "Profit = S.P. − C.P."), ex("p", "(ii) Profit = Rs", "x-3"), nm("r", "(iii) Rs", 7)],
            help: [{ text: "Profit is what you get above what you paid: S.P. − C.P." }, { text: "(3x + 2) − (2x + 5) = 3x + 2 − 2x − 5 = x − 3" }, { text: "When x = 10: 10 − 3 = ?", ask: ask(7) }] },
          { id: "q8b", prompt: "A stationer buys a copy for Rs (3x + 10) and sells it for Rs (2x + 5). (i) Which formula finds loss? (ii) How much loss? (iii) If x = 9, find the actual loss.",
            parts: [ch("f", "(i)", ["Loss = C.P. − S.P.", "Loss = S.P. − C.P.", "Loss = S.P. + C.P."], "Loss = C.P. − S.P."), ex("l", "(ii) Loss = Rs", "x+5"), nm("r", "(iii) Rs", 14)],
            help: [{ text: "Loss is how much less you got than you paid: C.P. − S.P." }, { text: "(3x + 10) − (2x + 5) = 3x + 10 − 2x − 5 = x + 5" }, { text: "When x = 9: 9 + 5 = ?", ask: ask(14) }] }
        ]
      },
      {
        id: "q9", title: "Perimeter", instruction: "Perimeter of a triangle = sum of its three sides.",
        questions: [
          { id: "q9a", prompt: "The sides of a triangle are x + 4, 2x − 3 and 3x + 1. Find its perimeter.", parts: [ex("v", "Perimeter =", "6x+2")],
            help: [{ text: "x + 4 + 2x − 3 + 3x + 1" }, { text: "x: 1 + 2 + 3 = 6. Numbers: 4 − 3 + 1 = 2. Answer: **6x + 2**." }] },
          { id: "q9b", prompt: "The sides of a triangle are 2x + 3y, x + 2y and 7x − 2y. Find its perimeter.", parts: [ex("v", "Perimeter =", "10x+3y")],
            help: [{ text: "x: 2 + 1 + 7 = 10. y: 3 + 2 − 2 = 3." }, { text: "Answer: **10x + 3y**." }] }
        ]
      }
    ]
  });
})();
