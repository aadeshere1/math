/*
  Science engine for Angle Quest.
  Separate from the maths engine (engine.js): it has its own lessons, progress and question types.
  Lesson files call Science.register({...}); picture packs add drawings to Science.figures.
  See science/README.md for the lesson format.
*/
(function () {
  "use strict";
  var S = window.Shared, el = S.el;

  var Science = window.Science = {
    lessons: [],
    figures: {},
    register: function (lesson) {
      Science.lessons = Science.lessons.filter(function (l) { return l.id !== lesson.id; });
      Science.lessons.push(lesson);
    }
  };

  // Draw a picture from a spec like { type: "jar", ... }. opts.small: inside a help step (no buttons).
  Science.figure = function (spec, opts) {
    var fn = spec && Science.figures[spec.type];
    if (!fn) return null;
    try { return fn(spec, opts || {}); } catch (e) { if (window.console) console.error(e); return null; }
  };

  /* ---------- progress ---------- */
  var app, progress = {}, state = { id: null, view: "learn", slide: 0, sec: 0, q: 0 };
  function lessonById(id) { return Science.lessons.filter(function (l) { return l.id === id; })[0]; }
  function lp(l) { return progress[l.id] || (progress[l.id] = S.store("science:" + l.id) || { q: {}, seen: {} }); }
  function save(l) { S.store("science:" + l.id, lp(l)); }
  function allQs(l) { var o = []; l.sections.forEach(function (s) { s.questions.forEach(function (q) { o.push(q); }); }); return o; }
  function stats(l) {
    var p = lp(l), qs = allQs(l), done = 0, pts = 0, seen = 0, tried = 0;
    qs.forEach(function (q) { var r = p.q[q.id]; if (!r) return; if (r.solved) { done++; pts += r.points; } if (r.solved || r.attempts || r.help) tried++; });
    (l.learn || []).forEach(function (s) { if (p.seen[s.id]) seen++; });
    return { done: done, total: qs.length, points: pts, max: qs.length * 10, seen: seen, slides: (l.learn || []).length, tried: tried };
  }
  function secStats(l, sec) { var p = lp(l), d = 0; sec.questions.forEach(function (q) { if ((p.q[q.id] || {}).solved) d++; }); return { done: d, total: sec.questions.length }; }
  Science.stats = function (l) { return stats(l); };

  var nepali = S.store("science:nepali"); if (nepali === null) nepali = true;
  function wordOf(l, en) { var w = (l.words || []).filter(function (x) { return x.en.toLowerCase() === String(en).toLowerCase(); })[0]; return w || { en: en }; }

  /* ---------- small UI pieces ---------- */
  function sayBtn(text, label) {
    if (!S.canSpeak) return null;
    return el("button", { type: "button", class: "say", "aria-label": label || "Read aloud", title: "Read aloud", onclick: function (e) { e.stopPropagation(); S.speak(text); } }, ["🔊"]);
  }
  function wordChips(l, list, out) {
    var info = el("p", { class: "word-info", hidden: "hidden" });
    var row = el("div", { class: "words" }, list.map(function (en) {
      var w = wordOf(l, en);
      return el("button", { type: "button", class: "word", onclick: function () {
        S.speak(w.en + (w.mean ? ". " + w.mean : ""));
        info.hidden = false; info.innerHTML = "<b>" + S.esc(w.en) + "</b>" + (nepali && w.ne ? " <span class=\"ne\">(" + S.esc(w.ne) + ")</span>" : "") + (w.mean ? ": " + S.esc(w.mean) : "");
      } }, [el("span", { class: "word-en", text: w.en }), nepali && w.ne ? el("span", { class: "word-ne", text: w.ne }) : null]);
    }));
    out.appendChild(row); out.appendChild(info);
  }
  function figWrap(spec, opts) {
    var f = Science.figure(spec, opts); if (!f) return null;
    return el("div", { class: "sci-fig" + (opts && opts.small ? " small" : "") }, [f]);
  }

  /* ---------- home ---------- */
  function renderHome() {
    S.stopSpeaking();
    state.id = null; app.innerHTML = "";
    if (Science.aquarium) { try { app.appendChild(Science.aquarium.render()); } catch (e) { if (window.console) console.error(e); } }
    app.appendChild(el("header", { class: "home-head" }, [
      el("p", { class: "eyebrow", text: "Science" }),
      el("h1", { text: "Pick a chapter" }),
      el("p", { class: "lede", text: "First learn with pictures and moving drawings. Tap 🔊 to hear the words. Then practise. Stuck? Press Help required." })
    ]));
    var grid = el("div", { class: "lesson-grid" }), groups = {}, order = [];
    Science.lessons.forEach(function (l) { var g = l.subject + (l.unit ? " · " + l.unit : ""); if (!groups[g]) { groups[g] = []; order.push(g); } groups[g].push(l); });
    order.forEach(function (g) {
      grid.appendChild(el("h2", { class: "subject", text: g }));
      groups[g].forEach(function (l) {
        var st = stats(l);
        grid.appendChild(el("button", { type: "button", class: "lesson-card", onclick: function () { openLesson(l.id); } }, [
          el("span", { class: "lc-level", text: l.level || "" }),
          el("span", { class: "lc-title", text: (l.icon ? l.icon + " " : "") + l.title }),
          l.topic ? el("span", { class: "lc-topic", text: l.topic }) : null,
          el("span", { class: "lc-src", text: l.source || "" }),
          el("span", { class: "meter" }, [el("span", { class: "meter-fill", style: "width:" + (100 * (st.done + st.seen) / Math.max(1, st.total + st.slides)) + "%" })]),
          el("span", { class: "lc-stats", text: st.seen + " of " + st.slides + " learn pages · " + st.done + " of " + st.total + " questions · " + st.points + " points" })
        ]));
      });
    });
    app.appendChild(grid);
  }

  /* ---------- lesson ---------- */
  function openLesson(id, view, a, b) {
    var l = lessonById(id); if (!l) return renderHome();
    state.id = id;
    if (view == null) {
      var st = stats(l);
      if (st.seen < st.slides) { view = "learn"; a = firstUnseen(l); }
      else { view = "sec"; a = firstUnsolvedSec(l); }
    }
    state.view = view;
    if (view === "learn") state.slide = a || 0;
    else { state.sec = a || 0; state.q = b != null ? b : firstUnsolvedQ(l, l.sections[state.sec]); }
    renderLesson();
  }
  function firstUnseen(l) { var p = lp(l); for (var i = 0; i < l.learn.length; i++) if (!p.seen[l.learn[i].id]) return i; return 0; }
  function firstUnsolvedSec(l) { for (var i = 0; i < l.sections.length; i++) { var s = secStats(l, l.sections[i]); if (s.done < s.total) return i; } return 0; }
  function firstUnsolvedQ(l, sec) { var p = lp(l); for (var i = 0; i < sec.questions.length; i++) if (!(p.q[sec.questions[i].id] || {}).solved) return i; return 0; }

  function renderLesson() {
    S.stopSpeaking();
    var l = lessonById(state.id);
    if (state.view === "learn") { var pp = lp(l), sl = l.learn[state.slide]; if (sl && !pp.seen[sl.id]) { pp.seen[sl.id] = true; save(l); } }
    var st = stats(l);
    app.innerHTML = "";
    app.appendChild(el("div", { class: "topbar" }, [
      el("button", { type: "button", class: "link-btn", onclick: renderHome, text: "← All chapters" }),
      el("div", { class: "topbar-r" }, [
        el("button", { type: "button", class: "ne-toggle" + (nepali ? " on" : ""), "aria-pressed": nepali ? "true" : "false", title: "Show Nepali words", onclick: function () { nepali = !nepali; S.store("science:nepali", nepali); renderLesson(); } }, ["अ Nepali words"]),
        el("div", { class: "scorebox" }, [
          el("span", { class: "score-num", text: String(st.points) }), el("span", { class: "score-lbl", text: "points" }),
          el("span", { class: "score-sep" }),
          el("span", { class: "score-num", text: st.done + "/" + st.total }), el("span", { class: "score-lbl", text: "solved" })
        ])
      ])
    ]));
    app.appendChild(el("div", { class: "lesson-title" }, [
      el("p", { class: "eyebrow", text: (l.subject || "Science") + (l.unit ? " · " + l.unit : "") }),
      el("h1", { text: (l.icon ? l.icon + " " : "") + l.title }),
      el("p", { class: "src", text: l.source || "" })
    ]));

    var nav = el("nav", { class: "sec-nav", "aria-label": "Parts of the chapter" });
    nav.appendChild(el("button", { type: "button", class: "sec-btn" + (state.view === "learn" ? " on" : "") + (st.seen === st.slides ? " done" : ""), onclick: function () { openLesson(l.id, "learn", state.view === "learn" ? state.slide : firstUnseen(l)); } }, [
      el("span", { class: "sec-no", text: "📖" }), el("span", { class: "sec-name", text: "Learn" }), el("span", { class: "sec-count", text: st.seen + "/" + st.slides })
    ]));
    l.sections.forEach(function (s, i) {
      var ss = secStats(l, s);
      nav.appendChild(el("button", { type: "button", class: "sec-btn" + (state.view === "sec" && i === state.sec ? " on" : "") + (ss.done === ss.total ? " done" : ""), onclick: function () { openLesson(l.id, "sec", i); } }, [
        el("span", { class: "sec-no", text: s.icon || "Q" + (i + 1) }), el("span", { class: "sec-name", text: s.title }), el("span", { class: "sec-count", text: ss.done + "/" + ss.total })
      ]));
    });
    var side = el("aside", { class: "side" }, [nav, wordBank(l)]);
    var stage = el("section", { class: "stage" });
    app.appendChild(el("div", { class: "layout" }, [stage, side]));
    if (state.view === "learn") renderSlide(l, stage); else renderQuestion(l, stage);
  }

  function wordBank(l) {
    if (!l.words || !l.words.length) return null;
    return el("details", { class: "refbox" }, [
      el("summary", { text: "Word bank" + (nepali ? " · शब्द भण्डार" : "") }),
      el("div", { class: "ref-scroll" }, [el("table", { class: "ref" }, [
        el("tbody", {}, l.words.map(function (w) {
          return el("tr", {}, [el("th", {}, [w.en, nepali && w.ne ? el("span", { class: "ne block", text: w.ne }) : null]), el("td", { text: w.mean || "" }),
            el("td", {}, [sayBtn(w.en + ". " + (w.mean || ""), "Read " + w.en)])]);
        }))
      ])])
    ]);
  }

  /* ---------- learn slides ---------- */
  function renderSlide(l, stage) {
    var i = state.slide, s = l.learn[i], p = lp(l);
    if (!p.seen[s.id]) { p.seen[s.id] = true; save(l); }
    var card = el("article", { class: "qcard slide" });
    card.appendChild(el("div", { class: "slide-head" }, [
      el("p", { class: "eyebrow", text: "Learn · " + (i + 1) + " of " + l.learn.length }),
      el("h2", { class: "slide-title" }, [s.title, " ", sayBtn([s.title].concat(s.say || []).join(". "), "Read this page")])
    ]));
    var f = s.figure ? figWrap(s.figure) : null; if (f) card.appendChild(f);
    if (s.say && s.say.length) card.appendChild(el("ul", { class: "says" }, s.say.map(function (t) {
      return el("li", {}, [el("span", { html: S.fmt(t) }), sayBtn(t)]);
    })));
    if (s.words && s.words.length) { var wb = el("div", { class: "word-box" }, [el("p", { class: "word-head", text: "Key words · tap to hear" })]); wordChips(l, s.words, wb); card.appendChild(wb); }
    if (s.know) card.appendChild(el("div", { class: "know" }, [el("p", { class: "know-h", text: "💡 Do you know?" }), el("p", { html: S.fmt(s.know) })]));
    if (s.try) card.appendChild(el("div", { class: "know try" }, [el("p", { class: "know-h", text: "🧪 Try it" }), el("p", { html: S.fmt(s.try) })]));

    var dots = el("div", { class: "qdots slide-dots" }, l.learn.map(function (x, k) {
      return el("button", { type: "button", class: "qdot" + (p.seen[x.id] ? " done" : "") + (k === i ? " on" : ""), "aria-label": "Page " + (k + 1) + ": " + x.title, text: String(k + 1), onclick: function () { openLesson(l.id, "learn", k); } });
    }));
    var last = i === l.learn.length - 1;
    card.appendChild(el("div", { class: "actions" }, [
      el("button", { type: "button", class: "btn", disabled: i === 0 ? "disabled" : null, onclick: function () { openLesson(l.id, "learn", i - 1); } }, ["← Back"]),
      el("button", { type: "button", class: "btn next", onclick: function () { if (last) openLesson(l.id, "sec", firstUnsolvedSec(l)); else openLesson(l.id, "learn", i + 1); } }, [last ? "Start practice →" : "Next →"])
    ]));
    stage.appendChild(dots);
    stage.appendChild(card);
  }

  /* ---------- question types ---------- */
  // Each maker returns { node, get(), check(value) → { ok, say, marks }, show(answer), mark(result) }
  function choiceRow(options, multi, name) {
    var picked = multi ? {} : null, btns = [];
    var short = options.every(function (o) { return String(o).length <= 16; });
    var row = el("div", { class: "choices sci-choices" + (short ? " short" : ""), role: multi ? "group" : "radiogroup" });
    options.forEach(function (o) {
      var b = el("button", { type: "button", class: "choice", role: multi ? "checkbox" : "radio", "aria-checked": "false", onclick: function () {
        if (multi) { picked[o] = !picked[o]; b.setAttribute("aria-checked", picked[o] ? "true" : "false"); }
        else { picked = o; btns.forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); }
        btns.forEach(function (x) { x.classList.remove("ok", "bad"); });
      } }, [o]);
      b._val = o; btns.push(b); row.appendChild(b);
    });
    return { node: row, btns: btns, get: function () { return multi ? Object.keys(picked).filter(function (k) { return picked[k]; }) : picked; },
      set: function (v) { if (multi) { picked = {}; v.forEach(function (x) { picked[x] = true; }); } else picked = v; btns.forEach(function (x) { x.setAttribute("aria-checked", (multi ? !!picked[x._val] : x._val === v) ? "true" : "false"); }); } };
  }

  var TYPES = {};
  TYPES.choice = function (q) {
    var opts = q.keep ? q.options : S.shuffle(q.options, q.id), c = choiceRow(opts, false);
    return { node: c.node, empty: function () { return c.get() == null; },
      check: function () { var v = c.get(), ok = v === q.answer; c.btns.forEach(function (b) { if (b._val === v) b.classList.add(ok ? "ok" : "bad"); }); return { ok: ok, say: !ok && q.wrong && q.wrong[v] }; },
      show: function () { c.set(q.answer); c.btns.forEach(function (b) { if (b._val === q.answer) b.classList.add("ok"); }); } };
  };
  TYPES.tf = function (q) { return TYPES.choice({ id: q.id, options: ["True", "False"], keep: true, answer: q.answer ? "True" : "False", wrong: q.wrong }); };
  TYPES.multi = function (q) {
    var opts = q.keep ? q.options : S.shuffle(q.options, q.id), c = choiceRow(opts, true), right = q.answers;
    var hint = el("p", { class: "type-hint", text: "Choose all the right answers. There are " + right.length + "." });
    return { node: el("div", { class: "qwrap" }, [hint, c.node]), empty: function () { return !c.get().length; },
      check: function () {
        var v = c.get(), good = v.filter(function (x) { return right.indexOf(x) >= 0; }).length, badN = v.length - good;
        c.btns.forEach(function (b) { if (v.indexOf(b._val) >= 0) b.classList.add(right.indexOf(b._val) >= 0 ? "ok" : "bad"); });
        var ok = good === right.length && badN === 0;
        return { ok: ok, say: ok ? "" : "You found " + good + " of the " + right.length + " right answers" + (badN ? ", and " + badN + " of your choices " + (badN === 1 ? "is" : "are") + " not right (red)." : ".") };
      },
      show: function () { c.set(right); c.btns.forEach(function (b) { if (right.indexOf(b._val) >= 0) b.classList.add("ok"); }); } };
  };
  TYPES.word = function (q) {
    var inp = el("input", { type: "text", class: "word-inp", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": "Your answer", placeholder: q.placeholder || "Type a word" });
    var norm = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim(); };
    return { node: el("div", { class: "word-row" }, [inp, q.unit ? el("span", { text: q.unit }) : null]), input: inp, empty: function () { return !norm(inp.value); },
      check: function () {
        var v = " " + norm(inp.value) + " ";
        var ok = q.accept.some(function (a) { return v.indexOf(" " + norm(a) + " ") >= 0; });
        inp.classList.remove("ok", "bad"); inp.classList.add(ok ? "ok" : "bad");
        return { ok: ok, say: ok ? "" : (q.hint || "Not quite. Check the spelling, or press Help required.") };
      },
      show: function () { inp.value = q.accept[0]; inp.classList.add("ok"); } };
  };
  TYPES.order = function (q) {
    var cur = S.shuffle(q.items, q.id);
    if (cur.join("|") === q.items.join("|")) cur = cur.slice(1).concat(cur.slice(0, 1));
    var list = el("ol", { class: "order-list" });
    function draw(marks) {
      list.innerHTML = "";
      cur.forEach(function (t, i) {
        var li = el("li", { class: "order-item" + (marks ? (marks[i] ? " ok" : " bad") : "") }, [
          el("span", { class: "order-no", text: String(i + 1) }),
          el("span", { class: "order-t", text: t }),
          el("span", { class: "order-btns" }, [
            el("button", { type: "button", class: "mv", "aria-label": "Move up", disabled: i === 0 ? "disabled" : null, onclick: function () { var x = cur[i]; cur[i] = cur[i - 1]; cur[i - 1] = x; draw(); } }, ["▲"]),
            el("button", { type: "button", class: "mv", "aria-label": "Move down", disabled: i === cur.length - 1 ? "disabled" : null, onclick: function () { var x = cur[i]; cur[i] = cur[i + 1]; cur[i + 1] = x; draw(); } }, ["▼"])
          ])
        ]);
        list.appendChild(li);
      });
    }
    draw();
    return { node: el("div", { class: "qwrap" }, [el("p", { class: "type-hint", text: q.hint || "Use ▲ and ▼ to put them in the right order." + (q.topLabel ? " " + q.topLabel : "") }), list]), empty: function () { return false; },
      check: function () {
        var marks = cur.map(function (t, i) { return t === q.items[i]; }), n = marks.filter(Boolean).length, ok = n === cur.length;
        draw(marks);
        return { ok: ok, say: ok ? "" : n + " of " + cur.length + " are in the right place (green). Move the red ones." };
      },
      show: function () { cur = q.items.slice(); draw(cur.map(function () { return true; })); } };
  };
  TYPES.match = function (q) {
    var rights = S.shuffle(q.pairs.map(function (p) { return p[1]; }).concat(q.extra || []), q.id + "r");
    var sels = [];
    var rows = q.pairs.map(function (p, i) {
      var sel = el("select", { class: "match-sel", "aria-label": "Match for " + p[0] }, [el("option", { value: "", text: "Choose…" })].concat(rights.map(function (r) { return el("option", { value: r, text: r }); })));
      sel.addEventListener("change", function () { row.classList.remove("ok", "bad"); });
      sels.push(sel);
      var row = el("div", { class: "match-row" }, [el("span", { class: "match-l" }, [q.leftIcon ? el("span", { class: "match-ic", text: q.leftIcon[i] }) : null, p[0]]), el("span", { class: "match-arrow", text: "→" }), sel]);
      return row;
    });
    return { node: el("div", { class: "match" }, rows), empty: function () { return sels.every(function (s) { return !s.value; }); },
      check: function () {
        var n = 0;
        sels.forEach(function (s, i) { var ok = s.value === q.pairs[i][1]; if (ok) n++; rows[i].classList.remove("ok", "bad"); rows[i].classList.add(ok ? "ok" : "bad"); });
        var ok = n === sels.length;
        return { ok: ok, say: ok ? "" : n + " of " + sels.length + " are right (green). Change the red ones." };
      },
      show: function () { sels.forEach(function (s, i) { s.value = q.pairs[i][1]; rows[i].classList.add("ok"); }); } };
  };
  TYPES.sort = function (q) {
    var items = S.shuffle(q.items, q.id), rows = [], vals = [];
    var node = el("div", { class: "sort" }, items.map(function (it, i) {
      var c = choiceRow(q.buckets, false);
      c.node.classList.add("small");
      vals.push(c);
      var row = el("div", { class: "sort-row" }, [el("span", { class: "sort-t", text: it[0] }), c.node]);
      c.btns.forEach(function (b) { b.addEventListener("click", function () { row.classList.remove("ok", "bad"); }); });
      rows.push(row); return row;
    }));
    return { node: node, empty: function () { return vals.every(function (c) { return c.get() == null; }); },
      check: function () {
        var n = 0;
        vals.forEach(function (c, i) { var ok = c.get() === q.buckets[items[i][1]]; if (ok) n++; rows[i].classList.remove("ok", "bad"); rows[i].classList.add(ok ? "ok" : "bad"); });
        var ok = n === vals.length;
        return { ok: ok, say: ok ? "" : n + " of " + vals.length + " are right (green). Change the red ones." };
      },
      show: function () { vals.forEach(function (c, i) { c.set(q.buckets[items[i][1]]); rows[i].classList.add("ok"); }); } };
  };

  /* ---------- question card ---------- */
  function renderQuestion(l, stage) {
    var sec = l.sections[state.sec], q = sec.questions[state.q], p = lp(l);
    var r = p.q[q.id] || null;
    stage.appendChild(el("div", { class: "sec-head" }, [
      el("h2", { text: sec.title }),
      sec.instruction ? el("p", { class: "lede" }, [sec.instruction, " ", sayBtn(sec.instruction)]) : null,
      el("div", { class: "qdots" }, sec.questions.map(function (x, k) {
        return el("button", { type: "button", class: "qdot" + ((p.q[x.id] || {}).solved ? " done" : "") + (k === state.q ? " on" : ""), text: x.label || String(k + 1), "aria-label": "Question " + (x.label || k + 1), onclick: function () { openLesson(l.id, "sec", state.sec, k); } });
      }))
    ]));
    var card = el("article", { class: "qcard" });
    card.appendChild(el("p", { class: "prompt" }, [el("span", { html: S.fmt(q.prompt) }), " ", sayBtn(q.prompt)]));
    if (q.figure) { var fg = figWrap(q.figure); if (fg) card.appendChild(fg); }
    var maker = TYPES[q.type] || TYPES.choice, ui = maker(q);
    card.appendChild(ui.node);
    var feedback = el("p", { class: "feedback", role: "status" });
    var steps = el("ol", { class: "help-steps" });
    var checkBtn = el("button", { type: "button", class: "btn primary", onclick: check }, ["Check"]);
    var helpBtn = el("button", { type: "button", class: "btn help", onclick: nextStep }, ["Help required"]);
    var nextBtn = el("button", { type: "button", class: "btn next", hidden: "hidden", onclick: goNext }, [nextLabel(l)]);
    card.appendChild(el("div", { class: "actions" }, [checkBtn, helpBtn, nextBtn]));
    card.appendChild(feedback);
    card.appendChild(steps);
    stage.appendChild(card);
    if (ui.input) ui.input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });

    var shown = 0, help = q.help || [];
    function updHelp() {
      if (!help.length) { helpBtn.hidden = true; return; }
      helpBtn.textContent = shown === 0 ? "Help required" : shown >= help.length ? "All steps shown" : "Next step";
      helpBtn.disabled = shown >= help.length;
    }
    function nextStep() {
      if (shown >= help.length) return;
      var st = help[shown], idx = shown; shown++;
      var isAns = idx === help.length - 1 && /^Answer/.test(st.text);
      var body = el("div", { class: "step-body" }, [el("p", {}, [el("span", { html: S.fmt(st.text) }), " ", sayBtn(st.text)])]);
      if (st.figure) { var f = figWrap(st.figure, { small: true }); if (f) body.appendChild(f); }
      steps.appendChild(el("li", { class: "step" + (idx === help.length - 1 ? " last" : "") }, [el("span", { class: "step-no", text: isAns ? "✓" : String(idx + 1) }), body]));
      var rec = p.q[q.id] || (p.q[q.id] = { attempts: 0, help: 0 });
      if (!rec.solved) { rec.help = Math.max(rec.help || 0, shown); save(l); }
      if (isAns && !(rec.solved)) ui.show();
      updHelp();
    }
    updHelp();
    if (r && r.solved) { ui.show(); feedback.className = "feedback good"; feedback.innerHTML = "<b>Solved</b> · " + r.points + " points"; nextBtn.hidden = false; }

    function check() {
      if (ui.empty()) { feedback.className = "feedback"; feedback.textContent = "Choose or type an answer first."; return; }
      var rec = p.q[q.id] || (p.q[q.id] = { attempts: 0, help: 0 });
      var res = ui.check();
      if (res.ok) {
        var fresh = !rec.solved;
        if (fresh) { rec.solved = true; rec.points = Math.max(3, 10 - 2 * (rec.attempts || 0) - (rec.help || 0)); save(l); }
        feedback.className = "feedback good";
        var sea = "";
        if (fresh && Science.aquarium) { try { sea = Science.aquarium.onSolve(l, rec.points); } catch (e) { sea = ""; } }
        feedback.innerHTML = "<b>" + praise(q.id) + "</b> +" + rec.points + " points" + (q.why ? '<span class="why">' + S.fmt(q.why) + "</span>" : "") + (sea ? '<span class="sea-fb">' + sea + "</span>" : "");
        nextBtn.hidden = false; nextBtn.focus();
        refresh(l);
      } else {
        if (!rec.solved) { rec.attempts = (rec.attempts || 0) + 1; save(l); }
        feedback.className = "feedback bad";
        feedback.innerHTML = S.fmt(res.say || "Not quite. Try again, or press Help required.");
      }
    }
    function goNext() {
      if (state.q < sec.questions.length - 1) openLesson(l.id, "sec", state.sec, state.q + 1);
      else if (state.sec < l.sections.length - 1) openLesson(l.id, "sec", state.sec + 1, 0);
      else renderFinish(l);
    }
  }
  var PRAISE = ["Correct!", "Well done!", "Great!", "Super!", "Yes, that's right!"];
  function praise(id) { var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return PRAISE[h % PRAISE.length]; }
  function nextLabel(l) {
    var sec = l.sections[state.sec];
    if (state.q < sec.questions.length - 1) return "Next question →";
    if (state.sec < l.sections.length - 1) return "Next part →";
    return "Finish →";
  }
  function refresh(l) {
    var st = stats(l), nums = app.querySelectorAll(".score-num");
    if (nums[0]) nums[0].textContent = st.points;
    if (nums[1]) nums[1].textContent = st.done + "/" + st.total;
    var btns = app.querySelectorAll(".sec-btn");
    l.sections.forEach(function (s, i) { var ss = secStats(l, s), b = btns[i + 1]; if (!b) return; b.querySelector(".sec-count").textContent = ss.done + "/" + ss.total; b.classList.toggle("done", ss.done === ss.total); });
    var dots = app.querySelectorAll(".stage .qdot"), sec = l.sections[state.sec];
    sec.questions.forEach(function (qq, i) { if (dots[i] && (lp(l).q[qq.id] || {}).solved) dots[i].classList.add("done"); });
  }

  function renderFinish(l) {
    S.stopSpeaking();
    var st = stats(l); app.innerHTML = "";
    var stars = st.points >= st.max * 0.85 ? 3 : st.points >= st.max * 0.6 ? 2 : 1;
    var confirmRow = el("div", { class: "confirm", hidden: "hidden" }, [
      el("span", { text: "Clear all answers and points for this chapter?" }),
      el("button", { type: "button", class: "btn small danger", text: "Yes, start over", onclick: function () { progress[l.id] = { q: {}, seen: lp(l).seen }; save(l); openLesson(l.id, "sec", 0, 0); } }),
      el("button", { type: "button", class: "link-btn", text: "Cancel", onclick: function () { confirmRow.hidden = true; } })
    ]);
    app.appendChild(el("section", { class: "finish" }, [
      el("p", { class: "eyebrow", text: l.title }),
      el("h1", { text: st.done === st.total ? "Chapter complete" : "End of the chapter" }),
      el("p", { class: "stars", "aria-label": stars + " of 3 stars", text: "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars) }),
      el("p", { class: "lede", text: st.done + " of " + st.total + " questions solved · " + st.points + " of " + st.max + " points" }),
      st.done < st.total ? el("p", { text: "Some questions are not solved yet. Go back and try them." }) : null,
      el("div", { class: "actions" }, [
        el("button", { type: "button", class: "btn primary", text: "Back to the chapter", onclick: function () { openLesson(l.id, "sec", firstUnsolvedSec(l)); } }),
        el("button", { type: "button", class: "btn", text: "Learn again", onclick: function () { openLesson(l.id, "learn", 0); } }),
        el("button", { type: "button", class: "btn", text: "Start over", onclick: function () { confirmRow.hidden = false; } }),
        el("button", { type: "button", class: "link-btn", text: "All chapters", onclick: renderHome })
      ]),
      confirmRow
    ]));
  }

  Science.open = function (id, view, a, b) { openLesson(id, view, a, b); };
  Science.start = function (root) {
    app = root;
    var m = /[#&]lesson=([\w-]+)/.exec(location.hash || "");
    if (m && lessonById(m[1])) openLesson(m[1]);
    else renderHome();
  };
})();
