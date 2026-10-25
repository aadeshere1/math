/*
  Exercise 3.2: Highest common factor (H.C.F.).
  Source: Vedanta Excel in Mathematics, Book 6, pages 47-49.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var NT = Practice.nt;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit) { return { id: id, label: label, type: "number", answer: answer, unit: unit }; }
  function st(id, label, arr) { return { id: id, label: label, type: "set", answer: arr.map(String) }; }
  function pf(id, label, n) { return { id: id, label: label, type: "factors", answer: n }; }
  function S(a) { return "{" + a.join(", ") + "}"; }
  function common(list) { return NT.factors(list[0]).filter(function (f) { return list.every(function (n) { return n % f === 0; }); }); }
  var LIST = "Type the numbers with commas, in any order.";

  function quick(id, a, b, tip) {
    var h = NT.hcf(a, b);
    return { id: id, prompt: "H.C.F. of **" + a + " and " + b + "**", parts: [nm("v", "H.C.F. =", h)],
      help: [{ text: tip }, { text: "Answer: **" + h + "**." }] };
  }
  function small(id, a, b) {
    var h = NT.hcf(a, b), fs = NT.factors(a).reverse();
    var tried = fs.slice(0, fs.indexOf(h) + 1).map(function (f) { return f + (b % f === 0 ? " divides " + b + " ✓" : " does not divide " + b); });
    return quick(id, a, b, "Try the factors of the smaller number " + a + ", biggest first: " + tried.join("; ") + ".");
  }
  function listH(id, a, b) {
    var fa = NT.factors(a), fb = NT.factors(b), c = common([a, b]), h = NT.hcf(a, b);
    return { id: id, prompt: "**" + a + " and " + b + "**", parts: [st("a", "Factors of " + a, fa), st("b", "Factors of " + b, fb), st("c", "Common factors", c), nm("h", "H.C.F.", h)],
      help: [{ text: "Factors of " + a + " = " + S(fa) + "." }, { text: "Factors of " + b + " = " + S(fb) + "." }, { text: "Common factors = " + S(c) + "." }, { text: "Answer: H.C.F. = **" + h + "**." }] };
  }
  function byFact(id, list) {
    var h = NT.hcf.apply(null, list), parts = list.map(function (n, i) { return pf("f" + i, n + " =", n); });
    parts.push(nm("h", "H.C.F.", h));
    return { id: id, prompt: "**" + list.join(", ") + "**", parts: parts,
      help: list.map(function (n) { return { text: n + " = " + NT.pfStr(n) }; })
        .concat([{ text: "Take the prime factors that are in **every** number: " + (h === 1 ? "none, so the H.C.F. is 1" : NT.pfStr(h)) + "." }, { text: "Answer: H.C.F. = **" + h + "**." }]) };
  }
  function byDiv(id, list) {
    var h = NT.hcf.apply(null, list), steps = [], cur = list.slice();
    NT.pf(h).forEach(function (p) { var nx = cur.map(function (n) { return n / p; }); steps.push({ text: p + " | " + cur.join(", ") + " → " + nx.join(", ") }); cur = nx; });
    return { id: id, prompt: "**" + list.join(", ") + "**", parts: [nm("h", "H.C.F.", h)],
      help: [{ text: "Divide all the numbers by a prime that goes into every one of them. Stop when no prime divides them all." }].concat(steps)
        .concat([{ text: "Multiply the divisors: " + (NT.pf(h).join(" × ") || "1") + " = " + h + "." }, { text: "Answer: H.C.F. = **" + h + "**." }]) };
  }
  function share(id, prompt, a, b, things, labels) {
    var fa = NT.factors(a), fb = NT.factors(b), c = common([a, b]), h = NT.hcf(a, b);
    return { id: id, prompt: prompt,
      parts: [st("i", "(i) Possible numbers for the " + things[0], fa), st("ii", "(ii) Possible numbers for the " + things[1], fb), st("iii", "(iii) Possible numbers for both", c),
              nm("iv", "(iv) Greatest number", h), nm("v1", "(v) " + labels[0] + " each", a / h), nm("v2", labels[1] + " each", b / h)],
      help: [{ text: "Sharing equally means the number of " + labels[2] + " must be a factor." }, { text: "Factors of " + a + " = " + S(fa) + ". Factors of " + b + " = " + S(fb) + "." },
             { text: "Common factors = " + S(c) + ". The greatest is " + h + "." }, { text: a + " ÷ " + h + " = " + a / h + " and " + b + " ÷ " + h + " = " + b / h + "." },
             { text: "Answer: **" + h + "** " + labels[2] + "; each gets **" + a / h + "** " + things[0] + " and **" + b / h + "** " + things[1] + "." }] };
  }

  Practice.register({
    id: "math-properties-g6-ex3-2",
    subject: "Mathematics",
    unit: "Properties of Whole Numbers",
    title: "Exercise 3.2",
    topic: "Highest common factor (H.C.F.)",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 47–49",

    reference: {
      title: "H.C.F.",
      columns: ["Idea", "Example"],
      rows: [
        ["H.C.F. is the biggest number that divides all of them", "H.C.F. of 12 and 18 is 6"],
        ["If one number divides the other, it is the H.C.F.", "H.C.F. of 5 and 15 is 5"],
        ["Quick trick: try factors of the smaller number, biggest first", "12 and 28: 6 ✗, 4 ✓ so 4"],
        ["Factorisation method", "12 = 2 × 2 × 3, 18 = 2 × 3 × 3, common 2 × 3 = 6"],
        ["Division method", "Divide all by common primes; multiply the divisors"]
      ]
    },

    sections: [
      { id: "q1", title: "One divides the other", instruction: "2 is a factor of 4, so the H.C.F. of 2 and 4 is 2. Say the answer quickly.",
        questions: [[4, 8], [6, 18], [7, 35], [9, 54], [11, 66], [15, 60]].map(function (p, i) { return quick("q1" + "abcdef"[i], p[0], p[1], p[0] + " divides " + p[1] + " exactly, so the H.C.F. is the smaller number."); }) },
      { id: "q2", title: "Smaller number trick", instruction: "Try the factors of the smaller number, biggest first.",
        questions: [[4, 6], [6, 8], [9, 12], [10, 25], [12, 18], [24, 32]].map(function (p, i) { return small("q2" + "abcdef"[i], p[0], p[1]); }) },
      { id: "q3", title: "Fill in the blanks", instruction: "Try a few examples to check.",
        questions: [
          { id: "q3a", prompt: "H.C.F. of two consecutive numbers is ☐ (like 7 and 8).", parts: [nm("v", "", 1)], help: [{ text: "7 and 8 share only the factor 1." }, { text: "Answer: **1**." }] },
          { id: "q3b", prompt: "H.C.F. of two consecutive even numbers is ☐ (like 6 and 8).", parts: [nm("v", "", 2)], help: [{ text: "Both are even, so 2 divides both. 6 and 8: H.C.F. 2." }, { text: "Answer: **2**." }] },
          { id: "q3c", prompt: "H.C.F. of two consecutive odd numbers is ☐ (like 7 and 9).", parts: [nm("v", "", 1)], help: [{ text: "7 and 9 share only 1." }, { text: "Answer: **1**." }] },
          { id: "q3d", prompt: "H.C.F. of two consecutive prime numbers is ☐ (like 5 and 7).", parts: [nm("v", "", 1, null)], help: [{ text: "Different primes share no factor except 1. Even 2 and 3 have H.C.F. 1." }, { text: "Answer: **1**." }] }
        ] },
      { id: "q4", title: "Factors and H.C.F.", instruction: LIST, questions: [listH("q4a", 8, 12), listH("q4b", 21, 28)] },
      { id: "q5", title: "List the factors", instruction: "Write all the factors of each pair, then find the H.C.F. " + LIST,
        questions: [[6, 8], [12, 16], [18, 24], [27, 36], [30, 40], [32, 40], [36, 48], [42, 56]].map(function (p, i) { return listH("q5" + "abcdefgh"[i], p[0], p[1]); }) },
      { id: "q6", title: "Factorisation method", instruction: "Write each number as a product of primes (like 2 × 2 × 3), then find the H.C.F.",
        questions: [[6, 9], [10, 15], [12, 18], [21, 35], [28, 42], [45, 60], [50, 75], [72, 96], [30, 45, 60], [48, 72, 96], [84, 126, 189], [105, 140, 245]]
          .map(function (l, i) { return byFact("q6" + "abcdefghijkl"[i], l); }) },
      { id: "q7", title: "Division method", instruction: "Divide by common primes, then multiply the divisors.",
        questions: [[18, 24], [28, 35], [42, 70], [48, 72], [60, 90], [72, 108], [96, 144, 192], [100, 150, 200]].map(function (l, i) { return byDiv("q7" + "abcdefgh"[i], l); }) },
      { id: "q8", title: "Two numbers", instruction: "Creative section B. " + LIST,
        questions: [
          { id: "q8a", prompt: "Two numbers are **36 and 60**.", parts: [st("a", "(i) Factors of 36", NT.factors(36)), st("b", "Factors of 60", NT.factors(60)), st("c", "(ii) Common factors", common([36, 60])), nm("h", "(iii) Greatest one", 12)],
            help: [{ text: "36: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6." }, { text: "60: 1 × 60, 2 × 30, 3 × 20, 4 × 15, 5 × 12, 6 × 10." }, { text: "Common: {1, 2, 3, 4, 6, 12}." }, { text: "Answer: **12**." }] },
          { id: "q8b", prompt: "Two numbers are **54 and 90**.", parts: [pf("a", "(i) 54 =", 54), pf("b", "90 =", 90), nm("p", "(ii) Product of common prime factors", 18), ch("c", "(iii) Is it the H.C.F.?", ["Yes", "No"], "Yes")],
            help: [{ text: "54 = 2 × 3 × 3 × 3 and 90 = 2 × 3 × 3 × 5." }, { text: "Common: 2 × 3 × 3 = 18." }, { text: "18 is the biggest number that divides both, so it is the H.C.F." }, { text: "Answer: **18**, **Yes**." }] }
        ] },
      { id: "q9", title: "Sharing problems", instruction: LIST,
        questions: [
          share("q9a", "Bishwant distributed **24 snickers** and **36 cadburies** equally among his friends.", 24, 36, ["snickers", "cadburies"], ["Snickers", "Cadburies", "friends"]),
          share("q9b", "An organisation distributed **30 sweaters** and **45 trousers** equally among some children.", 30, 45, ["sweaters", "trousers"], ["Sweaters", "Trousers", "children"]),
          { id: "q9c", prompt: "One container holds **40 l** of milk and another holds **60 l**.", parts: [pf("a", "(i) 40 =", 40), pf("b", "60 =", 60), nm("h", "(ii) H.C.F.", 20), nm("j", "(iii) Biggest jar", 20, "l")],
            help: [{ text: "40 = 2 × 2 × 2 × 5 and 60 = 2 × 2 × 3 × 5." }, { text: "Common: 2 × 2 × 5 = 20." }, { text: "A 20 l jar measures 40 l in 2 goes and 60 l in 3 goes." }, { text: "Answer: **20 l**." }] },
          { id: "q9d", prompt: "A courtyard is **18 m long and 15 m wide**. It is paved with equal square stones. What is the length of the greatest stone?", parts: [nm("v", "", 3, "m")],
            help: [{ text: "The side must divide both 18 and 15 exactly." }, { text: "H.C.F. of 18 and 15 = 3." }, { text: "Answer: **3 m**." }] }
        ] }
    ]
  });
})();
