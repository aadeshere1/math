/*
  Exercise 5.3: Addition and subtraction of fractions and mixed numbers.
  Source: Vedanta Excel in Mathematics, Book 6, pages 86-90.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var C = Practice.fr.calc;
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit) { var o = { id: id, label: label, type: "number", answer: answer }; if (unit) o.unit = unit; return o; }
  function fr(id, label, answer, extra) { var o = { id: id, label: label, type: "frac", answer: answer }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function mo(id, label, answer) { return fr(id, label, answer, { mixedOk: true }); }
  function bar(n, shade, cap) { var o = { type: "fbar", parts: n, shade: shade }; if (cap) o.caption = cap; return o; }
  function whole(n, k) { return { type: "fbar", parts: n, count: 2, shade: [[0, n + k]] }; }
  var KIND = ["Proper", "Improper"];
  var L = "abcdefghijklmnop";
  function list(prefix, exprs) { return exprs.map(function (e, i) { return C(prefix + L[i], e); }); }

  // Unlike fractions shown as pictures, then made like.
  function addPic(id, a, b, like, sum, note) {
    var A = a.split("/"), B = b.split("/"), l = +like[0].split("/")[1];
    return { id: id, prompt: "**" + a + " + " + b + "**",
      figure: { type: "row", items: [bar(+A[1], [[0, +A[0]]], a), "+", bar(+B[1], [[0, +B[0], "b"]], b), "=", bar(l, [[0, +like[0].split("/")[0]], [+like[0].split("/")[0], +like[0].split("/")[0] + +like[1].split("/")[0], "b"]], "?")] },
      parts: [fr("x", a + " =", like[0], { den: l }), fr("y", b + " =", like[1], { den: l }), fr("s", "Sum", sum)],
      help: [{ text: "Make the denominators the same. The L.C.M. of " + A[1] + " and " + B[1] + " is " + l + "." },
             { text: a + " = " + like[0] + " and " + b + " = " + like[1] + "." },
             { text: "Add the numerators: " + like[0] + " + " + like[1] + " = " + (+like[0].split("/")[0] + +like[1].split("/")[0]) + "/" + l + (note || "") + "." },
             { text: "Answer: **" + like[0] + " + " + like[1] + " = " + sum + "**." }] };
  }
  // Shaded parts with some crossed out: shaded − crossed.
  function subPic(id, n, crossed, shaded, res, prompt) {
    var S = shaded + "/" + n, X = crossed + "/" + n;
    return { id: id, prompt: prompt || "Shaded parts minus the crossed-out parts.", figure: bar(n, [[0, crossed, "x"], [crossed, shaded, "a"]]),
      parts: [fr("s", "Shaded", S), fr("x", "Crossed out", X), fr("r", "Difference", res)],
      help: [{ text: "Count all the shaded parts, including the crossed ones: " + shaded + " of " + n + " = " + S + "." },
             { text: "Crossed out: " + crossed + " of " + n + " = " + X + "." },
             { text: S + " − " + X + " = " + (shaded - crossed) + "/" + n + (res !== (shaded - crossed) + "/" + n ? " = " + res : "") + "." },
             { text: "Answer: **" + res + "**." }] };
  }
  // Mixed numbers from pictures: whole + part.
  function mixPic(id, n1, k1, n2, k2, m1, m2, sum, steps) {
    return { id: id, prompt: "Each bar is one whole. Write the two mixed numbers and add them.",
      figure: { type: "row", items: [whole(n1, k1, m1), "+", whole(n2, k2, m2)] },
      parts: [fr("a", "First", m1, { mixedOk: true }), fr("b", "Second", m2, { mixedOk: true }), fr("s", "Sum", sum, { mixedOk: true, lowest: true })],
      help: [{ text: "First picture: 1 whole and " + k1 + " of " + n1 + " parts, so " + m1 + ". Second: " + m2 + "." }].concat(steps.map(function (t) { return { text: t }; }), [{ text: "Answer: **" + sum + "**." }]) };
  }

  Practice.register({
    id: "math-fractions-g6-ex5-3",
    subject: "Mathematics",
    unit: "Fractions",
    title: "Exercise 5.3",
    topic: "Adding and subtracting fractions",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 86–90",

    reference: {
      title: "Adding and subtracting",
      columns: ["Idea", "Example"],
      rows: [
        ["Like fractions: add or subtract the numerators", "2/7 + 3/7 = 5/7"],
        ["Unlike fractions: make like fractions with the L.C.M.", "1/2 + 1/3 = 3/6 + 2/6 = 5/6"],
        ["Mixed numbers: add the wholes and the fractions", "1 1/2 + 1 1/4 = 2 3/4"],
        ["Or change to improper fractions first", "3 2/3 − 1 1/2 = 11/3 − 3/2 = 22/6 − 9/6 = 13/6"],
        ["1 + a fraction: add the denominator to the numerator", "1 + 3/4 = 7/4"],
        ["1 − a fraction: subtract the numerator from the denominator", "1 − 2/7 = 5/7"],
        ["Give answers in lowest terms", "3/6 = 1/2"],
        ["How to type", "Fraction 5/6. Mixed number: whole, space, fraction, like 2 3/4"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Total of the shaded parts", instruction: "Write each coloured part as a fraction, then the total.",
        questions: [
          { id: "q1a", prompt: "Blue parts + yellow parts", figure: bar(5, [[0, 2, "a"], [2, 4, "b"]]),
            parts: [fr("x", "Blue", "2/5", { den: 5 }), fr("y", "Yellow", "2/5", { den: 5 }), fr("t", "Total", "4/5")],
            help: [{ text: "The bar has 5 equal parts. 2 are blue and 2 are yellow." }, { text: "Like fractions: add the numerators. 2/5 + 2/5 = 4/5." }, { text: "Answer: **2/5 + 2/5 = 4/5**." }] },
          { id: "q1b", prompt: "Blue parts + yellow parts", figure: bar(7, [[0, 3, "a"], [3, 5, "b"]]),
            parts: [fr("x", "Blue", "3/7", { den: 7 }), fr("y", "Yellow", "2/7", { den: 7 }), fr("t", "Total", "5/7")],
            help: [{ text: "The bar has 7 equal parts. 3 are blue and 2 are yellow." }, { text: "3/7 + 2/7 = 5/7." }, { text: "Answer: **3/7 + 2/7 = 5/7**." }] }
        ]
      },
      { id: "q2", title: "Subtract the crossed parts", instruction: "Take the crossed-out parts away from all the shaded parts.",
        questions: [subPic("q2a", 6, 2, 5, "1/2"), subPic("q2b", 9, 4, 7, "1/3")] },
      {
        id: "q3", title: "Add unlike fractions", instruction: "Make like fractions first, then add.",
        questions: [
          addPic("q3a", "1/2", "1/3", ["3/6", "2/6"], "5/6"),
          addPic("q3b", "1/2", "1/4", ["2/4", "1/4"], "3/4"),
          addPic("q3c", "1/3", "1/6", ["2/6", "1/6"], "1/2", " = 1/2"),
          addPic("q3d", "1/3", "1/4", ["4/12", "3/12"], "7/12")
        ]
      },
      { id: "q4", title: "Subtract from pictures", instruction: "Shaded fraction minus the crossed-out fraction.",
        questions: [subPic("q4a", 4, 1, 2, "1/4"), subPic("q4b", 6, 1, 4, "1/2"), subPic("q4c", 6, 2, 3, "1/6"), subPic("q4d", 12, 3, 4, "1/12")] },
      {
        id: "q5", title: "Add mixed numbers from pictures", instruction: "Type mixed numbers like 1 1/2.",
        questions: [
          mixPic("q5a", 2, 1, 4, 1, "1 1/2", "1 1/4", "2 3/4", ["Wholes: 1 + 1 = 2.", "Fractions: 1/2 + 1/4 = 2/4 + 1/4 = 3/4."]),
          mixPic("q5b", 6, 2, 6, 1, "1 1/3", "1 1/6", "2 1/2", ["The first part is 2/6 = 1/3.", "Wholes: 1 + 1 = 2. Fractions: 2/6 + 1/6 = 3/6 = 1/2."]),
          mixPic("q5c", 3, 1, 3, 1, "1 1/3", "1 1/3", "2 2/3", ["Wholes: 1 + 1 = 2.", "Fractions: 1/3 + 1/3 = 2/3."]),
          mixPic("q5d", 3, 1, 4, 1, "1 1/3", "1 1/4", "2 7/12", ["Wholes: 1 + 1 = 2.", "Fractions: 1/3 + 1/4 = 4/12 + 3/12 = 7/12."])
        ]
      },
      { id: "q6", title: "Quick sums and differences", instruction: "Write the answer in lowest terms.",
        questions: list("q6", ["1/4 + 1/4", "1/5 + 2/5", "7/9 − 5/9", "10/11 − 6/11", "2 1/3 + 1 1/3", "4 5/7 − 1 2/7"]) },
      { id: "q7", title: "Tricky ways with 1", instruction: "1 + 3/4 = 7/4 (add 3 + 4 on top). 1 − 2/7 = 5/7 (7 − 2 on top).",
        questions: ["1 + 2/3", "1 + 3/4", "1 + 2/7", "1 − 3/4", "1 − 2/5", "1 − 4/9"].map(function (e, i) {
          var p = e.split(" "), f = p[2].split("/"), n = p[1] === "+" ? +f[1] + +f[0] : +f[1] - +f[0];
          return C("q7" + L[i], e, { help: [p[1] === "+" ? "1 = " + f[1] + "/" + f[1] + ", so add " + f[0] + " + " + f[1] + " = " + n + " on top." : "1 = " + f[1] + "/" + f[1] + ", so subtract " + f[1] + " − " + f[0] + " = " + n + " on top."] });
        }) },
      {
        id: "q8", title: "Bread and income", instruction: "Type fractions like 3/4.",
        questions: [
          { id: "q8a", prompt: "A bread is divided into **4 equal parts**. Mr. Chand eats **1 part** and Mr. Rawal eats **2 parts**.", figure: bar(4, [[0, 1, "a"], [1, 3, "b"]]),
            parts: [fr("i", "(i) Fraction eaten by them", "3/4"), fr("ii", "(ii) Fraction remaining", "1/4")],
            help: [{ text: "Eaten: 1/4 + 2/4 = 3/4." }, { text: "Remaining: 1 − 3/4 = 1/4." }, { text: "Answer: **3/4** and **1/4**." }] },
          { id: "q8b", prompt: "An income is divided into **6 equal parts**. 2 parts are spent on food and 3 parts on education.", figure: bar(6, [[0, 2, "a"], [2, 5, "b"]]),
            parts: [fr("i", "(i) Fraction spent", "5/6"), fr("ii", "(ii) Fraction remaining", "1/6")],
            help: [{ text: "Spent: 2/6 + 3/6 = 5/6." }, { text: "Remaining: 1 − 5/6 = 1/6." }, { text: "Answer: **5/6** and **1/6**." }] }
        ]
      },
      { id: "q9", title: "Add", instruction: "Creative section A. Answers over 1 can be improper fractions or mixed numbers.",
        questions: list("q9", ["1/2 + 2/3", "1/3 + 2/5", "3/4 + 5/8", "8/9 + 2/3", "3 2/3 + 1 5/6", "2 2/5 + 3 7/10", "4 5/7 + 3 3/14", "4 3/10 + 5 4/15"]) },
      { id: "q10", title: "Subtract", instruction: "Write the answer in lowest terms.",
        questions: list("q10", ["1/2 − 1/3", "3/4 − 2/3", "4/5 − 3/10", "5/6 − 3/8", "7/8 − 5/12", "3 2/3 − 1 1/2", "5 3/4 − 2 5/8", "7 5/6 − 3 2/9"]) },
      { id: "q11", title: "Simplify", instruction: "Work from left to right. Write the answer in lowest terms.",
        questions: list("q11", ["1/2 + 1/3 + 1/4", "3/4 + 5/6 − 7/8", "8/9 − 2/3 + 1/6", "3/5 − 7/15 − 1/10", "1 1/2 + 2 1/4 + 3 1/8", "3 2/3 + 2 5/6 − 4 4/9"]).concat([
          C("q11g", "2 3/4 − 3 1/8 + 1 1/12", { help: ["Wholes: 2 − 3 + 1 = 0.", "Fractions with L.C.M. 24: 3/4 − 1/8 + 1/12 = 18/24 − 3/24 + 2/24 = 17/24."] }),
          C("q11h", "5 1/2 − 2 4/7 − 1 5/14", { help: ["Wholes: 5 − 2 − 1 = 2.", "Fractions with L.C.M. 14: 7/14 − 8/14 − 5/14 = −6/14 = −3/7.", "2 − 3/7 = 1 4/7."] })
        ]) },
      {
        id: "q12", title: "Sharing", instruction: "Creative section B. Type fractions like 2/8 and mixed numbers like 2 1/3.",
        questions: [
          { id: "q12a", prompt: "Manoj divides a milky bar into **8 equal pieces**. He gives **2** to Jiwan and **3** to Suresh.", figure: bar(8, [[0, 2, "a"], [2, 5, "b"]]),
            parts: [fr("j", "(i) Jiwan", "2/8", { den: 8 }), fr("s", "Suresh", "3/8", { den: 8 }), fr("t", "(iii) Sum", "5/8"), ch("k", "(iv) Proper or improper?", KIND, "Proper"), fr("l", "(v) Left with Manoj", "3/8")],
            help: [{ text: "Jiwan 2/8, Suresh 3/8 ((ii) the bar shows them)." }, { text: "Sum: 2/8 + 3/8 = 5/8. 5 < 8, so it is proper." }, { text: "Left: 1 − 5/8 = 3/8." }, { text: "Answer: **2/8, 3/8, 5/8, proper, 3/8**." }] },
          { id: "q12b", prompt: "Anita divides each of **3 breads** into **3 equal slices**. She gives **5 slices** to Anil and **2 slices** to Binita.", figure: { type: "fbar", parts: 3, count: 3, shade: [[0, 5, "a"], [5, 7, "b"]] },
            parts: [fr("a", "(i) Anil (in breads)", "5/3", { den: 3 }), fr("b", "(ii) Binita", "2/3", { den: 3 }), fr("s", "(iv) Sum", "7/3", { den: 3 }), ch("k", "(v) Proper or improper?", KIND, "Improper"), mx("m", "(vi) As a mixed number", "2 1/3")],
            help: [{ text: "Each slice is 1/3 of a bread. Anil: 5 slices = 5/3. Binita: 2/3. ((iii) The picture shows them.)" }, { text: "Sum: 5/3 + 2/3 = 7/3. 7 > 3, so it is improper." }, { text: "7 ÷ 3 = 2 remainder 1, so 2 1/3." }, { text: "Answer: **5/3, 2/3, 7/3, improper, 2 1/3**." }] },
          { id: "q12c", prompt: "Rakesh divides one cake into **3 equal pieces** and gives **1** to Pinky. He divides another cake into **4 equal pieces** and gives **3** to Abdul.", figure: { type: "row", items: [{ type: "pie", parts: 3, shade: [[0, 1]], caption: "Pinky" }, { type: "pie", parts: 4, shade: [[0, 3, "b"]], caption: "Abdul" }] },
            parts: [fr("p", "(i) Pinky", "1/3", { den: 3 }), fr("a", "(ii) Abdul", "3/4", { den: 4 }), ch("l", "(iii) Like or unlike?", ["Like", "Unlike"], "Unlike"), fr("p2", "(iv) Pinky as a like fraction", "4/12", { den: 12 }), fr("a2", "Abdul as a like fraction", "9/12", { den: 12 }),
                    fr("s", "(v) Sum", "13/12", { den: 12 }), ch("k", "(vi) Proper or improper?", KIND, "Improper"), mx("m", "(vii) As a mixed number", "1 1/12")],
            help: [{ text: "Pinky 1/3, Abdul 3/4. Different denominators, so unlike." }, { text: "L.C.M. of 3 and 4 is 12: 1/3 = 4/12, 3/4 = 9/12." }, { text: "Sum: 4/12 + 9/12 = 13/12. 13 > 12, so improper; 13/12 = 1 1/12." }, { text: "Answer: **1/3, 3/4, unlike, 4/12 and 9/12, 13/12, improper, 1 1/12**." }] }
        ]
      },
      {
        id: "q13", title: "Travel and weight", instruction: "Type mixed numbers like 2 3/4.",
        questions: [
          C("q13a", "3 1/4 + 6 5/6", { prompt: "Kamal travelled **3 1/4 km** by tempo and **6 5/6 km** by bus. What distance did he travel altogether?", unit: "km" }),
          C("q13b", "25 1/2 + 2 1/4", { prompt: "Manisha weighs **25 1/2 kg** and her school bag with stationery weighs **2 1/4 kg**. What is the total weight while she carries the bag?", unit: "kg" })
        ]
      },
      {
        id: "q14", title: "Cloth and gas", instruction: "Type mixed numbers like 1 1/2.",
        questions: [
          C("q14a", "3 1/4 − 1 3/4", { prompt: "Lakhan needs **3 1/4 m** of cloth for pants and a shirt. If **1 3/4 m** is for the pants, how much is needed for the shirt?", unit: "m" }),
          C("q14b", "31 7/15 − 16 4/5", { prompt: "An empty gas cylinder weighs **16 4/5 kg**. Filled with gas it weighs **31 7/15 kg**. What is the weight of the gas?", unit: "kg" })
        ]
      },
      {
        id: "q15", title: "Property and distance", instruction: "Type fractions like 1/24 and mixed numbers like 1 5/8.",
        questions: [
          C("q15a", "1 − 3/8 − 5/12 − 1/6", { prompt: "A man gives **3/8** of his property to his son, **5/12** to his daughter and **1/6** to a charity. What part is left with him?",
            help: ["Given away: 3/8 + 5/12 + 1/6. The L.C.M. of 8, 12 and 6 is 24.", "9/24 + 10/24 + 4/24 = 23/24.", "Left: 1 − 23/24 = 1/24."] }),
          C("q15b", "15 − 8 1/4 − 5 1/8", { prompt: "The distance between two places is **15 km**. A man travelled **8 1/4 km** by taxi, **5 1/8 km** by bus and walked the rest. How far did he walk?", unit: "km",
            help: ["By taxi and bus: 8 1/4 + 5 1/8 = 8 2/8 + 5 1/8 = 13 3/8 km.", "Walked: 15 − 13 3/8 = 1 5/8 km."] })
        ]
      }
    ]
  });
  function mx(id, label, answer) { return { id: id, label: label, type: "mixed", answer: answer }; }
})();
