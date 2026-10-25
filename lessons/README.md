# Adding a lesson

The game has two parts:

- `engine.js` runs the game (scoring, checking answers, step-by-step help, drawings). It has no subject content.
- `lessons/*.js` hold the questions. Each file calls `Practice.register({...})` once.

To add a lesson (any subject):

1. Copy `math-angles-g6.js` to a new file, e.g. `lessons/science-plants-g5.js`.
2. Change `id`, `subject`, `title`, `level`, `source` and replace `sections`.
3. Add one line to `index.html`, after the other lesson scripts:
   `<script src="lessons/science-plants-g5.js"></script>`

Lessons with the same `subject` are grouped together on the home screen.

## Lesson shape

```js
Practice.register({
  id: "unique-id",                 // also used to save progress
  subject: "Mathematics",
  unit: "Angles",                  // lessons with the same subject + unit show as tabs (e.g. one per exercise)
  title: "Exercise 14.2",
  topic: "Pairs of angles",        // optional subtitle
  level: "Grade 6",                // optional
  source: "Book, exercise",        // optional
  reference: {                     // optional "remember" table shown beside the questions
    title: "...", columns: ["A", "B"], rows: [["a1", "b1"]]
  },
  sections: [
    {
      id: "q1", title: "Short name", instruction: "What the student must do",
      questions: [ /* see below */ ]
    }
  ]
});
```

## Question shape

```js
{
  id: "q1a",                        // unique within the lesson
  prompt: "Text. **bold** works.",
  figure: { ... },                  // optional drawing, see below
  parts: [                          // one or more answer boxes
    { id: "size", label: "Size", type: "number", answer: 50, unit: "°", tolerance: 2,
      mistakes: [{ answer: 130, say: "Feedback for this common wrong answer" }] }
  ],
  help: [                           // shown one step at a time after "Help required"
    { text: "A hint." },
    { text: "A step with a mini question.", ask: { type: "number", answer: 90 } },
    { text: "A step with its own drawing.", figure: { type: "clock", sweep: 15 } },
    { text: "Answer: ..." }         // a last step starting with "Answer" gets a ✓ badge
  ]
}
```

Answer types (used in `parts` and in `ask`):

| type        | answer                | notes |
|-------------|-----------------------|-------|
| `number`    | `50`                  | `unit`, `tolerance`, `mistakes` optional. Accepts "50", "50°", "x = 50". |
| `choice`    | `"Acute"`             | needs `options: [...]`; shown as buttons. Use an array to accept several answers. |
| `text`      | `"O"`                 | case-insensitive; `accept: [...]` for other spellings. |
| `angleName` | `"AOB"`               | accepts AOB or BOA, with or without ∠. |
| `segments`  | `["OA", "OB"]`        | any order, either direction (OA = AO). |
| `set`       | `["11", "13", "17"]`  | listing method. Any order; braces optional; spaces or commas. Repeated elements get "write each element only once". `[]` is the empty set (student types {} or ∅). `accept: [[...]]` for other right sets. |
| `numeral`   | `"2,70,58,91,436"`    | a number with commas. Checks the commas are in the right places and explains the Nepali (3, then 2s) or International (3s) rule when they are not. |
| `expr`      | `"3x^2+4y"`           | algebra. Accepts any equal answer written in simplest form (4y + 3x is fine; 2x + x + 4y gets "simplify fully"). `form: "any"` also accepts unsimplified forms such as 2(x + y). `form: "exact"` compares the text, e.g. `"2^2×3^2"` with `accept: [...]`. Students type powers with ^ (or ², ³). |

Points: 10 per question, minus 2 per wrong check and 1 per help step opened (never below 3).

## Figures

- `{ type: "angle", vertex: "O", rays: [{ deg: 0, label: "A" }, { deg: 90, dashed: true }], arcs: [{ from: 0, to: 50, label: "x°", r: 30, right: false, dashed: false }], protractor: { base: 0, hidden: false } }`
  Degrees go counter-clockwise from pointing right (0 = right, 90 = up). Arcs go counter-clockwise from `from` to `to`. `right: true` draws a square corner. `protractor.hidden: true` adds a "Place protractor" button.
- `{ type: "geo", points: { A: [0, 0], _B: [100, 0, 270] }, meet: { O: ["A", "B", "C", "D"] }, lines: [["A", "B", 2, 0.5]], marks: [{ at: "O", a: "A", b: "-C", label: "x°", r: 16, reflex: false, right: false, bare: false }] }`
  For several crossing points (parallel lines, triangles). Points use maths coordinates (y goes up); an optional third number sets the label direction. Names starting with `_` are not labelled. `meet` places a point where two lines cross. Lines are `[from, to, arrowCount, arrowPosition]`. A mark sits at a point between two directions, each a point name, `"-Name"` (the opposite direction) or a number of degrees; it marks the smaller angle unless `reflex: true`. `bare: true` shows only the letter.
- Sections can set `no: "11a"` to show their own question number.
  Extra geo options: `ticks: [["A", "B", 1]]` draws equal-side tick marks on AB; `circles: [{ at: "O", r: 90 }]` draws a circle; `shade: [{ at: "O", r: 90, from: 0, to: 50, kind: "sector" | "segment", tone: "a" | "b" }]` shades a sector or segment (degrees as for angles).
- An `angle` figure can set `vertexDeg` to choose where the vertex letter goes.
- `{ type: "venn", a: { name: "A", items: [...] }, b: { name: "B", items: [...] } }` draws a Venn diagram. Common items go in the overlap; disjoint sets are drawn apart; a subset is drawn inside. Optional `u: { name: "U", items: [...] }` adds a universal set box.
- `{ type: "grid", rows: [["+", "9", "?a"], ["6", "15", "?b"]] }` draws a table puzzle; a cell starting with `?` is an empty box labelled with the rest of the text.
- `{ type: "clock", sweep: 15 }` draws a clock; `sweep` shades that many minutes from 12.

New drawing types for other subjects can be added in `engine.js` as `Practice.figures.myType = function (spec) { return svgElement; }`.
