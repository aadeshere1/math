/*
  Exercise 10.3: Like and unlike terms; adding and subtracting like terms.
  Source: Vedanta Excel in Mathematics, Book 6, pages 153-154.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ex(id, label, answer, mistakes) { return { id: id, label: label, type: "expr", answer: answer, mistakes: mistakes }; }
  var LU = ["Like", "Unlike"];

  function lu(id, terms, answer, why) {
    return { id: id, prompt: "**" + terms + "** are ____ terms.", parts: [ch("v", "", LU, answer)],
      help: [{ text: "Like terms have **exactly the same letters with the same powers**. Only the number in front may differ." }, { text: why }, { text: "Answer: **" + answer.toLowerCase() + "** terms." }] };
  }
  function q(id, prompt, answer, steps, mistakes) {
    return { id: id, prompt: prompt, parts: [ex("v", "=", answer, mistakes)], help: steps };
  }

  // obstacle course: start at x, apply each step; returns questions for each box
  var TOP = [["Add 4x", 4], ["Subtract 6x", -6], ["Add 5x", 5], ["Subtract x", -1], ["Add 6x", 6]];
  var LOW = [["Subtract 3x", -3], ["Add 7x", 7], ["Subtract 2x", -2], ["Add 9x", 9], ["Subtract 3x", -3]];
  function fmt(c) { return c === 0 ? "0" : c === 1 ? "x" : c === -1 ? "−x" : (c < 0 ? "−" + (-c) : c) + "x"; }
  function course(id, title, steps) {
    var v = 1, parts = [], help = [];
    steps.forEach(function (s, i) {
      var nv = v + s[1];
      parts.push(ex("b" + i, "Box " + (i + 1) + " (" + s[0].toLowerCase() + ")", nv === 0 ? "0" : nv + "x"));
      help.push({ text: fmt(v) + (s[1] < 0 ? " − " : " + ") + fmt(Math.abs(s[1])) + " = " + fmt(nv) });
      v = nv;
    });
    return { id: id, prompt: "Start with **x**. Follow the " + title + " path and fill each box.", parts: parts,
      help: [{ text: "Only the numbers in front of x change. Add or subtract them, and keep the x." }].concat(help) };
  }

  Practice.register({
    id: "math-algebra-g6-ex10-3",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.3",
    topic: "Like terms",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 153–154",

    reference: {
      title: "Like terms",
      columns: ["Rule", "Example"],
      rows: [
        ["Like terms: same letters, same powers", "4x, 7x, −3x"],
        ["Unlike terms: letters or powers differ", "3x, 2x², xy"],
        ["Add or subtract like terms by their numbers", "2x + 3x = 5x, 9y³ − 4y³ = 5y³"],
        ["A letter alone means 1 of it", "3ab + ab = 4ab"],
        ["Unlike terms cannot be joined", "2x + 3y stays 2x + 3y"],
        ["How to type", "Powers with ^: 5pq^2 means 5pq²"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Like or unlike", instruction: "Say whether these terms are like or unlike.",
        questions: [
          lu("q1a", "4x, 7x, −3x", "Like", "All three have just x."),
          lu("q1b", "3x, 2x², xy", "Unlike", "x, x² and xy are all different."),
          lu("q1c", "3a², 4a³, 6a", "Unlike", "The powers of a are 2, 3 and 1: different."),
          lu("q1d", "p², 3p², 8p²", "Like", "All three have p²."),
          lu("q1e", "2xy, 5xy, 3xy", "Like", "All three have xy."),
          lu("q1f", "2x²y, 5xy², 3x²y²", "Unlike", "x²y, xy² and x²y² have different powers.")
        ]
      },
      {
        id: "q2", title: "Quick sums", instruction: "Say and write the answers as quickly as possible. Type powers with ^.",
        questions: [
          q("q2a", "a + 2a", "3a", [{ text: "a means 1a. 1 + 2 = 3." }, { text: "Answer: **3a**." }]),
          q("q2b", "x² + x²", "2x^2", [{ text: "1 + 1 = 2, and the x² stays the same." }, { text: "Answer: **2x²** (type 2x^2)." }],
            [{ answer: "x^4", say: "When adding, the power does not change. 1 x² plus 1 x² is 2 x²." }]),
          q("q2c", "3xy + 2xy", "5xy", [{ text: "3 + 2 = 5." }, { text: "Answer: **5xy**." }]),
          q("q2d", "5x − 3x", "2x", [{ text: "5 − 3 = 2." }, { text: "Answer: **2x**." }]),
          q("q2e", "4a² − a²", "3a^2", [{ text: "a² means 1a². 4 − 1 = 3." }, { text: "Answer: **3a²**." }]),
          q("q2f", "9pq² − 4pq²", "5pq^2", [{ text: "9 − 4 = 5." }, { text: "Answer: **5pq²**." }])
        ]
      },
      {
        id: "q3", title: "What is missing?", instruction: "Find the missing term.",
        questions: [
          q("q3a", "What should be added to 2x to get 5x?", "3x", [{ text: "2x + ? = 5x. Find the gap: 5x − 2x." }, { text: "Answer: **3x**." }]),
          q("q3b", "What should be subtracted from 8x to get 3x?", "5x", [{ text: "8x − ? = 3x. The amount taken away is 8x − 3x." }, { text: "Answer: **5x**." }])
        ]
      },
      {
        id: "q4", title: "Add or subtract", instruction: "Add or subtract the like terms.",
        questions: [
          q("q4a", "4x + 7x", "11x", [{ text: "4 + 7 = 11." }]),
          q("q4b", "5a² + 9a²", "14a^2", [{ text: "5 + 9 = 14. Keep a²." }]),
          q("q4c", "5xy + 3xy", "8xy", [{ text: "5 + 3 = 8." }]),
          q("q4d", "3abc + 6abc", "9abc", [{ text: "3 + 6 = 9." }]),
          q("q4e", "10p³ − 3p³", "7p^3", [{ text: "10 − 3 = 7. Keep p³." }]),
          q("q4f", "12mn − 7mn", "5mn", [{ text: "12 − 7 = 5." }]),
          q("q4g", "9x²y − 4x²y", "5x^2y", [{ text: "9 − 4 = 5. Keep x²y." }]),
          q("q4h", "8xy² − 7xy²", "xy^2", [{ text: "8 − 7 = 1, and 1xy² is written xy²." }])
        ]
      },
      {
        id: "q5", title: "Simplify", instruction: "Group the like terms, then add or subtract.",
        questions: [
          q("q5a", "a + 2a + 3a", "6a", [{ text: "1 + 2 + 3 = 6." }]),
          q("q5b", "2p² + 3p² + p² + 4p²", "10p^2", [{ text: "2 + 3 + 1 + 4 = ?", ask: { type: "number", answer: 10 } }, { text: "Answer: **10p²**." }]),
          q("q5c", "2x + 3y + x + y", "3x+4y", [{ text: "x terms: 2x + x = 3x." }, { text: "y terms: 3y + y = 4y." }, { text: "They are unlike, so the answer is **3x + 4y**." }]),
          q("q5d", "6m + 2n + n − 4m", "2m+3n", [{ text: "m terms: 6m − 4m = 2m." }, { text: "n terms: 2n + n = 3n." }, { text: "Answer: **2m + 3n**." }]),
          q("q5e", "3xy + yz − xy − 2yz − 5", "2xy-yz-5", [{ text: "xy terms: 3xy − xy = 2xy." }, { text: "yz terms: yz − 2yz = −yz." }, { text: "The −5 has no like term. Answer: **2xy − yz − 5**." }]),
          q("q5f", "5p² − 2q² + 2p² − 3q²", "7p^2-5q^2", [{ text: "p² terms: 5p² + 2p² = 7p²." }, { text: "q² terms: −2q² − 3q² = −5q²." }, { text: "Answer: **7p² − 5q²**." }])
        ]
      },
      {
        id: "q6", title: "What is missing?", instruction: "Find the missing expression.",
        questions: [
          q("q6a", "What should be added to 9x to get 15x?", "6x", [{ text: "15x − 9x = 6x." }]),
          q("q6b", "What should be added to p to get p + q?", "q", [{ text: "p + ? = p + q. The missing part is q." }]),
          q("q6c", "What should be subtracted from 12a to get 5a?", "7a", [{ text: "12a − ? = 5a, so ? = 12a − 5a." }, { text: "Answer: **7a**." }]),
          q("q6d", "What should be subtracted from 3x to get 3x − 2y?", "2y", [{ text: "3x − ? = 3x − 2y. Compare the two sides." }, { text: "Answer: **2y**." }])
        ]
      },
      {
        id: "q7", title: "Obstacle course", instruction: "Same answer both ways? If not, start again.",
        questions: [course("q7a", "top", TOP), course("q7b", "bottom", LOW),
          { id: "q7c", prompt: "Did both paths finish with the same answer?", parts: [ch("v", "", ["Yes, both give 9x", "No"], "Yes, both give 9x")],
            help: [{ text: "Top path ends at 9x. Bottom path ends at 9x too." }] }]
      }
    ]
  });
})();
