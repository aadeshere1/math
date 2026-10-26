/*
  Shared helpers for the Angle Quest pages (used by the science engine).
  Small and dependency-free: building HTML and SVG, saving progress, text formatting,
  shuffling and reading text aloud. The maths engine keeps its own copies and does not load this file.
*/
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null && v !== false) n.setAttribute(k, v);
    }
    add(n, kids);
    return n;
  }
  function svg(tag, attrs, kids) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (k === "text") n.textContent = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null && v !== false) n.setAttribute(k, v);
    }
    add(n, kids);
    return n;
  }
  function add(n, kids) {
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return n;
  }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // **bold** and new lines
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); }
  function plain(s) { return String(s).replace(/\*\*/g, ""); }
  // Seeded shuffle, so a question looks the same each time it is opened.
  function shuffle(list, seed) {
    var a = list.slice(), h = 2166136261;
    String(seed || "x").split("").forEach(function (c) { h = Math.imul(h ^ c.charCodeAt(0), 16777619); });
    for (var i = a.length - 1; i > 0; i--) {
      h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
      var j = (h >>> 0) % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function f(n) { return Math.round(n * 10) / 10; }

  // Read text aloud, slowly, with the browser's own voice (works offline on most phones).
  var canSpeak = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  function speak(text, opts) {
    if (!canSpeak) return false;
    opts = opts || {};
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(plain(text));
      u.rate = opts.rate || 0.85; u.lang = opts.lang || "en-IN";
      var voices = window.speechSynthesis.getVoices() || [];
      var v = voices.filter(function (x) { return x.lang === u.lang; })[0] || voices.filter(function (x) { return /^en/.test(x.lang); })[0];
      if (v) u.voice = v;
      if (opts.onend) u.onend = opts.onend;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
  function stopSpeaking() { if (canSpeak) try { window.speechSynthesis.cancel(); } catch (e) {} }

  var reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.Shared = { el: el, svg: svg, add: add, store: store, esc: esc, fmt: fmt, plain: plain, shuffle: shuffle, f: f,
    speak: speak, stopSpeaking: stopSpeaking, canSpeak: canSpeak, reduceMotion: reduceMotion };
})();
