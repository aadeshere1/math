/*
  Exercise 10.1: Terms, coefficients and writing algebraic expressions.
  Source: Vedanta Excel in Mathematics, Book 6, pages 147-149.
  DATA ONLY. See lessons/README.md for the format.
  Algebra answers use type "expr": the game accepts any equal form (4y + 3x = 3x + 4y).
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ex(id, label, answer, form, mistakes) { return { id: id, label: label, type: "expr", answer: answer, form: form, mistakes: mistakes }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  var CV = ["Constant", "Variable"];
  var KIND = ["Monomial", "Binomial", "Trinomial"];

  function cv(id, prompt, answer, why) {
    return { id: id, prompt: prompt, parts: [ch("v", "", CV, answer)],
      help: [{ text: "A **constant** has only one possible value. A **variable** can take more than one value." }, { text: why }, { text: "Answer: **" + answer.toLowerCase() + "**." }] };
  }
  function kind(id, expr, answer, why) {
    return { id: id, prompt: "**" + expr + "** is a ____ expression.", parts: [ch("v", "", KIND, answer)],
      help: [{ text: "Count the terms. Terms are separated by **+** or **−** signs. Multiplying or dividing does not make a new term." }, { text: why }, { text: "Answer: **" + answer.toLowerCase() + "**." }] };
  }
  function say(id, prompt, answer, form, steps) {
    return { id: id, prompt: prompt, parts: [ex("v", "", answer, form || "any")], help: steps };
  }

  Practice.register({
    id: "math-algebra-g6-ex10-1",
    subject: "Mathematics",
    unit: "Algebraic Expressions",
    title: "Exercise 10.1",
    topic: "Terms, coefficients and writing expressions",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 147–149",

    reference: {
      title: "Words to know",
      columns: ["Word", "Meaning", "Example"],
      rows: [
        ["Constant", "Has one fixed value", "5, or x when x can only be 4"],
        ["Variable", "A letter that can take different values", "x when x can be 7 or 8"],
        ["Monomial", "One term", "7xyz, pq/r"],
        ["Binomial", "Two terms", "xy − ab"],
        ["Trinomial", "Three terms", "2a + 5b − c"],
        ["Coefficient", "The number (or letter) multiplying the base", "5 in 5a²"],
        ["Base and exponent", "The letter and the small power number", "In a², base a, exponent 2"],
        ["How to type", "Use ^ for powers", "3x^2 means 3x²"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Constant or variable", instruction: "Say whether the letter represents a constant or a variable.",
        questions: [
          cv("q1a", "x represents the natural numbers between 3 and 5. x is a ____.", "Constant", "The only natural number between 3 and 5 is 4. One value only."),
          cv("q1b", "x represents the natural numbers between 6 and 9. x is a ____.", "Variable", "The natural numbers between 6 and 9 are 7 and 8. Two possible values."),
          cv("q1c", "y represents the even prime numbers. y is a ____.", "Constant", "The only even prime number is 2."),
          cv("q1d", "y represents the composite numbers less than 10. y is a ____.", "Variable", "Composite numbers less than 10 are 4, 6, 8 and 9. Many values.")
        ]
      },
      {
        id: "q2", title: "Monomial, binomial or trinomial", instruction: "Say whether each expression is a monomial, binomial or trinomial.",
        questions: [
          kind("q2a", "7xyz", "Monomial", "7xyz is 7 × x × y × z: all multiplied, so it is one term."),
          kind("q2b", "2a + 5b − c", "Trinomial", "The terms are 2a, 5b and c: three terms."),
          kind("q2c", "xy − ab", "Binomial", "The terms are xy and ab: two terms."),
          kind("q2d", "pq/r", "Monomial", "pq ÷ r has no + or − sign, so it is one term."),
          { id: "q2e", prompt: "**5x ÷ y** is a ____ expression.",
            parts: [{ id: "v", label: "", type: "choice", options: KIND, answer: "Monomial",
              mistakes: [{ answer: "Binomial", say: "Dividing does not make a new term. Only + and − separate terms." }] }],
            help: [{ text: "Count the terms. Only **+** or **−** signs separate terms." }, { text: "5x ÷ y has no + or − sign, so it is one term." }, { text: "Answer: **monomial**." }] }
        ]
      },
      {
        id: "q3", title: "Coefficient, base and exponent", instruction: "Fill in the blanks.",
        questions: [
          { id: "q3a", prompt: "In **5a²**: coefficient, base and exponent?",
            parts: [nm("c", "Coefficient", 5), { id: "b", label: "Base", type: "expr", answer: "a", form: "exact" }, nm("e", "Exponent", 2)],
            help: [{ text: "5a² means 5 × a × a." }, { text: "The number in front (5) is the coefficient. The letter that is multiplied by itself (a) is the base. The small number (2) is the exponent." }] },
          { id: "q3b", prompt: "In **4x³**: coefficient, base and exponent?",
            parts: [nm("c", "Coefficient", 4), { id: "b", label: "Base", type: "expr", answer: "x", form: "exact" }, nm("e", "Exponent", 3)],
            help: [{ text: "4x³ means 4 × x × x × x." }, { text: "Coefficient 4, base x, exponent 3." }] },
          { id: "q3c", prompt: "In **y**: coefficient, base and exponent?",
            parts: [nm("c", "Coefficient", 1), { id: "b", label: "Base", type: "expr", answer: "y", form: "exact" }, nm("e", "Exponent", 1)],
            help: [{ text: "When no number is written, the number is **1**: y = 1y¹." }, { text: "Coefficient 1, base y, exponent 1." }] },
          { id: "q3d", prompt: "In **6ax**: numerical coefficient and literal coefficient of x?",
            parts: [nm("n", "Numerical coefficient", 6), { id: "l", label: "Literal coefficient", type: "expr", answer: "a", form: "exact" }],
            help: [{ text: "6ax = 6 × a × x. The number multiplying x is 6: the **numerical** coefficient." }, { text: "The letter multiplying x is a: the **literal** coefficient." }] }
        ]
      },
      {
        id: "q4", title: "Write the expression", instruction: "Write the algebraic expression. Type powers with ^ (x^2).",
        questions: [
          say("q4a", "Sum of a and b", "a+b", "any", [{ text: "Sum means add." }, { text: "Answer: **a + b**." }]),
          say("q4b", "Difference of a and b", "a-b", "any", [{ text: "Difference means subtract the second from the first." }, { text: "Answer: **a − b**." }]),
          say("q4c", "Product of a and b", "ab", "any", [{ text: "Product means multiply: a × b. We write it as ab." }]),
          say("q4d", "The quotient of a divided by b", "a/b", "any", [{ text: "Quotient means divide: a ÷ b. Type it as a/b." }]),
          say("q4e", "Two times the sum of x and y", "2(x+y)", "any", [{ text: "First the sum: x + y. Then two times it: 2(x + y)." }, { text: "The brackets show the whole sum is doubled. 2x + 2y is the same thing." }]),
          say("q4f", "Five times the product of m and n", "5mn", "any", [{ text: "Product of m and n is mn. Five times it is 5mn." }])
        ]
      },
      {
        id: "q5", title: "Make your own", instruction: "Use the terms x, y and z.",
        questions: [
          { id: "q5a", prompt: "Using the terms x, y and z, which one is a **trinomial**?", parts: [ch("v", "", ["xyz", "x + y", "x + y + z", "x"], "x + y + z")],
            help: [{ text: "A trinomial has three terms, joined by + or −." }, { text: "xyz is one term. x + y is two terms. x + y + z is three terms." }] }
        ]
      },
      {
        id: "q6", title: "Statements to expressions", instruction: "Rewrite each statement as an algebraic expression.",
        questions: [
          say("q6a", "Product of x and y is added to z.", "xy+z", "any", [{ text: "Product of x and y: xy. Added to z: xy + z." }]),
          say("q6b", "Three times the sum of x and y is increased by 5.", "3(x+y)+5", "any", [{ text: "Sum of x and y: (x + y)." }, { text: "Three times it: 3(x + y)." }, { text: "Increased by 5: **3(x + y) + 5**." }]),
          say("q6c", "Two times the difference of p and q is decreased by 4.", "2(p-q)-4", "any", [{ text: "Difference of p and q: (p − q)." }, { text: "Two times it: 2(p − q). Decreased by 4: **2(p − q) − 4**." }]),
          say("q6d", "Product of p and q is subtracted from r.", "r-pq", "any",
            [{ text: "Product of p and q is pq." }, { text: "\"Subtracted **from** r\" means r comes first: **r − pq**." }]),
          say("q6e", "Five times the product of a and b is increased by x.", "5ab+x", "any", [{ text: "Product of a and b: ab. Five times: 5ab. Increased by x: **5ab + x**." }]),
          say("q6f", "The sum of x and y is divided by 2 and decreased by 7.", "(x+y)/2-7", "any", [{ text: "Sum: (x + y). Divided by 2: (x + y)/2." }, { text: "Decreased by 7: **(x + y)/2 − 7**." }])
        ]
      },
      {
        id: "q7", title: "Word problems", instruction: "Write an expression for each answer.",
        questions: [
          { id: "q7a", prompt: "The present age of Anamol is **x** years. (i) How old was he 2 years before? (ii) How old will he be after 2 years? (iii) His father is four times older than him. How old is his father?",
            parts: [ex("a", "(i)", "x-2", "any"), ex("b", "(ii)", "x+2", "any"), ex("c", "(iii)", "4x", "any")],
            help: [{ text: "2 years before means 2 years less: x − 2." }, { text: "After 2 years means 2 years more: x + 2." }, { text: "Four times his age: 4 × x = 4x." }] },
          { id: "q7b", prompt: "The breadth of a room is **b** metres. Its length is 5 metres longer than its breadth. Write the length.",
            parts: [ex("v", "Length =", "b+5", "any")], help: [{ text: "5 metres longer means add 5." }, { text: "Answer: **b + 5** metres." }] },
          { id: "q7c", prompt: "A got **x** marks in Maths. B got double A's marks, and C got double B's marks. Write B's and C's marks.",
            parts: [ex("b", "B =", "2x", "any"), ex("c", "C =", "4x", "any")],
            help: [{ text: "Double means × 2. B = 2 × x = 2x." }, { text: "C = 2 × B = 2 × 2x = 4x." }] }
        ]
      },
      {
        id: "q8", title: "Formulas", instruction: "Write each formula as an algebraic expression.",
        questions: [
          say("q8a", "The perimeter of a triangle is the sum of its three sides a, b and c. Perimeter = ?", "a+b+c", "any", [{ text: "Sum means add all three: **a + b + c**." }]),
          say("q8b", "The area of a triangle is half of the product of base (b) and height (h). Area = ?", "1/2bh", "any", [{ text: "Product of b and h: bh. Half of it: ½bh. Type it as 1/2bh or bh/2." }]),
          say("q8c", "The perimeter of a square is four times its length (l). Perimeter = ?", "4l", "any", [{ text: "Four times l: **4l**." }]),
          say("q8d", "The area of a square is the square of its length (l). Area = ?", "l^2", "any", [{ text: "The square of l is l × l = l². Type l^2." }]),
          say("q8e", "The perimeter of a rectangle is two times the sum of its length (l) and breadth (b). Perimeter = ?", "2(l+b)", "any", [{ text: "Sum of l and b: (l + b). Two times it: **2(l + b)**." }]),
          say("q8f", "The area of a rectangle is the product of its length (l) and breadth (b). Area = ?", "lb", "any", [{ text: "Product means multiply: l × b = **lb**." }])
        ]
      }
    ]
  });
})();
