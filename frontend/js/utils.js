/* ============================================================================
 * utils.js - small shared helpers (DOM, strings, arrays) used app-wide.
 * ==========================================================================*/
var $ = function (s) { return document.querySelector(s); };

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function sample(a, n) { return shuffle(a).slice(0, n); }

/* answer normalisation for the "type the answer" exercises */
function norm(s) {
  return String(s).toLowerCase()
    .replace(/[.!?,;:']/g, '').replace(/\s+/g, ' ').trim();
}
function normTight(s) { return norm(s).replace(/[\s-]/g, ''); }
