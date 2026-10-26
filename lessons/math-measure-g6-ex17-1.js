/*
  Exercise 17.1: Changing units of length (m, cm, ft, in).
  Source: Vedanta Excel in Mathematics, Book 6, pages 245-247.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
  The book uses 1 m = 3.28 ft, 1 m = 39.37 in, 1 ft = 12 in = 30.48 cm, 1 in = 2.54 cm, and rounds to 2 decimal places.
*/
(function () {
  var L = "abcdefghijklmnop";
  function r2(v) { return Math.round(v * 100) / 100; }
  function show(v) { return String(r2(v)); }
  function nm(id, label, answer, unit, exact) {
    var p = { id: id, label: label, type: "number", answer: r2(answer), unit: unit };
    if (!exact) p.tolerance = Math.max(0.011, Math.abs(answer) * 0.003);
    return p;
  }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  // m + cm, ft + in
  function mcm(m, cm) { return { v: m + cm / 100, s: m + " m" + (cm ? " " + cm + " cm" : ""), step: cm ? m + " m " + cm + " cm = " + m + " m + " + cm + "/100 m = " + show(m + cm / 100) + " m." : null }; }
  function ftin(ft, inch) { return { v: ft + inch / 12, s: ft + " ft" + (inch ? " " + inch + " in" : ""), step: inch ? ft + " ft " + inch + " in = " + ft + " ft + " + inch + "/12 ft = " + show(ft + inch / 12) + " ft." : null }; }
  function q(id, text, ans, unit, steps) {
    return { id: id, prompt: "**" + text + "**", parts: [nm("v", "", ans, unit, Math.abs(ans - Math.round(ans)) < 1e-9)],
      help: steps.filter(Boolean).map(function (t) { return { text: t }; }).concat([{ text: "Answer: **" + show(ans) + " " + unit + "**." }]) };
  }
  // to cm
  function toCm(i, it) {
    if (it.m != null) { var a = mcm(it.m, it.cm || 0); return q("q3" + L[i], a.s, a.v * 100, "cm", [a.step, "1 m = 100 cm, so multiply by 100: " + show(a.v) + " × 100 = " + show(a.v * 100) + " cm."]); }
    if (it.ft != null) {
      var inches = it.ft * 12 + (it.in || 0), s = it.ft + " ft" + (it.in ? " " + it.in + " in" : "");
      return q("q3" + L[i], s, inches * 2.54, "cm", [it.in ? s + " = " + it.ft + " × 12 in + " + it.in + " in = " + inches + " in." : null,
        it.in ? "1 in = 2.54 cm, so " + inches + " × 2.54 = " + show(inches * 2.54) + " cm." : "1 ft = 30.48 cm, so " + it.ft + " × 30.48 = " + show(it.ft * 30.48) + " cm."]);
    }
    return q("q3" + L[i], it.inch + " in", it.inch * 2.54, "cm", ["1 in = 2.54 cm, so " + it.inch + " × 2.54 = " + show(it.inch * 2.54) + " cm."]);
  }
  function toIn(i, it) {
    if (it.m != null) { var a = mcm(it.m, it.cm || 0); return q("q4" + L[i], a.s, a.v * 39.37, "in", [a.step, "1 m = 39.37 in, so " + show(a.v) + " × 39.37 = " + show(a.v * 39.37) + " in."]); }
    var s = it.ft + " ft" + (it.in ? " " + it.in + " in" : "");
    return q("q4" + L[i], s, it.ft * 12 + (it.in || 0), "in", ["1 ft = 12 in, so " + it.ft + " × 12 = " + show(it.ft * 12) + " in." + (it.in ? " Add " + it.in + " in: " + show(it.ft * 12 + it.in) + " in." : "")]);
  }
  function toFt(i, it) {
    if (it.m != null) { var a = mcm(it.m, it.cm || 0); return q("q5" + L[i], a.s, a.v * 3.28, "ft", [a.step, "1 m = 3.28 ft, so " + show(a.v) + " × 3.28 = " + show(a.v * 3.28) + " ft."]); }
    if (it.cmOnly != null) return q("q5" + L[i], it.cmOnly + " cm", it.cmOnly / 30.48, "ft", ["1 ft = 30.48 cm, so divide by 30.48: " + it.cmOnly + " ÷ 30.48 = " + show(it.cmOnly / 30.48) + " ft."]);
    if (it.ft == null) return q("q5" + L[i], it.inch + " in", it.inch / 12, "ft", ["12 in = 1 ft, so divide by 12: " + it.inch + " ÷ 12 = " + show(it.inch / 12) + " ft."]);
    var b = ftin(it.ft, it.in);
    return q("q5" + L[i], b.s, b.v, "ft", [b.step]);
  }
  function toM(i, it) {
    if (it.m != null) { var a = mcm(it.m, it.cm); return q("q6" + L[i], a.s, a.v, "m", [it.cm + " cm = " + it.cm + " ÷ 100 m = " + show(it.cm / 100) + " m.", a.step]); }
    if (it.inch != null) return q("q6" + L[i], it.inch + " in", it.inch / 39.37, "m", ["1 m = 39.37 in, so divide by 39.37: " + it.inch + " ÷ 39.37 = " + show(it.inch / 39.37) + " m."]);
    var b = ftin(it.ft, it.in || 0);
    return q("q6" + L[i], b.s, b.v / 3.28, "m", [b.step, "1 m = 3.28 ft, so divide by 3.28: " + show(b.v) + " ÷ 3.28 = " + show(b.v / 3.28) + " m."]);
  }
  function multi(id, prompt, rows) { // rows: [label, value, unit, step]
    return { id: id, prompt: prompt, parts: rows.map(function (r, i) { return r[4] ? ch(L[i], r[0], r[4], r[1]) : nm(L[i], r[0], r[1], r[2]); }),
      help: rows.map(function (r) { return { text: r[3] }; }).concat([{ text: "Answer: **" + rows.map(function (r) { return r[4] ? r[1] : show(r[1]) + " " + r[2]; }).join(", ") + "**." }]) };
  }

  Practice.register({
    id: "math-measure-g6-ex17-1",
    subject: "Mathematics",
    unit: "Perimeter, Area and Volume",
    title: "Exercise 17.1",
    topic: "Units of length",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 245–247",

    reference: {
      title: "Units of length",
      columns: ["Fact", "Use it like this"],
      rows: [
        ["1 m = 100 cm", "5 m = 5 × 100 = 500 cm"],
        ["1 ft = 12 in", "7 ft = 7 × 12 = 84 in"],
        ["1 in = 2.54 cm", "10 in = 10 × 2.54 = 25.4 cm"],
        ["1 ft = 30.48 cm", "6 ft = 6 × 30.48 = 182.88 cm"],
        ["1 m = 3.28 ft", "15 m = 15 × 3.28 = 49.2 ft"],
        ["1 m = 39.37 in", "4 m = 4 × 39.37 = 157.48 in"],
        ["Big unit → small unit: multiply", "Small unit → big unit: divide"],
        ["Mixed units: change the small part first", "4 ft 9 in = 4 + 9/12 = 4.75 ft"],
        ["Round to 2 decimal places", "4.75 ÷ 3.28 = 1.448… ≈ 1.45 m"]
      ]
    },

    sections: [
      { id: "q1", title: "Fill the blanks", instruction: "Say and write the correct answers.",
        questions: [["There are … cm in 1 m.", 100, "cm", "1 m = 100 cm."], ["1 inch equals to … cm.", 2.54, "cm", "1 in = 2.54 cm."], ["The length of 1 ft of wire is … inch long.", 12, "in", "1 ft = 12 in."],
          ["A 1 ft long ruler is … cm long.", 30.48, "cm", "1 ft = 12 in = 12 × 2.54 cm = 30.48 cm."], ["The length of 1 m of stick is … inch long.", 39.37, "in", "1 m = 39.37 in."]].map(function (m, i) {
          return { id: "q1" + L[i], prompt: m[0], parts: [nm("v", "", m[1], m[2], true)], help: [{ text: m[3] }, { text: "Answer: **" + m[1] + " " + m[2] + "**." }] };
        }) },
      { id: "q2", title: "Choose the answer", instruction: "Choose the correct option.",
        questions: [["How many centimetres are there in 1 inch?", ["2.54", "3.54", "12", "30.48"], "2.54", "1 in = 2.54 cm."],
          ["How many inches are there in 1 foot?", ["3.28", "12", "30.48", "39.37"], "12", "1 ft = 12 in."],
          ["How many feet are there in 1 metre?", ["3.28 ft", "2.54 ft", "30.48 ft", "39.37 ft"], "3.28 ft", "1 m = 3.28 ft."],
          ["Which of the following measurements is the shortest?", ["1 cm", "1 in", "1 ft", "1 m"], "1 cm", "1 in = 2.54 cm, 1 ft = 30.48 cm, 1 m = 100 cm. So 1 cm is the shortest."]].map(function (m, i) {
          return { id: "q2" + L[i], prompt: m[0], parts: [ch("v", "", m[1], m[2])], help: [{ text: m[3] }, { text: "Answer: **" + m[2] + "**." }] };
        }) },
      { id: "q3", title: "Change to centimetres", instruction: "Convert each measurement into centimetres (cm).",
        questions: [{ m: 5 }, { m: 18 }, { m: 20, cm: 25 }, { m: 37, cm: 40 }, { ft: 6 }, { ft: 14 }, { inch: 6 }, { inch: 10 }, { ft: 5, in: 3 }, { ft: 8, in: 9 }].map(function (it, i) { return toCm(i, it); }) },
      { id: "q4", title: "Change to inches", instruction: "Change each measurement into inches (in). Round to 2 decimal places.",
        questions: [{ m: 4 }, { m: 20 }, { m: 16, cm: 50 }, { m: 48, cm: 25 }, { ft: 7 }, { ft: 24 }, { ft: 35.5 }, { ft: 48.75 }, { ft: 25, in: 7 }, { ft: 53, in: 11 }].map(function (it, i) { return toIn(i, it); }) },
      { id: "q5", title: "Change to feet", instruction: "Change the measurements into feet (ft). Round to 2 decimal places.",
        questions: [{ m: 15 }, { m: 28 }, { m: 40, cm: 20 }, { m: 55, cm: 55 }, { cmOnly: 381 }, { cmOnly: 76.2 }, { inch: 24 }, { inch: 66 }, { ft: 7, in: 6 }, { ft: 28, in: 3 }].map(function (it, i) { return toFt(i, it); }) },
      { id: "q6", title: "Change to metres", instruction: "Express the measurements in metres (m). Round to 2 decimal places.",
        questions: [{ m: 12, cm: 60 }, { m: 35, cm: 25 }, { ft: 32.8 }, { ft: 53.3 }, { inch: 3937 }, { inch: 727.4 }, { ft: 25, in: 6 }, { ft: 36, in: 9 }].map(function (it, i) { return toM(i, it); }) },
      { id: "q7", title: "Heights and grounds", instruction: "Creative Section B. Round to 2 decimal places.",
        questions: [
          multi("q7a", "A boy is **5 feet 6 inch** tall. Find his height in (i) inch (ii) centimetre (iii) metre.", [
            ["(i) Inch", 66, "in", "5 ft 6 in = 5 × 12 + 6 = 66 in."], ["(ii) Centimetre", 167.64, "cm", "66 × 2.54 = 167.64 cm."], ["(iii) Metre", 1.6764, "m", "167.64 ÷ 100 = 1.6764 ≈ 1.68 m."]]),
          multi("q7b", "The length of a kitchen garden is **10 m 50 cm** and breadth is **6 m 20 cm**. Find the length and breadth in feet (ft).", [
            ["Length", 10.5 * 3.28, "ft", "10 m 50 cm = 10.5 m. 10.5 × 3.28 = 34.44 ft."], ["Breadth", 6.2 * 3.28, "ft", "6 m 20 cm = 6.2 m. 6.2 × 3.28 = 20.336 ≈ 20.34 ft."]]),
          multi("q7c", "The height of Mt. Everest is **8,848 m 86 cm** and the height of Kanchenjunga is **8,586 m**. Find their heights in feet (ft).", [
            ["Everest", 8848.86 * 3.28, "ft", "8848 m 86 cm = 8848.86 m. 8848.86 × 3.28 = 29024.26 ft."], ["Kanchenjunga", 8586 * 3.28, "ft", "8586 × 3.28 = 28162.08 ft."]]),
          multi("q7d", "The length and breadth of a school's playground are **220 feet 9 inch** and **150 feet 3 inch**. Find them in metres (m).", [
            ["Length", 220.75 / 3.28, "m", "220 ft 9 in = 220 + 9/12 = 220.75 ft. 220.75 ÷ 3.28 = 67.30 m."], ["Breadth", 150.25 / 3.28, "m", "150 ft 3 in = 150.25 ft. 150.25 ÷ 3.28 = 45.81 m."]])
        ] },
      { id: "q8", title: "Compare and add", instruction: "Round to 2 decimal places.",
        questions: [
          multi("q8a", "Ram is **137.16 cm** tall and Sunita is **4 ft 3 in** tall. (i) Express Ram's height in feet. (ii) Express Sunita's height in feet. (iii) Who is taller and by how many feet?", [
            ["(i) Ram", 4.5, "ft", "137.16 ÷ 30.48 = 4.5 ft."], ["(ii) Sunita", 4.25, "ft", "4 ft 3 in = 4 + 3/12 = 4.25 ft."],
            ["(iii) Taller", "Ram", "", "4.5 ft > 4.25 ft, so Ram is taller.", ["Ram", "Sunita"]], ["By", 0.25, "ft", "4.5 − 4.25 = 0.25 ft."]]),
          multi("q8b", "The length of the whiteboard of class VI is **2 m 80 cm** and breadth is **4 ft 9 in**. (i) Express the length in metres. (ii) Express the breadth in metres. (iii) By how many metres is the length longer than the breadth?", [
            ["(i) Length", 2.8, "m", "2 m 80 cm = 2.8 m."], ["(ii) Breadth", 1.45, "m", "4 ft 9 in = 4.75 ft. 4.75 ÷ 3.28 = 1.448… ≈ 1.45 m."], ["(iii) Longer by", 1.35, "m", "2.8 − 1.45 = 1.35 m."]]),
          multi("q8c", "For a school uniform, Shashwat needs **1 m 50 cm** cloth for a shirt and **5 ft 8 in** cloth for a pant. (i) Convert the shirt cloth into metres. (ii) Convert the pant cloth into metres. (iii) Find the total length of cloth.", [
            ["(i) Shirt", 1.5, "m", "1 m 50 cm = 1.5 m."], ["(ii) Pant", 1.73, "m", "5 ft 8 in = 5 + 8/12 = 5.67 ft. 5.67 ÷ 3.28 ≈ 1.73 m."], ["(iii) Total", 3.23, "m", "1.5 + 1.73 = 3.23 m."]]),
          multi("q8d", "In a village there are three electric poles in a line. The distance between the first and second poles is **98 ft 3 in** and between the second and third is **48 m 60 cm**. Estimate the shortest length of cable in feet that joins the three poles.", [
            ["Cable", 98.25 + 48.6 * 3.28, "ft", "98 ft 3 in = 98.25 ft. 48 m 60 cm = 48.6 m = 48.6 × 3.28 = 159.41 ft. Total = 98.25 + 159.41 = 257.66 ft."]])
        ] }
    ]
  });
})();
