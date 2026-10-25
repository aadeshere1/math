/*
  Exercise 1.2: Types of sets, cardinal number, equal/equivalent, disjoint/overlapping, subsets, Venn diagrams.
  Source: Vedanta Excel in Mathematics, Book 6, pages 17-20.
  DATA ONLY. See lessons/README.md for the format.
*/
(function () {
  function ch(id, label, options, answer) { return { id: id, label: label, type: "choice", options: options, answer: answer }; }
  function st(id, label, answer, mistakes) { return { id: id, label: label, type: "set", answer: answer, mistakes: mistakes }; }
  function nm(id, label, answer) { return { id: id, label: label, type: "number", answer: answer }; }
  function S(a) { return "{" + a.join(", ") + "}"; }
  function R(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(String(i)); return o; }

  var TYPES = ["Empty", "Singleton", "Finite", "Infinite"];
  var TYPE_HELP = { text: "Empty: no elements. Singleton: exactly one. Finite: you can finish counting. Infinite: it never ends (…)." };
  var EQ = ["Equal", "Equivalent (not equal)", "Neither"];
  var EQ_HELP = { text: "**Equal** sets have exactly the same elements. **Equivalent** sets have the same number of elements." };
  var OD = ["Overlapping", "Disjoint"];
  var OD_HELP = { text: "**Overlapping** sets share at least one element. **Disjoint** sets share none." };
  var TYPE = "Type elements with commas. Order does not matter. Type {} for the empty set.";

  function typ(id, prompt, answer, why) {
    return { id: id, prompt: prompt, parts: [ch("v", "", TYPES, answer)], help: [TYPE_HELP, { text: why }, { text: "Answer: **" + answer.toLowerCase() + " set**." }] };
  }
  function card(id, prompt, n, why) {
    return { id: id, prompt: prompt, parts: [nm("v", "n =", n)], help: [{ text: "The cardinal number n(A) is how many different elements A has." }, { text: why }, { text: "Answer: **" + n + "**." }] };
  }
  function eqv(id, a, b, answer, why) {
    return { id: id, prompt: a + " and " + b + ". These sets are…", parts: [ch("v", "", EQ, answer)], help: [EQ_HELP, { text: why }, { text: "Answer: **" + answer.toLowerCase() + "**." }] };
  }
  function od(id, a, b, answer, why) {
    return { id: id, prompt: a + " and " + b + ". These sets are…", parts: [ch("v", "", OD, answer)], help: [OD_HELP, { text: why }, { text: "Answer: **" + answer.toLowerCase() + "**." }] };
  }
  function sub(id, a, b, isSub, why) {
    var yes = a + " ⊂ " + b, no = a + " ⊄ " + b;
    return { id: id, prompt: a + " __ " + b, parts: [ch("v", "", [yes, no], isSub ? yes : no)],
      help: [{ text: "X ⊂ Y means **every** element of X is also in Y." }, { text: why }, { text: "Answer: **" + (isSub ? yes : no) + "**." }] };
  }
  function listType(id, prompt, items, answer, why) {
    return { id: id, prompt: prompt, parts: [st("l", "List", items), ch("t", "Type", TYPES, answer)],
      help: [TYPE_HELP, { text: why }, { text: "Answer: **" + S(items) + "**, " + answer.toLowerCase() + " set." }] };
  }
  function listN(id, prompt, items, why) {
    return { id: id, prompt: prompt, parts: [st("l", "List", items), nm("n", "n =", items.length)],
      help: [{ text: why }, { text: "Count them: n = " + items.length + "." }, { text: "Answer: **" + S(items) + "**, n = **" + items.length + "**." }] };
  }
  function common(id, prompt, a, b, both, figure) {
    return { id: id, prompt: prompt, figure: figure, parts: [st("v", "Common elements", both)],
      help: [{ text: "Find the elements that are in **both** sets. In a Venn diagram they sit where the circles overlap." },
             { text: "Diagram:", figure: { type: "venn", a: a, b: b } }, { text: "Answer: **" + S(both) + "**." }] };
  }

  var N10 = R(1, 10), A10 = ["2", "4", "6", "8", "10"];

  Practice.register({
    id: "math-sets-g6-ex1-2",
    subject: "Mathematics",
    unit: "Sets",
    title: "Exercise 1.2",
    topic: "Types of sets and cardinal number",
    level: "Grade 6",
    source: "Vedanta Excel in Mathematics, Book 6 · pages 17–20",

    reference: {
      title: "Kinds of sets",
      columns: ["Word", "Meaning and example"],
      rows: [
        ["Empty (null) set", "No elements: { } or ∅. Example: {natural numbers less than 1}"],
        ["Singleton (unit) set", "Exactly one element: {Mt. Everest}"],
        ["Finite / infinite", "{2, 4, 6} is finite. {2, 4, 6, …} is infinite."],
        ["Cardinal number n(A)", "A = {a, b, c} so n(A) = 3"],
        ["Equal / equivalent", "{1, 2} = {2, 1} are equal. {1, 2} and {a, b} are equivalent."],
        ["Overlapping / disjoint", "{1, 2} and {2, 3} overlap. {1, 2} and {3, 4} are disjoint."],
        ["Subset ⊂", "{2, 4} ⊂ {1, 2, 3, 4}, but {2, 5} ⊄ {1, 2, 3, 4}"]
      ]
    },

    sections: [
      {
        id: "q1", title: "What type of set?", instruction: "Say whether each set is empty, singleton, finite or infinite.",
        questions: [
          typ("q1a", "A = {2, 4, 6, 8, 10, …}", "Infinite", "The dots (…) show it goes on forever."),
          typ("q1b", "B = {2, 3, 5, 7, 11, 13}", "Finite", "It has 6 elements and then it stops."),
          typ("q1c", "C = {Mt. Everest}", "Singleton", "It has exactly one element."),
          typ("q1d", "D = {composite number between 4 and 6}", "Empty", "The only number between 4 and 6 is 5, and 5 is prime.")
        ]
      },
      {
        id: "q2", title: "Cardinal number", instruction: "Fill in the blank.",
        questions: [
          card("q2a", "If N = {11, 12, 13, 14}, n(N) = ?", 4, "Count: 11, 12, 13, 14."),
          card("q2b", "If S = {1, 4, 9, …, 49}, n(S) = ?", 7, "These are square numbers: 1², 2², 3², …, 7² = 49.")
        ]
      },
      {
        id: "q3", title: "Equal or equivalent?", instruction: "Compare the two sets.",
        questions: [
          eqv("q3a", "A = {e, f, g, h}", "B = {g, f, h, e}", "Equal", "Both have e, f, g, h. Only the order is different."),
          eqv("q3b", "X = {3, 6, 9, 12}", "Y = {1, 3, 5, 7}", "Equivalent (not equal)", "Both have 4 elements, but the elements are different.")
        ]
      },
      {
        id: "q4", title: "Overlapping or disjoint?", instruction: "Do the sets share any element?",
        questions: [
          od("q4a", "P = {1, 3, 5, 7, 9}", "Q = {2, 4, 6, 8}", "Disjoint", "P is all odd and Q is all even. Nothing is shared."),
          od("q4b", "A = {5, 10, 15, 20}", "B = {4, 8, 12, 16, 20}", "Overlapping", "20 is in both sets.")
        ]
      },
      {
        id: "q5", title: "⊂ or ⊄", instruction: "N = {1, 2, 3, …, 10} and A = {2, 4, 6, 8, 10}.",
        questions: [
          sub("q5a", "B = {2, 3, 5, 7}", "N", true, "2, 3, 5 and 7 are all between 1 and 10."),
          sub("q5b", "C = {4, 8, 12}", "A", false, "12 is not in A."),
          sub("q5c", "{3, 6, 9, 12}", "N", false, "12 is bigger than 10, so it is not in N."),
          sub("q5d", "{4, 6, 8}", "A", true, "4, 6 and 8 are all in A.")
        ]
      },
      {
        id: "q6", title: "List and name the type", instruction: "List the elements, then choose the type. " + TYPE,
        questions: [
          listType("q6a", "A = {prime number between 5 and 7}", [], "Empty", "The only number between 5 and 7 is 6, and 6 is not prime."),
          listType("q6b", "B = {multiples of 2 less than 20}", ["2", "4", "6", "8", "10", "12", "14", "16", "18"], "Finite", "It stops at 18, so you can count them all."),
          { id: "q6c", prompt: "C = {multiples of 2 greater than 20}", parts: [ch("l", "List", ["{22, 24, 26, …}", "{20, 22, 24}", "{22, 24, 26, 28, 30}"], "{22, 24, 26, …}"), ch("t", "Type", TYPES, "Infinite")],
            help: [TYPE_HELP, { text: "22, 24, 26, … never ends, so we use dots." }, { text: "Answer: **{22, 24, 26, …}**, infinite set." }] },
          listType("q6d", "D = {square numbers between 10 and 20}", ["16"], "Singleton", "9 is less than 10 and 25 is more than 20. Only 16 = 4² fits.")
        ]
      },
      {
        id: "q7", title: "List and count", instruction: "List the elements, then find the cardinal number. " + TYPE,
        questions: [
          listN("q7a", "A = {natural numbers less than 10}", R(1, 9), "Natural numbers start at 1."),
          listN("q7b", "B = {factors of 18}", ["1", "2", "3", "6", "9", "18"], "Pairs: 1 × 18, 2 × 9, 3 × 6."),
          listN("q7c", "C = {letters of the word 'apple'}", ["a", "p", "l", "e"], "p comes twice but is written once."),
          listN("q7d", "D = {square numbers less than 75}", ["1", "4", "9", "16", "25", "36", "49", "64"], "1², 2², …, 8² = 64. 9² = 81 is too big.")
        ]
      },
      {
        id: "q8", title: "List, count and name", instruction: "Answer each part. " + TYPE,
        questions: [
          { id: "q8a", prompt: "A = {x : x is a natural number less than 1}",
            parts: [st("i", "(i) List", []), nm("ii", "(ii) n(A) =", 0), ch("iii", "(iii) Type", TYPES, "Empty")],
            help: [{ text: "The smallest natural number is 1. Nothing is less than 1." }, { text: "Answer: **{ }**, n(A) = **0**, **empty set**." }] },
          { id: "q8b", prompt: "P = {x : x is a prime number between 12 and 15}",
            parts: [st("i", "(i) List", ["13"]), nm("ii", "(ii) n(P) =", 1), ch("iii", "(iii) Type", TYPES, "Singleton")],
            help: [{ text: "Check 13 and 14. 14 = 2 × 7, but 13 is prime." }, { text: "Answer: **{13}**, n(P) = **1**, **singleton set**." }] }
        ]
      },
      {
        id: "q9", title: "Equal or equivalent?", instruction: "List the elements, then compare. " + TYPE,
        questions: [
          { id: "q9a", prompt: "A = {whole numbers less than 5} and B = {1, 2, 3, 4, 5}",
            parts: [st("l", "A =", R(0, 4), [{ answer: R(1, 4), say: "Whole numbers start at 0." }]), ch("v", "A and B are", EQ, "Equivalent (not equal)")],
            help: [{ text: "A = {0, 1, 2, 3, 4}." }, EQ_HELP, { text: "Both have 5 elements, but A has 0 and B has 5." }, { text: "Answer: **equivalent**, not equal." }] },
          { id: "q9b", prompt: "P = {x : x is a prime number, x < 10} and Q = {7, 5, 3, 2}",
            parts: [st("l", "P =", ["2", "3", "5", "7"]), ch("v", "P and Q are", EQ, "Equal")],
            help: [{ text: "P = {2, 3, 5, 7}." }, EQ_HELP, { text: "Q has the same elements in a different order." }, { text: "Answer: **equal**." }] }
        ]
      },
      {
        id: "q10", title: "Overlapping or disjoint?", instruction: "List the elements, then compare. " + TYPE,
        questions: [
          { id: "q10a", prompt: "A = {factors of 12} and B = {factors of 18}",
            parts: [st("a", "A =", ["1", "2", "3", "4", "6", "12"]), st("b", "B =", ["1", "2", "3", "6", "9", "18"]), ch("v", "A and B are", OD, "Overlapping")],
            help: [{ text: "A = {1, 2, 3, 4, 6, 12} and B = {1, 2, 3, 6, 9, 18}." }, OD_HELP, { text: "1, 2, 3 and 6 are in both." }, { text: "Answer: **overlapping**." }] },
          { id: "q10b", prompt: "P = {first five multiples of 4} and Q = {first five multiples of 7}",
            parts: [st("a", "P =", ["4", "8", "12", "16", "20"]), st("b", "Q =", ["7", "14", "21", "28", "35"]), ch("v", "P and Q are", OD, "Disjoint")],
            help: [{ text: "P = {4, 8, 12, 16, 20} and Q = {7, 14, 21, 28, 35}." }, OD_HELP, { text: "No number is in both." }, { text: "Answer: **disjoint**." }] }
        ]
      },
      {
        id: "q11", title: "Read the Venn diagram", instruction: "Write the set of common elements. " + TYPE,
        questions: [
          common("q11a", "Find the common elements of A and B.", { name: "A", items: ["a", "b", "c", "d", "e"] }, { name: "B", items: ["a", "e", "i", "o", "u"] }, ["a", "e"],
            { type: "venn", a: { name: "A", items: ["b", "c", "d", "a", "e"] }, b: { name: "B", items: ["a", "e", "i", "o", "u"] } }),
          common("q11b", "Find the common elements of P and Q.", { name: "P", items: ["1", "2", "3", "4", "5"] }, { name: "Q", items: ["1", "3", "5", "7", "9"] }, ["1", "3", "5"],
            { type: "venn", a: { name: "P", items: ["2", "4", "1", "3", "5"] }, b: { name: "Q", items: ["1", "3", "5", "7", "9"] } }),
          common("q11c", "Find the common elements of M and N.", { name: "M", items: ["2", "4", "6", "8", "10", "12"] }, { name: "N", items: ["3", "6", "9", "12", "15"] }, ["6", "12"],
            { type: "venn", a: { name: "M", items: ["2", "4", "8", "10", "6", "12"] }, b: { name: "N", items: ["3", "9", "15", "6", "12"] } })
        ]
      },
      {
        id: "q12", title: "Common elements", instruction: "List the common elements in a separate set. The help shows the diagram. " + TYPE,
        questions: [
          common("q12a", "A = {1, 2, 3, 4, 5, 6, 7, 8, 9} and B = {2, 3, 5, 7}", { name: "A", items: R(1, 9) }, { name: "B", items: ["2", "3", "5", "7"] }, ["2", "3", "5", "7"]),
          common("q12b", "P = {2, 4, 6, 8, 10} and Q = {4, 8, 12, 16}", { name: "P", items: A10 }, { name: "Q", items: ["4", "8", "12", "16"] }, ["4", "8"])
        ]
      },
      {
        id: "q13", title: "Two sets, four questions", instruction: "Answer each part. " + TYPE,
        questions: [
          { id: "q13a", prompt: "B = {letters of the word 'ball'} and C = {letters of the word 'call'}",
            parts: [st("b", "(i) B =", ["b", "a", "l"]), st("c", "C =", ["c", "a", "l"]),
                    nm("nb", "(ii) n(B) =", 3), nm("nc", "n(C) =", 3),
                    ch("v", "(iii) B and C are", EQ, "Equivalent (not equal)")],
            help: [{ text: "'ball' has b, a, l (l twice, written once). 'call' has c, a, l." }, { text: "Each set has 3 elements." }, EQ_HELP,
                   { text: "Same number of elements, but b is only in B and c is only in C." },
                   { text: "(iv) Diagram:", figure: { type: "venn", a: { name: "B", items: ["b", "a", "l"] }, b: { name: "C", items: ["c", "a", "l"] } } },
                   { text: "Answer: **{b, a, l}**, **{c, a, l}**, n = **3** each, **equivalent**." }] },
          { id: "q13b", prompt: "P = {x : x is a prime number less than 10} and Q = {y : y is an even number less than 10}",
            parts: [st("p", "(i) P =", ["2", "3", "5", "7"]), { id: "q", label: "Q =", type: "set", answer: ["2", "4", "6", "8"], accept: [["0", "2", "4", "6", "8"]] },
                    ch("v", "(ii) P and Q are", OD, "Overlapping"),
                    st("r", "(iii) R = common elements", ["2"]), nm("n", "n(R) =", 1)],
            help: [{ text: "P = {2, 3, 5, 7}. Q = {2, 4, 6, 8} (0 is not counted here)." }, OD_HELP, { text: "2 is in both, so they overlap." },
                   { text: "(iv) Diagram:", figure: { type: "venn", a: { name: "P", items: ["2", "3", "5", "7"] }, b: { name: "Q", items: ["2", "4", "6", "8"] } } },
                   { text: "Answer: **overlapping**, R = **{2}**, n(R) = **1**." }] }
        ]
      }
    ]
  });
})();
