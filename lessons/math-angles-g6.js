/*
  Lesson: Angles (Grade 6 Mathematics)
  Source: Vedanta Excel in Mathematics, Book 6, Exercise 14.1 (pages 202-205)

  This file is DATA ONLY. The game engine (engine.js) reads it.
  See lessons/README.md for the full format.

  Angle figures use degrees measured counter-clockwise from "pointing right"
  (0 = right, 90 = up, 180 = left, 270 = down).
*/
Practice.register({
  id: "math-angles-g6",
  subject: "Mathematics",
  unit: "Angles",
  title: "Exercise 14.1",
  topic: "Measuring and naming angles",
  level: "Grade 6",
  source: "Vedanta Excel in Mathematics, Book 6 · pages 202–205",

  reference: {
    title: "Types of angles and their sizes",
    columns: ["Type", "Size", "Examples"],
    rows: [
      ["Acute angle", "More than 0° and less than 90°", "10°, 24°, 55°, 89°"],
      ["Right angle", "Exactly 90°", "90°"],
      ["Obtuse angle", "More than 90° and less than 180°", "98°, 120°, 135°, 160°"],
      ["Straight angle", "Exactly 180°", "180°"],
      ["Reflex angle", "More than 180° and less than 360°", "181°, 210°, 270°, 300°"],
      ["Complete turn", "Exactly 360°", "360°"]
    ]
  },

  sections: [
    /* ---------------- Q1 ---------------- */
    {
      id: "q1",
      title: "Name the angle",
      instruction: "Write the name, vertex and arms of each angle.",
      questions: [
        {
          id: "q1a",
          prompt: "Write the name, vertex and arms of this angle.",
          figure: {
            type: "angle", vertex: "O",
            rays: [{ deg: 0, label: "A" }, { deg: 52, label: "B" }],
            arcs: [{ from: 0, to: 52 }]
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "AOB" },
            { id: "vertex", label: "Vertex", type: "text", answer: "O" },
            { id: "arms", label: "Arms", type: "segments", answer: ["OA", "OB"] }
          ],
          help: [
            { text: "Every angle has a **vertex** (the corner point) and two **arms** (the lines that start at the vertex)." },
            { text: "Look at the corner where the two lines meet. Which letter is at that corner?",
              ask: { type: "text", answer: "O" } },
            { text: "To name the angle, read **arm letter → vertex → other arm letter**. The vertex always goes in the middle. Try it.",
              ask: { type: "angleName", answer: "AOB" } },
            { text: "The arms are the two segments that start at the vertex O. One goes to A, one goes to B." },
            { text: "Answer: Name **∠AOB** (or ∠BOA), Vertex **O**, Arms **OA and OB**." }
          ]
        },
        {
          id: "q1b",
          prompt: "Write the name, vertex and arms of this angle.",
          figure: {
            type: "angle", vertex: "Q",
            rays: [{ deg: 112, label: "P" }, { deg: 68, label: "R" }],
            arcs: [{ from: 68, to: 112 }]
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "PQR" },
            { id: "vertex", label: "Vertex", type: "text", answer: "Q" },
            { id: "arms", label: "Arms", type: "segments", answer: ["QP", "QR"] }
          ],
          help: [
            { text: "This angle points downwards, but the rules are the same. Find the corner first." },
            { text: "Which letter is at the corner where the two lines meet?",
              ask: { type: "text", answer: "Q" } },
            { text: "Now read one arm letter, then the vertex, then the other arm letter.",
              ask: { type: "angleName", answer: "PQR" } },
            { text: "Answer: Name **∠PQR** (or ∠RQP), Vertex **Q**, Arms **QP and QR**." }
          ]
        }
      ]
    },

    /* ---------------- Q2 ---------------- */
    {
      id: "q2",
      title: "Read the protractor",
      instruction: "Write the name and size of each angle.",
      questions: [
        {
          id: "q2a",
          prompt: "Read the protractor. Write the name and size of the angle.",
          figure: {
            type: "angle", vertex: "B",
            rays: [{ deg: 0, label: "A" }, { deg: 50, label: "C" }],
            protractor: { base: 0 }
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "ABC" },
            { id: "size", label: "Size", type: "number", answer: 50, unit: "°", tolerance: 2,
              mistakes: [{ answer: 130, say: "You read the wrong scale. Arm BA sits on 0 of the INNER scale, so read the inner numbers." }] }
          ],
          help: [
            { text: "A protractor has two rows of numbers: the **outer scale** and the **inner scale**. You must pick the one that starts at 0 on one of the arms." },
            { text: "Arm BA lies along the bottom line on the right. Which scale shows **0** on the right side?",
              ask: { type: "choice", options: ["Inner scale", "Outer scale"], answer: "Inner scale" } },
            { text: "Follow the inner scale up from 0 until you reach arm BC. What number does BC point to?",
              ask: { type: "number", answer: 50, tolerance: 2, unit: "°" } },
            { text: "The vertex is B, so the name is ∠ABC (B in the middle)." },
            { text: "Answer: **∠ABC = 50°**." }
          ]
        },
        {
          id: "q2b",
          prompt: "Read the protractor. Write the name and size of the angle.",
          figure: {
            type: "angle", vertex: "X",
            rays: [{ deg: 0, label: "W" }, { deg: 135, label: "Y" }],
            protractor: { base: 0 }
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "WXY" },
            { id: "size", label: "Size", type: "number", answer: 135, unit: "°", tolerance: 2,
              mistakes: [{ answer: 45, say: "45° is an acute angle, but this angle opens wider than a right angle. Read the INNER scale, which starts at 0 on arm XW." }] }
          ],
          help: [
            { text: "First decide: is this angle smaller or bigger than a right angle (90°)?",
              ask: { type: "choice", options: ["Smaller than 90°", "Bigger than 90°"], answer: "Bigger than 90°" } },
            { text: "Arm XW lies on the right, on **0 of the inner scale**. So read the inner scale." },
            { text: "Follow the inner scale from 0 round to arm XY. What number is it?",
              ask: { type: "number", answer: 135, tolerance: 2, unit: "°" } },
            { text: "Answer: **∠WXY = 135°** (it is bigger than 90°, which matches our check)." }
          ]
        },
        {
          id: "q2c",
          prompt: "This protractor is turned on its side. Write the name and size of the angle.",
          figure: {
            type: "angle", vertex: "Q",
            rays: [{ deg: 90, label: "P" }, { deg: 165, label: "R" }],
            protractor: { base: 90 }
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "PQR" },
            { id: "size", label: "Size", type: "number", answer: 75, unit: "°", tolerance: 2,
              mistakes: [{ answer: 105, say: "That is the other scale. Arm QP points straight up and sits on 0 of the INNER scale. Read the inner numbers." }] }
          ],
          help: [
            { text: "The protractor is turned, but it works the same way. Its centre is on the vertex Q." },
            { text: "Arm QP points straight up. Which scale has 0 at the top, next to P?",
              ask: { type: "choice", options: ["Inner scale", "Outer scale"], answer: "Inner scale" } },
            { text: "Count along the inner scale from 0 until you reach arm QR. What number is it?",
              ask: { type: "number", answer: 75, tolerance: 2, unit: "°" } },
            { text: "Answer: **∠PQR = 75°**. It is less than 90°, so it is an acute angle." }
          ]
        },
        {
          id: "q2d",
          prompt: "This protractor is turned on its side. Write the name and size of the angle.",
          figure: {
            type: "angle", vertex: "F",
            rays: [{ deg: 270, label: "E" }, { deg: 20, label: "G" }],
            protractor: { base: 270 }
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "EFG" },
            { id: "size", label: "Size", type: "number", answer: 110, unit: "°", tolerance: 2,
              mistakes: [{ answer: 70, say: "Check: arm FE points down and arm FG is above the flat middle line, so the angle is MORE than 90°. Use the scale that starts at 0 at the bottom." }] }
          ],
          help: [
            { text: "Arm FE points straight down. Find the scale that has **0 at the bottom**, next to E." },
            { text: "Imagine a line from F straight to the right. That would be 90°. Is arm FG above or below that line?",
              ask: { type: "choice", options: ["Above it", "Below it"], answer: "Above it" } },
            { text: "So the angle is more than 90°. Follow the scale from 0 at E round to G. What number is it?",
              ask: { type: "number", answer: 110, tolerance: 2, unit: "°" } },
            { text: "Answer: **∠EFG = 110°**." }
          ]
        }
      ]
    },

    /* ---------------- Q3 ---------------- */
    {
      id: "q3",
      title: "Measure with a protractor",
      instruction: "Use the protractor to measure each angle, then write its name and size.",
      questions: [
        {
          id: "q3a",
          prompt: "Press “Place protractor” to measure this angle. Write its name and size.",
          figure: {
            type: "angle", vertex: "O",
            rays: [{ deg: 0, label: "P" }, { deg: 70, label: "Q" }],
            arcs: [{ from: 0, to: 70 }],
            protractor: { base: 0, hidden: true }
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "POQ" },
            { id: "size", label: "Size", type: "number", answer: 70, unit: "°", tolerance: 2,
              mistakes: [{ answer: 110, say: "You used the outer scale. OP sits on 0 of the inner scale." }] }
          ],
          help: [
            { text: "Step 1: Put the centre of the protractor exactly on the vertex O. Press **Place protractor** above the picture." },
            { text: "Step 2: Line up the 0 line with arm OP. Which scale shows 0 at P?",
              ask: { type: "choice", options: ["Inner scale", "Outer scale"], answer: "Inner scale" } },
            { text: "Step 3: Read where arm OQ crosses the inner scale.",
              ask: { type: "number", answer: 70, tolerance: 2, unit: "°" } },
            { text: "Answer: **∠POQ = 70°**." }
          ]
        },
        {
          id: "q3b",
          prompt: "Press “Place protractor” to measure this angle. Write its name and size.",
          figure: {
            type: "angle", vertex: "D",
            rays: [{ deg: 0, label: "C" }, { deg: 120, label: "E" }],
            arcs: [{ from: 0, to: 120 }],
            protractor: { base: 0, hidden: true }
          },
          parts: [
            { id: "name", label: "Name", type: "angleName", answer: "CDE" },
            { id: "size", label: "Size", type: "number", answer: 120, unit: "°", tolerance: 2,
              mistakes: [{ answer: 60, say: "This angle opens wider than a right angle, so it must be more than 90°. Read the inner scale, which starts at 0 on DC." }] }
          ],
          help: [
            { text: "Before measuring, estimate. Is this angle smaller or bigger than a right angle?",
              ask: { type: "choice", options: ["Smaller than 90°", "Bigger than 90°"], answer: "Bigger than 90°" } },
            { text: "Place the protractor with its centre on D and its 0 line along DC. Press **Place protractor**." },
            { text: "Read the inner scale where arm DE crosses it.",
              ask: { type: "number", answer: 120, tolerance: 2, unit: "°" } },
            { text: "Answer: **∠CDE = 120°**." }
          ]
        }
      ]
    },

    /* ---------------- Q4 ---------------- */
    {
      id: "q4",
      title: "What type of angle?",
      instruction: "Say whether each angle is acute, right, obtuse, straight or reflex.",
      questions: [
        {
          id: "q4a",
          prompt: "What type of angle is ∠PQR?",
          figure: {
            type: "angle", vertex: "Q",
            rays: [{ deg: 0, label: "P" }, { deg: 47, label: "R" }, { deg: 90, dashed: true }],
            arcs: [{ from: 0, to: 47 }]
          },
          parts: [{ id: "type", type: "choice", options: ["Acute", "Right", "Obtuse", "Straight", "Reflex"], answer: "Acute" }],
          help: [
            { text: "The dashed line shows a **right angle** (90°) for comparison." },
            { text: "Is arm QR inside the right angle, or outside it?",
              ask: { type: "choice", options: ["Inside (smaller than 90°)", "Outside (bigger than 90°)"], answer: "Inside (smaller than 90°)" } },
            { text: "An angle smaller than 90° is called an **acute** angle." },
            { text: "Answer: **Acute angle**." }
          ]
        },
        {
          id: "q4b",
          prompt: "What type of angle is ∠AOB?",
          figure: {
            type: "angle", vertex: "O",
            rays: [{ deg: 90, label: "A" }, { deg: 270, label: "B" }],
            arcs: [{ from: 270, to: 90 }]
          },
          parts: [{ id: "type", type: "choice", options: ["Acute", "Right", "Obtuse", "Straight", "Reflex"], answer: "Straight" }],
          help: [
            { text: "Look at the arms OA and OB. Together they make one straight line." },
            { text: "How many degrees is the angle on a straight line?",
              ask: { type: "number", answer: 180, unit: "°" } },
            { text: "An angle of exactly 180° is a **straight angle**." },
            { text: "Answer: **Straight angle**." }
          ]
        },
        {
          id: "q4c",
          prompt: "What type of angle is marked at E?",
          figure: {
            type: "angle", vertex: "E",
            rays: [{ deg: 0, label: "D" }, { deg: 310, label: "F" }, { deg: 180, dashed: true }],
            arcs: [{ from: 0, to: 310, r: 22 }]
          },
          parts: [{ id: "type", type: "choice", options: ["Acute", "Right", "Obtuse", "Straight", "Reflex"], answer: "Reflex" }],
          help: [
            { text: "Look carefully at the curved mark. It does **not** go the short way between ED and EF. It goes the **long way round**." },
            { text: "The dashed line makes a straight line with ED (180°). Does the marked angle go past that dashed line?",
              ask: { type: "choice", options: ["Yes, it goes past it", "No, it stops before it"], answer: "Yes, it goes past it" } },
            { text: "So the marked angle is more than 180° (but less than 360°). That is a **reflex** angle." },
            { text: "Answer: **Reflex angle**." }
          ]
        },
        {
          id: "q4d",
          prompt: "What type of angle is ∠XYZ?",
          figure: {
            type: "angle", vertex: "Y",
            rays: [{ deg: 0, label: "X" }, { deg: 90, label: "Z" }],
            arcs: [{ from: 0, to: 90, right: true }]
          },
          parts: [{ id: "type", type: "choice", options: ["Acute", "Right", "Obtuse", "Straight", "Reflex"], answer: "Right" }],
          help: [
            { text: "Look at the corner. It is marked with a small **square**." },
            { text: "A small square always means the angle is exactly how many degrees?",
              ask: { type: "number", answer: 90, unit: "°" } },
            { text: "Answer: **Right angle**." }
          ]
        },
        {
          id: "q4e",
          prompt: "What type of angle is ∠GFE?",
          figure: {
            type: "angle", vertex: "F",
            rays: [{ deg: 330, label: "E" }, { deg: 115, label: "G" }, { deg: 60, dashed: true }],
            arcs: [{ from: 330, to: 115 }, { from: 330, to: 60, right: true, r: 14 }]
          },
          parts: [{ id: "type", type: "choice", options: ["Acute", "Right", "Obtuse", "Straight", "Reflex"], answer: "Obtuse" }],
          help: [
            { text: "The dashed line makes a **right angle** (90°) with arm FE. The small square shows this." },
            { text: "Is arm FG inside the right angle, or further round than the dashed line?",
              ask: { type: "choice", options: ["Inside (smaller than 90°)", "Further round (bigger than 90°)"], answer: "Further round (bigger than 90°)" } },
            { text: "Is it bigger than a straight line (180°)?",
              ask: { type: "choice", options: ["Yes", "No"], answer: "No" } },
            { text: "Bigger than 90° but smaller than 180° means **obtuse**." },
            { text: "Answer: **Obtuse angle**." }
          ]
        }
      ]
    },

    /* ---------------- Q5 ---------------- */
    {
      id: "q5",
      title: "Sort the angles",
      instruction: "Sort each angle into the right group.",
      questions: [
        {
          id: "q5",
          prompt: "Choose the right group for each angle.",
          parts: [80, 120, 50, 180, 210, 90, 330, 360, 150, 270].map(function (v) {
            var a = v < 90 ? "Acute" : v === 90 ? "Right" : v < 180 ? "Obtuse" : v === 180 ? "Straight" : v < 360 ? "Reflex" : "Complete turn";
            return { id: "a" + v, label: v + "°", type: "choice",
                     options: ["Acute", "Right", "Obtuse", "Straight", "Reflex", "Complete turn"], answer: a };
          }),
          help: [
            { text: "Use these key numbers: **90°** (right), **180°** (straight) and **360°** (complete turn). Compare each angle with them." },
            { text: "Under 90° is acute. Which of these is acute: 80°, 120° or 210°?",
              ask: { type: "choice", options: ["80°", "120°", "210°"], answer: "80°" } },
            { text: "Between 90° and 180° is obtuse. Which of these is obtuse: 50°, 150° or 330°?",
              ask: { type: "choice", options: ["50°", "150°", "330°"], answer: "150°" } },
            { text: "Between 180° and 360° is reflex. Which of these is reflex: 90°, 180° or 270°?",
              ask: { type: "choice", options: ["90°", "180°", "270°"], answer: "270°" } },
            { text: "Answer: Acute 50°, 80° · Right 90° · Obtuse 120°, 150° · Straight 180° · Reflex 210°, 270°, 330° · Complete turn 360°." }
          ]
        }
      ]
    },

    /* ---------------- Q6 ---------------- */
    {
      id: "q6",
      title: "Turns and right angles",
      instruction: "Fill in the blanks.",
      questions: [
        {
          id: "q6a", prompt: "The **quarter turn** of a revolving line makes an angle of ____.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 90 }], arcs: [{ from: 0, to: 90, right: true }] },
          parts: [{ id: "v", type: "number", answer: 90, unit: "°" }],
          help: [
            { text: "A complete turn (all the way round) is **360°**." },
            { text: "A quarter is 1 out of 4 equal parts. What is 360 ÷ 4?", ask: { type: "number", answer: 90 } },
            { text: "Answer: **90°** (a right angle)." }
          ]
        },
        {
          id: "q6b", prompt: "The **half turn** of a revolving line makes an angle of ____.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 180 }], arcs: [{ from: 0, to: 180 }] },
          parts: [{ id: "v", type: "number", answer: 180, unit: "°" }],
          help: [
            { text: "A complete turn is **360°**. A half turn is half of it." },
            { text: "What is 360 ÷ 2?", ask: { type: "number", answer: 180 } },
            { text: "Answer: **180°** (a straight angle)." }
          ]
        },
        {
          id: "q6c", prompt: "The **three-quarter turn** of a revolving line makes an angle of ____.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 270 }], arcs: [{ from: 0, to: 270 }] },
          parts: [{ id: "v", type: "number", answer: 270, unit: "°",
            mistakes: [{ answer: 90, say: "90° is ONE quarter. A three-quarter turn is three quarters: 90° + 90° + 90°." }] }],
          help: [
            { text: "First find one quarter turn: 360 ÷ 4.", ask: { type: "number", answer: 90 } },
            { text: "Three quarters is 3 of those. What is 3 × 90?", ask: { type: "number", answer: 270 } },
            { text: "Answer: **270°** (a reflex angle)." }
          ]
        },
        {
          id: "q6d", prompt: "The **complete turn** of a revolving line makes an angle of ____.",
          figure: { type: "angle", rays: [{ deg: 0 }], arcs: [{ from: 0, to: 360 }] },
          parts: [{ id: "v", type: "number", answer: 360, unit: "°" }],
          help: [
            { text: "A complete turn means the line goes all the way round and comes back to where it started." },
            { text: "That is 4 quarter turns. What is 4 × 90?", ask: { type: "number", answer: 360 } },
            { text: "Answer: **360°**." }
          ]
        },
        {
          id: "q6e", prompt: "The angle made by a **circle** (all the way round its centre) is ____.",
          parts: [{ id: "v", type: "number", answer: 360, unit: "°" }],
          help: [
            { text: "Going round a circle once is the same as a complete turn." },
            { text: "How many degrees is a complete turn?", ask: { type: "number", answer: 360 } },
            { text: "Answer: **360°**." }
          ]
        },
        {
          id: "q6f", prompt: "The degree measurement of **1 right angle** is ____.",
          parts: [{ id: "v", type: "number", answer: 90, unit: "°" }],
          help: [
            { text: "A right angle is the corner of a square or a page. It is a quarter turn." },
            { text: "Answer: **90°**." }
          ]
        },
        {
          id: "q6g", prompt: "The degree measurement of **2 right angles** is ____.",
          parts: [{ id: "v", type: "number", answer: 180, unit: "°" }],
          help: [
            { text: "One right angle is 90°." },
            { text: "Two right angles: what is 2 × 90?", ask: { type: "number", answer: 180 } },
            { text: "Answer: **180°** (that makes a straight line)." }
          ]
        },
        {
          id: "q6h", prompt: "If x° and 40° make a **right angle**, then x° = ____.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 40 }, { deg: 90 }],
            arcs: [{ from: 0, to: 40, label: "40°" }, { from: 40, to: 90, label: "x°", r: 40 }, { from: 0, to: 90, right: true, r: 12 }] },
          parts: [{ id: "v", type: "number", answer: 50, unit: "°",
            mistakes: [{ answer: 130, say: "Together they make a right angle (90°), not a straight angle (180°). Try 90 − 40." }] }],
          help: [
            { text: "The two angles fit together to make a right angle. So x° + 40° = ?",
              ask: { type: "number", answer: 90 } },
            { text: "To find x, take 40 away from 90. What is 90 − 40?", ask: { type: "number", answer: 50 } },
            { text: "Answer: **x = 50°**. Check: 50 + 40 = 90 ✓" }
          ]
        },
        {
          id: "q6i", prompt: "If y° and 120° make a **straight angle**, then y° = ____.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 120 }, { deg: 180 }],
            arcs: [{ from: 0, to: 120, label: "120°" }, { from: 120, to: 180, label: "y°", r: 40 }] },
          parts: [{ id: "v", type: "number", answer: 60, unit: "°" }],
          help: [
            { text: "A straight angle is how many degrees?", ask: { type: "number", answer: 180 } },
            { text: "So y + 120 = 180. What is 180 − 120?", ask: { type: "number", answer: 60 } },
            { text: "Answer: **y = 60°**. Check: 60 + 120 = 180 ✓" }
          ]
        },
        {
          id: "q6j", prompt: "If z° and 300° make an angle of **complete turn**, then z° = ____.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 60 }],
            arcs: [{ from: 0, to: 60, label: "z°", r: 34 }, { from: 60, to: 360, label: "300°", r: 22 }] },
          parts: [{ id: "v", type: "number", answer: 60, unit: "°" }],
          help: [
            { text: "A complete turn is how many degrees?", ask: { type: "number", answer: 360 } },
            { text: "So z + 300 = 360. What is 360 − 300?", ask: { type: "number", answer: 60 } },
            { text: "Answer: **z = 60°**." }
          ]
        }
      ]
    },

    /* ---------------- Q7 ---------------- */
    {
      id: "q7",
      title: "Clock turns",
      instruction: "In how many minutes will the minute hand turn through each turn?",
      questions: [
        {
          id: "q7a", prompt: "The minute hand turns through **a quarter turn**. How many minutes is that?",
          figure: { type: "clock" },
          parts: [{ id: "v", type: "number", answer: 15, unit: "min" }],
          help: [
            { text: "The minute hand goes all the way round (a complete turn) in **60 minutes**." },
            { text: "A quarter turn takes the hand from 12 to 3.", figure: { type: "clock", sweep: 15 } },
            { text: "What is 60 ÷ 4?", ask: { type: "number", answer: 15 } },
            { text: "Answer: **15 minutes**." }
          ]
        },
        {
          id: "q7b", prompt: "The minute hand turns through **a half turn**. How many minutes is that?",
          figure: { type: "clock" },
          parts: [{ id: "v", type: "number", answer: 30, unit: "min" }],
          help: [
            { text: "A complete turn takes 60 minutes. A half turn takes the hand from 12 to 6.", figure: { type: "clock", sweep: 30 } },
            { text: "What is 60 ÷ 2?", ask: { type: "number", answer: 30 } },
            { text: "Answer: **30 minutes**." }
          ]
        },
        {
          id: "q7c", prompt: "The minute hand turns through **a three-quarter turn**. How many minutes is that?",
          figure: { type: "clock" },
          parts: [{ id: "v", type: "number", answer: 45, unit: "min" }],
          help: [
            { text: "A quarter turn is 15 minutes (60 ÷ 4). A three-quarter turn takes the hand from 12 to 9.", figure: { type: "clock", sweep: 45 } },
            { text: "What is 3 × 15?", ask: { type: "number", answer: 45 } },
            { text: "Answer: **45 minutes**." }
          ]
        },
        {
          id: "q7d", prompt: "The minute hand turns through **a complete turn**. How many minutes is that?",
          figure: { type: "clock" },
          parts: [{ id: "v", type: "number", answer: 60, unit: "min" }],
          help: [
            { text: "A complete turn takes the hand from 12 all the way round back to 12.", figure: { type: "clock", sweep: 60 } },
            { text: "That is one whole hour. How many minutes are in one hour?", ask: { type: "number", answer: 60 } },
            { text: "Answer: **60 minutes**." }
          ]
        }
      ]
    },

    /* ---------------- Q8 ---------------- */
    {
      id: "q8",
      title: "Make an equation",
      instruction: "Make equations and solve them to find the unknown angles.",
      questions: [
        {
          id: "q8a", prompt: "If x° and 60° make a **right angle**, find the size of x°.",
          parts: [{ id: "v", label: "x =", type: "number", answer: 30, unit: "°" }],
          help: [
            { text: "Write the equation. A right angle is 90°, so:  **x + 60 = 90**." },
            { text: "To get x alone, subtract 60 from both sides. What is 90 − 60?", ask: { type: "number", answer: 30 } },
            { text: "Answer: **x = 30°**. Check: 30 + 60 = 90 ✓" }
          ]
        },
        {
          id: "q8b", prompt: "If y° and 100° make a **straight angle**, find the size of y°.",
          parts: [{ id: "v", label: "y =", type: "number", answer: 80, unit: "°" }],
          help: [
            { text: "Which equation is correct?",
              ask: { type: "choice", options: ["y + 100 = 90", "y + 100 = 180", "y + 100 = 360"], answer: "y + 100 = 180" } },
            { text: "Now solve it: 180 − 100 = ?", ask: { type: "number", answer: 80 } },
            { text: "Answer: **y = 80°**." }
          ]
        },
        {
          id: "q8c", prompt: "If z° and 240° make an angle of a **complete turn**, find the size of z°.",
          parts: [{ id: "v", label: "z =", type: "number", answer: 120, unit: "°" }],
          help: [
            { text: "Which equation is correct?",
              ask: { type: "choice", options: ["z + 240 = 180", "z + 240 = 360", "z − 240 = 360"], answer: "z + 240 = 360" } },
            { text: "Solve it: 360 − 240 = ?", ask: { type: "number", answer: 120 } },
            { text: "Answer: **z = 120°**." }
          ]
        },
        {
          id: "q8d", prompt: "If a° and 75° make an angle of a **quarter turn**, find the size of a°.",
          parts: [{ id: "v", label: "a =", type: "number", answer: 15, unit: "°" }],
          help: [
            { text: "How many degrees is a quarter turn?", ask: { type: "number", answer: 90 } },
            { text: "So a + 75 = 90. What is 90 − 75?", ask: { type: "number", answer: 15 } },
            { text: "Answer: **a = 15°**." }
          ]
        },
        {
          id: "q8e", prompt: "If p° and 115° make an angle of a **half turn**, find the size of p°.",
          parts: [{ id: "v", label: "p =", type: "number", answer: 65, unit: "°" }],
          help: [
            { text: "How many degrees is a half turn?", ask: { type: "number", answer: 180 } },
            { text: "So p + 115 = 180. What is 180 − 115?", ask: { type: "number", answer: 65 } },
            { text: "Answer: **p = 65°**." }
          ]
        }
      ]
    },

    /* ---------------- Q9 ---------------- */
    {
      id: "q9",
      title: "Minute hand and degrees",
      instruction: "The minute hand turns 360° in 60 minutes. Use the unitary method.",
      questions: [
        {
          id: "q9a", prompt: "Find the angle turned by the minute hand in **10 minutes**.",
          figure: { type: "clock", sweep: 10 },
          parts: [{ id: "v", type: "number", answer: 60, unit: "°" }],
          help: [
            { text: "Unitary method: first find the angle for **1 minute**. In 60 minutes the hand turns 360°." },
            { text: "In 1 minute it turns 360 ÷ 60 = ?", ask: { type: "number", answer: 6, unit: "°" } },
            { text: "In 10 minutes it turns 10 × 6 = ?", ask: { type: "number", answer: 60, unit: "°" } },
            { text: "Answer: **60°**." }
          ]
        },
        {
          id: "q9b", prompt: "Find the angle turned by the minute hand in **25 minutes**.",
          figure: { type: "clock", sweep: 25 },
          parts: [{ id: "v", type: "number", answer: 150, unit: "°" }],
          help: [
            { text: "In 1 minute the hand turns 360 ÷ 60 degrees.", ask: { type: "number", answer: 6, unit: "°" } },
            { text: "In 25 minutes it turns 25 × 6 = ?", ask: { type: "number", answer: 150, unit: "°" } },
            { text: "Answer: **150°**." }
          ]
        },
        {
          id: "q9c", prompt: "Find the time taken by the minute hand to turn through **90°**.",
          parts: [{ id: "v", type: "number", answer: 15, unit: "min" }],
          help: [
            { text: "Turn it round: the hand turns 6° in 1 minute (360 ÷ 60)." },
            { text: "How many 6° steps fit into 90°? What is 90 ÷ 6?", ask: { type: "number", answer: 15 } },
            { text: "Answer: **15 minutes**. (90° is a quarter turn, and a quarter of an hour is 15 minutes.)" }
          ]
        },
        {
          id: "q9d", prompt: "Find the time taken by the minute hand to turn through **210°**.",
          parts: [{ id: "v", type: "number", answer: 35, unit: "min" }],
          help: [
            { text: "The hand turns 6° in 1 minute." },
            { text: "What is 210 ÷ 6?", ask: { type: "number", answer: 35 } },
            { text: "Answer: **35 minutes**.", figure: { type: "clock", sweep: 35 } }
          ]
        }
      ]
    },

    /* ---------------- Q10 ---------------- */
    {
      id: "q10",
      title: "Use the figure",
      instruction: "Answer the questions from the figure.",
      questions: [
        {
          id: "q10a", prompt: "What is the measurement of ∠AOB?",
          figure: {
            type: "angle", vertex: "O",
            rays: [{ deg: 0, label: "A" }, { deg: 35, label: "C" }, { deg: 90, label: "B" }],
            arcs: [{ from: 0, to: 35, label: "35°", r: 40 }, { from: 35, to: 90, label: "x°", r: 26 }, { from: 0, to: 90, right: true, r: 11 }]
          },
          parts: [{ id: "v", label: "∠AOB =", type: "number", answer: 90, unit: "°" }],
          help: [
            { text: "Look at the corner at O between OA and OB. What mark is there?" },
            { text: "The small square means a right angle. How many degrees is that?", ask: { type: "number", answer: 90 } },
            { text: "Answer: **∠AOB = 90°**." }
          ]
        },
        {
          id: "q10b", prompt: "Make an equation using ∠AOC, ∠COB and ∠AOB.",
          figure: {
            type: "angle", vertex: "O",
            rays: [{ deg: 0, label: "A" }, { deg: 35, label: "C" }, { deg: 90, label: "B" }],
            arcs: [{ from: 0, to: 35, label: "35°", r: 40 }, { from: 35, to: 90, label: "x°", r: 26 }, { from: 0, to: 90, right: true, r: 11 }]
          },
          parts: [{ id: "v", type: "choice", options: ["x° + 35° = 90°", "x° + 90° = 35°", "x° + 35° = 180°", "x° = 35° + 90°"], answer: "x° + 35° = 90°" }],
          help: [
            { text: "∠AOC is 35°, ∠COB is x°. Together they fill ∠AOB." },
            { text: "So ∠AOC + ∠COB = ∠AOB. ∠AOB is how many degrees?", ask: { type: "number", answer: 90 } },
            { text: "Answer: **x° + 35° = 90°**." }
          ]
        },
        {
          id: "q10c", prompt: "Solve the equation and find the size of x°.",
          figure: {
            type: "angle", vertex: "O",
            rays: [{ deg: 0, label: "A" }, { deg: 35, label: "C" }, { deg: 90, label: "B" }],
            arcs: [{ from: 0, to: 35, label: "35°", r: 40 }, { from: 35, to: 90, label: "x°", r: 26 }, { from: 0, to: 90, right: true, r: 11 }]
          },
          parts: [{ id: "v", label: "x =", type: "number", answer: 55, unit: "°",
            mistakes: [{ answer: 65, say: "Check your subtraction: 90 − 35. Count up from 35 to 90." }, { answer: 125, say: "You added. Since x + 35 = 90, you need to subtract: 90 − 35." }] }],
          help: [
            { text: "Start from the equation: x + 35 = 90." },
            { text: "Subtract 35 from 90. Tip: 90 − 30 = 60, then 60 − 5 = ?", ask: { type: "number", answer: 55 } },
            { text: "Answer: **x = 55°**. Check: 55 + 35 = 90 ✓" }
          ]
        }
      ]
    },

    /* ---------------- Q11 ---------------- */
    {
      id: "q11",
      title: "Find the unknown angle",
      instruction: "Calculate the size of the unknown angles.",
      questions: [
        {
          id: "q11a", prompt: "Find x°.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 30 }, { deg: 90 }],
            arcs: [{ from: 0, to: 30, label: "30°", r: 48 }, { from: 30, to: 90, label: "x°", r: 30 }, { from: 0, to: 90, right: true, r: 11 }] },
          parts: [{ id: "v", label: "x =", type: "number", answer: 60, unit: "°" }],
          help: [
            { text: "The square in the corner tells you the whole angle is 90°. Hint: x° + 30° = 90°." },
            { text: "What is 90 − 30?", ask: { type: "number", answer: 60 } },
            { text: "Answer: **x = 60°**." }
          ]
        },
        {
          id: "q11b", prompt: "Find y°.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 270 }, { deg: 310 }],
            arcs: [{ from: 270, to: 310, label: "40°", r: 34 }, { from: 310, to: 360, label: "y°", r: 46 }, { from: 270, to: 360, right: true, r: 11 }] },
          parts: [{ id: "v", label: "y =", type: "number", answer: 50, unit: "°" }],
          help: [
            { text: "The corner has a square, so the two angles together make 90°." },
            { text: "Write the equation: y + 40 = ?", ask: { type: "number", answer: 90 } },
            { text: "What is 90 − 40?", ask: { type: "number", answer: 50 } },
            { text: "Answer: **y = 50°**." }
          ]
        },
        {
          id: "q11c", prompt: "Find x°. Then find 2x°.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 30 }, { deg: 90 }],
            arcs: [{ from: 0, to: 30, label: "x°", r: 48 }, { from: 30, to: 90, label: "2x°", r: 30 }, { from: 0, to: 90, right: true, r: 11 }] },
          parts: [
            { id: "x", label: "x =", type: "number", answer: 30, unit: "°" },
            { id: "x2", label: "2x =", type: "number", answer: 60, unit: "°" }
          ],
          help: [
            { text: "The two angles make a right angle: **2x + x = 90**." },
            { text: "2x + x is how many x's?", ask: { type: "number", answer: 3 } },
            { text: "So 3x = 90. What is 90 ÷ 3?", ask: { type: "number", answer: 30 } },
            { text: "So x = 30°, and 2x = 2 × 30 = 60°." },
            { text: "Answer: **x = 30°, 2x = 60°**. Check: 30 + 60 = 90 ✓" }
          ]
        },
        {
          id: "q11d", prompt: "Find p°.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 30 }, { deg: 120 }],
            arcs: [{ from: 0, to: 120, label: "120°", r: 50 }, { from: 0, to: 30, label: "p°", r: 68 }, { from: 30, to: 120, right: true, r: 11 }] },
          parts: [{ id: "v", label: "p =", type: "number", answer: 30, unit: "°" }],
          help: [
            { text: "The big angle (120°) is made of two parts: p° and a right angle." },
            { text: "The right angle is how many degrees?", ask: { type: "number", answer: 90 } },
            { text: "So p + 90 = 120. What is 120 − 90?", ask: { type: "number", answer: 30 } },
            { text: "Answer: **p = 30°**." }
          ]
        },
        {
          id: "q11e", prompt: "Find y°. Then find 2y°.",
          figure: { type: "angle", rays: [{ deg: 200 }, { deg: 250 }, { deg: 350 }],
            arcs: [{ from: 200, to: 250, label: "y°", r: 28 }, { from: 250, to: 350, label: "2y°", r: 28 }, { from: 200, to: 350, label: "150°", r: 52 }] },
          parts: [
            { id: "y", label: "y =", type: "number", answer: 50, unit: "°" },
            { id: "y2", label: "2y =", type: "number", answer: 100, unit: "°" }
          ],
          help: [
            { text: "The angles y° and 2y° together make the whole 150° angle: **y + 2y = 150**." },
            { text: "y + 2y is how many y's?", ask: { type: "number", answer: 3 } },
            { text: "So 3y = 150. What is 150 ÷ 3?", ask: { type: "number", answer: 50 } },
            { text: "Answer: **y = 50°, 2y = 100°**. Check: 50 + 100 = 150 ✓" }
          ]
        },
        {
          id: "q11f", prompt: "Find a°.",
          figure: { type: "angle", rays: [{ deg: 0 }, { deg: 60 }],
            arcs: [{ from: 0, to: 60, label: "a°", r: 34 }, { from: 60, to: 360, label: "300°", r: 22, dashed: true }] },
          parts: [{ id: "v", label: "a =", type: "number", answer: 60, unit: "°" }],
          help: [
            { text: "The 300° angle and a° go all the way round the point. That is a complete turn." },
            { text: "A complete turn is how many degrees?", ask: { type: "number", answer: 360 } },
            { text: "So a + 300 = 360. What is 360 − 300?", ask: { type: "number", answer: 60 } },
            { text: "Answer: **a = 60°**." }
          ]
        },
        {
          id: "q11g", prompt: "Find x°. Then find 3x°.",
          figure: { type: "angle", rays: [{ deg: 30 }, { deg: 120 }],
            arcs: [{ from: 30, to: 120, label: "x°", r: 34 }, { from: 120, to: 390, label: "3x°", r: 22 }] },
          parts: [
            { id: "x", label: "x =", type: "number", answer: 90, unit: "°" },
            { id: "x3", label: "3x =", type: "number", answer: 270, unit: "°" }
          ],
          help: [
            { text: "x° and 3x° go all the way round the point, so they add up to 360°: **x + 3x = 360**." },
            { text: "x + 3x is how many x's?", ask: { type: "number", answer: 4 } },
            { text: "So 4x = 360. What is 360 ÷ 4?", ask: { type: "number", answer: 90 } },
            { text: "Answer: **x = 90°, 3x = 270°**. Check: 90 + 270 = 360 ✓" }
          ]
        },
        {
          id: "q11h", prompt: "Find x°. Then find each angle.",
          figure: { type: "angle", rays: [{ deg: 40 }, { deg: 200 }, { deg: 320 }],
            arcs: [{ from: 40, to: 200, label: "4x°", r: 24 }, { from: 200, to: 320, label: "3x°", r: 24 }, { from: 320, to: 400, label: "2x°", r: 24 }] },
          parts: [
            { id: "x", label: "x =", type: "number", answer: 40, unit: "°" },
            { id: "x4", label: "4x =", type: "number", answer: 160, unit: "°" },
            { id: "x3", label: "3x =", type: "number", answer: 120, unit: "°" },
            { id: "x2", label: "2x =", type: "number", answer: 80, unit: "°" }
          ],
          help: [
            { text: "The three angles go all the way round the point: **4x + 3x + 2x = 360**." },
            { text: "4x + 3x + 2x is how many x's?", ask: { type: "number", answer: 9 } },
            { text: "So 9x = 360. What is 360 ÷ 9?", ask: { type: "number", answer: 40 } },
            { text: "Now multiply: 4 × 40 = 160, 3 × 40 = 120, 2 × 40 = 80." },
            { text: "Answer: **x = 40°**, 4x = 160°, 3x = 120°, 2x = 80°. Check: 160 + 120 + 80 = 360 ✓" }
          ]
        }
      ]
    }
  ]
});
