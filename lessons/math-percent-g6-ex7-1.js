/*
  Exercise 7.1: Fractions, decimals and percents; one quantity as a percent of another.
  Source: Vedanta Excel in Mathematics, Book 6, pages 125-127.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var F = Practice.fr, D = Practice.dec, L = "abcdefghijklmnop";
  function nm(id, label, answer, extra) { var o = { id: id, label: label, type: "number", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function pcF(id, label, answer, extra) { return nm(id, label, answer, Object.assign({ unit: "%" }, extra || {})); }
  function fq(id, label, answer, extra) { var o = { id: id, label: label, type: "frac", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function dq(id, label, answer) { return { id: id, label: label, type: "dec", answer: answer }; }
  function r2(x) { return Math.round(x * 100) / 100; }
  // part as a percent of whole, with the working
  function pctOf(part, whole) { return r2(part / whole * 100); }
  function line(part, whole, what) {
    var p = pctOf(part, whole), v = F.of(part + "/" + whole);
    return (what ? what + ": " : "") + part + "/" + whole + " × 100% = " + (F.str(v) !== part + "/" + whole ? F.str(v) + " × 100% = " : "") + p + "%" + (Math.abs(p - part / whole * 100) > 1e-9 ? " (rounded)" : "") + ".";
  }
  // fraction to percent
  function f2p(t) {
    var v = F.of(t), p = v[0] * 100 / v[1], k = 100 % v[1] === 0 ? 100 / v[1] : 0;
    return { p: p, say: k ? t + " = " + v[0] + " × " + k + " / " + v[1] + " × " + k + " = " + v[0] * k + "/100 = " + v[0] * k + "%." : t + " × 100% = " + p + "%." };
  }
  function many(id, prompt, items, mk) {
    var rs = items.map(mk);
    return { id: id, prompt: prompt, parts: rs.map(function (r, i) { return r.part(L[i]); }),
      help: rs.map(function (r) { return { text: r.say }; }).concat([{ text: "Answer: **" + rs.map(function (r) { return r.show; }).join(", ") + "**." }]) };
  }
  function fracToPct(t) { var r = f2p(t); return { say: r.say, show: r.p + "%", part: function (id) { return pcF(id, t + " =", r.p); } }; }
  function decToPct(d) { var p = r2(parseFloat(d) * 100); return { say: d + " × 100% = " + p + "% (move the point 2 places to the right).", show: p + "%", part: function (id) { return pcF(id, d + " =", p); } }; }
  function pctToFrac(lowest) {
    return function (p) {
      var v = F.of(p + "/100"), s = F.str(v);
      return { say: p + "% = " + p + "/100" + (s !== p + "/100" ? " = " + s + " (divide both by " + p / v[0] + ")" : "") + ".", show: lowest ? s : p + "/100" + (s !== p + "/100" ? " = " + s : ""),
        part: function (id) { return fq(id, p + "% =", s, lowest ? { lowest: true } : {}); } };
    };
  }
  function pctToDec(p) { var d = D.str(F.of(p + "/100")); return { say: p + "% = " + p + "/100 = " + d + ".", show: d, part: function (id) { return dq(id, p + "% =", d); } }; }
  // "x as a percent of y" questions
  function asPct(id, prompt, part, whole, intro) {
    var p = pctOf(part, whole);
    return { id: id, prompt: prompt, parts: [pcF("v", "", p, Math.abs(p - part / whole * 100) > 1e-9 ? { tolerance: 0.01 } : {})],
      help: (intro || []).map(function (t) { return { text: t }; }).concat([{ text: "Percent = part/whole × 100%." }, { text: line(part, whole) }, { text: "Answer: **" + p + "%**." }]) };
  }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function table(cws, rows, extra) { var o = { type: "grid", cws: cws, rows: rows }; for (var k in extra || {}) o[k] = extra[k]; return o; }

  var DAYS = [["Sunday", 20], ["Monday", 23], ["Tuesday", 18], ["Wednesday", 25], ["Thursday", 21], ["Friday", 19]];
  var SUBJ = [["English", 40, 34], ["Nepali", 20, 15], ["Maths", 50, 45], ["Science", 25, 21]];

  Practice.register({
    id: "math-percent-g6-ex7-1",
    subject: "Mathematics",
    unit: "Percent",
    title: "Exercise 7.1",
    topic: "Fractions, decimals and percents",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 125–127",

    reference: {
      title: "Percent means out of 100",
      columns: ["Idea", "Example"],
      rows: [
        ["Fraction → percent: × 100%", "3/4 = 3/4 × 100% = 75%"],
        ["Or make the denominator 100", "9/20 = 45/100 = 45%"],
        ["Decimal → percent: × 100 (point 2 places right)", "0.06 = 6%"],
        ["Percent → fraction: write over 100, then reduce", "45% = 45/100 = 9/20"],
        ["Percent → decimal: ÷ 100 (point 2 places left)", "61% = 0.61"],
        ["Part as a percent of a whole", "6 of 15 = 6/15 × 100% = 40%"],
        ["Use the same unit for both", "250 g of 1 kg = 250/1000 × 100% = 25%"],
        ["The parts add up to 100%", "40% girls → 60% boys"],
        ["How to type", "Percents as a number (75). Fractions like 9/20. Decimals like 0.61."]
      ]
    },

    sections: [
      { id: "q1", title: "Water in fruits", instruction: "Read the bar graph. Each line is 10%.",
        questions: [{ id: "q1a", prompt: "The graph shows the water in some fruits and vegetables. Read the percentage of water in each.",
          figure: { type: "bars", max: 100, step: 10, unit: "%", ylabel: "Water content", xlabel: "Fruits", bars: [["Orange", 90, "b"], ["Cucumber", 95, "a"], ["Apple", 89, "b"], ["Grapes", 74, "a"], ["Potato", 70, "c"]] },
          parts: [pcF("a", "a) Orange", 90, { tolerance: 2 }), pcF("b", "b) Potato", 70, { tolerance: 2 }), pcF("c", "c) Cucumber", 95, { tolerance: 2 }), pcF("d", "d) Apple", 89, { tolerance: 2 }), pcF("e", "e) Grapes", 74, { tolerance: 2 })],
          help: [{ text: "Go from the top of each bar straight across to the numbers on the left. Each line is 10%, so a bar halfway between two lines is 5% more." },
            { text: "Orange reaches the 90% line. Potato reaches the 70% line." },
            { text: "Cucumber is about halfway between 90% and 100%: about 95%. Apple is just under 90%. Grapes are a little under 75%." },
            { text: "Answer: **orange 90%, potato 70%, cucumber about 95%, apple about 89%, grapes about 74%** (answers within 2% are accepted)." }] }] },
      { id: "q2", title: "Quick conversions", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          many("q2a", "Convert these fractions into percents.", ["1/2", "1/4", "1/5", "1/10"], fracToPct),
          many("q2b", "Convert these decimals into percents.", ["0.05", "0.27", "0.45", "0.99"], decToPct),
          many("q2c", "Convert these percents into fractions.", [7, 36, 76, 89], pctToFrac(false)),
          many("q2d", "Convert these percents into decimals.", [4, 25, 61, 88], pctToDec)
        ] },
      { id: "q3", title: "Fractions and decimals to percents", instruction: "Creative Section A.",
        questions: [
          many("q3a", "Convert into percents.", ["3/4", "4/5", "7/10", "9/20", "12/25", "43/50"], fracToPct),
          many("q3b", "Convert into percents.", ["0.06", "0.33", "0.45", "0.62", "0.75", "0.93"], decToPct)
        ] },
      { id: "q4", title: "Percents to fractions in lowest terms", instruction: "Write over 100, then reduce.",
        questions: [many("q4a", "Convert into fractions in lowest terms.", [20, 25, 45, 64, 75, 80], pctToFrac(true))] },
      { id: "q5", title: "Part of a whole as a percent", instruction: "Use the same unit for the part and the whole.",
        questions: [
          asPct("q5a", "**5** as a percent of **10**", 5, 10),
          asPct("q5b", "**6** as a percent of **15**", 6, 15),
          asPct("q5c", "**Rs 40** as a percent of **Rs 250**", 40, 250),
          asPct("q5d", "**60 marks** as a percent of **75 marks**", 60, 75),
          asPct("q5e", "**9 months** as a percentage of **a year**", 9, 12, ["1 year = 12 months."]),
          asPct("q5f", "**250 g** as a percentage of **1 kg**", 250, 1000, ["1 kg = 1000 g, so compare 250 g with 1000 g."])
        ] },
      { id: "q6", title: "Express as percents", instruction: "Part ÷ whole × 100%.",
        questions: [
          asPct("q6a", "**4** out of **20**", 4, 20),
          asPct("q6b", "**60 marks** out of **80** full marks", 60, 80),
          asPct("q6c", "**15 girls** out of **75 pupils**", 15, 75),
          asPct("q6d", "**Rs 120** out of **Rs 480**", 120, 480)
        ] },
      { id: "q7", title: "Fractions of people and money", instruction: "Change the fraction to a percent, then subtract from 100%.",
        questions: [
          { id: "q7a", prompt: "**2/5** of the students of a school are girls. What percentage of the students are (i) girls (ii) boys?",
            parts: [pcF("g", "(i) Girls", 40), pcF("b", "(ii) Boys", 60)],
            help: [{ text: "Girls: 2/5 × 100% = 40%." }, { text: "All the students are 100%, so boys = 100% − 40% = 60%." }, { text: "Answer: **girls 40%, boys 60%**." }] },
          { id: "q7b", prompt: "Mrs. Pyakurel spends **13/20** of her monthly income every month. What percentage of the income does she (i) spend (ii) save?",
            parts: [pcF("s", "(i) Spends", 65), pcF("v", "(ii) Saves", 35)],
            help: [{ text: "Spends: 13/20 = 65/100 = 65%." }, { text: "Saves: 100% − 65% = 35%." }, { text: "Answer: **spends 65%, saves 35%**." }] }
        ] },
      { id: "q8", title: "Students, marks and earnings", instruction: "Find the whole first if it is not given.",
        questions: [
          { id: "q8a", prompt: "There are **360 students** in a school. **198** of them are boys. Find the percentage of (i) boys (ii) girls.",
            parts: [pcF("b", "(i) Boys", 55), pcF("g", "(ii) Girls", 45)],
            help: [{ text: line(198, 360, "Boys") }, { text: "Girls: 100% − 55% = 45% (or 162/360 × 100% = 45%)." }, { text: "Answer: **boys 55%, girls 45%**." }] },
          { id: "q8b", prompt: "In the S.E.E. examination, Bishwant got **640** marks out of **800** full marks. (i) Write his marks and full marks as a fraction. (ii) Express his marks as a percent.",
            parts: [fq("f", "(i) Fraction", "640/800"), pcF("p", "(ii) Percent", 80)],
            help: [{ text: "Marks over full marks: 640/800 (= 4/5)." }, { text: "640/800 × 100% = 4/5 × 100% = 80%." }, { text: "Answer: **640/800 = 4/5, and 80%**." }] },
          { id: "q8c", prompt: "There are **240 girls** and **260 boys** in a school.",
            parts: [nm("t", "(i) Total students", 500), fq("g", "(ii) Girls / total", "240/500"), fq("b", "(iii) Boys / total", "260/500"), pcF("pg", "(iv) Percent girls", 48), pcF("pb", "(v) Percent boys", 52)],
            help: [{ text: "Total = 240 + 260 = 500." }, { text: "Girls: 240/500. Boys: 260/500." }, { text: line(240, 500, "Girls") + " " + line(260, 500, "Boys") }, { text: "Answer: **500; 240/500; 260/500; 48%; 52%**." }] },
          { id: "q8d", prompt: "Mrs. Rawal earns **Rs 374** from business and **Rs 306** from a job every day. Express her earnings from each as a percent.",
            parts: [pcF("b", "Business", 55), pcF("j", "Job", 45)],
            help: [{ text: "Total earnings = 374 + 306 = Rs 680." }, { text: line(374, 680, "Business") }, { text: line(306, 680, "Job") }, { text: "Answer: **business 55%, job 45%**." }] }
        ] },
      { id: "q9", title: "Animals on a farm", instruction: "Creative Section B.",
        questions: [
          { id: "q9a", prompt: "Students visited an animal farm and recorded the animals. Express each animal as a percent of the total.",
            figure: table([110, 90], [["Animals", "Number"], ["Cow", "24"], ["Buffalo", "16"], ["Goat", "40"]]),
            parts: [pcF("c", "Cow", 30), pcF("b", "Buffalo", 20), pcF("g", "Goat", 50)],
            help: [{ text: "Total animals = 24 + 16 + 40 = 80." }, { text: line(24, 80, "Cow") + " " + line(16, 80, "Buffalo") + " " + line(40, 80, "Goat") }, { text: "Check: 30 + 20 + 50 = 100 ✓" }, { text: "Answer: **cow 30%, buffalo 20%, goat 50%**." }] }] },
      { id: "q10", title: "Students present", instruction: "Each student is 4% of 25.",
        questions: [
          { id: "q10a", prompt: "There are **25 students** in a class. Express the number of students present each day as a percent, and find the percentage absent.",
            figure: table([96, 64, 64, 64, 90, 76, 60], [["Days", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], ["Present"].concat(DAYS.map(function (d) { return String(d[1]); }))]),
            parts: DAYS.map(function (d, i) { return pcF("p" + i, d[0] + " present", d[1] * 4); }).concat(DAYS.map(function (d, i) { return pcF("a" + i, d[0] + " absent", 100 - d[1] * 4); })),
            help: [{ text: "Out of 25: each student is 100% ÷ 25 = 4%. So multiply the number present by 4." },
              { text: DAYS.map(function (d) { return d[0] + ": " + d[1] + " × 4 = " + d[1] * 4 + "%"; }).join(". ") + "." },
              { text: "Absent = 100% − present: " + DAYS.map(function (d) { return d[0] + " " + (100 - d[1] * 4) + "%"; }).join(", ") + "." },
              { text: "Answer: **present " + DAYS.map(function (d) { return d[1] * 4 + "%"; }).join(", ") + "; absent " + DAYS.map(function (d) { return (100 - d[1] * 4) + "%"; }).join(", ") + "**." }] }] },
      { id: "q11", title: "Progress report", instruction: "Marks obtained ÷ full marks × 100%.",
        questions: [
          { id: "q11a", prompt: "Look at Dipti Shah's monthly progress report. (a) Express her marks in every subject as a percent. (b) In which subject did she do best? (c) Find the percent of her total marks out of the total full marks.",
            figure: table([100, 100, 130], [["Subjects", "Full Marks", "Marks Obtained"]].concat(SUBJ.map(function (s) { return [s[0], String(s[1]), String(s[2])]; }))),
            parts: SUBJ.map(function (s, i) { return pcF("s" + i, s[0], s[2] / s[1] * 100); })
              .concat([ch("best", "(b) Best subject", SUBJ.map(function (s) { return s[0]; }), "Maths"), pcF("tot", "(c) Total", 85.19, { tolerance: 0.02 })]),
            help: [{ text: SUBJ.map(function (s) { return s[0] + ": " + s[2] + "/" + s[1] + " × 100% = " + s[2] / s[1] * 100 + "%"; }).join(". ") + "." },
              { text: "The highest percent is Maths, 90%." },
              { text: "Total marks = 34 + 15 + 45 + 21 = 115. Total full marks = 40 + 20 + 50 + 25 = 135." },
              { text: "115/135 × 100% = 85.185…% ≈ 85.19%." },
              { text: "Answer: **85%, 75%, 90%, 84%; Maths; about 85.19%**." }] }
        ] }
    ]
  });
})();
