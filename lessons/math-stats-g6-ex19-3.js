/*
  Exercise 19.3: Average.
  Source: Vedanta Excel in Mathematics, Book 6, pages 279-280.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
  Q9 (project work: collect your own data) is left out.
*/
(function () {
  var L = "abcdefghijklmnop";
  function nm(id, label, answer, unit) { var p = { id: id, label: label, type: "number", answer: answer }; if (unit) p.unit = unit; return p; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function sum(a) { return r2(a.reduce(function (s, v) { return s + v; }, 0)); }
  // plain average of a list
  function avgQ(id, prompt, data, unit, label, pre) {
    pre = pre || ""; var s = sum(data), a = r2(s / data.length), u = unit ? " " + unit : "";
    return { id: id, prompt: prompt, parts: [nm("v", label || "Average", a, unit)],
      help: [{ text: "Average = total sum of the data ÷ number of data." },
        { text: "Sum = " + data.map(function (v) { return pre + v; }).join(" + ") + " = " + pre + s + u + "." },
        { text: "There are " + data.length + " data, so average = " + s + " ÷ " + data.length + " = " + a + "." },
        { text: "Answer: **" + pre + a + u + "**." }] };
  }
  // one unknown in the list: x = average × n − sum of the others
  function missQ(id, prompt, known, n, avg, unit, label, what) {
    var s = sum(known), tot = avg * n, x = tot - s, u = unit ? " " + unit : "";
    return { id: id, prompt: prompt, parts: [nm("v", label, x, unit)],
      help: [{ text: "Sum of all " + n + " = average × number of data = " + avg + " × " + n + " = " + tot + "." },
        { text: "Sum of the ones we know = " + known.join(" + ") + " = " + s + "." },
        { text: what + " = " + tot + " − " + s + " = " + x + "." },
        { text: "Answer: **" + x + u + "**." }] };
  }
  // two groups with their own averages
  function groupQ(id, prompt, n1, a1, n2, a2, unit, pre) {
    pre = pre || ""; var s1 = n1 * a1, s2 = n2 * a2, a = r2((s1 + s2) / (n1 + n2)), u = unit ? " " + unit : "";
    return { id: id, prompt: prompt, parts: [nm("v", "Average", a, unit)],
      help: [{ text: "Sum of the first group = " + n1 + " × " + a1 + " = " + s1 + "." },
        { text: "Sum of the second group = " + n2 + " × " + a2 + " = " + s2 + "." },
        { text: "Average of all = (" + s1 + " + " + s2 + ") ÷ (" + n1 + " + " + n2 + ") = " + (s1 + s2) + " ÷ " + (n1 + n2) + " = " + a + "." },
        { text: "Answer: **" + pre + a + u + "**." }] };
  }
  // one more item raises the average
  function addQ(id, prompt, n, a, up, label) {
    var s = n * a, na = a + up, ns = (n + 1) * na, x = ns - s;
    return { id: id, prompt: prompt, parts: [nm("v", label, x)],
      help: [{ text: "Before: sum of " + n + " subjects = " + n + " × " + a + " = " + s + "." },
        { text: "After: the average goes up by " + up + " to " + na + ", so the sum of " + (n + 1) + " subjects = " + (n + 1) + " × " + na + " = " + ns + "." },
        { text: "New subject = " + ns + " − " + s + " = " + x + "." },
        { text: "Answer: **" + x + "**." }] };
  }

  Practice.register({
    id: "math-stats-g6-ex19-3",
    subject: "Mathematics",
    unit: "Statistics",
    title: "Exercise 19.3",
    topic: "Average",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 279–280",

    reference: {
      title: "Average",
      columns: ["Rule", "Example"],
      rows: [
        ["Average = sum ÷ number of data", "2, 4, 6: 12 ÷ 3 = 4"],
        ["Sum = average × number of data", "average 5 of 4 numbers: sum 20"],
        ["Missing value = sum − the others", "20 − (3 + 5 + 7) = 5"],
        ["Two groups", "add both sums, divide by everyone"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick averages", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          avgQ("q1a", "Average of 1 and 3 is …", [1, 3]),
          avgQ("q1b", "Average of 2 and 6 is …", [2, 6]),
          avgQ("q1c", "Average of 1, 2 and 3 is …", [1, 2, 3]),
          avgQ("q1d", "Average of 6, 7 and 8 is …", [6, 7, 8])
        ] },
      { id: "q2", title: "In average", instruction: "Fill in the blank.",
        questions: [
          avgQ("q2a", "Bishwant has Rs 10 and Sunayana has Rs 12. They have … in average.", [10, 12], "", "Rupees", "Rs "),
          avgQ("q2b", "3 students were absent on Sunday and 5 absent on Monday. In two days there were … students absent in average.", [3, 5], "", "Students")
        ] },
      { id: "q3", title: "Meaning", instruction: "Creative Section A. Choose the right answer.",
        questions: [
          { id: "q3a", prompt: "Define the **average** of data.", parts: [ch("v", "", ["the biggest value of the data", "a single number that represents a collection of data", "the value that appears most often"], "a single number that represents a collection of data")],
            help: [{ text: "An average is one number that stands for the whole collection, found by sharing the total equally." }, { text: "Answer: **a single number that represents a collection of data**." }] },
          { id: "q3b", prompt: "Which is the formula for the average of individual data?", parts: [ch("v", "", ["average = total sum of the data ÷ number of data", "average = number of data ÷ total sum", "average = biggest − smallest", "average = total sum × number of data"], "average = total sum of the data ÷ number of data")],
            help: [{ text: "Add all the data, then share the sum equally among them." }, { text: "Answer: **average = total sum of the data ÷ number of data**." }] }
        ] },
      { id: "q4", title: "Find the average", instruction: "Find the average of the following data.",
        questions: [
          avgQ("q4a", "12, 8, 6, 10", [12, 8, 6, 10]),
          avgQ("q4b", "20, 40, 25, 15, 30", [20, 40, 25, 15, 30]),
          avgQ("q4c", "7 years, 13 years, 10 years", [7, 13, 10], "years"),
          avgQ("q4d", "5.5 cm, 8.5 cm, 3.2 cm, 10.8 cm, 7 cm", [5.5, 8.5, 3.2, 10.8, 7], "cm")
        ] },
      { id: "q5", title: "Word problems", instruction: "Find the average.",
        questions: [
          avgQ("q5a", "The ages of 4 children are 7, 9, 11 and 13 years. Find their average age.", [7, 9, 11, 13], "years", "Average age"),
          avgQ("q5b", "The heights of 5 pupils of a class are 80, 85, 90, 95 and 100 cm. Find the average height of the pupils.", [80, 85, 90, 95, 100], "cm", "Average height"),
          avgQ("q5c", "The marks obtained by 10 students in mathematics are given below. Find their average marks.\n\n25, 36, 20, 15, 24, 30, 38, 18, 32, 22", [25, 36, 20, 15, 24, 30, 38, 18, 32, 22], "", "Average marks"),
          avgQ("q5d", "The daily wages of 8 workers of a factory are given below. Find their average wage.\n\nRs 120, Rs 80, Rs 110, Rs 60, Rs 90, Rs 100, Rs 70, Rs 140", [120, 80, 110, 60, 90, 100, 70, 140], "", "Average wage (Rs)", "Rs ")
        ] },
      { id: "q6", title: "Missing value", instruction: "Use sum = average × number of data.",
        questions: [
          missQ("q6a", "The marks obtained by 5 students of a class are 18, 24, 20, 14 and x. If their average marks is 19, find the value of x.", [18, 24, 20, 14], 5, 19, "", "x", "x"),
          missQ("q6b", "The temperature of Kathmandu valley recorded at 6 am every day in the last week was 10°C, 15°C, 4°C, 8°C, 12°C, 10°C and x°C. If the average temperature was 9°C, find the value of x.", [10, 15, 4, 8, 12, 10], 7, 9, "", "x", "x"),
          missQ("q6c", "The average marks of Ram, Hari, Shyam and Gopal in Mathematics is 65. If Ram, Hari and Shyam obtained 60, 70 and 80 respectively, how many marks did Gopal obtain?", [60, 70, 80], 4, 65, "", "Gopal's marks", "Gopal"),
          missQ("q6d", "The average expenditure of a family in the last week was Rs 111. If the expenditures on Sunday, Monday, Tuesday, Wednesday, Thursday and Friday were Rs 140, Rs 126, Rs 105, Rs 70, Rs 84 and Rs 98 respectively, find the expenditure on Saturday.", [140, 126, 105, 70, 84, 98], 7, 111, "", "Saturday (Rs)", "Saturday")
        ] },
      { id: "q7", title: "Two groups", instruction: "Creative Section B. Find the average of the whole group.",
        questions: [
          groupQ("q7a", "The average height of 3 children in a class is 80 cm and the average height of 5 children is 84 cm. Find the average height of all of these children.", 3, 80, 5, 84, "cm"),
          groupQ("q7b", "In the last year, the average rainfall in Pokhara valley during the first 6 months was 150 mm and the average rainfall of the remaining months was 60 mm. Find the average rainfall of the whole year.", 6, 150, 6, 60, "mm"),
          groupQ("q7c", "The average selling of the first 4 days of a shop in the last week was Rs 425 and the average selling of the remaining days was Rs 250. Find the average selling of the shop in the whole week.", 4, 425, 3, 250, "", "Rs ")
        ] },
      { id: "q8", title: "One more subject", instruction: "The average goes up when one more subject is included.",
        questions: [
          addQ("q8a", "Shashwat obtained an average of 15 marks in 3 subjects. When the marks of another subject are also included, the average increases by 1. Find the marks obtained in the fourth subject.", 3, 15, 1, "Fourth subject"),
          addQ("q8b", "The average marks of English, Nepali, Science and Social Studies obtained by Sunayana is 70. If the marks obtained in Mathematics are also included, the average increases by 5. Find her marks in Mathematics.", 4, 70, 5, "Mathematics")
        ] }
    ]
  });
})();
