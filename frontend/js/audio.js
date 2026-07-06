/* ============================================================================
 * audio.js - Finnish text-to-speech for the frontend.
 *
 * Three-tier playback (best available wins):
 *   1) pre-generated MP3  audio/<hash>.mp3   (listed in audio/manifest.json)
 *   2) live ElevenLabs via /api/tts or a configured backend
 *   3) browser SpeechSynthesis (fi-FI)       - final fallback
 * ==========================================================================*/
(function () {
  'use strict';

  var CFG = window.SF_CONFIG || {};
  var rawApiBase = CFG.apiBase == null ? 'auto' : String(CFG.apiBase).trim();
  var AUDIO_BASE = (CFG.audioBase || 'audio').replace(/\/+$/, '');
  var FALLBACK_RATE = typeof CFG.fallbackRate === 'number' ? CFG.fallbackRate : 0.86;
  var FALLBACK_PITCH = typeof CFG.fallbackPitch === 'number' ? CFG.fallbackPitch : 1;

  var hasSpeech = ('speechSynthesis' in window);
  var manifest = new Set();
  var manifestLoaded = false;
  var backendMode = 'disabled';
  var apiCandidate = '';
  var API = '';
  var audioEl = null;
  var backendStatus = 'disabled';
  var cache = {};

  if (rawApiBase === 'auto') {
    backendMode = 'auto';
    apiCandidate = /^https?:$/i.test(window.location.protocol) ? window.location.origin : '';
    backendStatus = apiCandidate ? 'pending' : 'disabled';
  } else if (rawApiBase) {
    backendMode = 'explicit';
    apiCandidate = rawApiBase.replace(/\/+$/, '');
    backendStatus = apiCandidate ? 'pending' : 'disabled';
  }

  /* ---- browser voice selection ------------------------------------------*/
  var fiVoice = null;
  var selectedVoiceName = '';
  try { selectedVoiceName = window.localStorage.getItem('sf-browser-voice') || ''; } catch (e) {}

  function voiceScore(v) {
    var lang = String(v.lang || '');
    var name = String(v.name || '');
    var score = 0;
    if (/^fi([-_]FI)?$/i.test(lang)) score += 100;
    else if (/^fi([-_]|$)/i.test(lang)) score += 90;
    if (/finnish|suomi|satu|heidi|harri/i.test(name)) score += 30;
    if (/natural|premium|enhanced|neural|online|google|microsoft/i.test(name)) score += 10;
    if (v.localService) score += 2;
    return score;
  }

  function pickVoice() {
    if (!hasSpeech) return;
    try {
      var vs = window.speechSynthesis.getVoices() || [];
      if (!vs.length) return;
      if (selectedVoiceName) {
        fiVoice = vs.find(function (v) { return v.name === selectedVoiceName; }) || null;
        if (fiVoice) return;
      }
      var ranked = vs.slice().sort(function (a, b) { return voiceScore(b) - voiceScore(a); });
      fiVoice = voiceScore(ranked[0]) > 0 ? ranked[0] : null;
    } catch (e) { /* ignore */ }
  }
  if (hasSpeech) {
    pickVoice();
    try { window.speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  }

  function listBrowserVoices() {
    if (!hasSpeech) return [];
    try {
      return (window.speechSynthesis.getVoices() || []).map(function (v) {
        return { name:v.name, lang:v.lang, localService:!!v.localService, score:voiceScore(v) };
      }).sort(function (a, b) { return b.score - a.score; });
    } catch (e) { return []; }
  }

  function setBrowserVoice(name) {
    selectedVoiceName = String(name || '');
    try {
      if (selectedVoiceName) window.localStorage.setItem('sf-browser-voice', selectedVoiceName);
      else window.localStorage.removeItem('sf-browser-voice');
    } catch (e) {}
    pickVoice();
  }

  function browserSay(text) {
    if (!hasSpeech) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'fi-FI';
      if (fiVoice) u.voice = fiVoice;
      u.rate = FALLBACK_RATE;
      u.pitch = FALLBACK_PITCH;
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

  /* ---- backend / Vercel API discovery -----------------------------------*/
  function probeBackend() {
    if (!apiCandidate || (backendMode !== 'auto' && backendMode !== 'explicit')) {
      backendStatus = 'disabled';
      return Promise.resolve(false);
    }
    return fetch(apiCandidate + '/api/health', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.ok && data.keyConfigured) {
          API = apiCandidate;
          backendStatus = 'ready';
          return true;
        }
        backendStatus = data && data.keyStatus ? data.keyStatus : 'unconfigured';
        return false;
      })
      .catch(function () { backendStatus = 'unreachable'; return false; });
  }

  function backendSay(text, hash) {
    if (!API) return Promise.reject(new Error('no backend'));
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

  /* ---- button builder ----------------------------------------------------*/
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

  function status() {
    return {
      manifestLoaded: manifestLoaded,
      pregeneratedPhrases: manifest.size,
      backendMode: backendMode,
      backendStatus: backendStatus,
      apiBase: API,
      browserSpeech: hasSpeech,
      browserVoice: fiVoice ? { name:fiVoice.name, lang:fiVoice.lang, score:voiceScore(fiVoice) } : null
    };
  }

  var TTS_OK = hasSpeech || !!API || backendMode === 'auto' || !!AUDIO_BASE;

  window.say = say;
  window.spk = spk;
  window.ttsOK = TTS_OK;
  window.AudioFX = {
    init: function () { return Promise.all([loadManifest(), probeBackend()]); },
    say: say,
    isReady: function () { return manifestLoaded; },
    status: status,
    listBrowserVoices: listBrowserVoices,
    setBrowserVoice: setBrowserVoice
  };
})();
