/*
  Exercise 15.4: Parts of a circle.
  Source: Vedanta Excel in Mathematics, Book 6, pages 229-230.
  DATA ONLY. See lessons/README.md for the format.
  The circle is drawn with the "geo" figure: circles: [...] and shade: [...].
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function rad(d) { return d * Math.PI / 180; }
  function on(deg, labDir) { return [90 * Math.cos(rad(deg)), 90 * Math.sin(rad(deg)), labDir == null ? deg : labDir]; }

  var PARTS = ["Centre", "Radius", "Radii", "Diameter", "Chord", "Chords", "Sector", "Segment", "Arc", "Circumference"];
  var TF = ["True", "False"];
  var MANY = ["Only one", "Two", "Four", "Infinitely many"];

  var FIG = {
    type: "geo",
    points: { O: [0, 0, 250], A: on(180), B: on(0), C: on(50), Q: on(25), D: on(210), E: on(330), P: on(270) },
    circles: [{ at: "O", r: 90 }],
    shade: [{ at: "O", r: 90, from: 0, to: 50, kind: "sector", tone: "a" }, { at: "O", r: 90, from: 210, to: 330, kind: "segment", tone: "b" }],
    lines: [["A", "B"], ["O", "C"], ["D", "E"]],
    marks: []
  };

  function part(id, prompt, answer, help) {
    return { id: id, prompt: prompt, figure: FIG, parts: [ch("v", "", PARTS, answer)], help: help };
  }
  function tf(id, prompt, answer, help) {
    return { id: id, prompt: prompt, parts: [ch("v", "", TF, answer)], help: help };
  }

  Practice.register({
    id: "math-triangles-g6-ex15-4",
    subject: "Mathematics",
    unit: "Triangles and Polygons",
    title: "Exercise 15.4",
    topic: "Parts of a circle",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 229–230",

    reference: {
      title: "Parts of a circle",
      columns: ["Part", "What it is"],
      rows: [
        ["Centre", "The middle point. Every point on the circle is the same distance from it."],
        ["Radius (plural radii)", "A line from the centre to the circle"],
        ["Diameter", "A chord through the centre. Diameter = 2 × radius."],
        ["Chord", "A line joining any two points on the circle"],
        ["Arc", "A piece of the circle's edge"],
        ["Circumference", "The whole edge (the distance all round)"],
        ["Sector", "Region between two radii and their arc (a pizza slice)"],
        ["Segment", "Region between a chord and its arc"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Name the parts", instruction: "Look at the circle. Write the correct names of its parts.",
        questions: [
          part("q1a", "O is the ____.", "Centre", [{ text: "O is the point in the middle. A, B and C are all the same distance from it." }, { text: "Answer: **centre**." }]),
          part("q1b", "OC is a ____.", "Radius", [{ text: "OC goes from the centre O to a point C on the circle." }, { text: "Answer: **radius**." }]),
          part("q1c", "OA, OB and OC are ____.", "Radii", [{ text: "Each one joins the centre to the circle. There are more than one, so use the plural." }, { text: "Answer: **radii**." }]),
          part("q1d", "AB is a ____.", "Diameter", [{ text: "AB joins two points on the circle and passes through the centre O." }, { text: "Answer: **diameter**." }]),
          part("q1e", "DE is a ____.", "Chord", [{ text: "DE joins two points on the circle, but it does **not** pass through the centre." }, { text: "Answer: **chord**." }]),
          part("q1f", "AB and DE are ____.", "Chords", [{ text: "Both join two points on the circle. A diameter is a special chord." }, { text: "Answer: **chords**." }]),
          part("q1g", "Region BOC, bounded by the radii OB and OC and the arc BQC (blue), is a ____.", "Sector",
            [{ text: "The blue region has two radii as its sides and an arc as its curved edge, like a pizza slice." }, { text: "Answer: **sector**." }]),
          part("q1h", "Region DPE, bounded by the chord DE and the arc DPE (yellow), is a ____.", "Segment",
            [{ text: "The yellow region is cut off by a chord, not by radii." }, { text: "Answer: **segment**." }])
        ]
      },
      {
        id: "q2", title: "True or false", instruction: "Write True or False for each statement.",
        questions: [
          tf("q2a", "Circle is a plane figure.", "True", [{ text: "A circle is drawn flat on paper, so it is a plane (flat) figure." }]),
          tf("q2b", "A circle has exactly one centre.", "True", [{ text: "Only one point is the same distance from every point on the circle." }]),
          tf("q2c", "Radius is the line segment that joins any two points of the circumference.", "False",
            [{ text: "A radius joins the **centre** to the circle. A line joining two points of the circle is a **chord**." }]),
          tf("q2d", "All the radii of a circle are equal.", "True", [{ text: "Every point on the circle is the same distance from the centre." }]),
          tf("q2e", "Every chord is a diameter.", "False", [{ text: "Only a chord that passes through the centre is a diameter. DE in Q1 is a chord but not a diameter." }]),
          tf("q2f", "Diameter divides the circle into two halves.", "True", [{ text: "A diameter goes through the centre, so it cuts the circle into two equal semicircles." }]),
          tf("q2g", "The diameter of the circle is double of its radius.", "True", [{ text: "A diameter is one radius on each side of the centre: d = 2r." }]),
          tf("q2h", "A diameter is the longest chord in a circle.", "True", [{ text: "Chords get longer as they move closer to the centre. The one through the centre is the longest." }]),
          tf("q2i", "Sector is the part of circle enclosed within two radii and their corresponding arc.", "True", [{ text: "That is the definition of a sector (the blue region in Q1)." }]),
          tf("q2j", "The segment of a circle is the region between the chord and corresponding arc.", "True", [{ text: "That is the definition of a segment (the yellow region in Q1)." }])
        ]
      },
      {
        id: "q3", title: "Circle facts", instruction: "Answer these questions.",
        questions: [
          { id: "q3a", prompt: "Which of these objects is circular?", parts: [ch("v", "", ["A coin", "A book", "A brick", "A ruler"], "A coin")],
            help: [{ text: "A circle is a round, flat shape where every edge point is the same distance from the middle. Other circular things: a bangle, a wheel, a clock face, a plate." }, { text: "Answer: **a coin**." }] },
          { id: "q3b", prompt: "The circumference of a circle is ____.",
            parts: [ch("v", "", ["The whole curved edge (boundary) of the circle", "The line through the centre", "The middle point", "Half of the circle"], "The whole curved edge (boundary) of the circle")],
            help: [{ text: "Run your finger all the way round the edge of a coin. That path is the circumference." }] },
          { id: "q3c", prompt: "Which line is a radius, and which is a diameter?",
            parts: [ch("r", "Radius", ["Centre to the circle", "Circle to circle through the centre", "Circle to circle, not through the centre"], "Centre to the circle"),
                    ch("d", "Diameter", ["Centre to the circle", "Circle to circle through the centre", "Circle to circle, not through the centre"], "Circle to circle through the centre")],
            help: [{ text: "Radius: from the centre out to the circle (OC in Q1)." }, { text: "Diameter: across the circle through the centre (AB in Q1)." }] },
          { id: "q3d", prompt: "Diameter = 2 × radius. Find the diameter of a circle whose radius is 5 cm.", parts: [{ id: "v", label: "Diameter =", type: "number", answer: 10, unit: "cm" }],
            help: [{ text: "Diameter = 2 × radius = 2 × 5" }, { text: "Answer: **10 cm**." }] },
          { id: "q3e", prompt: "In what condition does a chord of a circle become a diameter?",
            parts: [ch("v", "", ["When it passes through the centre", "When it is very short", "When it touches the circle at one point", "Never"], "When it passes through the centre")],
            help: [{ text: "Compare AB and DE in Q1. Which one passes through O?" }, { text: "Answer: when it **passes through the centre**." }] },
          { id: "q3f", prompt: "What is the difference between a sector and a segment?",
            parts: [ch("v", "", ["Sector: two radii and an arc. Segment: a chord and an arc.", "Sector: a chord and an arc. Segment: two radii and an arc.", "They are the same"], "Sector: two radii and an arc. Segment: a chord and an arc.")],
            help: [{ text: "Look at Q1: the blue sector has two radii as sides. The yellow segment has a chord as its straight side." }] }
        ]
      },
      {
        id: "q4", title: "How many?", instruction: "Think about what you can draw in a circle.",
        questions: [
          { id: "q4a", prompt: "How many radii can you draw in a circle?", parts: [ch("v", "", MANY, "Infinitely many")],
            help: [{ text: "You can join the centre to **any** point on the circle, and the circle has endless points." }, { text: "Answer: **infinitely many**." }] },
          { id: "q4b", prompt: "How many chords can be drawn in a circle?", parts: [ch("v", "", MANY, "Infinitely many")],
            help: [{ text: "Any two points on the circle make a chord. There are endless pairs." }, { text: "Answer: **infinitely many**." }] },
          { id: "q4c", prompt: "How many circles can be drawn through two given points?", parts: [ch("v", "", MANY, "Infinitely many")],
            help: [{ text: "Mark two dots. You can draw a small circle through them, a bigger one, a bigger one again… each with its centre on the line exactly halfway between the dots." }, { text: "Answer: **infinitely many**." }] }
        ]
      }
    ]
  });
})();
