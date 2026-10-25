/*
  Exercise 2.1: Place value, face value, Nepali and International numeration systems.
  Source: Vedanta Excel in Mathematics, Book 6, pages 27-29.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function nm(id, label, answer, unit, mistakes) { return { id: id, label: label, type: "number", answer: answer, unit: unit, mistakes: mistakes }; }
  function nu(id, label, answer) { return { id: id, label: label, type: "numeral", answer: answer }; }
  function ex(id, label, answer) { return { id: id, label: label, type: "expr", answer: answer, form: "any" }; }
  function ask(answer) { return { type: "number", answer: answer }; }
  function q(id, prompt, part, steps) { return { id: id, prompt: prompt, parts: [part], help: steps }; }

  var NEP = "Nepali system: ones, tens, hundreds, thousands, ten thousands, **lakhs**, ten lakhs, **crores**, ten crores, **arabs**, ten arabs, kharabs.";
  var INT = "International system: ones, tens, hundreds, thousands, ten thousands, hundred thousands, **millions**, ten millions, hundred millions, **billions**, ten billions.";
  var PLACES_N = ["Ones", "Tens", "Hundreds", "Thousands", "Ten thousands", "Lakhs", "Ten lakhs", "Crores", "Ten crores", "Arabs", "Ten arabs"];
  var PLACES_I = ["Ones", "Tens", "Hundreds", "Thousands", "Ten thousands", "Hundred thousands", "Millions", "Ten millions", "Hundred millions", "Billions", "Ten billions"];

  // Coloured digit question: number string, index of the digit from the left
  function coloured(id, numStr, idx) {
    var d = +numStr[idx], pos = numStr.length - 1 - idx, pv = d * Math.pow(10, pos);
    var pick = function (list) { var o = list.slice(Math.max(0, pos - 2), Math.max(0, pos - 2) + 4); if (o.indexOf(list[pos]) < 0) o.push(list[pos]); return o; };
    return { id: id, prompt: "In **" + numStr + "**, look at the digit **" + d + "** (digit number " + (idx + 1) + " from the left).",
      parts: [ch("n", "Nepali place", pick(PLACES_N), PLACES_N[pos]), ch("i", "International place", pick(PLACES_I), PLACES_I[pos]),
              nm("f", "Face value", d), nm("p", "Place value", pv)],
      help: [{ text: "Count places from the **right**. This " + d + " is place number " + (pos + 1) + " from the right." }, { text: NEP }, { text: INT },
             { text: "Face value is the digit itself: " + d + ". Place value is the digit × its place: " + d + " followed by " + pos + " zeros." },
             { text: "Answer: **" + PLACES_N[pos].toLowerCase() + "**, **" + PLACES_I[pos].toLowerCase() + "**, face value **" + d + "**, place value **" + pv.toLocaleString("en-US") + "**." }] };
  }
  function commas(id, n, nep, intl, nepName, intName, wrongN, wrongI) {
    return { id: id, prompt: "**" + n + "**",
      parts: [nu("a", "Nepali commas", nep), nu("b", "International commas", intl),
              ch("c", "Name (Nepali)", id === "q4b" ? [wrongN, nepName] : [nepName, wrongN], nepName), ch("d", "Name (International)", id === "q4a" ? [intName, wrongI] : [wrongI, intName], intName)],
      help: [{ text: "Nepali: from the right, put a comma after 3 digits, then after every 2 digits." },
             { text: "International: from the right, put a comma after every 3 digits." },
             { text: "Answer: **" + nep + "** and **" + intl + "**." }] };
  }

  Practice.register({
    id: "math-whole-g6-ex2-1",
    subject: "Mathematics",
    unit: "Operations on Whole Numbers",
    title: "Exercise 2.1",
    topic: "Place value and numeration systems",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 27–29",

    reference: {
      title: "Numeration systems",
      columns: ["Idea", "Example"],
      rows: [
        ["Face value: the digit itself", "In 3517248, the face value of 5 is 5"],
        ["Place value: digit × its place", "In 3517248, the place value of 5 is 5,00,000"],
        ["Nepali commas: 3 digits, then every 2", "2705891436 → 2,70,58,91,436"],
        ["International commas: every 3", "2,705,891,436"],
        ["1 million = 10 lakh", "1 crore = 10 million"],
        ["1 billion = 1 arab", "100 crore = 1 arab = 1,000 million"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Quick blanks", instruction: "Fill in the blanks as quickly as possible.",
        questions: [
          q("q1a", "The digits in the Hindu-Arabic number system are…", ch("v", "", ["1, 2, 3, 4, 5, 6, 7, 8, 9", "0, 1, 2, 3, 4, 5, 6, 7, 8, 9", "1, 2, 3, …, 10"], "0, 1, 2, 3, 4, 5, 6, 7, 8, 9"),
            [{ text: "There are ten digits, and the first one is 0." }, { text: "Answer: **0, 1, 2, 3, 4, 5, 6, 7, 8, 9**." }]),
          { id: "q1b", prompt: "The face value, place and place value of **5** in **3517248**",
            parts: [nm("f", "Face value", 5), ch("p", "Place", ["Ten thousands", "Lakhs", "Ten lakhs"], "Lakhs"), nm("v", "Place value", 500000)],
            help: [{ text: "With Nepali commas: 35,17,248. Count from the right: 8 ones, 4 tens, 2 hundreds, 7 thousands, 1 ten thousands, **5 lakhs**." },
                   { text: "Answer: face value **5**, place **lakhs**, place value **5,00,000**." }] },
          { id: "q1c", prompt: "The place value of **9** in **46904317** is ____, whereas it is ____ in **49604317**.",
            parts: [nm("a", "In 46904317", 900000), nm("b", "In 49604317", 9000000)],
            help: [{ text: "46904317 = 4,69,04,317. The 9 is in the lakhs place: 9,00,000." },
                   { text: "49604317 = 4,96,04,317. The 9 is in the ten lakhs place: 90,00,000." },
                   { text: "Answer: **9,00,000** and **90,00,000**." }] },
          q("q1d", "If the expanded form of a numeral is 3 × 10⁴ + 2 × 10², the numeral is…", nm("v", "", 30200),
            [{ text: "3 × 10⁴ = 30000 and 2 × 10² = 200." }, { text: "30000 + 200 = ?", ask: ask(30200) }, { text: "Answer: **30200**." }])
        ]
      },
      {
        id: "q2", title: "Quick answers", instruction: "Say and write the answers as quickly as possible.",
        questions: [
          q("q2a", "The least natural number is…", nm("v", "", 1), [{ text: "Natural numbers are 1, 2, 3, …" }, { text: "Answer: **1**." }]),
          q("q2b", "The least whole number is…", nm("v", "", 0), [{ text: "Whole numbers are 0, 1, 2, 3, …" }, { text: "Answer: **0**." }]),
          q("q2c", "The greatest whole number is…", ch("v", "", ["999999999", "It cannot be found (they never end)", "0"], "It cannot be found (they never end)"),
            [{ text: "Whatever number you say, you can always add 1." }, { text: "Answer: there is **no greatest whole number**." }]),
          q("q2d", "Between N = {1, 2, 3, …} and W = {0, 1, 2, 3, …}, the universal set is…", ch("v", "", ["N", "W"], "W"),
            [{ text: "The universal set contains all the elements of the other set. W has everything N has, plus 0." }, { text: "Answer: **W**." }]),
          q("q2e", "The greatest number of 5 digits is…", nm("v", "", 99999), [{ text: "Use the biggest digit, 9, in every place." }, { text: "Answer: **99999**." }]),
          q("q2f", "The least number of 6 digits is…", nm("v", "", 100000), [{ text: "Start with 1 (a number cannot start with 0), then zeros." }, { text: "Answer: **1,00,000**." }]),
          q("q2g", "The greatest number of 4 digits formed by 8, 3, 0, 6 is…", nm("v", "", 8630), [{ text: "Put the digits from biggest to smallest." }, { text: "Answer: **8630**." }]),
          q("q2h", "The least number of 5 digits formed by 7, 0, 2, 4, 9 is…", nm("v", "", 20479, null, [{ answer: 2479, say: "That has only 4 digits. 0 cannot go first, so start with the smallest non-zero digit." }]),
            [{ text: "Smallest to biggest is 0, 2, 4, 7, 9, but a number cannot start with 0." }, { text: "Start with 2, then put 0 next: 2 0 4 7 9." }, { text: "Answer: **20479**." }]),
          q("q2i", "How many millions are there in 40 lakh?", nm("v", "", 4, "million"), [{ text: "10 lakh = 1 million." }, { text: "40 ÷ 10 = 4." }, { text: "Answer: **4 million**." }]),
          q("q2j", "How many crores are there in 3 hundred million?", nm("v", "", 30, "crore", [{ answer: 300000000, say: "That is the number itself. The question asks how many crores." }]),
            [{ text: "1 crore = 10 million." }, { text: "300 million ÷ 10 = ?", ask: ask(30) }, { text: "Answer: **30 crore**." }])
        ]
      },
      {
        id: "q3", title: "Coloured digits", instruction: "Write the place names in both systems, and the face value and place value.",
        questions: [coloured("q3a1", "743809165", 0), coloured("q3a2", "743809165", 2), coloured("q3b1", "41062598700", 0), coloured("q3b2", "41062598700", 3)]
      },
      {
        id: "q4", title: "Commas and names", instruction: "Rewrite each numeral with commas in both systems, then choose its name.",
        questions: [
          commas("q4a", "2705891436", "2,70,58,91,436", "2,705,891,436",
            "Two arab seventy crore fifty-eight lakh ninety-one thousand four hundred thirty-six", "Two billion seven hundred five million eight hundred ninety-one thousand four hundred thirty-six",
            "Two arab seven crore fifty-eight lakh ninety-one thousand four hundred thirty-six", "Two billion seventy million five hundred eighty-nine thousand four hundred thirty-six"),
          commas("q4b", "50398702416", "50,39,87,02,416", "50,398,702,416",
            "Fifty arab thirty-nine crore eighty-seven lakh two thousand four hundred sixteen", "Fifty billion three hundred ninety-eight million seven hundred two thousand four hundred sixteen",
            "Five arab thirty-nine crore eighty-seven lakh two thousand four hundred sixteen", "Fifty billion thirty-nine million eight hundred seventy thousand two hundred forty-one"),
          commas("q4c", "400876593120", "4,00,87,65,93,120", "400,876,593,120",
            "Four kharab eighty-seven crore sixty-five lakh ninety-three thousand one hundred twenty", "Four hundred billion eight hundred seventy-six million five hundred ninety-three thousand one hundred twenty",
            "Four arab eighty-seven crore sixty-five lakh ninety-three thousand one hundred twenty", "Forty billion eighty-seven million six hundred fifty-nine thousand three hundred twenty")
        ]
      },
      {
        id: "q5", title: "Write the numeral", instruction: "Write each numeral using commas.",
        questions: [
          q("q5a", "Six arab forty-five crore seventy nine lakh thirty-five thousand", nu("v", "", "6,45,79,35,000"),
            [{ text: "Fill the places: arab 6 | crore 45 | lakh 79 | thousand 35 | hundreds 000." }, { text: "Answer: **6,45,79,35,000**." }]),
          q("q5b", "Eight hundred fifty-nine billion one hundred twenty-four million ninety thousand", nu("v", "", "859,124,090,000"),
            [{ text: "Billion 859 | million 124 | thousand 090 | hundreds 000." }, { text: "\"Ninety thousand\" must be written as 090 to keep 3 digits." }, { text: "Answer: **859,124,090,000**." }])
        ]
      },
      {
        id: "q6", title: "Big amounts in words", instruction: "Answer each part.",
        questions: [
          { id: "q6a", prompt: "The cost of constructing a road is **Rs 158657000**. Express it in words.",
            parts: [ch("n", "(i) Nepali system", ["One crore fifty-eight lakh sixty-five thousand seven hundred", "Fifteen crore eighty-six lakh fifty-seven thousand", "One hundred fifty-eight crore six lakh"], "Fifteen crore eighty-six lakh fifty-seven thousand"),
                    ch("i", "(ii) International system", ["One hundred fifty-eight million six hundred fifty-seven thousand", "Fifteen million eight hundred sixty-five thousand seven hundred", "One billion fifty-eight million"], "One hundred fifty-eight million six hundred fifty-seven thousand")],
            help: [{ text: "Nepali commas: 15,86,57,000. International commas: 158,657,000." }, { text: "Answer: **fifteen crore eighty-six lakh fifty-seven thousand**; **one hundred fifty-eight million six hundred fifty-seven thousand**." }] },
          { id: "q6b", prompt: "A hydro-electric project's budget is **twenty-eight billion five hundred forty-two million** rupees.",
            parts: [nm("f", "(i) In figures (Rs)", 28542000000), ch("n", "(ii) Nepali system", ["Two arab eighty-five crore forty-two lakh", "Twenty-eight crore five hundred forty-two lakh", "Twenty-eight arab fifty-four crore twenty lakh"], "Twenty-eight arab fifty-four crore twenty lakh")],
            help: [{ text: "Billion 28 | million 542 | thousand 000 | hundreds 000: 28,542,000,000." }, { text: "Nepali commas: 28,54,20,00,000." },
                   { text: "Answer: **28,542,000,000** = **twenty-eight arab fifty-four crore twenty lakh**." }] }
        ]
      },
      {
        id: "q7", title: "Change the units", instruction: "Use: 1 million = 10 lakh, 1 crore = 10 million, 1 arab = 1 billion.",
        questions: [
          q("q7a", "How many lakhs are there in 4 million?", nm("v", "", 40, "lakh"), [{ text: "1 million = 10 lakh, so 4 × 10." }, { text: "Answer: **40 lakh**." }]),
          q("q7b", "How many crores are there in 20 million?", nm("v", "", 2, "crore"), [{ text: "10 million = 1 crore, so 20 ÷ 10." }, { text: "Answer: **2 crore**." }]),
          q("q7c", "How many arabs are there in 30 billion?", nm("v", "", 30, "arab"), [{ text: "1 billion = 1 arab." }, { text: "Answer: **30 arab**." }]),
          q("q7d", "How many millions are there in 5 crore?", nm("v", "", 50, "million"), [{ text: "1 crore = 10 million, so 5 × 10." }, { text: "Answer: **50 million**." }]),
          q("q7e", "How many billions are there in 7 arab?", nm("v", "", 7, "billion"), [{ text: "1 arab = 1 billion." }, { text: "Answer: **7 billion**." }])
        ]
      },
      {
        id: "q8", title: "Digits 4, 7 and 9", instruction: "Use each digit once.",
        questions: [
          { id: "q8a", prompt: "Write all the 3-digit numbers formed from **4, 7 and 9**.", parts: [{ id: "v", label: "", type: "set", answer: ["479", "497", "749", "794", "947", "974"] }],
            help: [{ text: "Start with 4: 479, 497. Start with 7: 749, 794." }, { text: "Start with 9: 947, 974." }, { text: "Answer: **479, 497, 749, 794, 947, 974** (6 numbers)." }] },
          { id: "q8b", prompt: "What are the smallest and the greatest of these numbers?", parts: [nm("s", "Smallest", 479), nm("g", "Greatest", 974)],
            help: [{ text: "Smallest: digits from small to big. Greatest: from big to small." }, { text: "Answer: **479** and **974**." }] }
        ]
      },
      {
        id: "q9", title: "Digits 3, 0, 8 and 6", instruction: "Use each digit once.",
        questions: [
          q("q9a", "Write the 4-digit number with the digits in **decreasing** order.", nm("v", "", 8630), [{ text: "Biggest first: 8, 6, 3, 0." }, { text: "Answer: **8630**." }]),
          q("q9b", "Write a 4-digit number with the digits in **increasing** order (as far as possible).", nm("v", "", 3068, null, [{ answer: 368, say: "0368 is really 368, which has only 3 digits. Put the 0 second." }]),
            [{ text: "Increasing order is 0, 3, 6, 8, but 0368 is not a 4-digit number." }, { text: "Start with 3, then 0: 3068." }, { text: "Answer: **3068**." }]),
          { id: "q9c", prompt: "Write the smallest and the greatest of these two numbers.", parts: [nm("s", "Smallest", 3068), nm("g", "Greatest", 8630)],
            help: [{ text: "Compare 8630 and 3068." }, { text: "Answer: smallest **3068**, greatest **8630**." }] }
        ]
      },
      {
        id: "q10", title: "Greatest and least", instruction: "Find each answer.",
        questions: [
          q("q10a", "Find the sum of the greatest and the least numbers of 6 digits.", nm("v", "", 1099999),
            [{ text: "Greatest 6-digit number: 999999. Least: 100000." }, { text: "999999 + 100000 = ?", ask: ask(1099999) }, { text: "Answer: **10,99,999**." }]),
          q("q10b", "Find the difference between the greatest and the least numbers of 7 digits formed by 3, 0, 1, 8, 5, 9, 4.", nm("v", "", 8819721),
            [{ text: "Greatest: 9854310." }, { text: "Least: 1034589 (0 cannot go first, so it goes second)." }, { text: "9854310 − 1034589 = ?", ask: ask(8819721) }, { text: "Answer: **88,19,721**." }]),
          { id: "q10c", prompt: "Using all the digits **0, 1, 2, 3, 4, 5, 6, 7, 8, 9** (each at most once):",
            parts: [nm("a", "(i) Smallest 9-digit number", 102345678), nm("b", "(ii) Greatest 8-digit number", 98765432), nm("c", "(iii) Difference", 3580246)],
            help: [{ text: "Smallest 9-digit: start with 1, then 0, then 2, 3, …: 102345678." }, { text: "Greatest 8-digit: 98765432." },
                   { text: "102345678 − 98765432 = ?", ask: ask(3580246) }, { text: "Answer: **102345678**, **98765432**, difference **35,80,246**." }] }
        ]
      },
      {
        id: "q11", title: "Letters as digits", instruction: "Write the number using place values. Type × as * or leave it out (10x).",
        questions: [
          q("q11a", "x is at the tens place and y is at the ones place.", ex("v", "Number =", "10x+y"), [{ text: "The tens digit is worth 10 × x." }, { text: "Answer: **10x + y**." }]),
          q("q11b", "a is at the hundreds place, b at the tens place and c at the ones place.", ex("v", "Number =", "100a+10b+c"), [{ text: "Hundreds: 100a. Tens: 10b. Ones: c." }, { text: "Answer: **100a + 10b + c**." }]),
          q("q11c", "p is at the thousands place, q at hundreds, r at tens and s at ones.", ex("v", "Number =", "1000p+100q+10r+s"), [{ text: "1000p + 100q + 10r + s" }, { text: "Answer: **1000p + 100q + 10r + s**." }])
        ]
      },
      {
        id: "q12", title: "Place values in real numbers", instruction: "Creative section B.",
        questions: [
          { id: "q12a", prompt: "The mobile number of Sunayana's father is **9851086083**.",
            parts: [nm("p", "(i) Place value of 5", 50000000), nm("f", "(ii) Face value of 5", 5), nm("d", "(iii) Difference", 49999995)],
            help: [{ text: "With Nepali commas: 9,85,10,86,083. The 5 is in the crores place." },
                   { text: "Place value: 5,00,00,000. Face value: 5." }, { text: "50000000 − 5 = ?", ask: ask(49999995) }, { text: "Answer: **5,00,00,000**, **5**, **4,99,99,995**." }] },
          { id: "q12b", prompt: "Find the sum and difference of the place values of the two **sevens** in **6784037525**.",
            parts: [nm("s", "Sum", 700007000), nm("d", "Difference", 699993000)],
            help: [{ text: "6,78,40,37,525. The first 7 is in the ten crores place: 70,00,00,000." }, { text: "The second 7 is in the thousands place: 7,000." },
                   { text: "Sum: 700000000 + 7000. Difference: 700000000 − 7000." }, { text: "Answer: sum **70,00,07,000**, difference **69,99,93,000**." }] },
          { id: "q12c", prompt: "Find the sum and difference of the place values of **nine** in **49560327** and **1024968**.",
            parts: [nm("s", "Sum", 9000900), nm("d", "Difference", 8999100)],
            help: [{ text: "4,95,60,327: the 9 is in the ten lakhs place, so 90,00,000." }, { text: "10,24,968: the 9 is in the hundreds place, so 900." },
                   { text: "Answer: sum **90,00,900**, difference **89,99,100**." }] }
        ]
      },
      {
        id: "q13", title: "Swapping digits", instruction: "Answer each part.",
        questions: [
          { id: "q13a", prompt: "Himmat got **85** marks. Chhiring got the marks formed by reversing the digits of Himmat's marks.",
            parts: [nm("c", "(i) Chhiring's marks", 58), nm("s", "(ii) Sum", 143), nm("d", "Difference", 27)],
            help: [{ text: "Reverse 85: 58." }, { text: "85 + 58 = 143 and 85 − 58 = 27." }, { text: "Answer: **58**, sum **143**, difference **27**." }] },
          { id: "q13b", prompt: "An umbrella costs **Rs 468**. A school bag costs the number made by swapping the hundreds and tens digits of the umbrella's cost.",
            parts: [nm("b", "(i) Cost of the bag (Rs)", 648), nm("t", "(ii) Both items (Rs)", 1116), ch("m", "(iii) More expensive", ["Umbrella", "School bag"], "School bag"), nm("by", "By how much (Rs)", 180)],
            help: [{ text: "468: hundreds 4, tens 6. Swap them: 648." }, { text: "468 + 648 = 1116." }, { text: "648 − 468 = 180." }, { text: "Answer: **Rs 648**, **Rs 1116**, the **school bag** by **Rs 180**." }] }
        ]
      }
    ]
  });
})();
