/*
  Exercise 2.2: Mixed operations and the DMAS rule.
  Source: Vedanta Excel in Mathematics, Book 6, pages 32-33.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, mistakes) { return { id: id, label: label, type: "number", answer: answer, mistakes: mistakes }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function q(id, prompt, answer, steps, mistakes) {
    return { id: id, prompt: prompt, parts: [nm("v", "=", answer, mistakes)], help: steps.concat([{ text: "Answer: **" + answer + "**." }]) };
  }
  var DMAS = { text: "**DMAS**: first **D**ivision, then **M**ultiplication, then **A**ddition and **S**ubtraction from left to right." };
  function d(id, expr, answer, steps, wrong, why) {
    return q(id, expr, answer, [DMAS].concat(steps), wrong != null ? [{ answer: wrong, say: why || "You worked from left to right. Do ÷ and × first." }] : undefined);
  }
  function sign(id, left, right, answer, check) {
    return { id: id, prompt: left + " ☐ " + right, parts: [ch("v", "Sign in the box", ["+", "−", "×", "÷"], answer)],
      help: [{ text: "Try each sign and use DMAS to see which one gives the answer." }, { text: check }, { text: "Answer: **" + answer + "**." }] };
  }
  function expr(id, words, exprText, answer, steps) {
    var opts = exprText.options, k = id.charCodeAt(id.length - 1) % opts.length;
    var shown = opts.slice(k).concat(opts.slice(0, k));
    return { id: id, prompt: words, parts: [ch("e", "Expression", shown, opts[0]), nm("v", "Value", answer)],
      help: steps.concat([{ text: "Answer: **" + opts[0] + " = " + answer + "**." }]) };
  }

  Practice.register({
    id: "math-whole-g6-ex2-2",
    subject: "Mathematics",
    unit: "Operations on Whole Numbers",
    title: "Exercise 2.2",
    topic: "Mixed operations (DMAS)",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 32–33",

    reference: {
      title: "The DMAS rule",
      columns: ["Step", "Example: 27 − 54 ÷ 9 + 5 × 6"],
      rows: [
        ["1. Division", "= 27 − 6 + 5 × 6"],
        ["2. Multiplication", "= 27 − 6 + 30"],
        ["3. Addition and subtraction, left to right", "= 21 + 30 = 51"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Say it quickly", instruction: "Write the answer.",
        questions: [
          q("q1a", "Add 7 to the difference of 12 and 9.", 10, [{ text: "Difference: 12 − 9 = 3." }, { text: "7 + 3 = 10." }]),
          q("q1b", "Subtract 7 from the sum of 9 and 8.", 10, [{ text: "Sum: 9 + 8 = 17." }, { text: "17 − 7 = 10." }]),
          q("q1c", "Add 5 to the product of 4 and 6.", 29, [{ text: "Product: 4 × 6 = 24." }, { text: "24 + 5 = 29." }]),
          q("q1d", "Divide 63 by 9, then multiply the quotient by 5.", 35, [{ text: "63 ÷ 9 = 7." }, { text: "7 × 5 = 35." }])
        ]
      },
      {
        id: "q2", title: "Simplify mentally", instruction: "Use DMAS.",
        questions: [
          d("q2a", "4 + 6 − 3", 7, [{ text: "Only + and −: work left to right. 10 − 3." }]),
          d("q2b", "11 − 6 + 4", 9, [{ text: "Left to right: 11 − 6 = 5, then 5 + 4." }], 1, "Work + and − from left to right: 11 − 6 first."),
          d("q2c", "7 + 5 × 4", 27, [{ text: "× first: 5 × 4 = 20." }, { text: "7 + 20 = 27." }], 48),
          d("q2d", "9 × 5 + 5", 50, [{ text: "× first: 45, then + 5." }]),
          d("q2e", "8 × 15 ÷ 5", 24, [{ text: "÷ first: 15 ÷ 5 = 3." }, { text: "8 × 3 = 24." }]),
          d("q2f", "12 ÷ 4 × 2", 6, [{ text: "÷ first: 12 ÷ 4 = 3." }, { text: "3 × 2 = 6." }]),
          d("q2g", "8 + 3 × 7 − 6", 23, [{ text: "× first: 3 × 7 = 21." }, { text: "8 + 21 − 6 = 23." }], 71),
          d("q2h", "5 × 2 + 3 − 6", 7, [{ text: "× first: 10." }, { text: "10 + 3 − 6 = 7." }]),
          d("q2i", "10 − 3 × 2 + 1", 5, [{ text: "× first: 3 × 2 = 6." }, { text: "10 − 6 + 1 = 5." }], 15)
        ]
      },
      {
        id: "q3", title: "Missing sign", instruction: "Choose the sign that gives the answer.",
        questions: [
          sign("q3a", "5", "7 − 3 = 9", "+", "5 + 7 − 3 = 9 ✓"),
          sign("q3b", "10", "4 × 2 = 2", "−", "10 − 4 × 2 = 10 − 8 = 2 ✓"),
          sign("q3c", "6", "12 ÷ 4 = 18", "×", "6 × 12 ÷ 4 = 6 × 3 = 18 ✓"),
          sign("q3d", "30", "6 × 4 = 20", "÷", "30 ÷ 6 × 4 = 5 × 4 = 20 ✓")
        ]
      },
      {
        id: "q4", title: "Missing number", instruction: "Find the number that goes in the blank.",
        questions: [
          q("q4a", "8 + ☐ − 5 = 10", 7, [{ text: "8 − 5 = 3, so 3 + ☐ = 10." }]),
          q("q4b", "☐ × 6 + 2 = 26", 4, [{ text: "Take away the 2: ☐ × 6 = 24." }, { text: "24 ÷ 6 = 4." }]),
          q("q4c", "20 − 24 ÷ ☐ = 14", 4, [{ text: "20 − (something) = 14, so 24 ÷ ☐ = 6." }, { text: "24 ÷ 4 = 6." }]),
          q("q4d", "3 × ☐ ÷ 5 = 6", 10, [{ text: "Undo ÷ 5: 3 × ☐ = 30." }, { text: "30 ÷ 3 = 10." }])
        ]
      },
      {
        id: "q5", title: "Number puzzles", instruction: "Add or multiply the row number and the column number. Find the lettered boxes.",
        questions: [
          { id: "q5a", prompt: "Addition puzzle: each box = row number + column number.",
            figure: { type: "grid", rows: [["+", "9", "7", "?a"], ["6", "15", "?b", "?c"], ["?d", "?e", "15", "?f"], ["12", "?g", "?h", "17"]] },
            parts: [nm("a", "a", 5), nm("b", "b", 13), nm("c", "c", 11), nm("d", "d", 8), nm("e", "e", 17), nm("f", "f", 13), nm("g", "g", 21), nm("h", "h", 19)],
            help: [{ text: "Find the missing headers first. 12 + a = 17, so a = 5." }, { text: "d + 7 = 15, so d = 8." },
                   { text: "Now add: b = 6 + 7, c = 6 + 5, e = 8 + 9, f = 8 + 5, g = 12 + 9, h = 12 + 7." },
                   { text: "Answer: a = **5**, b = **13**, c = **11**, d = **8**, e = **17**, f = **13**, g = **21**, h = **19**." }] },
          { id: "q5b", prompt: "Multiplication puzzle: each box = row number × column number.",
            figure: { type: "grid", rows: [["×", "?a", "?b", "5"], ["?c", "?d", "42", "?e"], ["?f", "?g", "24", "20"], ["9", "72", "?h", "?i"]] },
            parts: [nm("a", "a", 8), nm("b", "b", 6), nm("c", "c", 7), nm("d", "d", 56), nm("e", "e", 35), nm("f", "f", 4), nm("g", "g", 32), nm("h", "h", 54), nm("i", "i", 45)],
            help: [{ text: "f × 5 = 20, so f = 4. Then 4 × b = 24, so b = 6." }, { text: "c × 6 = 42, so c = 7. 9 × a = 72, so a = 8." },
                   { text: "Now multiply: d = 7 × 8, e = 7 × 5, g = 4 × 8, h = 9 × 6, i = 9 × 5." },
                   { text: "Answer: a = **8**, b = **6**, c = **7**, d = **56**, e = **35**, f = **4**, g = **32**, h = **54**, i = **45**." }] }
        ]
      },
      {
        id: "q6", title: "Make an expression", instruction: "Choose the expression, then simplify it.",
        questions: [
          expr("q6a", "5 is subtracted from the sum of 8 and 7.", { options: ["(8 + 7) − 5", "5 − (8 + 7)", "8 + 7 × 5"] }, 10, [{ text: "\"The sum of 8 and 7\" comes first: (8 + 7). Then take away 5." }]),
          expr("q6b", "7 is added to the product of 5 and 6.", { options: ["5 × 6 + 7", "(5 + 6) × 7", "5 + 6 + 7"] }, 37, [{ text: "Product: 5 × 6 = 30. Add 7." }]),
          expr("q6c", "9 is subtracted from the product of 7 and 3.", { options: ["7 × 3 − 9", "9 − 7 × 3", "(7 − 3) × 9"] }, 12, [{ text: "7 × 3 = 21. Take away 9." }]),
          expr("q6d", "8 is added to the quotient of 36 divided by 4.", { options: ["36 ÷ 4 + 8", "36 ÷ (4 + 8)", "8 ÷ 4 + 36"] }, 17, [{ text: "36 ÷ 4 = 9. Add 8." }]),
          expr("q6e", "The product of 7 and the quotient of 40 divided by 5.", { options: ["7 × (40 ÷ 5)", "7 + 40 ÷ 5", "(7 × 40) + 5"] }, 56, [{ text: "40 ÷ 5 = 8. Then 7 × 8." }])
        ]
      },
      {
        id: "q7", title: "Mixed operations", instruction: "Simplify using DMAS.",
        questions: [
          d("q7a", "27 ÷ 3 × 4 + 12 − 5", 43, [{ text: "÷: 27 ÷ 3 = 9." }, { text: "×: 9 × 4 = 36." }, { text: "36 + 12 − 5 = 43." }]),
          d("q7b", "48 ÷ 8 × 7 + 5 − 10", 37, [{ text: "÷: 48 ÷ 8 = 6." }, { text: "×: 6 × 7 = 42." }, { text: "42 + 5 − 10 = 37." }]),
          d("q7c", "10 × 9 + 63 ÷ 7 − 20", 79, [{ text: "÷: 63 ÷ 7 = 9." }, { text: "×: 10 × 9 = 90." }, { text: "90 + 9 − 20 = 79." }]),
          d("q7d", "40 + 4 × 3 − 32 ÷ 8", 48, [{ text: "÷: 32 ÷ 8 = 4." }, { text: "×: 4 × 3 = 12." }, { text: "40 + 12 − 4 = 48." }]),
          d("q7e", "35 − 12 + 6 × 36 ÷ 4", 77, [{ text: "÷: 36 ÷ 4 = 9." }, { text: "×: 6 × 9 = 54." }, { text: "35 − 12 + 54 = 77." }]),
          d("q7f", "8 × 5 − 15 + 10 × 27 ÷ 9", 55, [{ text: "÷: 27 ÷ 9 = 3." }, { text: "×: 8 × 5 = 40 and 10 × 3 = 30." }, { text: "40 − 15 + 30 = 55." }]),
          d("q7g", "3 + 8 × 72 ÷ 8 − 10 − 5", 60, [{ text: "÷: 72 ÷ 8 = 9." }, { text: "×: 8 × 9 = 72." }, { text: "3 + 72 − 10 − 5 = 60." }]),
          d("q7h", "15 − 6 + 7 × 63 ÷ 9 − 40", 18, [{ text: "÷: 63 ÷ 9 = 7." }, { text: "×: 7 × 7 = 49." }, { text: "15 − 6 + 49 − 40 = 18." }])
        ]
      },
      {
        id: "q8", title: "Shopping", instruction: "Write an expression, then simplify.",
        questions: [
          expr("q8a", "Sunayana bought **6 pencils at Rs 8 each** and gave a **Rs 50** note. How much change did she get?", { options: ["50 − 6 × 8", "(50 − 6) × 8", "6 × 8 − 50"] }, 2,
            [{ text: "Cost of pencils: 6 × 8 = 48." }, { text: "Change: 50 − 48 = 2." }]),
          expr("q8b", "Anil bought **6 exercise books at Rs 40 each** and an **eraser for Rs 10**. He gave a **Rs 500** note. How much change did he get?", { options: ["500 − (6 × 40 + 10)", "500 − 6 × 40 + 10", "(500 − 6) × 40 + 10"] }, 250,
            [{ text: "Cost: 6 × 40 + 10 = 250." }, { text: "Change: 500 − 250 = 250." }, { text: "The bracket matters: without it you would add the 10 instead of taking it away." }])
        ]
      }
    ]
  });
})();
