/* ============================================================================
 * config.js — runtime configuration for the Survival Finnish frontend.
 *
 * Audio degrades gracefully:
 *   1. Pre-generated MP3 from audio/<hash>.mp3, if listed in manifest.json.
 *   2. Live ElevenLabs through a backend or the Vercel same-origin /api routes.
 *   3. Browser speech synthesis as the final offline fallback.
 * ==========================================================================*/
window.SF_CONFIG = {
  /* "auto" checks the current origin for /api/health and uses /api/tts only
   * when ELEVENLABS_API_KEY is configured there. Use an explicit backend URL
   * such as "http://localhost:8787" or "https://example.com" to force a
   * remote backend. Use "" to disable live TTS entirely. */
  apiBase: "auto",

  /* Directory (relative to index.html) that holds pre-generated MP3s and
   * manifest.json. Produced by scripts/pregenerate-audio.mjs. */
  audioBase: "audio",

  /* Browser speech-synthesis fallback tuning. This only applies after MP3 and
   * ElevenLabs playback are unavailable. */
  fallbackRate: 0.86,
  fallbackPitch: 1.0
};
