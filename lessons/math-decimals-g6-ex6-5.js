/*
  Exercise 6.5: Rounding off.
  Source: Vedanta Excel in Mathematics, Book 6, page 122.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var D = Practice.dec, C = D.calc, L = "abcdefghijklmnop";
  var ORD = ["", "1st", "2nd", "3rd", "4th", "5th"];
  function dp(k) { return k + " decimal place" + (k > 1 ? "s" : ""); }
  // round a decimal to k places, with the reason
  function rd(x, k) {
    var r = D.round(x, k), next = (x.split(".")[1] || "")[k] || "0", up = +next >= 5;
    return { r: r, why: x + " to " + dp(k) + ": the " + ORD[k + 1] + " digit after the point is " + next + (up ? ", which is 5 or more, so round up" : ", which is less than 5, so keep the " + ORD[k] + " digit") + ": **" + r + "**." };
  }
  function dpq(id, x, ks) {
    var rs = ks.map(function (k) { return rd(x, k); });
    return { id: id, prompt: "Round off **" + x + "**" + (ks.length > 1 ? " to " + ks.join(", ") + " decimal places." : " to " + dp(ks[0]) + "."),
      parts: ks.map(function (k, i) { return { id: L[i], label: ks.length > 1 ? "to " + dp(k) : "", type: "dec", answer: rs[i].r, dp: k, round: x }; }),
      help: [{ text: "Look at the digit just after the place you are rounding to. 5 or more: add 1 to the digit before it. Less than 5: leave it. Then drop the digits after." }]
        .concat(rs.map(function (r) { return { text: r.why }; }))
        .concat([{ text: "Answer: **" + rs.map(function (r) { return r.r; }).join(", ") + "**." }]) };
  }
  // round a whole number to tens / hundreds / thousands
  function whole(id, n, to) {
    var name = { 10: "ten", 100: "hundred", 1000: "thousand" }[to], r = Math.round(n / to) * to, low = Math.floor(n / to) * to, d = Math.floor(n % to / (to / 10));
    return { id: id, prompt: "Round off **" + n + "** to the nearest " + name + ".", parts: [{ id: "v", label: "", type: "number", answer: r, mistakes: [{ answer: r === low ? low + to : low, say: "Look at the digit after the " + name + "s place. 5 or more rounds up; less than 5 rounds down." }] }],
      help: [{ text: n + " is between " + low + " and " + (low + to) + "." }, { text: "The digit just after the " + name + "s place is " + d + (d >= 5 ? ", which is 5 or more, so round up to " + (low + to) : ", which is less than 5, so round down to " + low) + "." }, { text: "Answer: **" + r + "**." }] };
  }
  function quot(id, t) {
    var p = t.split("/"), e = D.evaluate(p[0] + " ÷ " + p[1]).v, r4 = D.round(D.str(e, 8), 4), r2 = D.round(D.str(e, 8), 2);
    return { id: id, prompt: "Divide **" + t + "** to 4 decimal places, then write the answer to 2 decimal places.",
      parts: [{ id: "a", label: "to 4 d.p.", type: "dec", answer: r4, dp: 4, round: D.str(e, 8) }, { id: "b", label: "to 2 d.p.", type: "dec", answer: r2, dp: 2, round: D.str(e, 8) }],
      help: [{ text: "Divide " + p[0] + " by " + p[1] + ", writing zeros after the point: " + p[0] + ".00000 ÷ " + p[1] + " = " + D.str(e, 5) + "…" },
        { text: "To 4 d.p.: the 5th digit is " + D.str(e, 5).slice(-1) + ", so " + r4 + "." },
        { text: "To 2 d.p.: the 3rd digit is " + D.str(e, 5).split(".")[1][2] + ", so " + r2 + "." },
        { text: "Answer: **" + r4 + "** and **" + r2 + "**." }] };
  }

  Practice.register({
    id: "math-decimals-g6-ex6-5",
    subject: "Mathematics",
    unit: "Decimals",
    title: "Exercise 6.5",
    topic: "Rounding off",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · page 122",

    reference: {
      title: "Rounding off",
      columns: ["Rule", "Example"],
      rows: [
        ["Look at the next digit to the right", "2.43 to 1 d.p.: next digit 3"],
        ["Less than 5: keep the digit, drop the rest", "2.43 → 2.4"],
        ["5 or more: add 1 to the digit, drop the rest", "5.69 → 5.7"],
        ["Keep zeros that are part of the rounding", "0.39768 to 2 d.p. = 0.40"],
        ["Whole numbers work the same way", "346 to the nearest ten = 350"],
        ["d.p. means decimal places", "7.2483 to 3 d.p. = 7.248"]
      ]
    },

    sections: [
      { id: "q1", title: "Round whole numbers", instruction: "Tell and write the answers as quickly as possible.",
        questions: [346, 221, 685, 904].map(function (n, i) { return whole("q1a" + L[i], n, 10); })
          .concat([287, 536, 1495, 7312].map(function (n, i) { return whole("q1b" + L[i], n, 100); }))
          .concat([1250, 1940, 3678, 7355].map(function (n, i) { return whole("q1c" + L[i], n, 1000); })) },
      { id: "q2", title: "Round as instructed", instruction: "Say and write the answers.",
        questions: [dpq("q2a", "2.43", [1]), dpq("q2b", "5.69", [1]), dpq("q2c", "4.576", [2]), dpq("q2d", "8.384", [2]), dpq("q2e", "7.2483", [3]), dpq("q2f", "6.4635", [3])] },
      { id: "q3", title: "To 1 decimal place", instruction: "Creative Section.",
        questions: ["3.43", "6.47", "17.142", "25.258", "0.386"].map(function (x, i) { return dpq("q3" + L[i], x, [1]); }) },
      { id: "q4", title: "To 2 decimal places", instruction: "Keep exactly 2 digits after the point.",
        questions: ["3.416", "8.321", "21.9832", "0.1647", "0.5273"].map(function (x, i) { return dpq("q4" + L[i], x, [2]); }) },
      { id: "q5", title: "To 3 decimal places", instruction: "Keep exactly 3 digits after the point.",
        questions: ["5.1023", "12.6275", "15.47562", "0.27438", "0.08956"].map(function (x, i) { return dpq("q5" + L[i], x, [3]); }) },
      { id: "q6", title: "To 3, 2 and 1 decimal places", instruction: "Round the original number each time.",
        questions: ["4.2134", "10.6579", "8.10925", "0.39768", "0.095487"].map(function (x, i) { return dpq("q6" + L[i], x, [3, 2, 1]); }) },
      { id: "q7", title: "Products to 3 decimal places", instruction: "Multiply, then round.",
        questions: [C("q7a", "0.236 × 0.6", { dp: 3 }), C("q7b", "0.7934 × 0.12", { dp: 3 }), C("q7c", "1.053 × 2.4", { dp: 3 })] },
      { id: "q8", title: "Quotients to 4 and 2 decimal places", instruction: "Divide, then round.",
        questions: ["1/3", "2/3", "5/6", "22/7", "25/12", "28/15"].map(function (t, i) { return quot("q8" + L[i], t); }) }
    ]
  });
})();
