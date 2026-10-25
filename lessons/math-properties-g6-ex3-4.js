/*
  Exercise 3.4: Square numbers and square roots.
  Source: Vedanta Excel in Mathematics, Book 6, pages 59-62.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var NT = Practice.nt;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: unit, mistakes: mistakes }; }
  function st(id, label, arr) { return { id: id, label: label, type: "set", answer: arr.map(String) }; }
  function pf(id, label, n) { return { id: id, label: label, type: "factors", answer: n }; }
  function sqrtOf(n) { return Math.round(Math.sqrt(n)); }
  function pairs(n) { // "(2 × 2) × (3 × 3)"
    var p = NT.pf(n), out = [];
    for (var i = 0; i < p.length;) { if (p[i + 1] === p[i]) { out.push("(" + p[i] + " × " + p[i] + ")"); i += 2; } else { out.push(p[i]); i += 1; } }
    return out.join(" × ");
  }

  function sq(id, n, tip) {
    return { id: id, prompt: n + "² = ?", parts: [nm("v", n + "² =", n * n, null, [{ answer: 2 * n, say: n + "² means " + n + " × " + n + ", not " + n + " × 2." }])],
      help: [{ text: tip || n + "² = " + n + " × " + n + "." }, { text: "Answer: **" + n * n + "**." }] };
  }
  function root(id, n, tip) {
    var r = sqrtOf(n);
    return { id: id, prompt: "√" + n + " = ?", parts: [nm("v", "√" + n + " =", r, null, [{ answer: n / 2, say: "The square root is the number that times itself gives " + n + ". It is not half of it." }])],
      help: [{ text: tip || "Which number times itself makes " + n + "?" }, { text: "Answer: **" + r + "** because " + r + " × " + r + " = " + n + "." }] };
  }
  function zeros(id, base) {
    var list = [base, base * 10, base * 100, base * 1000];
    return { id: id, prompt: list.map(function (x) { return x + "²"; }).join(", "), parts: list.map(function (x, i) { return nm("p" + i, x + "² =", x * x); }),
      help: [{ text: base + "² = " + base * base + "." }, { text: "Each zero in the number gives two zeros in its square." }, { text: "Answer: **" + list.map(function (x) { return x * x; }).join(", ") + "**." }] };
  }
  function rootZeros(id, base) {
    var list = [base, base * 100, base * 10000, base * 1000000];
    return { id: id, prompt: list.map(function (x) { return "√" + x; }).join(", "), parts: list.map(function (x, i) { return nm("p" + i, "√" + x + " =", sqrtOf(x)); }),
      help: [{ text: "√" + base + " = " + sqrtOf(base) + "." }, { text: "Every two zeros under the root give one zero in the answer." }, { text: "Answer: **" + list.map(sqrtOf).join(", ") + "**." }] };
  }
  function perfect(id, n) {
    var r = Math.sqrt(n), yes = r === Math.floor(r);
    return { id: id, prompt: "Factorise **" + n + "**. Is it a perfect square?", parts: [pf("f", n + " =", n), ch("v", "Perfect square?", ["Yes", "No"], yes ? "Yes" : "No")],
      help: [{ text: n + " = " + NT.pfStr(n) + "." }, { text: "Make pairs of equal factors: " + pairs(n) + "." },
             { text: yes ? "Every factor is in a pair, so it is a perfect square (" + r + "²)." : "Some factor is left without a partner, so it is not a perfect square." }, { text: "Answer: **" + (yes ? "Yes" : "No") + "**." }] };
  }
  function rootF(id, n) {
    var r = sqrtOf(n), p = NT.pf(n), one = [];
    for (var i = 0; i < p.length; i += 2) one.push(p[i]);
    return { id: id, prompt: "Find √" + n + " by factorisation.", parts: [pf("f", n + " =", n), nm("v", "√" + n + " =", r)],
      help: [{ text: n + " = " + NT.pfStr(n) + "." }, { text: "Pairs: " + pairs(n) + "." }, { text: "Take one from each pair: " + one.join(" × ") + " = " + r + "." }, { text: "Answer: **" + r + "**." }] };
  }
  function makeSq(id, n) {
    var c = {}; NT.pf(n).forEach(function (p) { c[p] = (c[p] || 0) + 1; });
    var m = Object.keys(c).filter(function (p) { return c[p] % 2; }).reduce(function (a, p) { return a * p; }, 1);
    return { id: id, prompt: "Find the smallest number to multiply **" + n + "** by to make a perfect square.", parts: [nm("v", "", m)],
      help: [{ text: n + " = " + NT.pfStr(n) + "." }, { text: "Pairs: " + pairs(n) + ". The factor without a partner needs one more." },
             { text: n + " × " + m + " = " + n * m + " = " + sqrtOf(n * m) + "²." }, { text: "Answer: **" + m + "**." }] };
  }
  function five(id, n) {
    var t = Math.floor(n / 10);
    return { id: id, prompt: n + "² = ?", parts: [nm("v", n + "² =", n * n)],
      help: [{ text: "The last two digits are always 25." }, { text: "Take the tens digit " + t + " and multiply it by the next number: " + t + " × " + (t + 1) + " = " + t * (t + 1) + "." },
             { text: "Write " + t * (t + 1) + " then 25." }, { text: "Answer: **" + n * n + "**." }] };
  }
  function stairs(id, n) {
    var up = []; for (var i = 1; i <= n; i++) up.push(i);
    var s = up.concat(up.slice(0, -1).reverse()).join(" + ");
    var wrongA = up.concat(up.slice().reverse()).join(" + "), wrongB = up.join(" + ");
    var opts = [s, wrongA, wrongB], k = n % 3, shown = opts.slice(k).concat(opts.slice(0, k));
    return { id: id, prompt: n + "² = " + n * n + " = ?", parts: [ch("v", "", shown, s)],
      help: [{ text: "Count up from 1 to " + n + ", then back down to 1. The middle number appears once." }, { text: "Answer: **" + s + "**." }] };
  }

  Practice.register({
    id: "math-properties-g6-ex3-4",
    subject: "Mathematics",
    unit: "Properties of Whole Numbers",
    title: "Exercise 3.4",
    topic: "Squares and square roots",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 59–62",

    reference: {
      title: "Squares and roots",
      columns: ["Idea", "Example"],
      rows: [
        ["Square: a number times itself", "7² = 7 × 7 = 49"],
        ["Square root √: the number that was squared", "√49 = 7"],
        ["Zeros", "30² = 900, √90000 = 300"],
        ["Root by factorisation: pair the factors, take one from each pair", "144 = (2 × 2) × (2 × 2) × (3 × 3), √144 = 2 × 2 × 3 = 12"],
        ["Perfect square: every prime factor is in a pair", "36 yes, 45 no"],
        ["Ending in 5", "35² → 3 × 4 = 12, then 25: 1225"]
      ]
    },

    sections: [
      { id: "q1", title: "Squares from the table", instruction: "Use the multiplication table.", questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return sq("q1n" + n, n, "Look at row " + n + ", column " + n + " of the table."); }) },
      { id: "q2", title: "Squares with zeros", instruction: "Each zero in the number gives two zeros in the square.", questions: [zeros("q2a", 3), zeros("q2b", 4), zeros("q2c", 5)] },
      { id: "q3", title: "Square roots", instruction: "Say the square root quickly.", questions: [4, 9, 16, 25, 36, 64, 100, 81].map(function (n, i) { return root("q3" + "abcdefgh"[i], n); }) },
      { id: "q4", title: "Roots with zeros", instruction: "Two zeros under the root give one zero in the answer.", questions: [rootZeros("q4a", 9), rootZeros("q4b", 16), rootZeros("q4c", 25)] },
      { id: "q5", title: "Find the squares", instruction: "Creative section A.", questions: [14, 25, 42, 90, 115, 284].map(function (n, i) { return sq("q5" + "abcdef"[i], n); }) },
      { id: "q6", title: "Perfect squares", instruction: "Factorise (like 2 × 2 × 3), then decide.", questions: [9, 16, 45, 144, 220, 324].map(function (n, i) { return perfect("q6" + "abcdef"[i], n); }) },
      { id: "q7", title: "Square roots by factorisation", instruction: "Factorise, pair the factors, take one from each pair.",
        questions: [36, 81, 196, 225, 324, 400, 576, 729, 1225, 1764, 2304, 3025].map(function (n, i) { return rootF("q7" + "abcdefghijkl"[i], n); }) },
      { id: "q8", title: "Rows and columns", instruction: "Creative section B.",
        questions: [
          { id: "q8a", prompt: "Plants are planted in **25 rows and 25 columns** in a square garden.", parts: [nm("i", "(i) Plants in the garden", 625), nm("ii", "(ii) More needed for 27 in each row and column", 104)],
            help: [{ text: "25 × 25 = 625." }, { text: "27 × 27 = 729." }, { text: "729 − 625 = 104." }, { text: "Answer: **625** and **104**." }] },
          { id: "q8b", prompt: "Seats are arranged in **32 rows and 32 columns** in a hall.", parts: [nm("i", "(i) Seats altogether", 1024), nm("ii", "(ii) Seats removed if 2 are removed from each row and column", 124)],
            help: [{ text: "32 × 32 = 1024." }, { text: "Left: 30 × 30 = 900." }, { text: "Removed: 1024 − 900 = 124." }, { text: "Answer: **1024** and **124**." }] },
          { id: "q8c", prompt: "There are **45 students**. Each donates as many rupees as the number of students.", parts: [nm("i", "(i) Total donation (Rs)", 2025), nm("ii", "(ii) How much less if 3 were absent (Rs)", 135)],
            help: [{ text: "45 × 45 = 2025." }, { text: "3 absent students would not give Rs 45 each: 3 × 45 = 135." }, { text: "Answer: **Rs 2025** and **Rs 135**." }] }
        ] },
      { id: "q9", title: "Square arrangements", instruction: "Answer each part.",
        questions: [
          { id: "q9a", prompt: "Chairs are arranged in **6 rows and 6 columns**.", parts: [ch("i", "(i) Shape formed", ["Square", "Rectangle (not square)", "Triangle"], "Square"), nm("ii", "(ii) Chairs needed", 36)],
            help: [{ text: "Same number of rows and columns makes a square." }, { text: "6 × 6 = 36." }, { text: "Answer: **square**, **36**." }] },
          { id: "q9b", prompt: "Students stand in a square with **24 in each row**.", parts: [nm("i", "(i) In each column", 24), nm("ii", "(ii) In the assembly", 576), nm("iii", "(iii) More needed for 2 more in each row and column", 100)],
            help: [{ text: "A square has the same number in each column: 24." }, { text: "24 × 24 = 576." }, { text: "26 × 26 = 676, and 676 − 576 = 100." }, { text: "Answer: **24**, **576**, **100**." }] }
        ] },
      { id: "q10", title: "Products of two equal numbers", instruction: "Answer each part.",
        questions: [
          { id: "q10a", prompt: "The product of two identical numbers is **441**.", parts: [pf("i", "(i) 441 =", 441), nm("iii", "(iii) One factor from each pair, multiplied", 21), ch("iv", "(iv) Is this √441?", ["Yes", "No"], "Yes")],
            help: [{ text: "441 = 3 × 3 × 7 × 7." }, { text: "(ii) Pairs: (3 × 3) × (7 × 7)." }, { text: "3 × 7 = 21, and 21 × 21 = 441." }, { text: "Answer: **21**, **Yes**." }] },
          { id: "q10b", prompt: "Every student planted as many plants as the number of students. They planted **576** plants. How many students were there?", parts: [nm("v", "", 24, "students")],
            help: [{ text: "students × students = 576, so find √576." }, { text: "576 = (2 × 2) × (2 × 2) × (2 × 2) × (3 × 3), so √576 = 2 × 2 × 2 × 3." }, { text: "Answer: **24 students**." }] }
        ] },
      { id: "q11", title: "Square ground and garden", instruction: "Answer each part.",
        questions: [
          { id: "q11a", prompt: "**484 students** stand in a square.", parts: [nm("i", "(i) In each row", 22), nm("ii", "(ii) Taken out of each row if 324 are left", 4), nm("iii", "(iii) More needed for 1 more in each row", 45)],
            help: [{ text: "√484 = 22." }, { text: "√324 = 18, so 22 − 18 = 4 taken from each row." }, { text: "23 × 23 = 529, and 529 − 484 = 45." }, { text: "Answer: **22**, **4**, **45**." }] },
          { id: "q11b", prompt: "The area of a square garden is **900 m²**.", parts: [nm("i", "(i) Length (= breadth)", 30, "m"), nm("ii", "(ii) Increase in area if each side grows by 2 m", 124, "m²")],
            help: [{ text: "√900 = 30 m." }, { text: "New side 32 m: 32 × 32 = 1024 m²." }, { text: "1024 − 900 = 124 m²." }, { text: "Answer: **30 m** and **124 m²**." }] }
        ] },
      { id: "q12", title: "Make it a perfect square", instruction: "Factorise and find the factor without a partner.", questions: [50, 75, 80, 108, 175, 245].map(function (n, i) { return makeSq("q12" + "abcdef"[i], n); }) },
      { id: "q13", title: "Squares ending in 5", instruction: "Project and activity: tens digit × next number, then write 25.", questions: [45, 55, 65, 75, 85, 95].map(function (n, i) { return five("q13" + "abcdef"[i], n); }) },
      { id: "q14", title: "Square staircase", instruction: "2² = 4 = 1 + 2 + 1 and 3² = 9 = 1 + 2 + 3 + 2 + 1. Follow the pattern.", questions: [4, 5, 6, 7].map(function (n, i) { return stairs("q14" + "abcd"[i], n); }) },
      { id: "q15", title: "Number of factors", instruction: "Complete the chart for 1 to 10, then answer. Type the numbers with commas.",
        questions: [
          { id: "q15t", prompt: "Write the factors of 6, 7, 8, 9 and 10.", parts: [6, 7, 8, 9, 10].map(function (n) { return st("f" + n, "Factors of " + n, NT.factors(n)); }),
            help: [{ text: "6: 1, 2, 3, 6. 7: 1, 7. 8: 1, 2, 4, 8." }, { text: "9: 1, 3, 9. 10: 1, 2, 5, 10." }, { text: "Answer: as above." }] },
          { id: "q15a", prompt: "List the numbers from 1 to 10 which have exactly two factors.", parts: [st("v", "", [2, 3, 5, 7])], help: [{ text: "These are the primes." }, { text: "Answer: **2, 3, 5, 7**." }] },
          { id: "q15b", prompt: "List the numbers from 1 to 10 with an even number of factors, but more than two.", parts: [st("v", "", [6, 8, 10])], help: [{ text: "6, 8 and 10 each have 4 factors." }, { text: "Answer: **6, 8, 10**." }] },
          { id: "q15c", prompt: "List the numbers from 1 to 10 which have an odd number of factors.", parts: [st("v", "", [1, 4, 9])], help: [{ text: "1 has 1 factor, 4 has 3 and 9 has 3." }, { text: "Answer: **1, 4, 9**." }] },
          { id: "q15d", prompt: "List the square numbers in the chart.", parts: [st("v", "", [1, 4, 9])], help: [{ text: "1 = 1², 4 = 2², 9 = 3²." }, { text: "Answer: **1, 4, 9**." }] },
          { id: "q15e", prompt: "What do you notice about the factors of a square number?", parts: [ch("v", "", ["A square number has an odd number of factors", "A square number has exactly two factors", "A square number has an even number of factors"], "A square number has an odd number of factors")],
            help: [{ text: "Compare (c) and (d): they are the same numbers." }, { text: "Answer: **a square number has an odd number of factors**." }] }
        ] }
    ]
  });
})();
