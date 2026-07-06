/* ============================================================================
 * config.js — runtime configuration for the Survival Finnish frontend.
 *
 * Edit this file (or override at deploy time) to point the app at your
 * ElevenLabs-backed TTS server. Everything degrades gracefully:
 *
 *   1. If a pre-generated MP3 exists (audio/<hash>.mp3 listed in the
 *      manifest), it is played — no network/API key needed at runtime.
 *   2. Otherwise, if `apiBase` is set, the app asks that backend to
 *      synthesize the phrase with ElevenLabs (and the backend caches it).
 *   3. Otherwise it falls back to the browser's built-in speech synthesis.
 * ==========================================================================*/
window.SF_CONFIG = {
  /* Base URL of the deployed backend (backend/server.js), WITHOUT a trailing
   * slash. Leave "" to disable the live TTS proxy and rely on pre-generated
   * audio + browser speech. Example: "https://survival-finnish-api.onrender.com" */
  apiBase: "",

  /* Directory (relative to index.html) that holds pre-generated MP3s and
   * their manifest.json. Produced by scripts/pregenerate-audio.mjs. */
  audioBase: "audio",

  /* Playback speed hint passed to the browser speech-synthesis fallback. */
  fallbackRate: 0.9
};
