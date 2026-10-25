/*
  Exercise 3.1: Factors, multiples, primes, composites and divisibility tests.
  Source: Vedanta Excel in Mathematics, Book 6, pages 42-44.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var NT = Practice.nt;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function st(id, label, arr) { return { id: id, label: label, type: "set", answer: arr.map(String) }; }
  function pf(id, label, n) { return { id: id, label: label, type: "factors", answer: n }; }
  function S(a) { return "{" + a.join(", ") + "}"; }
  var TF = ["True", "False"];
  function tf(id, stmt, t, why) {
    return { id: id, prompt: stmt, parts: [ch("v", "", TF, t ? "True" : "False")], help: [{ text: why }, { text: "Answer: **" + (t ? "True" : "False") + "**." }] };
  }
  function blank(id, prompt, options, answer, why) {
    return { id: id, prompt: prompt, parts: [ch("v", "", options, answer)], help: [{ text: why }, { text: "Answer: **" + answer + "**." }] };
  }
  var LIST = "Type the numbers with commas, in any order.";

  // Q3 divisibility table
  var NUMS = [48, 65, 80, 96, 54, 90, 75, 84, 60, 105, 120, 144, 128, 152, 180, 198];
  var RULE = { 2: "the ones digit is 0, 2, 4, 6 or 8", 3: "the sum of the digits is a multiple of 3", 4: "the last two digits make a multiple of 4", 5: "the ones digit is 0 or 5",
    6: "it passes the tests for both 2 and 3", 8: "the last three digits make a multiple of 8", 9: "the sum of the digits is a multiple of 9", 10: "the ones digit is 0" };
  function divRow(d) {
    var ans = NUMS.filter(function (n) { return n % d === 0; });
    return { id: "q3d" + d, prompt: "Which of these numbers are exactly divisible by **" + d + "**? " + NUMS.join(", "), parts: [st("v", "", ans)],
      help: [{ text: "A number is divisible by " + d + " if " + RULE[d] + "." }, { text: "Check each number. Take your time and tick them one by one." }, { text: "Answer: **" + ans.join(", ") + "**." }] };
  }
  function test(id, n, d) {
    var yes = n % d === 0, s = String(n), how;
    if (d === 7) {
      var m = n, st7 = [];
      while (m >= 70) { var rest = Math.floor(m / 10), one = m % 10, nx = Math.abs(rest - 2 * one); st7.push(rest + " − 2 × " + one + " = " + nx); m = nx; }
      how = st7.join(", then ") + ". " + m + (m % 7 === 0 ? " is a multiple of 7." : " is not a multiple of 7.");
    }
    else { var odd = 0, even = 0; s.split("").reverse().forEach(function (c, i) { if (i % 2) even += +c; else odd += +c; }); how = "Sum of alternate digits from the right: " + odd + " and " + even + ". Difference: " + Math.abs(odd - even) + "."; }
    return { id: id, prompt: "Is **" + n + "** exactly divisible by " + d + "?", parts: [ch("v", "", ["Yes", "No"], yes ? "Yes" : "No")],
      help: [{ text: d === 7 ? "Test for 7: subtract twice the ones digit from the rest of the number. If the result is 0 or a multiple of 7, so is the number." : "Test for 11: find the difference between the sums of alternate digits. If it is 0 or a multiple of 11, the number is divisible by 11." },
             { text: how }, { text: "Answer: **" + (yes ? "Yes" : "No") + "** (" + n + " ÷ " + d + (yes ? " = " + n / d : " leaves a remainder") + ")." }] };
  }
  function pair(id, a, b) {
    var fa = NT.factors(a), fb = NT.factors(b), c = fa.filter(function (x) { return fb.indexOf(x) >= 0; }), h = NT.hcf(a, b);
    return { id: id, prompt: "**" + a + " and " + b + "**", parts: [st("a", "Factors of " + a, fa), st("b", "Factors of " + b, fb), st("c", "Common factors", c), nm("h", "Highest common factor", h)],
      help: [{ text: "Find factor pairs. For " + a + ": " + fa.filter(function (x) { return x * x <= a; }).map(function (x) { return x + " × " + a / x; }).join(", ") + "." },
             { text: "Factors of " + a + " = " + S(fa) + ", factors of " + b + " = " + S(fb) + "." }, { text: "Common factors: " + S(c) + "." }, { text: "Answer: HCF = **" + h + "**." }] };
  }
  function mult(id, a, b) {
    var ma = NT.multiples(a, 10), mb = NT.multiples(b, 10), c = ma.filter(function (x) { return mb.indexOf(x) >= 0; }), l = NT.lcm(a, b);
    return { id: id, prompt: "**" + a + " and " + b + "**", parts: [st("a", "First ten multiples of " + a, ma), st("b", "First ten multiples of " + b, mb), st("c", "Common multiples", c), nm("l", "Lowest common multiple", l)],
      help: [{ text: "Multiples of " + a + ": " + a + " × 1, " + a + " × 2, … up to " + a + " × 10." }, { text: "Multiples of " + a + " = " + S(ma) + ". Multiples of " + b + " = " + S(mb) + "." },
             { text: "Common: " + S(c) + "." }, { text: "Answer: LCM = **" + l + "**." }] };
  }
  function fact(id, n, how) {
    var p = NT.pf(n), steps = [], m = n;
    if (how === "tree") { p.slice(0, -1).forEach(function (q) { steps.push({ text: m + " = " + q + " × " + m / q }); m /= q; }); }
    else { p.forEach(function (q) { steps.push({ text: q + " | " + m + " → " + m / q }); m /= q; }); }
    return { id: id, prompt: "Factorise **" + n + "** by the " + (how === "tree" ? "factor-tree" : "division") + " method.", parts: [pf("v", n + " =", n)],
      help: [{ text: how === "tree" ? "Split the number into two factors, then keep splitting until every branch ends in a prime." : "Divide by the smallest prime that goes exactly. Keep dividing until you reach 1." }]
        .concat(steps).concat([{ text: "Answer: " + n + " = **" + NT.pfStr(n) + "** = " + NT.pfPow(n) + "." }]) };
  }
  function digit11(id, shown, full) {
    var d = +full.charAt(shown.indexOf("_"));
    return { id: id, prompt: "Find the digit in the blank so that **" + shown.replace("_", " ☐ ") + "** is divisible by 11.", parts: [nm("v", "☐ =", d)],
      help: [{ text: "Use the test for 11: the sums of alternate digits must differ by 0 or 11." }, { text: "Try each digit 0 to 9 in the blank." }, { text: "Answer: **" + d + "** (" + full + " ÷ 11 = " + (+full / 11) + ")." }] };
  }
  function common(id, a, b, isH) {
    var pa = NT.pf(a), pb = NT.pf(b).slice(), com = [];
    pa.forEach(function (x) { var i = pb.indexOf(x); if (i >= 0) { com.push(x); pb.splice(i, 1); } });
    var rest = NT.pf(a).slice(); com.forEach(function (x) { rest.splice(rest.indexOf(x), 1); });
    var restAll = rest.concat(pb), h = NT.hcf(a, b), l = NT.lcm(a, b);
    return isH
      ? { id: id, prompt: "**" + a + " and " + b + "**: find the product of their common prime factors. Does it divide both numbers exactly?",
          parts: [pf("a", a + " =", a), pf("b", b + " =", b), nm("p", "Product of common factors", h), ch("t", "Divides both exactly?", ["Yes", "No"], "Yes")],
          help: [{ text: a + " = " + NT.pfStr(a) + " and " + b + " = " + NT.pfStr(b) + "." }, { text: "Common prime factors: " + com.join(" × ") + " = " + h + "." },
                 { text: a + " ÷ " + h + " = " + a / h + " and " + b + " ÷ " + h + " = " + b / h + ". Both exact." }, { text: "Answer: **" + h + "**, **Yes**. (This is their HCF.)" }] }
      : { id: id, prompt: "**" + a + " and " + b + "**: find the product of the common factors and the rest factors. Is it exactly divisible by both numbers?",
          parts: [pf("a", a + " =", a), pf("b", b + " =", b), nm("p", "Product", l), ch("t", "Divisible by both?", ["Yes", "No"], "Yes")],
          help: [{ text: a + " = " + NT.pfStr(a) + " and " + b + " = " + NT.pfStr(b) + "." }, { text: "Common factors: " + (com.join(" × ") || "none") + ". Rest factors: " + restAll.join(" × ") + "." },
                 { text: "Product: " + com.concat(restAll).join(" × ") + " = " + l + "." }, { text: l + " ÷ " + a + " = " + l / a + " and " + l + " ÷ " + b + " = " + l / b + "." }, { text: "Answer: **" + l + "**, **Yes**. (This is their LCM.)" }] };
  }

  Practice.register({
    id: "math-properties-g6-ex3-1",
    subject: "Mathematics",
    unit: "Properties of Whole Numbers",
    title: "Exercise 3.1",
    topic: "Factors, multiples and divisibility",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 42–44",

    reference: {
      title: "Divisibility tests",
      columns: ["Divisible by", "When"],
      rows: [
        ["2", "ones digit 0, 2, 4, 6 or 8"], ["3", "sum of digits is a multiple of 3"], ["4", "last two digits make a multiple of 4"],
        ["5", "ones digit 0 or 5"], ["6", "divisible by both 2 and 3"], ["7", "rest of number − 2 × ones digit is 0 or a multiple of 7"],
        ["8", "last three digits make a multiple of 8"], ["9", "sum of digits is a multiple of 9"], ["10", "ones digit 0"],
        ["11", "difference of alternate-digit sums is 0 or a multiple of 11"],
        ["Prime / composite", "Prime: exactly 2 factors. Composite: more than 2. 1 is neither."]
      ]
    },

    sections: [
      {
        id: "q1", title: "True or false", instruction: "Write true or false.",
        questions: [
          tf("q1a", "1 is a factor of any number.", true, "Every number ÷ 1 is exact."),
          tf("q1b", "Every number is a factor and a multiple of itself.", true, "n ÷ n = 1 and n × 1 = n."),
          tf("q1c", "All prime numbers are odd numbers.", false, "2 is prime and it is even."),
          tf("q1d", "All even numbers are composite numbers.", false, "2 is even but it is prime."),
          tf("q1e", "All composite numbers are even numbers.", false, "9 and 15 are composite but odd."),
          tf("q1f", "Every prime number has exactly two factors.", true, "A prime has only 1 and itself as factors."),
          tf("q1g", "Every composite number has at least three factors.", true, "For example, 4 has 1, 2 and 4."),
          tf("q1h", "2 is the only even number which is prime.", true, "Every other even number can be divided by 2.")
        ]
      },
      {
        id: "q2", title: "Fill in the blanks", instruction: "Make each sentence true.",
        questions: [
          blank("q2a", "A number is divisible by 10 if it has ☐ in the ones place.", ["0", "5", "1"], "0", "10, 20, 30, … all end in 0."),
          blank("q2b", "Every even number is divisible by ☐.", ["2", "4", "3"], "2", "Even numbers are the multiples of 2."),
          blank("q2c", "A number is divisible by 3 and ☐ if the sum of its digits is divisible by 9.", ["9", "6", "2"], "9", "If the digit sum is a multiple of 9, it is also a multiple of 3."),
          blank("q2d", "A number divisible by both 2 and 3 is also divisible by ☐.", ["6", "5", "8"], "6", "2 × 3 = 6."),
          blank("q2e", "If the difference between the sums of digits at alternate places is 0 or a multiple of 11, the number is divisible by ☐.", ["11", "7", "9"], "11", "This is the test for 11."),
          blank("q2f", "If the difference between twice the ones digit and the number formed by the other digits is divisible by ☐, the number is divisible by 7.", ["7", "2", "11"], "7", "This is the test for 7."),
          blank("q2g", "If the sum of the digits of a number is a ☐ of 3, the number is divisible by 3.", ["multiple", "factor", "prime"], "multiple", "For example, 51: 5 + 1 = 6, a multiple of 3."),
          blank("q2h", "Every multiple of a number is divisible by each of the ☐ of that number.", ["factors", "multiples", "squares"], "factors", "12 is a multiple of 6, and it is divisible by 1, 2, 3 and 6.")
        ]
      },
      {
        id: "q3", title: "Divisibility table", instruction: "The numbers are 48, 65, 80, 96, 54, 90, 75, 84, 60, 105, 120, 144, 128, 152, 180, 198. " + LIST,
        questions: [2, 3, 4, 5, 6, 8, 9, 10].map(divRow)
      },
      {
        id: "q4", title: "Primes, composites, factors, multiples", instruction: LIST,
        questions: [
          { id: "q4a", prompt: "Prime numbers between 1 and 20", parts: [st("v", "", [2, 3, 5, 7, 11, 13, 17, 19])],
            help: [{ text: "A prime has exactly two factors. 1 is not prime." }, { text: "Answer: **2, 3, 5, 7, 11, 13, 17, 19**." }] },
          { id: "q4b", prompt: "Composite numbers between 90 and 100", parts: [st("v", "", [91, 92, 93, 94, 95, 96, 98, 99])],
            help: [{ text: "Check 91 to 99. Only one of them is prime." }, { text: "91 = 7 × 13, so it is composite. 97 is prime." }, { text: "Answer: **91, 92, 93, 94, 95, 96, 98, 99**." }] },
          { id: "q4c", prompt: "Write all the factors, then the prime factors.",
            parts: [st("a", "Factors of 6", [1, 2, 3, 6]), st("ap", "Prime factors of 6", [2, 3]), st("b", "Factors of 9", [1, 3, 9]), st("bp", "Prime factors of 9", [3]),
                    st("c", "Factors of 12", [1, 2, 3, 4, 6, 12]), st("cp", "Prime factors of 12", [2, 3]), st("d", "Factors of 20", [1, 2, 4, 5, 10, 20]), st("dp", "Prime factors of 20", [2, 5])],
            help: [{ text: "Remember the number itself is always a factor." }, { text: "6: {1, 2, 3, 6}. 9: {1, 3, 9}. 12: {1, 2, 3, 4, 6, 12}. 20: {1, 2, 4, 5, 10, 20}." },
                   { text: "Answer: prime factors are **{2, 3}**, **{3}**, **{2, 3}**, **{2, 5}**." }] },
          { id: "q4d", prompt: "Write the first five multiples.", parts: [st("a", "Of 6", NT.multiples(6, 5)), st("b", "Of 9", NT.multiples(9, 5))],
            help: [{ text: "Multiply by 1, 2, 3, 4, 5." }, { text: "Answer: **6, 12, 18, 24, 30** and **9, 18, 27, 36, 45**." }] }
        ]
      },
      {
        id: "q5", title: "Factor trees", instruction: "Fill the empty circles.",
        questions: [
          { id: "q5a", prompt: "Complete the factor tree of 18.", figure: { type: "ftree", root: { v: "18", kids: [{ v: "2" }, { v: "?a", kids: [{ v: "?b" }, { v: "3" }] }] } },
            parts: [nm("a", "a", 9), nm("b", "b", 3)], help: [{ text: "18 = 2 × a, so a = 9." }, { text: "9 = b × 3, so b = 3." }, { text: "Answer: a = **9**, b = **3**. So 18 = 2 × 3 × 3." }] },
          { id: "q5b", prompt: "Complete the factor tree of 20.", figure: { type: "ftree", root: { v: "20", kids: [{ v: "?a" }, { v: "10", kids: [{ v: "?b" }, { v: "?c" }] }] } },
            parts: [nm("a", "a", 2), st("bc", "b and c", [2, 5])], help: [{ text: "20 = a × 10, so a = 2." }, { text: "10 = 2 × 5." }, { text: "Answer: a = **2**, b and c = **2 and 5**. So 20 = 2 × 2 × 5." }] }
        ]
      },
      { id: "q6", title: "Divisible by 7?", instruction: "Use the divisibility test for 7.", questions: [525, 798, 836, 3696, 5706].map(function (n, i) { return test("q6" + "abcde"[i], n, 7); }) },
      { id: "q7", title: "Divisible by 11?", instruction: "Use the divisibility test for 11.", questions: [6358, 2845, 71852, 258995, 999666].map(function (n, i) { return test("q7" + "abcde"[i], n, 11); }) },
      { id: "q8", title: "Common factors", instruction: "List the factors, the common factors and the highest common factor. " + LIST,
        questions: [[8, 12], [12, 18], [16, 24], [28, 42]].map(function (p, i) { return pair("q8" + "abcd"[i], p[0], p[1]); }) },
      { id: "q9", title: "Common multiples", instruction: "List the first ten multiples, the common ones and the lowest common multiple. " + LIST,
        questions: [[6, 8], [6, 9], [8, 12], [10, 15]].map(function (p, i) { return mult("q9" + "abcd"[i], p[0], p[1]); }) },
      { id: "q10", title: "Factor-tree method", instruction: "Write each number as a product of primes, like 2 × 2 × 3.",
        questions: [12, 18, 24, 28, 40, 56].map(function (n, i) { return fact("q10" + "abcdef"[i], n, "tree"); }) },
      { id: "q11", title: "Division method", instruction: "Write each number as a product of primes, like 2 × 2 × 3.",
        questions: [36, 60, 84, 99, 180, 210].map(function (n, i) { return fact("q11" + "abcdef"[i], n, "div"); }) },
      { id: "q12", title: "Missing digit", instruction: "Creative section B.",
        questions: [digit11("q12a", "27_3", "2783"), digit11("q12b", "1_574", "13574"), digit11("q12c", "939_", "9394"), digit11("q12d", "10_57", "10857")] },
      { id: "q13", title: "Product of common factors", instruction: "Factorise both numbers, then multiply the common prime factors.",
        questions: [[8, 12], [18, 24], [20, 30], [36, 48]].map(function (p, i) { return common("q13" + "abcd"[i], p[0], p[1], true); }) },
      { id: "q14", title: "Common and rest factors", instruction: "Factorise both numbers, then multiply the common factors and the rest factors.",
        questions: [[6, 9], [8, 12], [12, 16], [18, 24]].map(function (p, i) { return common("q14" + "abcd"[i], p[0], p[1], false); }) }
    ]
  });
})();
