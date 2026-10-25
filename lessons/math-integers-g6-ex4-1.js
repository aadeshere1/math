/*
  Exercise 4.1: Integers on the number line, comparing, and the four operations.
  Source: Vedanta Excel in Mathematics, Book 6, pages 67-69.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: unit, mistakes: mistakes }; }
  function st(id, label, arr) { return { id: id, label: label, type: "set", answer: arr.map(String) }; }
  function sg(n) { return n > 0 ? "+" + n : n < 0 ? "−" + (-n) : "0"; }
  function q(id, prompt, answer, steps, mistakes, unit) {
    return { id: id, prompt: prompt, parts: [nm("v", "=", answer, unit, mistakes)], help: steps.concat([{ text: "Answer: **" + sg(answer) + (unit ? " " + unit : "") + "**." }]) };
  }
  var TYPE = "Type a minus sign for negatives, like -7.";
  function cmp(id, a, b) {
    var ans = a > b ? ">" : "<";
    return { id: id, prompt: sg(a) + " ☐ " + sg(b), parts: [ch("v", "", [">", "<"], ans)],
      help: [{ text: "On the number line, the number further to the right is bigger." }, { text: sg(a) + " is to the " + (a > b ? "right" : "left") + " of " + sg(b) + "." }, { text: "Answer: **" + sg(a) + " " + ans + " " + sg(b) + "**." }] };
  }
  function tf(id, stmt, t, why) {
    return { id: id, prompt: stmt, parts: [ch("v", "", ["True", "False"], t ? "True" : "False")], help: [{ text: why }, { text: "Answer: **" + (t ? "True" : "False") + "**." }] };
  }
  function line(id, hops, big, expr, result, why) {
    return { id: id, prompt: "Write the expression shown by the number line, then simplify it.", figure: { type: "nline", hops: hops, big: big },
      parts: [ch("e", "Expression", expr.options, expr.options[expr.answer]), nm("v", "Value", result)],
      help: [{ text: "Each small arc is one jump. Arcs to the right are positive, arcs to the left are negative. The big dashed arc shows where you end up." },
             { text: why }, { text: "Answer: **" + expr.options[expr.answer] + " = " + sg(result) + "**." }] };
  }
  var ADD = { text: "Same signs: add and keep the sign. Different signs: subtract the smaller from the bigger and keep the sign of the bigger." };
  var MUL = { text: "× or ÷: same signs give **+**, different signs give **−**." };
  function pw(id, base, e) {
    var v = Math.pow(base, e), b = base < 0 ? "(" + sg(base) + ")" : String(base);
    var rep = []; for (var i = 0; i < e; i++) rep.push(b);
    return q(id, b + (e === 2 ? "²" : e === 3 ? "³" : e === 4 ? "⁴" : "⁵"), v,
      [{ text: rep.join(" × ") }, { text: base < 0 ? "An even number of minus signs gives +, an odd number gives −. Here there " + (e === 1 ? "is 1" : "are " + e) + "." : "Multiply." }],
      base < 0 ? [{ answer: -v, say: "Count the minus signs: " + e + " of them, so the answer is " + (e % 2 ? "negative" : "positive") + "." }] : undefined);
  }

  Practice.register({
    id: "math-integers-g6-ex4-1",
    subject: "Mathematics",
    unit: "Integers",
    title: "Exercise 4.1",
    topic: "Integers and the number line",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 67–69",

    reference: {
      title: "Integers",
      columns: ["Rule", "Example"],
      rows: [
        ["Positive to the right of 0, negative to the left", "… −3, −2, −1, 0, +1, +2, +3 …"],
        ["Further right is bigger", "−2 > −5, and 0 > −1"],
        ["Adding, same signs: add, keep the sign", "(−4) + (−3) = −7"],
        ["Adding, different signs: subtract, keep the bigger one's sign", "(+7) + (−9) = −2"],
        ["× and ÷: same signs +, different signs −", "(−4) × (−6) = +24, (−72) ÷ 9 = −8"],
        ["Subtracting is adding the opposite", "5 − 8 = 5 + (−8) = −3"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Fill in the blanks", instruction: "Answer quickly. " + TYPE,
        questions: [
          { id: "q1a", prompt: "Positive integers lie towards the ☐ of 0 on a number line.", parts: [ch("v", "", ["left", "right"], "right")], help: [{ text: "1, 2, 3, … go to the right." }, { text: "Answer: **right**." }] },
          { id: "q1b", prompt: "The ☐ integers lie to the left of 0 on a number line.", parts: [ch("v", "", ["positive", "negative"], "negative")], help: [{ text: "−1, −2, −3, … go to the left." }, { text: "Answer: **negative**." }] },
          { id: "q1c", prompt: "Integers between −3 and +3", parts: [st("v", "", [-2, -1, 0, 1, 2])], help: [{ text: "\"Between\" leaves out −3 and +3." }, { text: "Answer: **−2, −1, 0, 1, 2**." }] },
          { id: "q1d", prompt: "Integers greater than −2 and less than +1", parts: [st("v", "", [-1, 0])], help: [{ text: "After −2 come −1, 0, then +1 (not included)." }, { text: "Answer: **−1, 0**." }] },
          { id: "q1e", prompt: "Write 2, −3, 0, −1, 4 in ascending (increasing) order.", parts: [ch("v", "", ["−3, −1, 0, 2, 4", "−1, −3, 0, 2, 4", "0, −1, 2, −3, 4"], "−3, −1, 0, 2, 4")],
            help: [{ text: "Start from the left end of the number line." }, { text: "Answer: **−3, −1, 0, 2, 4**." }] },
          { id: "q1f", prompt: "Write 0, −2, 3, −1, 2, −3, 1 in descending (decreasing) order.", parts: [ch("v", "", ["−3, −2, −1, 0, 1, 2, 3", "3, 2, 1, 0, −1, −2, −3", "3, 2, 1, 0, −3, −2, −1"], "3, 2, 1, 0, −1, −2, −3")],
            help: [{ text: "Start from the right end of the number line." }, { text: "Answer: **3, 2, 1, 0, −1, −2, −3**." }] }
        ]
      },
      {
        id: "q2", title: "Write as integers", instruction: "A loss of Rs 40 is written as −40. " + TYPE,
        questions: [
          q("q2a", "A loss of Rs 15", -15, [{ text: "A loss is negative." }], [{ answer: 15, say: "A loss is written with a minus sign." }]),
          q("q2b", "A gain of Rs 100", 100, [{ text: "A gain is positive." }]),
          q("q2c", "A drop of Rs 10 in a movie ticket", -10, [{ text: "A drop is negative." }], [{ answer: 10, say: "A drop goes down, so it is negative." }]),
          q("q2d", "A rise of Rs 20 in a sack of rice", 20, [{ text: "A rise is positive." }]),
          q("q2e", "16°C above 0°C", 16, [{ text: "Above zero is positive." }]),
          q("q2f", "3°C below 0°C", -3, [{ text: "Below zero is negative." }], [{ answer: 3, say: "Below zero is negative." }]),
          q("q2g", "5 steps forward from a fixed point", 5, [{ text: "Forward is positive." }]),
          q("q2h", "2 steps backward from a fixed point", -2, [{ text: "Backward is negative." }], [{ answer: 2, say: "Backward is negative." }])
        ]
      },
      { id: "q3", title: "> or <", instruction: "Choose the sign.", questions: [[4, 9], [6, 1], [2, -3], [-7, 5], [-5, -3], [-2, 0]].map(function (p, i) { return cmp("q3" + "abcdef"[i], p[0], p[1]); }) },
      {
        id: "q4", title: "True or false", instruction: "Think about the number line.",
        questions: [
          tf("q4a", "0 is less than every positive integer.", true, "0 is to the left of 1, 2, 3, …"),
          tf("q4b", "0 is a positive integer.", false, "0 is neither positive nor negative."),
          tf("q4c", "0 is the smallest integer.", false, "−1, −2, −3, … are all smaller than 0. There is no smallest integer."),
          tf("q4d", "−1 is the greatest negative integer.", true, "−1 is the negative integer closest to 0."),
          tf("q4e", "The opposite of −4 is 4.", true, "Opposites are the same distance from 0 on different sides."),
          tf("q4f", "The opposite of +6 is +9.", false, "The opposite of +6 is −6."),
          tf("q4g", "−5 is greater than 0.", false, "−5 is to the left of 0."),
          tf("q4h", "The sum of an integer and its opposite is always zero.", true, "For example, 4 + (−4) = 0."),
          tf("q4i", "The sum of two negative integers is positive.", false, "(−2) + (−3) = −5."),
          tf("q4j", "The product of two negative integers is negative.", false, "(−2) × (−3) = +6.")
        ]
      },
      {
        id: "q5", title: "Quick answers", instruction: TYPE,
        questions: [
          q("q5a", "3 more than −4", -1, [{ text: "Start at −4 and move 3 to the right." }]),
          q("q5b", "−3 more than −4", -7, [{ text: "(−4) + (−3): move 3 to the left of −4." }]),
          q("q5c", "3 less than −4", -7, [{ text: "Start at −4 and move 3 to the left." }]),
          q("q5d", "−3 less than −4", -1, [{ text: "(−4) − (−3) = (−4) + 3." }]),
          { id: "q5e", prompt: "8 − 5, 5 − 8 and −5 − 8", parts: [nm("a", "8 − 5 =", 3), nm("b", "5 − 8 =", -3), nm("c", "−5 − 8 =", -13)],
            help: [{ text: "5 − 8: start at 5 and go 8 to the left." }, { text: "−5 − 8: start at −5 and go 8 more to the left." }, { text: "Answer: **3**, **−3**, **−13**." }] },
          { id: "q5f", prompt: "−2 × 5, 2 × (−5) and −2 × (−5)", parts: [nm("a", "−2 × 5 =", -10), nm("b", "2 × (−5) =", -10), nm("c", "−2 × (−5) =", 10)],
            help: [MUL, { text: "Answer: **−10**, **−10**, **+10**." }] },
          { id: "q5g", prompt: "−16 ÷ 8, 16 ÷ (−8) and −16 ÷ (−8)", parts: [nm("a", "−16 ÷ 8 =", -2), nm("b", "16 ÷ (−8) =", -2), nm("c", "−16 ÷ (−8) =", 2)],
            help: [MUL, { text: "Answer: **−2**, **−2**, **+2**." }] }
        ]
      },
      {
        id: "q6", title: "Read the number line", instruction: "Hint: (−4) + (−3) = −7 and 2 × (−3) = −6. " + TYPE,
        questions: [
          line("q6a", [[0, 3], [3, 6]], [0, 6], { options: ["(+3) + (+3)", "(+6) + (−3)", "(−3) + (−3)"], answer: 0 }, 6, "Two jumps of 3 to the right: (+3) + (+3), which is also 2 × (+3)."),
          line("q6b", [[0, -3], [-3, -8]], [0, -8], { options: ["(+3) + (−5)", "(−3) + (−5)", "(−3) + (+5)"], answer: 1 }, -8, "Jump 3 to the left, then 5 more to the left."),
          line("q6c", [[0, 9], [9, 5]], null, { options: ["(+9) + (−4)", "(+9) + (+4)", "(−9) + (+4)"], answer: 0 }, 5, "Jump 9 to the right, then 4 back to the left. You land on 5."),
          line("q6d", [[0, 4], [4, -6]], null, { options: ["(+4) + (−6)", "(+4) + (−10)", "(−4) + (+10)"], answer: 1 }, -6, "Jump 4 to the right, then 10 to the left. You land on −6."),
          line("q6e", [[0, 4], [4, 8]], [0, 8], { options: ["2 × (−4)", "2 × (+4)", "4 × (+2)"], answer: 1 }, 8, "Two jumps of 4 to the right: 2 × (+4)."),
          line("q6f", [[0, -3], [-3, -6], [-6, -9]], [0, -9], { options: ["3 × (−3)", "3 × (+3)", "(−3) + (+3)"], answer: 0 }, -9, "Three jumps of 3 to the left: 3 × (−3).")
        ]
      },
      {
        id: "q7", title: "Simplify", instruction: TYPE,
        questions: [
          q("q7a", "(+7) + (−4)", 3, [ADD, { text: "Different signs: 7 − 4 = 3, and 7 is bigger, so +." }]),
          q("q7b", "(+7) + (−9)", -2, [ADD, { text: "Different signs: 9 − 7 = 2, and 9 is bigger, so −." }]),
          q("q7c", "(−6) + (−8)", -14, [ADD, { text: "Same signs: 6 + 8 = 14, keep −." }], [{ answer: 14, say: "Both are negative, so the sum is negative." }, { answer: 2, say: "Same signs: add them, don't subtract." }]),
          q("q7d", "(+8) + (+6) + (−5)", 9, [ADD, { text: "8 + 6 = 14, then 14 − 5." }]),
          q("q7e", "(−9) + (+4) + (−3)", -8, [ADD, { text: "(−9) + (+4) = −5, then (−5) + (−3)." }]),
          q("q7f", "2 − 8 − 6 − 11 + 12", -11, [{ text: "Positives: 2 + 12 = 14. Negatives: 8 + 6 + 11 = 25." }, { text: "14 − 25 = −11." }]),
          q("q7g", "(+3) × (−5)", -15, [MUL, { text: "3 × 5 = 15, different signs." }]),
          q("q7h", "(−4) × (−6)", 24, [MUL, { text: "4 × 6 = 24, same signs." }], [{ answer: -24, say: "Two negatives multiplied give a positive." }]),
          q("q7i", "(−2) × (−7) × (−3)", -42, [MUL, { text: "(−2) × (−7) = +14, then (+14) × (−3)." }], [{ answer: 42, say: "Three minus signs: the answer is negative." }]),
          q("q7j", "(+18) ÷ (−6)", -3, [MUL, { text: "18 ÷ 6 = 3, different signs." }]),
          q("q7k", "(−72) ÷ (+9)", -8, [MUL, { text: "72 ÷ 9 = 8, different signs." }]),
          q("q7l", "(−63) ÷ (−7)", 9, [MUL, { text: "63 ÷ 7 = 9, same signs." }], [{ answer: -9, say: "Same signs give a positive answer." }])
        ]
      },
      {
        id: "q8", title: "Evaluate powers", instruction: TYPE,
        questions: [[-1, 2], [-1, 3], [-1, 4], [-2, 3], [-2, 4], [-2, 5], [-3, 2], [-3, 3], [-4, 2], [-4, 3], [-5, 2], [-5, 3]].map(function (p, i) { return pw("q8" + "abcdefghijkl"[i], p[0], p[1]); })
      },
      {
        id: "q9", title: "East, west, north, south", instruction: "Take East and North as positive, West and South as negative.",
        questions: [
          { id: "q9a", prompt: "A man runs **10 km East** and then **4 km West**. Find his position from the starting point.", parts: [nm("d", "Distance", 6, "km"), ch("w", "Direction", ["East", "West"], "East")],
            help: [{ text: "(+10) + (−4) = +6." }, { text: "Positive means East." }, { text: "Answer: **6 km East**." }] },
          { id: "q9b", prompt: "Mrs. Yadav walks **18 km North** from O, then **12 km South** towards O.", parts: [ch("w", "(ii) Which direction is she from O?", ["North", "South"], "North"), nm("d", "(iii) How far from O?", 6, "km")],
            help: [{ text: "(+18) + (−12) = +6." }, { text: "Positive means North." }, { text: "Answer: **North**, **6 km**." }] },
          { id: "q9c", prompt: "Mr. Chamling travels **20 km East** and then **25 km West**. Find his position.", parts: [nm("d", "Distance", 5, "km"), ch("w", "Direction", ["East", "West"], "West")],
            help: [{ text: "(+20) + (−25) = −5." }, { text: "Negative means West." }, { text: "Answer: **5 km West**." }] },
          { id: "q9d", prompt: "Sunayana walks **8 km East**, turns and goes **4 km West**, then turns again and returns to the starting point. What is the **total distance** she travelled?", parts: [nm("v", "", 16, "km", [{ answer: 0, say: "0 is where she ends up. The question asks how far she walked in total." }])],
            help: [{ text: "8 km East, then 4 km West: she is 4 km East of the start." }, { text: "Then she walks 4 km back to the start." }, { text: "Total: 8 + 4 + 4 = 16 km." }, { text: "Answer: **16 km**." }] }
        ]
      },
      {
        id: "q10", title: "Temperature", instruction: "Rises are positive, falls are negative.",
        questions: [
          q("q10a", "A body's temperature is **10°C**. It rises by **20°C** and then falls by **24°C**. Find the final temperature.", 6,
            [{ text: "10 + (+20) + (−24)." }, { text: "30 − 24 = 6." }], null, "°C")
        ]
      }
    ]
  });
})();
