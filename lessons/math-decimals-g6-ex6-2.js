/*
  Exercise 6.2: Place value, adding and subtracting decimals.
  Source: Vedanta Excel in Mathematics, Book 6, pages 106-109.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var D = Practice.dec, F = Practice.fr, C = D.calc, L = "abcdefghijklmnop";
  function dq(id, label, answer, extra) { var o = { id: id, label: label, type: "dec", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function fq(id, label, answer) { return { id: id, label: label, type: "frac", answer: answer }; }
  var PLACE = ["tenths", "hundredths", "thousandths", "ten-thousandths"];
  function pv(d, i) { var dig = d.split(".")[1][i]; return D.str(F.of(dig + "/" + Math.pow(10, i + 1))); }
  function list(prefix, exprs, opts) { return exprs.map(function (e, i) { return C(prefix + L[i], e, opts); }); }

  // place value of every digit after the point
  function places(id, d) {
    var digs = d.split(".")[1].split("");
    return { id: id, prompt: "Write the place value of each digit of **" + d + "**.",
      parts: digs.map(function (c, i) { return dq(L[i], "Value of " + c, pv(d, i), { fracOk: true }); }),
      help: [{ text: "After the point the places are tenths, hundredths, thousandths." }]
        .concat(digs.map(function (c, i) { return { text: c + " is in the " + PLACE[i] + " place, so its value is " + c + "/" + Math.pow(10, i + 1) + " = " + pv(d, i) + "." }; }))
        .concat([{ text: "Answer: **" + digs.map(function (c, i) { return pv(d, i); }).join(", ") + "**." }]) };
  }
  function coloured(id, d, i) {
    var c = d.split(".")[1][i];
    var marked = d.slice(0, 2 + i) + "[" + c + "]" + d.slice(3 + i);
    return { id: id, prompt: "What is the place value of the marked digit in **" + marked + "**?",
      parts: [dq("v", "Value of " + c, pv(d, i), { fracOk: true })],
      help: [{ text: c + " is the " + ["1st", "2nd", "3rd"][i] + " digit after the point: the " + PLACE[i] + " place." }, { text: "Its value is " + c + "/" + Math.pow(10, i + 1) + " = " + pv(d, i) + "." }, { text: "Answer: **" + pv(d, i) + "**." }] };
  }
  function expand(id, d) {
    var digs = d.split(".")[1].split(""), terms = digs.map(function (c, i) { return pv(d, i); }).filter(function (t) { return t !== "0"; });
    return { id: id, prompt: "Write **" + d + "** in expanded form.", parts: [{ id: "v", label: d + " =", type: "expand", answer: d, example: terms.join(" + ") }],
      help: [{ text: "Write the value of each digit and join them with +." }]
        .concat(digs.map(function (c, i) { return { text: c + " is in the " + PLACE[i] + " place: " + c + "/" + Math.pow(10, i + 1) + " = " + pv(d, i) + "." }; }))
        .concat([{ text: "Answer: **" + d + " = " + terms.join(" + ") + "** (or " + digs.map(function (c, i) { return c + "/" + Math.pow(10, i + 1); }).join(" + ") + ")." }]) };
  }
  // Puzzle grid: rows of cells; "?x" blanks with answers given in `ans`
  function puzzle(id, rows, ans, help) {
    return { id: id, prompt: "Fill in the missing numbers. Each row and each column is a true sum.",
      figure: { type: "grid", plain: true, rows: rows },
      parts: Object.keys(ans).map(function (k) { return dq(k, k, ans[k]); }),
      help: help.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + Object.keys(ans).map(function (k) { return k + " = " + ans[k]; }).join(", ") + "**." }]) };
  }
  function word(id, prompt, expr, unit, intro, label) { var q = C(id, expr, { prompt: prompt, unit: unit, intro: intro, label: label }); return q; }
  // multi-part word problem from a list of {label, expr, intro}
  function story(id, prompt, items, figure) {
    var parts = [], help = [];
    items.forEach(function (it, i) {
      var q = it.frac ? null : C("x", it.expr), ans = q ? q.parts[0].answer : it.frac;
      var p = it.frac ? fq(L[i], it.label, it.frac) : dq(L[i], it.label, ans);
      if (it.unit) p.unit = it.unit;
      parts.push(p);
      help.push({ text: (it.label.match(/^\(\w+\)/) || [""])[0] + " " + (it.intro || "") + (it.frac || it.full ? "" : " " + q.help.slice(0, -1).map(function (h) { return h.text; }).join(" ")) });
    });
    help.push({ text: "Answer: **" + items.map(function (it, i) { return it.frac || parts[i].answer + (it.unit ? " " + it.unit : ""); }).join("; ") + "**." });
    var o = { id: id, prompt: prompt, parts: parts, help: help };
    if (figure) o.figure = figure;
    return o;
  }

  Practice.register({
    id: "math-decimals-g6-ex6-2",
    subject: "Mathematics",
    unit: "Decimals",
    title: "Exercise 6.2",
    topic: "Place value, adding and subtracting",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 106–109",

    reference: {
      title: "Adding and subtracting decimals",
      columns: ["Idea", "Example"],
      rows: [
        ["Places after the point: tenths, hundredths, thousandths", "0.685 = 0.6 + 0.08 + 0.005"],
        ["Line up the decimal points", "0.15 + 0.47 = 0.62"],
        ["Fill empty places with zeros", "0.5 + 0.23 = 0.50 + 0.23 = 0.73"],
        ["A whole number has its point at the end", "5 − 0.875 = 5.000 − 0.875 = 4.125"],
        ["What must be added? Subtract", "100 − 64.35 = 35.65"],
        ["How to type", "Decimals like 0.62. Expanded form like 0.2 + 0.05."]
      ]
    },

    sections: [
      { id: "q1", title: "Place value of each digit", instruction: "Type a decimal (or a fraction like 6/10).",
        questions: [places("q1a", "0.685"), places("q1b", "0.295"), places("q1c", "0.743")] },
      { id: "q2", title: "Place value of one digit", instruction: "The digit in [ ] is the coloured digit in the book.",
        questions: [coloured("q2a", "0.263", 2), coloured("q2b", "0.085", 1), coloured("q2c", "0.432", 0)] },
      { id: "q3", title: "Quick sums and differences", instruction: "Say and write as quickly as possible.",
        questions: list("q3", ["0.2 + 0.3", "0.2 + 0.03", "0.02 + 0.03", "0.4 + 0.9", "0.8 + 0.7", "0.3 + 0.8", "0.5 − 0.3", "0.6 − 0.2", "0.4 − 0.04", "0.4 − 0.05", "1 − 0.5", "2 − 0.6"]) },
      { id: "q4", title: "Expanded form", instruction: "Creative Section A. Type like 0.2 + 0.05.",
        questions: [expand("q4a", "0.25"), expand("q4b", "0.64"), expand("q4c", "0.714"), expand("q4d", "0.4765")] },
      { id: "q5", title: "Add or subtract", instruction: "Line up the decimal points.",
        questions: list("q5", ["0.15 + 0.47", "0.5 + 0.23", "0.69 + 0.8", "4.56 + 3.98", "7.265 + 8.84", "15.06 + 18.947", "0.42 − 0.24", "0.8 − 0.47", "0.75 − 0.006", "6.04 − 3.56", "10.001 − 5.846", "5 − 0.875"]) },
      { id: "q6", title: "Puzzle time", instruction: "Grey squares are empty in the book.",
        questions: [
          puzzle("q6a", [["0.2", "+", "?a", "=", "0.5"], ["+", "#", "+", "#", "+"], ["0.5", "+", "?b", "=", "?c"], ["=", "#", "=", "#", "="], ["?d", "+", "0.7", "=", "?e"]],
            { a: "0.3", b: "0.4", c: "0.9", d: "0.7", e: "1.4" },
            ["Top row: 0.2 + a = 0.5, so a = 0.5 − 0.2 = 0.3.", "First column: 0.2 + 0.5 = d, so d = 0.7.", "Middle column: a + b = 0.7, so b = 0.7 − 0.3 = 0.4.", "Middle row: 0.5 + 0.4 = c = 0.9.", "Bottom row: 0.7 + 0.7 = e = 1.4. Check the last column: 0.5 + 0.9 = 1.4 ✓"]),
          puzzle("q6b", [["?a", "−", "?b", "=", "?c"], ["−", "#", "−", "#", "−"], ["0.6", "−", "?d", "=", "0.4"], ["=", "#", "=", "#", "="], ["0.3", "−", "?e", "=", "0.1"]],
            { a: "0.9", b: "0.4", c: "0.5", d: "0.2", e: "0.2" },
            ["Middle row: 0.6 − d = 0.4, so d = 0.6 − 0.4 = 0.2.", "Bottom row: 0.3 − e = 0.1, so e = 0.3 − 0.1 = 0.2.", "First column: a − 0.6 = 0.3, so a = 0.3 + 0.6 = 0.9.", "Middle column: b − 0.2 = 0.2, so b = 0.4.", "Top row: 0.9 − 0.4 = c = 0.5. Check the last column: 0.5 − 0.4 = 0.1 ✓"]),
          puzzle("q6c", [["?a", "+", "0.1", "=", "0.9"], ["−", "#", "+", "#", "−"], ["0.6", "−", "?b", "=", "0.4"], ["=", "#", "=", "#", "="], ["?c", "+", "0.3", "=", "?d"]],
            { a: "0.8", b: "0.2", c: "0.2", d: "0.5" },
            ["Top row: a + 0.1 = 0.9, so a = 0.8.", "Middle row: 0.6 − b = 0.4, so b = 0.2. Check the middle column: 0.1 + 0.2 = 0.3 ✓", "First column: 0.8 − 0.6 = c = 0.2.", "Bottom row: 0.2 + 0.3 = d = 0.5. Check the last column: 0.9 − 0.4 = 0.5 ✓"])
        ] },
      { id: "q7", title: "Simplify", instruction: "Work from left to right.",
        questions: list("q7", ["0.5 + 0.6 + 0.7", "0.65 + 0.34 + 0.96", "0.7 + 0.9 − 0.125", "1.05 − 0.6 − 0.08", "3.5 + 0.08 − 1.7"]).concat([
          C("q7f", "6.24 + 5.004 − 9.5", { prompt: "**6.24 − 9.5 + 5.004**", intro: ["9.5 is bigger than 6.24, so add the other two numbers first. 6.24 − 9.5 + 5.004 = 6.24 + 5.004 − 9.5."] })]) },
      { id: "q8", title: "Differences and missing numbers", instruction: "Type decimals.",
        questions: [
          C("q8a", "8.72 − 0.872", { prompt: "Find the difference between **8.72** and **0.872**.", intro: ["Difference means bigger − smaller: 8.72 − 0.872."] }),
          C("q8b", "100 − 64.35", { prompt: "What should be added to **64.35** to make **100**?", intro: ["The missing number is 100 − 64.35."] }),
          C("q8c", "55.55 − 5.555", { prompt: "What should be subtracted from **55.55** to get **5.555**?", intro: ["55.55 − ? = 5.555, so ? = 55.55 − 5.555."] })
        ] },
      { id: "q9", title: "Place value on the board", instruction: "The teacher writes 0.1, 0.21 and 0.321.",
        questions: [
          { id: "q9a", prompt: "What is the place value of **1** in the first number, **0.1**?", parts: [dq("v", "Value", "0.1", { fracOk: true })],
            help: [{ text: "In 0.1 the 1 is in the tenths place." }, { text: "Answer: **0.1** (= 1/10)." }] },
          { id: "q9b", prompt: "What is the place value of **1** in the second number, **0.21**? Also write it as a fraction.", parts: [dq("d", "Decimal", "0.01"), fq("f", "Fraction", "1/100")],
            help: [{ text: "In 0.21 the 1 is the 2nd digit after the point: the hundredths place." }, { text: "Answer: **0.01 = 1/100**." }] },
          { id: "q9c", prompt: "What is the place value of **1** in the third number, **0.321**? Also write it as a fraction.", parts: [dq("d", "Decimal", "0.001"), fq("f", "Fraction", "1/1000")],
            help: [{ text: "In 0.321 the 1 is the 3rd digit after the point: the thousandths place." }, { text: "Answer: **0.001 = 1/1000**." }] }
        ] },
      { id: "q10", title: "Cake and bread", instruction: "Decimal parts of a whole.",
        questions: [
          story("q10a", "Puja Gurung cuts her birthday cake into **10 equal pieces**. She gives **3 pieces** to her brother and **4 pieces** to her friends.", [
            { label: "(i) Brother's part", expr: "3 ÷ 10", intro: "Brother: 3 of 10 pieces = 3/10 = 0.3.", full: true },
            { label: "(ii) Friends' part", expr: "4 ÷ 10", intro: "Friends: 4 of 10 pieces = 4/10 = 0.4.", full: true },
            { label: "(iii) Total", expr: "0.3 + 0.4", intro: "Total:" },
            { label: "(iv) Total as a fraction", frac: "7/10", intro: "0.7 has 1 decimal place, so 0.7 = 7/10." },
            { label: "(v) Part left", expr: "1 − 0.7", intro: "The whole cake is 1. Left:" }
          ], { type: "fbar", parts: 10, shade: [[0, 3, "a"], [3, 7, "b"]] }),
          story("q10b", "Mitharam Chaudhari cuts a bread into **5 equal slices**. He eats **1 slice** and gives **2 slices** to his friends.", [
            { label: "(i) He eats", expr: "1 ÷ 5", intro: "He eats 1/5. Make the denominator 10: 1/5 = 2/10 = 0.2.", full: true },
            { label: "(ii) Friends get", expr: "2 ÷ 5", intro: "Friends get 2/5 = 4/10 = 0.4.", full: true },
            { label: "(iii) Sum", expr: "0.2 + 0.4", intro: "Sum:" },
            { label: "(v) Part left", expr: "1 − 0.6", intro: "Left: 1 − 0.6." }
          ], { type: "fbar", parts: 10, shade: [[0, 2, "a"], [2, 6, "b"]] })
        ] },
      { id: "q11", title: "Money, temperature and distance", instruction: "Type the number only.",
        questions: [
          story("q11a", "On your birthday, you bought a cake for **Rs 250.25** and a packet of sweets for **Rs 145.90**.", [
            { label: "(i) Total paid (Rs)", expr: "250.25 + 145.9", intro: "Add the two prices." },
            { label: "(ii) Change from Rs 500 (Rs)", expr: "500 − 396.15", intro: "Change = 500 − total." }
          ]),
          C("q11b", "40.5 + 35.7 − 29.8", { prompt: "The temperature of a body is **40.5°C**. It first rises by **35.7°C** and then falls by **29.8°C**. What is the temperature now?", unit: "°C", intro: ["Rises means add, falls means subtract: 40.5 + 35.7 − 29.8."] }),
          C("q11c", "42 − 34", { prompt: "The distance between Itahari and Damak is **42 km**. Mr. Dhamala travelled **18.325 km** by bus, **15.675 km** by taxi and the rest by motorbike. How far did he travel by motorbike?", unit: "km",
            intro: ["Bus and taxi together: 18.325 + 15.675 = 34.000 = 34 km.", "Motorbike = 42 − 34."] }),
          C("q11d", "63.25 − 50.5", { prompt: "A dairy man has **50.5 l** of milk. He must deliver **30.75 l** and **32.5 l** to two weddings at the same time. How much more milk does he need?", unit: "l",
            intro: ["Milk needed: 30.75 + 32.50 = 63.25 l.", "More milk = 63.25 − 50.5."] })
        ] },
      { id: "q12", title: "Potatoes and the way to school", instruction: "Creative Section B.",
        questions: [
          story("q12a", "From a sack of **1 quintal (100 kg)** of potatoes, a shopkeeper sold **25.65 kg** yesterday and **20.48 kg** this morning.", [
            { label: "(i) Sold in two days", expr: "25.65 + 20.48", unit: "kg", intro: "Add the two days." },
            { label: "(ii) Left to sell", expr: "100 − 46.13", unit: "kg", intro: "1 quintal = 100 kg. Left = 100 − sold." }
          ]),
          C("q12b", "1 − 0.631", { prompt: "Sita's house is **1 km** from her school. On the way, Gita's house is **0.256 km** from Sita's house, and Rita's house is **0.375 km** further on from Gita's house. How far is Rita's house from the school?", unit: "km",
            intro: ["Sita's house to Rita's house: 0.256 + 0.375 = 0.631 km.", "Rita's house to school = 1 − 0.631."] })
        ] },
      { id: "q13", title: "Fill in the blanks", instruction: "Find the missing decimal.",
        questions: [
          C("q13a", "0.222 − 0.2 − 0.002", { prompt: "**0.2 + ___ + 0.002 = 0.222**", intro: ["0.2 + 0.002 = 0.202. So the blank is 0.222 − 0.202."] }),
          C("q13b", "0.777 − 0.077", { prompt: "**___ + 0.07 + 0.007 = 0.777**", intro: ["0.07 + 0.007 = 0.077. So the blank is 0.777 − 0.077."] }),
          C("q13c", "0.999 − 0.99", { prompt: "**0.9 + 0.09 + ___ = 0.999**", intro: ["0.9 + 0.09 = 0.99. So the blank is 0.999 − 0.99."] }),
          C("q13d", "102.96 − 61.19", { prompt: "**26.54 + ___ + 34.65 = 102.96**", intro: ["26.54 + 34.65 = 61.19. So the blank is 102.96 − 61.19."] }),
          C("q13e", "122.049 − 58.365", { prompt: "**46.125 + 75.924 − ___ = 58.365**", intro: ["46.125 + 75.924 = 122.049. 122.049 − blank = 58.365, so the blank is 122.049 − 58.365."] }),
          C("q13f", "50.25 − 16.75", { prompt: "**100.50 − 50.25 − ___ = 16.75**", intro: ["100.50 − 50.25 = 50.25. 50.25 − blank = 16.75, so the blank is 50.25 − 16.75."] })
        ] }
    ]
  });
})();
