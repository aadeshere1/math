/*
  Exercise 14.2: Pairs of angles (adjacent, linear pair, vertically opposite,
  complementary, supplementary).
  Source: Vedanta Excel in Mathematics, Book 6, pages 207-209.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  // Small helpers to keep the data short. They only build plain objects.
  function n(id, label, answer, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: "°", mistakes: mistakes }; }
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  var PAIR_TYPES = ["Adjacent angles", "Linear pair", "Vertically opposite angles", "Complementary angles"];

  var FIG_Q1 = {
    type: "angle", vertex: "O",
    rays: [{ deg: 0, label: "B" }, { deg: 40, label: "C" }, { deg: 90, label: "E" }, { deg: 180, label: "A" }, { deg: 220, label: "D" }],
    arcs: [{ from: 40, to: 90, right: true, r: 12 }]
  };
  // the right angle is between OE and OB, so mark it there
  FIG_Q1.arcs = [{ from: 0, to: 90, right: true, r: 12 }];
  var Q1_NAMES = ["∠BOC", "∠AOD", "∠BOD", "∠AOC", "∠COE", "∠AOE"];

  var FIG_Q3_1 = { type: "angle", vertex: "O", rays: [{ deg: 0, label: "A" }, { deg: 22, label: "B" }, { deg: 52, label: "C" }],
    arcs: [{ from: 0, to: 22, label: "a", r: 34 }, { from: 22, to: 52, label: "b", r: 50 }] };
  var FIG_Q3_2 = { type: "angle", vertex: "O", rays: [{ deg: 0, label: "P" }, { deg: 55, label: "Q" }, { deg: 125, label: "R" }, { deg: 180, label: "S" }],
    arcs: [{ from: 0, to: 55, label: "a", r: 26 }, { from: 125, to: 180, label: "b", r: 26 }] };
  var FIG_Q3_3 = { type: "angle", vertex: "O", rays: [{ deg: 0, label: "X" }, { deg: 120, label: "Y" }, { deg: 180, label: "Z" }],
    arcs: [{ from: 0, to: 120, label: "b", r: 24 }, { from: 120, to: 180, label: "a", r: 30 }] };

  var FIG_Q4_1 = { type: "angle", vertex: "O", rays: [{ deg: 0, label: "Q" }, { deg: 60, label: "S" }, { deg: 180, label: "P" }, { deg: 240, label: "R" }],
    arcs: [{ from: 0, to: 60, label: "x", r: 24 }, { from: 180, to: 240, label: "y", r: 24 }] };
  var FIG_Q4_2 = { type: "angle", vertex: "O",
    rays: [{ deg: 0, label: "E" }, { deg: 40, label: "F" }, { deg: 140, label: "A" }, { deg: 180, label: "B" }, { deg: 220, label: "C" }, { deg: 320, label: "D" }],
    arcs: [{ from: 140, to: 180, label: "x", r: 30 }, { from: 320, to: 360, label: "y", r: 30 }] };
  var FIG_Q4_3 = { type: "angle", vertex: "O",
    rays: [{ deg: 0, label: "Q" }, { deg: 50, label: "R" }, { deg: 130, label: "L" }, { deg: 180, label: "M" }, { deg: 230, label: "N" }, { deg: 310, label: "P" }],
    arcs: [{ from: 130, to: 180, label: "y", r: 26 }, { from: 230, to: 310, label: "x", r: 22 }] };

  function crossFig(vertex, rays) { return { type: "angle", vertex: vertex, rays: rays }; }

  // Q8 and Q10 drawings: one point, several rays.
  function star(rays, arcs) { return { type: "angle", rays: rays.map(function (d) { return { deg: d }; }), arcs: arcs }; }

  Practice.register({
    id: "math-angles-g6-ex14-2",
    subject: "Mathematics",
    unit: "Angles",
    title: "Exercise 14.2",
    topic: "Pairs of angles",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 207–209",

    reference: {
      title: "Pairs of angles",
      columns: ["Pair", "What it means", "Rule"],
      rows: [
        ["Adjacent angles", "Same vertex and one common arm", "No fixed sum"],
        ["Linear pair", "Adjacent angles whose outer arms make a straight line", "Sum = 180°"],
        ["Vertically opposite", "Opposite angles where two straight lines cross", "They are equal"],
        ["Complementary", "Two angles that add up to a right angle", "Sum = 90°"],
        ["Supplementary", "Two angles that add up to a straight angle", "Sum = 180°"],
        ["Angles at a point", "All the angles all the way round one point", "Sum = 360°"]
      ]
    },

    sections: [
      /* ---------------- Q1 ---------------- */
      {
        id: "q1", title: "Name the pairs", instruction: "Look at the figure and fill in the blanks.",
        questions: [
          { id: "q1a", prompt: "∠COE and ____ are a pair of **adjacent** angles.", figure: FIG_Q1,
            parts: [ch("v", "", Q1_NAMES, ["∠BOC", "∠AOE"])],
            help: [
              { text: "Adjacent angles share the **same vertex** and **one common arm**, and sit side by side." },
              { text: "∠COE has arms OC and OE. Find an angle next to it that also uses arm OC or arm OE." },
              { text: "Answer: **∠BOC** (common arm OC) or **∠AOE** (common arm OE)." }
            ] },
          { id: "q1b", prompt: "∠BOC and ____ are **vertically opposite** angles.", figure: FIG_Q1,
            parts: [ch("v", "", Q1_NAMES, "∠AOD")],
            help: [
              { text: "Vertically opposite angles are made by **two straight lines** crossing. They face each other across the vertex." },
              { text: "∠BOC is made by lines AB and CD. Go to the other side: OB continues as OA, and OC continues as OD." },
              { text: "Answer: **∠AOD**." }
            ] },
          { id: "q1c", prompt: "∠BOD and ∠AOC are ____ angles.", figure: FIG_Q1,
            parts: [ch("v", "", PAIR_TYPES, "Vertically opposite angles")],
            help: [
              { text: "Look where ∠BOD and ∠AOC are. Do they sit side by side, or face each other across O?",
                ask: { type: "choice", options: ["Side by side", "Facing each other"], answer: "Facing each other" } },
              { text: "Angles facing each other where two straight lines cross are **vertically opposite angles**." }
            ] },
          { id: "q1d", prompt: "∠BOC is the **complement** of ____.", figure: FIG_Q1,
            parts: [ch("v", "", Q1_NAMES, "∠COE")],
            help: [
              { text: "Complementary angles add up to **90°**. The square at O shows that ∠BOE = 90°." },
              { text: "∠BOE is split into two parts by OC: ∠BOC and one more angle. Which one?" },
              { text: "Answer: **∠COE**, because ∠BOC + ∠COE = ∠BOE = 90°." }
            ] },
          { id: "q1e", prompt: "∠AOD and ____ are adjacent angles in a **linear pair**.", figure: FIG_Q1,
            parts: [ch("v", "", Q1_NAMES, ["∠AOC", "∠BOD"])],
            help: [
              { text: "A linear pair is two adjacent angles that together make a straight line (180°)." },
              { text: "∠AOD sits on line CD with ∠AOC, and on line AB with ∠BOD." },
              { text: "Answer: **∠AOC** or **∠BOD**." }
            ] },
          { id: "q1f", prompt: "The **supplement** of ∠AOC is ____.", figure: FIG_Q1,
            parts: [ch("v", "", Q1_NAMES, ["∠AOD", "∠BOC"])],
            help: [
              { text: "Supplementary angles add up to **180°**, a straight angle." },
              { text: "∠AOC and ∠AOD make the straight line CD. ∠AOC and ∠BOC make the straight line AB." },
              { text: "Answer: **∠AOD** or **∠BOC**." }
            ] }
        ]
      },

      /* ---------------- Q2 ---------------- */
      {
        id: "q2", title: "Quick answers", instruction: "Write the correct answers.",
        questions: [
          { id: "q2a", prompt: "The **complement** of 60° is ____.", parts: [n("v", "", 30, [{ answer: 120, say: "120° is the supplement. The complement adds up to 90°, not 180°." }])],
            help: [{ text: "Complementary angles add up to 90°. What is 90 − 60?", ask: ask(30) }, { text: "Answer: **30°**." }] },
          { id: "q2b", prompt: "The **supplement** of 150° is ____.", parts: [n("v", "", 30)],
            help: [{ text: "Supplementary angles add up to 180°. What is 180 − 150?", ask: ask(30) }, { text: "Answer: **30°**." }] },
          { id: "q2c", prompt: "If x° and 110° are a **linear pair**, then x° = ____.", parts: [n("v", "x =", 70)],
            help: [{ text: "A linear pair adds up to 180°. So x + 110 = 180. What is 180 − 110?", ask: ask(70) }, { text: "Answer: **x = 70°**." }] },
          { id: "q2d", prompt: "If y° and 85° are **vertically opposite** angles, then y° = ____.", parts: [n("v", "y =", 85, [{ answer: 95, say: "Vertically opposite angles are EQUAL. They do not add up to 180°." }])],
            help: [{ text: "Vertically opposite angles are always **equal**." }, { text: "Answer: **y = 85°**." }] }
        ]
      },

      /* ---------------- Q3 ---------------- */
      {
        id: "q3", title: "Adjacent or not?", instruction: "Answer from the figures.",
        questions: [
          { id: "q3a1", prompt: "Fig. (i): what type of angles are ∠a and ∠b, and why?", figure: FIG_Q3_1,
            parts: [ch("t", "Type", ["Adjacent angles", "Linear pair", "Vertically opposite angles"], "Adjacent angles"),
                    ch("r", "Reason", ["They have a common vertex and a common arm", "They add up to 180°", "They face each other"], "They have a common vertex and a common arm")],
            help: [
              { text: "Do ∠a and ∠b share the vertex O? Do they share an arm?",
                ask: { type: "choice", options: ["Yes, they share arm OB", "No, they share no arm"], answer: "Yes, they share arm OB" } },
              { text: "OA and OC do not make a straight line, so this is not a linear pair." },
              { text: "Answer: **Adjacent angles**, because they have a common vertex O and a common arm OB." }
            ] },
          { id: "q3a3", prompt: "Fig. (iii): what type of angles are ∠a and ∠b, and why?", figure: FIG_Q3_3,
            parts: [ch("t", "Type", ["Adjacent angles only", "Linear pair", "Vertically opposite angles"], "Linear pair"),
                    ch("r", "Reason", ["They are adjacent and their outer arms OZ and OX make a straight line", "They face each other", "They add up to 90°"], "They are adjacent and their outer arms OZ and OX make a straight line")],
            help: [
              { text: "∠a and ∠b share vertex O and arm OY, so they are adjacent." },
              { text: "Now look at the outer arms OZ and OX. Do they make a straight line?",
                ask: { type: "choice", options: ["Yes", "No"], answer: "Yes" } },
              { text: "Answer: a **linear pair** (adjacent angles on a straight line, adding up to 180°)." }
            ] },
          { id: "q3b", prompt: "In fig. (iii), if ∠b = 120°, find ∠a.", figure: FIG_Q3_3,
            parts: [n("v", "∠a =", 60)],
            help: [
              { text: "∠a and ∠b are a linear pair, so ∠a + ∠b = 180°." },
              { text: "What is 180 − 120?", ask: ask(60) },
              { text: "Answer: **∠a = 60°**." }
            ] },
          { id: "q3c", prompt: "Fig. (ii): are ∠a and ∠b adjacent angles? Give a reason.", figure: FIG_Q3_2,
            parts: [ch("t", "Adjacent?", ["Yes", "No"], "No"),
                    ch("r", "Reason", ["They have no common arm", "They have no common vertex", "They add up to 180°"], "They have no common arm")],
            help: [
              { text: "∠a is ∠POQ (arms OP and OQ). ∠b is ∠ROS (arms OR and OS)." },
              { text: "Do they share an arm?", ask: { type: "choice", options: ["Yes", "No"], answer: "No" } },
              { text: "Answer: **No**. They share the vertex O but have **no common arm**." }
            ] }
        ]
      },

      /* ---------------- Q4 ---------------- */
      {
        id: "q4", title: "Vertically opposite", instruction: "Answer from the figures.",
        questions: [
          { id: "q4a", prompt: "What type of angles are ∠x and ∠y in fig. (i) and fig. (ii)?", figure: FIG_Q4_1,
            parts: [ch("f1", "Fig. (i)", PAIR_TYPES, "Vertically opposite angles"), ch("f2", "Fig. (ii)", PAIR_TYPES, "Vertically opposite angles")],
            help: [
              { text: "In fig. (i), lines PQ and RS cross at O. ∠x and ∠y face each other across O." },
              { text: "Fig. (ii) (lines AD and BE crossing at O) is the same: ∠x = ∠AOB and ∠y = ∠DOE face each other.",
                figure: FIG_Q4_2 },
              { text: "Answer: both are **vertically opposite angles**." }
            ] },
          { id: "q4b", prompt: "What is the relation between ∠x and ∠y in fig. (i) and (ii)?", figure: FIG_Q4_2,
            parts: [ch("v", "", ["They are equal", "They add up to 90°", "They add up to 180°"], "They are equal")],
            help: [
              { text: "∠x and ∠y are vertically opposite angles." },
              { text: "Answer: vertically opposite angles are always **equal**." }
            ] },
          { id: "q4c", prompt: "In fig. (i), if ∠x = 50°, find ∠y.", figure: FIG_Q4_1,
            parts: [n("v", "∠y =", 50, [{ answer: 130, say: "∠x and ∠y are vertically opposite, so they are equal. They are not a linear pair." }])],
            help: [{ text: "∠x and ∠y are vertically opposite, so they are equal." }, { text: "Answer: **∠y = 50°**." }] },
          { id: "q4d", prompt: "Fig. (iii): are ∠x and ∠y vertically opposite angles? Give a reason.", figure: FIG_Q4_3,
            parts: [ch("t", "Opposite?", ["Yes", "No"], "No"),
                    ch("r", "Reason", ["Their arms are not made by the same two straight lines", "They are on the same line MQ", "They add up to 180°"], "Their arms are not made by the same two straight lines")],
            help: [
              { text: "∠y = ∠LOM has arms OL and OM. Its vertically opposite angle would be made by OP and OQ (the other ends of those lines)." },
              { text: "∠x = ∠NOP has arms ON and OP. Is ∠x the same as ∠POQ?", ask: { type: "choice", options: ["Yes", "No"], answer: "No" } },
              { text: "Answer: **No**. ∠x and ∠y are not formed by the same two straight lines." }
            ] }
        ]
      },

      /* ---------------- Q5 ---------------- */
      {
        id: "q5", title: "Name the pairs", instruction: "Name the pairs of adjacent angles and vertically opposite angles.",
        questions: [
          { id: "q5a", prompt: "Lines AB and CD cross at O. Complete the pairs.",
            figure: crossFig("O", [{ deg: 0, label: "B" }, { deg: 60, label: "C" }, { deg: 180, label: "A" }, { deg: 240, label: "D" }]),
            parts: [ch("v1", "∠AOC is vertically opposite to", ["∠BOD", "∠BOC", "∠AOD"], "∠BOD"),
                    ch("v2", "∠AOD is vertically opposite to", ["∠BOD", "∠BOC", "∠AOC"], "∠BOC"),
                    ch("a1", "One angle adjacent to ∠AOC", ["∠COB", "∠BOD"], "∠COB")],
            help: [
              { text: "For the angle opposite ∠AOC, swap each arm for the other end of its line: OA → OB, OC → OD." },
              { text: "So ∠AOC ↔ **∠BOD** and ∠AOD ↔ **∠BOC**." },
              { text: "An adjacent angle shares an arm: ∠COB shares OC with ∠AOC. (∠AOD would also be adjacent.)" },
              { text: "Adjacent pairs: ∠AOC & ∠COB, ∠COB & ∠BOD, ∠BOD & ∠DOA, ∠DOA & ∠AOC. Opposite pairs: ∠AOC & ∠BOD, ∠AOD & ∠BOC." }
            ] },
          { id: "q5b", prompt: "Lines PQ and RS cross at T. Complete the pairs.",
            figure: crossFig("T", [{ deg: 55, label: "R" }, { deg: 125, label: "P" }, { deg: 235, label: "S" }, { deg: 305, label: "Q" }]),
            parts: [ch("v1", "∠PTR is vertically opposite to", ["∠STQ", "∠RTQ", "∠PTS"], "∠STQ"),
                    ch("v2", "∠PTS is vertically opposite to", ["∠STQ", "∠RTQ", "∠PTR"], "∠RTQ"),
                    ch("a1", "One angle adjacent to ∠PTR", ["∠RTQ", "∠STQ"], "∠RTQ")],
            help: [
              { text: "Swap each arm for the other end of its line: TP → TQ, TR → TS." },
              { text: "So ∠PTR ↔ **∠QTS** and ∠PTS ↔ **∠QTR**." },
              { text: "∠RTQ shares arm TR with ∠PTR, so they are adjacent. (∠PTS is adjacent too.)" }
            ] },
          { id: "q5c", prompt: "Lines AB, CD and EF cross at O. Complete the vertically opposite pairs.",
            figure: crossFig("O", [{ deg: 0, label: "D" }, { deg: 60, label: "E" }, { deg: 120, label: "A" }, { deg: 180, label: "C" }, { deg: 240, label: "F" }, { deg: 300, label: "B" }]),
            parts: [ch("v1", "∠AOC is opposite to", ["∠BOD", "∠DOE", "∠BOF"], "∠BOD"),
                    ch("v2", "∠AOE is opposite to", ["∠BOD", "∠DOE", "∠BOF"], "∠BOF"),
                    ch("v3", "∠COF is opposite to", ["∠BOD", "∠DOE", "∠BOF"], "∠DOE")],
            help: [
              { text: "The straight lines are AB, CD and EF. To find the opposite angle, swap each letter for the other end of its line: A↔B, C↔D, E↔F." },
              { text: "∠AOC → ∠BOD. ∠AOE → ∠BOF. ∠COF → ∠DOE." },
              { text: "Adjacent pairs are any two angles next to each other, for example ∠AOC & ∠COF, or ∠DOE & ∠EOA." }
            ] }
        ]
      },

      /* ---------------- Q6 ---------------- */
      {
        id: "q6", title: "Complements and supplements", instruction: "Find the complements and supplements.",
        questions: [
          { id: "q6a", prompt: "Find the **complements** of these angles. (Hint: complement of 50° = 90° − 50° = 40°)",
            parts: [n("i", "55° →", 35), n("ii", "20° →", 70), n("iii", "62° →", 28), n("iv", "30° →", 60)],
            help: [
              { text: "The complement is what you add to make **90°**. Subtract from 90." },
              { text: "90 − 55 = ?", ask: ask(35) },
              { text: "Answer: 35°, 70°, 28°, 60°." }
            ] },
          { id: "q6b", prompt: "Find the **supplements** of these angles.",
            parts: [n("i", "45° →", 135), n("ii", "110° →", 70), n("iii", "150° →", 30), n("iv", "60° →", 120)],
            help: [
              { text: "The supplement is what you add to make **180°**. Subtract from 180." },
              { text: "180 − 45 = ?", ask: ask(135) },
              { text: "Answer: 135°, 70°, 30°, 120°." }
            ] }
        ]
      },

      /* ---------------- Q7 ---------------- */
      {
        id: "q7", title: "Make equations", instruction: "Make equations and solve them to find the unknown angles.",
        questions: [
          { id: "q7a", prompt: "If x° and 125° are adjacent angles in a **linear pair**, find x°. (Hint: x° + 125° = 180°)",
            parts: [n("x", "x =", 55)],
            help: [{ text: "x + 125 = 180, so x = 180 − 125.", ask: ask(55) }, { text: "Answer: **x = 55°**." }] },
          { id: "q7b", prompt: "If 2x° and 3x° are adjacent angles in a **linear pair**, find them.",
            parts: [n("x", "x =", 36), n("a", "2x =", 72), n("b", "3x =", 108)],
            help: [
              { text: "A linear pair adds to 180°: **2x + 3x = 180**." },
              { text: "2x + 3x = 5x. So 5x = 180. What is 180 ÷ 5?", ask: ask(36) },
              { text: "2x = 2 × 36 = 72°, 3x = 3 × 36 = 108°. Check: 72 + 108 = 180 ✓" }
            ] },
          { id: "q7c", prompt: "If y° and (y + 10)° are **complementary** angles, find them.",
            parts: [n("y", "y =", 40), n("b", "y + 10 =", 50)],
            help: [
              { text: "Complementary angles add to 90°: **y + y + 10 = 90**, so 2y + 10 = 90." },
              { text: "Take 10 from both sides: 2y = 80. What is y?", ask: ask(40) },
              { text: "The angles are **40°** and **50°**. Check: 40 + 50 = 90 ✓" }
            ] },
          { id: "q7d", prompt: "If (a + 10)° and (a + 20)° are **supplementary** angles, find them.",
            parts: [n("a", "a =", 75), n("b", "a + 10 =", 85), n("c", "a + 20 =", 95)],
            help: [
              { text: "Supplementary angles add to 180°: a + 10 + a + 20 = 180, so **2a + 30 = 180**." },
              { text: "2a = 180 − 30 = 150. What is a?", ask: ask(75) },
              { text: "The angles are **85°** and **95°**. Check: 85 + 95 = 180 ✓" }
            ] },
          { id: "q7e", prompt: "If two **complementary** angles are equal, find them.",
            parts: [n("v", "Each angle =", 45)],
            help: [{ text: "Call each angle x. Then x + x = 90, so 2x = 90. What is x?", ask: ask(45) }, { text: "Answer: each angle is **45°**." }] },
          { id: "q7f", prompt: "If two **supplementary** angles are equal, find them.",
            parts: [n("v", "Each angle =", 90)],
            help: [{ text: "Call each angle x. Then 2x = 180. What is x?", ask: ask(90) }, { text: "Answer: each angle is **90°**." }] }
        ]
      },

      /* ---------------- Q8 ---------------- */
      {
        id: "q8", title: "Angles on a line", instruction: "Find the sizes of the unknown angles.",
        questions: [
          { id: "q8a", prompt: "Find x°.", figure: star([0, 80, 180], [{ from: 80, to: 180, label: "100°", r: 26 }, { from: 0, to: 80, label: "x°", r: 26 }]),
            parts: [n("v", "x =", 80)],
            help: [{ text: "The angles on a straight line add to 180°: x + 100 = 180." }, { text: "What is 180 − 100?", ask: ask(80) }, { text: "Answer: **x = 80°**." }] },
          { id: "q8b", prompt: "Find x°.", figure: star([0, 125, 180], [{ from: 125, to: 180, label: "55°", r: 30 }, { from: 0, to: 125, label: "x°", r: 22 }]),
            parts: [n("v", "x =", 125)],
            help: [{ text: "x and 55° make a straight line: x + 55 = 180." }, { text: "What is 180 − 55?", ask: ask(125) }, { text: "Answer: **x = 125°**." }] },
          { id: "q8c", prompt: "Find y°.", figure: star([90, 270, 330], [{ from: 330, to: 90, label: "120°", r: 24 }, { from: 270, to: 330, label: "2y°", r: 30 }]),
            parts: [n("y", "y =", 30), n("y2", "2y =", 60)],
            help: [
              { text: "The vertical line is straight, so 2y + 120 = 180." },
              { text: "2y = 180 − 120 = ?", ask: ask(60) },
              { text: "So y = 60 ÷ 2 = **30°**." }
            ] },
          { id: "q8d", prompt: "Find y°.", figure: star([0, 180, 285], [{ from: 180, to: 285, label: "105°", r: 24 }, { from: 285, to: 360, label: "3y°", r: 30 }]),
            parts: [n("y", "y =", 25), n("y3", "3y =", 75)],
            help: [{ text: "3y + 105 = 180, so 3y = 75." }, { text: "What is 75 ÷ 3?", ask: ask(25) }, { text: "Answer: **y = 25°** (3y = 75°)." }] },
          { id: "q8e", prompt: "Find z°.", figure: star([90, 126, 270], [{ from: 90, to: 126, label: "z°", r: 36 }, { from: 126, to: 270, label: "4z°", r: 22 }]),
            parts: [n("z", "z =", 36), n("z4", "4z =", 144)],
            help: [{ text: "z + 4z = 180, so 5z = 180." }, { text: "What is 180 ÷ 5?", ask: ask(36) }, { text: "Answer: **z = 36°**, 4z = 144°." }] },
          { id: "q8f", prompt: "Find x°.", figure: star([0, 30, 120, 180], [{ from: 0, to: 30, label: "30°", r: 40 }, { from: 30, to: 120, label: "x°", r: 22 }, { from: 120, to: 180, label: "60°", r: 30 }]),
            parts: [n("v", "x =", 90)],
            help: [{ text: "Three angles on a straight line: 60 + x + 30 = 180." }, { text: "60 + 30 = 90, so x = 180 − 90 = ?", ask: ask(90) }, { text: "Answer: **x = 90°**." }] },
          { id: "q8g", prompt: "Find y°.", figure: star([0, 75, 110, 180], [{ from: 0, to: 75, label: "75°", r: 22 }, { from: 75, to: 110, label: "35°", r: 46 }, { from: 110, to: 180, label: "y°", r: 22 }]),
            parts: [n("v", "y =", 70)],
            help: [{ text: "y + 35 + 75 = 180." }, { text: "35 + 75 = 110, so y = 180 − 110 = ?", ask: ask(70) }, { text: "Answer: **y = 70°**." }] },
          { id: "q8h", prompt: "Find k°.", figure: star([90, 270, 34, 326], [{ from: 34, to: 90, label: "k°", r: 30 }, { from: 326, to: 394, label: "68°", r: 20 }, { from: 270, to: 326, label: "k°", r: 30 }]),
            parts: [n("v", "k =", 56)],
            help: [{ text: "The vertical line is straight: k + 68 + k = 180, so 2k + 68 = 180." }, { text: "2k = 112. What is k?", ask: ask(56) }, { text: "Answer: **k = 56°**." }] }
        ]
      },

      /* ---------------- Q9 ---------------- */
      {
        id: "q9", title: "Two steps", instruction: "Answer in two steps.",
        questions: [
          { id: "q9a", prompt: "Find the **supplement** of the **complement** of 50°.",
            parts: [n("c", "Complement of 50°", 40), n("s", "Supplement of that", 140)],
            help: [
              { text: "Work from the inside out. First the complement: 90 − 50 = ?", ask: ask(40) },
              { text: "Then the supplement of 40°: 180 − 40 = ?", ask: ask(140) },
              { text: "Answer: **140°**." }
            ] },
          { id: "q9b", prompt: "Find the **complement** of the **supplement** of 100°.",
            parts: [n("s", "Supplement of 100°", 80), n("c", "Complement of that", 10)],
            help: [
              { text: "First the supplement: 180 − 100 = ?", ask: ask(80) },
              { text: "Then the complement of 80°: 90 − 80 = ?", ask: ask(10) },
              { text: "Answer: **10°**." }
            ] }
        ]
      },

      /* ---------------- Q10 ---------------- */
      {
        id: "q10", title: "Crossing lines", instruction: "Find the sizes of the unknown angles.",
        questions: [
          { id: "q10a", prompt: "Find x°, y° and z°.",
            figure: star([47.5, 132.5, 227.5, 312.5], [{ from: 47.5, to: 132.5, label: "85°", r: 20 }, { from: 312.5, to: 407.5, label: "x°", r: 20 }, { from: 227.5, to: 312.5, label: "y°", r: 20 }, { from: 132.5, to: 227.5, label: "z°", r: 20 }]),
            parts: [n("x", "x =", 95), n("y", "y =", 85), n("z", "z =", 95)],
            help: [
              { text: "y is vertically opposite to 85°, so y = 85°." },
              { text: "x and 85° are a linear pair: x = 180 − 85 = ?", ask: ask(95) },
              { text: "z is vertically opposite to x, so z = 95°." },
              { text: "Answer: **x = 95°, y = 85°, z = 95°**." }
            ] },
          { id: "q10b", prompt: "Find x°, y° and z°.",
            figure: star([100, 130, 280, 310], [{ from: 100, to: 130, label: "x°", r: 34 }, { from: 310, to: 460, label: "150°", r: 18 }, { from: 280, to: 310, label: "y°", r: 34 }, { from: 130, to: 280, label: "z°", r: 18 }]),
            parts: [n("x", "x =", 30), n("y", "y =", 30), n("z", "z =", 150)],
            help: [
              { text: "z is vertically opposite to 150°, so z = 150°." },
              { text: "x and 150° are a linear pair: x = 180 − 150 = ?", ask: ask(30) },
              { text: "y is vertically opposite to x, so y = 30°." }
            ] },
          { id: "q10c", prompt: "Find a°, b° and c°.",
            figure: star([5, 75, 185, 255], [{ from: 75, to: 185, label: "c°", r: 20 }, { from: 5, to: 75, label: "a°", r: 20 }, { from: 185, to: 255, label: "70°", r: 20 }, { from: 255, to: 365, label: "b°", r: 20 }]),
            parts: [n("a", "a =", 70), n("b", "b =", 110), n("c", "c =", 110)],
            help: [
              { text: "a is vertically opposite to 70°, so a = 70°." },
              { text: "b and 70° are a linear pair: b = 180 − 70 = ?", ask: ask(110) },
              { text: "c is vertically opposite to b, so c = 110°." }
            ] },
          { id: "q10d", prompt: "Find p°, q° and r°.",
            figure: star([5, 135, 185, 315], [{ from: 135, to: 185, label: "p°", r: 22 }, { from: 5, to: 135, label: "r°", r: 18 }, { from: 315, to: 365, label: "50°", r: 22 }, { from: 185, to: 315, label: "q°", r: 18 }]),
            parts: [n("p", "p =", 50), n("q", "q =", 130), n("r", "r =", 130)],
            help: [
              { text: "p is vertically opposite to 50°, so p = 50°." },
              { text: "q and 50° are a linear pair: q = 180 − 50 = ?", ask: ask(130) },
              { text: "r is vertically opposite to q, so r = 130°." }
            ] },
          { id: "q10e", prompt: "Find x°, y° and z°.",
            figure: star([90, 126, 270, 306], [{ from: 90, to: 126, label: "x°", r: 34 }, { from: 306, to: 450, label: "4x°", r: 18 }, { from: 270, to: 306, label: "y°", r: 34 }, { from: 126, to: 270, label: "z°", r: 18 }]),
            parts: [n("x", "x =", 36), n("y", "y =", 36), n("z", "z =", 144)],
            help: [
              { text: "x and 4x are a linear pair: x + 4x = 180, so 5x = 180." },
              { text: "What is 180 ÷ 5?", ask: ask(36) },
              { text: "4x = 144°. y is opposite x, so y = 36°. z is opposite 4x, so z = 144°." }
            ] },
          { id: "q10f", prompt: "Find x°, y° and z°.",
            figure: star([30, 90, 210, 270], [{ from: 90, to: 210, label: "4x°", r: 20 }, { from: 30, to: 90, label: "2x°", r: 24 }, { from: 270, to: 390, label: "z°", r: 20 }, { from: 210, to: 270, label: "y°", r: 24 }]),
            parts: [n("x", "x =", 30), n("y", "y =", 60), n("z", "z =", 120)],
            help: [
              { text: "4x and 2x are a linear pair: 4x + 2x = 180, so 6x = 180." },
              { text: "What is 180 ÷ 6?", ask: ask(30) },
              { text: "So 4x = 120° and 2x = 60°. y is opposite 2x: y = 60°. z is opposite 4x: z = 120°." }
            ] },
          { id: "q10g", prompt: "Find x°, y° and z°.",
            figure: star([0, 40, 80, 180, 260], [{ from: 40, to: 80, label: "40°", r: 34 }, { from: 0, to: 40, label: "x°", r: 26 }, { from: 80, to: 180, label: "z°", r: 20 }, { from: 180, to: 260, label: "y°", r: 20 }, { from: 260, to: 360, label: "100°", r: 20 }]),
            parts: [n("x", "x =", 40), n("y", "y =", 80), n("z", "z =", 100)],
            help: [
              { text: "y and 100° make the straight bottom half: y = 180 − 100 = ?", ask: ask(80) },
              { text: "z is vertically opposite to 100°, so z = 100°." },
              { text: "Above the line: z + 40 + x = 180, so x = 180 − 100 − 40 = ?", ask: ask(40) }
            ] },
          { id: "q10h", prompt: "Find x°, y° and z°.",
            figure: star([0, 40, 120, 180, 220, 300], [{ from: 40, to: 120, label: "z°", r: 22 }, { from: 120, to: 180, label: "y°", r: 26 }, { from: 180, to: 220, label: "x°", r: 30 }, { from: 220, to: 300, label: "2x°", r: 22 }, { from: 300, to: 360, label: "60°", r: 26 }]),
            parts: [n("x", "x =", 40), n("y", "y =", 60), n("z", "z =", 80)],
            help: [
              { text: "y is vertically opposite to 60°, so y = 60°." },
              { text: "z is vertically opposite to 2x, so z = 2x. Also, the angle opposite x (top right) is x." },
              { text: "Above the line: x + z + y = 180, so x + 2x + 60 = 180, 3x = 120. What is x?", ask: ask(40) },
              { text: "Answer: **x = 40°, y = 60°, z = 80°**." }
            ] }
        ]
      },

      /* ---------------- Q11 ---------------- */
      {
        id: "q11a", no: "11a", title: "Triangle: linear pairs", instruction: "Answer from the figure.",
        questions: [
          { id: "q11a1", prompt: "Which angle makes a **linear pair** with each inside angle?",
            figure: { type: "geo", points: { _L: [0, 0], _R: [200, 0], _T: [134.7, 77.8], _L0: [-45, 0], _R0: [245, 0], _T0: [181.8, 105] },
              lines: [["_L0", "_R0"], ["_L", "_T0"], ["_R", "_T"]],
              marks: [{ at: "_L", a: "_L0", b: "_T", label: "150°", r: 14 }, { at: "_L", a: "_R", b: "_T", label: "x°", r: 26 },
                      { at: "_T", a: "_T0", b: "_R", label: "80°", r: 14 }, { at: "_T", a: "_L", b: "_R", label: "y°", r: 20 },
                      { at: "_R", a: "_R0", b: "_T", label: "130°", r: 14 }, { at: "_R", a: "_L", b: "_T", label: "z°", r: 24 }] },
            parts: [ch("x", "x° pairs with", ["150°", "80°", "130°"], "150°"), ch("y", "y° pairs with", ["150°", "80°", "130°"], "80°"), ch("z", "z° pairs with", ["150°", "80°", "130°"], "130°")],
            help: [
              { text: "A linear pair is two adjacent angles on a straight line. Each corner of the triangle has one inside angle and one outside angle on the same straight side." },
              { text: "At the left corner, x and 150° sit side by side on the bottom line. At the top, y and 80°. At the right, z and 130°." }
            ] },
          { id: "q11a2", prompt: "What is the sum of each linear pair? Then find x°, y° and z°.",
            figure: { type: "geo", points: { _L: [0, 0], _R: [200, 0], _T: [134.7, 77.8], _L0: [-45, 0], _R0: [245, 0], _T0: [181.8, 105] },
              lines: [["_L0", "_R0"], ["_L", "_T0"], ["_R", "_T"]],
              marks: [{ at: "_L", a: "_L0", b: "_T", label: "150°", r: 14 }, { at: "_L", a: "_R", b: "_T", label: "x°", r: 26 },
                      { at: "_T", a: "_T0", b: "_R", label: "80°", r: 14 }, { at: "_T", a: "_L", b: "_R", label: "y°", r: 20 },
                      { at: "_R", a: "_R0", b: "_T", label: "130°", r: 14 }, { at: "_R", a: "_L", b: "_T", label: "z°", r: 24 }] },
            parts: [n("s", "Sum of a linear pair", 180), n("x", "x =", 30), n("y", "y =", 100), n("z", "z =", 50)],
            help: [
              { text: "Each linear pair adds up to **180°**." },
              { text: "x = 180 − 150 = ?", ask: ask(30) },
              { text: "y = 180 − 80 = ?", ask: ask(100) },
              { text: "z = 180 − 130 = ?", ask: ask(50) }
            ] },
          { id: "q11a3", prompt: "Calculate x° + y° + z°. What is the sum of the angles of a triangle?",
            parts: [n("s", "x + y + z =", 180), n("t", "Angles of a triangle add up to", 180)],
            help: [
              { text: "From the last question: x = 30°, y = 100°, z = 50°." },
              { text: "30 + 100 + 50 = ?", ask: ask(180) },
              { text: "x, y and z are the three angles of the triangle, so the angles of a triangle add up to **180°**." }
            ] }
        ]
      },
      {
        id: "q11b", no: "11b", title: "Triangle: opposite angles", instruction: "Answer from the figure.",
        questions: [
          { id: "q11b1", prompt: "Which angle is **vertically opposite** to each inside angle? What is the relation?",
            figure: { type: "geo", points: { _L: [0, 0], _R: [200, 0], _T: [108.7, 91.3], _a1: [-60, 0], _a2: [260, 0], _b1: [-32.6, -27.4], _b2: [141.3, 118.7], _c1: [227.4, -27.4], _c2: [81.3, 118.7] },
              lines: [["_a1", "_a2"], ["_b1", "_b2"], ["_c1", "_c2"]],
              marks: [{ at: "_L", a: "_R", b: "_T", label: "a°", r: 24 }, { at: "_L", a: "-_R", b: "-_T", label: "40°", r: 14 },
                      { at: "_T", a: "_L", b: "_R", label: "b°", r: 20 }, { at: "_T", a: "-_L", b: "-_R", label: "95°", r: 14 },
                      { at: "_R", a: "_L", b: "_T", label: "c°", r: 24 }, { at: "_R", a: "-_L", b: "-_T", label: "45°", r: 14 }] },
            parts: [ch("a", "a° is opposite", ["40°", "95°", "45°"], "40°"), ch("b", "b° is opposite", ["40°", "95°", "45°"], "95°"), ch("c", "c° is opposite", ["40°", "95°", "45°"], "45°"),
                    ch("r", "Relation", ["They are equal", "They add up to 180°"], "They are equal")],
            help: [
              { text: "At each corner two straight lines cross. The angle inside the triangle faces an angle outside it across the corner." },
              { text: "a faces 40°, b faces 95°, c faces 45°. Vertically opposite angles are **equal**." }
            ] },
          { id: "q11b2", prompt: "Find a°, b° and c°, and their sum.",
            figure: { type: "geo", points: { _L: [0, 0], _R: [200, 0], _T: [108.7, 91.3], _a1: [-60, 0], _a2: [260, 0], _b1: [-32.6, -27.4], _b2: [141.3, 118.7], _c1: [227.4, -27.4], _c2: [81.3, 118.7] },
              lines: [["_a1", "_a2"], ["_b1", "_b2"], ["_c1", "_c2"]],
              marks: [{ at: "_L", a: "_R", b: "_T", label: "a°", r: 24 }, { at: "_L", a: "-_R", b: "-_T", label: "40°", r: 14 },
                      { at: "_T", a: "_L", b: "_R", label: "b°", r: 20 }, { at: "_T", a: "-_L", b: "-_R", label: "95°", r: 14 },
                      { at: "_R", a: "_L", b: "_T", label: "c°", r: 24 }, { at: "_R", a: "-_L", b: "-_T", label: "45°", r: 14 }] },
            parts: [n("a", "a =", 40), n("b", "b =", 95), n("c", "c =", 45), n("s", "a + b + c =", 180)],
            help: [
              { text: "Vertically opposite angles are equal, so a = 40°, b = 95°, c = 45°." },
              { text: "Add them: 40 + 95 + 45 = ?", ask: ask(180) },
              { text: "Again the angles of a triangle add up to **180°**." }
            ] }
        ]
      }
    ]
  });
})();
