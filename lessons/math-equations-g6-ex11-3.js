/*
  Exercise 11.3: Verbal problems (use of equations).
  Source: Vedanta Excel in Mathematics, Book 6, pages 179-181.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var E = Practice.eq;
  function nm(id, label, answer, unit) { var p = { id: id, label: label, type: "number", answer: answer }; if (unit) p.unit = unit; return p; }
  function rel(id, label, answer) { return { id: id, label: label, type: "rel", answer: answer }; }
  // A word problem solved by one equation.
  // o: { let: "Let the number be x.", eq: "x + 2 = 7", say: "why", label, unit, more: [[part, step text]], ans: "answer text", write: true (ask for the equation too) }
  function wp(id, prompt, o) {
    var intro = [o.let].concat(o.say ? [o.say] : []).concat(["Equation: **" + Practice.prettyAlg(o.eq) + "**."]);
    var q = E.solve(id, o.eq, { prompt: prompt, intro: intro, label: o.label, unit: o.unit, check: o.check, answerText: o.ans });
    var last = q.help.pop();
    (o.more || []).forEach(function (m) { q.parts.push(m[0]); q.help.push({ text: m[1] }); });
    q.help.push(last);
    if (o.write) q.parts.unshift(rel("e", "Equation", o.eq));
    return q;
  }
  function eqOnly(id, prompt, expr, why) {
    return { id: id, prompt: prompt + " Take the unknown number as x.", parts: [rel("e", "Equation", expr)],
      help: [{ text: why }, { text: "Answer: **" + Practice.prettyAlg(expr) + "**." }] };
  }
  function lineFig(left, right, lx, rx) { // two angles on a straight line; right angle from 0 to rx degrees
    return { type: "angle", vertex: "O", rays: [{ deg: 0 }, { deg: rx }, { deg: 180 }],
      arcs: [{ from: 0, to: rx, label: right, r: 30 }, { from: rx, to: 180, label: left, r: 22 }] };
  }

  Practice.register({
    id: "math-equations-g6-ex11-3",
    subject: "Mathematics",
    unit: "Equations and inequalities",
    title: "Exercise 11.3",
    topic: "Word problems with equations",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 179–181",

    reference: {
      title: "Turning words into equations",
      columns: ["Words", "Maths"],
      rows: [
        ["the sum of x and 2", "x + 2"],
        ["the difference of x and 4", "x − 4"],
        ["the product of x and 3, x trebled", "3x"],
        ["x divided by 5", "x/5"],
        ["doubled and 7 added", "2x + 7"],
        ["two consecutive odd (or even) numbers", "x and x + 2"],
        ["10% of a sum is Rs 40", "10/100 × x = 40"],
        ["complementary angles / supplementary angles", "add up to 90° / 180°"],
        ["perimeter of a rectangle", "2(l + b)"],
        ["How to type", "x + 2 = 7, 2x + 7 = 15, x/7 = 3"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick answers", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          wp("q1a", "If the sum of x and 2 is 7, the value of x is …", { let: "The sum of x and 2 is x + 2.", eq: "x + 2 = 7" }),
          wp("q1b", "If the difference of x and 4 is 9, the value of x is …", { let: "The difference of x and 4 is x − 4.", eq: "x - 4 = 9" }),
          wp("q1c", "If the product of x and 3 is 18, the value of x is …", { let: "The product of x and 3 is 3x.", eq: "3x = 18" }),
          wp("q1d", "If the quotient of x divided by 5 is 4, the value of x is …", { let: "x divided by 5 is x/5.", eq: "x/5 = 4" })
        ] },
      { id: "q2", title: "Write the equation", instruction: "Say and write the required equations. You do not need to solve them.",
        questions: [
          eqOnly("q2a", "The sum of two numbers is 5 and one of them is 2.", "x + 2 = 5", "The other number is x. Their sum: x + 2 = 5."),
          eqOnly("q2b", "The difference of two numbers is 3 and the smaller one is 6.", "x - 6 = 3", "The greater number is x. Greater − smaller: x − 6 = 3."),
          eqOnly("q2c", "The difference of two numbers is 6 and the greater one is 9.", "9 - x = 6", "The smaller number is x. Greater − smaller: 9 − x = 6."),
          eqOnly("q2d", "The product of two numbers is 12 and one of them is 3.", "3x = 12", "The other number is x. Their product: 3 × x = 12."),
          eqOnly("q2e", "The quotient of dividing a number by 7 is 3.", "x/7 = 3", "The number divided by 7: x/7 = 3.")
        ] },
      { id: "q3", title: "Find the unknown number", instruction: "Make equations and solve them to find the unknown numbers.",
        questions: [
          wp("q3a", "The sum of two numbers is 12. If one of them is 7, find the other number.", { let: "Let the other number be x.", eq: "7 + x = 12", label: "Other number", write: true, ans: "5" }),
          wp("q3b", "The difference of two numbers is 6. If the greater one is 17, find the smaller number.", { let: "Let the smaller number be x.", eq: "17 - x = 6", label: "Smaller number", write: true, ans: "11" }),
          wp("q3c", "The difference of two numbers is 9. If the smaller one is 6, find the greater number.", { let: "Let the greater number be x.", eq: "x - 6 = 9", label: "Greater number", write: true, ans: "15" }),
          wp("q3d", "The quotient of dividing a number by 4 is 5. Find the number.", { let: "Let the number be x.", eq: "x/4 = 5", label: "Number", write: true, ans: "20" })
        ] },
      { id: "q4", title: "Think of a number", instruction: "Make an equation and solve it.",
        questions: [
          wp("q4a", "Bishwant thought of a number. He doubled it and added 7. If he got 15, find the number he thought of.", { let: "Let the number be x. Doubled: 2x. Then 7 added: 2x + 7.", eq: "2x + 7 = 15", label: "Number", write: true, ans: "4" }),
          wp("q4b", "Sunayana thought of a number. She trebled it and subtracted 4 from it. If she got 5, find the number she thought of.", { let: "Let the number be x. Trebled: 3x. Then 4 subtracted: 3x − 4.", eq: "3x - 4 = 5", label: "Number", write: true, ans: "3" })
        ] },
      { id: "q5", title: "Pencils and copies", instruction: "Make an equation and solve it.",
        questions: [
          wp("q5a", "The cost of 10 pencils is Rs 15 more than the cost of such 7 pencils. What is the cost of a pencil?", { let: "Let the cost of a pencil be Rs x. Then 10 pencils cost 10x and 7 pencils cost 7x.", eq: "10x = 7x + 15", label: "Cost of a pencil = Rs", ans: "Rs 5" }),
          wp("q5b", "The cost of a dozen copies is Rs 50 more than that of 10 copies of the same kind. What is the cost of a copy?", { let: "Let the cost of a copy be Rs x. A dozen is 12, so 12 copies cost 12x and 10 copies cost 10x.", eq: "12x = 10x + 50", label: "Cost of a copy = Rs", ans: "Rs 25" })
        ] },
      { id: "q6", title: "Consecutive numbers", instruction: "Make an equation and solve it.",
        questions: [
          wp("q6a", "If the sum of two consecutive odd numbers is 16, find the numbers.", { let: "Odd numbers go up in 2s. Let the smaller one be x, so the next one is x + 2.", eq: "x + x + 2 = 16", label: "Smaller number", more: [[nm("b", "Greater number", 9), "The greater number = 7 + 2 = 9."]], ans: "7 and 9" }),
          wp("q6b", "If the sum of two consecutive even numbers is 22, find the numbers.", { let: "Even numbers go up in 2s. Let the smaller one be x, so the next one is x + 2.", eq: "x + x + 2 = 22", label: "Smaller number", more: [[nm("b", "Greater number", 12), "The greater number = 10 + 2 = 12."]], ans: "10 and 12" })
        ] },
      { id: "q7", title: "Part of a sum", instruction: "Make an equation and solve it.",
        questions: [
          wp("q7a", "A sum is Rs x. If its 10% is Rs 40, find the sum.", { let: "10% of x means 10/100 × x.", eq: "10x/100 = 40", label: "Sum = Rs", ans: "Rs 400" }),
          wp("q7b", "A sum is Rs x. If 2/3 parts of the sum is Rs 50, find the sum.", { let: "2/3 of x means 2x/3.", eq: "2x/3 = 50", label: "Sum = Rs", ans: "Rs 75" }),
          wp("q7c", "If 25% of a sum is Rs 50, find the sum. (Hint: 25% of x = Rs 50)", { let: "Let the sum be Rs x. 25% of x means 25/100 × x.", eq: "25x/100 = 50", label: "Sum = Rs", ans: "Rs 200" }),
          wp("q7d", "40% of the total number of students of a class are boys. If there are 24 boys, find the total number of students of the class.", { let: "Let the total be x. 40% of x means 40/100 × x.", eq: "40x/100 = 24", label: "Total students", ans: "60 students" })
        ] },
      { id: "q8", title: "Profit, loss, VAT, discount", instruction: "Make an equation and solve it.",
        questions: [
          wp("q8a", "The cost price (C.P.) of an article is Rs x. If 10% profit on C.P. amounts to Rs 250, find the C.P. of the article.", { let: "10% of C.P. is 10/100 × x.", eq: "10x/100 = 250", label: "C.P. = Rs", ans: "Rs 2500" }),
          wp("q8b", "The cost price (C.P.) of a bag is Rs x. If 15% loss on C.P. amounts to Rs 120, find the C.P. of the bag.", { let: "15% of C.P. is 15/100 × x.", eq: "15x/100 = 120", label: "C.P. = Rs", ans: "Rs 800" }),
          wp("q8c", "The selling price (S.P.) of a watch is Rs x. If 10% VAT on S.P. amounts to Rs 180, find the S.P. of the watch.", { let: "10% of S.P. is 10/100 × x.", eq: "10x/100 = 180", label: "S.P. = Rs", ans: "Rs 1800" }),
          wp("q8d", "The marked price (M.P.) of an umbrella is Rs x. If 25% discount on M.P. amounts to Rs 120, find the M.P. of the umbrella.", { let: "25% of M.P. is 25/100 × x.", eq: "25x/100 = 120", label: "M.P. = Rs", ans: "Rs 480" })
        ] },
      { id: "q9", title: "Complementary and supplementary", instruction: "Make an equation and solve it.",
        questions: [
          wp("q9a", "The sum of a pair of complementary angles is 90°. If x° and 50° are a pair of complementary angles, find x°.", { let: "Complementary angles add up to 90°.", eq: "x + 50 = 90", unit: "°", ans: "x = 40°" }),
          wp("q9b", "Two angles are complementary. If one of them is 35°, find the other.", { let: "Let the other angle be x°. Complementary angles add up to 90°.", eq: "x + 35 = 90", label: "Other angle", unit: "°", ans: "55°" }),
          wp("q9c", "The sum of a pair of supplementary angles is 180°. If x° and 80° are a pair of supplementary angles, find x°.", { let: "Supplementary angles add up to 180°.", eq: "x + 80 = 180", unit: "°", ans: "x = 100°" }),
          wp("q9d", "A pair of angles are supplementary. If one of them is 135°, find the size of the other angle.", { let: "Let the other angle be x°. Supplementary angles add up to 180°.", eq: "x + 135 = 180", label: "Other angle", unit: "°", ans: "45°" })
        ] },
      { id: "q10", title: "Angles on a straight line", instruction: "Write the equations, solve them and find the size of unknown angles.",
        questions: [
          (function () { var q = wp("q10a", "Find x.", { let: "Angles on a straight line add up to 180°.", eq: "x + 50 = 180", unit: "°", write: true, ans: "x = 130°" }); q.figure = lineFig("x°", "50°", 0, 50); return q; })(),
          (function () { var q = wp("q10b", "Find x and the two angles.", { let: "Angles on a straight line add up to 180°.", eq: "x + 2x = 180", unit: "°", write: true,
            more: [[nm("b", "2x =", 120, "°"), "The other angle = 2x = 2 × 60° = 120°."]], ans: "x = 60°, 2x = 120°" }); q.figure = lineFig("x°", "2x°", 0, 120); return q; })(),
          (function () { var q = wp("q10c", "Find x and the two angles.", { let: "Angles on a straight line add up to 180°.", eq: "3x + 20 + 2x = 180", unit: "°", write: true,
            more: [[nm("b", "3x + 20 =", 116, "°"), "(3x + 20)° = 3 × 32 + 20 = 116°."], [nm("c", "2x =", 64, "°"), "2x° = 2 × 32 = 64°. Check: 116 + 64 = 180 ✓"]], ans: "x = 32°, angles 116° and 64°" }); q.figure = lineFig("(3x+20)°", "2x°", 0, 64); return q; })()
        ] },
      { id: "q11", title: "Rectangles", instruction: "Creative Section B. Make an equation and solve it.",
        questions: [
          wp("q11a", "The perimeter of a rectangle is 18 cm. If its length is 5 cm, find its breadth.", { let: "Let the breadth be x cm. Perimeter = 2(l + b).", eq: "2(5 + x) = 18", label: "Breadth", unit: "cm", ans: "4 cm" }),
          wp("q11b", "The perimeter of a rectangle is 42 cm. If its length is double than that of its breadth, find the length and breadth of the rectangle.", { let: "Let the breadth be x cm. Then the length is 2x cm. Perimeter = 2(l + b).", eq: "2(2x + x) = 42", label: "Breadth", unit: "cm",
            more: [[nm("l", "Length", 14, "cm"), "Length = 2x = 2 × 7 = 14 cm."]], ans: "length 14 cm, breadth 7 cm" }),
          wp("q11c", "The area of a rectangle is 45 cm². If its length is 9 cm, find its breadth.", { let: "Let the breadth be x cm. Area = l × b.", eq: "9x = 45", label: "Breadth", unit: "cm", ans: "5 cm" }),
          wp("q11d", "The area of a rectangle is 54 cm². If its breadth is 6 cm, find its length.", { let: "Let the length be x cm. Area = l × b.", eq: "6x = 54", label: "Length", unit: "cm", ans: "9 cm" })
        ] },
      { id: "q12", title: "Two numbers", instruction: "Make an equation and solve it.",
        questions: [
          wp("q12a", "If the sum of two numbers is 10 and the difference is 6, find the numbers.", { let: "Let the smaller number be x. The difference is 6, so the greater is x + 6.", eq: "x + x + 6 = 10", label: "Smaller number",
            more: [[nm("b", "Greater number", 8), "Greater number = 2 + 6 = 8."]], ans: "8 and 2" }),
          wp("q12b", "A number is greater than another number by 3. If their sum is 33, find the numbers.", { let: "Let the smaller number be x. The other is x + 3.", eq: "x + x + 3 = 33", label: "Smaller number",
            more: [[nm("b", "Greater number", 18), "Greater number = 15 + 3 = 18."]], ans: "15 and 18" }),
          wp("q12c", "A number is less than another number by 7. If their sum is 37, find the numbers.", { let: "Let the greater number be x. The other is x − 7.", eq: "x + x - 7 = 37", label: "Greater number",
            more: [[nm("b", "Smaller number", 15), "Smaller number = 22 − 7 = 15."]], ans: "22 and 15" })
        ] },
      { id: "q13", title: "Ages", instruction: "Make an equation and solve it.",
        questions: [
          { id: "q13a", prompt: "Father is 30 years older than his son. (i) If the son is x years old, write the age of the father. (ii) If the sum of their ages is 50 years, write an equation. (iii) Solve it and find their ages.",
            parts: [{ id: "f", label: "Father's age", type: "expr", answer: "x + 30" }, rel("e", "Equation", "x + x + 30 = 50"), nm("s", "Son", 10, "years"), nm("d", "Father", 40, "years")],
            help: [{ text: "Father is 30 years older, so his age is **x + 30**." }, { text: "Sum of ages: **x + x + 30 = 50**, that is 2x + 30 = 50." },
              { text: "Subtract 30 from both sides: 2x = 20. Divide by 2: x = 10." }, { text: "Son = 10 years, father = 10 + 30 = 40 years. Check: 10 + 40 = 50 ✓" }, { text: "Answer: **son 10 years, father 40 years**." }] },
          wp("q13b", "Daughter is 25 years younger than her mother. If the sum of their ages is 35 years, find their ages.", { let: "Let the daughter be x years old. Then the mother is x + 25 years old.", eq: "x + x + 25 = 35", label: "Daughter", unit: "years",
            more: [[nm("m", "Mother", 30, "years"), "Mother = 5 + 25 = 30 years."]], ans: "daughter 5 years, mother 30 years" })
        ] },
      { id: "q14", title: "Costs and students", instruction: "Make an equation and solve it.",
        questions: [
          wp("q14a", "The total cost of a pencil and an eraser is Rs 15. If the pencil is more expensive than the eraser by Rs 7, find their costs.", { let: "Let the eraser cost Rs x. Then the pencil costs Rs (x + 7).", eq: "x + x + 7 = 15", label: "Eraser = Rs",
            more: [[nm("p", "Pencil = Rs", 11), "Pencil = 4 + 7 = Rs 11."]], ans: "eraser Rs 4, pencil Rs 11" }),
          wp("q14b", "There are 32 students in a class. If the number of girls is 6 more than the number of boys, find the numbers.", { let: "Let the number of boys be x. Then girls = x + 6.", eq: "x + x + 6 = 32", label: "Boys",
            more: [[nm("g", "Girls", 19), "Girls = 13 + 6 = 19."]], ans: "13 boys and 19 girls" })
        ] }
    ]
  });
})();
