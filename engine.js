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
    var m = String(s).replace(/,/g, "").replace(/[−–]/g, "-").replace(/-\s+(?=\d)/g, "-").match(/-?(?:\d+(?:\.\d+)?|\.\d+)/);
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

  // Number theory helpers that lesson files can use to build questions.
  var NT = Practice.nt = {
    isPrime: function (n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; },
    factors: function (n) { var o = []; for (var i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o; },
    pf: function (n) { var o = [], p = 2; while (n > 1) { while (n % p === 0) { o.push(p); n /= p; } p++; } return o; },
    hcf: function () { var a = [].slice.call(arguments); return a.reduce(function (x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }); },
    lcm: function () { var a = [].slice.call(arguments); return a.reduce(function (x, y) { return x / NT.hcf(x, y) * y; }); },
    multiples: function (n, k) { var o = []; for (var i = 1; i <= k; i++) o.push(n * i); return o; },
    pfStr: function (n) { return NT.pf(n).join(" × "); },
    pfPow: function (n) {
      var c = {}, up = { 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶" };
      NT.pf(n).forEach(function (p) { c[p] = (c[p] || 0) + 1; });
      return Object.keys(c).map(function (p) { return p + (c[p] > 1 ? up[c[p]] : ""); }).join(" × ");
    }
  };
  // Prime factorisation answers: "2 × 2 × 3", "2*2*3", "2x2x3", "2^2 × 3" or "2² × 3"
  function checkFactors(field, raw) {
    var sup = { "²": "^2", "³": "^3", "⁴": "^4", "⁵": "^5", "⁶": "^6" };
    var s = String(raw).replace(/[²³⁴⁵⁶]/g, function (c) { return sup[c]; }).replace(/\s*\^\s*/g, "^").trim();
    var toks = s.split(/\s*[×xX*·.]\s*|\s+/).filter(Boolean), list = [];
    for (var i = 0; i < toks.length; i++) {
      var m = toks[i].match(/^(\d+)(?:\^(\d+))?$/);
      if (!m) return { ok: false, say: "Write it like 2 × 2 × 3 (you can type x or * for ×)." };
      for (var k = 0; k < (m[2] ? +m[2] : 1); k++) list.push(+m[1]);
    }
    var prod = list.reduce(function (a, b) { return a * b; }, 1);
    if (prod !== field.answer) return { ok: false, say: "Those multiply to " + prod + ", not " + field.answer + "." };
    var bad = list.filter(function (x) { return !NT.isPrime(x); });
    if (bad.length) return { ok: false, say: bad[0] === 1 ? "Leave out 1. Use only prime numbers." : bad[0] + " is not a prime number. Break it into smaller factors." };
    return { ok: true };
  }

  // Fractions: "3/8". frac: one fraction (equal value accepted; den: required denominator; lowest: must be in lowest terms).
  // equiv: a list of fractions equivalent to answer; count, mode "mul" (bigger denominators) or "div" (smaller).
  function parseFrac(t) { var m = String(t).replace(/\s+/g, "").match(/^(-?\d+)\/(\d+)$/); return m && +m[2] ? [+m[1], +m[2]] : null; }
  function fracG(a, b) { while (b) { var t = b; b = a % b; a = t; } return Math.abs(a); }
  // parseAny: "7/4", "1 3/4" (or "1 and 3/4") or "2" -> [numerator, denominator]; .mixed holds [whole, num, den] for a mixed number.
  function parseAny(t) {
    t = String(t).trim().replace(/\s+/g, " ");
    var m = t.match(/^(\d+)(?: | and )(\d+) ?\/ ?(\d+)$/);
    if (m && +m[3]) { var r = [+m[1] * +m[3] + +m[2], +m[3]]; r.mixed = [+m[1], +m[2], +m[3]]; return r; }
    if (/^-?\d+$/.test(t)) return [+t, 1];
    return parseFrac(t);
  }
  function checkFrac(field, raw) {
    var w = parseAny(field.answer), g = field.mixedOk ? parseAny(raw) : parseFrac(raw);
    if (!g) return { ok: false, say: !field.mixedOk && parseAny(raw) && parseAny(raw).mixed ? "Write it as a fraction like 7/4, not as a mixed number."
      : field.mixedOk ? "Write a fraction like 3/8 or a mixed number like 1 3/8." : "Write a fraction like 3/8 (numerator / denominator)." };
    if (g[0] * w[1] !== w[0] * g[1]) {
      var ms = field.mistakes || [];
      for (var i = 0; i < ms.length; i++) { var m = parseAny(ms[i].answer); if (m && m[0] * g[1] === g[0] * m[1]) return { ok: false, say: ms[i].say }; }
      return { ok: false };
    }
    if (field.den && g[1] !== field.den) return { ok: false, say: "That is equal, but use the denominator " + field.den + "." };
    if (g.mixed) {
      if (g.mixed[1] >= g.mixed[2]) return { ok: false, say: "That is equal, but the fraction part must be less than 1. Take out more wholes." };
      if (field.lowest && fracG(g.mixed[1], g.mixed[2]) !== 1) return { ok: false, say: "That is equal, but write the fraction part in its lowest terms." };
    } else if (field.lowest && fracG(g[0], g[1]) !== 1) return { ok: false, say: "That is equal, but write it in its lowest terms." };
    return { ok: true };
  }
  // Fraction arithmetic for lesson files: values are [num, den] in lowest terms.
  Practice.fr = (function () {
    function red(a) { var g = fracG(a[0], a[1]) || 1; if (a[1] < 0) g = -g; return [a[0] / g, a[1] / g]; }
    var F = {
      of: function (t) { return red(parseAny(t)); },
      add: function (a, b) { return red([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]); },
      sub: function (a, b) { return red([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]); },
      mul: function (a, b) { return red([a[0] * b[0], a[1] * b[1]]); },
      div: function (a, b) { return red([a[0] * b[1], a[1] * b[0]]); },
      str: function (a) { return a[1] === 1 ? String(a[0]) : a[0] + "/" + a[1]; },
      mixed: function (a) { return a[1] === 1 || a[0] < a[1] ? F.str(a) : Math.floor(a[0] / a[1]) + (a[0] % a[1] ? " " + a[0] % a[1] + "/" + a[1] : ""); },
      isInt: function (a) { return a[1] === 1; }
    };
    // calc(id, "3 2/3 + 2 5/6 − 4 4/9", opts): a whole question with worked help.
    // Operators: + − × ÷ and "of" (done first), then × ÷, then + −, left to right. opts: prompt, label, unit, answer (override).
    F.calc = function (id, expr, opts) {
      opts = opts || {};
      var toks = expr.split(/ (\+|−|×|÷|of) /), vals = [], ops = [], help = [], anyMixed = false;
      for (var i = 0; i < toks.length; i++) if (i % 2) ops.push(toks[i]); else { var v = parseAny(toks[i]); if (v.mixed) anyMixed = true; vals.push({ t: toks[i], v: red(v) }); }
      var unred = toks.filter(function (t, i) { var f = !(i % 2) && parseFrac(t); return f && fracG(f[0], f[1]) > 1; });
      if (unred.length) help.push({ text: "First reduce to lowest terms: " + unred.map(function (t) { return t + " = " + F.str(F.of(t)); }).join(", ") + "." });
      var mixedOnes = vals.filter(function (x) { return / /.test(x.t); });
      if (mixedOnes.length) help.push({ text: "Change the mixed numbers to improper fractions: " + mixedOnes.map(function (x) { return x.t + " = " + F.str(x.v); }).join(", ") + "." });
      function step(a, op, b) {
        var r, A = F.str(a), B = F.str(b), L, x, y;
        if (op === "+" || op === "−") {
          r = op === "+" ? F.add(a, b) : F.sub(a, b);
          if (a[1] === b[1]) { var s0 = (op === "+" ? a[0] + b[0] : a[0] - b[0]) + "/" + a[1]; return { r: r, say: "Same denominators, so " + (op === "+" ? "add" : "subtract") + " the numerators: " + A + " " + op + " " + B + " = " + s0 + (F.str(r) !== s0 ? " = " + F.str(r) : "") + "." }; }
          L = NT.lcm(a[1], b[1]); x = a[0] * L / a[1]; y = b[0] * L / b[1];
          var n = op === "+" ? x + y : x - y;
          return { r: r, say: "L.C.M. of " + a[1] + " and " + b[1] + " is " + L + ": " + A + " " + op + " " + B + " = " + x + "/" + L + " " + op + " " + y + "/" + L + " = " + n + "/" + L + (F.str(r) !== n + "/" + L ? " = " + F.str(r) : "") + "." };
        }
        if (op === "÷") { var rb = [b[1], b[0]]; r = F.mul(a, rb); return { r: r, say: "Dividing by " + B + " means multiplying by its reciprocal " + F.str(rb) + ": " + A + " × " + F.str(rb) + " = " + F.str(r) + "." }; }
        r = F.mul(a, b);
        return { r: r, say: A + " " + (op === "of" ? "of" : "×") + " " + B + " = (" + a[0] + " × " + b[0] + ")/(" + a[1] + " × " + b[1] + ") = " + F.str(r) + (op === "of" ? " (\"of\" means ×)" : "") + "." };
      }
      [["of"], ["×", "÷"], ["+", "−"]].forEach(function (level) {
        for (var k = 0; k < ops.length;) {
          if (level.indexOf(ops[k]) === -1) { k++; continue; }
          var st = step(vals[k].v, ops[k], vals[k + 1].v);
          help.push({ text: st.say });
          vals.splice(k, 2, { t: F.str(st.r), v: st.r }); ops.splice(k, 1);
        }
      });
      var res = vals[0].v, show = anyMixed || opts.showMixed ? F.mixed(res) : F.str(res), extra = !anyMixed && res[0] > res[1] && res[1] > 1 ? " = " + F.mixed(res) : "";
      if (opts.answer != null) show = opts.answer;
      if (opts.help) help = opts.help.map(function (t) { return { text: t }; });
      var pre = anyMixed && !opts.help && opts.answer == null && F.str(res) !== show ? F.str(res) + " = " : "";
      help.push({ text: "Answer: **" + (opts.pre || "") + pre + show + extra + (opts.unit ? " " + opts.unit : "") + "**." });
      var part = F.isInt(res) ? { id: "v", label: opts.label || "", type: "number", answer: res[0] }
        : { id: "v", label: opts.label || "", type: "frac", answer: show, lowest: true, mixedOk: true };
      if (opts.unit) part.unit = opts.unit;
      return { id: id, prompt: opts.prompt || "**" + expr + "**", parts: [part], help: help };
    };
    return F;
  })();
  // mixed: a mixed number typed "2 3/4" (whole number, space, proper fraction in lowest terms).
  function checkMixed(field, raw) {
    var t = String(raw).trim().replace(/\s+/g, " "), w = field.answer.split(/[ \/]/).map(Number), wv = [w[0] * w[2] + w[1], w[2]];
    var f = parseFrac(t), m = t.match(/^(\d+)(?: | and )(\d+) ?\/ ?(\d+)$/);
    if (f && !m) return f[0] * wv[1] === wv[0] * f[1] ? { ok: false, say: "That is equal, but write it as a mixed number, like " + field.answer + "." } : { ok: false };
    if (/^\d+$/.test(t)) return { ok: false, say: "Don't forget the fraction part. Type it like 2 3/4." };
    if (!m || !+m[3]) return { ok: false, say: "Type a mixed number like 2 3/4 (whole number, space, fraction)." };
    var a = +m[1], b = +m[2], c = +m[3];
    if ((a * c + b) * wv[1] !== wv[0] * c) return { ok: false };
    if (b >= c) return { ok: false, say: "That is equal, but the fraction part must be less than 1. Take out more wholes." };
    if (fracG(b, c) !== 1) return { ok: false, say: "That is equal, but write the fraction part in its lowest terms." };
    return { ok: true };
  }
  function checkEquiv(field, raw) {
    var w = parseFrac(field.answer), toks = String(raw).split(/[,;]|\s+(?=\d)/).map(function (x) { return x.trim(); }).filter(Boolean), seen = {};
    var list = toks.map(parseFrac);
    if (list.some(function (x) { return !x; })) return { ok: false, say: "Write the fractions like 2/4, 3/6, 4/8, with commas between them." };
    for (var i = 0; i < list.length; i++) {
      var g = list[i], key = g.join("/");
      if (g[0] * w[1] !== w[0] * g[1]) return { ok: false, say: key + " is not equal to " + field.answer + "." };
      if (g[0] === w[0] && g[1] === w[1]) return { ok: false, say: "Don't include " + field.answer + " itself. Write new fractions." };
      if (seen[key]) return { ok: false, say: "You wrote " + key + " twice." };
      if (field.mode === "div" && g[1] > w[1]) return { ok: false, say: "Use division: the new denominators should be smaller than " + w[1] + "." };
      seen[key] = 1;
    }
    var n = field.count || 3;
    if (list.length !== n) return { ok: false, say: "Write " + n + " fractions. You wrote " + list.length + "." };
    if (field.mode === "mul") {
      var want = []; for (var k = 2; k < n + 2; k++) want.push(w[0] * k + "/" + w[1] * k);
      if (!want.every(function (x) { return seen[x]; })) return { ok: false, say: "These are equal, but the first three come from multiplying by 2, 3 and 4." };
    }
    return { ok: true };
  }

  // Sets: "{1, 3, 5}", "1 3 5" or "a, e, i". Order does not matter; repeats get feedback.
  function setItems(s) {
    s = String(s).replace(/[−–]/g, "-").replace(/[{}∅]/g, " ").replace(/\b(phi|empty)\b/gi, " ").trim();
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

  // Points: "(2, -3)" with or without brackets. point: typed; plot: clicked on a grid. Answer is written "(2, -3)".
  function parsePoint(t) {
    var m = String(t).replace(/[−–]/g, "-").replace(/\s+/g, "").match(/^\(?(-?\d+(?:\.\d+)?)[,;](-?\d+(?:\.\d+)?)\)?$/);
    return m ? [+m[1], +m[2]] : null;
  }
  Practice.parsePoint = parsePoint;
  function checkPoint(field, raw) {
    var g = parsePoint(raw), w = parsePoint(field.answer);
    if (!g) return { ok: false, say: field.type === "plot" ? "Click on the grid to place the point." : "Write the point like (2, 3): x first, then y." };
    if (g[0] === w[0] && g[1] === w[1]) return { ok: true };
    var where = field.type === "plot" ? ("You placed (" + g[0] + ", " + g[1] + "). ").replace(/-/g, "−") : "";
    if (g[0] === w[1] && g[1] === w[0]) return { ok: false, say: where + "You swapped x and y. Go across (x) first, then up or down (y)." };
    if (g[0] === w[0]) return { ok: false, say: where + "The x-coordinate is right. Check the y-coordinate" + (g[1] === -w[1] ? ": up is +, down is −." : ".") };
    if (g[1] === w[1]) return { ok: false, say: where + "The y-coordinate is right. Check the x-coordinate" + (g[0] === -w[0] ? ": right is +, left is −." : ".") };
    return { ok: false, say: where ? where + "Start at O, go across for x, then up or down for y." : undefined };
  }

  /* ---------- decimals ---------- */
  // Values are exact fractions [num, den] in lowest terms, so 0.1 + 0.2 is exactly 0.3.
  Practice.dec = (function () {
    var F = Practice.fr;
    function p10(k) { return Math.pow(10, k); }
    function of(s) {
      s = String(s).replace(/[−–]/g, "-").replace(/,/g, "").trim();
      var m = s.match(/^(-?)(\d*)\.?(\d*)$/);
      if (!m || (m[2] === "" && m[3] === "")) return null;
      var k = m[3].length, n = parseInt((m[2] || "0") + m[3], 10) * (m[1] ? -1 : 1);
      return F.of(n + "/" + p10(k));
    }
    function dps(s) { var m = String(s).match(/\.(\d*)/); return m ? m[1].length : 0; }
    function terminates(v) { var d = v[1]; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
    // decimal string of a value (exact when it terminates, else rounded to `places`, default 4)
    function str(v, places) {
      var neg = v[0] < 0, n = Math.abs(v[0]), d = v[1], k = 0;
      if (terminates(v)) { while (p10(k) % d) k++; } else k = places == null ? 4 : places;
      var x = Math.round(n * p10(k) / d), s = String(x);
      if (k) { while (s.length <= k) s = "0" + s; s = s.slice(0, -k) + "." + s.slice(-k); if (places == null || terminates(v)) s = s.replace(/\.?0+$/, ""); }
      return (neg && x ? "−" : "") + s;
    }
    function pad(s, k) { s = String(s).replace("-", "−"); var have = dps(s); if (k <= have) return s; return (have ? s : s + ".") + new Array(k - have + 1).join("0"); }
    function round(s, k) { var v = of(s), x = Math.round(Math.abs(v[0]) * p10(k) / v[1] + 1e-9) * (v[0] < 0 ? -1 : 1); var r = String(Math.abs(x)); while (r.length <= k) r = "0" + r; return (x < 0 ? "−" : "") + (k ? r.slice(0, -k) + "." + r.slice(-k) : r); }
    function isPow10(v) { return v[1] === 1 && /^10+$/.test(String(v[0])); }
    function zeros(v) { return String(v[0]).length - 1; }
    var PL = ["", "1 place", "2 places", "3 places", "4 places", "5 places", "6 places"];
    function step(a, op, b) {
      var A = str(a), B = str(b), r, R, k;
      if (op === "+" || op === "−") {
        r = op === "+" ? F.add(a, b) : F.sub(a, b); R = str(r); k = Math.max(dps(A), dps(B));
        if (!k) return { r: r, say: A + " " + op + " " + B + " = " + R + "." };
        var pa = pad(A, k), pb = pad(B, k), pr = pad(R, k);
        return { r: r, say: "Line up the decimal points" + (pa !== A || pb !== B ? " (give both " + k + " decimal place" + (k > 1 ? "s" : "") + ")" : "") + ": " + pa + " " + op + " " + pb + " = " + pr + (pr !== R ? " = " + R : "") + "." };
      }
      if (op === "×") {
        r = F.mul(a, b); R = str(r);
        if (isPow10(b) && dps(A)) return { r: r, say: "Multiplying by " + B + " moves the decimal point " + PL[zeros(b)] + " to the right: " + A + " × " + B + " = " + R + "." };
        if (isPow10(a) && dps(B)) return { r: r, say: "Multiplying by " + A + " moves the decimal point " + PL[zeros(a)] + " to the right: " + A + " × " + B + " = " + R + "." };
        var da = dps(A), db = dps(B);
        if (!da && !db) return { r: r, say: A + " × " + B + " = " + R + "." };
        var ia = A.replace(".", "").replace(/^(−?)0+(?=\d)/, "$1"), ib = B.replace(".", "").replace(/^(−?)0+(?=\d)/, "$1");
        var ip = String(Math.abs(+ia.replace("−", "-") * +ib.replace("−", "-")));
        return { r: r, say: "Multiply without the decimal points: " + ia + " × " + ib + " = " + ip + ". Count the decimal places: " + da + " + " + db + " = " + (da + db) + ", so " + A + " × " + B + " = " + pad(R, da + db) + (pad(R, da + db) !== R ? " = " + R : "") + "." };
      }
      // division
      r = F.div(a, b); R = str(r);
      var out = [], q = R;
      if (!terminates(r)) q = str(r, 4) + "…";
      if (isPow10(b)) return { r: r, say: "Dividing by " + B + " moves the decimal point " + PL[zeros(b)] + " to the left: " + A + " ÷ " + B + " = " + q + "." };
      k = dps(B);
      if (k) {
        var A2 = str(F.mul(a, [p10(k), 1])), B2 = str(F.mul(b, [p10(k), 1]));
        out.push("Make the divisor a whole number: multiply both numbers by " + p10(k) + ". " + A + " ÷ " + B + " = " + A2 + " ÷ " + B2 + ".");
        out.push(A2 + " ÷ " + B2 + " = " + q + (dps(A2) ? " (the point in the answer goes above the point in " + A2 + ")" : "") + ". Check: " + q.replace("…", "") + " × " + B + (terminates(r) ? " = " + A : " ≈ " + A) + ".");
        return { r: r, say: out.join(" ") };
      }
      if (dps(A)) return { r: r, say: "Divide as usual and put the point in the answer above the point in " + A + ": " + A + " ÷ " + B + " = " + q + ". Check: " + q.replace("…", "") + " × " + B + (terminates(r) ? " = " : " ≈ ") + A + "." };
      return { r: r, say: A + " ÷ " + B + " = " + q + "." };
    }
    // Evaluates "2 × (0.4 + 0.3)", "{2.5 × (4.3 − 3.4) ÷ (1.5)²} + 0.1" step by step.
    function evaluate(expr) {
      var toks = String(expr).replace(/-/g, "−").match(/\d*\.?\d+|[+−×÷(){}\[\]²]/g), steps = [], many = (toks.join("").match(/[+−×÷²]/g) || []).length > 1;
      function solve(list, inBr) {
        // list: tokens with no brackets, numbers as values
        var vals = [], ops = [], tagged = {};
        list.forEach(function (t, i) { if (i % 2) ops.push(t); else vals.push(t); });
        [["×", "÷"], ["+", "−"]].forEach(function (lv, li) {
          for (var k = 0; k < ops.length;) {
            if (lv.indexOf(ops[k]) === -1) { k++; continue; }
            var st = step(vals[k], ops[k], vals[k + 1]);
            var tag = !many ? "" : inBr ? "Brackets first. " : li === 0 && ops.some(function (o) { return o === "+" || o === "−"; }) ? "× and ÷ before + and −. " : "";
            if (tagged[tag]) tag = ""; else tagged[tag] = 1;
            steps.push(tag + st.say);
            vals.splice(k, 2, st.r); ops.splice(k, 1);
          }
        });
        return vals[0];
      }
      var t = toks.map(function (x) { return /\d/.test(x) ? of(x) : x; });
      var guard = 0;
      while (guard++ < 50) {
        var close = -1, open = -1;
        for (var i = 0; i < t.length; i++) if (t[i] === ")" || t[i] === "}" || t[i] === "]") { close = i; break; }
        // squares of plain numbers
        for (var j = 0; j < t.length; j++) if (t[j] === "²" && Array.isArray(t[j - 1])) {
          var v = t[j - 1], sq = F.mul(v, v); steps.push("Square: (" + str(v) + ")² = " + str(v) + " × " + str(v) + " = " + str(sq) + "."); t.splice(j - 1, 2, sq); j = 0;
        }
        if (close === -1) { for (i = 0; i < t.length; i++) if (t[i] === ")" || t[i] === "}" || t[i] === "]") { close = i; break; } }
        if (close === -1) break;
        for (i = close; i >= 0; i--) if (t[i] === "(" || t[i] === "{" || t[i] === "[") { open = i; break; }
        var inner = t.slice(open + 1, close), val = inner.length === 1 ? inner[0] : solve(inner, true);
        t.splice(open, close - open + 1, val);
      }
      var res = t.length === 1 ? t[0] : solve(t, false);
      return { v: res, steps: steps };
    }
    // calc(id, "0.15 + 0.47", opts): a whole question with worked help.
    // opts: prompt, label, unit, intro (step texts before), outro (after), dp (round the answer), answer (shown answer), pre (text before the answer), mistakes.
    function calc(id, expr, opts) {
      opts = opts || {};
      var e = evaluate(expr), help = (opts.intro || []).map(function (s) { return { text: s }; });
      e.steps.forEach(function (s) { help.push({ text: s }); });
      var ans = opts.answer != null ? String(opts.answer) : opts.dp != null ? round(str(e.v, 8), opts.dp) : str(e.v);
      if (opts.dp != null) help.push({ text: "Round to " + opts.dp + " decimal place" + (opts.dp > 1 ? "s" : "") + ": " + str(e.v, 6) + (terminates(e.v) ? "" : "…") + " ≈ " + ans + "." });
      (opts.outro || []).forEach(function (s) { help.push({ text: s }); });
      help.push({ text: "Answer: **" + (opts.pre || "") + ans + (opts.unit ? " " + opts.unit : "") + "**." });
      var part = { id: "v", label: opts.label || "", type: "dec", answer: ans.replace("−", "-") };
      if (opts.dp != null) { part.dp = opts.dp; part.round = str(e.v, 8); }
      if (opts.unit) part.unit = opts.unit;
      if (opts.mistakes) part.mistakes = opts.mistakes;
      return { id: id, prompt: opts.prompt || "**" + expr + "**", parts: [part], help: help };
    }
    return { of: of, str: str, dps: dps, pad: pad, round: round, terminates: terminates, step: step, evaluate: evaluate, calc: calc };
  })();
  // dec: a decimal number. Options: dp (exact number of decimal places, for rounding), round (the unrounded value),
  // fracOk (an equal fraction is fine too), tolerance, mistakes.
  function checkDec(field, raw) {
    var D = Practice.dec, s = String(raw).replace(/[−–]/g, "-").replace(/,/g, "").replace(/\s*\/\s*/g, "/");
    var m = s.match(/-?(?:\d+\.\d*|\.\d+|\d+)(?:\/\d+)?/);
    if (!m) return { ok: false, say: "Type a decimal number like 0.25." };
    var tok = m[0].replace(/\.$/, ""), isFr = tok.indexOf("/") !== -1, g = isFr ? (parseFrac(tok) ? Practice.fr.of(tok) : null) : D.of(tok), w = D.of(field.answer);
    if (!g) return { ok: false, say: "Type a decimal number like 0.25." };
    var gv = g[0] / g[1], wv = w[0] / w[1], same = field.tolerance ? Math.abs(gv - wv) <= field.tolerance + 1e-12 : g[0] === w[0] && g[1] === w[1];
    if (same) {
      if (isFr && !field.fracOk) return { ok: false, say: "That is equal, but write it as a decimal, like " + field.answer + "." };
      if (field.dp != null && !isFr && D.dps(tok) !== field.dp) return { ok: false, say: "Right value. To " + field.dp + " decimal place" + (field.dp > 1 ? "s" : "") + ", write exactly " + field.dp + " digit" + (field.dp > 1 ? "s" : "") + " after the point: " + field.answer + "." };
      return { ok: true };
    }
    var ms = field.mistakes || [];
    for (var i = 0; i < ms.length; i++) { var mv = D.of(ms[i].answer) || parseFrac(ms[i].answer); if (mv && Math.abs(mv[0] / mv[1] - gv) < 1e-12) return { ok: false, say: ms[i].say }; }
    if (field.dp != null && field.round) {
      var r = D.of(field.round), k = field.dp, tr = Math.floor(Math.abs(r[0]) * Math.pow(10, k) / r[1] + 1e-9) / Math.pow(10, k);
      if (Math.abs(Math.abs(gv) - tr) < 1e-12) return { ok: false, say: "Look at the next digit after " + k + " decimal place" + (k > 1 ? "s" : "") + ". If it is 5 or more, round up." };
      if (Math.abs(gv - r[0] / r[1]) < 1e-12 || D.dps(tok) > k) return { ok: false, say: "Round it: keep only " + k + " digit" + (k > 1 ? "s" : "") + " after the decimal point." };
    }
    if (gv && wv) { var ratio = Math.log(Math.abs(gv / wv)) / Math.LN10; if (Math.abs(ratio - Math.round(ratio)) < 1e-9 && Math.round(ratio) !== 0) return { ok: false, say: "The digits are right, but the decimal point is in the wrong place." }; }
    return { ok: false };
  }
  // expand: expanded form of a decimal, e.g. 0.25 = 0.2 + 0.05 (or 2/10 + 5/100, or 2 × 0.1 + 5 × 0.01).
  function checkExpand(field, raw) {
    var D = Practice.dec, F = Practice.fr, w = D.of(field.answer), parts = String(raw).replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/^.*=/, "").split("+").filter(Boolean);
    if (parts.length < 2) return { ok: false, say: "Split it into place values, one part for each digit, joined with +." };
    var sum = [0, 1], seen = {};
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].replace(/[()]/g, ""), fs = p.split(/[×x*]/), v = [1, 1];
      for (var j = 0; j < fs.length; j++) { var f = fs[j].indexOf("/") !== -1 ? parseFrac(fs[j]) : D.of(fs[j]); if (!f) return { ok: false, say: "I can't read \"" + parts[i] + "\". Write parts like 0.2 + 0.05 or 2/10 + 5/100." }; v = F.mul(v, F.of(f[0] + "/" + f[1])); }
      var lg = Math.log(v[1]) / Math.LN10, k = Math.round(lg);
      if (v[0] === 0) continue;
      if (v[1] !== Math.pow(10, k) && v[1] !== 1 || v[0] > 9 || v[0] < 1) {
        // allow e.g. 5/1000 reduced to 1/200: rebuild with a power of ten
        var ok2 = false;
        for (k = 0; k <= 8; k++) { var n = v[0] * Math.pow(10, k) / v[1]; if (Math.abs(n - Math.round(n)) < 1e-9 && Math.round(n) >= 1 && Math.round(n) <= 9) { ok2 = true; break; } }
        if (!ok2) return { ok: false, say: "\"" + parts[i] + "\" is not one place value. Each part should be one digit in its place, like 0.4 or 7/100." };
      } else if (v[1] === 1) k = 0;
      if (seen[k]) return { ok: false, say: "Two parts are in the same place. Use one part for each place." };
      seen[k] = 1; sum = F.add(sum, v);
    }
    if (sum[0] * w[1] !== w[0] * sum[1]) return { ok: false, say: "Your parts add up to " + D.str(sum) + ", not " + field.answer + "." };
    return { ok: true };
  }

  /* ---------- equations and inequalities ---------- */
  // rel: an equation or inequality, e.g. "x + 5 = 9" or "x - 1 >= 3". Any equal form is accepted
  // (9 = x + 5, 4 < x, x - 4 > 0). Options: exact (the sides must match, not just be equivalent).
  var REL = { "<": 1, ">": 1, "=": 1, "<=": 1, ">=": 1 }, FLIP = { "<": ">", ">": "<", "=": "=", "<=": ">=", ">=": "<=" };
  function splitRel(raw) {
    var s = String(raw).replace(/≤|=<|⩽/g, "<=").replace(/≥|=>|⩾/g, ">=").replace(/[−–]/g, "-").replace(/÷/g, "/");
    var ops = s.match(/<=|>=|<|>|=/g);
    if (!ops || ops.length !== 1) return null;
    var op = ops[0], parts = s.split(op);
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return null;
    return { l: parts[0], op: op, r: parts[1] };
  }
  function relPoly(rel) {
    var vars = {}; "abcdefghijklmnopqrstuvwxyz".split("").forEach(function (c) { vars[c] = 1; });
    var L = parseAlg(rel.l, vars), R = parseAlg(rel.r, vars);
    return L && R ? padd(L, R, -1) : null;
  }
  function ratio(a, b) { // a = k b ? returns k or null
    var k = null, ks = Object.keys(a).concat(Object.keys(b));
    for (var i = 0; i < ks.length; i++) {
      var x = a[ks[i]] || 0, y = b[ks[i]] || 0;
      if (!y && !x) continue;
      if (!y || !x) return null;
      var r = x / y; if (k === null) k = r; else if (Math.abs(k - r) > 1e-6 * Math.abs(k)) return null;
    }
    return k;
  }
  function checkRel(field, raw) {
    var w = splitRel(field.answer), g = splitRel(raw);
    if (!g) return { ok: false, say: "Write one sign: =, <, >, <= (≤) or >= (≥), with an expression on each side. Example: x + 2 = 5." };
    var pw = relPoly(w), pg = relPoly(g);
    if (!pg) return { ok: false, say: "I can't read one side. Use letters, numbers and + − × /, like 3x + 2 = 11." };
    var k = ratio(pg, pw);
    if (k === null) return { ok: false };
    var want = k > 0 ? w.op : FLIP[w.op];
    if (g.op !== want) {
      var strict = { "<": 1, ">": 1 };
      if ((strict[g.op] && !strict[want]) || (!strict[g.op] && strict[want] && g.op !== "=")) return { ok: false, say: g.op.length === 1 ? "Should the number itself be included? \"At least\" or \"or equal to\" needs ≤ or ≥ (type <= or >=)." : "Should the number itself be included? \"Less than\" or \"greater than\" alone needs < or >, without the equal part." };
      return { ok: false, say: w.op === "=" ? "This should be an equation, with =." : "The sign points the wrong way. The open side of < or > faces the bigger number." };
    }
    if (field.exact && Math.abs(k - 1) > 1e-9 && Math.abs(k + 1) > 1e-9) return { ok: false, say: "That is equal, but write it in its simplest form, like " + field.answer + "." };
    return { ok: true };
  }
  // Linear equation solver for lesson files: Practice.eq.solve(id, "3x - 4 = 2x + 5", opts) builds a question with worked steps.
  Practice.eq = (function () {
    var F = Practice.fr;
    function rat(v) { // float -> [n, d]
      for (var d = 1; d <= 10000; d++) { var n = v * d; if (Math.abs(n - Math.round(n)) < 1e-7) return F.of(Math.round(n) + "/" + d); }
      return [v, 1];
    }
    function num(r) { return F.str(r).replace("-", "−"); }
    function lin(a, b, x) { // a x + b
      var s = "";
      if (a[0]) s = (a[0] === a[1] ? "" : a[0] === -a[1] ? "−" : num(a)) + x;
      if (b[0]) s += s ? (b[0] < 0 ? " − " + num([-b[0], b[1]]) : " + " + num(b)) : num(b);
      return s || "0";
    }
    function sides(expr) {
      var rel = splitRel(expr), v = (expr.match(/[a-z]/) || ["x"])[0], vars = {}; vars[v] = 1;
      var L = parseAlg(rel.l, vars), R = parseAlg(rel.r, vars);
      return { v: v, op: rel.op, a: rat(L[v + "1"] || 0), b: rat(L[""] || 0), c: rat(R[v + "1"] || 0), d: rat(R[""] || 0) };
    }
    function solve(id, expr, opts) {
      opts = opts || {};
      var e = sides(expr), x = e.v, help = (opts.intro || []).map(function (t) { return { text: t }; }), a = e.a, b = e.b, c = e.c, d = e.d;
      var L = 1; [a, b, c, d].forEach(function (r) { L = Practice.nt.lcm(L, r[1]); });
      var simple = lin(a, b, x) + " " + (e.op === "=" ? "=" : e.op) + " " + lin(c, d, x), norm = function (t) { return String(t).replace(/[\s*×]/g, "").replace(/[−–]/g, "-"); };
      var terms = function (t) { return (String(t).replace(/^\s*[-−]/, "").match(/[+\-−]/g) || []).length + 1; }, rs = splitRel(expr);
      if (L === 1 && (/[()]/.test(expr) || terms(rs.l) > terms(lin(a, b, x)) || terms(rs.r) > terms(lin(c, d, x)))) help.push({ text: "Simplify each side: " + simple + "." });
      if (L > 1) {
        var m = [L, 1]; a = F.mul(a, m); b = F.mul(b, m); c = F.mul(c, m); d = F.mul(d, m);
        help.push({ text: "Clear the fractions: multiply both sides by " + L + (opts.cross ? " (or cross-multiply)" : " (the L.C.M. of the denominators)") + ". " + lin(a, b, x) + " = " + lin(c, d, x) + "." });
      }
      if (c[0]) {
        var a2 = F.sub(a, c);
        help.push({ text: (c[0] > 0 ? "Subtract " + lin(c, [0, 1], x) + " from" : "Add " + lin([-c[0], c[1]], [0, 1], x) + " to") + " both sides: " + lin(a2, b, x) + " = " + num(d) + "." });
        a = a2; c = [0, 1];
      }
      if (b[0]) {
        var d2 = F.sub(d, b);
        help.push({ text: (b[0] > 0 ? "Subtract " + num(b) + " from" : "Add " + num([-b[0], b[1]]) + " to") + " both sides: " + lin(a, [0, 1], x) + " = " + num(d2) + "." });
        d = d2; b = [0, 1];
      }
      var res = F.div(d, a);
      if (!(a[0] === a[1])) help.push({ text: (a[0] === -a[1] ? "Multiply both sides by −1" : a[1] === 1 ? "Divide both sides by " + num(a) : "Multiply both sides by " + num([a[1], a[0]])) + ": " + x + " = " + num(res) + "." });
      if (opts.check !== false) {
        var E = sides(expr), lv = F.add(F.mul(E.a, res), E.b), rv = F.add(F.mul(E.c, res), E.d);
        help.push({ text: "Check: put " + x + " = " + num(res) + " in the equation. Left side = " + num(lv) + ", right side = " + num(rv) + " ✓" });
      }
      (opts.outro || []).forEach(function (t) { help.push({ text: t }); });
      help.push({ text: "Answer: **" + (opts.answerText || x + " = " + num(res)) + "**." });
      var part = F.isInt(res) ? { id: "v", label: opts.label || x + " =", type: "number", answer: res[0] } : { id: "v", label: opts.label || x + " =", type: "frac", answer: F.mixed(res), mixedOk: true };
      if (opts.unit) part.unit = opts.unit;
      return { id: id, prompt: opts.prompt || "**" + Practice.prettyAlg(expr) + "**", parts: [part], help: help, value: res };
    }
    return { solve: solve, sides: sides, lin: lin };
  })();

  // Returns {ok:boolean, say?:string}
  Practice.check = function (field, raw) {
    var t = field.type || "text";
    if (raw == null || String(raw).trim() === "") return { ok: false, empty: true };
    var ok = false;
    if (t === "number") {
      var v = num(raw), tol = field.tolerance || 0;
      ok = !isNaN(v) && [field.answer].concat(field.alt || []).some(function (a) { return Math.abs(v - a) <= tol + 1e-9; });
      if (!ok && field.mistakes) for (var i = 0; i < field.mistakes.length; i++) {
        var m = field.mistakes[i];
        if (Math.abs(v - m.answer) <= tol) return { ok: false, say: m.say };
      }
    } else if (t === "expr") {
      return checkExpr(field, raw);
    } else if (t === "set") {
      return checkSet(field, raw);
    } else if (t === "frac") {
      return checkFrac(field, raw);
    } else if (t === "point" || t === "plot") {
      return checkPoint(field, raw);
    } else if (t === "mixed") {
      return checkMixed(field, raw);
    } else if (t === "dec") {
      return checkDec(field, raw);
    } else if (t === "rel") {
      return checkRel(field, raw);
    } else if (t === "expand") {
      return checkExpand(field, raw);
    } else if (t === "equiv") {
      return checkEquiv(field, raw);
    } else if (t === "factors") {
      return checkFactors(field, raw);
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
    if (t === "plot") {
      var R = field.range || [-5, 5, -5, 5], picked = null;
      var gsvg = Practice.figures.coord({ type: "coord", range: R });
      gsvg.classList.add("plot-grid"); gsvg.setAttribute("tabindex", "0"); gsvg.setAttribute("aria-label", "Grid. Click to place the point, or use the arrow keys.");
      var dot = svg("circle", { r: 5, class: "plot-dot", visibility: "hidden" }); gsvg.appendChild(dot);
      var readout = el("span", { class: "plot-read", text: "Click on the grid to place the point." });
      var box = el("div", { class: "plot-wrap" }, [gsvg, readout]);
      function place(x, y) {
        x = Math.max(R[0], Math.min(R[1], x)); y = Math.max(R[2], Math.min(R[3], y)); picked = [x, y];
        dot.setAttribute("cx", gsvg._X(x)); dot.setAttribute("cy", gsvg._Y(y)); dot.setAttribute("visibility", "visible");
        readout.textContent = ("Your point: (" + x + ", " + y + ")").replace(/-/g, "−"); box.dataset.state = "";
      }
      gsvg.addEventListener("click", function (e) {
        var pt = gsvg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        var q = pt.matrixTransform(gsvg.getScreenCTM().inverse());
        place(Math.round(gsvg._x(q.x)), Math.round(gsvg._y(q.y)));
      });
      gsvg.addEventListener("keydown", function (e) {
        var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        if (d) { e.preventDefault(); var c = picked || [0, 0]; place(c[0] + d[0], c[1] + d[1]); }
        else if (e.key === "Enter") { e.preventDefault(); onEnter && onEnter(); }
      });
      return { node: box, get: function () { return picked ? "(" + picked[0] + ", " + picked[1] + ")" : ""; },
        set: function (v) { var p = parsePoint(v); if (p) place(p[0], p[1]); },
        focus: function () { gsvg.focus(); }, mark: function (st) { box.dataset.state = st || ""; } };
    }
    var ph = { number: "?", angleName: "e.g. ABC", segments: "e.g. AB, AC", set: "e.g. 1, 2, 3", numeral: "e.g. 1,23,456", factors: "e.g. 2 × 2 × 3", frac: "e.g. 3/8", point: "e.g. (2, 3)", mixed: "e.g. 2 3/4", dec: "e.g. 0.25", rel: "e.g. x + 2 = 5", expand: "e.g. 0.2 + 0.05", equiv: "e.g. 2/4, 3/6, 4/8", text: "", expr: field.form === "exact" ? "" : "e.g. 3x^2 + 2y" }[t] || "";
    var inp = el("input", { id: uid, type: "text", class: "inp inp-" + t, autocomplete: "off", spellcheck: "false",
      inputmode: t === "number" || t === "dec" ? "decimal" : undefined, placeholder: ph,
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
    var R = spec.rows.length, C = spec.rows[0].length, cw = spec.cw || 56, chh = 44, cws = spec.cws || null;
    if (cws) return gridVar(spec, cws, chh);
    var s = svg("svg", { class: "fig fig-grid", viewBox: "-2 -2 " + (C * cw + 4) + " " + (R * chh + 4), role: "img", "aria-label": "Number puzzle" });
    spec.rows.forEach(function (row, r) {
      row.forEach(function (v, c) {
        var blank = String(v).charAt(0) === "?", head = !spec.plain && (r === 0 || c === 0), wall = v === "#";
        s.appendChild(svg("rect", { x: c * cw, y: r * chh, width: cw, height: chh, class: "grid-cell" + (head ? " head" : "") + (blank ? " blank" : "") + (wall ? " wall" : "") }));
        if (!wall) s.appendChild(svg("text", { x: c * cw + cw / 2, y: r * chh + chh / 2, class: blank ? "grid-q" : "grid-t" }, blank ? String(v).slice(1) : v));
      });
    });
    return s;
  };

  // Hundred grid: { type: "hgrid", cells: [[0, 7, "a"], [7, 35, "b"]], rects: [[c0, r0, c1, r1, "a"]], top: ["0.3", 0, 3], left: ["0.2", 0, 2] }
  // cells shade squares in reading order (from, to); rects shade blocks of columns c0..c1 and rows r0..r1 (tone "c" is the darker overlap).
  Practice.figures.hgrid = function (spec) {
    var n = spec.n || 10, u = 20, W = n * u, ox = spec.left ? 44 : 4, oy = spec.top ? 30 : 4;
    var s = svg("svg", { class: "fig fig-hgrid", viewBox: "0 0 " + (W + ox + 6) + " " + (W + oy + 6), role: "img", "aria-label": "Hundred square grid" });
    s.style.maxWidth = spec.small ? "140px" : "260px";
    var g = svg("g", { transform: "translate(" + ox + " " + oy + ")" });
    (spec.cells || []).forEach(function (r) { for (var i = r[0]; i < r[1]; i++) g.appendChild(svg("rect", { x: (i % n) * u, y: Math.floor(i / n) * u, width: u, height: u, class: "shade tone-" + (r[2] || "a") })); });
    (spec.rects || []).forEach(function (r) { g.appendChild(svg("rect", { x: r[0] * u, y: r[1] * u, width: (r[2] - r[0]) * u, height: (r[3] - r[1]) * u, class: "shade tone-" + (r[4] || "a") })); });
    for (var i = 1; i < n; i++) {
      g.appendChild(svg("line", { x1: i * u, y1: 0, x2: i * u, y2: W, class: "hg-line" }));
      g.appendChild(svg("line", { x1: 0, y1: i * u, x2: W, y2: i * u, class: "hg-line" }));
    }
    g.appendChild(svg("rect", { x: 0, y: 0, width: W, height: W, class: "fb-box" }));
    if (spec.top) { var a = spec.top[1] * u, b = spec.top[2] * u; g.appendChild(svg("path", { d: "M" + a + " -4 v-8 H" + b + " v8", class: "hg-brace" })); g.appendChild(svg("text", { x: (a + b) / 2, y: -17, class: "hg-lbl" }, spec.top[0])); }
    if (spec.left) { var c = spec.left[1] * u, d = spec.left[2] * u; g.appendChild(svg("path", { d: "M-4 " + c + " h-8 V" + d + " h8", class: "hg-brace" })); g.appendChild(svg("text", { x: -16, y: (c + d) / 2, class: "hg-lbl end" }, spec.left[0])); }
    s.appendChild(g);
    return s;
  };

  // Arrow puzzle: { type: "flow", nodes: { s: [0, 0, "0.6"], a: [1, 0, "?a"] }, arrows: [["s", "a", "÷ 2"]] }
  // Nodes sit on a grid (column, row); "?x" is an empty circle labelled x.
  Practice.figures.flow = function (spec) {
    var DX = 112, DY = 92, R = 25, maxc = 0, maxr = 0, P = {};
    Object.keys(spec.nodes).forEach(function (k) { var v = spec.nodes[k]; P[k] = [v[0] * DX, v[1] * DY]; maxc = Math.max(maxc, v[0]); maxr = Math.max(maxr, v[1]); });
    var s = svg("svg", { class: "fig fig-flow", viewBox: (-R - 30) + " " + (-R - 8) + " " + (maxc * DX + 2 * R + 40) + " " + (maxr * DY + 2 * R + 16), role: "img", "aria-label": "Arrow puzzle" });
    (spec.arrows || []).forEach(function (a) {
      var p = P[a[0]], q = P[a[1]], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var x1 = p[0] + ux * (R + 3), y1 = p[1] + uy * (R + 3), x2 = q[0] - ux * (R + 4), y2 = q[1] - uy * (R + 4);
      s.appendChild(svg("line", { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), class: "flow-line" }));
      s.appendChild(svg("path", { d: "M" + f(x2) + " " + f(y2) + " l" + f(-ux * 9 - uy * 5) + " " + f(-uy * 9 + ux * 5) + " M" + f(x2) + " " + f(y2) + " l" + f(-ux * 9 + uy * 5) + " " + f(-uy * 9 - ux * 5), class: "flow-line" }));
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      s.appendChild(svg("text", { x: f(dy ? mx + 8 : mx), y: f(dy ? my : my - 9), class: "flow-op" + (dy ? " side" : "") }, a[2]));
    });
    Object.keys(spec.nodes).forEach(function (k) {
      var v = String(spec.nodes[k][2]), blank = v.charAt(0) === "?";
      s.appendChild(svg("circle", { cx: P[k][0], cy: P[k][1], r: R, class: "tree-node" + (blank ? " blank" : "") }));
      s.appendChild(svg("text", { x: P[k][0], y: P[k][1], class: blank ? "grid-q" : "grid-t" }, blank ? v.slice(1) : v));
    });
    return s;
  };

  // grid with its own width for each column: cws: [110, 70, 70]
  function gridVar(spec, cws, chh) {
    var W = cws.reduce(function (a, b) { return a + b; }, 0), R = spec.rows.length, xs = [0];
    cws.forEach(function (w, i) { xs.push(xs[i] + w); });
    var s = svg("svg", { class: "fig fig-grid", viewBox: "-2 -2 " + (W + 4) + " " + (R * chh + 4), role: "img", "aria-label": "Table" });
    s.style.maxWidth = Math.min(W * 1.15, 640) + "px";
    spec.rows.forEach(function (row, r) {
      row.forEach(function (v, c) {
        var blank = String(v).charAt(0) === "?", head = !spec.plain && (r === 0 || (c === 0 && !spec.noHeadCol));
        s.appendChild(svg("rect", { x: xs[c], y: r * chh, width: cws[c], height: chh, class: "grid-cell" + (head ? " head" : "") + (blank ? " blank" : "") }));
        s.appendChild(svg("text", { x: xs[c] + cws[c] / 2, y: r * chh + chh / 2, class: (blank ? "grid-q" : "grid-t") + (String(v).length > 7 ? " small" : "") }, blank ? String(v).slice(1) : v));
      });
    });
    return s;
  }

  // Bar chart: { type: "bars", max: 100, step: 10, unit: "%", bars: [["Orange", 90, "a"], ["Potato", 70, "b"]], ylabel: "Water content", xlabel: "Fruits", values: false }
  Practice.figures.bars = function (spec) {
    var n = spec.bars.length, H = 220, BW = 46, GAP = 30, ox = 58, max = spec.max || 100, step = spec.step || 10, W = n * (BW + GAP) + GAP;
    var s = svg("svg", { class: "fig fig-bars", viewBox: "0 0 " + (ox + W + 10) + " " + (H + 70), role: "img", "aria-label": "Bar graph" });
    s.style.maxWidth = "520px";
    var Y = function (v) { return 14 + H - v / max * H; };
    for (var v = 0; v <= max; v += step) {
      s.appendChild(svg("line", { x1: ox, y1: f(Y(v)), x2: ox + W, y2: f(Y(v)), class: "bar-grid" + (v === 0 ? " base" : "") }));
      s.appendChild(svg("text", { x: ox - 6, y: f(Y(v)), class: "bar-num" }, v + (spec.unit || "")));
    }
    spec.bars.forEach(function (b, i) {
      var x = ox + GAP + i * (BW + GAP);
      s.appendChild(svg("rect", { x: x, y: f(Y(b[1])), width: BW, height: f(H - (Y(b[1]) - 14)), class: "shade tone-" + (b[2] || "a") + " bar" }));
      s.appendChild(svg("text", { x: x + BW / 2, y: H + 30, class: "bar-lbl" }, b[0]));
      if (spec.values) s.appendChild(svg("text", { x: x + BW / 2, y: f(Y(b[1]) - 8), class: "bar-lbl" }, b[1] + (spec.unit || "")));
    });
    if (spec.xlabel) s.appendChild(svg("text", { x: ox + W / 2, y: H + 54, class: "bar-lbl strong" }, spec.xlabel));
    if (spec.ylabel) s.appendChild(svg("text", { x: 12, y: 14 + H / 2, class: "bar-lbl strong", transform: "rotate(-90 12 " + (14 + H / 2) + ")" }, spec.ylabel));
    return s;
  };

  // Plane shapes drawn to scale (units, y goes down):
  // { type: "shape", polys: [{ pts: [[0,0],[7,0],[7,4],[0,4]], tone: "a" | "w" | null, dash: false, open: false }],
  //   sides: [["7 cm", 0, 0, { in: false }]], text: [[x, y, "A"]], dashes: [[x1, y1, x2, y2]], grid: [w, h], circles: [[cx, cy, r]], ellipses: [[cx, cy, rx, ry]], right: [[x, y, "tl"]] }
  Practice.figures.shape = function (spec) {
    var polys = (spec.polys || []).map(function (p) { return Array.isArray(p) ? { pts: p } : p; });
    var xs = [], ys = [];
    polys.forEach(function (p) { p.pts.forEach(function (q) { xs.push(q[0]); ys.push(q[1]); }); });
    (spec.circles || []).forEach(function (c) { xs.push(c[0] - c[2], c[0] + c[2]); ys.push(c[1] - c[2], c[1] + c[2]); });
    (spec.ellipses || []).forEach(function (c) { xs.push(c[0] - c[2], c[0] + c[2]); ys.push(c[1] - c[3], c[1] + c[3]); });
    if (spec.grid) { xs.push(0, spec.grid[0]); ys.push(0, spec.grid[1]); }
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var u = spec.u || Math.min(44, 280 / Math.max(x1 - x0, 0.1), 200 / Math.max(y1 - y0, 0.1)), P = spec.grid ? 8 : 46;
    var X = function (v) { return f((v - x0) * u + P); }, Y = function (v) { return f((v - y0) * u + P); };
    var W = (x1 - x0) * u + 2 * P, H = (y1 - y0) * u + 2 * P;
    var s = svg("svg", { class: "fig fig-shape", viewBox: "0 0 " + f(W) + " " + f(H), role: "img", "aria-label": spec.label || "Shape" });
    s.style.maxWidth = Math.round(Math.min(W * 1.25, 460)) + "px";
    if (spec.grid) {
      for (var gx = 0; gx <= spec.grid[0]; gx++) s.appendChild(svg("line", { x1: X(gx), y1: Y(0), x2: X(gx), y2: Y(spec.grid[1]), class: "shp-grid" }));
      for (var gy = 0; gy <= spec.grid[1]; gy++) s.appendChild(svg("line", { x1: X(0), y1: Y(gy), x2: X(spec.grid[0]), y2: Y(gy), class: "shp-grid" }));
    }
    function d(p) { return p.pts.map(function (q, i) { return (i ? "L" : "M") + X(q[0]) + " " + Y(q[1]); }).join(" ") + (p.open ? "" : " Z"); }
    polys.forEach(function (p) {
      s.appendChild(svg("path", { d: d(p), class: "shp" + (p.tone === "w" ? " hole" : p.tone ? " tone-" + p.tone : " plain") + (p.dash ? " dash" : "") + (p.open ? " open" : "") }));
    });
    (spec.circles || []).forEach(function (c) { s.appendChild(svg("circle", { cx: X(c[0]), cy: Y(c[1]), r: f(c[2] * u), class: "shp plain" })); });
    (spec.ellipses || []).forEach(function (c) { s.appendChild(svg("ellipse", { cx: X(c[0]), cy: Y(c[1]), rx: f(c[2] * u), ry: f(c[3] * u), class: "shp plain" })); });
    (spec.dashes || []).forEach(function (l) { s.appendChild(svg("line", { x1: X(l[0]), y1: Y(l[1]), x2: X(l[2]), y2: Y(l[3]), class: "shp-dash" })); });
    (spec.right || []).forEach(function (r) { // square corner mark at a point; r[2] like "tl" says which way the corner opens
      var k = 9, sx = r[2].indexOf("l") >= 0 ? 1 : -1, sy = r[2].indexOf("t") >= 0 ? 1 : -1, px = X(r[0]), py = Y(r[1]);
      s.appendChild(svg("path", { d: "M" + (px + sx * k) + " " + py + " V" + (py + sy * k) + " H" + px, class: "shp-right" }));
    });
    function inside(pts, x, y) {
      var c = false;
      for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        var a = pts[i], b = pts[j];
        if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
      }
      return c;
    }
    (spec.sides || []).forEach(function (sd) {
      var p = polys[sd[1]].pts, a = p[sd[2]], b = p[(sd[2] + 1) % p.length], o = sd[3] || {};
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), nx = dy / L, ny = -dx / L, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if (inside(p, mx + nx * 0.01, my + ny * 0.01) !== !!o.in) { nx = -nx; ny = -ny; }
      var off = o.off || 12, tx = X(mx) + nx * off, ty = Y(my) + ny * off, anchor = Math.abs(nx) > 0.35 ? (nx > 0 ? "start" : "end") : "middle";
      if (o.at) { tx = X(o.at[0]); ty = Y(o.at[1]); anchor = "middle"; }
      s.appendChild(svg("text", { x: f(tx), y: f(ty), class: "shp-t", "text-anchor": anchor }, sd[0]));
    });
    (spec.ticks || []).forEach(function (t) { // [polyIndex, edgeIndex, count]
      var p = polys[t[0]].pts, a = p[t[1]], b = p[(t[1] + 1) % p.length], dx = X(b[0]) - X(a[0]), dy = Y(b[1]) - Y(a[1]), L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      for (var i = 0; i < (t[2] || 1); i++) {
        var o = (i - ((t[2] || 1) - 1) / 2) * 5, cx = (X(a[0]) + X(b[0])) / 2 + ux * o, cy = (Y(a[1]) + Y(b[1])) / 2 + uy * o;
        s.appendChild(svg("line", { x1: f(cx - uy * 6), y1: f(cy + ux * 6), x2: f(cx + uy * 6), y2: f(cy - ux * 6), class: "shp-tick" }));
      }
    });
    (spec.text || []).forEach(function (t) { s.appendChild(svg("text", { x: X(t[0]), y: Y(t[1]), class: "shp-t" + (t[3] ? " " + t[3] : ""), "text-anchor": "middle" }, t[2])); });
    return s;
  };

  // Solids: { type: "solid", kind: "cuboid" | "cube" | "cylinder" | "cone" | "sphere", l: 4, b: 3, h: 2, labels: { l: "4 cm", b: "3 cm", h: "2 cm" } }
  Practice.figures.solid = function (spec) {
    var k = spec.kind, lab = spec.labels || {}, s = svg("svg", { class: "fig fig-solid", role: "img", "aria-label": k });
    var g = svg("g", {}), box;
    function line(a, b, dash) { g.appendChild(svg("line", { x1: f(a[0]), y1: f(a[1]), x2: f(b[0]), y2: f(b[1]), class: "sol" + (dash ? " hidden" : "") })); }
    function txt(x, y, t, anchor) { if (t) g.appendChild(svg("text", { x: f(x), y: f(y), class: "shp-t", "text-anchor": anchor || "middle" }, t)); }
    if (k === "cuboid" || k === "cube") {
      var l = spec.l || 3, b = spec.b || (k === "cube" ? l : 2), h = spec.h || (k === "cube" ? l : 2);
      var u = Math.min(150 / (l + b * 0.6), 150 / (h + b * 0.45), 40), L = l * u, B = b * u * 0.55, Hh = h * u, dx = B * 0.82, dy = -B * 0.57;
      var A = [0, 0], Bp = [L, 0], C = [L, -Hh], D = [0, -Hh], A2 = [dx, dy], B2 = [L + dx, dy], C2 = [L + dx, dy - Hh], D2 = [dx, dy - Hh];
      g.appendChild(svg("path", { d: "M" + [A, Bp, B2, C2, D2, D].map(function (p) { return f(p[0]) + " " + f(p[1]); }).join(" L") + " Z", class: "sol-face" }));
      line(A2, B2, true); line(A2, D2, true); line(A, A2, true);
      line(A, Bp); line(Bp, C); line(C, D); line(D, A); line(Bp, B2); line(B2, C2); line(C2, D2); line(D2, D); line(C, C2);
      txt(L / 2, 18, lab.l); txt(L + dx / 2 + 6, dy / 2 + 8, lab.b, "start"); txt(L + dx + 6, dy - Hh / 2 + 4, lab.h, "start");
      box = [-10, dy - Hh - 10, L + dx + 70, Hh - dy + 40];
    } else if (k === "cylinder") {
      var r = 40, hh = 90;
      g.appendChild(svg("path", { d: "M" + -r + " 0 V" + hh + " A" + r + " 12 0 0 0 " + r + " " + hh + " V0", class: "sol-face" }));
      g.appendChild(svg("ellipse", { cx: 0, cy: 0, rx: r, ry: 12, class: "sol-face" }));
      g.appendChild(svg("path", { d: "M" + -r + " " + hh + " A" + r + " 12 0 0 1 " + r + " " + hh, class: "sol hidden" }));
      box = [-r - 10, -22, 2 * r + 20, hh + 36];
    } else if (k === "cone") {
      var rc = 42, hc = 90;
      g.appendChild(svg("path", { d: "M" + -rc + " 0 L0 " + hc + " L" + rc + " 0 Z", class: "sol-face" }));
      g.appendChild(svg("ellipse", { cx: 0, cy: 0, rx: rc, ry: 12, class: "sol-face" }));
      box = [-rc - 10, -22, 2 * rc + 20, hc + 32];
    } else {
      g.appendChild(svg("circle", { cx: 0, cy: 0, r: 48, class: "sol-face sphere" }));
      g.appendChild(svg("path", { d: "M-48 0 A48 13 0 0 0 48 0", class: "sol" }));
      g.appendChild(svg("path", { d: "M-48 0 A48 13 0 0 1 48 0", class: "sol hidden" }));
      box = [-58, -58, 116, 116];
    }
    s.setAttribute("viewBox", box.map(f).join(" "));
    s.style.maxWidth = Math.round(box[2] * 1.3) + "px";
    s.appendChild(g);
    return s;
  };

  // Balance: { type: "balance", left: { bags: 2, v: "x", balls: 0 }, right: { bags: 1, v: "x", balls: 4 } }
  Practice.figures.balance = function (spec) {
    var s = svg("svg", { class: "fig fig-balance", viewBox: "0 0 360 170", role: "img", "aria-label": "Balance" });
    s.style.maxWidth = "380px";
    s.appendChild(svg("path", { d: "M180 96 L166 150 H194 Z", class: "bal-stand" }));
    s.appendChild(svg("rect", { x: 140, y: 150, width: 80, height: 8, rx: 3, class: "bal-stand" }));
    s.appendChild(svg("rect", { x: 30, y: 92, width: 300, height: 7, rx: 3, class: "bal-stand" }));
    function pan(cx, side) {
      s.appendChild(svg("ellipse", { cx: cx, cy: 88, rx: 74, ry: 8, class: "bal-pan" }));
      var n = side.bags || 0, k = side.balls || 0, BW = 26, gap = 3, total = n * (BW + gap) + (k ? Math.ceil(k / 2) * 15 + 4 : 0), x = cx - total / 2;
      for (var i = 0; i < n; i++) {
        var bx = x + i * (BW + gap) + BW / 2;
        s.appendChild(svg("path", { d: "M" + (bx - 6) + " 48 l4 6 h4 l4 -6 M" + (bx - 4) + " 56 C" + (bx - 16) + " 62 " + (bx - 15) + " 84 " + bx + " 84 C" + (bx + 15) + " 84 " + (bx + 16) + " 62 " + (bx + 4) + " 56 Z", class: "bal-bag" }));
        s.appendChild(svg("text", { x: bx, y: 72, class: "bal-v" }, side.v || "x"));
      }
      var bx0 = x + n * (BW + gap) + 6;
      for (var j = 0; j < k; j++) s.appendChild(svg("circle", { cx: bx0 + Math.floor(j / 2) * 15, cy: j % 2 ? 66 : 79, r: 6.5, class: "bal-ball" }));
    }
    pan(92, spec.left); pan(268, spec.right);
    return s;
  };

  // Factor tree: { type: "ftree", root: { v: "18", kids: [{ v: "2" }, { v: "?a", kids: [{ v: "?b" }, { v: "3" }] }] } }
  Practice.figures.ftree = function (spec) {
    var R = 17, DX = 46, DY = 58, leaves = 0, depth = 0, nodes = [];
    (function lay(n, d) {
      depth = Math.max(depth, d);
      if (!n.kids || !n.kids.length) { n.x = leaves++ * DX; }
      else { n.kids.forEach(function (k) { lay(k, d + 1); }); n.x = (n.kids[0].x + n.kids[n.kids.length - 1].x) / 2; }
      n.y = d * DY; nodes.push(n);
    })(spec.root, 0);
    var W = (leaves - 1) * DX + 2 * R + 8, H = depth * DY + 2 * R + 8;
    var s = svg("svg", { class: "fig fig-ftree", viewBox: f(-R - 4) + " " + f(-R - 4) + " " + f(W) + " " + f(H), role: "img", "aria-label": "Factor tree" });
    nodes.forEach(function (n) {
      (n.kids || []).forEach(function (k, i) {
        s.appendChild(svg("line", { x1: n.x, y1: n.y + R, x2: k.x, y2: k.y - R, class: "tree-line" }));
        if (i > 0) s.appendChild(svg("text", { x: f((n.kids[i - 1].x + k.x) / 2), y: k.y, class: "tree-x" }, "×"));
      });
    });
    nodes.forEach(function (n) {
      var blank = String(n.v).charAt(0) === "?";
      s.appendChild(svg("circle", { cx: n.x, cy: n.y, r: R, class: "tree-node" + (blank ? " blank" : "") }));
      s.appendChild(svg("text", { x: n.x, y: n.y, class: blank ? "grid-q" : "grid-t" }, blank ? String(n.v).slice(1) : n.v));
    });
    return s;
  };

  // Number line with hops: { type: "nline", from: -10, to: 10, hops: [[0, 3], [3, 6]], big: [0, 6], dots: [6] }
  Practice.figures.nline = function (spec) {
    var a = spec.from == null ? -10 : spec.from, b = spec.to == null ? 10 : spec.to, U = 22, W = (b - a) * U, Y = 70;
    var X = function (v) { return (v - a) * U; };
    var s = svg("svg", { class: "fig fig-nline", viewBox: "-24 " + (spec.range ? 30 : 0) + " " + (W + 48) + " " + (spec.range ? 74 : 104), role: "img", "aria-label": "Number line" });
    s.appendChild(svg("line", { x1: -16, y1: Y, x2: W + 16, y2: Y, class: "nl-axis" }));
    s.appendChild(svg("path", { d: "M" + (W + 18) + " " + Y + " l-8 -5 v10 z M-18 " + Y + " l8 -5 v10 z", class: "nl-head" }));
    for (var v = a; v <= b; v++) {
      s.appendChild(svg("line", { x1: X(v), y1: Y - 5, x2: X(v), y2: Y + 5, class: "nl-tick" }));
      s.appendChild(svg("text", { x: X(v), y: Y + 18, class: "nl-num" + (v === 0 ? " zero" : "") }, String(v)));
    }
    function hop(p, q, big) {
      var x1 = X(p), x2 = X(q), d = Math.abs(x2 - x1), h = big ? Math.min(58, 18 + d * 0.2) : Math.min(44, 10 + d * 0.18), mx = (x1 + x2) / 2, cls = "nl-hop" + (big ? " big" : "");
      s.appendChild(svg("path", { d: "M" + x1 + " " + (Y - 4) + " Q" + mx + " " + (Y - 4 - 2 * h) + " " + x2 + " " + (Y - 4), class: cls }));
      var ang = Math.atan2(2 * h, x2 - mx), L = 8, head = "";
      [0.45, -0.45].forEach(function (t) { head += "M" + x2 + " " + (Y - 4) + " l" + f(-L * Math.cos(ang + t)) + " " + f(-L * Math.sin(ang + t)) + " "; });
      s.appendChild(svg("path", { d: head, class: cls + " nl-arrow" }));
    }
    (spec.hops || []).forEach(function (h) { hop(h[0], h[1], false); });
    if (spec.big) hop(spec.big[0], spec.big[1], true);
    (spec.dots || []).forEach(function (d) { s.appendChild(svg("circle", { cx: X(d), cy: Y, r: 4, class: "nl-dot" })); });
    if (spec.range) { // [lo, hi, loClosed, hiClosed]; null end = arrow to that side
      var r = spec.range, RY = Y - 22, x1 = r[0] == null ? -16 : X(r[0]), x2 = r[1] == null ? W + 16 : X(r[1]);
      s.appendChild(svg("path", { d: "M" + x1 + " " + (r[0] == null ? RY : Y) + (r[0] == null ? "" : " V" + RY) + " H" + x2 + (r[1] == null ? "" : " V" + Y), class: "nl-range" }));
      if (r[0] == null) s.appendChild(svg("path", { d: "M" + (x1 - 2) + " " + RY + " l9 -5 v10 z", class: "nl-rhead" }));
      if (r[1] == null) s.appendChild(svg("path", { d: "M" + (x2 + 2) + " " + RY + " l-9 -5 v10 z", class: "nl-rhead" }));
      [[r[0], r[2]], [r[1], r[3]]].forEach(function (e) { if (e[0] != null) s.appendChild(svg("circle", { cx: X(e[0]), cy: Y, r: 5.5, class: "nl-end" + (e[1] ? " closed" : "") })); });
    }
    return s;
  };

  // Fraction bar: { type: "fbar", parts: 8, shade: [[0, 3, "a"], [3, 5, "b"]], label: "3/8", count: 1 }
  // shade runs from part index to part index; with count > 1 the bars are stacked and the indexes run on across them.
  function clip(r, i, n) { var a = Math.max(r[0], i * n) - i * n, b = Math.min(r[1], (i + 1) * n) - i * n; return b > a ? [a, b] : null; }
  Practice.figures.fbar = function (spec) {
    var n = spec.parts, k = spec.count || 1, W = 300, H = 56, G = 12, w = W / n, TH = k * H + (k - 1) * G;
    var s = svg("svg", { class: "fig fig-fbar", viewBox: "-4 -4 " + (W + 8) + " " + (TH + (spec.label ? 30 : 8)), role: "img", "aria-label": "Fraction bar" });
    for (var j = 0; j < k; j++) {
      var y = j * (H + G);
      (spec.shade || []).forEach(function (r) {
        var c = clip(r, j, n); if (!c) return;
        s.appendChild(svg("rect", { x: f(c[0] * w), y: y, width: f((c[1] - c[0]) * w), height: H, class: "shade tone-" + (r[2] === "x" ? "a" : r[2] || "a") }));
        if (r[2] === "x") for (var q = c[0]; q < c[1]; q++) {  // crossed-out parts
          s.appendChild(svg("line", { x1: f(q * w + 6), y1: y + 6, x2: f((q + 1) * w - 6), y2: y + H - 6, class: "fb-x" }));
          s.appendChild(svg("line", { x1: f((q + 1) * w - 6), y1: y + 6, x2: f(q * w + 6), y2: y + H - 6, class: "fb-x" }));
        }
      });
      for (var i = 1; i < n; i++) s.appendChild(svg("line", { x1: f(i * w), y1: y, x2: f(i * w), y2: y + H, class: "fb-line" }));
      s.appendChild(svg("rect", { x: 0, y: y, width: W, height: H, class: "fb-box" }));
    }
    if (spec.label) s.appendChild(svg("text", { x: W / 2, y: TH + 18, class: "venn-item" }, spec.label));
    return s;
  };
  // Pie: { type: "pie", parts: 6, shade: [[0, 1, "a"]], label: "1/6", count: 1 }  (count > 1 draws circles side by side)
  Practice.figures.pie = function (spec) {
    var n = spec.parts, k = spec.count || 1, R = 60, D = 140, s = svg("svg", { class: "fig fig-pie", viewBox: "-66 -66 " + (132 + (k - 1) * D) + " " + (132 + (spec.label ? 24 : 0)), role: "img", "aria-label": "Fraction circle" });
    if (k > 1) s.style.maxWidth = Math.min(150 * k, 520) + "px";
    for (var j = 0; j < k; j++) {
      var g = svg("g", { transform: "translate(" + j * D + " 0)" });
      var P = function (q) { var a = (90 - q * 360 / n) * Math.PI / 180; return [f(R * Math.cos(a)), f(-R * Math.sin(a))]; };
      (spec.shade || []).forEach(function (r0) {
        var r = clip(r0, j, n); if (!r) return;
        var a = P(r[0]), b = P(r[1]), big = (r[1] - r[0]) / n > 0.5 ? 1 : 0;
        g.appendChild(svg("path", { d: (r[1] - r[0]) >= n ? "M0 -60 A60 60 0 1 1 0 60 A60 60 0 1 1 0 -60" : "M0 0 L" + a[0] + " " + a[1] + " A" + R + " " + R + " 0 " + big + " 1 " + b[0] + " " + b[1] + " Z", class: "shade tone-" + (r0[2] || "a") }));
      });
      g.appendChild(svg("circle", { cx: 0, cy: 0, r: R, class: "fb-box" }));
      if (n > 1) for (var i = 0; i < n; i++) { var p = P(i); g.appendChild(svg("line", { x1: 0, y1: 0, x2: p[0], y2: p[1], class: "fb-line" })); }
      s.appendChild(g);
    }
    if (spec.label) s.appendChild(svg("text", { x: (k - 1) * D / 2, y: 78, class: "venn-item" }, spec.label));
    return s;
  };

  // Coordinate grid: { type: "coord", range: [-5, 5, -5, 5], points: { A: [2, 3] }, polys: [["P", "Q", "R", "S"]], open: [["E", "F"]] }
  // polys are closed shapes joined in order; open are paths that are not closed. Points named with "_" are not labelled.
  Practice.figures.coord = function (spec) {
    var R = spec.range || [-5, 5, -5, 5], nx = R[1] - R[0], ny = R[3] - R[2], u = Math.min(30, 320 / Math.max(nx, ny)), P = 22;
    var W = nx * u, H = ny * u, s = svg("svg", { class: "fig fig-coord", viewBox: (-P) + " " + (-P) + " " + (W + 2 * P) + " " + (H + 2 * P), role: "img", "aria-label": "Coordinate grid" });
    function X(x) { return f((x - R[0]) * u); } function Y(y) { return f((R[3] - y) * u); }
    s._X = X; s._Y = Y; s._x = function (px) { return px / u + R[0]; }; s._y = function (py) { return R[3] - py / u; };
    s.appendChild(svg("rect", { x: -P, y: -P, width: W + 2 * P, height: H + 2 * P, fill: "transparent" }));
    for (var x = R[0]; x <= R[1]; x++) s.appendChild(svg("line", { x1: X(x), y1: 0, x2: X(x), y2: H, class: "coord-grid" }));
    for (var y = R[2]; y <= R[3]; y++) s.appendChild(svg("line", { x1: 0, y1: Y(y), x2: W, y2: Y(y), class: "coord-grid" }));
    var step = u < 18 ? 2 : 1;
    if (R[2] <= 0 && R[3] >= 0) {
      s.appendChild(svg("line", { x1: -8, y1: Y(0), x2: W + 8, y2: Y(0), class: "coord-axis" }));
      for (x = R[0]; x <= R[1]; x++) if (x && x % step === 0) s.appendChild(svg("text", { x: X(x), y: f(+Y(0) + 11), class: "coord-num" }, String(x).replace("-", "−")));
      s.appendChild(svg("text", { x: W + 13, y: Y(0), class: "coord-name" }, "X")); s.appendChild(svg("text", { x: -14, y: Y(0), class: "coord-name" }, "X'"));
    }
    if (R[0] <= 0 && R[1] >= 0) {
      s.appendChild(svg("line", { x1: X(0), y1: -8, x2: X(0), y2: H + 8, class: "coord-axis" }));
      for (y = R[2]; y <= R[3]; y++) if (y && y % step === 0) s.appendChild(svg("text", { x: f(+X(0) - 9), y: Y(y), class: "coord-num" }, String(y).replace("-", "−")));
      s.appendChild(svg("text", { x: X(0), y: -14, class: "coord-name" }, "Y")); s.appendChild(svg("text", { x: X(0), y: H + 14, class: "coord-name" }, "Y'"));
      if (R[2] <= 0 && R[3] >= 0) s.appendChild(svg("text", { x: f(+X(0) - 8), y: f(+Y(0) + 11), class: "coord-num" }, "O"));
    }
    var pts = spec.points || {};
    function path(names, closed) {
      var d = names.map(function (n, i) { return (i ? "L" : "M") + X(pts[n][0]) + " " + Y(pts[n][1]); }).join(" ") + (closed ? " Z" : "");
      s.appendChild(svg("path", { d: d, class: "coord-shape" }));
    }
    (spec.polys || []).forEach(function (p) { path(p, true); });
    (spec.open || []).forEach(function (p) { path(p, false); s.lastChild.setAttribute("class", "coord-shape coord-open"); });
    Object.keys(pts).forEach(function (n) {
      var p = pts[n];
      s.appendChild(svg("circle", { cx: X(p[0]), cy: Y(p[1]), r: 3.5, class: "coord-pt" }));
      if (n.charAt(0) !== "_") s.appendChild(svg("text", { x: f(+X(p[0]) + 8), y: f(+Y(p[1]) - 8), class: "coord-lbl" }, n));
    });
    return s;
  };
  // Kinds of lines: { type: "lk", kind: "ray" | "line" | "segment" | "curve", a: "A", b: "B" }
  Practice.figures.lk = function (spec) {
    var s = svg("svg", { class: "fig fig-lk", viewBox: "0 0 160 70", role: "img", "aria-label": "A line" }), k = spec.kind;
    var x1 = 25, y1 = 50, x2 = 135, y2 = 22;
    if (k === "curve") s.appendChild(svg("path", { d: "M25 55 C 50 0, 110 0, 135 55", class: "lk-line" }));
    else s.appendChild(svg("line", { x1: x1, y1: y1, x2: x2, y2: y2, class: "lk-line" }));
    function head(x, y, dx, dy) { var L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; s.appendChild(svg("path", { d: "M" + f(x) + " " + f(y) + " L" + f(x - 9 * ux - 5 * uy) + " " + f(y - 9 * uy + 5 * ux) + " L" + f(x - 9 * ux + 5 * uy) + " " + f(y - 9 * uy - 5 * ux) + " Z", class: "lk-head" })); }
    if (k === "ray" || k === "line") head(x2, y2, x2 - x1, y2 - y1);
    if (k === "line") head(x1, y1, x1 - x2, y1 - y2);
    if (k === "ray" || k === "segment") s.appendChild(svg("circle", { cx: x1, cy: y1, r: 3.5, class: "lk-dot" }));
    if (k === "segment") s.appendChild(svg("circle", { cx: x2, cy: y2, r: 3.5, class: "lk-dot" }));
    s.appendChild(svg("text", { x: k === "curve" ? 25 : x1 - 6, y: k === "curve" ? 68 : y1 + 15, class: "coord-lbl" }, spec.a));
    s.appendChild(svg("text", { x: k === "curve" ? 135 : x2 + 6, y: k === "curve" ? 68 : y2 - 8, class: "coord-lbl" }, spec.b));
    return s;
  };
  // Row of small figures with signs between: { type: "row", items: [{ type: "fbar", ... }, "+", { type: "pie", ... }, "=", ...], caption?: ["1/2", "", "1/3"] }
  Practice.figures.row = function (spec) {
    var d = document.createElement("div"); d.className = "fig-row";
    spec.items.forEach(function (it) {
      if (typeof it === "string") { var o = document.createElement("span"); o.className = "fig-op"; o.textContent = it; d.appendChild(o); return; }
      var cell = document.createElement("span"); cell.className = "fig-cell";
      var f = renderFigure(it); if (f) cell.appendChild(f);
      if (it.caption) { var c = document.createElement("span"); c.className = "fig-cap"; c.textContent = it.caption; cell.appendChild(c); }
      d.appendChild(cell);
    });
    return d;
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
          var shownAns = step.ask.type === "factors" ? Practice.nt.pfStr(step.ask.answer) : step.ask.type === "set" ? step.ask.answer.join(", ") : Array.isArray(step.ask.answer) ? step.ask.answer[0] : step.ask.answer;
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
