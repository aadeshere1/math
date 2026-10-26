/*
  Exercise 19.1: Data, frequency and tally marks.
  Source: Vedanta Excel in Mathematics, Book 6, pages 274-275.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
  The frequency tables are counted from the data lists below, so they always match.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, unit) { var p = { id: id, label: label, type: "number", answer: answer }; if (unit) p.unit = unit; return p; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function count(data) { var c = {}; data.forEach(function (v) { c[v] = (c[v] || 0) + 1; }); return Object.keys(c).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return [k, c[k]]; }); }
  function tally(n) { var s = ""; for (var i = 0; i < Math.floor(n / 5); i++) s += "卌 "; for (var j = 0; j < n % 5; j++) s += "|"; return s.trim(); }
  function table(head, cnt, blank) {
    return { type: "grid", cws: [90, 110, 90], rows: [[head, "Tally marks", "Frequency"]].concat(cnt.map(function (r, i) { return [String(r[0]), blank ? "" : tally(r[1]), blank ? "?" + L[i] : String(r[1])]; })) };
  }
  // one question per frequency table: one box per value
  function freqQ(id, prompt, head, data, unit) {
    var cnt = count(data), total = data.length;
    return { id: id, prompt: prompt + "\n\n" + data.join(", "), figure: table(head, cnt, true),
      parts: cnt.map(function (r, i) { return nm(L[i], "(" + L[i] + ") " + r[0] + (unit ? " " + unit : ""), r[1]); }),
      help: [{ text: "Go through the list once. For each value put a tally mark | in its row. Every 5th mark crosses the four before it: 卌 means 5." },
        { text: "Counts: " + cnt.map(function (r) { return r[0] + " → " + tally(r[1]) + " = " + r[1]; }).join("; ") + "." },
        { text: "Check: the frequencies add up to " + cnt.map(function (r) { return r[1]; }).join(" + ") + " = " + total + ", the number of data ✓", figure: table(head, cnt, false) },
        { text: "Answer: **" + cnt.map(function (r) { return r[0] + ": " + r[1]; }).join(", ") + "**." }] };
  }
  var MARKS = [20, 15, 22, 24, 19, 15, 20, 24, 19, 24, 22, 19, 20, 24, 15, 20, 24, 19, 20, 22];
  var HEIGHTS = [110, 100, 95, 100, 120, 115, 110, 125, 95, 110, 120, 125, 110, 115, 120, 100, 130, 110, 120, 115, 110, 115, 125, 110, 115, 100, 110, 120, 115, 110];
  var WAGES = [75, 60, 80, 55, 90, 85, 70, 65, 80, 75, 80, 65, 70, 80, 55, 90, 80, 60, 70, 95, 90, 75, 65, 70, 75, 80, 95, 80, 80, 70, 85, 75, 80, 60, 65, 70, 80, 85, 80, 85];
  var KIDS = [2, 1, 3, 2, 2, 1, 2, 3, 4, 3, 2, 1, 1, 2, 1, 2, 3, 2, 1, 2];
  var kc = {}; KIDS.forEach(function (v) { kc[v] = (kc[v] || 0) + 1; });

  Practice.register({
    id: "math-stats-g6-ex19-1",
    subject: "Mathematics",
    unit: "Statistics",
    title: "Exercise 19.1",
    topic: "Frequency tables",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 274–275",

    reference: {
      title: "Frequency tables",
      columns: ["Word", "Meaning"],
      rows: [
        ["Data", "a collection of numbers or facts, e.g. the marks of a class"],
        ["Frequency", "how many times a value appears in the data"],
        ["Tally mark", "| for each time a value appears"],
        ["卌", "5 tally marks: four bars crossed by the fifth"],
        ["Check", "the frequencies add up to the number of data"]
      ]
    },

    sections: [
      { id: "q1", title: "Words", instruction: "Choose the right meaning.",
        questions: [
          { id: "q1a", prompt: "What is **data**?", parts: [ch("v", "", ["a collection of numbers or facts", "the number of times a value appears", "the biggest value"], "a collection of numbers or facts")],
            help: [{ text: "Data is information collected as numbers or facts, like the marks of 20 students." }, { text: "Answer: **a collection of numbers or facts**." }] },
          { id: "q1b", prompt: "What is the **frequency** of an observation?", parts: [ch("v", "", ["a collection of numbers or facts", "the number of times it appears in the data", "the middle value"], "the number of times it appears in the data")],
            help: [{ text: "If 20 marks appear 5 times, the frequency of 20 is 5." }, { text: "Answer: **the number of times it appears in the data**." }] }
        ] },
      { id: "q2", title: "Marks", instruction: "Prepare a frequency table with tally marks. Type each frequency.",
        questions: [freqQ("q2a", "The marks of 20 students of class 6 out of 25 full marks:", "Marks", MARKS)] },
      { id: "q3", title: "Heights", instruction: "Prepare a frequency table with tally marks. Type each frequency.",
        questions: [freqQ("q3a", "Heights (in cm) of 30 students of a class:", "Height (cm)", HEIGHTS)] },
      { id: "q4", title: "Daily wages", instruction: "Present the data in a frequency table using tally marks. Type each frequency.",
        questions: [freqQ("q4a", "Daily wages (in Rs) of 40 workers in a factory:", "Wage (Rs)", WAGES)] },
      { id: "q5", title: "Desired children", instruction: "Creative Section. 20 married couples were asked how many children they want.",
        questions: [freqQ("q5a", "Make the frequency table of the responses:", "Children", KIDS)].concat([
          ["How many couples desired only one child?", kc[1], "Look at the row for 1 child: " + kc[1] + "."],
          ["How many couples desired two children?", kc[2], "Row for 2 children: " + kc[2] + "."],
          ["How many couples desired three children?", kc[3], "Row for 3 children: " + kc[3] + "."],
          ["How many couples desired more than three children?", kc[4], "More than 3 means 4 or more. Only the row for 4: " + kc[4] + "."],
          ["How many couples desired less than 3 children?", kc[1] + kc[2], "Less than 3 means 1 or 2: " + kc[1] + " + " + kc[2] + " = " + (kc[1] + kc[2]) + "."]
        ].map(function (m, i) { return { id: "q5" + L[i + 1], prompt: m[0], parts: [nm("v", "Couples", m[1])], help: [{ text: m[2] }, { text: "Answer: **" + m[1] + "**." }] }; })).concat([
          { id: "q5g", prompt: "What number of children is wanted by the most couples?", parts: [nm("v", "Children", 2)],
            help: [{ text: "The biggest frequency is " + kc[2] + ", in the row for 2 children." }, { text: "Answer: **2 children**." }] }
        ]) }
    ]
  });
})();
