/* ============================================================================
 * app.js - state, storage, exercise runner, flashcards, views, navigation.
 *
 * Depends on: utils.js, shared/lingua.js, audio.js, data.js
 * ==========================================================================*/

/* =================== persistent progress (localStorage) =================== */
var S = { read:{}, prac:{}, quiz:{}, cards:{}, tasks:{}, exam:0 };
var STORAGE_KEY = 'sf-progress-v1';
var storageOK = false;

function loadState() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) S = Object.assign(S, JSON.parse(raw));
    storageOK = true;
  } catch (e) { storageOK = false; }
}
var saveT = null;
function save() {
  if (!storageOK) return;
  clearTimeout(saveT);
  saveT = setTimeout(function () {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e) {}
  }, 300);
}

/* =================== generators (numbers / clock / days) =================== */
function genNumItem() {
  var r = Math.random(), n;
  if (r < 0.2) n = 1 + Math.floor(Math.random() * 10);
  else if (r < 0.4) n = 11 + Math.floor(Math.random() * 9);
  else if (r < 0.65) n = 21 + Math.floor(Math.random() * 79);
  else if (r < 0.85) n = 100 + Math.floor(Math.random() * 900);
  else n = 1000 + Math.floor(Math.random() * 9000);
  return { t:'type', q:'Kirjoita suomeksi: <span class="mono">' + n + '</span>',
           a:[numFi(n)], show:numFi(n), saySrc:numFi(n) };
}
var CLK_MIN = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
function genClockItem() {
  var h = 1 + Math.floor(Math.random() * 12);
  var m = CLK_MIN[Math.floor(Math.random() * CLK_MIN.length)];
  var ok = 'Kello on ' + clockFi(h, m) + '.';
  var set = new Set([ok]);
  var cand = [[h+1,m],[h-1,m],[h,(m+15)%60],[h,(m+30)%60],[h+2,m],[h,(m+45)%60],[h-1,(m+15)%60]];
  var opts = [{ txt:ok, ok:true }];
  for (var i = 0; i < cand.length; i++) {
    var c = cand[i];
    var t = 'Kello on ' + clockFi(((c[0] - 1 + 12) % 12) + 1, c[1]) + '.';
    if (!set.has(t)) { set.add(t); opts.push({ txt:t, ok:false }); }
    if (opts.length === 4) break;
  }
  var hh = String(h).padStart(2, '0'), mm = String(m).padStart(2, '0');
  return { t:'mc', q:'Paljonko kello on? <span class="mono">' + hh + ':' + mm + '</span>',
           opts:shuffle(opts), saySrc:'kello on ' + clockFi(h, m) };
}
function genDayItem() {
  var today = new Date().getDay();
  var forms = [
    ['Mikä päivä <b>tänään</b> on?', 0], ['Mikä päivä <b>huomenna</b> on?', 1],
    ['Mikä päivä <b>eilen</b> oli?', -1], ['Mikä päivä <b>ylihuomenna</b> on?', 2],
    ['Mikä päivä <b>toissa päivänä</b> oli?', -2]];
  var f = forms[Math.floor(Math.random() * forms.length)];
  var ans = DAYS[(((today + f[1]) % 7) + 7) % 7];
  var opts = [{ txt:ans, ok:true }];
  var pool = shuffle(DAYS);
  for (var i = 0; i < pool.length; i++) { if (pool[i] !== ans && opts.length < 4) opts.push({ txt:pool[i], ok:false }); }
  return { t:'mc', q:f[0] + ' <span class="caption mute">(oikea kalenteri - the real calendar!)</span>', opts:shuffle(opts) };
}
function expandGen(g) { return g === 'number' ? genNumItem() : g === 'clock' ? genClockItem() : genDayItem(); }

/* =================== RUNNER (practice / quiz / exam) =================== */
var VIEW = 'home', TAB = 'learn', RUN = null, MATCH = null, FL = null;

function prepMC(it) { return { t:'mc', q:it.q, opts:shuffle(it.o.map(function (txt, i) { return { txt:txt, ok:i === it.a }; })), saySrc:it.saySrc }; }
function prepType(it) { return { t:'type', q:it.q, a:it.a, show:it.show, saySrc:it.saySrc }; }
function prepListen(it) {
  var pick = Math.random() < 0.5 ? 0 : 1, w = it.pair[pick], o = it.pair[1 - pick];
  if (ttsOK) return { t:'mc', listen:w[0], q:'Kuuntele ja valitse sana, jonka kuulet. <span class="caption mute">(listen &amp; pick the word you hear)</span>',
    opts:shuffle([{ txt:w[0] + ' - ' + w[1], ok:true }, { txt:o[0] + ' - ' + o[1], ok:false }]) };
  return { t:'mc', q:'Which Finnish word means <b>“' + esc(w[1]) + '”</b>?', opts:shuffle([{ txt:w[0], ok:true }, { txt:o[0], ok:false }]) };
}
function prepQuizItem(it) {
  if (it.t === 'gen') return expandGen(it.g);
  if (it.t === 'mc') return prepMC(it);
  return prepType(it);
}
function buildRunItems(ex) {
  if (ex.type === 'mc') return shuffle(ex.items).map(prepMC);
  if (ex.type === 'type') return shuffle(ex.items).map(prepType);
  if (ex.type === 'listen') return shuffle(ex.items).map(prepListen);
  if (ex.type === 'numgen') return Array.from({ length:10 }, genNumItem);
  if (ex.type === 'clockgen') return Array.from({ length:10 }, genClockItem);
  if (ex.type === 'daygen') return Array.from({ length:8 }, genDayItem);
  return [];
}
function startPractice(mid, exId) {
  var m = MODULES.find(function (x) { return x.id === mid; });
  var ex = m.practice.find(function (x) { return x.id === exId; });
  if (ex.type === 'match') { startMatch(mid, ex); return; }
  RUN = { kind:'prac', modId:mid, exId:exId, title:ex.title, intro:ex.intro || '', items:buildRunItems(ex), idx:0, score:0, answered:false };
  renderRun();
}
function startQuiz(mid) {
  var m = MODULES.find(function (x) { return x.id === mid; });
  RUN = { kind:'quiz', modId:mid, exId:null, title:'Moduulitesti - module quiz', intro:'10 questions · pass at 70 %',
    items:sample(m.quiz, Math.min(10, m.quiz.length)).map(prepQuizItem), idx:0, score:0, answered:false };
  renderRun();
}
function startExam() {
  var pool = [];
  MODULES.forEach(function (m) { pool = pool.concat(m.quiz.map(function (x) { return Object.assign({}, x, { _m:m.num }); })); });
  var items = sample(pool, 21).map(prepQuizItem);
  items.push(genNumItem(), genClockItem(), genClockItem(), genDayItem());
  RUN = { kind:'exam', modId:null, exId:null, title:'Loppukoe - final exam', intro:'25 questions from the whole booklet · pass at 80 %',
    items:shuffle(items), idx:0, score:0, answered:false };
  renderRun();
}
function runHeader() {
  var back = RUN.kind === 'exam' ? "go('home')" : "go('" + RUN.modId + "','" + (RUN.kind === 'quiz' ? 'quiz' : 'practice') + "')";
  return '<div class="col section" style="margin-top:32px">' +
    '<button class="btn btn-secondary btn-sm" onclick="' + back + '">← Takaisin</button>' +
    '<div class="spacer-lg"></div>' +
    '<h3 class="heading-lg">' + RUN.title + '</h3>' +
    (RUN.intro ? '<p class="body-sm" style="margin-top:4px">' + RUN.intro + '</p>' : '');
}
function renderRun() {
  var R = RUN;
  if (R.idx >= R.items.length) { renderRunDone(); return; }
  var it = R.items[R.idx];
  var inner = '';
  if (it.t === 'mc') {
    inner = '<div class="opts">' + it.opts.map(function (o, i) { return '<button class="opt" id="opt' + i + '" onclick="ansMC(' + i + ')">' + o.txt + '</button>'; }).join('') + '</div>';
    if (it.listen) inner = '<div style="margin-bottom:14px"><button class="btn btn-secondary btn-sm" onclick="say(RUN.items[RUN.idx].listen)">🔊 Kuuntele - listen</button></div>' + inner;
  } else {
    inner = '<div class="type-row"><input class="pill-input" id="typeIn" autocomplete="off" autocapitalize="off" onkeydown="if(event.key===\'Enter\')ansType()" placeholder="Kirjoita vastaus…"><button class="btn btn-primary" onclick="ansType()">Tarkista</button></div>';
  }
  $('#app').innerHTML = runHeader() +
    '<div class="ex-card">' +
      '<div class="ex-meta"><span>' + (R.idx + 1) + ' / ' + R.items.length + '</span><span>oikein ' + R.score + '</span></div>' +
      '<div class="ex-q">' + it.q + '</div>' +
      inner +
      '<div id="fb"></div>' +
      '<div class="result-line hidden" id="nextRow"><button class="btn btn-primary" onclick="nextItem()">Seuraava →</button></div>' +
    '</div></div>';
  R.answered = false;
  if (it.t === 'mc' && it.listen) setTimeout(function () { say(it.listen); }, 250);
  if (it.t === 'type') setTimeout(function () { var el = $('#typeIn'); if (el) el.focus(); }, 50);
}
function ansMC(i) {
  var R = RUN; if (R.answered) return;
  var it = R.items[R.idx]; if (!it || !it.opts) return;
  R.answered = true;
  var pick = it.opts[i], ok = pick.ok;
  it.opts.forEach(function (o, j) {
    var el = $('#opt' + j); el.disabled = true;
    if (o.ok) el.classList.add('correct'); else if (j === i) el.classList.add('wrong');
  });
  if (ok) R.score++;
  var right = it.opts.find(function (o) { return o.ok; }).txt;
  $('#fb').innerHTML = '<div class="feedback"><span class="dot ' + (ok ? 'ok' : 'no') + '"></span><span>' +
    (ok ? 'Oikein!' : 'Ei ihan - oikea vastaus: <b>' + right + '</b>') + (it.saySrc ? ' ' + spk(it.saySrc) : '') + '</span></div>';
  $('#nextRow').classList.remove('hidden');
}
function ansType() {
  var R = RUN; if (R.answered) return;
  var it = R.items[R.idx], v = $('#typeIn').value;
  if (!v.trim()) return;
  R.answered = true;
  var ok = it.a.some(function (x) { return norm(x) === norm(v) || normTight(x) === normTight(v); });
  if (ok) R.score++;
  $('#typeIn').disabled = true;
  $('#fb').innerHTML = '<div class="feedback"><span class="dot ' + (ok ? 'ok' : 'no') + '"></span><span>' +
    (ok ? 'Oikein!' : 'Oikea vastaus: <b>' + esc(it.show || it.a[0]) + '</b>') + ' ' + spk(it.show || it.a[0]) + '</span></div>';
  $('#nextRow').classList.remove('hidden');
}
function nextItem() { RUN.idx++; renderRun(); }
function renderRunDone() {
  var R = RUN, pct = Math.round(100 * R.score / R.items.length);
  var passLine = '', passed = false;
  if (R.kind === 'prac') {
    passed = pct >= 80;
    if (passed && (!S.prac[R.exId] || pct > S.prac[R.exId])) { S.prac[R.exId] = pct; save(); }
    passLine = passed ? 'Harjoitus suoritettu ✓ (≥ 80 %)' : 'Tarvitset 80 % - yritä uudestaan!';
  } else if (R.kind === 'quiz') {
    passed = pct >= 70;
    if (!S.quiz[R.modId] || pct > S.quiz[R.modId]) { S.quiz[R.modId] = pct; save(); }
    passLine = passed ? 'Testi läpi ✓ (≥ 70 %)' : 'Raja on 70 % - kertaa ja yritä uudestaan!';
  } else {
    passed = pct >= 80;
    if (pct > S.exam) { S.exam = pct; save(); }
    passLine = passed ? 'Loppukoe läpi - onneksi olkoon! 🎉' : 'Raja on 80 % - kertaa moduulit ja yritä uudestaan!';
  }
  var retry = R.kind === 'prac' ? "startPractice('" + R.modId + "','" + R.exId + "')" : R.kind === 'quiz' ? "startQuiz('" + R.modId + "')" : 'startExam()';
  var back = R.kind === 'exam' ? "go('home')" : "go('" + R.modId + "','" + (R.kind === 'quiz' ? 'quiz' : 'practice') + "')";
  $('#app').innerHTML = runHeader() +
    '<div class="ex-card" style="text-align:center;padding:40px 24px">' +
      '<div class="flash-word">' + pct + ' %</div>' +
      '<p class="body-sm" style="margin-top:8px">' + R.score + ' / ' + R.items.length + ' oikein</p>' +
      '<div class="feedback" style="justify-content:center"><span class="dot ' + (passed ? 'ok' : 'no') + '"></span><span>' + passLine + '</span></div>' +
      '<div class="flash-actions">' +
        '<button class="btn btn-primary" onclick="' + retry + '">Uudestaan</button>' +
        '<button class="btn btn-secondary" onclick="' + back + '">Valmis</button>' +
      '</div>' +
    '</div></div>';
  updateNav();
}

/* ---- match engine ---- */
function startMatch(mid, ex) {
  var rounds = []; var pairs = shuffle(ex.pairs);
  for (var i = 0; i < pairs.length; i += 6) rounds.push(pairs.slice(i, i + 6));
  MATCH = { modId:mid, exId:ex.id, title:ex.title, rounds:rounds, round:0, ok:0, miss:0, total:ex.pairs.length, selL:-1, selR:-1, doneL:[], doneR:[] };
  renderMatch();
}
function renderMatch() {
  var M = MATCH;
  if (M.round >= M.rounds.length) { matchDone(); return; }
  var pr = M.rounds[M.round];
  M.left = shuffle(pr.map(function (p, i) { return { txt:p[0], key:i }; }));
  M.right = shuffle(pr.map(function (p, i) { return { txt:p[1], key:i }; }));
  M.doneL = []; M.doneR = []; M.selL = -1; M.selR = -1;
  $('#app').innerHTML = '<div class="col" style="margin-top:32px">' +
    '<button class="btn btn-secondary btn-sm" onclick="go(\'' + M.modId + '\',\'practice\')">← Takaisin</button>' +
    '<div class="spacer-lg"></div>' +
    '<h3 class="heading-lg">' + M.title + '</h3>' +
    '<p class="body-sm" style="margin-top:4px">Yhdistä parit - match the pairs · round ' + (M.round + 1) + '/' + M.rounds.length + '</p>' +
    '<div class="ex-card">' +
      '<div class="ex-meta"><span>parit ' + M.ok + ' / ' + M.total + '</span><span>virheet ' + M.miss + '</span></div>' +
      '<div class="match-wrap">' +
        '<div style="display:flex;flex-direction:column;gap:8px">' + M.left.map(function (c, i) { return '<button class="mchip" id="L' + i + '" onclick="pickM(0,' + i + ')">' + esc(c.txt) + '</button>'; }).join('') + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' + M.right.map(function (c, i) { return '<button class="mchip" id="R' + i + '" onclick="pickM(1,' + i + ')">' + esc(c.txt) + '</button>'; }).join('') + '</div>' +
      '</div>' +
    '</div></div>';
}
function pickM(side, i) {
  var M = MATCH;
  if (side === 0) { if (M.doneL.indexOf(i) >= 0) return; if (M.selL >= 0) $('#L' + M.selL).classList.remove('sel'); M.selL = i; $('#L' + i).classList.add('sel'); }
  else { if (M.doneR.indexOf(i) >= 0) return; if (M.selR >= 0) $('#R' + M.selR).classList.remove('sel'); M.selR = i; $('#R' + i).classList.add('sel'); }
  if (M.selL < 0 || M.selR < 0) return;
  var l = M.left[M.selL], r = M.right[M.selR], L = $('#L' + M.selL), R = $('#R' + M.selR);
  if (l.key === r.key) {
    M.ok++; M.doneL.push(M.selL); M.doneR.push(M.selR);
    L.classList.remove('sel'); R.classList.remove('sel'); L.classList.add('done'); R.classList.add('done');
    L.disabled = true; R.disabled = true;
    M.selL = -1; M.selR = -1;
    renderMatchMeta();
    if (M.doneL.length === M.rounds[M.round].length) { M.round++; setTimeout(renderMatch, 350); }
  } else {
    M.miss++;
    L.classList.add('flash'); R.classList.add('flash');
    setTimeout(function () { L.classList.remove('flash', 'sel'); R.classList.remove('flash', 'sel'); }, 420);
    M.selL = -1; M.selR = -1;
    renderMatchMeta();
  }
}
function renderMatchMeta() { var m = document.querySelectorAll('.ex-meta span'); if (m[0]) m[0].textContent = 'parit ' + MATCH.ok + ' / ' + MATCH.total; if (m[1]) m[1].textContent = 'virheet ' + MATCH.miss; }
function matchDone() {
  var M = MATCH, pct = Math.round(100 * M.total / (M.total + M.miss)), passed = pct >= 80;
  if (passed && (!S.prac[M.exId] || pct > S.prac[M.exId])) { S.prac[M.exId] = pct; save(); }
  $('#app').innerHTML = '<div class="col" style="margin-top:32px">' +
    '<button class="btn btn-secondary btn-sm" onclick="go(\'' + M.modId + '\',\'practice\')">← Takaisin</button>' +
    '<div class="ex-card" style="text-align:center;padding:40px 24px;margin-top:24px">' +
      '<div class="flash-word">' + pct + ' %</div>' +
      '<p class="body-sm" style="margin-top:8px">' + M.total + ' paria · ' + M.miss + ' virhettä</p>' +
      '<div class="feedback" style="justify-content:center"><span class="dot ' + (passed ? 'ok' : 'no') + '"></span><span>' + (passed ? 'Harjoitus suoritettu ✓' : 'Alle 80 % tarkkuus - yritä uudestaan!') + '</span></div>' +
      '<div class="flash-actions">' +
        '<button class="btn btn-primary" onclick="startPractice(\'' + M.modId + '\',\'' + M.exId + '\')">Uudestaan</button>' +
        '<button class="btn btn-secondary" onclick="go(\'' + M.modId + '\',\'practice\')">Valmis</button>' +
      '</div>' +
    '</div></div>';
  updateNav();
}

/* =================== FLASHCARDS =================== */
function deckState(id) { if (!S.cards[id]) S.cards[id] = {}; return S.cards[id]; }
function boxCounts(d) {
  var st = deckState(d.id), c = [0, 0, 0];
  d.cards.forEach(function (_, i) { c[Math.min(3, (st[i] || 1)) - 1]++; });
  return c;
}
function renderCards() {
  VIEW = 'cards'; FL = null;
  var rows = '';
  DECKS.forEach(function (d) {
    var c = boxCounts(d), known = c[2];
    rows += '<div class="deck-row"><div>' +
        '<h5 class="heading-sm">' + d.title + '</h5>' +
        '<span class="caption">' + d.cards.length + ' korttia · ' + known + ' osattua</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:12px">' +
        '<div class="box-tags"><span class="box-tag">1·' + c[0] + '</span><span class="box-tag">2·' + c[1] + '</span><span class="box-tag">3·' + c[2] + '</span></div>' +
        '<button class="btn btn-primary btn-sm" onclick="startDeck(\'' + d.id + '\')">Opiskele</button>' +
      '</div></div>';
  });
  $('#app').innerHTML = '<div class="col" style="margin-top:48px">' +
    '<h2 class="display-lg">Sanasto - flashcards</h2>' +
    '<p class="body-md" style="margin-top:8px">Every word from the booklet as spaced-repetition cards. <b>En osannut</b> sends a card back to box 1, <b>Osasin</b> moves it up. Box 3 = you know it.</p>' +
    '<div class="spacer-lg"></div>' + rows + '</div>';
  updateNav();
}
function startDeck(id) {
  var d = DECKS.find(function (x) { return x.id === id; }), st = deckState(id);
  var idxs = d.cards.map(function (_, i) { return i; }).sort(function (a, b) { return (st[a] || 1) - (st[b] || 1) || Math.random() - 0.5; });
  FL = { deckId:id, queue:idxs.slice(0, 20), pos:0, flip:false };
  renderFlash();
}
function renderFlash() {
  var F = FL, d = DECKS.find(function (x) { return x.id === F.deckId; });
  if (F.pos >= F.queue.length) {
    $('#app').innerHTML = '<div class="col" style="margin-top:32px">' +
      '<button class="btn btn-secondary btn-sm" onclick="renderCards()">← Sanasto</button>' +
      '<div class="ex-card" style="text-align:center;padding:40px 24px;margin-top:24px">' +
        '<div class="flash-word">Sessio valmis ✓</div>' +
        '<p class="body-sm" style="margin-top:8px">' + F.queue.length + ' korttia kerrattu</p>' +
        '<div class="flash-actions">' +
          '<button class="btn btn-primary" onclick="startDeck(\'' + F.deckId + '\')">Uusi sessio</button>' +
          '<button class="btn btn-secondary" onclick="renderCards()">Valmis</button>' +
        '</div></div></div>';
    return;
  }
  var ci = F.queue[F.pos], card = d.cards[ci], st = deckState(F.deckId), box = Math.min(3, st[ci] || 1);
  $('#app').innerHTML = '<div class="col" style="margin-top:32px">' +
    '<button class="btn btn-secondary btn-sm" onclick="renderCards()">← Sanasto</button>' +
    '<div class="flash-card">' +
      '<span class="caption mute">' + (F.pos + 1) + ' / ' + F.queue.length + ' · box ' + box + '</span>' +
      '<div class="flash-word">' + esc(card[0]) + ' ' + spk(card[0]) + '</div>' +
      (F.flip ? '<div class="flash-back">' + esc(card[1]) + '</div>' : '') +
    '</div>' +
    '<div class="flash-actions">' +
      (F.flip
        ? '<button class="btn btn-secondary" onclick="gradeFlash(false)">En osannut</button>' +
          '<button class="btn btn-primary" onclick="gradeFlash(true)">Osasin ✓</button>'
        : '<button class="btn btn-primary" onclick="FL.flip=true;renderFlash()">Näytä käännös</button>') +
    '</div></div>';
}
function gradeFlash(ok) {
  var F = FL, ci = F.queue[F.pos], st = deckState(F.deckId);
  st[ci] = ok ? Math.min(3, (st[ci] || 1) + 1) : 1;
  save();
  F.pos++; F.flip = false; renderFlash();
}

/* =================== PROGRESS =================== */
function modProgress(m) {
  var readN = m.learn.filter(function (_, i) { return S.read[m.id + '-' + i]; }).length / m.learn.length;
  var pracN = m.practice.filter(function (p) { return S.prac[p.id]; }).length / m.practice.length;
  var quizN = (S.quiz[m.id] || 0) / 100;
  return Math.round(100 * (0.3 * readN + 0.4 * pracN + 0.3 * quizN));
}
function overallProgress() {
  var s = MODULES.reduce(function (t, m) { return t + modProgress(m); }, 0);
  return Math.round(s / MODULES.length);
}
function updateNav() {
  $('#navProg').textContent = overallProgress() + ' %';
  $('#navLinks').innerHTML =
    '<button class="nav-link ' + (VIEW === 'home' ? 'active' : '') + '" onclick="go(\'home\')">Ohjelma</button>' +
    MODULES.map(function (m) { return '<button class="nav-link ' + (VIEW === m.id ? 'active' : '') + '" onclick="go(\'' + m.id + '\')">' + m.num + '</button>'; }).join('') +
    '<button class="nav-link ' + (VIEW === 'cards' ? 'active' : '') + '" onclick="go(\'cards\')">Sanasto</button>' +
    '<button class="nav-link ' + (VIEW === 'exam' ? 'active' : '') + '" onclick="go(\'exam\')">Loppukoe</button>';
}

/* =================== VIEWS =================== */
function renderHome() {
  VIEW = 'home';
  var cards = MODULES.map(function (m) {
    var p = modProgress(m), q = S.quiz[m.id];
    return '<button class="module-card" onclick="go(\'' + m.id + '\')">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">' +
        '<h4 class="heading-md"><span class="mute" style="font-family:var(--mono);font-size:14px;margin-right:10px">' + m.num + '</span>' + m.title + '</h4>' +
        '<span class="caption" style="font-family:var(--mono);flex:none">' + p + ' %</span>' +
      '</div>' +
      '<p class="body-sm" style="margin-top:4px">' + m.sub + (q ? ' · testi ' + q + ' %' : '') + '</p>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + p + '%"></div></div>' +
    '</button>';
  }).join('');
  var tasks = COURSE_TASKS.map(function (t) {
    return '<label class="task-row">' +
      '<input type="checkbox" ' + (S.tasks[t[0]] ? 'checked' : '') + ' onchange="S.tasks[\'' + t[0] + '\']=this.checked;save();">' +
      '<span>' + t[1] + '</span></label>';
  }).join('');
  var golden = GOLDEN_RULES.map(function (g, i) {
    return '<div class="vrow"><b>' + (i + 1) + '.</b><span style="text-align:left">' + esc(g) + '</span></div>';
  }).join('');
  $('#app').innerHTML =
  '<div class="col" style="margin-top:64px">' +
    '<p class="caption mute" style="font-family:var(--mono)">900017Y · 2 op · A1.1 · University of Oulu</p>' +
    '<h1 class="display-xl" style="margin-top:8px">Survival Finnish<br>Extended Programme</h1>' +
    '<p class="body-md" style="margin-top:16px;max-width:56ch">The complete course booklet as an interactive programme: seven modules with reading, drills, listening, live number &amp; clock trainers, spaced-repetition flashcards and a final exam. Progress is saved automatically.</p>' +
    '<div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">' +
      '<button class="btn btn-primary" onclick="go(\'m0\')">Aloita moduulista 0</button>' +
      '<button class="btn btn-secondary" onclick="go(\'cards\')">Sanasto-kortit</button>' +
    '</div>' +
  '</div>' +
  '<div class="col section-gap">' +
    '<h2 class="display-lg">Moduulit</h2>' + cards +
  '</div>' +
  '<div class="col section-gap">' +
    '<h2 class="display-lg">Kurssi-info</h2>' +
    '<div class="faq-row"><h5 class="heading-sm">Learning outcomes</h5><p>By the end of the course, you can understand and use very common everyday expressions and phrases, locate information in simple texts and messages, and recognize basic features of Finnish language and communication styles.</p></div>' +
    '<div class="faq-row"><h5 class="heading-sm">Mode, workload and assessment</h5><p>Survival Finnish (900017Y), 2 ECTS, level A1.1. The booklet describes 12 x 2 h contact lessons, a 2 h written exam, and 24 h of self-study in Moodle. Assessment is pass/fail and is based on active participation, homework assignments, and the written exam.</p></div>' +
    '<div class="faq-row"><h5 class="heading-sm">Course content</h5><p>Everyday phrases, greetings, thanking and apologizing, introductions and basic personal information, numbers, time expressions, food and drink, asking prices, personal pronouns and possessive forms, affirmative/negative/question sentences, verb conjugation, partitive singular, and basic local cases for answering missä.</p></div>' +
    '<div class="faq-row"><h5 class="heading-sm">Kultaiset säännöt - golden rules</h5><div class="vgrid" style="grid-template-columns:1fr">' + golden + '</div></div>' +
    '<div class="faq-row"><h5 class="heading-sm">Pronunciation rule</h5><p>Finnish is pronounced exactly as it is written: one letter, one sound. Stress is always on the first syllable, and sound length (a vs aa, k vs kk) changes meaning, so listen and pronounce carefully.</p></div>' +
    '<div class="faq-row"><h5 class="heading-sm">Pakolliset Moodle-tehtävät - obligatory tasks</h5>' + tasks + '</div>' +
  '</div>' +
  '<div class="col section-gap">' +
    '<div class="card-dark">' +
      '<h3 class="heading-lg" style="color:var(--on-dark)">Loppukoe - final exam</h3>' +
      '<p class="body-sm" style="margin-top:8px">25 questions sampled from the whole booklet, including live number and clock questions. Pass at 80 %.' + (S.exam ? ' Your best: <b style="color:var(--on-dark)">' + S.exam + ' %</b>.' : '') + '</p>' +
      '<div style="margin-top:20px"><button class="btn btn-on-dark" onclick="startExam()">Aloita loppukoe</button></div>' +
    '</div>' +
  '</div>';
  updateNav();
}
function toggleRead(mid, i) {
  var k = mid + '-' + i;
  S.read[k] = !S.read[k]; save();
  renderModule(mid, 'learn');
}
function renderModule(mid, tab) {
  VIEW = mid; TAB = tab || 'learn';
  var m = MODULES.find(function (x) { return x.id === mid; });
  var p = modProgress(m);
  var body = '';
  if (TAB === 'learn') {
    body = m.learn.map(function (sec, i) {
      var read = S.read[mid + '-' + i];
      return '<div class="learn-sec">' +
        '<h5 class="heading-sm"><span>' + sec.h + '</span>' +
          '<button class="btn ' + (read ? 'btn-primary' : 'btn-secondary') + ' btn-sm mark-read" onclick="toggleRead(\'' + mid + '\',' + i + ')">' + (read ? 'Luettu ✓' : 'Merkitse luetuksi') + '</button></h5>' +
        '<div class="learn-body">' + sec.body + '</div>' +
      '</div>';
    }).join('');
  } else if (TAB === 'practice') {
    body = m.practice.map(function (ex) {
      var best = S.prac[ex.id];
      return '<div class="ex-card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">' +
        '<div><h5 class="heading-sm">' + ex.title + '</h5>' +
        '<span class="caption">' + (ex.type === 'match' ? ex.pairs.length + ' paria' : ex.items ? ex.items.length + ' kysymystä' : 'generaattori - endless practice') + (best ? ' · paras ' + best + ' %' : '') + '</span></div>' +
        '<button class="btn ' + (best ? 'btn-secondary' : 'btn-primary') + ' btn-sm" onclick="startPractice(\'' + mid + '\',\'' + ex.id + '\')">' + (best ? 'Uudestaan ✓' : 'Aloita') + '</button>' +
      '</div>';
    }).join('');
  } else {
    var best = S.quiz[mid];
    body = '<div class="ex-card" style="text-align:center;padding:40px 24px">' +
      '<h5 class="heading-sm">Moduulitesti</h5>' +
      '<p class="body-sm" style="margin-top:6px">10 satunnaista kysymystä tästä moduulista · läpäisyraja 70 %' + (best ? ' · paras tulos <b>' + best + ' %</b>' : '') + '</p>' +
      '<div class="flash-actions"><button class="btn btn-primary" onclick="startQuiz(\'' + mid + '\')">Aloita testi</button></div>' +
    '</div>';
  }
  var idx = MODULES.indexOf(m);
  var navBtns =
    (idx > 0 ? '<button class="btn btn-secondary btn-sm" onclick="go(\'' + MODULES[idx - 1].id + '\')">← ' + MODULES[idx - 1].num + ' · ' + MODULES[idx - 1].title + '</button>' : '<span></span>') +
    (idx < MODULES.length - 1 ? '<button class="btn btn-secondary btn-sm" onclick="go(\'' + MODULES[idx + 1].id + '\')">' + MODULES[idx + 1].num + ' · ' + MODULES[idx + 1].title + ' →</button>' : '');
  $('#app').innerHTML = '<div class="col" style="margin-top:48px">' +
    '<p class="caption mute" style="font-family:var(--mono)">Moduuli ' + m.num + ' · ' + p + ' %</p>' +
    '<h2 class="display-lg" style="margin-top:6px">' + m.title + '</h2>' +
    '<p class="body-md" style="margin-top:6px">' + m.sub + '</p>' +
    '<div class="progress-track" style="max-width:280px"><div class="progress-fill" style="width:' + p + '%"></div></div>' +
    '<div class="tabs">' +
      '<button class="tab ' + (TAB === 'learn' ? 'active' : '') + '" onclick="renderModule(\'' + mid + '\',\'learn\')">Opi</button>' +
      '<button class="tab ' + (TAB === 'practice' ? 'active' : '') + '" onclick="renderModule(\'' + mid + '\',\'practice\')">Harjoittele</button>' +
      '<button class="tab ' + (TAB === 'quiz' ? 'active' : '') + '" onclick="renderModule(\'' + mid + '\',\'quiz\')">Testi</button>' +
    '</div>' +
    body +
    '<div class="spacer-xl"></div>' +
    '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">' + navBtns + '</div>' +
  '</div>';
  updateNav();
  window.scrollTo(0, 0);
}
function renderExamView() {
  VIEW = 'exam';
  $('#app').innerHTML = '<div class="col" style="margin-top:48px">' +
    '<h2 class="display-lg">Loppukoe</h2>' +
    '<p class="body-md" style="margin-top:8px">25 questions from all seven modules - vocabulary, grammar, dialogues, plus live number and clock questions. Pass at 80 %.' + (S.exam ? ' Your best result so far: <b>' + S.exam + ' %</b>.' : '') + '</p>' +
    '<div class="spacer-lg"></div>' +
    '<div class="card-dark">' +
      '<h3 class="heading-lg" style="color:var(--on-dark)">Oletko valmis?</h3>' +
      '<p class="body-sm" style="margin-top:8px">Tip: finish every module quiz (≥ 70 %) before attempting the exam.</p>' +
      '<div style="margin-top:20px"><button class="btn btn-on-dark" onclick="startExam()">Aloita loppukoe</button></div>' +
    '</div></div>';
  updateNav();
}
function go(view, tab) {
  window.scrollTo(0, 0);
  if (view === 'home') return renderHome();
  if (view === 'cards') return renderCards();
  if (view === 'exam') return renderExamView();
  return renderModule(view, tab || 'learn');
}

/* =================== bootstrap =================== */
/* Top-level `var`/`function` declarations in a classic script are already
 * properties of window, so inline onclick handlers (go, save, RUN, FL, S, …)
 * resolve without any extra wiring. */

(function boot() {
  loadState();
  if (window.AudioFX && window.AudioFX.init) {
    window.AudioFX.init().then(function () { go('home'); });
  } else {
    go('home');
  }
})();
