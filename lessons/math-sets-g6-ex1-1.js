/*
  Exercise 1.1: Sets, membership and three ways of writing a set.
  Source: Vedanta Excel in Mathematics, Book 6, pages 12-14.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function st(id, label, answer, mistakes) { return { id: id, label: label, type: "set", answer: answer, mistakes: mistakes }; }
  function setAns(a) { return "{" + a.join(", ") + "}"; }
  var YN = ["Yes, it is a set", "No, it is not a set"];
  var TF = ["True", "False"];

  function wd(id, what, yes, why) {
    return { id: id, prompt: "Is **" + what + "** a set?", parts: [ch("v", "", YN, yes ? YN[0] : YN[1])],
      help: [{ text: "A set is a **well-defined** collection: everybody must agree on what belongs to it." },
             { text: why }, { text: "Answer: **" + (yes ? "Yes" : "No") + "**." }] };
  }
  function tf(id, stmt, isTrue, why) {
    return { id: id, prompt: "**" + stmt + "**", parts: [ch("v", "", TF, isTrue ? "True" : "False")],
      help: [{ text: "∈ means \"is a member of\". ∉ means \"is not a member of\"." }, { text: why }, { text: "Answer: **" + (isTrue ? "True" : "False") + "**." }] };
  }
  function sym(id, prompt, a, b, inSet, why) {
    var yes = a + " ∈ " + b, no = a + " ∉ " + b;
    return { id: id, prompt: prompt, parts: [ch("v", "", [yes, no], inSet ? yes : no)],
      help: [{ text: why }, { text: "Answer: **" + (inSet ? yes : no) + "**." }] };
  }
  function list(id, prompt, answer, steps, mistakes) {
    return { id: id, prompt: prompt, parts: [st("v", "", answer, mistakes)],
      help: steps.concat([{ text: "Answer: **" + setAns(answer) + "**." }]) };
  }
  function pick(id, prompt, options, answer, steps) {
    return { id: id, prompt: prompt, parts: [ch("v", "", options, answer)], help: steps.concat([{ text: "Answer: **" + answer + "**." }]) };
  }

  var N5 = "N = {1, 2, 3, 4, 5}, O = {1, 3, 5, 7, 9}. ";
  var WE = "W = {0, 1, 2, 3, 4}, E = {2, 4, 6, 8}. ";
  var TYPE = "Type the elements with commas, like 1, 2, 3. Order does not matter.";

  Practice.register({
    id: "math-sets-g6-ex1-1",
    subject: "Mathematics",
    unit: "Sets",
    title: "Exercise 1.1",
    topic: "Sets, members and writing sets",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 12–14",

    reference: {
      title: "Sets",
      columns: ["Idea", "Example"],
      rows: [
        ["A set is a well-defined collection", "The days of the week is a set. Tasty fruits is not."],
        ["∈ means \"is a member of\"", "3 ∈ {1, 3, 5}"],
        ["∉ means \"is not a member of\"", "4 ∉ {1, 3, 5}"],
        ["Description method", "V = {vowels of the English alphabet}"],
        ["Listing method (each element once)", "V = {a, e, i, o, u}"],
        ["Set-builder method", "V = {x : x is a vowel of the English alphabet}"]
      ]
    },

    sections: [
      {
        id: "q1", title: "Well-defined or not?", instruction: "A set must be well-defined.",
        questions: [
          wd("q1a", "the collection of tasty fruits", false, "\"Tasty\" is different for different people, so it is not well-defined."),
          wd("q1b", "the collection of fruits", true, "Everyone agrees on what a fruit is."),
          wd("q1c", "the collection of long rivers", false, "\"Long\" is not exact. People would disagree about which rivers count."),
          wd("q1d", "the collection of rivers of Nepal", true, "We can check exactly which rivers are in Nepal.")
        ]
      },
      {
        id: "q2", title: "True or false", instruction: N5 + "Say whether each statement is true or false.",
        questions: [
          tf("q2a", "4 ∈ N", true, "N has 1, 2, 3, 4, 5. 4 is there."),
          tf("q2b", "4 ∈ O", false, "O has only odd numbers. 4 is not in O."),
          tf("q2c", "5 ∉ N", false, "5 is in N, so \"5 is not a member of N\" is wrong."),
          tf("q2d", "7 ∈ O", true, "7 is in O."),
          tf("q2e", "6 ∉ N", true, "N stops at 5, so 6 is not in N."),
          tf("q2f", "1 ∈ O", true, "1 is the first element of O.")
        ]
      },
      {
        id: "q3", title: "∈ or ∉", instruction: WE + "Choose ∈ or ∉.",
        questions: [
          sym("q3a", "6 __ E", "6", "E", true, "E = {2, 4, 6, 8} has 6."),
          sym("q3b", "3 __ E", "3", "E", false, "E has only even numbers."),
          sym("q3c", "5 __ W", "5", "W", false, "W stops at 4."),
          sym("q3d", "1 __ W", "1", "W", true, "W = {0, 1, 2, 3, 4} has 1."),
          sym("q3e", "4 __ W", "4", "W", true, "4 is the last element of W."),
          sym("q3f", "7 __ E", "7", "E", false, "7 is odd, so it is not in E.")
        ]
      },
      {
        id: "q4", title: "Listing method", instruction: "Write each set in listing method. " + TYPE,
        questions: [
          list("q4a", "The set of prime numbers between 10 and 20", ["11", "13", "17", "19"],
            [{ text: "Check 11 to 19. A prime has only two factors: 1 and itself." }, { text: "12, 14, 15, 16 and 18 can be divided by smaller numbers." }]),
          list("q4b", "The set of letters of the word **'elephant'**", ["e", "l", "p", "h", "a", "n", "t"],
            [{ text: "Write the letters: e, l, e, p, h, a, n, t." }, { text: "**e** comes twice. In a set it is written only once." }]),
          list("q4c", "The set of odd numbers less than 5", ["1", "3"], [{ text: "Odd numbers: 1, 3, 5, … Stop before 5." }]),
          list("q4d", "The set of factors of 12", ["1", "2", "3", "4", "6", "12"],
            [{ text: "Find pairs that multiply to 12: 1 × 12, 2 × 6, 3 × 4." }])
        ]
      },
      {
        id: "q5", title: "Think about sets", instruction: "Creative section.",
        questions: [
          pick("q5a", "What is a set?", ["A well-defined collection of objects", "Any group of things people like", "A list of numbers only"], "A well-defined collection of objects",
            [{ text: "The members of a set can be numbers, letters, people or things, as long as we can tell exactly what belongs." }]),
          pick("q5b", "Is the collection of **nice Nepali songs** a set?", ["Yes, because songs can be counted", "No, because \"nice\" is not well-defined"], "No, because \"nice\" is not well-defined",
            [{ text: "Would everyone agree which songs are \"nice\"?" }]),
          pick("q5c", "Which are the three methods of writing a set?", ["Description, listing and set-builder", "Adding, subtracting and multiplying", "Venn, table and graph"], "Description, listing and set-builder",
            [{ text: "Example: {vowels} (description), {a, e, i, o, u} (listing), {x : x is a vowel} (set-builder)." }]),
          pick("q5d", "Which set is written in **set-builder** method?", ["{x : x is an odd number less than 10}", "{1, 3, 5, 7, 9}", "{odd numbers less than 10}"], "{x : x is an odd number less than 10}",
            [{ text: "Set-builder method uses a letter such as x and a rule: {x : x is …}." }])
        ]
      },
      {
        id: "q6", title: "Use the symbols", instruction: "Write each sentence with ∈ or ∉.",
        questions: [
          sym("q6a", "9 belongs to the set N.", "9", "N", true, "\"Belongs to\" means ∈."),
          sym("q6b", "u is a member of set V.", "u", "V", true, "\"Is a member of\" means ∈."),
          sym("q6c", "3 is not an element of Z.", "3", "Z", false, "\"Is not an element of\" means ∉."),
          sym("q6d", "7 does not belong to {2, 4, 6, 8}.", "7", "{2, 4, 6, 8}", false, "\"Does not belong to\" means ∉."),
          sym("q6e", "'e' belongs to {n, e, p, a, l}.", "e", "{n, e, p, a, l}", true, "\"Belongs to\" means ∈."),
          sym("q6f", "8 is not a member of {1, 3, 5, 7, 9}.", "8", "{1, 3, 5, 7, 9}", false, "\"Is not a member of\" means ∉.")
        ]
      },
      {
        id: "q7", title: "Listing method", instruction: "Describe each set in listing method. " + TYPE,
        questions: [
          list("q7a", "W = {the whole numbers less than 6}", ["0", "1", "2", "3", "4", "5"],
            [{ text: "Whole numbers start at **0**." }], [{ answer: ["1", "2", "3", "4", "5"], say: "Whole numbers start at 0, not 1." }]),
          list("q7b", "M = {the first five multiples of 4}", ["4", "8", "12", "16", "20"], [{ text: "4 × 1, 4 × 2, 4 × 3, 4 × 4, 4 × 5." }]),
          list("q7c", "A = {the letters of the word 'MATHEMATICS'}", ["m", "a", "t", "h", "e", "i", "c", "s"],
            [{ text: "M, A, T, H, E, M, A, T, I, C, S." }, { text: "M, A and T come twice. Write each letter only once." }]),
          list("q7d", "P = {x : x is a prime number, x < 20}", ["2", "3", "5", "7", "11", "13", "17", "19"],
            [{ text: "The smallest prime is 2. 1 is not prime." }], [{ answer: ["1", "2", "3", "5", "7", "11", "13", "17", "19"], say: "1 is not a prime number. It has only one factor." }]),
          list("q7e", "B = {y : y is a composite number, y < 10}", ["4", "6", "8", "9"],
            [{ text: "A composite number has more than two factors." }, { text: "1 is neither prime nor composite." }])
        ]
      },
      {
        id: "q8", title: "Description method", instruction: "Choose the description that matches the set.",
        questions: [
          pick("q8a", "{क, ख, ग, घ, ङ}", ["The first five consonants of the Nepali alphabet", "The vowels of the Nepali alphabet", "All Nepali letters"], "The first five consonants of the Nepali alphabet", [{ text: "These are the first five letters of the Nepali consonants." }]),
          pick("q8b", "N = {1, 2, 3, 4, 5, 6, 7, 8, 9}", ["Natural numbers less than 10", "Whole numbers less than 10", "Odd numbers less than 10"], "Natural numbers less than 10", [{ text: "It starts at 1, not 0, so these are natural numbers." }]),
          pick("q8c", "{2, 3, 5, 7}", ["Odd numbers less than 10", "Prime numbers less than 10", "Factors of 10"], "Prime numbers less than 10", [{ text: "2 is even, so they are not all odd. Each has only two factors." }]),
          pick("q8d", "V = {a, e, i, o, u}", ["Vowels of the English alphabet", "The first five letters", "Letters of the word 'audio'"], "Vowels of the English alphabet", [{ text: "a, e, i, o, u are the vowels." }]),
          pick("q8e", "{1, 2, 7, 14}", ["Factors of 14", "Multiples of 7", "Factors of 7"], "Factors of 14", [{ text: "1 × 14 = 14 and 2 × 7 = 14." }]),
          pick("q8f", "{4, 8, 12, 16}", ["The first four multiples of 4", "Factors of 16", "Even numbers less than 17"], "The first four multiples of 4", [{ text: "4 × 1, 4 × 2, 4 × 3, 4 × 4." }])
        ]
      },
      {
        id: "q9", title: "Set-builder method", instruction: "Choose the set-builder form.",
        questions: [
          pick("q9a", "W = {0, 1, 2, 3, 4}", ["{x : x is a whole number less than 5}", "{x : x is a natural number less than 5}", "{x : x is an even number}"], "{x : x is a whole number less than 5}", [{ text: "0 is in the set, so x is a whole number." }]),
          pick("q9b", "S = {1, 4, 9, 16, 25}", ["{x : x is a square of the first five natural numbers}", "{x : x is an odd number}", "{x : x is a multiple of 4}"], "{x : x is a square of the first five natural numbers}", [{ text: "1², 2², 3², 4², 5²." }]),
          pick("q9c", "O = {1, 3, 5, 7, 9}", ["{x : x is an odd number less than 10}", "{x : x is a prime number less than 10}", "{x : x is a natural number less than 10}"], "{x : x is an odd number less than 10}", [{ text: "1 and 9 are not prime, but all of them are odd." }]),
          pick("q9d", "A = {a, b, c, d, e}", ["{x : x is one of the first five letters of the English alphabet}", "{x : x is a vowel}", "{x : x is a letter of the word 'bead'}"], "{x : x is one of the first five letters of the English alphabet}", [{ text: "a, b, c, d, e are the first five letters." }]),
          pick("q9e", "F = {1, 3, 5, 15}", ["{x : x is a factor of 15}", "{x : x is a multiple of 5}", "{x : x is an odd number less than 16}"], "{x : x is a factor of 15}", [{ text: "1 × 15 and 3 × 5 make 15." }]),
          pick("q9f", "M = {3, 6, 9, 12, 15, 18}", ["{x : x is one of the first six multiples of 3}", "{x : x is a factor of 18}", "{x : x is an odd number}"], "{x : x is one of the first six multiples of 3}", [{ text: "3 × 1 up to 3 × 6." }])
        ]
      },
      {
        id: "q10", no: "10", title: "Putting it together", instruction: "Answer each part.",
        questions: [
          { id: "q10a", prompt: "The numbers **2, 4, 6 and 8** are in a collection.",
            parts: [ch("i", "(i) Is the collection well-defined?", ["Yes", "No"], "Yes"),
                    st("ii", "(ii) Write it in listing method", ["2", "4", "6", "8"]),
                    ch("iii", "(iii) Set-builder method", ["{x : x is an even number less than 10}", "{x : x is a multiple of 4}", "{x : x is a number less than 10}"], "{x : x is an even number less than 10}")],
            help: [{ text: "We know exactly which numbers are in it, so it is well-defined." }, { text: "They are the even numbers 2 to 8, so the even numbers less than 10." },
                   { text: "Answer: **Yes**, **{2, 4, 6, 8}**, **{x : x is an even number less than 10}**." }] },
          { id: "q10b", prompt: "A = {factors of 18}",
            parts: [st("i", "(i) Listing method", ["1", "2", "3", "6", "9", "18"]),
                    ch("ii", "(ii) Is 9 a member of A?", ["9 ∈ A", "9 ∉ A"], "9 ∈ A"),
                    ch("iii", "(iii) Set-builder method", ["{x : x is a factor of 18}", "{x : x is a multiple of 18}", "{x : x is less than 18}"], "{x : x is a factor of 18}")],
            help: [{ text: "Pairs for 18: 1 × 18, 2 × 9, 3 × 6." }, { text: "18 ÷ 9 = 2 exactly, so 9 is a factor." },
                   { text: "Answer: **{1, 2, 3, 6, 9, 18}**, **9 ∈ A**, **{x : x is a factor of 18}**." }] },
          { id: "q10c", prompt: "Rejina wrote the letters of the word **'rhododendron'** as F = {r, h, o, d, o, d, e, n, d, r, o, n}.",
            parts: [ch("i", "(i) Is her answer correct?", ["Yes", "No"], "No"),
                    st("i2", "Write F correctly", ["r", "h", "o", "d", "e", "n"]),
                    ch("ii", "(ii) Is b a member of F?", ["b ∈ F", "b ∉ F"], "b ∉ F"),
                    ch("iii", "(iii) Set-builder method", ["{x : x is a letter of the word 'rhododendron'}", "{x : x is a vowel}", "{x : x is a flower}"], "{x : x is a letter of the word 'rhododendron'}")],
            help: [{ text: "She repeated letters. In a set each element is written only once." }, { text: "Different letters: r, h, o, d, e, n." }, { text: "There is no b in 'rhododendron'." },
                   { text: "Answer: **No**, **{r, h, o, d, e, n}**, **b ∉ F**, **{x : x is a letter of the word 'rhododendron'}**." }] }
        ]
      }
    ]
  });
})();
