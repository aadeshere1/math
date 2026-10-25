/*
  Exercise 8.1: Unitary method.
  Source: Vedanta Excel in Mathematics, Book 6, pages 138-140.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, extra) { var o = { id: id, label: label, type: "number", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function fmt(n) { return String(Math.round(n * 100) / 100); }
  function q(id, prompt, parts, steps) {
    return { id: id, prompt: prompt, parts: parts.map(function (p, i) { return typeof p[1] === "string" ? ch(L[i], p[0], p[2], p[1]) : nm(L[i], p[0], p[1], p[2] ? { unit: p[2] } : {}); }),
      help: steps.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + parts.map(function (p) { return (typeof p[1] === "number" ? fmt(p[1]) : p[1]) + (typeof p[2] === "string" ? " " + p[2] : ""); }).join("; ") + "**." }]) };
  }
  // n items cost c: find the cost of m items
  function many(id, prompt, n, c, m, unitName, label, unit) {
    var one = c / n, r = one * m;
    return q(id, prompt, [[label, r, unit]], ["First find the value for 1" + (unitName ? " " + unitName : "") + ": " + c + " ÷ " + n + " = " + fmt(one) + ".", "Then for " + m + ": " + fmt(one) + " × " + m + " = " + fmt(r) + "."]);
  }
  function table(rows) { return { type: "grid", cws: [100, 90, 100, 100, 100], rows: rows }; }
  // Q1 rows: [item, known count, known cost]
  var ROWS = [["Eraser", 1, 4], ["Pencil", 2, 16], ["Pen", 3, 90], ["Copy", 4, 100]];
  function q1(id, row) {
    var u = row[2] / row[1], cells = [row[0]], parts = [], steps = [];
    for (var n = 1; n <= 4; n++) {
      if (n === row[1]) { cells.push("Rs " + row[2]); continue; }
      var k = L[parts.length];
      cells.push("?" + k);
      parts.push(nm(k, (n === 1 ? "Unit cost" : "Cost of " + n) + " (Rs)", u * n));
      if (n > 1) steps.push(u + " × " + n + " = " + u * n);
    }
    return { id: id, prompt: "Fill in the blanks for the **" + row[0].toLowerCase() + "** row.",
      figure: table([["Articles", "Unit cost", "Cost of 2", "Cost of 3", "Cost of 4"], cells]),
      parts: parts,
      help: (row[1] === 1 ? [] : [{ text: "Unit cost = " + row[2] + " ÷ " + row[1] + " = Rs " + u + "." }])
        .concat([{ text: "Multiply the unit cost: " + steps.join(", ") + "." }, { text: "Answer: **" + parts.map(function (p) { return "Rs " + p.answer; }).join(", ") + "**." }]) };
  }
  function frac(id, prompt, t, v, unit, pre) {
    var d = +t.split("/")[1];
    return q(id, prompt, [[pre || "", v * d, unit]], ["The whole is " + d + " parts of " + t + ".", "Whole = " + v + " × " + d + " = " + v * d + "."]);
  }
  function best(id, a, b, unitName, item) {
    var ua = a[1] / a[0], ub = b[1] / b[0], win = ua < ub ? a[2] : b[2];
    return q(id, "Which is the better buy: **" + a[2] + "** or **" + b[2] + "**?", [["Cost of 1 " + unitName + " in the first (Rs)", ua], ["Cost of 1 " + unitName + " in the second (Rs)", ub], ["Better buy", win, [a[2], b[2]]]],
      ["Compare the cost of 1 " + unitName + ".", "First: " + a[1] + " ÷ " + a[0] + " = Rs " + fmt(ua) + ". Second: " + b[1] + " ÷ " + b[0] + " = Rs " + fmt(ub) + ".", "The lower cost for 1 " + unitName + " is the better buy: " + win + "."]);
  }

  Practice.register({
    id: "math-unitary-g6-ex8-1",
    subject: "Mathematics",
    unit: "Unitary method",
    title: "Exercise 8.1",
    topic: "Unitary method",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 138–140",

    reference: {
      title: "Unitary method",
      columns: ["Idea", "Example"],
      rows: [
        ["Find the value of ONE first", "4 copies cost Rs 100 → 1 copy costs 100 ÷ 4 = Rs 25"],
        ["Then multiply for many", "3 copies cost 25 × 3 = Rs 75"],
        ["Total cost = number × unit cost", "9 × Rs 45 = Rs 405"],
        ["Unit cost = total cost ÷ number", "Rs 192 ÷ 8 = Rs 24"],
        ["Number of items = total cost ÷ unit cost", "Rs 210 ÷ 15 = 14"],
        ["Fraction of a whole: whole = value ÷ fraction", "2/3 of the distance is 30 km → whole = 30 × 3/2 = 45 km"],
        ["Better buy: lower cost for 1", "4 pens Rs 56 (Rs 14 each) beats 6 pens Rs 90 (Rs 15 each)"],
        ["Useful numbers", "1 dozen = 12 · 1 score = 20 · 1 gross = 144 · 1 quintal = 100 kg · 1 hour = 60 minutes"]
      ]
    },

    sections: [
      { id: "q1", title: "Cost table", instruction: "Say the answers and write them as quickly as possible.",
        questions: ROWS.map(function (r, i) { return q1("q1" + L[i], r); }) },
      { id: "q2", title: "Find the whole", instruction: "1/2 of a sum is Rs 10, so the sum is 10 × 2.",
        questions: [frac("q2a", "If **1/2** of a sum is **Rs 10**, find the sum.", "1/2", 10, "", "Rs"), frac("q2b", "If **1/3** of a distance is **5 km**, find the distance.", "1/3", 5, "km"), frac("q2c", "If **1/4** of a weight is **3 kg**, find the weight.", "1/4", 3, "kg")] },
      { id: "q3", title: "Total cost", instruction: "Creative Section A. Total cost = number of items × unit cost.",
        questions: [[4, 20], [9, 45], [12, 60.25], [25, 75.5]].map(function (x, i) { return q("q3" + L[i], "**" + x[0] + "** items at **Rs " + fmt(x[1]) + "** each. Find the total cost.", [["Total (Rs)", x[0] * x[1]]], [x[0] + " × " + fmt(x[1]) + " = " + fmt(x[0] * x[1]) + "."]); }) },
      { id: "q4", title: "Unit cost", instruction: "Unit cost = total cost ÷ number of items.",
        questions: [[5, 60], [8, 192], [18, 990], [20, 1110]].map(function (x, i) { return q("q4" + L[i], "**" + x[0] + "** items cost **Rs " + x[1] + "**. Find the unit cost.", [["Unit cost (Rs)", x[1] / x[0]]], [x[1] + " ÷ " + x[0] + " = " + fmt(x[1] / x[0]) + "."]); }) },
      { id: "q5", title: "Number of items", instruction: "Number of items = total cost ÷ unit cost.",
        questions: [[12, 84], [15, 210], [25, 425], [48, 1248]].map(function (x, i) { return q("q5" + L[i], "Unit cost **Rs " + x[0] + "**, total cost **Rs " + x[1] + "**. How many items?", [["Items", x[1] / x[0]]], [x[1] + " ÷ " + x[0] + " = " + x[1] / x[0] + "."]); }) },
      { id: "q6", title: "Best buy", instruction: "Find the cost of 1 in each case.",
        questions: [
          best("q6a", [4, 56, "4 pens for Rs 56"], [6, 90, "6 pens for Rs 90"], "pen"),
          best("q6b", [5, 500, "5 kg rice for Rs 500"], [9, 810, "9 kg rice for Rs 810"], "kg"),
          best("q6c", [12, 120, "1 dozen eggs for Rs 120"], [30, 360, "30 eggs for Rs 360"], "egg")
        ] },
      { id: "q7", title: "Cost of many", instruction: "Creative Section B. Find the cost of 1 first.",
        questions: [
          many("q7a", "The cost of **1 dozen** pencils is **Rs 96**. Find the cost of **18 pencils**.", 12, 96, 18, "pencil (1 dozen = 12)", "Cost (Rs)"),
          many("q7b", "The wages of a labourer for **a week** are **Rs 3,500**. Find the wages for **12 days**.", 7, 3500, 12, "day (1 week = 7 days)", "Wages (Rs)"),
          many("q7c", "The cost of **1 quintal** of onions is **Rs 4,000**. What is the cost of **15 kg**?", 100, 4000, 15, "kg (1 quintal = 100 kg)", "Cost (Rs)"),
          many("q7d", "The cost of carpeting **1 sq. m** of a floor is **Rs 120**. What is the cost of carpeting **96 sq. m**?", 1, 120, 96, "sq. m", "Cost (Rs)")
        ] },
      { id: "q8", title: "Speed and distance", instruction: "Distance = speed × time. Change minutes to hours.",
        questions: [
          q("q8a", "The speed of a bus is **40 km per hour**. How far does it go in (i) 45 minutes (ii) 3 hours (iii) 2 hours 30 minutes?",
            [["(i) 45 minutes", 30, "km"], ["(ii) 3 hours", 120, "km"], ["(iii) 2 h 30 min", 100, "km"]],
            ["In 1 hour (60 minutes) it goes 40 km, so in 1 minute it goes 40/60 = 2/3 km.", "45 minutes: 2/3 × 45 = 30 km.", "3 hours: 40 × 3 = 120 km.", "2 hours 30 minutes = 2.5 hours: 40 × 2.5 = 100 km."]),
          q("q8b", "A car covers **240 km in 4 hours**. (i) Find its speed in km per hour. (ii) How far does it go at the same speed in **7 hours**?",
            [["(i) Speed", 60, "km/h"], ["(ii) Distance", 420, "km"]], ["Speed = distance in 1 hour = 240 ÷ 4 = 60 km/h.", "In 7 hours: 60 × 7 = 420 km."])
        ] },
      { id: "q9", title: "How many can you buy?", instruction: "Find the cost of 1, then divide.",
        questions: [
          q("q9a", "The cost of **6 kg** of oranges is **Rs 540**. How many kilograms can be bought for **Rs 720**?", [["Oranges", 8, "kg"]], ["Cost of 1 kg = 540 ÷ 6 = Rs 90.", "For Rs 720: 720 ÷ 90 = 8 kg."]),
          q("q9b", "The cost of **5 story books** is **Rs 800**. How many books can be bought for **Rs 1,440**?", [["Books", 9]], ["Cost of 1 book = 800 ÷ 5 = Rs 160.", "For Rs 1440: 1440 ÷ 160 = 9 books."])
        ] },
      { id: "q10", title: "Parts of a whole", instruction: "Find the whole first, then the other part.",
        questions: [
          q("q10a", "If **3/4** of the distance between two places is **30 km**, how much is **2/5** of the distance?", [["2/5 of the distance", 16, "km"]], ["Whole distance = 30 ÷ 3/4 = 30 × 4/3 = 40 km.", "2/5 of 40 km = 2/5 × 40 = 16 km."]),
          q("q10b", "The cost of carpeting **2/3** of a floor is **Rs 6,000**. What is the cost of carpeting **3/5** of the floor?", [["Cost (Rs)", 5400]], ["Whole floor = 6000 ÷ 2/3 = 6000 × 3/2 = Rs 9,000.", "3/5 of 9000 = 3/5 × 9000 = Rs 5,400."])
        ] },
      { id: "q11", title: "Filling tanks", instruction: "Find the amount in 1 hour first.",
        questions: [
          q("q11a", "A pipe fills a water tank of **7,500 l** in **4 hours**. How much water does it fill in **3 hours**?", [["Water", 5625, "l"]], ["In 1 hour: 7500 ÷ 4 = 1875 l.", "In 3 hours: 1875 × 3 = 5625 l."]),
          q("q11b", "A tap fills **6,000 l** of water in **3 hours**. How long does it take to fill a tank of **4,000 l**?", [["Time", 2, "hours"]], ["In 1 hour: 6000 ÷ 3 = 2000 l.", "For 4000 l: 4000 ÷ 2000 = 2 hours."])
        ] },
      { id: "q12", title: "Download speed", instruction: "Speed = data ÷ time.",
        questions: [
          q("q12a", "A computer downloads a **200 MB** game file in **20 seconds**. How many megabytes does it download in 1 second? What is the download speed?", [["In 1 second", 10, "MB"]], ["In 1 second: 200 ÷ 20 = 10 MB.", "So the download speed is 10 MB per second."]),
          { id: "q12b", prompt: "A computer downloads a **2.5 GB** movie file in **50 seconds**. Find the download speed in megabytes (MB) per second.",
            parts: [nm("v", "Speed", 51.2, { unit: "MB/s", alt: [50] })],
            help: [{ text: "Change GB to MB. Computers use 1 GB = 1024 MB, so 2.5 GB = 2.5 × 1024 = 2560 MB." }, { text: "Speed = 2560 ÷ 50 = 51.2 MB per second." },
              { text: "Answer: **51.2 MB/s** (if your class uses 1 GB = 1000 MB, the answer is 2500 ÷ 50 = 50 MB/s, which is also accepted)." }] }
        ] }
    ]
  });
})();
