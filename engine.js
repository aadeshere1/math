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

  /* ---------- algebra ---------- */
  // Reads what a student types ("3x^2 - 4xy", "2(x+y)", "x²", "1/2 bh") into a polynomial:
  // { "x2": 3, "x1y1": -4 } (term key -> number). Returns null if it cannot be read.
  var SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
  function cleanAlg(s) {
    s = String(s).toLowerCase()
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return "^" + m.split("").map(function (c) { return SUP[c]; }).join(""); })
      .replace(/[−–—]/g, "-").replace(/[×·∙]/g, "*").replace(/÷/g, "/").replace(/½/g, "1/2").replace(/,/g, "");
    if (s.indexOf("=") !== -1) s = s.slice(s.lastIndexOf("=") + 1);
    return s.replace(/\s+/g, "");
  }
  function algVars(s) { var o = {}; (cleanAlg(s).match(/[a-z]/g) || []).forEach(function (c) { o[c] = 1; }); return o; }
  function tokAlg(s, vars) {
    // drop words such as "years" or "cm" that use letters the answer does not use
    if (vars) s = s.replace(/[a-z]{2,}/g, function (w) { return w.split("").every(function (c) { return vars[c]; }) ? w : ""; });
    var out = [], m, re = /\d+(?:\.\d+)?|\.\d+|[a-z]|[-+*/^()]/g, used = 0;
    while ((m = re.exec(s))) { out.push(m[0]); used += m[0].length; }
    return used === s.length ? out : null;
  }
  function pkey(mono) { return Object.keys(mono).filter(function (k) { return mono[k]; }).sort().map(function (k) { return k + mono[k]; }).join(""); }
  function pmono(key) { var o = {}, m, re = /([a-z])(-?\d+)/g; while ((m = re.exec(key))) o[m[1]] = +m[2]; return o; }
  function padd(a, b, sg) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = (o[k] || 0) + sg * b[k]; for (k in o) if (Math.abs(o[k]) < 1e-9) delete o[k]; return o; }
  function pmul(a, b) {
    var o = {};
    Object.keys(a).forEach(function (ka) { Object.keys(b).forEach(function (kb) {
      var m = pmono(ka), n = pmono(kb), k; for (k in n) m[k] = (m[k] || 0) + n[k];
      var key = pkey(m); o[key] = (o[key] || 0) + a[ka] * b[kb];
    }); });
    return padd(o, {}, 1);
  }
  function pinv(a) { // only one term can be divided by
    var ks = Object.keys(a); if (ks.length !== 1) return null;
    var m = pmono(ks[0]), k; for (k in m) m[k] = -m[k]; var o = {}; o[pkey(m)] = 1 / a[ks[0]]; return o;
  }
  function parseAlg(raw, vars) {
    var t = tokAlg(cleanAlg(raw), vars), i = 0;
    if (!t || !t.length) return null;
    function peek() { return t[i]; }
    function expr() {
      var r = term(); if (!r) return null;
      while (peek() === "+" || peek() === "-") { var sg = t[i++] === "+" ? 1 : -1, b = term(); if (!b) return null; r = padd(r, b, sg); }
      return r;
    }
    function term() {
      var r = factor(); if (!r) return null;
      for (;;) {
        var p = peek();
        if (p === "*" || p === "/") { i++; var b = factor(); if (!b) return null; if (p === "/") { b = pinv(b); if (!b) return null; } r = pmul(r, b); }
        else if (p && (p === "(" || /^[a-z0-9.]/.test(p))) { var c = factor(); if (!c) return null; r = pmul(r, c); }
        else return r;
      }
    }
    function factor() {
      var p = t[i++], r;
      if (p === "-" || p === "+") { r = factor(); return r && (p === "-" ? padd({}, r, -1) : r); }
      if (p === "(") { r = expr(); if (t[i++] !== ")") return null; }
      else if (p && /^[a-z]$/.test(p)) { r = {}; r[p + "1"] = 1; }
      else if (p && /^[0-9.]/.test(p)) { r = {}; if (+p) r[""] = +p; }
      else return null;
      while (peek() === "^") {
        i++; var e = t[i++]; if (!/^\d+$/.test(e || "")) return null;
        var base = r; r = { "": 1 }; for (var k = 0; k < +e; k++) r = pmul(r, base);
      }
      return r;
    }
    var res = expr();
    return res && i === t.length ? res : null;
  }
  function samePoly(a, b) {
    var ks = Object.keys(a).concat(Object.keys(b));
    return ks.every(function (k) { var x = a[k] || 0, y = b[k] || 0; return Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(y)); });
  }
  // Is the typed answer fully simplified: no brackets, no like terms twice, one number and each letter once per term?
  function isSimplified(raw, vars) {
    var s = cleanAlg(raw);
    if (/[()]/.test(s)) return false;
    var t = tokAlg(s, vars); if (!t) return false;
    var terms = [], cur = [];
    t.forEach(function (x, j) {
      if ((x === "+" || x === "-") && j > 0 && t[j - 1] !== "^" && t[j - 1] !== "*" && t[j - 1] !== "/") { terms.push(cur); cur = []; }
      else cur.push(x);
    });
    terms.push(cur);
    var seen = {};
    return terms.every(function (tt) {
      var nums = 0, lets = {}, ok = true, m = {};
      tt.forEach(function (x, j) {
        if (/^[0-9.]/.test(x) && tt[j - 1] !== "^" && !(tt[j - 1] === "/" && /^[0-9.]/.test(tt[j - 2] || ""))) nums++;
        if (/^[a-z]$/.test(x)) { if (lets[x]) ok = false; lets[x] = 1; var e = tt[j + 1] === "^" ? +tt[j + 2] : 1; m[x] = e; }
        if (x === "/" ) ok = ok && !/^[a-z(]/.test(tt[j + 1] || "");
      });
      var key = pkey(m); if (seen[key]) ok = false; seen[key] = 1;
      return ok && nums <= 1;
    });
  }
  function normForm(s, numeric) {
    s = cleanAlg(s).replace(/[*.]/g, "×");
    return numeric ? s.replace(/x/g, "×") : s;
  }
  // Pretty form for showing typed algebra: 3x^2 -> 3x²
  Practice.prettyAlg = function (s) {
    var up = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
    return String(s).replace(/\^\(?(-?\d+)\)?/g, function (m, d) { return d.split("").map(function (c) { return up[c]; }).join(""); })
      .replace(/\*/g, "×").replace(/\s*([+=])\s*/g, " $1 ").replace(/(\S)\s*-\s*/g, "$1 − ").replace(/^-/, "−");
  };
  function checkExpr(field, raw) {
    if (field.form === "exact") {
      var numeric = !/[a-z]/i.test(String(field.answer).replace(/x/g, ""));
      var want = [field.answer].concat(field.accept || []).map(function (a) { return normForm(a, numeric); });
      return { ok: want.indexOf(normForm(raw, numeric)) !== -1 };
    }
    var vars = algVars(field.answer), got = parseAlg(raw, vars), ans = parseAlg(field.answer);
    if (!got) return { ok: false, say: "I can't read that. Write it like 3x + 2y, or 4a^2 for 4a²." };
    if (samePoly(got, ans)) {
      if (field.form !== "any" && !isSimplified(raw, vars))
        return { ok: false, say: "That is equal to the answer, but simplify it fully: remove brackets and add the like terms together." };
      return { ok: true };
    }
    var ms = field.mistakes || [];
    for (var i = 0; i < ms.length; i++) { var mp = parseAlg(ms[i].answer); if (mp && samePoly(got, mp)) return { ok: false, say: ms[i].say }; }
    return { ok: false };
  }

  Practice.algebra = { parse: parseAlg, same: samePoly, simplified: isSimplified };

  // Sets: "{1, 3, 5}", "1 3 5" or "a, e, i". Order does not matter; repeats get feedback.
  function setItems(s) {
    s = String(s).replace(/[{}∅]/g, " ").replace(/\b(phi|empty)\b/gi, " ").trim();
    if (!s) return [];
    return s.split(/\s*[,;]\s*|\s+/).filter(Boolean).map(function (x) {
      x = x.toLowerCase(); return /^-?\d+(\.\d+)?$/.test(x) ? String(+x) : x;
    });
  }
  Practice.showSet = function (a) { return "{" + a.join(", ") + "}"; };
  function checkSet(field, raw) {
    if (field.accept) for (var k = 0; k < field.accept.length; k++)
      if (checkSet({ answer: field.accept[k] }, raw).ok) return { ok: true };
    var got = setItems(raw), want = setItems(field.answer.join(", ")), seen = {}, dup = [];
    got.forEach(function (x) { if (seen[x] && dup.indexOf(x) === -1) dup.push(x); seen[x] = 1; });
    if (dup.length) return { ok: false, say: "In a set each element is written only once. You repeated: " + dup.join(", ") + "." };
    var extra = got.filter(function (x) { return want.indexOf(x) === -1; });
    var miss = want.filter(function (x) { return got.indexOf(x) === -1; });
    if (!extra.length && !miss.length) return { ok: true };
    var ms = field.mistakes || [];
    for (var i = 0; i < ms.length; i++) {
      var m = setItems(ms[i].answer.join ? ms[i].answer.join(",") : ms[i].answer);
      if (m.length === got.length && m.every(function (x) { return got.indexOf(x) !== -1; })) return { ok: false, say: ms[i].say };
    }
    if (!want.length) return { ok: false, say: "Nothing belongs in this set, so it is the empty set. Type {} ." };
    if (!got.length) return { ok: false, say: "This set is not empty. Which elements belong to it?" };
    if (extra.length) return { ok: false, say: "Not in this set: " + extra.join(", ") + "." };
    return { ok: false, say: "Some elements are missing. This set has " + want.length + (want.length === 1 ? " element" : " elements") + " and you wrote " + got.length + "." };
  }

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
    } else if (t === "expr") {
      return checkExpr(field, raw);
    } else if (t === "set") {
      return checkSet(field, raw);
    } else if (t === "numeral") {
      // A number written with commas in the right places, e.g. "2,70,58,91,436" (Nepali) or "2,705,891,436" (International)
      var g = String(raw).replace(/\s+/g, ""), w = String(field.answer);
      if (g === w) return { ok: true };
      if (g.replace(/,/g, "") !== w.replace(/,/g, "")) return { ok: false, say: "Some digits are not right. Check each place again." };
      if (g.indexOf(",") === -1) return { ok: false, say: "The digits are right. Now put in the commas." };
      return { ok: false, say: /^\d{1,2}(,\d\d)*,\d{3}$/.test(w) && w.split(",").length > 2
        ? "The digits are right, but the commas are in the wrong places. Nepali system: a comma after the first 3 digits from the right, then after every 2."
        : "The digits are right, but the commas are in the wrong places. International system: a comma after every 3 digits from the right." };
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
    var ph = { number: "?", angleName: "e.g. ABC", segments: "e.g. AB, AC", set: "e.g. 1, 2, 3", numeral: "e.g. 1,23,456", text: "", expr: field.form === "exact" ? "" : "e.g. 3x^2 + 2y" }[t] || "";
    var inp = el("input", { id: uid, type: "text", class: "inp inp-" + t, autocomplete: "off", spellcheck: "false",
      inputmode: t === "number" ? "decimal" : undefined, placeholder: ph,
      onkeydown: function (e) { if (e.key === "Enter") { e.preventDefault(); onEnter && onEnter(); } },
      oninput: function () { wrap.dataset.state = ""; if (prev) prev.textContent = inp.value.trim() && /[\^*]/.test(inp.value) ? "= " + Practice.prettyAlg(inp.value) : ""; } });
    var prev = t === "expr" ? el("span", { class: "alg-prev", "aria-live": "polite" }) : null;
    var wrap = el("span", { class: "inp-wrap" }, [
      t === "angleName" ? el("span", { class: "affix", text: "∠" }) : t === "set" ? el("span", { class: "affix", text: "{" }) : null,
      inp,
      t === "set" ? el("span", { class: "affix", text: "}" }) : null,
      field.unit ? el("span", { class: "affix", text: field.unit }) : null
    ]);
    if (prev) { var outer = el("span", { class: "inp-alg" }, [wrap, prev]);
      return { node: outer, get: function () { return inp.value; }, set: function (v) { inp.value = v || ""; },
        focus: function () { inp.focus(); }, mark: function (s) { wrap.dataset.state = s || ""; } }; }
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
      if (spec.vertexDeg != null) ang = spec.vertexDeg;
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
    // circles: [{ at: "O", r: 90 }]; shade: [{ at: "O", r: 90, from: 0, to: 50, kind: "sector" | "segment", tone: "a" | "b" }]
    (spec.shade || []).forEach(function (sh) {
      var c = P[sh.at], r = sh.r, a = pt(sh.from, r), b = pt(sh.to, r), sw = ((sh.to - sh.from) % 360 + 360) % 360;
      var arc = "A" + r + " " + r + " 0 " + (sw > 180 ? 1 : 0) + " 0 " + f(c.x + b[0]) + " " + f(c.y + b[1]);
      var d = sh.kind === "segment" ? "M" + f(c.x + a[0]) + " " + f(c.y + a[1]) + " " + arc + " Z"
        : "M" + f(c.x) + " " + f(c.y) + " L" + f(c.x + a[0]) + " " + f(c.y + a[1]) + " " + arc + " Z";
      s.appendChild(svg("path", { d: d, class: "shade tone-" + (sh.tone || "a") }));
    });
    (spec.circles || []).forEach(function (ci) {
      var c = P[ci.at];
      s.appendChild(svg("circle", { cx: f(c.x), cy: f(c.y), r: ci.r, class: "ray circ" }));
      grow(c.x, c.y, ci.r);
    });
    // tall drawings are shrunk to fit the height, so grow their marks and letters to match
    var px = Object.keys(P).map(function (q) { return P[q].x; }), py = Object.keys(P).map(function (q) { return P[q].y; });
    (spec.circles || []).forEach(function (ci) { var c = P[ci.at]; px.push(c.x - ci.r, c.x + ci.r); py.push(c.y - ci.r, c.y + ci.r); });
    var w0 = Math.max.apply(null, px) - Math.min.apply(null, px), h0 = Math.max.apply(null, py) - Math.min.apply(null, py);
    var X = Math.max(1, w0 / 280, h0 / 210) / Math.max(1, w0 / 280);
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
          var cx = a.x + (b.x - a.x) * t + ux * 7 * X * (i - (n - 1) / 2), cy = a.y + (b.y - a.y) * t + uy * 7 * X * (i - (n - 1) / 2), c6 = 6 * X, c4 = 4.5 * X;
          s.appendChild(svg("path", { d: "M" + f(cx - ux * c6 - uy * c4) + " " + f(cy - uy * c6 + ux * c4) + " L" + f(cx) + " " + f(cy) + " L" + f(cx - ux * c6 + uy * c4) + " " + f(cy - uy * c6 - ux * c4), class: "chev" }));
        }
      }
    });
    // ticks: [["A", "B", 1]] draws equal-side marks across the middle of AB
    (spec.ticks || []).forEach(function (tk) {
      var a = P[tk[0]], b = P[tk[1]], n = tk[2] || 1, L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L, sz = 6 * X * Math.max(1, w0 / 280);
      for (var i = 0; i < n; i++) {
        var cx = (a.x + b.x) / 2 + ux * 5 * (i - (n - 1) / 2), cy = (a.y + b.y) / 2 + uy * 5 * (i - (n - 1) / 2);
        s.appendChild(svg("line", { x1: f(cx - uy * sz), y1: f(cy + ux * sz), x2: f(cx + uy * sz), y2: f(cy - ux * sz), class: "chev" }));
      }
    });
    (spec.marks || []).forEach(function (mk) {
      var at = P[mk.at], r = (mk.r || 16) * X;
      var a = dirTo(at, mk.a), b = dirTo(at, mk.b), sw = ((b - a) % 360 + 360) % 360;
      if ((sw > 180) !== !!mk.reflex) { var tmp = a; a = b; b = tmp; sw = 360 - sw; }
      var g = svg("g", { transform: "translate(" + f(at.x) + " " + f(at.y) + ")" });
      if (mk.right) {
        var u = pt(a, r * 0.7), v = pt(b, r * 0.7);
        g.appendChild(svg("path", { d: "M" + f(u[0]) + " " + f(u[1]) + " L" + f(u[0] + v[0]) + " " + f(u[1] + v[1]) + " L" + f(v[0]) + " " + f(v[1]), class: "mark" }));
      } else if (!mk.bare) g.appendChild(svg("path", { d: arcPath(a, a + sw, r), class: "mark" + (mk.hl ? " hl" : "") }));
      if (mk.label) {
        var lr = mk.bare ? r : r + ((mk.label.length > 3 ? 14 : 10) + (sw < 35 ? 6 : 0) + (mk.push || 0)) * X, lp = pt(a + sw / 2, lr);
        g.appendChild(svg("text", { x: f(lp[0]), y: f(lp[1]), class: "arc-label" + (mk.hl ? " hl" : "") }, mk.label));
        grow(at.x + lp[0], at.y + lp[1], 12 * X);
      }
      s.appendChild(g);
    });
    // point labels: any point whose name does not start with "_"
    var cx0 = (box.x0 + box.x1) / 2, cy0 = (box.y0 + box.y1) / 2;
    Object.keys(P).forEach(function (k) {
      if (k[0] === "_") return;
      var p = P[k], d = p.lab != null ? p.lab : Math.atan2(-(p.y - cy0), p.x - cx0) * 180 / Math.PI;
      var lp = pt(d, 11 * X);
      s.appendChild(svg("text", { x: f(p.x + lp[0]), y: f(p.y + lp[1]), class: "pt-label" }, k));
      grow(p.x + lp[0], p.y + lp[1], 9 * X);
    });
    (spec.texts || []).forEach(function (t) {
      s.appendChild(svg("text", { x: t[0], y: -t[1], class: "arc-label" }, t[2])); grow(t[0], -t[1], 12);
    });
    var pad = 10 * X, vw = box.x1 - box.x0 + 2 * pad;
    s.setAttribute("viewBox", [f(box.x0 - pad), f(box.y0 - pad), f(vw), f(box.y1 - box.y0 + 2 * pad)].join(" "));
    // keep letters readable however big the drawing is (it is shown about 380px wide)
    var k = Math.max(1, vw / 300) * X;
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

  // Venn diagram: { type: "venn", a: { name: "A", items: [...] }, b: { name: "B", items: [...] }, u: { name: "U", items: [...] } }
  // Items found in both a and b go in the middle. With no common items the circles are drawn apart.
  Practice.figures.venn = function (spec) {
    var A = spec.a.items.map(String), B = spec.b ? spec.b.items.map(String) : [];
    var both = A.filter(function (x) { return B.indexOf(x) !== -1; });
    var onlyA = A.filter(function (x) { return both.indexOf(x) === -1; }), onlyB = B.filter(function (x) { return both.indexOf(x) === -1; });
    var apart = spec.b && !both.length, one = !spec.b, inside = spec.b && both.length && !onlyB.length && onlyA.length;
    var W = 320, H = spec.u ? 210 : 190, cy = spec.u ? 112 : 100, r = apart ? 62 : 72;
    var ca = one ? 160 : apart ? 88 : 122, cb = apart ? 232 : 198;
    var s = svg("svg", { class: "fig fig-venn", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Venn diagram" });
    if (spec.u) {
      s.appendChild(svg("rect", { x: 6, y: 6, width: W - 12, height: H - 12, rx: 8, class: "venn-u" }));
      s.appendChild(svg("text", { x: 20, y: 24, class: "venn-name" }, spec.u.name || "U"));
    }
    if (inside) { // B is a subset of A: draw B inside A
      s.appendChild(svg("circle", { cx: 160, cy: cy, r: 84, class: "venn-c tone-a" }));
      s.appendChild(svg("circle", { cx: 192, cy: cy, r: 44, class: "venn-c tone-b" }));
      s.appendChild(svg("text", { x: 100, y: cy - 66, class: "venn-name" }, spec.a.name));
      s.appendChild(svg("text", { x: 192, y: cy - 56, class: "venn-name" }, spec.b.name));
    }
    function place(items, x, maxCols) {
      var cols = items.length > 4 ? Math.min(maxCols, 2) : 1, rows = Math.ceil(items.length / cols), dy = rows > 4 ? 19 : 22, dx = 26;
      items.forEach(function (it, i) {
        var c = i % cols, rr = Math.floor(i / cols);
        s.appendChild(svg("text", { x: f(x + (c - (cols - 1) / 2) * dx), y: f(cy + (rr - (rows - 1) / 2) * dy), class: "venn-item" }, it));
      });
    }
    if (inside) { place(onlyA, 112, 2); place(both, 192, 2); return s; }
    s.appendChild(svg("circle", { cx: ca, cy: cy, r: r, class: "venn-c tone-a" }));
    if (!one) s.appendChild(svg("circle", { cx: cb, cy: cy, r: r, class: "venn-c tone-b" }));
    s.appendChild(svg("text", { x: ca - r * 0.72, y: cy - r * 0.86, class: "venn-name" }, spec.a.name));
    if (!one) s.appendChild(svg("text", { x: cb + r * 0.72, y: cy - r * 0.86, class: "venn-name" }, spec.b.name));
    if (one) place(onlyA, ca, 3);
    else if (apart) { place(onlyA, ca, 2); place(onlyB, cb, 2); }
    else { place(onlyA, ca - 40, 2); place(both, (ca + cb) / 2, 1); place(onlyB, cb + 40, 2); }
    if (spec.u && spec.u.items) {
      var rest = spec.u.items.map(String).filter(function (x) { return A.indexOf(x) === -1 && B.indexOf(x) === -1; });
      rest.forEach(function (it, i) { s.appendChild(svg("text", { x: 26, y: 52 + i * 20, class: "venn-item" }, it)); });
    }
    return s;
  };

  // Table puzzle: { type: "grid", rows: [["+", "9", "?a"], ["6", "15", "?b"]] }. "?a" draws an empty box labelled a.
  Practice.figures.grid = function (spec) {
    var R = spec.rows.length, C = spec.rows[0].length, cw = 56, chh = 44;
    var s = svg("svg", { class: "fig fig-grid", viewBox: "-2 -2 " + (C * cw + 4) + " " + (R * chh + 4), role: "img", "aria-label": "Number puzzle" });
    spec.rows.forEach(function (row, r) {
      row.forEach(function (v, c) {
        var blank = String(v).charAt(0) === "?", head = r === 0 || c === 0;
        s.appendChild(svg("rect", { x: c * cw, y: r * chh, width: cw, height: chh, class: "grid-cell" + (head ? " head" : "") + (blank ? " blank" : "") }));
        s.appendChild(svg("text", { x: c * cw + cw / 2, y: r * chh + chh / 2, class: blank ? "grid-q" : "grid-t" }, blank ? String(v).slice(1) : v));
      });
    });
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
          var shownAns = step.ask.type === "set" ? step.ask.answer.join(", ") : Array.isArray(step.ask.answer) ? step.ask.answer[0] : step.ask.answer;
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
