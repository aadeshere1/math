# Science lessons

The science page (`science.html`) has its own engine (`science.js`). It does not touch the maths engine (`engine.js`) or the maths lessons. Both pages share the look in `shared.css`, and the science engine uses the small helpers in `shared.js` (building HTML and SVG, saving progress, shuffling, reading aloud).

Progress is saved in the browser under `science:<lesson id>`, apart from maths progress.

## Files

- `science.js`: the engine. It handles the chapter list, the Learn pages, the question types, the help steps and the points.
- `science/figures-*.js`: picture packs. Each one adds drawings to `Science.figures`. `figures-earth.js` has the soil pictures: `field`, `jar`, `formation`, `humus`, `soiltypes`, `profile`, `pollution`, `acidrain`, `erosion`, `trays`, `terrace`, `cards`, `flow`, `methods`, `mindmap` and `scenes`.
- `science/<lesson>.js`: lesson data only, registered with `Science.register({...})`.

To add a chapter, add its lesson file (and a picture pack if it needs new drawings) to `science.html`, after `science/figures-earth.js`.

## Lesson format

```js
Science.register({
  id: "sci-earth-g6-11-1-soil", subject: "Science", unit: "Earth and Space", title: "11.1 Soil", icon: "🌱",
  topic: "…", level: "Grade 6", source: "Book, pages …",
  words: [{ en: "Soil", ne: "माटो", mean: "simple meaning" }],          // word bank; ne = Nepali
  learn: [{ id: "l1", title: "What is soil?", figure: { type: "field" },
            say: ["Short, simple sentences. **Bold** for key words."],
            words: ["Soil"],                                           // chips under the page (must be in words)
            know: "Do you know? box", try: "Activity box" }],
  sections: [{ id: "q1", title: "Test your concept", icon: "✅", instruction: "…", questions: [ … ] }]
});
```

Every learn page and question has a 🔊 button that reads it aloud. The "अ Nepali words" switch shows or hides the Nepali words.

## Question types

Every question has `id`, `type`, `prompt`, an optional `figure`, and `help`: a list of steps `{ text, figure? }`. The last step should start with "Answer:". Showing it fills in the right answer.

| type | fields | the student… |
|---|---|---|
| `choice` | `options`, `answer`, `keep` (keep the order) | picks one |
| `tf` | `answer: true/false` | picks True or False |
| `multi` | `options`, `answers` | picks all the right ones |
| `word` | `accept` (list of accepted words) | types a word |
| `order` | `items` in the right order | puts them in order with ▲ ▼ |
| `match` | `pairs` [[left, right]], `extra` (wrong choices) | picks a match for each |
| `sort` | `buckets`, `items` [[text, bucket index]] | puts each item in a group |

Points work as in maths: 10 for a question solved on the first try with no help, minus 2 for each wrong try and 1 for each help step, never below 3.
