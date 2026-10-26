/*
  Exercise 17.5: Surface area and volume of cuboids and cubes.
  Source: Vedanta Excel in Mathematics, Book 6, pages 265-266.
  DATA ONLY (plus small helpers). See lessons/README.md for the format.
*/
(function () {
  var L = "abcdefghijklmnop";
  function r3(v) { return Math.round(v * 1000) / 1000; }
  function nm(id, label, answer, unit) { return { id: id, label: label, type: "number", answer: r3(answer), unit: unit }; }
  function multi(id, prompt, rows, figure) { // [label, value, unit, step] | [label, expr, "expr", step]
    var q = { id: id, prompt: prompt, parts: rows.map(function (r, i) { return r[2] === "expr" ? { id: L[i], label: r[0], type: "expr", form: "any", answer: r[1], example: r[1] } : nm(L[i], r[0], r[1], r[2]); }),
      help: rows.map(function (r) { return { text: r[3] }; }).concat([{ text: "Answer: **" + rows.map(function (r) { return r[2] === "expr" ? r[1].replace("^3", "³") : r[2] ? r3(r[1]) + " " + r[2] : "Rs " + r3(r[1]); }).join(", ") + "**." }]) };
    if (figure) q.figure = figure;
    return q;
  }
  function tsa(l, b, h) { return 2 * (l * b + b * h + l * h); }
  function cuboid(id, l, b, h, u) {
    u = u || "cm";
    return multi(id, "Cuboid: **l = " + l + " " + u + ", b = " + b + " " + u + ", h = " + h + " " + u + "**. Find its total surface area and volume.", [
      ["Surface area", tsa(l, b, h), u + "²", "Total surface area = 2(lb + bh + lh) = 2(" + r3(l * b) + " + " + r3(b * h) + " + " + r3(l * h) + ") = 2 × " + r3(l * b + b * h + l * h) + " = " + r3(tsa(l, b, h)) + " " + u + "²."],
      ["Volume", l * b * h, u + "³", "Volume = l × b × h = " + l + " × " + b + " × " + h + " = " + r3(l * b * h) + " " + u + "³."]]);
  }
  function cube(id, l) {
    return multi(id, "Cube: **l = " + l + " cm**. Find its total surface area and volume.", [
      ["Surface area", 6 * l * l, "cm²", "Total surface area = 6l² = 6 × " + l + " × " + l + " = 6 × " + r3(l * l) + " = " + r3(6 * l * l) + " cm²."],
      ["Volume", l * l * l, "cm³", "Volume = l³ = " + l + " × " + l + " × " + l + " = " + r3(l * l * l) + " cm³."]]);
  }
  function box(l, b, h, lab) { return { type: "solid", kind: "cuboid", l: l, b: b, h: h, labels: lab }; }

  Practice.register({
    id: "math-measure-g6-ex17-5",
    subject: "Mathematics",
    unit: "Perimeter, Area and Volume",
    title: "Exercise 17.5",
    topic: "Surface area and volume",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 265–266",

    reference: {
      title: "Cuboid and cube",
      columns: ["What", "Formula"],
      rows: [
        ["Volume of a cuboid", "V = l × b × h"],
        ["Total surface area of a cuboid", "2(lb + bh + lh)"],
        ["Volume of a cube", "V = l × l × l = l³"],
        ["Total surface area of a cube", "6l²"],
        ["Side of a cube from volume", "l × l × l = V (5 × 5 × 5 = 125)"],
        ["Litres", "1 m³ = 1000 litres, 1000 cm³ = 1 litre"],
        ["Units", "area in cm², volume in cm³"],
        ["How to type a formula", "lbh, l^3"]
      ]
    },

    sections: [
      { id: "q1", title: "Quick volumes", instruction: "Say and write the volume of these solids as quickly as possible.",
        questions: [
          multi("q1a", "Find the volume.", [["Volume", 24, "cm³", "V = l × b × h = 4 × 3 × 2 = 24 cm³."]], box(4, 3, 2, { l: "4 cm", b: "3 cm", h: "2 cm" })),
          multi("q1b", "Find the volume.", [["Volume", 27, "cm³", "It is a cube: 3 × 3 × 3 = 27 cm³."]], { type: "solid", kind: "cube", l: 3, labels: { l: "3 cm", b: "3 cm", h: "3 cm" } }),
          multi("q1c", "Find the volume.", [["Volume", 20, "cm³", "V = 2 × 1 × 10 = 20 cm³."]], box(2, 1, 10, { l: "2 cm", b: "1 cm", h: "10 cm" }))
        ] },
      { id: "q2", title: "Quick cubes and cuboids", instruction: "Say and write the answers.",
        questions: [
          multi("q2a", "**l = 2 cm**: volume and surface area of the cube?", [["Volume", 8, "cm³", "2 × 2 × 2 = 8 cm³."], ["Surface area", 24, "cm²", "6 × 2 × 2 = 24 cm²."]]),
          multi("q2b", "**l = 3 cm**: volume and surface area of the cube?", [["Volume", 27, "cm³", "3 × 3 × 3 = 27 cm³."], ["Surface area", 54, "cm²", "6 × 3 × 3 = 54 cm²."]]),
          multi("q2c", "**l = 5 cm, b = 4 cm, h = 2 cm**: volume of the cuboid?", [["Volume", 40, "cm³", "5 × 4 × 2 = 40 cm³."]]),
          multi("q2d", "**l = 10 cm, b = 5 cm, h = 4 cm**: volume of the cuboid?", [["Volume", 200, "cm³", "10 × 5 × 4 = 200 cm³."]])
        ] },
      { id: "q3", title: "Cuboids", instruction: "Find the total surface area and volume of the cuboids.",
        questions: [cuboid("q3a", 5, 4, 3), cuboid("q3b", 8, 5, 4.5), cuboid("q3c", 10.5, 4, 6), cuboid("q3d", 15.8, 12.5, 10)] },
      { id: "q4", title: "Cubes", instruction: "Find the total surface area and volume of the cubes.",
        questions: [cube("q4a", 2), cube("q4b", 5), cube("q4c", 4.5), cube("q4d", 7.6)] },
      { id: "q5", title: "Blocks and tanks", instruction: "Answer each part.",
        questions: [
          (function () { var q = cuboid("q5a", 16, 12, 5); q.prompt = "A rectangular block is **16 cm** long, **12 cm** broad and **5 cm** high. Find its total surface area and volume."; return q; })(),
          (function () { var q = cube("q5b", 9); q.prompt = "A cubical block is **9 cm** long. Find its total surface area and volume."; return q; })(),
          multi("q5c", "A rectangular tank is **2 m** long, **1.5 m** broad and **1 m** high. (i) What is its volume? (ii) If it is full of water, what is the volume of water? (iii) If 1 m³ = 1000 litres, how many litres does it hold?", [
            ["(i) Volume", 3, "m³", "2 × 1.5 × 1 = 3 m³."], ["(ii) Water", 3, "m³", "Full of water, so the water fills the whole tank: 3 m³."], ["(iii) Litres", 3000, "litres", "3 × 1000 = 3000 litres."]]),
          multi("q5d", "A rectangular tank is **80 cm** long, **60 cm** broad and **50 cm** high. (i) What is its volume? (ii) What is the volume of water when it is full? (iii) If 1000 cm³ = 1 litre, how many litres does it hold?", [
            ["(i) Volume", 240000, "cm³", "80 × 60 × 50 = 240000 cm³."], ["(ii) Water", 240000, "cm³", "Same as the tank: 240000 cm³."], ["(iii) Litres", 240, "litres", "240000 ÷ 1000 = 240 litres."]])
        ] },
      { id: "q6", title: "Work back from a cube", instruction: "Find the side first.",
        questions: [
          multi("q6a", "The total surface area of a cube is **24 cm²**. (i) Find its length. (ii) Find its volume.", [["(i) Length", 2, "cm", "6l² = 24, so l² = 4 and l = 2 cm."], ["(ii) Volume", 8, "cm³", "2 × 2 × 2 = 8 cm³."]]),
          multi("q6b", "The volume of a cube is **125 cm³**. (i) Find its length. (ii) Find its total surface area.", [["(i) Length", 5, "cm", "5 × 5 × 5 = 125, so l = 5 cm."], ["(ii) Surface area", 150, "cm²", "6 × 5 × 5 = 150 cm²."]]),
          multi("q6c", "The total surface area of a cube is **96 cm²**. Find its volume.", [["Length", 4, "cm", "6l² = 96, so l² = 16 and l = 4 cm."], ["Volume", 64, "cm³", "4 × 4 × 4 = 64 cm³."]]),
          multi("q6d", "The volume of a cube is **27 cm³**. Find its total surface area.", [["Length", 3, "cm", "3 × 3 × 3 = 27, so l = 3 cm."], ["Surface area", 54, "cm²", "6 × 3 × 3 = 54 cm²."]])
        ] },
      { id: "q7", title: "Wooden blocks", instruction: "Answer each part.",
        questions: [
          multi("q7a", "A wooden block is **25 cm** long, **16 cm** broad and **10 cm** thick. (i) Write the formula for its volume. (ii) Find its volume. (iii) If wood costs 15 paisa per cm³, find the cost of the wood.", [
            ["(i) Volume", "lbh", "expr", "V = l × b × h."], ["(ii) Volume", 4000, "cm³", "25 × 16 × 10 = 4000 cm³."], ["(iii) Cost = Rs", 600, "", "4000 × 15 paisa = 60000 paisa = Rs 600 (100 paisa = Rs 1)."]],
            box(25, 10, 16, { l: "25 cm", b: "10 cm", h: "16 cm" })),
          multi("q7b", "A wooden block is **20 cm** long, **15 cm** broad and **8 cm** thick. (i) Find its total surface area. (ii) Lying flat on a table, what area of the table does it cover? (iii) Standing with its length upright, what area does it cover?", [
            ["(i) Surface area", 1160, "cm²", "2(20 × 15 + 15 × 8 + 20 × 8) = 2(300 + 120 + 160) = 2 × 580 = 1160 cm²."], ["(ii) Lying flat", 300, "cm²", "It rests on its length and breadth: 20 × 15 = 300 cm²."],
            ["(iii) Standing up", 120, "cm²", "Now it rests on its breadth and thickness: 15 × 8 = 120 cm²."]])
        ] },
      { id: "q8", title: "Find the sides", instruction: "Answer each part.",
        questions: [
          multi("q8a", "The length of a cuboid is two times its breadth and its height is **2 cm**. If the volume is **36 cm³**, find its length and breadth.", [
            ["Breadth", 3, "cm", "Let the breadth be x. Length = 2x. 2x × x × 2 = 36, so 4x² = 36, x² = 9 and x = 3 cm."], ["Length", 6, "cm", "Length = 2 × 3 = 6 cm."]]),
          multi("q8b", "The breadth of a block is half its length and its height is **4 cm**. If the volume is **200 cm³**, find (i) its length and breadth (ii) its total surface area.", [
            ["Length", 10, "cm", "Let the length be 2x and the breadth x. 2x × x × 4 = 200, so 8x² = 200, x² = 25 and x = 5. Length = 10 cm."], ["Breadth", 5, "cm", "Breadth = 5 cm."],
            ["(ii) Surface area", 220, "cm²", "2(10 × 5 + 5 × 4 + 10 × 4) = 2(50 + 20 + 40) = 220 cm²."]])
        ] },
      { id: "q9", title: "Ratio and litres", instruction: "Creative Section B.",
        questions: [
          multi("q9a", "The length, breadth and height of a cuboid are in the ratio **5 : 3 : 2**. If its volume is **240 cm³**, find its total surface area.", [
            ["Length", 10, "cm", "Let them be 5x, 3x and 2x. 5x × 3x × 2x = 30x³ = 240, so x³ = 8 and x = 2. Length = 10 cm."], ["Breadth", 6, "cm", "3 × 2 = 6 cm."], ["Height", 4, "cm", "2 × 2 = 4 cm."],
            ["Surface area", 248, "cm²", "2(10 × 6 + 6 × 4 + 10 × 4) = 2(60 + 24 + 40) = 248 cm²."]]),
          multi("q9b", "A rectangular water tank is **3 m** long, **2 m** wide and **1.5 m** high. How many litres of water can it hold? (1 m³ = 1000 litres)", [
            ["Volume", 9, "m³", "3 × 2 × 1.5 = 9 m³."], ["Litres", 9000, "litres", "9 × 1000 = 9000 litres."]])
        ] }
    ]
  });
})();
