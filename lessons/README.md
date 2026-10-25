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
| `number`    | `50`                  | `unit`, `tolerance`, `mistakes` optional; `alt: [50]` accepts other right answers. Accepts "50", "50°", "x = 50". |
| `choice`    | `"Acute"`             | needs `options: [...]`; shown as buttons. Use an array to accept several answers. |
| `text`      | `"O"`                 | case-insensitive; `accept: [...]` for other spellings. |
| `angleName` | `"AOB"`               | accepts AOB or BOA, with or without ∠. |
| `segments`  | `["OA", "OB"]`        | any order, either direction (OA = AO). |
| `set`       | `["11", "13", "17"]`  | listing method. Any order; braces optional; spaces or commas. Repeated elements get "write each element only once". `[]` is the empty set (student types {} or ∅). `accept: [[...]]` for other right sets. |
| `numeral`   | `"2,70,58,91,436"`    | a number with commas. Checks the commas are in the right places and explains the Nepali (3, then 2s) or International (3s) rule when they are not. |
| `factors`   | `12`                  | prime factorisation of the number. Accepts 2 × 2 × 3, 2*2*3, 2x2x3, 2^2 × 3 or 2² × 3. Explains when a factor is not prime or the product is wrong. |
| `frac`      | `"3/8"`               | one fraction; any equal fraction is accepted. `den: 8` requires that denominator; `lowest: true` requires lowest terms. `mixedOk: true` also accepts a mixed number (1 3/4); the answer itself may then be written as a mixed number. |
| `mixed`     | `"2 3/4"`             | a mixed number: whole number, space, fraction. An equal improper fraction gets "write it as a mixed number"; the fraction part must be less than 1 and in lowest terms. |
| `point`     | `"(2, -3)"`           | a point typed as (x, y). Says when x and y are swapped, or which coordinate is wrong. |
| `plot`      | `"(2, -3)"`           | the student clicks the point on a grid (arrow keys work too). `range: [-8, 8, -8, 8]` sets the grid (default −5 to 5). Same feedback as `point`. |
| `equiv`     | `"1/2"`               | a list of fractions equivalent to the answer, e.g. 2/4, 3/6, 4/8. `count` (default 3); `mode: "mul"` wants ×2, ×3, ×4; `mode: "div"` wants smaller denominators. Give `example` with one right list. |
| `dec`       | `"0.62"`              | a decimal. Accepts .62 and 0.620. Says when the decimal point is in the wrong place, or when a fraction was typed (`fracOk: true` allows an equal fraction). `dp: 2` with `round: "0.39768"` is for rounding: it needs exactly 2 decimal places (0.40) and explains rounding up. `tolerance` for recurring decimals. |
| `expand`    | `"0.25"`              | expanded form, e.g. 0.2 + 0.05, 2/10 + 5/100 or 2 × 0.1 + 5 × 0.01. Each part must be one digit in its place. Give `example`. |
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
- `{ type: "grid", plain: true, rows: [...] }` draws the table without a heading row and column; a cell `"#"` is a grey empty square (for number puzzles).
- `{ type: "grid", cws: [110, 70, 70], rows: [...] }` gives each column its own width, for data tables with long words.
- `{ type: "bars", max: 100, step: 10, unit: "%", bars: [["Orange", 90, "a"], ["Potato", 70, "c"]], xlabel: "Fruits", ylabel: "Water content", values: false }` draws a bar graph with grid lines.
- `{ type: "hgrid", cells: [[0, 7, "a"], [7, 35, "b"]], rects: [[0, 0, 3, 10, "a"], [0, 0, 3, 2, "c"]], top: ["0.3", 0, 3], left: ["0.2", 0, 2], small: true }` draws a 10 × 10 grid. `cells` shade squares in reading order; `rects` shade blocks (columns c0–c1, rows r0–r1); tone `"c"` is the dark overlap. `top` and `left` add a bracket with a label.
- `{ type: "flow", nodes: { s: [0, 0, "0.6"], a: [1, 0, "?a"] }, arrows: [["s", "a", "÷ 2"]] }` draws an arrow puzzle: circles on a grid (column, row) joined by labelled arrows; `"?a"` is an empty circle labelled a.
- `{ type: "ftree", root: { v: "18", kids: [{ v: "2" }, { v: "?a", kids: [{ v: "?b" }, { v: "3" }] }] } }` draws a factor tree; `?a` is an empty circle labelled a.
- `{ type: "nline", from: -10, to: 10, hops: [[0, 3], [3, 6]], big: [0, 6] }` draws a number line with jumps; `big` adds a dashed arc for the total.
- `{ type: "fbar", parts: 8, shade: [[0, 3, "a"], [3, 5, "b"]] }` and `{ type: "pie", parts: 6, shade: [[0, 1, "a"]] }` draw a fraction bar or circle with shaded parts. Add `count: 3` to draw 3 bars (stacked) or 3 circles (side by side); shade indexes then run on across them, e.g. parts 4, count 3, shade [[0, 11]] shows 11/4. Tone `"x"` draws crossed-out parts (shaded with an X), for subtraction pictures.
- `{ type: "row", items: [{ type: "fbar", parts: 2, shade: [[0, 1]], caption: "1/2" }, "+", { type: "fbar", parts: 3, shade: [[0, 1]], caption: "1/3" }] }` puts small figures in a row with signs between them; `caption` goes under a figure.
- `{ type: "coord", range: [-5, 5, -5, 5], points: { A: [2, 3] }, polys: [["P", "Q", "R", "S"]], open: [["E", "F", "G"]] }` draws a coordinate grid with axes X'OX and Y'OY, labelled points, closed shapes (`polys`) and open paths (`open`).
- `{ type: "lk", kind: "ray", a: "A", b: "B" }` draws a ray, `line`, `segment` or `curve` named by two letters.
- `{ type: "clock", sweep: 15 }` draws a clock; `sweep` shades that many minutes from 12.

New drawing types for other subjects can be added in `engine.js` as `Practice.figures.myType = function (spec) { return svgElement; }`.

## Helpers for number lessons

`Practice.nt` has `isPrime(n)`, `factors(n)`, `pf(n)` (prime factors as a list), `hcf(a, b, …)`, `lcm(a, b, …)`, `multiples(n, k)`, `pfStr(n)` ("2 × 2 × 3") and `pfPow(n)` ("2² × 3"). Lesson files can use them to build many similar questions, as the Chapter 3 lessons do.

### Fraction helpers (`Practice.fr`)

- `Practice.fr.of("2 3/4")` gives `[11, 4]`; `add`, `sub`, `mul`, `div` work on these pairs; `str` gives "11/4" and `mixed` gives "2 3/4".
- `Practice.fr.calc(id, "3 2/3 + 2 5/6 − 4 4/9", opts)` builds a whole question with worked help steps. Operators are `+ − × ÷ of`, each with a space on both sides; "of" is done first, then × and ÷, then + and −. Whole-number answers use a number box; others a fraction box (lowest terms, mixed numbers allowed). `opts`: `prompt`, `label`, `unit`, `answer` (shown answer), `help` (a list of step texts to use instead of the automatic ones), `showMixed`.


### Decimal helpers (`Practice.dec`)

- Values are exact fractions, so 0.1 + 0.2 is exactly 0.3. `of("0.25")` gives `[1, 4]`; `str(v)` gives "0.25"; `round("0.39768", 2)` gives "0.40"; `dps("0.25")` gives 2.
- `Practice.dec.calc(id, "12 × (4.8 ÷ 0.3) − 3.5 × 3.64", opts)` builds a whole question with worked help: line up the points for + and −, count decimal places for ×, make the divisor whole for ÷, move the point for × and ÷ by 10, 100, 1000. Brackets `( ) { } [ ]` and squares `(1.5)²` work. `opts`: `prompt`, `label`, `unit`, `intro` (step texts before), `outro`, `dp` (round the answer), `answer`, `pre`, `mistakes`.
