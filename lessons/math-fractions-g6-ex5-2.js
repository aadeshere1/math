/*
  Exercise 5.2: Proper, improper fractions and mixed numbers; lowest terms; percent as a fraction.
  Source: Vedanta Excel in Mathematics, Book 6, pages 81-83.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var NT = Practice.nt;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function fr(id, label, answer, extra) { var o = { id: id, label: label, type: "frac", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function mx(id, label, answer) { return { id: id, label: label, type: "mixed", answer: answer }; }
  function P(s) { var m = s.split("/"); return [+m[0], +m[1]]; }
  var KIND = ["Proper", "Improper"];

  // improper "23/4" -> mixed "5 3/4"
  function toMixed(f) { var a = P(f); return Math.floor(a[0] / a[1]) + " " + a[0] % a[1] + "/" + a[1]; }

  function imp2mix(id, f) {
    var a = P(f), q = Math.floor(a[0] / a[1]), r = a[0] % a[1], m = toMixed(f);
    return { id: id, prompt: "**" + f + "**", parts: [mx("v", "", m)],
      help: [{ text: "Divide the numerator by the denominator: " + a[0] + " ÷ " + a[1] + ".", ask: nm("q", "Quotient", q) },
             { text: a[1] + " × " + q + " = " + a[1] * q + ", so the remainder is " + a[0] + " − " + a[1] * q + " = " + r + "." },
             { text: "Quotient = whole number, remainder = new numerator, the denominator stays " + a[1] + "." },
             { text: "Answer: **" + m + "**." }] };
  }
  function mix2imp(id, m) {
    var p = m.split(/[ \/]/).map(Number), n = p[0] * p[2] + p[1], f = n + "/" + p[2];
    return { id: id, prompt: "**" + m + "**", parts: [fr("v", "", f, { den: p[2] })],
      help: [{ text: "Multiply the whole number by the denominator: " + p[0] + " × " + p[2] + " = " + p[0] * p[2] + "." },
             { text: "Add the numerator: " + p[0] * p[2] + " + " + p[1] + " = " + n + ". The denominator stays " + p[2] + "." },
             { text: "Answer: **" + f + "**." }] };
  }
  function lowest(id, f) {
    var a = P(f), h = NT.hcf(a[0], a[1]), r = a[0] / h + "/" + a[1] / h;
    return { id: id, prompt: "**" + f + "**", parts: [fr("v", "", r, { lowest: true })],
      help: [{ text: "Find the H.C.F. of " + a[0] + " and " + a[1] + ".", ask: nm("h", "H.C.F.", h) },
             { text: "Divide both by " + h + ": " + a[0] + " ÷ " + h + " = " + a[0] / h + " and " + a[1] + " ÷ " + h + " = " + a[1] / h + "." },
             { text: "Answer: **" + r + "**." }] };
  }
  function pct(id, p) {
    var h = NT.hcf(p, 100), r = p / h + "/" + 100 / h;
    return { id: id, prompt: "**" + p + "%**", parts: [fr("v", "", r, { lowest: true })],
      help: [{ text: "Per cent means out of 100: " + p + "% = " + p + "/100." },
             { text: "H.C.F. of " + p + " and 100 is " + h + ". Divide both by " + h + "." },
             { text: "Answer: **" + r + "**." }] };
  }

  Practice.register({
    id: "math-fractions-g6-ex5-2",
    subject: "Mathematics",
    unit: "Fractions",
    title: "Exercise 5.2",
    topic: "Proper, improper and mixed numbers",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 81–83",

    reference: {
      title: "Kinds of fractions",
      columns: ["Idea", "Example"],
      rows: [
        ["Proper: numerator less than denominator", "3/4, 2/5"],
        ["Improper: numerator greater than (or equal to) denominator", "7/4, 5/3"],
        ["Mixed number: a whole number and a proper fraction", "1 3/4"],
        ["Improper → mixed: divide; quotient is the whole, remainder the numerator", "7/4 = 1 3/4"],
        ["Mixed → improper: whole × denominator + numerator", "2 3/4 = (2 × 4 + 3)/4 = 11/4"],
        ["Lowest terms: divide by the H.C.F.", "18/24 = 3/4 (H.C.F. 6)"],
        ["Per cent is out of 100", "20% = 20/100 = 1/5"],
        ["How to type", "Fraction 3/8. Mixed number: whole, space, fraction, like 2 3/4"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Shaded parts", instruction: "Write the fraction for the shaded parts and say whether it is proper or improper.",
        questions: [
          { id: "q1a", prompt: "Each bar is one whole.", figure: { type: "fbar", parts: 3, count: 2, shade: [[0, 4, "a"]] },
            parts: [fr("f", "Fraction", "4/3", { den: 3 }), ch("k", "Kind", KIND, "Improper")],
            help: [{ text: "Each whole has 3 equal parts, so the denominator is 3." }, { text: "Shaded: 3 parts in the first bar and 1 in the second, 4 in all." },
                   { text: "4 is greater than 3, so it is improper." }, { text: "Answer: **4/3**, **improper**." }] },
          { id: "q1b", prompt: "The bar is one whole.", figure: { type: "fbar", parts: 3, shade: [[0, 2, "a"]] },
            parts: [fr("f", "Fraction", "2/3", { den: 3 }), ch("k", "Kind", KIND, "Proper")],
            help: [{ text: "2 of 3 parts are shaded." }, { text: "2 is less than 3, so it is proper." }, { text: "Answer: **2/3**, **proper**." }] },
          { id: "q1c", prompt: "The circle is one whole.", figure: { type: "pie", parts: 4, shade: [[0, 3, "a"]] },
            parts: [fr("f", "Fraction", "3/4", { den: 4 }), ch("k", "Kind", KIND, "Proper")],
            help: [{ text: "3 of 4 parts are shaded." }, { text: "3 is less than 4, so it is proper. (It is less than one whole circle.)" }, { text: "Answer: **3/4**, **proper**." }] },
          { id: "q1d", prompt: "Each circle is one whole.", figure: { type: "pie", parts: 4, count: 3, shade: [[0, 11, "a"]] },
            parts: [fr("f", "Fraction", "11/4", { den: 4 }), ch("k", "Kind", KIND, "Improper")],
            help: [{ text: "Each circle has 4 quarters. Two full circles = 8 quarters, and 3 more in the last circle." }, { text: "8 + 3 = 11 quarters." },
                   { text: "11 is greater than 4, so it is improper." }, { text: "Answer: **11/4**, **improper**." }] }
        ]
      },
      {
        id: "q2", title: "Improper fraction and mixed number", instruction: "Write the shaded part as an improper fraction and as a mixed number (type it like 1 1/2).",
        questions: [
          { id: "q2a", prompt: "Each bar is one whole.", figure: { type: "fbar", parts: 2, count: 2, shade: [[0, 3, "a"]] },
            parts: [fr("f", "Improper fraction", "3/2", { den: 2 }), mx("m", "Mixed number", "1 1/2")],
            help: [{ text: "Halves: 2 in the first bar and 1 in the second, 3 halves." }, { text: "1 whole bar and 1/2 more." }, { text: "Answer: **3/2 = 1 1/2**." }] },
          { id: "q2b", prompt: "Each bar is one whole.", figure: { type: "fbar", parts: 3, count: 3, shade: [[0, 8, "a"]] },
            parts: [fr("f", "Improper fraction", "8/3", { den: 3 }), mx("m", "Mixed number", "2 2/3")],
            help: [{ text: "Thirds: 3 + 3 + 2 = 8 thirds." }, { text: "2 whole bars and 2/3 more." }, { text: "Answer: **8/3 = 2 2/3**." }] },
          { id: "q2c", prompt: "Each circle is one whole.", figure: { type: "pie", parts: 4, count: 4, shade: [[0, 13, "a"]] },
            parts: [fr("f", "Improper fraction", "13/4", { den: 4 }), mx("m", "Mixed number", "3 1/4")],
            help: [{ text: "Quarters: 4 + 4 + 4 + 1 = 13 quarters." }, { text: "3 whole circles and 1/4 more." }, { text: "Answer: **13/4 = 3 1/4**." }] }
        ]
      },
      {
        id: "q3", title: "Fill in the words", instruction: "Choose the right word.",
        questions: [
          { id: "q3a", prompt: "A fraction with numerator less than the denominator is called a/an ☐ fraction.", parts: [ch("v", "", KIND, "Proper")],
            help: [{ text: "Example: 3/4. It is less than one whole." }, { text: "Answer: **proper**." }] },
          { id: "q3b", prompt: "A fraction whose numerator is greater than the denominator is called a/an ☐ fraction.", parts: [ch("v", "", KIND, "Improper")],
            help: [{ text: "Example: 7/4. It is more than one whole." }, { text: "Answer: **improper**." }] },
          { id: "q3c", prompt: "1/2 is a/an ☐ fraction.", parts: [ch("v", "", KIND, "Proper")],
            help: [{ text: "1 is less than 2." }, { text: "Answer: **proper**." }] },
          { id: "q3d", prompt: "1 2/3 is a ☐ number.", parts: [ch("v", "", ["Whole", "Mixed", "Prime"], "Mixed")],
            help: [{ text: "It has a whole number (1) and a proper fraction (2/3) together." }, { text: "Answer: **mixed**." }] }
        ]
      },
      { id: "q4", title: "Quick: to improper fractions", instruction: "Write each mixed number as an improper fraction, like 7/2.",
        questions: ["3 1/2", "4 2/3", "5 3/4", "10 4/7"].map(function (m, i) { return mix2imp("q4" + "abcd"[i], m); }) },
      {
        id: "q5", title: "Quick: to mixed numbers", instruction: "Write each as a mixed number, like 1 1/2.",
        questions: ["3/2", "7/3", "15/4"].map(function (f, i) { return imp2mix("q5" + "abc"[i], f); }).concat(
          [["e", 1, "1/3"], ["f", 2, "3/4"], ["g", 3, "4/7"]].map(function (r) {
            var m = r[1] + " " + r[2];
            return { id: "q5" + r[0], prompt: "**" + r[1] + " + " + r[2] + "**", parts: [mx("v", "", m)],
              help: [{ text: "A whole number plus a proper fraction is written side by side as a mixed number." }, { text: "Answer: **" + m + "**." }] };
          }))
      },
      { id: "q6", title: "Improper to mixed", instruction: "Creative section. Change into mixed numbers, like 1 3/4.",
        questions: ["7/4", "13/6", "19/5", "32/7", "43/8", "67/10"].map(function (f, i) { return imp2mix("q6" + "abcdef"[i], f); }) },
      { id: "q7", title: "Mixed to improper", instruction: "Change into improper fractions, like 11/4.",
        questions: ["2 3/4", "3 2/7", "4 5/8", "7 4/9", "10 3/8", "6 9/10"].map(function (m, i) { return mix2imp("q7" + "abcdef"[i], m); }) },
      { id: "q8", title: "Lowest terms", instruction: "Reduce to the lowest terms.",
        questions: ["4/6", "10/12", "6/9", "12/16", "18/24", "32/40", "45/54", "20/40", "120/150", "2400/2800", "3600/27000", "4200/63000"]
          .map(function (f, i) { return lowest("q8" + "abcdefghijkl"[i], f); }) },
      { id: "q9", title: "Per cent to fraction", instruction: "Write as a fraction in lowest terms. Example: 20% = 20/100 = 1/5.",
        questions: [10, 15, 25, 40, 60, 75].map(function (p, i) { return pct("q9" + "abcdef"[i], p); }) },
      {
        id: "q10", title: "Sheets and bread", instruction: "Type fractions like 3/2 and mixed numbers like 1 1/2.",
        questions: [
          { id: "q10a", prompt: "Take a rectangular sheet of paper and shade **three-quarters** of it.", figure: { type: "fbar", parts: 4, shade: [[0, 3, "a"]] },
            parts: [fr("i", "(i) As a fraction", "3/4", { den: 4 }), ch("ii", "(ii) Proper or improper?", KIND, "Proper"), ch("iii", "(iii) Can it be changed into a mixed number?", ["Yes", "No"], "No")],
            help: [{ text: "Three-quarters means 3 of 4 equal parts: 3/4." }, { text: "3 is less than 4, so it is proper." },
                   { text: "A proper fraction is less than one whole, so there is no whole number to take out." }, { text: "Answer: **3/4**, **proper**, **no**." }] },
          { id: "q10b", prompt: "Take two sheets of the same size. Fold each sheet into halves and shade **3 parts**.", figure: { type: "fbar", parts: 2, count: 2, shade: [[0, 3, "a"]] },
            parts: [nm("i", "(i) Parts shaded in one sheet", 2), nm("ii", "(ii) Parts shaded in the other sheet", 1), fr("iii", "(iii) Fraction shaded", "3/2", { den: 2 }),
                    ch("iv", "(iv) Proper or improper?", KIND, "Improper"), mx("v", "(v) As a mixed number", "1 1/2")],
            help: [{ text: "One sheet has both halves shaded (2), the other has 1." }, { text: "3 halves: 3/2. 3 > 2, so improper." },
                   { text: "3 ÷ 2 = 1 remainder 1, so 1 1/2." }, { text: "Answer: **2**, **1**, **3/2**, **improper**, **1 1/2**." }] },
          { id: "q10c", prompt: "Master Raju cuts **3 breads** into **four equal slices** each and shares **11 slices** with his friends.", figure: { type: "fbar", parts: 4, count: 3, shade: [[0, 11, "a"]] },
            parts: [nm("i", "(i) How many slices in all?", 12), fr("ii", "(ii) Fraction of bread shared", "11/4", { den: 4 }), ch("iv", "(iv) Proper or improper?", KIND, "Improper"),
                    mx("v", "(v) As a mixed number", "2 3/4"), nm("vi", "(vi) How many whole breads were shared?", 2)],
            help: [{ text: "3 breads × 4 slices = 12 slices." }, { text: "Each slice is 1/4 of a bread, so 11 slices = 11/4. (iii) The picture shows 3 breads with 11 slices shaded." },
                   { text: "11 > 4, so improper. 11 ÷ 4 = 2 remainder 3, so 2 3/4." }, { text: "The whole number part tells the whole breads: 2." },
                   { text: "Answer: **12**, **11/4**, **improper**, **2 3/4**, **2**." }] }
        ]
      }
    ]
  });
})();
