/* ============================================================================
 * lingua.js - pure, dependency-free Finnish language helpers.
 *
 * This file is shared by the browser frontend (loaded as a classic <script>,
 * exposing globals) AND by the Node build scripts (loaded via require()).
 * Keep it free of DOM / browser APIs so both environments can use it.
 * ==========================================================================*/
(function (root) {
  'use strict';

  /* ---- numbers 0…millions → Finnish words --------------------------------*/
  var U = ['nolla', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi',
           'seitsemän', 'kahdeksan', 'yhdeksän'];

  function numFi(n) {
    n = Math.floor(n);
    if (n < 0) return 'miinus ' + numFi(-n);
    if (n < 10) return U[n];
    if (n === 10) return 'kymmenen';
    if (n < 20) return U[n - 10] + 'toista';
    if (n < 100) { var t = Math.floor(n / 10), r = n % 10; return U[t] + 'kymmentä' + (r ? U[r] : ''); }
    if (n < 1000) { var h = Math.floor(n / 100), r2 = n % 100; return (h === 1 ? 'sata' : U[h] + 'sataa') + (r2 ? numFi(r2) : ''); }
    if (n < 1e6) { var th = Math.floor(n / 1000), r3 = n % 1000; return (th === 1 ? 'tuhat' : numFi(th) + 'tuhatta') + (r3 ? ' ' + numFi(r3) : ''); }
    var m = Math.floor(n / 1e6), r4 = n % 1e6;
    return (m === 1 ? 'miljoona' : numFi(m) + ' miljoonaa') + (r4 ? ' ' + numFi(r4) : '');
  }

  /* ---- clock → Finnish ---------------------------------------------------*/
  var HW = ['kaksitoista', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi',
            'seitsemän', 'kahdeksan', 'yhdeksän', 'kymmenen', 'yksitoista'];

  function hourW(h) { return HW[((h % 12) + 12) % 12]; }

  function clockFi(h, m) {
    if (m === 0) return 'tasan ' + hourW(h);
    if (m === 15) return 'varttia yli ' + hourW(h);
    if (m === 30) return 'puoli ' + hourW(h + 1);
    if (m === 45) return 'varttia vaille ' + hourW(h + 1);
    if (m < 30) return numFi(m) + ' yli ' + hourW(h);
    return numFi(60 - m) + ' vaille ' + hourW(h + 1);
  }

  var DAYS = ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko',
              'torstai', 'perjantai', 'lauantai'];

  /* ---- deterministic phrase hash (djb2 → base36) -------------------------
   * Both the pre-generation script and the frontend hash the *exact* string
   * passed to say(); a match means a pre-rendered MP3 exists on disk.        */
  function hashPhrase(s) {
    s = String(s == null ? '' : s);
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    }
    return h.toString(36);
  }

  var api = {
    U: U, HW: HW, DAYS: DAYS,
    numFi: numFi, hourW: hourW, clockFi: clockFi, hashPhrase: hashPhrase
  };

  /* UMD-ish export: CommonJS for Node, global (window.Lingua) for browser. */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Lingua = api;
    /* Convenience globals kept for the frontend code that used them before. */
    root.numFi = numFi;
    root.clockFi = clockFi;
    root.hourW = hourW;
    root.DAYS = DAYS;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
