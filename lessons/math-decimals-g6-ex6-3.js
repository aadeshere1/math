/*
  Exercise 6.3: Multiplying and dividing decimals; units of measurement.
  Source: Vedanta Excel in Mathematics, Book 6, pages 114-117.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var D = Practice.dec, F = Practice.fr, C = D.calc, L = "abcdefghijklmnop";
  function dq(id, label, answer, extra) { var o = { id: id, label: label, type: "dec", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function val(e) { return D.str(D.evaluate(e).v); }
  function list(prefix, exprs) { return exprs.map(function (e, i) { return C(prefix + L[i], e); }); }
  // one question, several quick answers in a row
  function quick(id, exprs) {
    return { id: id, prompt: "**" + exprs.join("**,  **") + "**",
      parts: exprs.map(function (e, i) { return dq(L[i], e + " =", val(e)); }),
      help: exprs.map(function (e) { return { text: D.evaluate(e).steps.join(" ") }; }).concat([{ text: "Answer: **" + exprs.map(val).join(", ") + "**." }]) };
  }
  // k groups of g boxes, each box 0.1
  function groups(id, k, g, labelled) {
    var items = [];
    for (var i = 0; i < k; i++) items.push({ type: "fbar", parts: g, shade: [[0, g]], caption: labelled ? "0.1 each" : "" });
    var each = D.str([g, 10]), prod = val(k + " × " + each);
    return { id: id, prompt: "Each small square is **0.1**. Write the multiplier, the multiplicand and the product.",
      figure: { type: "row", items: items },
      parts: [{ id: "m", label: "Multiplier (number of groups)", type: "number", answer: k }, dq("c", "Multiplicand (each group)", each), dq("p", "Product", prod)],
      help: [{ text: "There are " + k + " groups. Each group has " + g + " squares of 0.1, so each group is " + each + "." },
        { text: k + " groups of " + each + " is " + k + " × " + each + ". Count all the squares: " + k * g + " tenths = " + prod + "." },
        { text: "Answer: **" + k + " × " + each + " = " + prod + "**." }] };
  }
  // hundred grid: columns c (as tenths) and rows r (as tenths)
  function area(id, c, r) {
    var C1 = D.str([c, 10]), R1 = D.str([r, 10]), prod = D.str([c * r, 100]);
    return { id: id, prompt: "Each small square is **0.01**. Write the two decimals shown and find the product (the dark part).",
      figure: { type: "hgrid", rects: [[0, 0, c, 10, "a"], [0, 0, 10, r, "b"], [0, 0, c, r, "c"]], top: [C1, 0, c], left: [R1, 0, r] },
      parts: [dq("c", "Columns shaded", C1), dq("r", "Rows shaded", R1), dq("p", R1 + " × " + C1 + " =", prod)],
      help: [{ text: c + " columns of the 10 are shaded: " + C1 + ". " + r + " rows of the 10 are shaded: " + R1 + "." },
        { text: "The dark part is where they cross: " + r + " × " + c + " = " + r * c + " small squares, and each is 0.01." },
        { text: "Answer: **" + R1 + " × " + C1 + " = " + prod + "**." }] };
  }
  function blocks(id, total, size, n) {
    var parts = total * 10, step = size * 10, sh = [];
    for (var i = 0; i < parts / step; i++) sh.push([i * step, (i + 1) * step, i % 2 ? "b" : "a"]);
    var T = String(total), S = String(size);
    return { id: id, prompt: "Each cube is **0.1**. How many **" + S + "s** are there in **" + T + "**?",
      figure: { type: "fbar", parts: parts, shade: sh, label: T === "1" ? "1 (whole block)" : T },
      parts: [{ id: "v", label: T + " ÷ " + S + " =", type: "number", answer: n }],
      help: [{ text: T + " is " + parts + " cubes. " + S + " is " + step + " cubes." }, { text: "Count the coloured groups of " + step + ": " + parts + " ÷ " + step + " = " + n + "." }, { text: "Answer: **" + T + " ÷ " + S + " = " + n + "**." }] };
  }
  // book method: 1.5 × 30 = 1.5 × 10 × 3; 1.4 ÷ 20 = (1.4 ÷ 2) ÷ 10
  function smart(id, a, op, b) {
    var z = String(b).replace(/^\d/, "").length, d = +String(b)[0], tens = Math.pow(10, z), help;
    if (op === "×") {
      var a10 = val(a + " × " + tens), r = val(a10 + " × " + d);
      help = ["Split " + b + " as " + tens + " × " + d + ": " + a + " × " + b + " = " + a + " × " + tens + " × " + d + ".", "Multiplying by " + tens + " moves the point: " + a + " × " + tens + " = " + a10 + ".", a10 + " × " + d + " = " + r + "."];
    } else {
      var q = val(a + " ÷ " + d), r = val(q + " ÷ " + tens);
      help = ["Split " + b + " as " + d + " × " + tens + ": " + a + " ÷ " + b + " = (" + a + " ÷ " + d + ") ÷ " + tens + ".", a + " ÷ " + d + " = " + q + ".", "Dividing by " + tens + " moves the point 1 place left: " + q + " ÷ " + tens + " = " + r + "."];
    }
    return { id: id, prompt: "**" + a + " " + op + " " + b + "**", parts: [dq("v", "", r)], help: help.map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + r + "**." }]) };
  }
  function cancel(id, list) {
    return { id: id, prompt: "Write as decimals: **" + list.join(", ") + "**",
      parts: list.map(function (t, i) { return dq(L[i], t + " =", D.str(F.of(t))); }),
      help: list.map(function (t) {
        var p = t.split("/"), z = Math.min(p[0].match(/0*$/)[0].length, p[1].match(/0*$/)[0].length), n = p[0].slice(0, p[0].length - z), dd = p[1].slice(0, p[1].length - z), v = F.of(t);
        var k = 0; while (Math.pow(10, k) % v[1]) k++;
        var m = Math.pow(10, k) / v[1];
        return { text: t + (z ? " = " + n + "/" + dd + " (cross out " + z + " zero" + (z > 1 ? "s" : "") + ")" : "") + (F.str(v) !== n + "/" + dd ? " = " + F.str(v) : "") + (m > 1 ? " = " + v[0] * m + "/" + Math.pow(10, k) : "") + " = " + D.str(v) + "." };
      }).concat([{ text: "Answer: **" + list.map(function (t) { return D.str(F.of(t)); }).join(", ") + "**." }]) };
  }
  function pc(id, p) {
    var v = val(p + " ÷ 100");
    return { id: id, prompt: "Write **" + p + "%** as a decimal.", parts: [dq("v", p + "% =", v)],
      help: [{ text: p + "% means " + p + "/100." }, { text: "Dividing by 100 moves the point 2 places to the left: " + p + " → " + v + "." }, { text: "Answer: **" + v + "**." }] };
  }
  // unit conversions: big → small multiplies, small → big divides
  function unit(id, rule, items) {
    return { id: id, prompt: "**" + rule.text + "**  " + rule.ask,
      parts: items.map(function (it, i) { return dq(L[i], (it[1] || it[0] + " " + rule.from) + " =", val(it[0] + " " + rule.op + " " + rule.k), { unit: rule.to }); }),
      help: [{ text: rule.text + ". To change " + rule.fromName + " to " + rule.toName + ", " + (rule.op === "×" ? "multiply" : "divide") + " by " + rule.k + "." }]
        .concat(items.map(function (it) { return { text: D.step(D.of(it[0]), rule.op, D.of(rule.k)).say }; }))
        .concat([{ text: "Answer: **" + items.map(function (it) { return val(it[0] + " " + rule.op + " " + rule.k) + " " + rule.to; }).join(", ") + "**." }]) };
  }
  function U(text, from, to, fromName, toName, op, k, ask) { return { text: text, from: from, to: to, fromName: fromName, toName: toName, op: op, k: k, ask: ask }; }

  Practice.register({
    id: "math-decimals-g6-ex6-3",
    subject: "Mathematics",
    unit: "Decimals",
    title: "Exercise 6.3",
    topic: "Multiplying, dividing and units",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 114–117",

    reference: {
      title: "Multiplying and dividing decimals",
      columns: ["Idea", "Example"],
      rows: [
        ["× 10, 100, 1000: point moves right 1, 2, 3 places", "0.374 × 100 = 37.4"],
        ["÷ 10, 100, 1000: point moves left 1, 2, 3 places", "264.5 ÷ 100 = 2.645"],
        ["×: multiply without points, then count decimal places", "0.3 × 0.2: 3 × 2 = 6, 2 places → 0.06"],
        ["÷ by a decimal: make the divisor whole first", "0.6 ÷ 0.2 = 6 ÷ 2 = 3"],
        ["Big unit → small unit: multiply", "2.5 cm = 2.5 × 10 = 25 mm"],
        ["Small unit → big unit: divide", "225 cm = 225 ÷ 100 = 2.25 m"],
        ["Units", "1 cm = 10 mm · 1 m = 100 cm · 1 km = 1000 m · Re 1 = 100 p · 1 kg = 1000 g · 1 quintal = 100 kg · 1 l = 1000 ml"]
      ]
    },

    sections: [
      { id: "q1", title: "Groups of tenths", instruction: "Each small square is 0.1.",
        questions: [groups("q1a", 3, 2, true), groups("q1b", 4, 2), groups("q1c", 3, 3), groups("q1d", 4, 3)] },
      { id: "q2", title: "Decimal × decimal on a grid", instruction: "Each small square is 0.01.",
        questions: [area("q2a", 3, 2), area("q2b", 4, 3), area("q2c", 5, 5)] },
      { id: "q3", title: "How many in a whole?", instruction: "Count the coloured groups.",
        questions: [blocks("q3a", 1, 0.5, 2), blocks("q3b", 1, 0.2, 5), blocks("q3c", 1.6, 0.4, 4)] },
      { id: "q4", title: "× 10, 100 and 1000", instruction: "Move the decimal point to the right.",
        questions: [quick("q4a", ["0.374 × 10", "0.374 × 100", "0.374 × 1000"]), quick("q4b", ["0.0729 × 10", "0.0729 × 100", "0.0729 × 1000"]), quick("q4c", ["0.0008 × 10", "0.0008 × 100", "0.0008 × 1000"])] },
      { id: "q5", title: "÷ 10, 100 and 1000", instruction: "Move the decimal point to the left.",
        questions: [quick("q5a", ["264.5 ÷ 10", "264.5 ÷ 100", "264.5 ÷ 1000"]), quick("q5b", ["57.3 ÷ 10", "57.3 ÷ 100", "57.3 ÷ 1000"]), quick("q5c", ["0.7 ÷ 10", "0.7 ÷ 100", "0.7 ÷ 1000"])] },
      { id: "q6", title: "Quick products", instruction: "Count the decimal places.",
        questions: [quick("q6a", ["0.3 × 2", "0.03 × 2", "0.003 × 2"]), quick("q6b", ["0.7 × 5", "0.4 × 8", "0.6 × 9"]), quick("q6c", ["0.3 × 0.2", "0.2 × 0.4", "0.3 × 0.5"])] },
      { id: "q7", title: "Quick quotients", instruction: "Make the divisor a whole number first.",
        questions: [quick("q7a", ["0.6 ÷ 2", "6 ÷ 0.2", "0.6 ÷ 0.2"]), quick("q7b", ["0.9 ÷ 3", "0.09 ÷ 3", "0.09 ÷ 0.3"]), quick("q7c", ["1.2 ÷ 4", "0.12 ÷ 4", "0.12 ÷ 0.4"])] },
      { id: "q8", title: "Products and quotients the smart way", instruction: "Creative Section. Example: 1.5 × 50 = 1.5 × 10 × 5 = 15 × 5 = 75.",
        questions: [["1.2", "×", 20], ["1.5", "×", 30], ["1.7", "×", 40], ["2.1", "×", 50], ["1.3", "×", 200], ["1.8", "×", 300], ["2.4", "×", 400], ["3.2", "×", 600], ["1.4", "÷", 20], ["1.5", "÷", 30]]
          .map(function (x, i) { return smart("q8" + L[i], x[0], x[1], x[2]); }) },
      { id: "q9", title: "Fractions to decimals", instruction: "Example: 1200/5000 = 12/50 = 24/100 = 0.24.",
        questions: [cancel("q9a", ["6/20", "60/200", "60/2000"]), cancel("q9b", ["16/40", "160/400", "160/4000"]), cancel("q9c", ["540/900", "540/9000", "540/90000"])] },
      { id: "q10", title: "Per cents to decimals", instruction: "Example: 4.5% = 4.5/100 = 0.045.",
        questions: ["0.6", "1.9", "2.5", "36.4", "73.6", "98.7"].map(function (p, i) { return pc("q10" + L[i], p); }) },
      { id: "q11", title: "Units of measurement", instruction: "Type the number only. The unit is shown.",
        questions: [
          unit("q11a", U("1 cm = 10 mm", "cm", "mm", "centimetres", "millimetres", "×", 10, "How many millimetres?"), [["2.5"], ["5.6"]]),
          unit("q11b", U("1 cm = 10 mm", "mm", "cm", "millimetres", "centimetres", "÷", 10, "How many centimetres?"), [["37"], ["84"]]),
          unit("q12a", U("1 m = 100 cm", "m", "cm", "metres", "centimetres", "×", 100, "How many centimetres?"), [["3.15"], ["6.8"]]),
          unit("q12b", U("1 m = 100 cm", "cm", "m", "centimetres", "metres", "÷", 100, "How many metres?"), [["225"], ["75.5"]]),
          unit("q13a", U("Re 1 = 100 p", "rupees", "p", "rupees", "paisa", "×", 100, "How many paisa?"), [["4.5", "Rs 4.50"], ["8.25", "Rs 8.25"]]),
          unit("q13b", U("Re 1 = 100 p", "p", "Rs", "paisa", "rupees", "÷", 100, "How many rupees?"), [["250"], ["745"]]),
          unit("q14a", U("1 km = 1000 m", "km", "m", "kilometres", "metres", "×", 1000, "How many metres?"), [["1.4"], ["2.75"]]),
          unit("q14b", U("1 km = 1000 m", "m", "km", "metres", "kilometres", "÷", 1000, "How many kilometres?"), [["1800"], ["4250"]]),
          unit("q15a", U("1 kg = 1000 g", "kg", "g", "kilograms", "grams", "×", 1000, "How many grams?"), [["1.25"], ["3.674"]]),
          unit("q15b", U("1 kg = 1000 g", "g", "kg", "grams", "kilograms", "÷", 1000, "How many kilograms?"), [["1500"], ["2450"]]),
          unit("q16a", U("1 quintal = 100 kg", "q", "kg", "quintals", "kilograms", "×", 100, "How many kilograms?"), [["2.7"], ["5.4"]]),
          unit("q16b", U("1 quintal = 100 kg", "kg", "q", "kilograms", "quintals", "÷", 100, "How many quintals?"), [["360"], ["1440"]]),
          unit("q17a", U("1 l = 1000 ml", "l", "ml", "litres", "millilitres", "×", 1000, "How many millilitres?"), [["4.5", "4.50 l"], ["8.25"]]),
          unit("q17b", U("1 l = 1000 ml", "ml", "l", "millilitres", "litres", "÷", 1000, "How many litres?"), [["350"], ["1265"]])
        ] }
    ]
  });
})();
