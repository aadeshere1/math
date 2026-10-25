/*
  Exercise 9.1: Profit, loss and discount.
  Source: Vedanta Excel in Mathematics, Book 6, pages 142-144.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, extra) { var o = { id: id, label: label, type: "number", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function q(id, prompt, parts, steps) {
    return { id: id, prompt: prompt, parts: parts.map(function (p, i) { return typeof p[1] === "string" ? ch(L[i], p[0], p[2], p[1]) : nm(L[i], p[0], p[1]); }),
      help: steps.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + parts.map(function (p) { return (typeof p[1] === "number" ? "Rs " : "") + p[1]; }).join("; ") + "**." }]) };
  }
  // one quick fact: given two of C.P., S.P., profit/loss, discount, M.P.
  function quick(id, given, ask, ans, rule) { return q(id, "**" + given + "**. Find the " + ask + ".", [[ask.charAt(0).toUpperCase() + ask.slice(1) + " (Rs)", ans]], [rule]); }
  function pl(id, cp, sp) {
    var prof = sp > cp, amt = Math.abs(sp - cp);
    return { id: id, prompt: "**C.P. = Rs " + cp + ", S.P. = Rs " + sp + "**. Is there a profit or a loss? How much?",
      parts: [ch("k", "", ["Profit", "Loss"], prof ? "Profit" : "Loss"), nm("v", "Amount (Rs)", amt)],
      help: [{ text: "S.P. is " + (prof ? "more" : "less") + " than C.P., so there is a " + (prof ? "profit" : "loss") + "." }, { text: (prof ? "Profit = S.P. − C.P. = " + sp + " − " + cp : "Loss = C.P. − S.P. = " + cp + " − " + sp) + " = Rs " + amt + "." }, { text: "Answer: **" + (prof ? "profit" : "loss") + " of Rs " + amt + "**." }] };
  }

  Practice.register({
    id: "math-profit-g6-ex9-1",
    subject: "Mathematics",
    unit: "Profit and loss",
    title: "Exercise 9.1",
    topic: "Profit, loss and discount",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 142–144",

    reference: {
      title: "Profit, loss and discount",
      columns: ["Rule", "Example"],
      rows: [
        ["C.P. = cost price (buying price); S.P. = selling price", ""],
        ["S.P. > C.P.: Profit = S.P. − C.P.", "C.P. 20, S.P. 25 → profit Rs 5"],
        ["S.P. < C.P.: Loss = C.P. − S.P.", "C.P. 68, S.P. 60 → loss Rs 8"],
        ["S.P. = C.P. + profit, or C.P. − loss", "C.P. 30, profit 5 → S.P. 35"],
        ["C.P. = S.P. − profit, or S.P. + loss", "S.P. 72, loss 8 → C.P. 80"],
        ["M.P. = marked price; S.P. = M.P. − discount", "M.P. 100, discount 10 → S.P. 90"],
        ["Discount = M.P. − S.P.", "M.P. 450, S.P. 400 → discount Rs 50"],
        ["Extra costs (repairs) are added to the C.P.", "1200 + 40 = Rs 1240"],
        ["Useful numbers", "1 dozen = 12 · 1 score = 20 · 1 gross = 12 dozens = 144 · 1 quintal = 100 kg"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick profit and loss", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          quick("q1a", "C.P. = Rs 20, S.P. = Rs 25", "profit", 5, "Profit = S.P. − C.P. = 25 − 20 = Rs 5."),
          quick("q1b", "C.P. = Rs 68, S.P. = Rs 60", "loss", 8, "Loss = C.P. − S.P. = 68 − 60 = Rs 8."),
          quick("q1c", "C.P. = Rs 30, profit = Rs 5", "S.P.", 35, "S.P. = C.P. + profit = 30 + 5 = Rs 35."),
          quick("q1d", "C.P. = Rs 80, loss = Rs 10", "S.P.", 70, "S.P. = C.P. − loss = 80 − 10 = Rs 70."),
          quick("q1e", "S.P. = Rs 50, profit = Rs 6", "C.P.", 44, "C.P. = S.P. − profit = 50 − 6 = Rs 44."),
          quick("q1f", "S.P. = Rs 72, loss = Rs 8", "C.P.", 80, "C.P. = S.P. + loss = 72 + 8 = Rs 80.")
        ] },
      { id: "q2", title: "Quick discounts", instruction: "S.P. = M.P. − discount.",
        questions: [
          quick("q2a", "M.P. = Rs 100, discount = Rs 10", "S.P.", 90, "S.P. = M.P. − discount = 100 − 10 = Rs 90."),
          quick("q2b", "M.P. = Rs 300, discount = Rs 50", "S.P.", 250, "S.P. = 300 − 50 = Rs 250."),
          quick("q2c", "M.P. = Rs 450, S.P. = Rs 400", "discount", 50, "Discount = M.P. − S.P. = 450 − 400 = Rs 50."),
          quick("q2d", "M.P. = Rs 700, S.P. = Rs 660", "discount", 40, "Discount = 700 − 660 = Rs 40.")
        ] },
      { id: "q3", title: "Profit or loss?", instruction: "Creative Section A. Compare S.P. with C.P.",
        questions: [pl("q3a", 50, 65), pl("q3b", 135, 175), pl("q3c", 575, 540), pl("q3d", 780, 750)] },
      { id: "q4", title: "Find C.P. or S.P.", instruction: "Add or subtract the profit or loss.",
        questions: [
          quick("q4a", "C.P. = Rs 120, profit = Rs 25", "S.P.", 145, "S.P. = C.P. + profit = 120 + 25 = Rs 145."),
          quick("q4b", "C.P. = Rs 275, loss = Rs 50", "S.P.", 225, "S.P. = C.P. − loss = 275 − 50 = Rs 225."),
          quick("q4c", "S.P. = Rs 200, profit = Rs 20", "C.P.", 180, "C.P. = S.P. − profit = 200 − 20 = Rs 180."),
          quick("q4d", "S.P. = Rs 600, loss = Rs 45", "C.P.", 645, "C.P. = S.P. + loss = 600 + 45 = Rs 645.")
        ] },
      { id: "q5", title: "Find S.P.", instruction: "S.P. = M.P. − discount.",
        questions: [quick("q5a", "M.P. = Rs 480, discount = Rs 40", "S.P.", 440, "S.P. = 480 − 40 = Rs 440."), quick("q5b", "M.P. = Rs 870, discount = Rs 75", "S.P.", 795, "S.P. = 870 − 75 = Rs 795.")] },
      { id: "q6", title: "Find the discount", instruction: "Discount = M.P. − S.P.",
        questions: [quick("q6a", "M.P. = Rs 380, S.P. = Rs 345", "discount", 35, "Discount = 380 − 345 = Rs 35."), quick("q6b", "M.P. = Rs 1,525, S.P. = Rs 1,500", "discount", 25, "Discount = 1525 − 1500 = Rs 25.")] },
      { id: "q7", title: "Calculator and saree", instruction: "Profit or loss in money.",
        questions: [
          q("q7a", "Mr. Yadav buys a calculator for **Rs 375** and sells it for **Rs 450**. Find his profit.", [["Profit (Rs)", 75]], ["Profit = S.P. − C.P. = 450 − 375 = Rs 75."]),
          q("q7b", "Mrs. Shakya bought a saree for **Rs 1,650** and sold it for **Rs 1,485**. Find her loss.", [["Loss (Rs)", 165]], ["Loss = C.P. − S.P. = 1650 − 1485 = Rs 165."])
        ] },
      { id: "q8", title: "Buying and selling", instruction: "Decide whether to add or subtract.",
        questions: [
          q("q8a", "A shopkeeper sold a camera for **Rs 2,550** and made a loss of **Rs 480**. At what price did he or she buy it?", [["C.P. (Rs)", 3030]], ["With a loss, C.P. is more than S.P.: C.P. = S.P. + loss = 2550 + 480 = Rs 3,030."]),
          q("q8b", "Mr. Sharma bought a bicycle for **Rs 5,995** and sold it at a profit of **Rs 1,001**. At what price did he sell it?", [["S.P. (Rs)", 6996]], ["S.P. = C.P. + profit = 5995 + 1001 = Rs 6,996."]),
          q("q8c", "A stationer sold **1 dozen** pens at **Rs 25 each** and gained **Rs 120** altogether. What was the cost price of the pens?", [["C.P. (Rs)", 180]], ["S.P. of 12 pens = 12 × 25 = Rs 300.", "C.P. = S.P. − profit = 300 − 120 = Rs 180."]),
          q("q8d", "A fruit seller bought **10 kg** of apples at **Rs 75 per kg** and sold them at a total loss of **Rs 50**. What was the selling price of the apples?", [["S.P. (Rs)", 700]], ["C.P. = 10 × 75 = Rs 750.", "S.P. = C.P. − loss = 750 − 50 = Rs 700."])
        ] },
      { id: "q9", title: "Potatoes, bananas and a fan", instruction: "Creative Section B.",
        questions: [
          { id: "q9a", prompt: "A merchant bought **a quintal** of potatoes for **Rs 4,000**. He sold all of them at **Rs 390 per 10 kg**.",
            parts: [nm("a", "(i) kg in 1 quintal", 100, { unit: "kg" }), nm("b", "(ii) S.P. of 1 kg (Rs)", 39), nm("c", "(iii) S.P. of 1 quintal (Rs)", 3900), ch("d", "(iv) Profit or loss?", ["Profit", "Loss"], "Loss"), nm("e", "(v) Amount (Rs)", 100)],
            help: [{ text: "1 quintal = 100 kg." }, { text: "10 kg sell for Rs 390, so 1 kg sells for 390 ÷ 10 = Rs 39." }, { text: "100 kg sell for 39 × 100 = Rs 3,900." },
              { text: "S.P. (3900) is less than C.P. (4000), so it is a loss of 4000 − 3900 = Rs 100." }, { text: "Answer: **100 kg; Rs 39; Rs 3,900; loss; Rs 100**." }] },
          { id: "q9b", prompt: "Mr. Poudel buys **60 bananas** at **Rs 80 per score** and sells all of them at **Rs 60 per dozen**. (1 score = 20)",
            parts: [nm("a", "(i) Scores in 60", 3), nm("b", "(ii) C.P. of all (Rs)", 240), nm("c", "(iii) Dozens in 60", 5), nm("d", "(iv) S.P. of all (Rs)", 300), ch("e", "(v) Profit or loss?", ["Profit", "Loss"], "Profit"), nm("f", "(vi) Amount (Rs)", 60)],
            help: [{ text: "60 ÷ 20 = 3 scores, so C.P. = 3 × 80 = Rs 240." }, { text: "60 ÷ 12 = 5 dozens, so S.P. = 5 × 60 = Rs 300." }, { text: "S.P. is more than C.P., so it is a profit of 300 − 240 = Rs 60." }, { text: "Answer: **3; Rs 240; 5; Rs 300; profit; Rs 60**." }] },
          q("q9c", "A shopkeeper buys a table fan for **Rs 1,200** and spends **Rs 40** on its repair. He sells the fan for **Rs 1,550**. Find his profit.", [["Profit (Rs)", 310]], ["The repair is part of the cost: C.P. = 1200 + 40 = Rs 1,240.", "Profit = 1550 − 1240 = Rs 310."])
        ] },
      { id: "q10", title: "Copies and watches", instruction: "Work with one item.",
        questions: [
          { id: "q10a", prompt: "Mr. Thapa bought **a gross** of copies for **Rs 2,880** and sold them at a profit of **Rs 288**. (1 gross = 12 dozens)",
            parts: [nm("a", "(i) Copies in 1 gross", 144), nm("b", "(ii) C.P. of 1 copy (Rs)", 20), nm("c", "(iii) Profit on 1 copy (Rs)", 2), nm("d", "(iv) S.P. of 1 copy (Rs)", 22)],
            help: [{ text: "1 gross = 12 × 12 = 144 copies." }, { text: "C.P. of 1 copy = 2880 ÷ 144 = Rs 20." }, { text: "Profit on 1 copy = 288 ÷ 144 = Rs 2." }, { text: "S.P. of 1 copy = 20 + 2 = Rs 22." }, { text: "Answer: **144; Rs 20; Rs 2; Rs 22**." }] },
          q("q10b", "A retailer bought **6 watches** for **Rs 3,330** and sold them at a gain of **Rs 111** on each watch. At what price did he sell each watch?", [["S.P. of each (Rs)", 666]], ["C.P. of 1 watch = 3330 ÷ 6 = Rs 555.", "S.P. of 1 watch = 555 + 111 = Rs 666."])
        ] }
    ]
  });
})();
