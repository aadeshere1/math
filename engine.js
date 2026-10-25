/*
  Practice game engine.
  Knows nothing about any one subject. Lessons register themselves with
  Practice.register({...}) from files in lessons/. See lessons/README.md.
*/
(function () {
  "use strict";

  var Practice = (window.Practice = window.Practice || {});
  Practice.lessons = Practice.lessons || [];
  Practice.figures = Practice.figures || {};
  Practice.register = function (lesson) { Practice.lessons.push(lesson); };

  /* ---------- small helpers ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== undefined && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  /* ---------- answer checking ---------- */
  function letters(s) { return String(s).toUpperCase().replace(/[^A-Z]/g, ""); }
  function num(s) {
    var m = String(s).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  }
  function segKey(s) { return letters(s).split("").sort().join(""); }

  // Returns {ok:boolean, say?:string}
  Practice.check = function (field, raw) {
    var t = field.type || "text";
    if (raw == null || String(raw).trim() === "") return { ok: false, empty: true };
    var ok = false;
    if (t === "number") {
      var v = num(raw), tol = field.tolerance || 0;
      ok = !isNaN(v) && Math.abs(v - field.answer) <= tol;
      if (!ok && field.mistakes) for (var i = 0; i < field.mistakes.length; i++) {
        var m = field.mistakes[i];
        if (Math.abs(v - m.answer) <= tol) return { ok: false, say: m.say };
      }
    } else if (t === "choice") {
      ok = Array.isArray(field.answer) ? field.answer.indexOf(raw) !== -1 : raw === field.answer;
    } else if (t === "angleName") {
      var a = letters(raw), ans = letters(field.answer);
      ok = a === ans || a === ans.split("").reverse().join("");
      if (!ok && a.length === 3 && ans.indexOf(a[1]) === -1)
        return { ok: false, say: "Remember: the vertex letter " + ans[1] + " goes in the middle." };
    } else if (t === "segments") {
      var got = String(raw).toUpperCase().split(/[^A-Z]+|AND/).filter(Boolean).map(segKey).sort();
      var want = field.answer.map(segKey).sort();
      ok = got.join("|") === want.join("|");
    } else {
      var accept = [field.answer].concat(field.accept || []).map(function (x) { return String(x).trim().toLowerCase(); });
      ok = accept.indexOf(String(raw).trim().toLowerCase()) !== -1;
    }
    if (!ok && field.mistakes && t !== "number") for (var j = 0; j < field.mistakes.length; j++)
      if (String(field.mistakes[j].answer).toLowerCase() === String(raw).trim().toLowerCase()) return { ok: false, say: field.mistakes[j].say };
    return { ok: ok };
  };

  /* ---------- inputs ---------- */
  // Builds an input for a field. Returns {node, get(), set(v), focus(), mark(state)}
  function makeInput(field, uid, onEnter) {
    var t = field.type || "text";
    if (t === "choice") {
      var chosen = null, btns = [];
      var group = el("div", { class: "choices", role: "radiogroup" });
      field.options.forEach(function (opt) {
        var b = el("button", { type: "button", class: "choice", role: "radio", "aria-checked": "false", text: opt,
          onclick: function () {
            chosen = opt;
            btns.forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); });
          } });
        btns.push(b); group.appendChild(b);
      });
      return { node: group, get: function () { return chosen; },
        set: function (v) { chosen = v; btns.forEach(function (x) { x.setAttribute("aria-checked", x.textContent === v ? "true" : "false"); }); },
        focus: function () { btns[0] && btns[0].focus(); },
        mark: function (s) { group.dataset.state = s || ""; } };
    }
    var ph = { number: "?", angleName: "e.g. ABC", segments: "e.g. AB, AC", text: "" }[t] || "";
    var inp = el("input", { id: uid, type: "text", class: "inp inp-" + t, autocomplete: "off", spellcheck: "false",
      inputmode: t === "number" ? "decimal" : undefined, placeholder: ph,
      onkeydown: function (e) { if (e.key === "Enter") { e.preventDefault(); onEnter && onEnter(); } },
      oninput: function () { wrap.dataset.state = ""; } });
    var wrap = el("span", { class: "inp-wrap" }, [
      t === "angleName" ? el("span", { class: "affix", text: "∠" }) : null,
      inp,
      field.unit ? el("span", { class: "affix", text: field.unit }) : null
    ]);
    return { node: wrap, get: function () { return inp.value; }, set: function (v) { inp.value = v || ""; },
      focus: function () { inp.focus(); }, mark: function (s) { wrap.dataset.state = s || ""; } };
  }

  /* ---------- figures ---------- */
  var SVGNS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, text) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function pt(deg, r) { var a = deg * Math.PI / 180; return [r * Math.cos(a), -r * Math.sin(a)]; }
  function f(n) { return Math.round(n * 100) / 100; }
  function arcPath(from, to, r) {
    var sweep = ((to - from) % 360 + 360) % 360; if (sweep === 0) sweep = 360;
    if (sweep >= 359.99) { // full circle
      var a = pt(from, r), b = pt(from + 180, r);
      return "M" + f(a[0]) + " " + f(a[1]) + " A" + r + " " + r + " 0 1 0 " + f(b[0]) + " " + f(b[1]) + " A" + r + " " + r + " 0 1 0 " + f(a[0]) + " " + f(a[1]);
    }
    var p = pt(from, r), q = pt(from + sweep, r);
    return "M" + f(p[0]) + " " + f(p[1]) + " A" + r + " " + r + " 0 " + (sweep > 180 ? 1 : 0) + " 0 " + f(q[0]) + " " + f(q[1]);
  }

  Practice.figures.angle = function (spec, opts) {
    var R = spec.protractor ? 140 : 100, s = svg("svg", { class: spec.protractor ? "fig fig-prot" : "fig", role: "img", "aria-label": "Angle diagram" });
    var box = { x0: 0, y0: 0, x1: 0, y1: 0 };
    function grow(p, pad) { pad = pad || 0; box.x0 = Math.min(box.x0, p[0] - pad); box.x1 = Math.max(box.x1, p[0] + pad); box.y0 = Math.min(box.y0, p[1] - pad); box.y1 = Math.max(box.y1, p[1] + pad); }

    var prot = spec.protractor, protGroup = null;
    if (prot) {
      protGroup = svg("g", { class: "protractor" });
      var b = prot.base, PR = 118;
      var d = "M" + pt(b, PR).map(f).join(" ") + " A" + PR + " " + PR + " 0 0 0 " + pt(b + 180, PR).map(f).join(" ") + " Z";
      protGroup.appendChild(svg("path", { d: d, class: "prot-body" }));
      protGroup.appendChild(svg("path", { d: arcPath(b, b + 180, 78), class: "prot-inner" }));
      for (var t = 0; t <= 180; t++) {
        var len = t % 10 === 0 ? 12 : t % 5 === 0 ? 8 : 4;
        var p1 = pt(b + t, PR), p2 = pt(b + t, PR - len);
        protGroup.appendChild(svg("line", { x1: f(p1[0]), y1: f(p1[1]), x2: f(p2[0]), y2: f(p2[1]), class: "prot-tick" }));
        if (t % 10 === 0) {
          var o = pt(b + t, PR - 19), i = pt(b + t, PR - 31);
          protGroup.appendChild(svg("text", { x: f(o[0]), y: f(o[1]), class: "prot-out" }, String(180 - t)));
          protGroup.appendChild(svg("text", { x: f(i[0]), y: f(i[1]), class: "prot-in" }, String(t)));
          if (t % 30 === 0 && t > 0 && t < 180) {
            var g1 = pt(b + t, 78), g2 = pt(b + t, 14);
            protGroup.appendChild(svg("line", { x1: f(g1[0]), y1: f(g1[1]), x2: f(g2[0]), y2: f(g2[1]), class: "prot-guide" }));
          }
        }
      }
      var e1 = pt(b, PR + 4), e2 = pt(b + 180, PR + 4);
      protGroup.appendChild(svg("line", { x1: f(e1[0]), y1: f(e1[1]), x2: f(e2[0]), y2: f(e2[1]), class: "prot-base" }));
      protGroup.appendChild(svg("circle", { cx: 0, cy: 0, r: 3, class: "prot-centre" }));
      for (var a = 0; a <= 180; a += 15) grow(pt(b + a, PR + 6));
      grow(e1); grow(e2);
      if (prot.hidden && !opts.showProtractor) protGroup.style.display = "none";
      s.appendChild(protGroup);
    }

    (spec.arcs || []).forEach(function (arc) {
      var r = arc.r || 26;
      var from = arc.from, to = arc.to, sweep = ((to - from) % 360 + 360) % 360 || 360;
      if (arc.right) {
        var u = pt(from, r), v = pt(to, r), w = [u[0] + v[0], u[1] + v[1]];
        s.appendChild(svg("path", { d: "M" + f(u[0]) + " " + f(u[1]) + " L" + f(w[0]) + " " + f(w[1]) + " L" + f(v[0]) + " " + f(v[1]), class: "mark" }));
      } else {
        s.appendChild(svg("path", { d: arcPath(from, to, r), class: "mark" + (arc.dashed ? " dashed" : "") }));
      }
      for (var k = 0; k <= 8; k++) grow(pt(from + sweep * k / 8, r));
      if (arc.label) {
        var mid = from + sweep / 2, lr = r + (arc.label.length > 3 ? 17 : 12);
        if (sweep < 40) lr += 8;
        var lp = pt(mid, lr);
        s.appendChild(svg("text", { x: f(lp[0]), y: f(lp[1]), class: "arc-label" }, arc.label));
        grow(lp, 14);
      }
    });

    var vx = 0, vy = 0;
    (spec.rays || []).forEach(function (ray) {
      var e = pt(ray.deg, R);
      s.appendChild(svg("line", { x1: 0, y1: 0, x2: f(e[0]), y2: f(e[1]), class: "ray" + (ray.dashed ? " dashed" : "") }));
      grow(e);
      if (!ray.dashed) { vx += Math.cos(ray.deg * Math.PI / 180); vy += Math.sin(ray.deg * Math.PI / 180); }
      if (ray.label) {
        var lp = pt(ray.deg, R + 13);
        s.appendChild(svg("text", { x: f(lp[0]), y: f(lp[1]), class: "pt-label" }, ray.label));
        grow(lp, 10);
      }
    });
    s.appendChild(svg("circle", { cx: 0, cy: 0, r: 2.6, class: "vertex" }));
    if (spec.vertex) {
      var ang = Math.hypot(vx, vy) < 0.3 ? 225 : Math.atan2(vy, vx) * 180 / Math.PI + 180;
      if (prot) ang = prot.base + 270; // below the protractor's straight edge
      // keep the vertex letter clear of any curved angle mark that covers its direction
      var vr = 14;
      (spec.arcs || []).forEach(function (arc) {
        if (arc.right) return;
        var sw = ((arc.to - arc.from) % 360 + 360) % 360 || 360, off = ((ang - arc.from) % 360 + 360) % 360;
        if (off <= sw) vr = Math.max(vr, (arc.r || 26) + 10);
      });
      var vp = pt(ang, vr);
      s.appendChild(svg("text", { x: f(vp[0]), y: f(vp[1]), class: "pt-label" }, spec.vertex));
      grow(vp, 10);
    }
    var pad = 12;
    s.setAttribute("viewBox", [f(box.x0 - pad), f(box.y0 - pad), f(box.x1 - box.x0 + 2 * pad), f(box.y1 - box.y0 + 2 * pad)].join(" "));
    s.toggleProtractor = protGroup && prot.hidden ? function (on) { protGroup.style.display = on ? "" : "none"; } : null;
    return s;
  };

  /* Multi-point diagrams: parallel lines, triangles, zig-zags.
     Coordinates are maths-style (y goes up). See lessons/README.md. */
  Practice.figures.geo = function (spec) {
    var s = svg("svg", { class: "fig fig-geo", role: "img", "aria-label": "Geometry diagram" });
    var P = {}, box = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    function grow(x, y, pad) { pad = pad || 0; box.x0 = Math.min(box.x0, x - pad); box.x1 = Math.max(box.x1, x + pad); box.y0 = Math.min(box.y0, y - pad); box.y1 = Math.max(box.y1, y + pad); }
    Object.keys(spec.points || {}).forEach(function (k) { var v = spec.points[k]; P[k] = { x: v[0], y: -v[1], lab: v[2] }; });
    // meet: {O: ["A","B","C","D"]} puts O where line AB crosses line CD
    Object.keys(spec.meet || {}).forEach(function (k) {
      var m = spec.meet[k].map(function (n) { return P[n]; }), a = m[0], b = m[1], c = m[2], d = m[3];
      var den = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
      var t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / den;
      P[k] = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y), lab: (spec.meetLab || {})[k] };
    });
    function dirTo(at, ref) {
      if (typeof ref === "number") return ref;
      var neg = ref[0] === "-", q = P[neg ? ref.slice(1) : ref];
      var d = Math.atan2(-(q.y - at.y), q.x - at.x) * 180 / Math.PI;
      return neg ? d + 180 : d;
    }
    (spec.lines || []).forEach(function (ln) {
      var a = P[ln[0]] || P[ln.from], b = P[ln[1]] || P[ln.to];
      if (!Array.isArray(ln)) { a = P[ln.from]; b = P[ln.to]; }
      s.appendChild(svg("line", { x1: f(a.x), y1: f(a.y), x2: f(b.x), y2: f(b.y), class: "ray" + (ln.dashed ? " dashed" : "") }));
      grow(a.x, a.y); grow(b.x, b.y);
      var n = Array.isArray(ln) ? ln[2] : ln.arrows;
      if (n) {
        var t = (Array.isArray(ln) ? ln[3] : ln.at) || 0.5, L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L;
        for (var i = 0; i < n; i++) {
          var cx = a.x + (b.x - a.x) * t + ux * 7 * (i - (n - 1) / 2), cy = a.y + (b.y - a.y) * t + uy * 7 * (i - (n - 1) / 2);
          s.appendChild(svg("path", { d: "M" + f(cx - ux * 6 - uy * 4.5) + " " + f(cy - uy * 6 + ux * 4.5) + " L" + f(cx) + " " + f(cy) + " L" + f(cx - ux * 6 + uy * 4.5) + " " + f(cy - uy * 6 - ux * 4.5), class: "chev" }));
        }
      }
    });
    (spec.marks || []).forEach(function (mk) {
      var at = P[mk.at], r = mk.r || 16;
      var a = dirTo(at, mk.a), b = dirTo(at, mk.b), sw = ((b - a) % 360 + 360) % 360;
      if ((sw > 180) !== !!mk.reflex) { var tmp = a; a = b; b = tmp; sw = 360 - sw; }
      var g = svg("g", { transform: "translate(" + f(at.x) + " " + f(at.y) + ")" });
      if (mk.right) {
        var u = pt(a, r * 0.7), v = pt(b, r * 0.7);
        g.appendChild(svg("path", { d: "M" + f(u[0]) + " " + f(u[1]) + " L" + f(u[0] + v[0]) + " " + f(u[1] + v[1]) + " L" + f(v[0]) + " " + f(v[1]), class: "mark" }));
      } else if (!mk.bare) g.appendChild(svg("path", { d: arcPath(a, a + sw, r), class: "mark" + (mk.hl ? " hl" : "") }));
      if (mk.label) {
        var lr = mk.bare ? r : r + (mk.label.length > 3 ? 14 : 10) + (sw < 35 ? 6 : 0) + (mk.push || 0), lp = pt(a + sw / 2, lr);
        g.appendChild(svg("text", { x: f(lp[0]), y: f(lp[1]), class: "arc-label" + (mk.hl ? " hl" : "") }, mk.label));
        grow(at.x + lp[0], at.y + lp[1], 12);
      }
      s.appendChild(g);
    });
    // point labels: any point whose name does not start with "_"
    var cx0 = (box.x0 + box.x1) / 2, cy0 = (box.y0 + box.y1) / 2;
    Object.keys(P).forEach(function (k) {
      if (k[0] === "_") return;
      var p = P[k], d = p.lab != null ? p.lab : Math.atan2(-(p.y - cy0), p.x - cx0) * 180 / Math.PI;
      var lp = pt(d, 11);
      s.appendChild(svg("text", { x: f(p.x + lp[0]), y: f(p.y + lp[1]), class: "pt-label" }, k));
      grow(p.x + lp[0], p.y + lp[1], 9);
    });
    (spec.texts || []).forEach(function (t) {
      s.appendChild(svg("text", { x: t[0], y: -t[1], class: "arc-label" }, t[2])); grow(t[0], -t[1], 12);
    });
    var pad = 10, vw = box.x1 - box.x0 + 2 * pad;
    s.setAttribute("viewBox", [f(box.x0 - pad), f(box.y0 - pad), f(vw), f(box.y1 - box.y0 + 2 * pad)].join(" "));
    // keep letters readable however big the drawing is (it is shown about 380px wide)
    var k = Math.max(1, vw / 300);
    Array.prototype.forEach.call(s.querySelectorAll("text"), function (t) { t.style.fontSize = f(12.5 * k) + "px"; });
    return s;
  };

  Practice.figures.clock = function (spec) {
    var s = svg("svg", { class: "fig fig-clock", viewBox: "-62 -62 124 124", role: "img", "aria-label": "Clock face" });
    s.appendChild(svg("circle", { cx: 0, cy: 0, r: 56, class: "clock-face" }));
    if (spec.sweep) {
      var deg = spec.sweep * 6;
      var path = deg >= 360 ? "M0 0 m-46 0 a46 46 0 1 0 92 0 a46 46 0 1 0 -92 0"
        : "M0 0 L0 -46 A46 46 0 " + (deg > 180 ? 1 : 0) + " 1 " + f(46 * Math.sin(deg * Math.PI / 180)) + " " + f(-46 * Math.cos(deg * Math.PI / 180)) + " Z";
      s.appendChild(svg("path", { d: path, class: "clock-sweep" }));
    }
    for (var m = 0; m < 60; m++) {
      var a = m * 6 * Math.PI / 180, r1 = m % 5 === 0 ? 47 : 50;
      s.appendChild(svg("line", { x1: f(r1 * Math.sin(a)), y1: f(-r1 * Math.cos(a)), x2: f(53 * Math.sin(a)), y2: f(-53 * Math.cos(a)), class: "clock-tick" }));
    }
    for (var h = 1; h <= 12; h++) {
      var b = h * 30 * Math.PI / 180;
      s.appendChild(svg("text", { x: f(39 * Math.sin(b)), y: f(-39 * Math.cos(b)), class: "clock-num" }, String(h)));
    }
    var end = spec.sweep ? spec.sweep * 6 : 0;
    s.appendChild(svg("line", { x1: 0, y1: 0, x2: 0, y2: -44, class: spec.sweep ? "clock-hand ghost" : "clock-hand" }));
    if (spec.sweep && end < 360) {
      var e = end * Math.PI / 180;
      s.appendChild(svg("line", { x1: 0, y1: 0, x2: f(44 * Math.sin(e)), y2: f(-44 * Math.cos(e)), class: "clock-hand" }));
    }
    s.appendChild(svg("circle", { cx: 0, cy: 0, r: 3, class: "clock-pin" }));
    if (spec.sweep) s.appendChild(svg("text", { x: 0, y: 22, class: "clock-cap" }, spec.sweep + " min = " + spec.sweep * 6 + "°"));
    return s;
  };

  function renderFigure(spec, opts) {
    var fn = spec && Practice.figures[spec.type];
    return fn ? fn(spec, opts || {}) : null;
  }

  /* ---------- game state ---------- */
  var app, state = { lessonId: null, sectionIdx: 0, qIdx: 0 }, progress = {};
  function lessonById(id) { return Practice.lessons.filter(function (l) { return l.id === id; })[0]; }
  function progKey(l) { return "practice:" + l.id; }
  function lp(l) { return progress[l.id] || (progress[l.id] = store(progKey(l)) || { q: {} }); }
  function saveProg(l) { store(progKey(l), lp(l)); }
  function allQs(l) { var out = []; l.sections.forEach(function (s) { s.questions.forEach(function (q) { out.push(q); }); }); return out; }
  function stats(l) {
    var p = lp(l), qs = allQs(l), done = 0, pts = 0;
    qs.forEach(function (q) { var r = p.q[q.id]; if (r && r.solved) { done++; pts += r.points; } });
    return { done: done, total: qs.length, points: pts, max: qs.length * 10 };
  }
  function secStats(l, sec) {
    var p = lp(l), d = 0; sec.questions.forEach(function (q) { if (p.q[q.id] && p.q[q.id].solved) d++; });
    return { done: d, total: sec.questions.length };
  }

  /* ---------- views ---------- */
  function renderHome() {
    state.lessonId = null;
    app.innerHTML = "";
    var head = el("header", { class: "home-head" }, [
      el("p", { class: "eyebrow", text: "Practice" }),
      el("h1", { text: "Pick a lesson" }),
      el("p", { class: "lede", text: "Answer each question. Stuck? Press Help required and you will be walked through it one step at a time." })
    ]);
    var grid = el("div", { class: "lesson-grid" });
    var groups = {}, order = [];
    Practice.lessons.forEach(function (l) {
      var g = l.subject + (l.unit ? " · " + l.unit : "");
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(l);
    });
    order.forEach(function (g) {
      grid.appendChild(el("h2", { class: "subject", text: g }));
      groups[g].forEach(function (l) {
        var st = stats(l);
        grid.appendChild(el("button", { type: "button", class: "lesson-card", onclick: function () { openLesson(l.id); } }, [
          el("span", { class: "lc-level", text: l.level || "" }),
          el("span", { class: "lc-title", text: l.title }),
          l.topic ? el("span", { class: "lc-topic", text: l.topic }) : null,
          el("span", { class: "lc-src", text: l.source || "" }),
          el("span", { class: "meter" }, [el("span", { class: "meter-fill", style: "width:" + (100 * st.done / st.total) + "%" })]),
          el("span", { class: "lc-stats", text: st.done + " of " + st.total + " solved · " + st.points + " points" })
        ]));
      });
    });
    app.appendChild(head); app.appendChild(grid);
  }

  function openLesson(id, sIdx, qIdx) {
    var l = lessonById(id); if (!l) return renderHome();
    state.lessonId = id;
    state.sectionIdx = sIdx != null ? sIdx : firstUnsolvedSection(l);
    state.qIdx = qIdx != null ? qIdx : firstUnsolvedQ(l, l.sections[state.sectionIdx]);
    renderLesson();
  }
  function firstUnsolvedSection(l) {
    for (var i = 0; i < l.sections.length; i++) if (secStats(l, l.sections[i]).done < l.sections[i].questions.length) return i;
    return 0;
  }
  function firstUnsolvedQ(l, sec) {
    var p = lp(l);
    for (var i = 0; i < sec.questions.length; i++) if (!(p.q[sec.questions[i].id] || {}).solved) return i;
    return 0;
  }

  function renderLesson() {
    var l = lessonById(state.lessonId), sec = l.sections[state.sectionIdx], q = sec.questions[state.qIdx];
    var st = stats(l);
    app.innerHTML = "";

    var bar = el("div", { class: "topbar" }, [
      el("button", { type: "button", class: "link-btn", onclick: renderHome, text: "← All lessons" }),
      el("div", { class: "scorebox" }, [
        el("span", { class: "score-num", text: String(st.points) }), el("span", { class: "score-lbl", text: "points" }),
        el("span", { class: "score-sep" }),
        el("span", { class: "score-num", text: st.done + "/" + st.total }), el("span", { class: "score-lbl", text: "solved" })
      ])
    ]);
    var siblings = Practice.lessons.filter(function (o) { return o.subject === l.subject && o.unit && o.unit === l.unit; });
    var tabs = siblings.length > 1 ? el("div", { class: "ex-tabs", role: "tablist", "aria-label": "Exercises" }, siblings.map(function (o) {
      var os = stats(o);
      return el("button", { type: "button", role: "tab", class: "ex-tab" + (o === l ? " on" : ""), "aria-selected": o === l ? "true" : "false",
        onclick: function () { if (o !== l) openLesson(o.id); } }, [
        el("span", { class: "ex-name", text: o.title }),
        el("span", { class: "ex-count", text: os.done + "/" + os.total })
      ]);
    })) : null;
    var title = el("div", { class: "lesson-title" }, [
      el("p", { class: "eyebrow", text: [l.subject, l.unit, l.level].filter(Boolean).join(" · ") }),
      el("h1", { text: l.title + (l.topic ? ": " + l.topic : "") }),
      l.source ? el("p", { class: "src", text: l.source }) : null,
      tabs
    ]);

    // section nav
    var nav = el("nav", { class: "sec-nav", "aria-label": "Exercises" });
    l.sections.forEach(function (s, i) {
      var ss = secStats(l, s);
      nav.appendChild(el("button", { type: "button", class: "sec-btn" + (i === state.sectionIdx ? " on" : "") + (ss.done === ss.total ? " done" : ""),
        "aria-current": i === state.sectionIdx ? "true" : undefined,
        onclick: function () { state.sectionIdx = i; state.qIdx = firstUnsolvedQ(l, s); renderLesson(); } }, [
        el("span", { class: "sec-no", text: "Q" + (s.no || i + 1) }),
        el("span", { class: "sec-name", text: s.title }),
        el("span", { class: "sec-count", text: ss.done + "/" + ss.total })
      ]));
    });

    // question dots
    var dots = el("div", { class: "qdots" });
    sec.questions.forEach(function (qq, i) {
      var r = lp(l).q[qq.id] || {};
      dots.appendChild(el("button", { type: "button", class: "qdot" + (i === state.qIdx ? " on" : "") + (r.solved ? " done" : ""),
        "aria-label": "Question " + (i + 1) + (r.solved ? " (solved)" : ""), text: sec.questions.length > 1 ? String.fromCharCode(97 + i) : "1",
        onclick: function () { state.qIdx = i; renderLesson(); } }));
    });

    var main = el("main", { class: "stage" }, [
      el("div", { class: "sec-head" }, [
        el("p", { class: "eyebrow", text: l.title + " · Question " + (sec.no || state.sectionIdx + 1) }),
        el("h2", { text: sec.instruction || sec.title }),
        dots
      ]),
      renderQuestion(l, sec, q)
    ]);

    var side = el("aside", { class: "side" }, [nav, l.reference ? renderReference(l.reference) : null]);
    app.appendChild(bar); app.appendChild(title);
    app.appendChild(el("div", { class: "layout" }, [main, side]));
  }

  function renderReference(ref) {
    var t = el("table", { class: "ref" }, [
      el("thead", {}, [el("tr", {}, ref.columns.map(function (c) { return el("th", { text: c }); }))]),
      el("tbody", {}, ref.rows.map(function (r) { return el("tr", {}, r.map(function (c) { return el("td", { text: c }); })); }))
    ]);
    return el("details", { class: "refbox" }, [el("summary", { text: ref.title }), el("div", { class: "ref-scroll" }, [t])]);
  }

  function renderQuestion(l, sec, q) {
    var rec = lp(l).q[q.id] || { attempts: 0, help: 0 };
    var card = el("section", { class: "qcard" });
    card.appendChild(el("p", { class: "prompt", html: fmt(q.prompt) }));

    if (q.figure) {
      var figWrap = el("div", { class: "figwrap" });
      var fig = renderFigure(q.figure);
      if (fig) figWrap.appendChild(fig);
      if (fig && fig.toggleProtractor) {
        var on = false;
        var tb = el("button", { type: "button", class: "tool-btn", text: "Place protractor", "aria-pressed": "false",
          onclick: function () { on = !on; fig.toggleProtractor(on); tb.textContent = on ? "Remove protractor" : "Place protractor"; tb.setAttribute("aria-pressed", String(on)); } });
        figWrap.appendChild(tb);
      }
      card.appendChild(figWrap);
    }

    var inputs = [];
    var form = el("div", { class: "parts" + (q.parts.length > 4 ? " many" : "") });
    q.parts.forEach(function (p, i) {
      var inp = makeInput(p, "f-" + q.id + "-" + p.id, doCheck);
      if (rec.solved && rec.answers) inp.set(rec.answers[p.id]);
      if (rec.solved) inp.mark("ok");
      inputs.push(inp);
      form.appendChild(el("div", { class: "part" + ((p.type || "text") === "choice" ? " part-choice" : "") }, [
        p.label ? el("label", { class: "part-lbl", for: "f-" + q.id + "-" + p.id, text: p.label }) : null,
        inp.node
      ]));
    });
    card.appendChild(form);

    var feedback = el("div", { class: "feedback", role: "status", "aria-live": "polite" });
    var checkBtn = el("button", { type: "button", class: "btn primary", text: "Check answer", onclick: doCheck });
    var helpBtn = el("button", { type: "button", class: "btn help", text: "Help required", onclick: function () { helper.next(); } });
    var nextBtn = el("button", { type: "button", class: "btn next", text: nextLabel(l), onclick: goNext });
    nextBtn.hidden = !rec.solved;
    card.appendChild(el("div", { class: "actions" }, [checkBtn, helpBtn, nextBtn]));
    card.appendChild(feedback);

    var helpPanel = el("ol", { class: "help-steps", "aria-label": "Step-by-step help" });
    card.appendChild(helpPanel);
    var helper = makeHelper(q, helpPanel, helpBtn, function (n) {
      var r = lp(l).q[q.id] || (lp(l).q[q.id] = { attempts: 0, help: 0 });
      if (!r.solved) { r.help = Math.max(r.help || 0, n); saveProg(l); }
    });
    if (rec.solved) {
      feedback.className = "feedback good";
      feedback.innerHTML = "Solved · <b>+" + rec.points + "</b> points";
    }

    function doCheck() {
      var r = lp(l).q[q.id] || (lp(l).q[q.id] = { attempts: 0, help: 0 });
      var allOk = true, hints = [], empty = false, answers = {};
      q.parts.forEach(function (p, i) {
        var v = inputs[i].get(); answers[p.id] = v;
        var res = Practice.check(p, v);
        if (res.empty) { empty = true; inputs[i].mark(""); allOk = false; return; }
        inputs[i].mark(res.ok ? "ok" : "bad");
        if (!res.ok) { allOk = false; if (res.say) hints.push(res.say); }
      });
      if (empty && !q.parts.some(function (p, i) { return inputs[i].get(); })) {
        feedback.className = "feedback"; feedback.textContent = "Type or pick an answer first."; return;
      }
      if (allOk) {
        if (!r.solved) {
          r.solved = true;
          r.points = Math.max(3, 10 - 2 * (r.attempts || 0) - (r.help || 0));
          r.answers = answers; saveProg(l);
        }
        feedback.className = "feedback good";
        feedback.innerHTML = "<b>Correct!</b> +" + r.points + " points" + (r.points === 10 ? " · solved on your own" : "");
        nextBtn.hidden = false; nextBtn.focus();
        refreshChrome(l);
      } else {
        if (!r.solved) { r.attempts = (r.attempts || 0) + 1; saveProg(l); }
        feedback.className = "feedback bad";
        var some = q.parts.length > 1 ? "Some answers are not right yet (marked in red). " : "Not quite. ";
        feedback.innerHTML = fmt(hints.length ? hints[0] : some + (empty ? "Fill in every box. " : "") + "Try again, or press Help required.");
      }
    }
    function goNext() {
      if (state.qIdx < sec.questions.length - 1) state.qIdx++;
      else if (state.sectionIdx < l.sections.length - 1) { state.sectionIdx++; state.qIdx = 0; }
      else { renderFinish(l); return; }
      renderLesson();
      var c = document.querySelector(".stage"); c && c.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    return card;
  }

  function nextLabel(l) {
    var sec = l.sections[state.sectionIdx];
    if (state.qIdx < sec.questions.length - 1) return "Next question →";
    if (state.sectionIdx < l.sections.length - 1) return "Next exercise →";
    return "Finish →";
  }

  // Refresh the score and nav counts without rebuilding the question card.
  function refreshChrome(l) {
    var st = stats(l), nums = app.querySelectorAll(".score-num");
    if (nums[0]) nums[0].textContent = st.points;
    if (nums[1]) nums[1].textContent = st.done + "/" + st.total;
    var btns = app.querySelectorAll(".sec-btn");
    l.sections.forEach(function (s, i) {
      var ss = secStats(l, s); if (!btns[i]) return;
      btns[i].querySelector(".sec-count").textContent = ss.done + "/" + ss.total;
      btns[i].classList.toggle("done", ss.done === ss.total);
    });
    var dots = app.querySelectorAll(".qdot"), sec = l.sections[state.sectionIdx];
    sec.questions.forEach(function (qq, i) { if (dots[i] && (lp(l).q[qq.id] || {}).solved) dots[i].classList.add("done"); });
  }

  /* ---------- guided help ---------- */
  function makeHelper(q, panel, btn, onShown) {
    var steps = q.help || [], shown = 0, waiting = false;
    function updateBtn() {
      if (!steps.length) { btn.hidden = true; return; }
      if (shown === 0) btn.textContent = "Help required";
      else if (shown >= steps.length) { btn.textContent = "All steps shown"; btn.disabled = true; }
      else btn.textContent = waiting ? "Answer the step above" : "Next step";
      btn.disabled = shown >= steps.length || waiting;
    }
    function showStep() {
      var step = steps[shown], idx = shown; shown++;
      var li = el("li", { class: "step" + (idx === steps.length - 1 ? " last" : "") }, [
        el("span", { class: "step-no", text: idx === steps.length - 1 && /^Answer/.test(step.text) ? "✓" : String(idx + 1) }),
        el("div", { class: "step-body" }, [el("p", { html: fmt(step.text) })])
      ]);
      var body = li.querySelector(".step-body");
      if (step.figure) { var fg = renderFigure(step.figure); if (fg) body.appendChild(el("div", { class: "figwrap small" }, [fg])); }
      if (step.ask) {
        waiting = true;
        var fb = el("p", { class: "ask-fb", role: "status" });
        var tries = 0;
        var inp = makeInput(step.ask, "ask-" + q.id + "-" + idx, check);
        var cbtn = el("button", { type: "button", class: "btn small", text: "Check", onclick: check });
        var show = el("button", { type: "button", class: "link-btn", text: "Show me", hidden: "hidden", onclick: function () { reveal(false); } });
        body.appendChild(el("div", { class: "ask" }, [inp.node, cbtn, show]));
        body.appendChild(fb);
        function check() {
          var res = Practice.check(step.ask, inp.get());
          if (res.empty) { fb.className = "ask-fb"; fb.textContent = "Type or pick an answer."; return; }
          if (res.ok) reveal(true);
          else {
            tries++; inp.mark("bad");
            fb.className = "ask-fb bad"; fb.innerHTML = fmt(res.say || "Not quite. Have another go.");
            if (tries >= 1) show.hidden = false;
          }
        }
        function reveal(right) {
          var shownAns = Array.isArray(step.ask.answer) ? step.ask.answer[0] : step.ask.answer;
          inp.mark("ok"); inp.set(step.ask.type === "choice" ? shownAns : String(shownAns));
          cbtn.disabled = true; show.hidden = true;
          fb.className = "ask-fb good";
          fb.innerHTML = right ? "Yes! Well done." : "It is <b>" + esc(shownAns) + (step.ask.unit && step.ask.unit !== "°" ? " " : "") + esc(step.ask.unit || "") + "</b>.";
          waiting = false; updateBtn();
          if (shown < steps.length) btn.focus();
        }
        setTimeout(function () { inp.focus(); }, 30);
      }
      panel.appendChild(li);
      onShown(shown); updateBtn();
    }
    updateBtn();
    return { next: function () { if (!waiting && shown < steps.length) showStep(); } };
  }

  function renderFinish(l) {
    var st = stats(l);
    app.innerHTML = "";
    var stars = st.points >= st.max * 0.85 ? 3 : st.points >= st.max * 0.6 ? 2 : 1;
    var confirmRow = el("div", { class: "confirm", hidden: "hidden" }, [
      el("span", { text: "Clear all answers and points for this lesson?" }),
      el("button", { type: "button", class: "btn small danger", text: "Yes, start over", onclick: function () { progress[l.id] = { q: {} }; saveProg(l); openLesson(l.id, 0, 0); } }),
      el("button", { type: "button", class: "link-btn", text: "Cancel", onclick: function () { confirmRow.hidden = true; } })
    ]);
    app.appendChild(el("section", { class: "finish" }, [
      el("p", { class: "eyebrow", text: l.title }),
      el("h1", { text: st.done === st.total ? "Lesson complete" : "End of the lesson" }),
      el("p", { class: "stars", "aria-label": stars + " of 3 stars", text: "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars) }),
      el("p", { class: "lede", text: st.done + " of " + st.total + " questions solved · " + st.points + " of " + st.max + " points" }),
      st.done < st.total ? el("p", { text: "Some questions are not solved yet. Go back and try them." }) : null,
      el("div", { class: "actions" }, [
        el("button", { type: "button", class: "btn primary", text: "Back to the lesson", onclick: function () { openLesson(l.id); } }),
        el("button", { type: "button", class: "btn", text: "Start over", onclick: function () { confirmRow.hidden = false; } }),
        el("button", { type: "button", class: "link-btn", text: "All lessons", onclick: renderHome })
      ]),
      confirmRow
    ]));
  }

  /* ---------- boot ---------- */
  Practice.start = function (root) {
    app = root;
    var boot = function (data) {
      data = data || {};
      if (data.lessonId && lessonById(data.lessonId)) openLesson(data.lessonId, data.sectionIdx, data.qIdx);
      else if (Practice.lessons.length === 1) openLesson(Practice.lessons[0].id);
      else renderHome();
    };
    if (window.claude && window.claude.hot) {
      window.claude.hot.snapshot && window.claude.hot.snapshot(function () { return { lessonId: state.lessonId, sectionIdx: state.sectionIdx, qIdx: state.qIdx }; });
      if (window.claude.hot.ready) return window.claude.hot.ready(boot);
      return boot(window.claude.hot.data);
    }
    boot({});
  };
})();
