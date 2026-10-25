/*
  Exercise 6.1: Decimals, fractions and per cents.
  Source: Vedanta Excel in Mathematics, Book 6, pages 103-105.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var D = Practice.dec, F = Practice.fr, L = "abcdefghijklmnop";
  function dq(id, label, answer, extra) { var o = { id: id, label: label, type: "dec", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function fq(id, label, answer, extra) { var o = { id: id, label: label, type: "frac", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function zeros(d) { return String(d).length - 1; }
  var PL = ["", "1 decimal place", "2 decimal places", "3 decimal places", "4 decimal places"];

  // n/10, n/100 ... to a decimal
  function f2dLine(t) {
    var f = t.split("/"), z = zeros(f[1]), v = D.str(F.of(t));
    return t + ": " + f[1] + " has " + z + " zero" + (z > 1 ? "s" : "") + ", so the answer has " + PL[z] + ": **" + v + "**.";
  }
  function f2d(id, list) {
    return { id: id, prompt: "Write as decimals: **" + list.join(", ") + "**",
      parts: list.map(function (t, i) { return dq(L[i], t + " =", D.str(F.of(t))); }),
      help: [{ text: "Count the zeros in the denominator. That is how many decimal places the answer has. Add zeros in front if you need more places." }]
        .concat(list.map(function (t) { return { text: f2dLine(t) }; }))
        .concat([{ text: "Answer: **" + list.map(function (t) { return D.str(F.of(t)); }).join(", ") + "**." }]) };
  }
  // decimal to a fraction (any equal fraction, or lowest terms)
  function d2fLine(d, lowest) {
    var k = D.dps(d), den = Math.pow(10, k), num = Math.round(parseFloat(d) * den), v = F.of(num + "/" + den), sh = lowest ? F.mixed(v) : num + "/" + den;
    var s = d + " has " + k + " decimal place" + (k > 1 ? "s" : "") + ", so " + d + " = " + num + "/" + den;
    if (lowest && F.str(v) !== num + "/" + den) { var g = num / v[0]; s += " = " + F.str(v) + " (divide both by " + g + ")"; }
    if (lowest && sh !== F.str(v)) s += " = " + sh;
    return { text: s + "." , ans: sh };
  }
  function d2f(id, list, lowest) {
    var lines = list.map(function (d) { return d2fLine(d, lowest); });
    return { id: id, prompt: "Write as " + (lowest ? "fractions in lowest terms (or mixed numbers)" : "fractions") + ": **" + list.join(", ") + "**",
      parts: list.map(function (d, i) { return fq(L[i], d + " =", lines[i].ans, lowest ? { lowest: true, mixedOk: true } : { mixedOk: true }); }),
      help: [{ text: "Write the digits over 1 followed by as many zeros as there are decimal places." + (lowest ? " Then divide the numerator and denominator by their H.C.F." : "") }]
        .concat(lines.map(function (l) { return { text: l.text }; }))
        .concat([{ text: "Answer: **" + lines.map(function (l) { return l.ans; }).join(", ") + "**." }]) };
  }
  // any fraction or mixed number to a decimal, by making the denominator 10, 100 or 1000
  function toDec(id, t, extra) {
    var v = F.of(t), m = t.indexOf(" ") !== -1, w = m ? +t.split(" ")[0] : 0, fp = m ? t.split(" ")[1] : t, fv = F.of(fp), help = [];
    if (D.terminates(v)) {
      var k = 0; while (Math.pow(10, k) % fv[1]) k++;
      var den = Math.pow(10, k), mul = den / fv[1], num = fv[0] * mul;
      help.push({ text: "Make the denominator 10, 100 or 1000. Multiply the top and bottom of " + fp + " by " + mul + ": " + fp + " = " + fv[0] + " × " + mul + " / " + fv[1] + " × " + mul + " = " + num + "/" + den + "." });
      help.push({ text: num + "/" + den + " = " + D.str([num, den]) + "." + (m ? " Add the whole number: " + w + " + " + D.str([num, den]) + " = " + D.str(v) + "." : "") });
      help.push({ text: "Answer: **" + D.str(v) + "**." });
      return { id: id, prompt: "Write **" + t + "** as a decimal.", parts: [dq("v", t + " =", D.str(v))], help: help };
    }
    // recurring
    help.push({ text: "3 does not divide 10, 100 or 1000 exactly, so divide: 2 ÷ 3 = 0.666… The 6 goes on forever." });
    help.push({ text: "So " + t + " = " + w + ".666… Rounded to 2 decimal places this is 7.67." });
    help.push({ text: "Answer: **7.666… ≈ 7.67**." });
    return { id: id, prompt: "Write **" + t + "** as a decimal. This one never ends, so give 2 decimal places.", parts: [dq("v", t + " ≈", "7.67", { tolerance: 0.005 })], help: help };
  }
  function pc(id, p) {
    var v = D.str(F.of(p + "/100"));
    return { id: id, prompt: "Write **" + p + "%** as a decimal.", parts: [dq("v", p + "% =", v)],
      help: [{ text: "Per cent means out of 100: " + p + "% = " + p + "/100." }, { text: "Dividing by 100 moves the point 2 places to the left: " + p + " → " + v + "." }, { text: "Answer: **" + v + "**." }] };
  }
  function name(id, d, right, wrong) {
    return { id: id, prompt: "Choose the number name of **" + d + "**.",
      parts: [{ id: "v", label: "", type: "choice", options: [right].concat(wrong).sort(), answer: right }],
      help: [{ text: "Count the decimal places: 1 place is tenths, 2 places is hundredths, 3 places is thousandths." },
        { text: d + " has " + D.dps(d) + " decimal place" + (D.dps(d) > 1 ? "s" : "") + ". Read the digits after the point as a whole number, then say the place." },
        { text: "Answer: **" + right + "** (you can also say \"zero point " + d.split(".")[1].split("").map(function (c) { return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][+c]; }).join(" ") + "\")." }] };
  }
  function fig(q, f) { q.figure = f; return q; }

  Practice.register({
    id: "math-decimals-g6-ex6-1",
    subject: "Mathematics",
    unit: "Decimals",
    title: "Exercise 6.1",
    topic: "Decimals, fractions and per cents",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 103–105",

    reference: {
      title: "Decimals and fractions",
      columns: ["Idea", "Example"],
      rows: [
        ["1 decimal place = tenths", "0.7 = 7/10"],
        ["2 decimal places = hundredths", "0.07 = 7/100"],
        ["3 decimal places = thousandths", "0.007 = 7/1000"],
        ["Fraction → decimal: zeros in the denominator = decimal places", "125/100 = 1.25"],
        ["Other denominators: make it 10, 100 or 1000 first", "3/4 = 75/100 = 0.75"],
        ["Decimal → fraction: digits over 10, 100, 1000", "0.15 = 15/100 = 3/20"],
        ["Per cent → decimal: divide by 100", "25% = 0.25"],
        ["Zeros at the end don't change a decimal", "0.5 = 0.50"],
        ["How to type", "Decimals like 0.25 (or .25). Fractions like 3/20, mixed numbers like 1 1/2."]
      ]
    },

    sections: [
      { id: "q1", title: "Number names", instruction: "Pick the right name.",
        questions: [
          name("q1a", "0.25", "Twenty-five hundredths", ["Twenty-five tenths", "Twenty-five thousandths", "Two and five tenths"]),
          name("q1b", "0.153", "One hundred fifty-three thousandths", ["One hundred fifty-three hundredths", "Fifteen and three tenths", "One hundred fifty-three tenths"]),
          name("q1c", "0.04", "Four hundredths", ["Four tenths", "Four thousandths", "Forty hundredths"]),
          name("q1d", "0.007", "Seven thousandths", ["Seven hundredths", "Seven tenths", "Seventy thousandths"])
        ] },
      { id: "q2", title: "Fractions to decimals", instruction: "Type decimals like 0.07.",
        questions: [f2d("q2a", ["7/10", "7/100", "7/1000"]), f2d("q2b", ["18/10", "18/100", "18/1000"]), f2d("q2c", ["125/10", "125/100", "125/1000"])] },
      { id: "q3", title: "Decimals to fractions", instruction: "Type fractions like 4/10.",
        questions: [d2f("q3a", ["0.4", "0.04", "0.004"]), d2f("q3b", ["0.9", "0.09", "0.009"]), d2f("q3c", ["1.5", "0.15", "0.015"])] },
      { id: "q4", title: "More fractions to decimals", instruction: "Creative Section A. Type decimals.",
        questions: [
          f2d("q4a", ["6/10", "6/100", "6/1000"]), f2d("q4b", ["47/10", "47/100", "47/1000"]), f2d("q4c", ["256/10", "256/100", "256/1000"]),
          f2d("q4d", ["1/100", "12/100", "123/100"]), f2d("q4e", ["5/10000", "55/1000", "555/100"]), f2d("q4f", ["3/10000", "34/1000", "345/100", "3456/10"])
        ] },
      { id: "q5", title: "Any fraction to a decimal", instruction: "Make the denominator 10, 100 or 1000 first.",
        questions: ["1/2", "1/4", "1/5", "3/4", "3/5", "3/20", "9/25", "27/50", "1 1/2", "2 3/4", "4 2/5", "7 2/3"].map(function (t, i) { return toDec("q5" + L[i], t); }) },
      { id: "q6", title: "Decimals to fractions in lowest terms", instruction: "Lowest terms. Use a mixed number when it is more than 1.",
        questions: [
          d2f("q6a", ["0.2", "0.02", "0.002"], true), d2f("q6b", ["0.4", "0.04", "0.004"], true), d2f("q6c", ["0.5", "0.05", "0.005"], true),
          d2f("q6d", ["1.5", "0.15", "0.015"], true), d2f("q6e", ["12.5", "1.25", "0.125"], true), d2f("q6f", ["22.5", "2.25", "0.225"], true)
        ] },
      { id: "q7", title: "Per cents to decimals", instruction: "Per cent means out of 100.",
        questions: [3, 8, 25, 48, 56, 97].map(function (p, i) { return pc("q7" + L[i], p); }) },
      { id: "q8", title: "Decimals in real life", instruction: "Give a fraction and a decimal.",
        questions: [
          fig({ id: "q8a", prompt: "A chocolate bar has **10 equal pieces**. Mother gives **4 pieces** to her son. What part of the bar did the son get?",
            parts: [fq("f", "As a fraction", "4/10"), dq("d", "As a decimal", "0.4")],
            help: [{ text: "4 pieces out of 10 is 4/10." }, { text: "4/10 has denominator 10, so 1 decimal place: 0.4." }, { text: "Answer: **4/10 = 0.4**." }] },
            { type: "fbar", parts: 10, shade: [[0, 4]] }),
          fig({ id: "q8b", prompt: "A grid has **100 small squares**. **7** are coloured blue and **28** are coloured yellow. Write each part as a fraction and a decimal.",
            parts: [fq("gf", "Blue (fraction)", "7/100"), dq("gd", "Blue (decimal)", "0.07"), fq("pf", "Yellow (fraction)", "28/100"), dq("pd", "Yellow (decimal)", "0.28")],
            help: [{ text: "Out of 100 squares: blue is 7/100 and yellow is 28/100." }, { text: "Hundredths have 2 decimal places: 7/100 = 0.07 and 28/100 = 0.28." }, { text: "Answer: **7/100 = 0.07** and **28/100 = 0.28**." }] },
            { type: "hgrid", cells: [[0, 7, "a"], [7, 35, "b"]] }),
          fig({ id: "q8c", prompt: "A cake is cut into **5 equal pieces**. **3 pieces** are given to friends. What part was given away, and what part is left?",
            parts: [fq("gf", "Given (fraction)", "3/5"), dq("gd", "Given (decimal)", "0.6"), fq("lf", "Left (fraction)", "2/5"), dq("ld", "Left (decimal)", "0.4")],
            help: [{ text: "Given away: 3 out of 5 = 3/5. Left: 5 − 3 = 2 pieces = 2/5." }, { text: "Make the denominator 10: 3/5 = 6/10 = 0.6 and 2/5 = 4/10 = 0.4." }, { text: "Answer: given **3/5 = 0.6**, left **2/5 = 0.4**." }] },
            { type: "pie", parts: 5, shade: [[0, 3]] })
        ] },
      { id: "q9", title: "Zeros at the end", instruction: "From the project work (Q9b). Shade 1 strip of 10 and 10 squares of 100 to see it.",
        questions: [["0.1", "0.10"], ["0.3", "0.30"], ["0.5", "0.50"]].map(function (p, i) {
          return { id: "q9" + L[i], prompt: "Is **" + p[0] + " = " + p[1] + "**?",
            figure: { type: "row", items: [{ type: "fbar", parts: 10, shade: [[0, +p[0][2]]], caption: p[0] }, "=", { type: "hgrid", small: true, rects: [[0, 0, +p[0][2], 10]], caption: p[1] }] },
            parts: [{ id: "v", label: "", type: "choice", options: ["Yes", "No"], answer: "Yes" }],
            help: [{ text: p[0] + " = " + p[0][2] + "/10 and " + p[1] + " = " + p[0][2] + "0/100." }, { text: p[0][2] + "0/100 = " + p[0][2] + "/10 (divide both by 10). The same part is shaded." }, { text: "Answer: **Yes**. A zero at the end of a decimal does not change its value." }] };
        }) }
    ]
  });
})();
