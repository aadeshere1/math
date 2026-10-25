/*
  Exercise 2.3: Simplification with brackets (BODMAS).
  Source: Vedanta Excel in Mathematics, Book 6, pages 36-37.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: unit, mistakes: mistakes }; }
  function q(id, prompt, answer, steps, mistakes) {
    return { id: id, prompt: prompt, parts: [nm("v", "=", answer, null, mistakes)], help: steps.concat([{ text: "Answer: **" + answer + "**." }]) };
  }
  var ORDER = { text: "Order: small brackets ( ) first, then middle brackets { }, then big brackets [ ]. Inside, use DMAS." };
  var NEXT = { text: "A number written just before a bracket, like 5(4), means 5 × 4. Work it out as soon as the bracket is done." };
  function br(id, expr, answer, steps, mistakes) { return q(id, expr, answer, [ORDER].concat(steps), mistakes); }
  // Choice + value. options[0] is the right one; the shown order is rotated.
  function mk(id, words, options, answer, unit, steps) {
    var k = id.charCodeAt(id.length - 1) % options.length, shown = options.slice(k).concat(options.slice(0, k));
    return { id: id, prompt: words, parts: [ch("e", "Expression", shown, options[0]), nm("v", "Value", answer, unit)],
      help: steps.concat([{ text: "Answer: **" + options[0] + " = " + answer + (unit ? " " + unit : "") + "**." }]) };
  }
  function enclose(id, expr, ans, options, check) {
    var k = id.charCodeAt(id.length - 1) % options.length, shown = options.slice(k).concat(options.slice(0, k));
    return { id: id, prompt: expr + " (Ans: " + ans + ")", parts: [ch("v", "Where do the brackets go?", shown, options[0])],
      help: [{ text: "Try each choice and see which one gives " + ans + "." }, { text: check }, { text: "Answer: **" + options[0] + "**." }] };
  }

  Practice.register({
    id: "math-whole-g6-ex2-3",
    subject: "Mathematics",
    unit: "Operations on Whole Numbers",
    title: "Exercise 2.3",
    topic: "Simplifying with brackets",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 36–37",

    reference: {
      title: "Brackets",
      columns: ["Rule", "Example"],
      rows: [
        ["Small brackets ( ) first", "5 + (6 − 2) = 5 + 4 = 9"],
        ["Then middle brackets { }", "{3 + (6 − 2)} × 3 = {3 + 4} × 3 = 21"],
        ["Then big brackets [ ]", "25 − [90 − 5{7}] ÷ 5 = 25 − 55 ÷ 5 = 14"],
        ["A number next to a bracket multiplies it", "40 ÷ 5(4) = 40 ÷ 20 = 2"],
        ["Inside each bracket: DMAS", "÷, then ×, then + and −"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Say it quickly", instruction: "Write the answer.",
        questions: [
          q("q1a", "9 is subtracted from the sum of 8 and 7.", 6, [{ text: "(8 + 7) − 9 = 15 − 9." }]),
          q("q1b", "5 is added to the difference of 15 and 6.", 14, [{ text: "(15 − 6) + 5 = 9 + 5." }]),
          q("q1c", "4 times the sum of 5 and 3.", 32, [{ text: "4 × (5 + 3) = 4 × 8." }], [{ answer: 23, say: "\"4 times the sum\" means add first: 4 × (5 + 3)." }]),
          q("q1d", "The quotient of 36 divided by the sum of 4 and 5.", 4, [{ text: "36 ÷ (4 + 5) = 36 ÷ 9." }]),
          q("q1e", "The quotient of 72 divided by the product of 2 and 4.", 9, [{ text: "72 ÷ (2 × 4) = 72 ÷ 8." }], [{ answer: 144, say: "Find the product 2 × 4 first, then divide 72 by it." }])
        ]
      },
      {
        id: "q2", title: "Simplify mentally", instruction: "Do the bracket first.",
        questions: [
          br("q2a", "5 + (6 − 2)", 9, [{ text: "(6 − 2) = 4, so 5 + 4." }]),
          br("q2b", "12 − (3 + 7)", 2, [{ text: "(3 + 7) = 10, so 12 − 10." }], [{ answer: 16, say: "Do the bracket first: 3 + 7 = 10." }]),
          br("q2c", "4 × (4 + 5)", 36, [{ text: "(4 + 5) = 9, so 4 × 9." }], [{ answer: 21, say: "Do the bracket first: 4 + 5 = 9." }]),
          br("q2d", "15 ÷ (9 − 4)", 3, [{ text: "(9 − 4) = 5, so 15 ÷ 5." }]),
          br("q2e", "{3 + (6 − 2)} × 3", 21, [{ text: "( ): 6 − 2 = 4." }, { text: "{ }: 3 + 4 = 7." }, { text: "7 × 3 = 21." }]),
          br("q2f", "24 ÷ {2 × (3 + 1)}", 3, [{ text: "( ): 3 + 1 = 4." }, { text: "{ }: 2 × 4 = 8." }, { text: "24 ÷ 8 = 3." }])
        ]
      },
      {
        id: "q3", title: "Put in the brackets", instruction: "Which operation must be done first to get the given answer?",
        questions: [
          enclose("q3a", "3 × 4 + 6", 30, ["3 × (4 + 6)", "(3 × 4) + 6"], "3 × (4 + 6) = 3 × 10 = 30 ✓"),
          enclose("q3b", "7 × 14 − 8", 42, ["7 × (14 − 8)", "(7 × 14) − 8"], "7 × (14 − 8) = 7 × 6 = 42 ✓"),
          enclose("q3c", "5 × 7 + 3 ÷ 10", 5, ["5 × (7 + 3) ÷ 10", "(5 × 7 + 3) ÷ 10", "5 × 7 + (3 ÷ 10)"], "5 × (7 + 3) ÷ 10 = 5 × 10 ÷ 10 = 5 ✓"),
          enclose("q3d", "45 ÷ 8 − 5 × 3", 5, ["45 ÷ {(8 − 5) × 3}", "45 ÷ (8 − 5) × 3", "(45 ÷ 8 − 5) × 3"], "45 ÷ {(8 − 5) × 3} = 45 ÷ {3 × 3} = 45 ÷ 9 = 5 ✓")
        ]
      },
      {
        id: "q4", title: "Simplify", instruction: "Creative section. Work from the innermost bracket outwards.",
        questions: [
          br("q4a", "7 + (15 − 6)", 16, [{ text: "(15 − 6) = 9." }, { text: "7 + 9 = 16." }]),
          br("q4b", "6 × (5 + 4)", 54, [{ text: "(5 + 4) = 9." }, { text: "6 × 9 = 54." }]),
          br("q4c", "4(2 + 6) + 4 − 3(9 − 7)", 30, [NEXT, { text: "4(8) = 32 and 3(2) = 6." }, { text: "32 + 4 − 6 = 30." }]),
          br("q4d", "32 ÷ (14 − 6) × 3", 12, [{ text: "(14 − 6) = 8." }, { text: "32 ÷ 8 × 3: ÷ first, 4 × 3 = 12." }]),
          br("q4e", "40 ÷ 5(16 − 48 ÷ 4)", 2, [{ text: "Inside ( ): 48 ÷ 4 = 12, then 16 − 12 = 4." }, NEXT, { text: "5(4) = 20, so 40 ÷ 20 = 2." }],
            [{ answer: 32, say: "5(4) is worked out together with the bracket: 40 ÷ 20." }]),
          br("q4f", "35 − {15 − (19 + 5) ÷ 3}", 28, [{ text: "( ): 19 + 5 = 24." }, { text: "{ }: 15 − 24 ÷ 3 = 15 − 8 = 7." }, { text: "35 − 7 = 28." }]),
          br("q4g", "62 + 2{56 ÷ (4 × 2) − 5}", 66, [{ text: "( ): 4 × 2 = 8." }, { text: "{ }: 56 ÷ 8 − 5 = 7 − 5 = 2." }, { text: "62 + 2 × 2 = 66." }]),
          br("q4h", "5{13 + 12 ÷ 3(2 × 2) − 4}", 50, [{ text: "( ): 2 × 2 = 4." }, NEXT, { text: "3(4) = 12, so 12 ÷ 12 = 1." }, { text: "{ }: 13 + 1 − 4 = 10." }, { text: "5 × 10 = 50." }],
            [{ answer: 125, say: "3(4) belongs together: 12 ÷ 3(4) = 12 ÷ 12 = 1." }]),
          br("q4i", "39 − 4{16 ÷ (7 − 3)} − 23", 0, [{ text: "( ): 7 − 3 = 4." }, { text: "{ }: 16 ÷ 4 = 4." }, { text: "39 − 4 × 4 − 23 = 39 − 16 − 23 = 0." }]),
          br("q4j", "25 − [90 − 5{9 − (14 − 12)}] ÷ 5", 14, [{ text: "( ): 14 − 12 = 2." }, { text: "{ }: 9 − 2 = 7." }, { text: "[ ]: 90 − 5 × 7 = 90 − 35 = 55." }, { text: "25 − 55 ÷ 5 = 25 − 11 = 14." }]),
          br("q4k", "55 ÷ 11[120 ÷ 2{4 + (10 + 5 − 7)}]", 1, [{ text: "( ): 10 + 5 − 7 = 8." }, { text: "{ }: 4 + 8 = 12." }, NEXT, { text: "[ ]: 120 ÷ 2(12) = 120 ÷ 24 = 5." }, { text: "55 ÷ 11(5) = 55 ÷ 55 = 1." }]),
          br("q4l", "(7 × 6) ÷ 2[{45 ÷ 3(7 × 2 − 15 + 6)} + 4]", 3, [{ text: "( ): 7 × 6 = 42 and 14 − 15 + 6 = 5." }, NEXT, { text: "{ }: 45 ÷ 3(5) = 45 ÷ 15 = 3." }, { text: "[ ]: 3 + 4 = 7." }, { text: "42 ÷ 2(7) = 42 ÷ 14 = 3." }])
        ]
      },
      {
        id: "q5", title: "Words to expressions", instruction: "Choose the expression, then simplify.",
        questions: [
          mk("q5a", "4 times the sum of 7 and 2.", ["4 × (7 + 2)", "4 × 7 + 2", "(4 + 7) × 2"], 36, "", [{ text: "Sum first: 7 + 2 = 9. Then 4 × 9." }]),
          mk("q5b", "7 times the difference of 12 and 8.", ["7 × (12 − 8)", "7 × 12 − 8", "(7 + 12) − 8"], 28, "", [{ text: "Difference first: 12 − 8 = 4. Then 7 × 4." }]),
          mk("q5c", "9 is subtracted from 2 times the sum of 7 and 4.", ["2 × (7 + 4) − 9", "9 − 2 × (7 + 4)", "2 × 7 + 4 − 9"], 13, "", [{ text: "2 × 11 = 22. Then 22 − 9." }]),
          mk("q5d", "48 is divided by 3 times the difference of 15 and 11.", ["48 ÷ {3 × (15 − 11)}", "48 ÷ 3 × (15 − 11)", "(48 ÷ 3) − 15 − 11"], 4, "", [{ text: "15 − 11 = 4, and 3 × 4 = 12." }, { text: "48 ÷ 12 = 4." }]),
          mk("q5e", "The sum of 60 and 30 is divided by 10, and the difference of that quotient and 3 is divided by 2.", ["{(60 + 30) ÷ 10 − 3} ÷ 2", "60 + 30 ÷ 10 − 3 ÷ 2", "(60 + 30) ÷ (10 − 3) ÷ 2"], 3, "",
            [{ text: "(60 + 30) ÷ 10 = 9." }, { text: "9 − 3 = 6, and 6 ÷ 2 = 3." }])
        ]
      },
      {
        id: "q6", title: "Real-life problems", instruction: "Write the expression, then simplify.",
        questions: [
          mk("q6a", "A sick person takes **10 ml** of medicine **three times a day**. How much does the person take in **15 days**?", ["10 × 3 × 15", "10 + 3 + 15", "(10 + 3) × 15"], 450, "ml",
            [{ text: "One day: 10 × 3 = 30 ml." }, { text: "15 days: 30 × 15 = 450 ml." }]),
          mk("q6b", "Dakshes's school is **7 km** from his house. He goes there and comes back each day. How far does he travel in **6 days**?", ["7 × 2 × 6", "7 × 6", "7 + 2 + 6"], 84, "km",
            [{ text: "One day: there and back = 7 × 2 = 14 km." }, { text: "6 days: 14 × 6 = 84 km." }]),
          mk("q6c", "Mrs. Chamling earns **Rs 6,000 in a week**. She spends **Rs 250 on food and Rs 75 on transport every day**. How much does she save in a week?", ["6000 − (250 + 75) × 7", "6000 − 250 + 75 × 7", "(6000 − 250 − 75) × 7"], 3725, "rupees",
            [{ text: "Spending per day: 250 + 75 = 325." }, { text: "In 7 days: 325 × 7 = 2275." }, { text: "Saving: 6000 − 2275 = 3725." }]),
          mk("q6d", "Sunayana had **20 marbles**. She lost **6** and divided the rest among her **7 friends**. How many does each friend get?", ["(20 − 6) ÷ 7", "20 − 6 ÷ 7", "20 ÷ 7 − 6"], 2, "marbles",
            [{ text: "Left: 20 − 6 = 14." }, { text: "14 ÷ 7 = 2." }]),
          mk("q6e", "Pratik has **Rs 300**. He buys **2 boxes at Rs 60 each** and **3 pens at Rs 30 each**. How much money is left?", ["300 − (2 × 60 + 3 × 30)", "300 − 2 × 60 + 3 × 30", "(300 − 2) × 60 + 3 × 30"], 90, "rupees",
            [{ text: "Spent: 2 × 60 + 3 × 30 = 120 + 90 = 210." }, { text: "Left: 300 − 210 = 90." }]),
          mk("q6f", "Two baskets each have **18 apples**. **10** are rotten. You add **4 more** and divide them among **6 friends**. How many does each friend get?", ["(2 × 18 − 10 + 4) ÷ 6", "2 × 18 − 10 + 4 ÷ 6", "(18 − 10 + 4) ÷ 6"], 5, "apples",
            [{ text: "Apples: 2 × 18 = 36. Good ones: 36 − 10 = 26. Add 4: 30." }, { text: "30 ÷ 6 = 5." }])
        ]
      },
      {
        id: "q7", title: "Make the result", instruction: "Project and activity section: pick the expression that works.",
        questions: [
          { id: "q7a", prompt: "Use ÷ and + between **4, 12 and 8** (in any order) to get **11**.", parts: [ch("v", "", ["12 + 8 ÷ 4", "12 ÷ 4 + 8", "(12 + 8) ÷ 4"], "12 ÷ 4 + 8")],
            help: [{ text: "Check each: 12 + 8 ÷ 4 = 12 + 2 = 14. (12 + 8) ÷ 4 = 5." }, { text: "12 ÷ 4 + 8 = 3 + 8 = 11 ✓" }, { text: "Answer: **12 ÷ 4 + 8**." }] },
          { id: "q7b", prompt: "Use ÷ and × between **5, 20 and 2** to get **2**. You may use brackets.", parts: [ch("v", "", ["20 ÷ 5 × 2", "20 ÷ (5 × 2)", "5 × 20 ÷ 2"], "20 ÷ (5 × 2)")],
            help: [{ text: "20 ÷ 5 × 2 = 4 × 2 = 8. 5 × 20 ÷ 2 = 50." }, { text: "20 ÷ (5 × 2) = 20 ÷ 10 = 2 ✓" }, { text: "Answer: **20 ÷ (5 × 2)**." }] }
        ]
      }
    ]
  });
})();
