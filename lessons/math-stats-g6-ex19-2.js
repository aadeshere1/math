/*
  Exercise 19.2: Bar graphs.
  Source: Vedanta Excel in Mathematics, Book 6, pages 276-277.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
  Q1-Q4 ask the student to draw a bar graph. Here they become questions about
  drawing it (scale, tallest, shortest), and the last help step shows the finished graph.
  The bar values in Q5 and Q6 were read from the graphs in the book.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, unit) { var p = { id: id, label: label, type: "number", answer: answer }; if (unit) p.unit = unit; return p; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function tbl(h1, h2, items) {
    return { type: "grid", cws: [Math.max(120, h2.length * 8.5)].concat(items.map(function () { return 62; })), rows: [[h1].concat(items.map(function (r) { return r[0]; })), [h2].concat(items.map(function (r) { return String(r[1]); }))] };
  }
  function graph(o, values) {
    return { type: "bars", max: o.max, step: o.step, xlabel: o.xlabel, ylabel: o.ylabel, values: values, bars: o.items.map(function (r, i) { return [r[0], r[1], i % 2 ? "b" : "a"]; }) };
  }
  // one "draw a bar graph" question turned into steps of drawing it
  function drawQ(o) {
    var vals = o.items.map(function (r) { return r[1]; });
    var hi = o.items[vals.indexOf(Math.max.apply(null, vals))], lo = o.items[vals.indexOf(Math.min.apply(null, vals))];
    var pick = o.items[o.ask], names = o.items.map(function (r) { return r[0]; });
    var nameOf = function (r) { return (o.pre || "") + r[0]; };
    return { id: o.id, prompt: o.prompt, figure: tbl(o.h1, o.h2, o.items),
      parts: [
        nm("a", "(a) Scale: 1 division = " + o.scale + " " + o.word + ". How many divisions tall is the bar for " + nameOf(pick) + "?", pick[1] / o.scale),
        ch("b", "(b) Which bar is the tallest?", names, hi[0]),
        ch("c", "(c) Which bar is the shortest?", names, lo[0]),
        nm("d", "(d) How much taller is the tallest bar than the shortest, in " + o.word + "?", hi[1] - lo[1])
      ],
      help: [
        { text: "Draw the x-axis for " + o.xlabel.toLowerCase() + " and the y-axis for " + o.ylabel.toLowerCase() + ". Give every bar the same width and the same gap." },
        { text: "With 1 division = " + o.scale + ", the bar for " + nameOf(pick) + " is " + pick[1] + " ÷ " + o.scale + " = **" + pick[1] / o.scale + " divisions** tall." },
        { text: "The biggest number is " + hi[1] + " (" + nameOf(hi) + "), so its bar is the tallest. The smallest is " + lo[1] + " (" + nameOf(lo) + "), so its bar is the shortest." },
        { text: "Difference: " + hi[1] + " − " + lo[1] + " = **" + (hi[1] - lo[1]) + " " + o.word + "**." },
        { text: "The finished bar graph:", figure: graph(o, true) }
      ] };
  }

  var EXP = [["Jan", 3500], ["Feb", 4000], ["Mar", 3000], ["Apr", 2500], ["May", 4500], ["Jun", 2000]];
  var expTotal = EXP.reduce(function (s, r) { return s + r[1]; }, 0);
  var EXPG = { max: 5000, step: 500, xlabel: "Months", ylabel: "Expenditure (Rs)", items: EXP };
  var SEE = [["2076", 50], ["2077", 70], ["2078", 60], ["2079", 40], ["2080", 90]];
  var SEEG = { max: 100, step: 10, xlabel: "Years", ylabel: "Successful students (%)", items: SEE };
  var months = EXP.map(function (r) { return r[0]; }), years = SEE.map(function (r) { return r[0]; });

  Practice.register({
    id: "math-stats-g6-ex19-2",
    subject: "Mathematics",
    unit: "Statistics",
    title: "Exercise 19.2",
    topic: "Bar graphs",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 276–277",

    reference: {
      title: "Bar graphs",
      columns: ["Step", "What to do"],
      rows: [
        ["Axes", "x-axis for the items, y-axis for the numbers"],
        ["Scale", "choose 1 division = a handy number, e.g. 5"],
        ["Bar height", "value ÷ scale = number of divisions"],
        ["Bars", "same width, same gap between them"],
        ["Reading", "go across from the top of a bar to the y-axis"]
      ]
    },

    sections: [
      { id: "q1", title: "Present students", instruction: "Plan the bar graph and answer.",
        questions: [drawQ({ id: "q1a", prompt: "There are 40 students in class VI. The table shows the number of present students in the last week. Draw a bar graph to represent the data.",
          h1: "Days", h2: "No. of present students", items: [["Sun", 30], ["Mon", 35], ["Tue", 40], ["Wed", 37], ["Thu", 39], ["Fri", 34]],
          scale: 5, word: "students", ask: 1, max: 40, step: 5, xlabel: "Days", ylabel: "Present students" })] },
      { id: "q2", title: "Zoo animals", instruction: "Plan the bar graph and answer.",
        questions: [drawQ({ id: "q2a", prompt: "The table shows the number of different animals kept in a zoo. Draw a bar graph to show their numbers.",
          h1: "Animals", h2: "Numbers", items: [["Rabbit", 20], ["Monkey", 16], ["Deer", 25], ["Bird", 40], ["Tiger", 5]],
          scale: 5, word: "animals", ask: 2, max: 40, step: 5, xlabel: "Animals", ylabel: "Number" })] },
      { id: "q3", title: "Primary classes", instruction: "Plan the bar graph and answer.",
        questions: [drawQ({ id: "q3a", prompt: "The number of students in the primary level of a school are given below. Draw a bar graph to show the numbers.",
          h1: "Classes", h2: "No. of students", items: [["I", 35], ["II", 30], ["III", 40], ["IV", 25], ["V", 20]], pre: "class ",
          scale: 5, word: "students", ask: 2, max: 40, step: 5, xlabel: "Classes", ylabel: "Students" })] },
      { id: "q4", title: "SEE passes", instruction: "Plan the bar graph and answer.",
        questions: [drawQ({ id: "q4a", prompt: "The number of students who passed the S.E.E. examination from a school in different years are given in the table. Draw a bar graph to represent the data.",
          h1: "Years", h2: "No. of students who passed", items: [["2075", 25], ["2076", 40], ["2077", 36], ["2078", 48], ["2079", 50], ["2080", 56]],
          scale: 5, word: "students", ask: 1, max: 60, step: 5, xlabel: "Years", ylabel: "Students passed" })] },
      { id: "q5", title: "Monthly expenditure", instruction: "The bar graph shows the monthly expenditure of a family in the last 6 months.",
        questions: [
          { id: "q5a", prompt: "Write the expenditure of the family in every month.", figure: graph(EXPG, false),
            parts: EXP.map(function (r, i) { return nm(L[i], "(" + L[i] + ") " + r[0], r[1], "Rs"); }),
            help: [{ text: "Go straight across from the top of each bar to the y-axis. Each line is Rs 500." },
              { text: "Answer: **" + EXP.map(function (r) { return r[0] + " Rs " + r[1]; }).join(", ") + "**.", figure: graph(EXPG, true) }] },
          { id: "q5b", prompt: "In which months were the expenditures maximum and minimum?", figure: graph(EXPG, false),
            parts: [ch("a", "Maximum", months, "May"), ch("b", "Minimum", months, "Jun")],
            help: [{ text: "The tallest bar is May (Rs 4500). The shortest bar is Jun (Rs 2000)." }, { text: "Answer: **maximum in May, minimum in June**." }] },
          { id: "q5c", prompt: "If the monthly income of the family is Rs 10,000 every month, express the expenditure of every month in percent of the income.", figure: graph(EXPG, false),
            parts: EXP.map(function (r, i) { return nm(L[i], "(" + L[i] + ") " + r[0], r[1] / 100, "%"); }),
            help: [{ text: "Percent = expenditure ÷ income × 100. With income Rs 10,000 this is just expenditure ÷ 100." },
              { text: EXP.map(function (r) { return r[0] + ": " + r[1] + "/10000 × 100 = " + r[1] / 100 + "%"; }).join("; ") + "." },
              { text: "Answer: **" + EXP.map(function (r) { return r[0] + " " + r[1] / 100 + "%"; }).join(", ") + "**." }] },
          { id: "q5d", prompt: "Express the total expenditure of six months as a percent of the total income of six months. (Income is Rs 10,000 every month.)", figure: graph(EXPG, false),
            parts: [nm("v", "Percent", 32.5, "%")],
            help: [{ text: "Total expenditure = " + EXP.map(function (r) { return r[1]; }).join(" + ") + " = Rs " + expTotal + "." },
              { text: "Total income = 6 × 10,000 = Rs 60,000." },
              { text: "Percent = " + expTotal + "/60000 × 100 = 32.5%." },
              { text: "Answer: **32.5%**." }] }
        ] },
      { id: "q6", title: "SEE results", instruction: "The bar graph shows the S.E.E. results of a school in 5 years.",
        questions: [
          { id: "q6a", prompt: "In which year was the S.E.E. result of the school the best? What was the percent of successful students in that year? If 80 students appeared in the exam that year, how many of them passed?", figure: graph(SEEG, false),
            parts: [ch("a", "(a) Best year", years, "2080"), nm("b", "(b) Percent successful", 90, "%"), nm("c", "(c) Students who passed", 72)],
            help: [{ text: "The tallest bar is 2080. Go across from its top: it reaches 90%." },
              { text: "Passed = 90% of 80 = 90/100 × 80 = 72." },
              { text: "Answer: **2080, 90%, 72 students passed**." }] },
          { id: "q6b", prompt: "In which year was the percent of successful students the least? If 50 students appeared in the exam that year, how many of them were unsuccessful?", figure: graph(SEEG, false),
            parts: [ch("a", "(a) Least year", years, "2079"), nm("b", "(b) Unsuccessful students", 30)],
            help: [{ text: "The shortest bar is 2079, at 40%. So 100% − 40% = 60% were unsuccessful." },
              { text: "Unsuccessful = 60% of 50 = 60/100 × 50 = 30." },
              { text: "Answer: **2079, 30 students**." }] },
          { id: "q6c", prompt: "Which sentence best describes the trend of the S.E.E. results in 5 years?", figure: graph(SEEG, false),
            parts: [ch("v", "", ["The result went up every year.", "The result went down every year.", "The result rose in 2077, fell in 2078 and 2079, then was the best in 2080.", "The result stayed the same."], "The result rose in 2077, fell in 2078 and 2079, then was the best in 2080.")],
            help: [{ text: "Read the bars in order: 50%, 70%, 60%, 40%, 90%." },
              { text: "Up from 50 to 70, down to 60, down to 40, then up to 90, the best of all." },
              { text: "Answer: **it rose in 2077, fell in 2078 and 2079, then was the best in 2080**. In the book, write this as a short paragraph." }] }
        ] }
    ]
  });
})();
