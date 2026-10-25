/*
  Exercise 6.4: Multiplying and dividing decimals (problems).
  Source: Vedanta Excel in Mathematics, Book 6, pages 118-120.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var D = Practice.dec, C = D.calc, L = "abcdefghijklmnop";
  function dq(id, label, answer, extra) { var o = { id: id, label: label, type: "dec", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function val(e) { return D.str(D.evaluate(e).v); }
  function list(prefix, exprs) { return exprs.map(function (e, i) { return C(prefix + L[i], e); }); }
  // a word problem with several answers: items {label, expr, unit, intro}
  function story(id, prompt, items) {
    var parts = [], help = [];
    items.forEach(function (it, i) {
      var q = C("x", it.expr), ans = q.parts[0].answer, p = dq(L[i], it.label, ans);
      if (it.unit) p.unit = it.unit;
      parts.push(p);
      help.push({ text: "(" + ["i", "ii", "iii"][i] + ") " + (it.intro ? it.intro + " " : "") + q.help.slice(0, -1).map(function (h) { return h.text; }).join(" ") });
    });
    help.push({ text: "Answer: **" + items.map(function (it, i) { return parts[i].answer + (it.unit ? " " + it.unit : ""); }).join("; ") + "**." });
    return { id: id, prompt: prompt, parts: parts, help: help };
  }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }

  // Arrow puzzle (Q3), laid out as in the book
  var N = {
    s: [0, 0, "0.6"], a: [1, 0, "?a"], b: [2, 0, "?b"], c: [3, 0, "?c"], d: [4, 0, "?d"],
    e: [0, 1, "?e"], f: [1, 1, "?f"], g: [2, 1, "?g"], h: [3, 1, "?h"], i: [4, 1, "?i"],
    j: [0, 2, "?j"], k: [1, 2, "?k"], l: [2, 2, "?l"], m: [3, 2, "?m"], z: [4, 2, "6"]
  };
  var A = [["s", "a", "÷ 2"], ["a", "b", "× 10"], ["b", "c", "+ 0.5"], ["c", "d", "− 0.8"], ["d", "i", "× 2"],
    ["s", "e", "+ 4.2"], ["e", "f", "− 2.5"], ["f", "g", "+ 0.8"], ["h", "g", "− 2.8"], ["i", "h", "+ 0.5"], ["i", "z", "÷ 0.9"],
    ["e", "j", "− 1.5"], ["j", "k", "× 2"], ["k", "l", "÷ 3"], ["l", "m", "− 0.6"], ["m", "z", "+ 4.4"]];
  var ANS = { a: "0.3", b: "3", c: "3.5", d: "2.7", e: "4.8", f: "2.3", g: "3.1", h: "5.9", i: "5.4", j: "3.3", k: "6.6", l: "2.2", m: "1.6" };

  Practice.register({
    id: "math-decimals-g6-ex6-4",
    subject: "Mathematics",
    unit: "Decimals",
    title: "Exercise 6.4",
    topic: "Multiplying and dividing: problems",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 118–120",

    reference: {
      title: "Multiplying and dividing decimals",
      columns: ["Idea", "Example"],
      rows: [
        ["×: multiply without points, then count decimal places", "3.6 × 2.4: 36 × 24 = 864, 2 places → 8.64"],
        ["÷ by a whole number: point in the answer above the point", "5.04 ÷ 24 = 0.21"],
        ["÷ by a decimal: make the divisor whole first", "12.42 ÷ 0.9 = 124.2 ÷ 9 = 13.8"],
        ["Order: brackets, then × and ÷, then + and −", "2.36 − 1.28 ÷ 1.6 = 2.36 − 0.8 = 1.56"],
        ["Cost of many = cost of 1 × number", "9 pens at Rs 15.25 = Rs 137.25"],
        ["Cost of 1 = total cost ÷ number", "12 books for Rs 225.72 → Rs 18.81 each"],
        ["Area of a rectangle = length × breadth", "7.8 × 5.4 = 42.12 sq. cm"]
      ]
    },

    sections: [
      { id: "q1", title: "Find the products", instruction: "Creative Section A.",
        questions: list("q1", ["2.6 × 7", "3.48 × 9", "6.03 × 14", "7.34 × 16", "0.432 × 18", "0.068 × 27", "1.2 × 0.3", "3.6 × 2.4", "5.68 × 3.7", "3.69 × 4.52", "0.73 × 0.6", "0.057 × 0.004"]) },
      { id: "q2", title: "Find the quotients", instruction: "Make the divisor a whole number when it has a decimal point.",
        questions: list("q2", ["3.6 ÷ 3", "5.64 ÷ 4", "4.248 ÷ 18", "5.04 ÷ 24", "0.624 ÷ 8", "0.054 ÷ 15", "2.5 ÷ 0.5", "4.8 ÷ 0.8", "12.42 ÷ 0.9", "6.25 ÷ 2.5", "0.35 ÷ 0.7", "0.224 ÷ 1.4"]) },
      { id: "q3", title: "Puzzle time", instruction: "Start at 0.6 and follow the arrows.",
        questions: [{ id: "q3a", prompt: "Fill in the empty circles. Follow each arrow from its tail to its head.",
          figure: { type: "flow", nodes: N, arrows: A },
          parts: Object.keys(ANS).map(function (k) { return dq(k, k, ANS[k]); }),
          help: [
            { text: "Top row: 0.6 ÷ 2 = 0.3 (a), 0.3 × 10 = 3 (b), 3 + 0.5 = 3.5 (c), 3.5 − 0.8 = 2.7 (d)." },
            { text: "Down from d: 2.7 × 2 = 5.4 (i). Then i + 0.5 = 5.9 (h), and 5.9 − 2.8 = 3.1 (g)." },
            { text: "Down from the start: 0.6 + 4.2 = 4.8 (e). Then 4.8 − 2.5 = 2.3 (f), and 2.3 + 0.8 = 3.1, the same g ✓" },
            { text: "Down from e: 4.8 − 1.5 = 3.3 (j). Then 3.3 × 2 = 6.6 (k), 6.6 ÷ 3 = 2.2 (l), 2.2 − 0.6 = 1.6 (m)." },
            { text: "Check the end: 1.6 + 4.4 = 6 ✓ and 5.4 ÷ 0.9 = 54 ÷ 9 = 6 ✓" },
            { text: "Answer: **" + Object.keys(ANS).map(function (k) { return k + " = " + ANS[k]; }).join(", ") + "**." }] }] },
      { id: "q4", title: "Simplify", instruction: "Brackets first, then × and ÷, then + and −.",
        questions: list("q4", ["2 × (0.4 + 0.3)", "3 × (0.9 − 0.4)", "(0.2 + 0.6) ÷ 2", "(3 × 0.8) ÷ (2 × 0.2)", "2.36 − 1.28 ÷ 1.6", "1.3 × 0.4 + 2.4 × 0.3 − 1.8 × 0.2"]) },
      { id: "q5", title: "Pens and cloth", instruction: "Multiply.",
        questions: [
          C("q5a", "15.25 × 9", { prompt: "The cost of a pen is **Rs 15.25**. Find the cost of **9 pens**.", label: "Rs", intro: ["Cost of 9 pens = 9 × cost of 1 pen."] }),
          C("q5b", "1.35 × 6", { prompt: "**1.35 m** of cloth is needed for 1 shirt. How much cloth is needed for **6 shirts** of the same size?", unit: "m", intro: ["Cloth for 6 shirts = 6 × 1.35 m."] })
        ] },
      { id: "q6", title: "Books, rope and copies", instruction: "Divide to find one; multiply to find many.",
        questions: [
          C("q6a", "225.72 ÷ 12", { prompt: "One dozen exercise books cost **Rs 225.72**. Find the cost of **1** exercise book.", label: "Rs", intro: ["1 dozen = 12, so the cost of 1 book = 225.72 ÷ 12."] }),
          C("q6b", "11.55 ÷ 7", { prompt: "A rope **11.55 m** long is cut into **7 equal pieces**. Find the length of each piece.", unit: "m", intro: ["Each piece = 11.55 ÷ 7."] }),
          story("q6c", "The cost of **3 copies** is **Rs 91.50**.", [
            { label: "(i) Cost of 1 copy (Rs)", expr: "91.5 ÷ 3", intro: "1 copy = 91.50 ÷ 3." },
            { label: "(ii) Cost of 5 copies (Rs)", expr: "30.5 × 5", intro: "5 copies = 5 × 30.50." }])
        ] },
      { id: "q7", title: "Rectangles", instruction: "A = l × b and l = A ÷ b.",
        questions: [
          C("q7a", "7.8 × 5.4", { prompt: "The area of a rectangle is **length × breadth**. The length is **7.8 cm** and the breadth is **5.4 cm**. Find the area.", unit: "sq. cm", intro: ["Area = l × b = 7.8 × 5.4."] }),
          C("q7b", "28.35 ÷ 4.5", { prompt: "The length of a rectangle is **Area ÷ Breadth**. The area is **28.35 sq. cm** and the breadth is **4.5 cm**. Find the length.", unit: "cm", intro: ["Length = A ÷ b = 28.35 ÷ 4.5."] })
        ] },
      { id: "q8", title: "Fuel and money exchange", instruction: "Creative Section B.",
        questions: [
          story("q8a", "Mother recorded her car's fuel use: **City 21.4 km per litre**, **Highway 23.5 km per litre**. The tank holds **40.2 litres** of petrol. How far can she drive on a full tank…", [
            { label: "(i) in the city", expr: "21.4 × 40.2", unit: "km", intro: "Each litre goes 21.4 km, so 40.2 litres go 21.4 × 40.2 km." },
            { label: "(ii) on the highway", expr: "23.5 × 40.2", unit: "km", intro: "On the highway: 23.5 × 40.2 km." }]),
          story("q8b", "On 30 August 2023, Nepal Rastra Bank's rates for **1 Australian dollar** were: **buying Rs 85.98**, **selling Rs 86.42**.", [
            { label: "(i) Rupees to buy 25.5 AU$", expr: "86.42 × 25.5", intro: "When you buy dollars, the bank sells them to you, so use the selling rate Rs 86.42. Cost = 25.5 × 86.42." },
            { label: "(ii) Rupees for selling 80 AU$", expr: "85.98 × 80", intro: "When you sell dollars, the bank buys them, so use the buying rate Rs 85.98. You get 80 × 85.98." }])
        ] },
      { id: "q9", title: "Apples and wages", instruction: "Find the rate for one first.",
        questions: [
          story("q9a", "In a supermarket a **1.4 kg** bag of apples costs **Rs 196.70**.", [
            { label: "(i) Cost of 1 kg (Rs)", expr: "196.7 ÷ 1.4", intro: "Cost of 1 kg = 196.70 ÷ 1.4." },
            { label: "(ii) Weight for Rs 491.75", expr: "491.75 ÷ 140.5", unit: "kg", intro: "Each kg costs Rs 140.50, so the weight = 491.75 ÷ 140.5." }]),
          story("q9b", "Last week, Mr. Lama worked **38.5 hours** and earned **Rs 5563.25**.", [
            { label: "(i) Money per hour (Rs)", expr: "5563.25 ÷ 38.5", intro: "Per hour = 5563.25 ÷ 38.5." },
            { label: "(ii) Hours to earn Rs 6574.75", expr: "6574.75 ÷ 144.5", unit: "hours", intro: "He earns Rs 144.50 each hour, so hours = 6574.75 ÷ 144.5." }])
        ] },
      { id: "q10", title: "Find the mistake", instruction: "Order of operations.",
        questions: [
          (function () {
            var q = C("q10a", "12 × (4.8 ÷ 0.3) − 3.5 × 3.64", { prompt: "Anamol, Shadeep and Bishal simplified **12 × (4.8 ÷ 0.3) − 3.5 × 3.64**. Anamol got **39.12**, Shadeep got **179.26** and Bishal got **64.6**. Simplify it, then answer." });
            var opts = ["He did the subtraction before multiplying by 12", "He put the decimal point in the wrong place in 3.5 × 3.64", "He divided 4.8 by 3 instead of by 0.3"];
            q.parts.push(ch("who", "Who is correct?", ["Anamol", "Shadeep", "Bishal"], "Shadeep"));
            q.parts.push(ch("an", "Anamol's mistake", opts, opts[0]));
            q.parts.push(ch("bi", "Bishal's mistake", opts, opts[1]));
            q.parts[0].label = "Answer";
            q.help.splice(q.help.length - 1, 0,
              { text: "Shadeep's 179.26 is right." },
              { text: "Anamol: 12 × (16 − 3.5 × 3.64) = 12 × (16 − 12.74) = 12 × 3.26 = 39.12. He subtracted before multiplying by 12." },
              { text: "Bishal: 192 − 127.4 = 64.6. He wrote 3.5 × 3.64 = 127.4, but 1 + 2 = 3 decimal places gives 12.740 = 12.74." });
            q.help[q.help.length - 1].text = "Answer: **179.26**. Shadeep is correct.";
            return q;
          })(),
          C("q10b", "{2.5 × (4.3 − 3.4) ÷ (1.5)²} + 0.1", { prompt: "Evaluate by showing all steps: **{2.5 × (4.3 − 3.4) ÷ (1.5)²} + 0.1**" })
        ] }
    ]
  });
})();
