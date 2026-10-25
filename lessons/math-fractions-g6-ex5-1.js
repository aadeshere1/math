/*
  Exercise 5.1: Equivalent fractions, like and unlike fractions, comparing and ordering.
  Source: Vedanta Excel in Mathematics, Book 6, pages 76-79.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var NT = Practice.nt;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function fr(id, label, answer, extra) { var o = { id: id, label: label, type: "frac", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function P(s) { var m = s.split("/"); return [+m[0], +m[1]]; }
  function rot(id, opts) { var k = id.charCodeAt(id.length - 1) % opts.length; return opts.slice(k).concat(opts.slice(0, k)); }
  var LIKE = ["Like", "Unlike"];

  function equivMul(id, f) {
    var a = P(f), ex = [2, 3, 4].map(function (k) { return a[0] * k + "/" + a[1] * k; });
    return { id: id, prompt: "**" + f + "**", parts: [{ id: "v", label: "", type: "equiv", answer: f, count: 3, mode: "mul", example: ex.join(", ") }],
      help: [{ text: "Multiply the numerator and denominator by the same number: 2, then 3, then 4." },
             { text: a[0] + " × 2 / " + a[1] + " × 2 = " + ex[0] + "." }, { text: "Answer: **" + ex.join(", ") + "**." }] };
  }
  function equivDiv(id, f) {
    var a = P(f), cf = NT.factors(NT.hcf(a[0], a[1])).filter(function (x) { return x > 1; });
    var ex = cf.map(function (k) { return a[0] / k + "/" + a[1] / k; }).slice(0, 3);
    return { id: id, prompt: "**" + f + "**", parts: [{ id: "v", label: "", type: "equiv", answer: f, count: 3, mode: "div", example: ex.join(", ") }],
      help: [{ text: "Divide the numerator and denominator by a common factor. Common factors of " + a[0] + " and " + a[1] + ": " + cf.join(", ") + "." },
             { text: cf.slice(0, 3).map(function (k) { return a[0] + " ÷ " + k + " / " + a[1] + " ÷ " + k + " = " + a[0] / k + "/" + a[1] / k; }).join("; ") + "." },
             { text: "Answer: **" + ex.join(", ") + "**. (Other correct sets are accepted too.)" }] };
  }
  function cmp(id, f, g) {
    var a = P(f), b = P(g), l = NT.lcm(a[1], b[1]), x = a[0] * l / a[1], y = b[0] * l / b[1], ans = x > y ? ">" : "<";
    var tip = a[1] === b[1] ? "Same denominators: compare the numerators " + a[0] + " and " + b[0] + "."
      : a[0] === b[0] ? "Same numerators: the smaller denominator gives bigger pieces."
      : "Make the denominators the same (" + l + "): " + f + " = " + x + "/" + l + " and " + g + " = " + y + "/" + l + ".";
    return { id: id, prompt: f + " ☐ " + g, parts: [ch("v", "", ["<", ">"], ans)], help: [{ text: tip }, { text: "Answer: **" + f + " " + ans + " " + g + "**." }] };
  }
  function test(id, f, g) {
    var a = P(f), b = P(g), yes = a[0] * b[1] === b[0] * a[1];
    return { id: id, prompt: "Are **" + f + "** and **" + g + "** equivalent?", parts: [ch("v", "", ["Yes", "No"], yes ? "Yes" : "No")],
      help: [{ text: "Cross-multiply: " + a[0] + " × " + b[1] + " = " + a[0] * b[1] + " and " + b[0] + " × " + a[1] + " = " + b[0] * a[1] + "." },
             { text: yes ? "They are equal, so the fractions are equivalent." : "They are different, so the fractions are not equivalent." }, { text: "Answer: **" + (yes ? "Yes" : "No") + "**." }] };
  }
  function like(id, f, g) {
    var a = P(f), b = P(g), l = NT.lcm(a[1], b[1]), x = a[0] * l / a[1] + "/" + l, y = b[0] * l / b[1] + "/" + l;
    return { id: id, prompt: "**" + f + "** and **" + g + "**", parts: [fr("a", f + " =", x, { den: l }), fr("b", g + " =", y, { den: l })],
      help: [{ text: "Find the L.C.M. of the denominators " + a[1] + " and " + b[1] + ": " + l + "." },
             { text: f + " = " + a[0] + " × " + l / a[1] + " / " + a[1] + " × " + l / a[1] + " = " + x + "." }, { text: g + " = " + y + "." }, { text: "Answer: **" + x + "** and **" + y + "**." }] };
  }
  function order(id, list) {
    var l = NT.lcm.apply(null, list.map(function (f) { return P(f)[1]; }));
    var vals = list.map(function (f) { var a = P(f); return { f: f, v: a[0] * l / a[1] }; });
    var asc = vals.slice().sort(function (p, q) { return p.v - q.v; }).map(function (p) { return p.f; });
    var desc = asc.slice().reverse();
    var opts = [asc.join(", "), list.join(", "), desc.join(", ")].filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    if (opts.length < 3) opts.push([asc[1], asc[0], asc[2]].join(", "));
    return { id: id, prompt: "**" + list.join(", ") + "**", parts: [ch("a", "(i) Ascending", rot(id, opts), asc.join(", ")), ch("d", "(ii) Descending", rot(id + "x", opts.slice().reverse()), desc.join(", "))],
      help: [{ text: "Make the denominators the same (" + l + "): " + vals.map(function (p) { return p.f + " = " + p.v + "/" + l; }).join(", ") + "." },
             { text: "Now compare the numerators." }, { text: "Answer: ascending **" + asc.join(", ") + "**; descending **" + desc.join(", ") + "**." }] };
  }

  Practice.register({
    id: "math-fractions-g6-ex5-1",
    subject: "Mathematics",
    unit: "Fractions",
    title: "Exercise 5.1",
    topic: "Equivalent, like and unlike fractions",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 76–79",

    reference: {
      title: "Fractions",
      columns: ["Idea", "Example"],
      rows: [
        ["Equivalent: multiply top and bottom by the same number", "1/2 = 2/4 = 3/6 = 4/8"],
        ["Or divide top and bottom by a common factor", "6/12 = 3/6 = 2/4 = 1/2"],
        ["Test: cross-multiply", "1/3 and 2/6: 1 × 6 = 6 = 2 × 3 ✓"],
        ["Like fractions have the same denominator", "3/8 and 2/8"],
        ["Make like fractions with the L.C.M.", "1/2 and 2/3 → 3/6 and 4/6"],
        ["Compare like fractions by numerators", "5/9 < 7/9"],
        ["How to type", "A fraction is typed 3/8. Lists use commas: 2/4, 3/6, 4/8"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Fill in the blanks", instruction: "Type the fractions with commas, like 2/4, 3/6, 4/8.",
        questions: [
          { id: "q1a", prompt: "1/2 = (1 × 2)/(2 × 2) = ☐ = (1 × 3)/(2 × 3) = ☐ = (1 × 4)/(2 × 4) = ☐", parts: [{ id: "v", label: "", type: "equiv", answer: "1/2", count: 3, mode: "mul", example: "2/4, 3/6, 4/8" }],
            help: [{ text: "1 × 2 = 2 and 2 × 2 = 4, so 2/4." }, { text: "Answer: **2/4, 3/6, 4/8**." }] },
          { id: "q1b", prompt: "3/4 = (3 × 2)/(4 × 2) = ☐ = (3 × 3)/(4 × 3) = ☐ = (3 × 4)/(4 × 4) = ☐", parts: [{ id: "v", label: "", type: "equiv", answer: "3/4", count: 3, mode: "mul", example: "6/8, 9/12, 12/16" }],
            help: [{ text: "3 × 3 = 9 and 4 × 3 = 12, so 9/12." }, { text: "Answer: **6/8, 9/12, 12/16**." }] }
        ]
      },
      { id: "q2", title: "Three equivalent fractions", instruction: "Type them with commas.", questions: [equivMul("q2a", "1/3"), equivMul("q2b", "2/5")] },
      { id: "q3", title: "< or >", instruction: "Choose the sign.", questions: [cmp("q3a", "4/7", "5/7"), cmp("q3b", "7/9", "2/9"), cmp("q3c", "1/8", "1/5"), cmp("q3d", "3/8", "3/10")] },
      {
        id: "q4", title: "Paper and shading", instruction: "Creative section A. Type fractions like 3/8.",
        questions: [
          { id: "q4a", prompt: "Deepti folds a sheet into **2 equal parts** and shades one part. Then she folds it into **4 equal parts**.", figure: { type: "fbar", parts: 4, shade: [[0, 2, "a"]] },
            parts: [fr("i", "(i) Shaded, first folding", "1/2", { den: 2 }), fr("ii", "(ii) Shaded, second folding", "2/4", { den: 4 }), ch("iii", "(iii) Same shaded part?", ["Yes", "No"], "Yes"), ch("iv", "(iv) Equivalent?", ["Yes", "No"], "Yes")],
            help: [{ text: "First folding: 1 of 2 parts, 1/2." }, { text: "Second folding: the same area is now 2 of 4 parts, 2/4." }, { text: "They cover the same part, so 1/2 = 2/4 are equivalent." }, { text: "Answer: **1/2**, **2/4**, **Yes**, **Yes**." }] },
          { id: "q4b", prompt: "A sheet is divided into **8 equal parts**. Dolma gets **3 parts** and Kishan gets **2 parts**.", figure: { type: "fbar", parts: 8, shade: [[0, 3, "a"], [3, 5, "b"]] },
            parts: [fr("i", "(i) Dolma", "3/8", { den: 8 }), fr("ii", "(ii) Kishan", "2/8", { den: 8 }), ch("iii", "(iii) Like or unlike?", LIKE, "Like"),
                    { id: "iv", label: "(iv) A fraction equivalent to Dolma's", type: "equiv", answer: "3/8", count: 1, example: "6/16" }],
            help: [{ text: "Dolma: 3 of 8 parts. Kishan: 2 of 8 parts." }, { text: "Same denominator (8), so they are like fractions." }, { text: "Multiply 3/8 by 2/2: 6/16." }, { text: "Answer: **3/8**, **2/8**, **like**, e.g. **6/16**." }] },
          { id: "q4c", prompt: "One circle is divided into **3 equal parts** and 1 is shaded. Another is divided into **6 equal parts** and 1 is shaded.", figure: { type: "pie", parts: 3, shade: [[0, 1, "a"]] },
            parts: [fr("i", "(i) First circle", "1/3", { den: 3 }), fr("ii", "(ii) Second circle", "1/6", { den: 6 }), ch("iii", "(iii) Like or unlike?", LIKE, "Unlike"), fr("iva", "(iv) First as a like fraction", "2/6", { den: 6 }), fr("ivb", "Second as a like fraction", "1/6", { den: 6 })],
            help: [{ text: "First: 1/3. Second: 1/6.", figure: { type: "pie", parts: 6, shade: [[0, 1, "b"]] } }, { text: "Different denominators, so they are unlike." }, { text: "L.C.M. of 3 and 6 is 6: 1/3 = 2/6." }, { text: "Answer: **1/3**, **1/6**, **unlike**, **2/6 and 1/6**." }] }
        ]
      },
      { id: "q5", title: "Multiplication process", instruction: "Write the first three equivalent fractions (multiply by 2, 3, 4).", questions: ["1/2", "2/3", "2/5", "3/4", "4/7", "8/9"].map(function (f, i) { return equivMul("q5" + "abcdef"[i], f); }) },
      { id: "q6", title: "Division process", instruction: "Write three equivalent fractions by dividing by common factors.", questions: ["6/12", "8/16", "12/18", "18/24", "20/30", "24/36"].map(function (f, i) { return equivDiv("q6" + "abcdef"[i], f); }) },
      { id: "q7", title: "Equivalent or not?", instruction: "Cross-multiply to test.", questions: [["1/3", "2/6"], ["2/5", "3/7"], ["3/5", "12/15"], ["7/8", "21/24"]].map(function (p, i) { return test("q7" + "abcd"[i], p[0], p[1]); }) },
      { id: "q8", title: "Make like fractions", instruction: "Use the L.C.M. of the denominators. Type fractions like 3/6.", questions: [["1/2", "2/3"], ["3/4", "3/5"], ["2/3", "5/6"], ["3/4", "7/10"]].map(function (p, i) { return like("q8" + "abcd"[i], p[0], p[1]); }) },
      { id: "q9", title: "Compare", instruction: "Choose < or >.", questions: [["5/9", "7/9"], ["8/11", "6/11"], ["3/4", "7/8"], ["2/5", "3/10"]].map(function (p, i) { return cmp("q9" + "abcd"[i], p[0], p[1]); }) },
      { id: "q10", title: "Order the fractions", instruction: "Choose the ascending and the descending order.", questions: [["1/2", "3/4", "5/8"], ["2/3", "5/6", "7/9"], ["1/3", "3/4", "5/6"], ["1/4", "2/5", "3/10"]].map(function (l, i) { return order("q10" + "abcd"[i], l); }) },
      {
        id: "q11", title: "Land and cake", instruction: "Creative section B. Type fractions like 3/8.",
        questions: [
          { id: "q11a", prompt: "A farmer uses **2/7** of his land for fruit and **4/7** for crops.", figure: { type: "fbar", parts: 7, shade: [[0, 2, "a"], [2, 6, "b"]] },
            parts: [ch("v", "(ii) Which uses more land?", ["Fruit farming", "Crop farming"], "Crop farming")],
            help: [{ text: "(i) The bar shows 2 parts for fruit and 4 parts for crops, out of 7." }, { text: "Like fractions: 4/7 > 2/7." }, { text: "Answer: **crop farming**." }] },
          { id: "q11b", prompt: "Mother cuts a cake into **8 equal pieces**. She gives **3** to her daughter and **2** to her son.", figure: { type: "pie", parts: 8, shade: [[0, 3, "a"], [3, 5, "b"]] },
            parts: [fr("d", "(i) Daughter", "3/8", { den: 8 }), fr("s", "Son", "2/8", { den: 8 }), ch("l", "(iii) Like or unlike?", LIKE, "Like"), ch("c", "(iv) Compare", ["3/8 > 2/8", "3/8 < 2/8"], "3/8 > 2/8")],
            help: [{ text: "Daughter 3/8, son 2/8 (the pie shows them)." }, { text: "Same denominator, so like fractions." }, { text: "Answer: **3/8**, **2/8**, **like**, **3/8 > 2/8**." }] }
        ]
      },
      {
        id: "q12", title: "Spending and work", instruction: "Type fractions like 6/8.",
        questions: [
          { id: "q12a", prompt: "Father spends **3/4** of his income on food and **1/8** on education.", figure: { type: "fbar", parts: 8, shade: [[0, 6, "a"]] },
            parts: [ch("l", "(ii) Like or unlike?", LIKE, "Unlike"), fr("f", "(iii) Food as a like fraction", "6/8", { den: 8 }), fr("e", "Education", "1/8", { den: 8 }), ch("m", "(iv) More money on", ["Food", "Education"], "Food")],
            help: [{ text: "Denominators 4 and 8 are different, so unlike." }, { text: "L.C.M. 8: 3/4 = 6/8." }, { text: "6/8 > 1/8." }, { text: "Answer: **unlike**, **6/8 and 1/8**, **food**." }] },
          { id: "q12b", prompt: "Dhaniya can do **2/3** of a work in a day. Bhuniya can do **3/4** of it in a day.",
            parts: [ch("l", "(ii) Like or unlike?", LIKE, "Unlike"), fr("d", "(iii) Dhaniya as a like fraction", "8/12", { den: 12 }), fr("b", "Bhuniya", "9/12", { den: 12 }), ch("m", "(iv) Who does more?", ["Dhaniya", "Bhuniya"], "Bhuniya")],
            help: [{ text: "Denominators 3 and 4: unlike." }, { text: "L.C.M. 12: 2/3 = 8/12 and 3/4 = 9/12." }, { text: "9/12 > 8/12." }, { text: "Answer: **unlike**, **8/12 and 9/12**, **Bhuniya**." }] },
          { id: "q12c", prompt: "A man gave **2/5** of his property to his wife, **3/10** to his son and **1/6** to his daughter. To whom did he give the most?",
            parts: [ch("v", "", ["Wife", "Son", "Daughter"], "Wife")],
            help: [{ text: "L.C.M. of 5, 10 and 6 is 30." }, { text: "2/5 = 12/30, 3/10 = 9/30, 1/6 = 5/30." }, { text: "Answer: **his wife**." }] }
        ]
      }
    ]
  });
})();
