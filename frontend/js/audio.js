/* ============================================================================
 * audio.js — Finnish text-to-speech for the frontend.
 *
 * Three-tier playback (best available wins):
 *   1) pre-generated MP3  audio/<hash>.mp3   (listed in audio/manifest.json)
 *   2) live ElevenLabs via the backend        GET {apiBase}/api/tts?text=...
 *   3) browser SpeechSynthesis (fi-FI)         — offline fallback
 *
 * Exposes globals used throughout the app:
 *   say(text)   -> plays the phrase
 *   spk(text)   -> returns a small 🔊 button that calls say(text)
 *   ttsOK       -> true when *some* audio path is expected to work
 * ==========================================================================*/
(function () {
  'use strict';

  var CFG = window.SF_CONFIG || {};
  var API = (CFG.apiBase || '').replace(/\/+$/, '');
  var AUDIO_BASE = (CFG.audioBase || 'audio').replace(/\/+$/, '');
  var FALLBACK_RATE = typeof CFG.fallbackRate === 'number' ? CFG.fallbackRate : 0.9;

  var hasSpeech = ('speechSynthesis' in window);
  var manifest = new Set();          // set of pre-generated phrase hashes
  var manifestLoaded = false;
  var audioEl = null;                // reusable <audio> element for files
  var cache = {};                    // hash -> object URL (backend responses)

  /* ---- browser voice selection ------------------------------------------*/
  var fiVoice = null;
  function pickVoice() {
    if (!hasSpeech) return;
    try {
      var vs = window.speechSynthesis.getVoices() || [];
      fiVoice = vs.find(function (v) { return /^fi(\b|[-_])/i.test(v.lang); }) ||
                vs.find(function (v) { return /finnish|suomi/i.test(v.name || ''); }) || null;
    } catch (e) { /* ignore */ }
  }
  if (hasSpeech) {
    pickVoice();
    try { window.speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  }

  function browserSay(text) {
    if (!hasSpeech) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'fi-FI';
      if (fiVoice) u.voice = fiVoice;
      u.rate = FALLBACK_RATE;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  function getAudioEl() {
    if (!audioEl) { audioEl = new Audio(); audioEl.preload = 'auto'; }
    return audioEl;
  }

  function playUrl(url) {
    return new Promise(function (resolve, reject) {
      try {
        var a = getAudioEl();
        a.src = url;
        var done = false;
        a.onended = function () { if (!done) { done = true; resolve(true); } };
        a.onerror = function () { if (!done) { done = true; reject(new Error('audio error')); } };
        var p = a.play();
        if (p && p.catch) p.catch(function (err) { if (!done) { done = true; reject(err); } });
      } catch (e) { reject(e); }
    });
  }

  /* ---- manifest of pre-generated audio ----------------------------------*/
  function loadManifest() {
    return fetch(AUDIO_BASE + '/manifest.json', { cache: 'force-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data && data.hashes) || [];
        manifest = new Set(list);
        manifestLoaded = true;
      })
      .catch(function () { manifestLoaded = true; });
  }

  /* ---- backend (ElevenLabs proxy) ---------------------------------------*/
  function backendSay(text, hash) {
    if (cache[hash]) return playUrl(cache[hash]);
    var url = API + '/api/tts?text=' + encodeURIComponent(text);
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('tts ' + r.status);
        return r.blob();
      })
      .then(function (blob) {
        var obj = URL.createObjectURL(blob);
        cache[hash] = obj;
        return playUrl(obj);
      });
  }

  /* ---- public say() ------------------------------------------------------*/
  function say(text) {
    if (!text) return;
    var hash = window.Lingua ? window.Lingua.hashPhrase(text) : String(text);

    // 1) pre-generated file
    if (manifest.has(hash)) {
      playUrl(AUDIO_BASE + '/' + hash + '.mp3').catch(function () {
        tryBackendThenBrowser(text, hash);
      });
      return;
    }
    tryBackendThenBrowser(text, hash);
  }

  function tryBackendThenBrowser(text, hash) {
    if (API) {
      backendSay(text, hash).catch(function () { browserSay(text); });
    } else {
      browserSay(text);
    }
  }

  /* ---- 🔊 button builder -------------------------------------------------*/
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function spk(text) {
    if (!TTS_OK) return '';
    var safe = esc(text).replace(/'/g, "\\'");
    return '<button class="speak-btn" aria-label="Kuuntele / Listen" ' +
           'onclick="say(\'' + safe + '\')">🔊</button>';
  }

  /* Audio is considered available if any of the three tiers can plausibly
   * produce sound. Pre-generated audio (audioBase) is assumed possible. */
  var TTS_OK = hasSpeech || !!API || !!AUDIO_BASE;

  /* ---- expose ------------------------------------------------------------*/
  window.say = say;
  window.spk = spk;
  window.ttsOK = TTS_OK;                 // legacy name used across the app
  window.AudioFX = { init: loadManifest, say: say, isReady: function () { return manifestLoaded; } };
})();
