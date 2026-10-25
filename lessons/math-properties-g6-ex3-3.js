/*
  Exercise 3.3: Lowest common multiple (L.C.M.).
  Source: Vedanta Excel in Mathematics, Book 6, pages 52-55.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var NT = Practice.nt;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: unit, mistakes: mistakes }; }
  function st(id, label, arr) { return { id: id, label: label, type: "set", answer: arr.map(String) }; }
  function pf(id, label, n) { return { id: id, label: label, type: "factors", answer: n }; }
  function S(a) { return "{" + a.join(", ") + "}"; }
  var LIST = "Type the numbers with commas, in any order.";

  function quick(id, a, b, tip) {
    var l = NT.lcm(a, b), wrong = [];
    if (a * b !== l) wrong.push({ answer: a * b, say: a + " × " + b + " is a common multiple, but not the lowest. They share a factor." });
    if (a + b !== l) wrong.push({ answer: a + b, say: "L.C.M. is about multiplying, not adding." });
    return { id: id, prompt: "L.C.M. of **" + a + " and " + b + "**", parts: [nm("v", "L.C.M. =", l, null, wrong)], help: [{ text: tip(a, b, l) }, { text: "Answer: **" + l + "**." }] };
  }
  var T1 = function (a, b, l) { return l === b ? b + " is a multiple of " + a + ", so the L.C.M. is " + b + "." : a + " and " + b + " have no common factor except 1, so multiply: " + a + " × " + b + " = " + l + "."; };
  var T2 = function (a, b, l) { var big = Math.max(a, b), small = Math.min(a, b), k = l / big, s = []; for (var i = 1; i <= k; i++) s.push(big + " × " + i + " = " + big * i + (big * i % small === 0 ? " ✓" : "")); return "Count in " + big + "s until you reach a multiple of " + small + ": " + s.join(", ") + "."; };
  function mult10(id, a, b) {
    var ma = NT.multiples(a, 10), mb = NT.multiples(b, 10), c = ma.filter(function (x) { return mb.indexOf(x) >= 0; }), l = NT.lcm(a, b);
    return { id: id, prompt: "**" + a + " and " + b + "**", parts: [st("a", "First ten multiples of " + a, ma), st("b", "First ten multiples of " + b, mb), st("c", "Common multiples", c), nm("l", "L.C.M.", l)],
      help: [{ text: "Multiples of " + a + " = " + S(ma) + "." }, { text: "Multiples of " + b + " = " + S(mb) + "." }, { text: "Common = " + S(c) + "." }, { text: "Answer: L.C.M. = **" + l + "**." }] };
  }
  function byFact(id, list) {
    var l = NT.lcm.apply(null, list), parts = list.map(function (n, i) { return pf("f" + i, n + " =", n); });
    parts.push(nm("l", "L.C.M.", l));
    return { id: id, prompt: "**" + list.join(", ") + "**", parts: parts,
      help: list.map(function (n) { return { text: n + " = " + NT.pfStr(n) }; })
        .concat([{ text: "Take each prime the **most** times it appears in any one number: " + NT.pfStr(l) + "." }, { text: "Answer: L.C.M. = **" + l + "**." }]) };
  }
  function byDiv(id, list) {
    var l = NT.lcm.apply(null, list), cur = list.slice(), steps = [], divs = [];
    for (;;) {
      var p = null, top = Math.max.apply(null, cur);
      for (var q = 2; q <= top; q++) if (NT.isPrime(q) && cur.filter(function (n) { return n % q === 0; }).length >= 2) { p = q; break; }
      if (!p) break;
      var nx = cur.map(function (n) { return n % p === 0 ? n / p : n; });
      steps.push({ text: p + " | " + cur.join(", ") + " → " + nx.join(", ") }); divs.push(p); cur = nx;
    }
    var left = cur.filter(function (n) { return n > 1; });
    return { id: id, prompt: "**" + list.join(", ") + "**", parts: [nm("l", "L.C.M.", l)],
      help: [{ text: "Divide by a prime that goes into at least two of the numbers. Bring down any number it does not divide." }].concat(steps)
        .concat([{ text: "Multiply the divisors and what is left: " + divs.concat(left).join(" × ") + " = " + l + "." }, { text: "Answer: L.C.M. = **" + l + "**." }]) };
  }
  function word(id, prompt, a, b, unit, extra) {
    var l = NT.lcm(a, b);
    return { id: id, prompt: prompt, parts: extra ? extra.parts(l) : [nm("v", "", l, unit)],
      help: [{ text: "The answer must be a multiple of both " + a + " and " + b + ", and the smallest one: the L.C.M." }, { text: T2(a, b, l) }]
        .concat(extra ? extra.help(l) : [{ text: "Answer: **" + l + " " + unit + "**." }]) };
  }

  Practice.register({
    id: "math-properties-g6-ex3-3",
    subject: "Mathematics",
    unit: "Properties of Whole Numbers",
    title: "Exercise 3.3",
    topic: "Lowest common multiple (L.C.M.)",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 52–55",

    reference: {
      title: "L.C.M.",
      columns: ["Idea", "Example"],
      rows: [
        ["L.C.M. is the smallest number that all of them divide", "L.C.M. of 4 and 6 is 12"],
        ["No common factor: multiply", "L.C.M. of 4 and 5 = 20"],
        ["One is a multiple of the other: take the bigger", "L.C.M. of 6 and 12 = 12"],
        ["Trick: count in the bigger number", "10 and 15: 15, 30 ✓ so 30"],
        ["H.C.F. × L.C.M. = product of the two numbers", "8 and 10: 2 × 40 = 80 = 8 × 10"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick L.C.M.", instruction: "Primes multiply; if one divides the other, take the bigger.",
        questions: [[3, 5], [5, 7], [3, 11], [7, 11], [3, 4], [5, 6], [4, 5], [7, 8], [6, 18], [7, 28], [8, 40], [9, 45]].map(function (p, i) { return quick("q1" + "abcdefghijkl"[i], p[0], p[1], T1); }) },
      { id: "q2", title: "More quick L.C.M.", instruction: "No common prime factor: multiply. Otherwise count in the bigger number.",
        questions: [[4, 9], [8, 9], [4, 15], [9, 16], [10, 21], [10, 27]].map(function (p, i) { return quick("q2a" + "abcdef"[i], p[0], p[1], T1); })
          .concat([[6, 9], [4, 10], [6, 8], [8, 12], [12, 18], [15, 20]].map(function (p, i) { return quick("q2b" + "abcdef"[i], p[0], p[1], T2); })) },
      { id: "q3", title: "True or false", instruction: "Try an example to check.",
        questions: [
          { id: "q3a", prompt: "L.C.M. of any two prime numbers is their product.", parts: [ch("v", "", ["True", "False"], "True")], help: [{ text: "Example: 3 and 5 → 15 = 3 × 5." }, { text: "Answer: **True**." }] },
          { id: "q3b", prompt: "L.C.M. of a prime number and a composite number is always a prime number.", parts: [ch("v", "", ["True", "False"], "False")], help: [{ text: "Example: 3 and 4 → 12, which is not prime." }, { text: "Answer: **False**." }] },
          { id: "q3c", prompt: "L.C.M. of an odd and an even number is always an even number.", parts: [ch("v", "", ["True", "False"], "True")], help: [{ text: "The L.C.M. is a multiple of the even number, so it is even." }, { text: "Answer: **True**." }] },
          { id: "q3d", prompt: "L.C.M. of the first prime number and the second composite number is 6.", parts: [ch("v", "", ["True", "False"], "True")], help: [{ text: "First prime: 2. Composites: 4, 6, … so the second is 6." }, { text: "L.C.M. of 2 and 6 = 6." }, { text: "Answer: **True**." }] }
        ] },
      { id: "q4", title: "Multiples", instruction: "Write the first ten multiples of each, then find the L.C.M. " + LIST,
        questions: [[2, 3], [3, 4], [4, 6], [6, 8], [6, 9], [8, 10], [10, 12], [15, 20]].map(function (p, i) { return mult10("q4" + "abcdefgh"[i], p[0], p[1]); }) },
      { id: "q5", title: "Factorisation method", instruction: "Write each number as a product of primes (like 2 × 2 × 3), then find the L.C.M.",
        questions: [[6, 8], [10, 15], [12, 18], [20, 30], [21, 28], [36, 48], [45, 60], [54, 90], [14, 21, 28], [18, 24, 36], [20, 30, 40], [36, 72, 90]]
          .map(function (l, i) { return byFact("q5" + "abcdefghijkl"[i], l); }) },
      { id: "q6", title: "Division method", instruction: "Divide by primes, then multiply the divisors and what is left.",
        questions: [[9, 12], [12, 15], [18, 24], [30, 45], [12, 15, 20], [20, 30, 40], [25, 30, 75], [20, 36, 45]].map(function (l, i) { return byDiv("q6" + "abcdefgh"[i], l); }) },
      { id: "q7", title: "Common multiples", instruction: LIST, questions: [mult10("q7a", 6, 8), mult10("q7b", 10, 15)] },
      { id: "q8", title: "Rulers and mugs", instruction: "Creative section B.",
        questions: [
          { id: "q8a", prompt: "Two rulers are **15 cm** and **30 cm** long. Which rope lengths can be measured exactly by both?",
            parts: [st("i", "(i) First ten lengths for the 15 cm ruler", NT.multiples(15, 10)), st("ii", "(ii) First ten for the 30 cm ruler", NT.multiples(30, 10)),
                    st("iii", "(iii) Common lengths up to 150", [30, 60, 90, 120, 150]), nm("iv", "(iv) Shortest length", 30, "cm")],
            help: [{ text: "15, 30, 45, … and 30, 60, 90, …" }, { text: "Common up to 150: 30, 60, 90, 120, 150." }, { text: "Answer: shortest **30 cm**." }] },
          { id: "q8b", prompt: "Mug A holds **50 ml** and mug B holds **100 ml**. Which vessels can be filled exactly by both?",
            parts: [st("i", "(i) Ten capacities for mug A", NT.multiples(50, 10)), st("ii", "(ii) Ten capacities for mug B", NT.multiples(100, 10)),
                    st("iii", "(iii) Common capacities up to 500", [100, 200, 300, 400, 500]), nm("iv", "(iv) Least capacity", 100, "ml")],
            help: [{ text: "50, 100, 150, … and 100, 200, 300, …" }, { text: "Common up to 500: 100, 200, 300, 400, 500." }, { text: "Answer: least **100 ml**." }] }
        ] },
      { id: "q9", title: "Word problems", instruction: "Find the L.C.M.",
        questions: [
          word("q9a", "Two measuring tapes are **20 m** and **30 m** long. Find the shortest length that can be measured exactly by either tape.", 20, 30, "m"),
          word("q9b", "A book costs **Rs 60** and a copy costs **Rs 45**. Find the smallest amount that buys an exact number of books or of copies.", 60, 45, "rupees"),
          word("q9c", "A red light flickers every **4 seconds** and a blue light every **6 seconds**. They start together. After how long do they flicker together again?", 4, 6, "seconds"),
          word("q9d", "Two bells ring every **30** and **40 minutes**. They ring together at **9:00 a.m.**", 30, 40, "", {
            parts: function (l) { return [nm("m", "After how many minutes?", l, "min"), ch("t", "At what time?", ["10:00 a.m.", "10:10 a.m.", "11:00 a.m.", "12:00 noon"], "11:00 a.m.")]; },
            help: function (l) { return [{ text: "120 minutes = 2 hours. 9:00 a.m. + 2 hours = 11:00 a.m." }, { text: "Answer: **120 minutes**, at **11:00 a.m.**" }]; } }),
          word("q9e", "Two TV movies start at **8 p.m.** One channel has breaks every **12 minutes**, the other every **15 minutes**.", 12, 15, "", {
            parts: function (l) { return [nm("m", "After how many minutes?", l, "min"), ch("t", "At what time do both start breaks together?", ["8:27 p.m.", "8:30 p.m.", "9:00 p.m.", "11:00 p.m."], "9:00 p.m.")]; },
            help: function (l) { return [{ text: "60 minutes after 8 p.m. is 9 p.m." }, { text: "Answer: **60 minutes**, at **9:00 p.m.**" }]; } })
        ] },
      { id: "q10", title: "H.C.F. × L.C.M.", instruction: "For two numbers, H.C.F. × L.C.M. = the product of the numbers.",
        questions: [
          { id: "q10a", prompt: "**8 and 10**", parts: [nm("h", "(i) H.C.F.", 2), nm("l", "L.C.M.", 40), nm("p", "(ii) H.C.F. × L.C.M.", 80), nm("q", "(iii) 8 × 10", 80)],
            help: [{ text: "8 = 2 × 2 × 2 and 10 = 2 × 5. H.C.F. = 2, L.C.M. = 2 × 2 × 2 × 5 = 40." }, { text: "2 × 40 = 80 and 8 × 10 = 80. They are equal." }, { text: "Answer: **2**, **40**, **80**, **80**." }] },
          { id: "q10b", prompt: "**12 and 20**: show that their product equals H.C.F. × L.C.M.", parts: [nm("h", "H.C.F.", 4), nm("l", "L.C.M.", 60), nm("p", "H.C.F. × L.C.M.", 240), nm("q", "12 × 20", 240)],
            help: [{ text: "12 = 2 × 2 × 3 and 20 = 2 × 2 × 5. H.C.F. = 4, L.C.M. = 60." }, { text: "4 × 60 = 240 and 12 × 20 = 240." }, { text: "Answer: **4**, **60**, **240**, **240**." }] },
          { id: "q10c", prompt: "The H.C.F. of two numbers is **6** and their L.C.M. is **36**. One number is **12**. Find the other.", parts: [nm("v", "Other number", 18)],
            help: [{ text: "12 × other = 6 × 36 = 216." }, { text: "Other = 216 ÷ 12." }, { text: "Answer: **18**." }] },
          { id: "q10d", prompt: "The H.C.F. and L.C.M. of two numbers are **4** and **48**. One number is **16**. Find the other.", parts: [nm("v", "Other number", 12)],
            help: [{ text: "16 × other = 4 × 48 = 192." }, { text: "Other = 192 ÷ 16." }, { text: "Answer: **12**." }] }
        ] }
    ]
  });
})();
