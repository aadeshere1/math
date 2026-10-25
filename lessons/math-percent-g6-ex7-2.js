/*
  Exercise 7.2: Percent of a quantity, finding the whole, profit, loss and discount.
  Source: Vedanta Excel in Mathematics, Book 6, pages 130-133.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, extra) { var o = { id: id, label: label, type: "number", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function pcF(id, label, answer, extra) { return nm(id, label, answer, Object.assign({ unit: "%" }, extra || {})); }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function fmt(n) { return String(Math.round(n * 100) / 100); }
  // p% of q, with working
  function ofLine(p, q) { return p + "% of " + q + " = " + p + "/100 × " + q + " = " + fmt(p * q / 100) + "."; }
  function ofQ(id, p, q, unit, pre) {
    var r = p * q / 100;
    return { id: id, prompt: "**" + p + "% of " + (pre || "") + q + (unit ? " " + unit : "") + "**", parts: [nm("v", pre ? pre.trim() : "", r, unit ? { unit: unit } : {})],
      help: [{ text: p + "% means " + p + "/100, and \"of\" means ×." }, { text: ofLine(p, q) }, { text: "Answer: **" + (pre || "") + fmt(r) + (unit ? " " + unit : "") + "**." }] };
  }
  // three quick "p% of" answers in one question
  function quickOf(id, p, qs) {
    return { id: id, prompt: qs.map(function (q) { return "**" + p + "% of " + q + "**"; }).join(",  "),
      parts: qs.map(function (q, i) { return nm(L[i], p + "% of " + q + " =", p * q / 100); }),
      help: [{ text: p + "% = " + p + "/100" + (100 % p === 0 ? " = 1/" + 100 / p + ", so divide by " + 100 / p : "") + "." }]
        .concat(qs.map(function (q) { return { text: ofLine(p, q) }; }))
        .concat([{ text: "Answer: **" + qs.map(function (q) { return fmt(p * q / 100); }).join(", ") + "**." }]) };
  }
  // p% of a number is v: the number = v/p × 100
  function wholeLine(p, v) { return "The whole = " + v + " ÷ " + p + "/100 = " + v + "/" + p + " × 100 = " + fmt(v * 100 / p) + "."; }
  function whole(id, prompt, p, v, unit, pre) {
    var r = v * 100 / p;
    return { id: id, prompt: prompt, parts: [nm("v", pre || "", r, unit ? { unit: unit } : {})],
      help: [{ text: "Let the whole be x. Then " + p + "% of x = " + v + ", so " + p + "/100 × x = " + v + "." }, { text: wholeLine(p, v) },
        { text: "Check: " + p + "% of " + fmt(r) + " = " + fmt(p * r / 100) + " ✓" }, { text: "Answer: **" + (pre ? pre + " " : "") + fmt(r) + (unit ? " " + unit : "") + "**." }] };
  }
  // multi-part story: parts [label, answer, unit?], steps [text]
  function story(id, prompt, parts, steps) {
    return { id: id, prompt: prompt, parts: parts.map(function (p, i) { return typeof p[1] === "string" ? ch(L[i], p[0], p[2], p[1]) : nm(L[i], p[0], p[1], p[2] ? { unit: p[2] } : {}); }),
      help: steps.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + parts.map(function (p) { return (typeof p[1] === "number" ? fmt(p[1]) : p[1]) + (p[2] && typeof p[2] === "string" ? " " + p[2] : ""); }).join("; ") + "**." }]) };
  }

  Practice.register({
    id: "math-percent-g6-ex7-2",
    subject: "Mathematics",
    unit: "Percent",
    title: "Exercise 7.2",
    topic: "Percent of a quantity",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 130–133",

    reference: {
      title: "Percent of a quantity",
      columns: ["Idea", "Example"],
      rows: [
        ["p% of a quantity = p/100 × quantity", "12% of Rs 450 = 12/100 × 450 = Rs 54"],
        ["10% = 1/10, 20% = 1/5, 25% = 1/4, 50% = 1/2", "25% of 60 = 60 ÷ 4 = 15"],
        ["p% of a number is v → number = v/p × 100", "20% of x is 5 → x = 5/20 × 100 = 25"],
        ["The other part is 100% − p%", "55% girls → 45% boys"],
        ["Profit = S.P. − C.P.; Loss = C.P. − S.P.", "C.P. 900, 20% profit → profit Rs 180"],
        ["Discount = p% of marked price; S.P. = M.P. − discount", "10% of Rs 1250 = Rs 125, pay Rs 1125"],
        ["How to type", "Numbers only. The unit is shown beside the box."]
      ]
    },

    sections: [
      { id: "q1", title: "Quick percents of numbers", instruction: "10% of 50 = 1/10 of 50 = 5.",
        questions: [quickOf("q1a", 10, [40, 60, 200]), quickOf("q1b", 20, [50, 80, 150]), quickOf("q1c", 25, [60, 120, 400]), quickOf("q1d", 50, [30, 70, 500])] },
      { id: "q2", title: "Find the number", instruction: "20% of a number is 5, so the number = 5/20 × 100 = 25.",
        questions: [[10, 4], [20, 10], [25, 5], [50, 20]].map(function (x, i) { return whole("q2" + L[i], "**" + x[0] + "%** of a number is **" + x[1] + "**. Find the number.", x[0], x[1]); }) },
      { id: "q3", title: "Find the value", instruction: "Creative Section A.",
        questions: [ofQ("q3a", 5, 300, "", "Rs "), ofQ("q3b", 12, 450, "", "Rs "), ofQ("q3c", 33, 700, "", "Rs "), ofQ("q3d", 56, 450, "girls"), ofQ("q3e", 75, 720, "boys"), ofQ("q3f", 99, 1500, "people")] },
      { id: "q4", title: "Find the whole quantity", instruction: "Divide by the percent, then multiply by 100.",
        questions: [
          whole("q4a", "**6%** of a sum is **Rs 24**. Find the sum.", 6, 24, "", "Rs"),
          whole("q4b", "**10%** of a sum is **Rs 64**. Find the sum.", 10, 64, "", "Rs"),
          whole("q4c", "**25%** of the people are **220 men**. How many people are there?", 25, 220, "people"),
          whole("q4d", "**48%** of the students are **336 girls**. How many students are there?", 48, 336, "students"),
          whole("q4e", "**55%** of an income is **Rs 2,420**. Find the income.", 55, 2420, "", "Rs"),
          whole("q4f", "**75%** of a saving is **Rs 2,700**. Find the saving.", 75, 2700, "", "Rs")
        ] },
      { id: "q5", title: "Marks, students and money", instruction: "Find the percent of the whole.",
        questions: [
          story("q5a", "Bimala got **85%** marks in the S.E.E. examination. The total full marks was **800**. How many marks did she get?", [["Marks", 680]], [ofLine(85, 800)]),
          story("q5b", "There are **40 students** in class six. **30%** of them are girls. How many are (i) girls (ii) boys?", [["(i) Girls", 12], ["(ii) Boys", 28]], [ofLine(30, 40), "Boys = 40 − 12 = 28."]),
          story("q5c", "Out of **40 students** of grade VI, **80%** attend their virtual classes in Zoom regularly. How many students are **not** attending?", [["Not attending", 8]], ["Not attending = 100% − 80% = 20%.", ofLine(20, 40)]),
          story("q5d", "Mrs. Bhatta earns **Rs 5,400** and spends **65%** every week. How much does she (i) spend every week (ii) save every week (iii) save in 1 year (52 weeks)?",
            [["(i) Spends (Rs)", 3510], ["(ii) Saves (Rs)", 1890], ["(iii) Saves in a year (Rs)", 98280]],
            [ofLine(65, 5400), "Saving = 5400 − 3510 = Rs 1890 (or 35% of 5400).", "In 52 weeks: 1890 × 52 = Rs 98,280."]),
          story("q5e", "Father earns **Rs 21,600** a month. He spends **15%** on his children's education and **25%** on food. (i) Find his total expense on education and food. (ii) How much does he save in a month? (iii) How much does he save in 1 year? (iv) He spends **80%** of his annual saving on a piece of land. What is the cost of the land?",
            [["(i) Expense (Rs)", 8640], ["(ii) Saves a month (Rs)", 12960], ["(iii) Saves a year (Rs)", 155520], ["(iv) Land (Rs)", 124416]],
            ["Education: " + ofLine(15, 21600) + " Food: " + ofLine(25, 21600), "Total expense = 3240 + 5400 = Rs 8,640 (that is 40%).", "Saving a month = 21600 − 8640 = Rs 12,960.", "Saving a year = 12960 × 12 = Rs 1,55,520.", "Land = " + ofLine(80, 155520)])
        ] },
      { id: "q6", title: "Profit and loss", instruction: "Profit or loss is a percent of the cost price.",
        questions: [
          story("q6a", "A shopkeeper buys a watch for **Rs 900** and sells it at **20% profit**. Find the profit.", [["Profit (Rs)", 180]], ["Profit = 20% of Rs 900.", ofLine(20, 900)]),
          story("q6b", "Mr. Chaudhari buys a mountain bike for **Rs 15,300** and sells it at a profit of **10%**. (i) How much profit does he make? (ii) At what price does he sell it?",
            [["(i) Profit (Rs)", 1530], ["(ii) Selling price (Rs)", 16830]], [ofLine(10, 15300), "Selling price = C.P. + profit = 15300 + 1530 = Rs 16,830."]),
          story("q6c", "Mrs. Gurung bought a mobile phone for **Rs 7,200** and sold it at a loss of **25%**. Find her loss.", [["Loss (Rs)", 1800]], [ofLine(25, 7200)]),
          story("q6d", "A man bought a piece of land for **Rs 4,50,000** and sold it at a loss of **5%**. (i) Find his loss. (ii) At what price did he sell the land?",
            [["(i) Loss (Rs)", 22500], ["(ii) Selling price (Rs)", 427500]], [ofLine(5, 450000), "Selling price = C.P. − loss = 450000 − 22500 = Rs 4,27,500."])
        ] },
      { id: "q7", title: "Discount", instruction: "Discount is a percent of the marked price.",
        questions: [
          story("q7a", "The marked price of a pen drive is **Rs 1,250** and the shopkeeper gives a **10% discount**. (i) How much is the discount? (ii) How much do you pay?",
            [["(i) Discount (Rs)", 125], ["(ii) You pay (Rs)", 1125]], [ofLine(10, 1250), "Pay = 1250 − 125 = Rs 1,125."]),
          story("q7b", "For the Dashain festival, a **20% discount** was given on each item: shoes **Rs 1,500**, T-shirt **Rs 1,150**, mobile **Rs 5,000**. Find the discount and the selling price of each.",
            [["Shoes: discount (Rs)", 300], ["Shoes: S.P. (Rs)", 1200], ["T-shirt: discount (Rs)", 230], ["T-shirt: S.P. (Rs)", 920], ["Mobile: discount (Rs)", 1000], ["Mobile: S.P. (Rs)", 4000]],
            ["Shoes: " + ofLine(20, 1500) + " S.P. = 1500 − 300 = Rs 1,200.", "T-shirt: " + ofLine(20, 1150) + " S.P. = 1150 − 230 = Rs 920.", "Mobile: " + ofLine(20, 5000) + " S.P. = 5000 − 1000 = Rs 4,000."])
        ] },
      { id: "q8", title: "Find the whole", instruction: "Whole = value ÷ percent × 100.",
        questions: [
          whole("q8a", "**20%** of a man's income is **Rs 4,800**. Find his income.", 20, 4800, "", "Rs"),
          whole("q8b", "Mr. Subba walked **24 km**, which is **75%** of the distance between Phikkal and Ilam. Find the distance between these two places.", 75, 24, "km"),
          whole("q8c", "There are **120 girls** in a school, which is **30%** of all the students. How many students are there?", 30, 120, "students"),
          whole("q8d", "Saloni Rai got **30 marks** in mathematics. This is **75%** of the full marks. What are the full marks?", 75, 30, "marks")
        ] },
      { id: "q9", title: "Using the other part", instruction: "The two parts add up to 100%.",
        questions: [
          story("q9a", "**55%** of the students in a school are girls. There are **135 boys**. Find (i) the total number of students (ii) the number of girls.",
            [["(i) Total students", 300], ["(ii) Girls", 165]], ["Boys are 100% − 55% = 45%. So 45% of the total is 135.", wholeLine(45, 135), "Girls = 300 − 135 = 165."]),
          story("q9b", "Mrs. Gurung spends **60%** of her monthly income and saves **Rs 8,240** every month. (i) Find her saving percent. (ii) Find her monthly income. (iii) How much does she spend in a month?",
            [["(i) Saving", 40, "%"], ["(ii) Income (Rs)", 20600], ["(iii) Spends (Rs)", 12360]], ["Saving = 100% − 60% = 40%.", "40% of income = 8240. " + wholeLine(40, 8240), "Spends = 20600 − 8240 = Rs 12,360."])
        ] },
      { id: "q10", title: "Spelling test", instruction: "Creative Section B.",
        questions: [{ id: "q10a", prompt: "Pragya got **21** marks out of **25** in a spelling test. Pooja got **80%** in the same test. Who got more marks? By what percent were the higher marks more than the lower marks?",
          parts: [ch("who", "Who got more?", ["Pragya", "Pooja"], "Pragya"), pcF("by", "More by", 5, { alt: [4] })],
          help: [{ text: "Pooja: 80% of 25 = 20 marks. Pragya: 21 marks (= 21/25 × 100% = 84%)." }, { text: "Pragya got more, by 21 − 20 = 1 mark." },
            { text: "As a percent of the lower marks: 1/20 × 100% = 5%. (Comparing the percents directly, 84% − 80% = 4 percentage points, is also accepted.)" }, { text: "Answer: **Pragya, by 5%**." }] }] },
      { id: "q11", title: "10 and 10%", instruction: "10% means 10/100.",
        questions: [{ id: "q11a", prompt: "Are the numbers **10** and **10%** the same? By what percent is the smaller number less than the greater one?",
          parts: [ch("same", "Same?", ["Yes", "No"], "No"), { id: "dec", label: "10% as a decimal", type: "dec", answer: "0.1" }, pcF("by", "Smaller by", 99)],
          help: [{ text: "10% = 10/100 = 0.1, which is much smaller than 10. So they are not the same." }, { text: "Difference = 10 − 0.1 = 9.9." }, { text: "9.9/10 × 100% = 99%." }, { text: "Answer: **No; 10% = 0.1; it is 99% less than 10**." }] }] },
      { id: "q12", title: "A+ grade", instruction: "Find the marks first, then the percent.",
        questions: [story("q12a", "In a mathematics mock test the full marks are **80**. Bodhraj gets **85%** and misses an A⁺ grade by **4 marks**. Find (a) the least marks for A⁺ (b) the least percent for A⁺.",
          [["(a) Least marks", 72], ["(b) Least percent", 90, "%"]], ["Bodhraj's marks: " + ofLine(85, 80), "He needs 4 more: 68 + 4 = 72 marks.", "72/80 × 100% = 90%."])] },
      { id: "q13", title: "Spectacles", instruction: "Find the boys and girls first.",
        questions: [story("q13a", "Out of **50 students** in a class, **60%** are boys. **50%** of the boys and **40%** of the girls wear spectacles. Find (a) the number of boys and girls (b) the boys and girls who wear spectacles (c) the students who wear spectacles (d) the percentage of all students who wear spectacles.",
          [["(a) Boys", 30], ["(a) Girls", 20], ["(b) Boys with spectacles", 15], ["(b) Girls with spectacles", 8], ["(c) Students with spectacles", 23], ["(d) Percent", 46, "%"]],
          [ofLine(60, 50) + " Girls = 50 − 30 = 20.", "Boys with spectacles: " + ofLine(50, 30) + " Girls: " + ofLine(40, 20), "Total = 15 + 8 = 23.", "23/50 × 100% = 46%."])] },
      { id: "q14", title: "Who earns more?", instruction: "Saving percent = 100% − spending percent.",
        questions: [story("q14a", "Shreyasha spends **40%** of her income and saves **Rs 18,000** a month. Sahayata spends **60%** of her income and saves **Rs 12,800** a month. (a) Who has more monthly income? (b) Who spends more money, and by how much?",
          [["Shreyasha's income (Rs)", 30000], ["Sahayata's income (Rs)", 32000], ["(a) More income", "Sahayata", ["Shreyasha", "Sahayata"]], ["(b) Spends more", "Sahayata", ["Shreyasha", "Sahayata"]], ["(b) By (Rs)", 7200]],
          ["Shreyasha saves 60%: 60% of income = 18000, so income = 18000/60 × 100 = Rs 30,000.", "Sahayata saves 40%: 40% of income = 12800, so income = 12800/40 × 100 = Rs 32,000. Sahayata earns more.",
            "Spending: Shreyasha 30000 − 18000 = Rs 12,000; Sahayata 32000 − 12800 = Rs 19,200.", "Sahayata spends more, by 19200 − 12000 = Rs 7,200."])] }
    ]
  });
})();
