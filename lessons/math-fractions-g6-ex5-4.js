/*
  Exercise 5.4: Multiplication and division of fractions.
  Source: Vedanta Excel in Mathematics, Book 6, pages 95-100.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var C = Practice.fr.calc, F = Practice.fr;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit) { var o = { id: id, label: label, type: "number", answer: answer }; if (unit) o.unit = unit; return o; }
  function fr(id, label, answer, extra) { var o = { id: id, label: label, type: "frac", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function ans(id, label, v) { return F.isInt(v) ? nm(id, label, v[0]) : fr(id, label, F.mixed(v), { mixedOk: true, lowest: true }); }
  var L = "abcdefghijklmnop";
  function list(prefix, exprs, opts) { return exprs.map(function (e, i) { return C(prefix + L[i], e, opts); }); }
  function fig(q, f) { q.figure = f; return q; }
  function box(n, m) { return { type: "fbar", parts: n, shade: [[0, m]] }; }

  // k boxes each with m of n parts shaded: k × m/n
  function groups(id, k, n, m) {
    var items = []; for (var i = 0; i < k; i++) { if (i) items.push("+"); items.push(box(n, m)); }
    var r = F.mul([k, 1], [m, n]), shown = F.mixed(r);
    return { id: id, prompt: "Each box is one whole. Write the sum as a multiplication.", figure: { type: "row", items: items },
      parts: [nm("k", "Number of boxes", k), fr("f", "Shaded in each box", m + "/" + n), ans("r", k + " × " + m + "/" + n + " =", r)],
      help: [{ text: "There are " + k + " boxes and each has " + m + "/" + n + " shaded." }, { text: k + " × " + m + "/" + n + " = " + k * m + "/" + n + "." },
             { text: "Answer: **" + k * m + "/" + n + (k * m + "/" + n !== shown ? " = " + shown : "") + "**." }] };
  }
  function over(id, top, bottom) {
    return C(id, top + " ÷ " + bottom, { prompt: "**" + top + "** over **" + bottom + "**" });
  }
  function money(id, expr, prompt) { var q = C(id, expr, { prompt: prompt }); q.parts[0].label = "Rs"; return q; }

  Practice.register({
    id: "math-fractions-g6-ex5-4",
    subject: "Mathematics",
    unit: "Fractions",
    title: "Exercise 5.4",
    topic: "Multiplying and dividing fractions",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 95–100",

    reference: {
      title: "Multiplying and dividing",
      columns: ["Idea", "Example"],
      rows: [
        ["Whole number × fraction: multiply the numerator", "3 × 2/9 = 6/9 = 2/3"],
        ["Fraction × fraction: tops together, bottoms together", "2/3 × 4/5 = 8/15"],
        ["\"of\" means ×", "1/3 of 15 = 1/3 × 15 = 5"],
        ["Reciprocal: turn the fraction upside down", "reciprocal of 4/5 is 5/4; of 6 is 1/6"],
        ["Dividing: multiply by the reciprocal", "4 ÷ 2/3 = 4 × 3/2 = 6"],
        ["Mixed numbers: change to improper fractions first", "1 1/2 × 1 1/3 = 3/2 × 4/3 = 2"],
        ["Order: \"of\" first, then × and ÷ from left to right", "1/2 ÷ 3/4 of 2/5 = 1/2 ÷ 3/10 = 5/3"],
        ["Per cent: out of 100", "25% of 40 = 25/100 × 40 = 10"],
        ["How to type", "Fraction 5/3 or mixed number 1 2/3. Whole numbers as they are."]
      ]
    },

    sections: [
      { id: "q1", title: "Multiplication from pictures", instruction: "Type fractions like 3/2 or mixed numbers like 1 1/2.",
        questions: [groups("q1a", 2, 2, 1), groups("q1b", 3, 2, 1), groups("q1c", 3, 3, 2), groups("q1d", 5, 4, 3)] },
      { id: "q2", title: "A fraction of a fraction", instruction: "\"of\" means ×. Shade a part of the shaded part.",
        questions: [
          fig(C("q2a", "1/2 of 1/2"), { type: "row", items: [box(2, 1), "→", { type: "fbar", parts: 4, shade: [[0, 1, "b"]] }] }),
          fig(C("q2b", "1/3 of 1/2"), { type: "row", items: [box(2, 1), "→", { type: "fbar", parts: 6, shade: [[0, 1, "b"]] }] }),
          fig(C("q2c", "1/4 of 1/3"), { type: "row", items: [box(3, 1), "→", { type: "fbar", parts: 12, shade: [[0, 1, "b"]] }] })
        ] },
      { id: "q3", title: "How many halves, thirds and quarters?", instruction: "Divide by the fraction: multiply by its reciprocal.",
        questions: [
          fig(C("q3a", "4 ÷ 1/2", { prompt: "How many **halves** are there in **4 breads**?" }), { type: "pie", parts: 2, count: 4 }),
          fig(C("q3b", "3 ÷ 1/3", { prompt: "How many **thirds** are there in **3 breads**?" }), { type: "pie", parts: 3, count: 3 }),
          fig(C("q3c", "5 ÷ 1/4", { prompt: "How many **quarters** are there in **5 breads**?" }), { type: "pie", parts: 4, count: 5 }),
          fig(C("q3d", "1/2 ÷ 1/2", { prompt: "How many **halves** are there in **a half bread**?" }), { type: "pie", parts: 2, shade: [[0, 1]] }),
          fig(C("q3e", "1/2 ÷ 1/3", { prompt: "How many **thirds** are there in **a half circle**?" }), { type: "row", items: [{ type: "pie", parts: 2, shade: [[0, 1]] }, "→", { type: "pie", parts: 6, shade: [[0, 2, "b"], [2, 3]] }] }),
          fig(C("q3f", "1/2 ÷ 1/4", { prompt: "How many **quarters** are there in **a half circle**?" }), { type: "row", items: [{ type: "pie", parts: 2, shade: [[0, 1]] }, "→", { type: "pie", parts: 4, shade: [[0, 2, "b"]] }] })
        ] },
      { id: "q4", title: "Division from pictures", instruction: "Dividing by 2 is the same as multiplying by 1/2.",
        questions: [
          fig(C("q4a", "1/2 ÷ 2", { prompt: "Divide **a half bread** into **2 equal parts**. What fraction of the bread is one part?" }), { type: "row", items: [box(2, 1), "→", { type: "fbar", parts: 4, shade: [[0, 1, "b"], [1, 2]] }] }),
          fig(C("q4b", "1/2 ÷ 3", { prompt: "Divide **a half bread** into **3 equal parts**. What fraction of the bread is one part?" }), { type: "row", items: [box(2, 1), "→", { type: "fbar", parts: 6, shade: [[0, 1, "b"], [1, 3]] }] }),
          fig(C("q4c", "2/3 ÷ 2", { prompt: "Divide **two-thirds of a bread** into **2 equal parts**. What fraction of the bread is one part?" }), { type: "row", items: [box(3, 2), "→", { type: "fbar", parts: 6, shade: [[0, 2, "b"], [2, 4]] }] })
        ] },
      { id: "q5", title: "Parts of pizzas", instruction: "Type the number of pizzas.",
        questions: [["1/2 of 4", "Half of 4 pizzas"], ["1/2 of 6", "Half of 6 pizzas"], ["1/3 of 6", "One-third of 6 pizzas"], ["2/3 of 6", "Two-thirds of 6 pizzas"], ["3/4 of 8", "Three-quarters of 8 pizzas"]]
          .map(function (p, i) { return C("q5" + L[i], p[0], { prompt: "**" + p[1] + "**", unit: "pizzas" }); }) },
      { id: "q6", title: "Repeated addition", instruction: "Example: 1/5 + 1/5 + 1/5 = 3 × 1/5 = 3/5.",
        questions: [[3, "1/4"], [4, "1/7"], [5, "2/9"]].map(function (p, i) {
          var terms = []; for (var k = 0; k < p[0]; k++) terms.push(p[1]);
          var v = F.mul([p[0], 1], F.of(p[1]));
          return { id: "q6" + L[i], prompt: "**" + terms.join(" + ") + "**", parts: [nm("k", "How many times?", p[0]), ans("v", p[0] + " × " + p[1] + " =", v)],
            help: [{ text: p[1] + " is added " + p[0] + " times, so it is " + p[0] + " × " + p[1] + "." }, { text: "Multiply the numerator: " + p[0] + " × " + p[1].split("/")[0] + " = " + p[0] * +p[1].split("/")[0] + "." },
                   { text: "Answer: **" + p[0] + " × " + p[1] + " = " + F.str(v) + (v[0] > v[1] ? " = " + F.mixed(v) : "") + "**." }] };
        }) },
      { id: "q7", title: "Quick answers", instruction: "Say and write the answers as quickly as possible.",
        questions: list("q7", ["1/2 × 6", "1/3 × 9", "10 × 3/5", "30 × 5/6", "1/2 × 6/7", "1/3 × 9/10", "1/2 of 20", "1/3 of 15"]).concat([
          money("q7i", "1/4 of 44", "**1/4 of Rs 44**"),
          { id: "q7j", prompt: "Reciprocal of **1/2**", parts: [nm("v", "", 2)], help: [{ text: "Turn it upside down: 2/1 = 2." }, { text: "Answer: **2**." }] },
          { id: "q7k", prompt: "Reciprocal of **6**", parts: [fr("v", "", "1/6")], help: [{ text: "6 = 6/1. Turn it upside down: 1/6." }, { text: "Answer: **1/6**." }] },
          { id: "q7l", prompt: "Reciprocal of **4/5**", parts: [fr("v", "", "5/4", { den: 4 })], help: [{ text: "Turn it upside down." }, { text: "Answer: **5/4**." }] }
        ], list("q7", ["2 ÷ 1/3", "3 ÷ 1/4", "1/2 ÷ 2"]).map(function (q, i) { q.id = "q7" + "mno"[i]; return q; })) },
      { id: "q8", title: "Fraction over a number", instruction: "A fraction line means divide: (1/2) over 3 = 1/2 ÷ 3.",
        questions: [["1/2", "3"], ["1/2", "4"], ["1", "2/4"], ["1", "3/5"], ["1/3", "2"], ["1/4", "2"], ["2", "1/4"], ["1", "5/3"]].map(function (p, i) { return over("q8" + L[i], p[0], p[1]); }) },
      { id: "q9", title: "Multiply", instruction: "Creative section A. Cancel common factors first. Answers in lowest terms.",
        questions: list("q9", ["3 × 1/5", "8 × 2/7", "5/9 × 2", "2/3 × 9", "5/6 × 24", "10 × 7/8", "18 × 2/15", "2/3 × 4/5", "3/4 × 5/8", "4/7 × 7/8", "5/8 × 8/15", "5/6 × 8/15", "15/16 × 12/25", "1 1/2 × 1 1/3", "4 3/8 × 1 1/15"]) },
      { id: "q10", title: "Divide", instruction: "Multiply by the reciprocal. Answers in lowest terms.",
        questions: list("q10", ["4 ÷ 2/3", "9 ÷ 3/5", "3/5 ÷ 9", "4/9 ÷ 12", "1/2 ÷ 3/4", "6/7 ÷ 36/49", "3 3/4 ÷ 1 1/2", "3 1/8 ÷ 2 1/2", "9 3/8 ÷ 3 3/4", "3 3/8 ÷ 2 1/4"]) },
      { id: "q11", title: "Simplify", instruction: "Work from left to right.",
        questions: list("q11", ["2/3 × 9/10 × 5/6", "4/5 × 15/16 × 8/9", "3/7 × 28/33 × 22/24", "3/5 × 10/21 ÷ 8/35", "16/25 × 15/28 ÷ 6/7", "20/27 ÷ 10/9 × 15/16",
          "2 2/11 ÷ 1 5/22 × 1 13/14", "1 1/20 ÷ 4 9/10 × 1 5/9", "3 3/4 × 2 2/3 ÷ 2 2/9", "250/240 × 180/200 ÷ 1500/1200", "1000/800 ÷ 2500/4000 × 500/6000", "2700/2500 ÷ 1800/3500 × 5000/1400"]) },
      { id: "q12", title: "Fractions over fractions", instruction: "The top divided by the bottom.",
        questions: [["1", "2/3"], ["4", "8/3"], ["2/3", "4"], ["6/7", "9"], ["5/6", "10/18"], ["9/10", "18/25"]].map(function (p, i) { return over("q12" + L[i], p[0], p[1]); }) },
      { id: "q13", title: "Find the value", instruction: "\"of\" means ×.",
        questions: [["2/3", 30, "Rs"], ["4/5", 100, "Rs"], ["3/8", 40, "pupils"], ["6/7", 350, "kg"], ["3/5", 200, "m"], ["7/10", 50, "km"], ["4/9", 270, "men"], ["5/6", 360, "girls"], ["3/7", 140, "girls"]].map(function (p, i) {
          var id = "q13" + L[i], e = p[0] + " of " + p[1];
          return p[2] === "Rs" ? money(id, e, "**" + p[0] + " of Rs " + p[1] + "**") : C(id, e, { prompt: "**" + p[0] + " of " + p[1] + " " + p[2] + "**", unit: p[2] });
        }) },
      { id: "q14", title: "Per cent of a quantity", instruction: "25% of 40 = 25/100 × 40 = 10.",
        questions: [[5, 200, "Rs"], [10, 60, "Rs"], [20, 500, "Rs"], [25, 60, "boys"], [50, 450, "students"], [75, 400, "Rs"]].map(function (p, i) {
          var id = "q14" + L[i], e = p[0] + "/100 of " + p[1];
          var q = p[2] === "Rs" ? money(id, e, "**" + p[0] + "% of Rs " + p[1] + "**") : C(id, e, { prompt: "**" + p[0] + "% of " + p[1] + " " + p[2] + "**", unit: p[2] });
          q.help[0].text = p[0] + "% = " + p[0] + "/100 = " + F.str(F.of(p[0] + "/100")) + ".";
          return q;
        }) },
      { id: "q15", title: "Simplify with \"of\"", instruction: "Do \"of\" first, then divide.",
        questions: list("q15", ["1/2 ÷ 3/4 of 2/5", "2/3 ÷ 5/6 of 3/10", "3/4 of 2/7 ÷ 8/21", "1/4 of 2 2/7 ÷ 3/5"]) },
      { id: "q16", title: "Rice and car", instruction: "Type whole numbers.",
        questions: [money("q16a", "85 1/2 × 10", "1 kg of rice costs **Rs 85 1/2**. Find the cost of **10 kg**."),
                    C("q16b", "1 3/4 × 12", { prompt: "A car travels **1 3/4 km** in 1 minute. How far does it travel in **12 minutes**?", unit: "km" })] },
      {
        id: "q17", title: "Chart paper and bread", instruction: "Type fractions like 1/6.",
        questions: [
          C("q17a", "1/2 of 1/3", { prompt: "A teacher cut **one-third** of a chart paper and gave it to a student to colour **half** of it. What fraction of the whole chart paper did the student colour?" }),
          { id: "q17b", prompt: "Mother gives **half** of a bread to brother. Brother divides this half into **3 equal parts** and gives **one part** to his sister.", figure: { type: "fbar", parts: 6, shade: [[0, 1, "b"], [1, 3]] },
            parts: [fr("i", "(i) Sister gets", "1/6"), fr("ii", "(ii) Left with brother", "1/3")],
            help: [{ text: "Sister: 1/3 of 1/2 = 1/3 × 1/2 = 1/6." }, { text: "Brother keeps 1/2 − 1/6 = 3/6 − 1/6 = 2/6 = 1/3." }, { text: "Answer: **1/6** and **1/3**." }] }
        ]
      },
      {
        id: "q18", title: "Work", instruction: "Type fractions like 1/3.",
        questions: [
          C("q18a", "3 × 1/9", { prompt: "Anamol can do **1/9** of a work in 1 day. How much work does he do in **3 days**?" }),
          { id: "q18b", prompt: "Mrs. Maharjan can do **1/6** of a work in 1 day. She worked for **2 days** and left. Mrs. Rai did the rest.",
            parts: [fr("i", "(i) Mrs. Maharjan did", "1/3"), fr("ii", "(ii) Work left", "2/3"), fr("iii", "(iii) Mrs. Rai did", "2/3")],
            help: [{ text: "2 days × 1/6 = 2/6 = 1/3." }, { text: "Left: 1 − 1/3 = 2/3. Mrs. Rai did all of that." }, { text: "Answer: **1/3, 2/3, 2/3**." }] },
          { id: "q18c", prompt: "Bhurashi can do **1/20** of a work in 1 day. She worked for **4 days** and left. Rita did the rest.",
            parts: [fr("b", "Bhurashi did", "1/5"), fr("r", "Rita did", "4/5")],
            help: [{ text: "Bhurashi: 4 × 1/20 = 4/20 = 1/5." }, { text: "Rita: 1 − 1/5 = 4/5." }, { text: "Answer: **1/5** and **4/5**." }] }
        ]
      },
      {
        id: "q19", title: "Jars and rope", instruction: "Divide by the mixed number.",
        questions: [
          C("q19a", "50 ÷ 2 1/2", { prompt: "How many jars of **2 1/2 litres** each are needed to empty a vessel of **50 litres** of milk?", unit: "jars" }),
          C("q19b", "40 ÷ 3 1/3", { prompt: "A rope is **40 m** long. How many **3 1/3 m** pieces can be cut from it?", unit: "pieces" })
        ]
      },
      {
        id: "q20", title: "Money and distance", instruction: "Type whole numbers.",
        questions: [
          C("q20a", "3/10 of 7290", { prompt: "In a PCR test of **7,290** suspected people, **3/10** were found Corona positive. How many people were positive?", unit: "people" }),
          { id: "q20b", prompt: "Mr. Shakya earns **Rs 18,000** a month. He spends **5/9** of it to run his family.",
            parts: [nm("i", "(i) Spends Rs", 10000), nm("ii", "(ii) Saves Rs", 8000)],
            help: [{ text: "5/9 of 18,000 = 18,000 ÷ 9 × 5 = 2,000 × 5 = 10,000." }, { text: "Saves 18,000 − 10,000 = 8,000." }, { text: "Answer: **Rs 10,000** and **Rs 8,000**." }] },
          { id: "q20c", prompt: "Father earns **Rs 20,000** a month. He spends **1/4** on food and **2/5** on his children's education.",
            parts: [nm("i", "(i) Food Rs", 5000), nm("ii", "(ii) Education Rs", 8000), nm("iii", "(iii) Total spent Rs", 13000), nm("iv", "(iv) Saves Rs", 7000)],
            help: [{ text: "Food: 1/4 of 20,000 = 5,000." }, { text: "Education: 2/5 of 20,000 = 4,000 × 2 = 8,000." }, { text: "Total 13,000; saves 20,000 − 13,000 = 7,000." }, { text: "Answer: **5,000, 8,000, 13,000, 7,000**." }] },
          { id: "q20d", prompt: "Dhangadhi to Mahendranagar is **60 km**. Mr Chaudhari travelled **1/3** of it by motorbike, **3/5** by taxi and walked the rest.",
            parts: [nm("m", "Motorbike", 20, "km"), nm("t", "Taxi", 36, "km"), nm("w", "Walked", 4, "km")],
            help: [{ text: "Motorbike: 1/3 of 60 = 20 km." }, { text: "Taxi: 3/5 of 60 = 36 km." }, { text: "Walked: 60 − 20 − 36 = 4 km." }, { text: "Answer: **4 km** walked." }] }
        ]
      },
      {
        id: "q21", title: "Pairs of divisions", instruction: "Creative section B. Look at the two answers in each pair.",
        questions: [["6", "2/3"], ["24", "4/9"], ["1 1/4", "1 7/8"]].map(function (p, i) {
          var a = F.div(F.of(p[0]), F.of(p[1])), b = F.div(F.of(p[1]), F.of(p[0]));
          return { id: "q21" + L[i], prompt: "**" + p[0] + " ÷ " + p[1] + "** and **" + p[1] + " ÷ " + p[0] + "**",
            parts: [ans("x", p[0] + " ÷ " + p[1] + " =", a), ans("y", p[1] + " ÷ " + p[0] + " =", b), ch("n", "What do you notice?", ["The answers are reciprocals", "The answers are equal"], "The answers are reciprocals")],
            help: [{ text: p[0] + " ÷ " + p[1] + " = " + F.str(F.of(p[0])) + " × " + F.str([F.of(p[1])[1], F.of(p[1])[0]]) + " = " + F.str(a) + "." },
                   { text: p[1] + " ÷ " + p[0] + " = " + F.str(F.of(p[1])) + " × " + F.str([F.of(p[0])[1], F.of(p[0])[0]]) + " = " + F.str(b) + "." },
                   { text: F.str(a) + " and " + F.str(b) + " are reciprocals: swapping the order turns the answer upside down." },
                   { text: "Answer: **" + F.mixed(a) + "** and **" + F.mixed(b) + "**; they are reciprocals." }] };
        }).concat([["4 1/2", 3], ["5 1/3", 4], ["6 1/4", 5]].map(function (p, i) {
          var d = F.sub(F.of(p[0]), [p[1], 1]), q = F.div(F.of(p[0]), [p[1], 1]);
          return { id: "q21d" + (i + 1), prompt: "(" + ["i", "ii", "iii"][i] + ") **" + p[0] + " − " + p[1] + "** and **" + p[0] + " ÷ " + p[1] + "**",
            parts: [ans("d", "Difference", d), ans("q", "Quotient", q), ch("e", "Equal?", ["Yes", "No"], "Yes")],
            help: [{ text: p[0] + " − " + p[1] + " = " + F.mixed(d) + "." }, { text: p[0] + " ÷ " + p[1] + " = " + F.str(F.of(p[0])) + " × 1/" + p[1] + " = " + F.str(q) + " = " + F.mixed(q) + "." },
                   { text: "Answer: **" + F.mixed(d) + "** both times, so yes, they are equal." }] };
        })) },
      {
        id: "q22", title: "Students", instruction: "Type fractions like 3/20 or whole numbers.",
        questions: [
          { id: "q22a", prompt: "Out of **30 students**, **two-thirds** were successful to get A+ in Maths. Among these successful students, **one-quarter** got A+ in science also.",
            parts: [fr("i", "(i) Fraction of the successful students with A+ in science", "1/4"), nm("ii", "(ii) Students with A+ in science", 5), nm("iii", "(iii) Students without A+ in both subjects", 25)],
            help: [{ text: "Successful in Maths: 2/3 of 30 = 20." }, { text: "A+ in science too: 1/4 of these 20 = 5." }, { text: "Others: 30 − 5 = 25." }, { text: "Answer: **1/4, 5, 25**." }] },
          { id: "q22b", prompt: "Out of **40 students**, **three-fifths** took part in games on sports day. Among the participants, **1/4** took part in high jump.",
            parts: [fr("i", "(i) Fraction of the students in high jump", "3/20"), nm("ii", "(ii) Students in high jump", 6), nm("iii", "(iii) Students in no games", 16)],
            help: [{ text: "High jump: 1/4 of 3/5 = 3/20 of the students." }, { text: "Participants: 3/5 of 40 = 24. High jump: 1/4 of 24 = 6." }, { text: "Not in any games: 40 − 24 = 16." }, { text: "Answer: **3/20, 6, 16**." }] }
        ]
      },
      {
        id: "q23", title: "Patterns", instruction: "Find the rule and complete the sums.",
        questions: [
          { id: "q23a", prompt: "3 = (3 × 2)/2,  3 + 6 = (6 × 3)/2,  3 + 6 + 9 = (9 × 4)/2", parts: [nm("x", "3 + 6 + 9 + 12 =", 30), nm("y", "3 + 6 + 9 + 12 + 15 =", 45)],
            help: [{ text: "Rule: (last number × (number of terms + 1)) / 2." }, { text: "(12 × 5)/2 = 30 and (15 × 6)/2 = 45." }, { text: "Answer: **30** and **45**." }] },
          { id: "q23b", prompt: "1/(1×2) = 1/2,  1/(1×2) + 1/(2×3) = 2/3,  … + 1/(3×4) = 3/4", parts: [fr("x", "… + 1/(4×5) =", "4/5"), fr("y", "… + 1/(5×6) =", "5/6")],
            help: [{ text: "With n terms the answer is n/(n + 1)." }, { text: "4 terms: 4/5. 5 terms: 5/6." }, { text: "Answer: **4/5** and **5/6**." }] }
        ]
      }
    ]
  });
})();
