/* ============================================================================
 * server.js - Survival Finnish TTS backend.
 *
 * A thin, cache-first proxy in front of the ElevenLabs text-to-speech API.
 * The browser never sees your API key: it asks this server for audio, the
 * server synthesizes (or serves a cached MP3) and streams it back.
 *
 *   GET  /api/health           -> { ok, voice, model, cached }
 *   GET  /api/voices           -> ElevenLabs voice list (proxied)
 *   GET  /api/tts?text=...      -> audio/mpeg  (also &voice=<id> to override)
 *   POST /api/tts  {text,voice} -> audio/mpeg
 *
 * Config via environment (see .env.example):
 *   ELEVENLABS_API_KEY   (required for live synthesis)
 *   ELEVENLABS_VOICE_ID  (default: Rachel - multilingual capable)
 *   ELEVENLABS_MODEL     (default: eleven_multilingual_v2, supports Finnish)
 *   PORT                 (default: 8787)
 *   CACHE_DIR            (default: ./cache)
 *   CORS_ORIGIN          (default: * )
 * ==========================================================================*/
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PLACEHOLDER_KEYS = new Set([
  'sk_3767267f32ebbb4522e33d2869d7ae7f934abe292be8f362',
  'sk_real_elevenlabs_key_here',
  'your_real_elevenlabs_key_here'
]);
const PLACEHOLDER_PATTERN = /(placeholder|example|changeme|your[_-]?real|real[_-]?elevenlabs[_-]?key[_-]?here)/i;

function isPlaceholderKey(value) {
  const key = String(value || '').trim();
  return !key || PLACEHOLDER_KEYS.has(key) || PLACEHOLDER_PATTERN.test(key);
}

function normalizeApiKey(value) {
  const key = String(value || '').trim();
  return isPlaceholderKey(key) ? '' : key;
}

const PORT = process.env.PORT || 8787;
const RAW_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const API_KEY = normalizeApiKey(RAW_API_KEY);
const KEY_STATUS = API_KEY ? 'configured' : (RAW_API_KEY ? 'placeholder_key' : 'missing_key');
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // "Rachel"
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
const CACHE_DIR = process.env.CACHE_DIR || path.join(__dirname, 'cache');
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

fs.mkdirSync(CACHE_DIR, { recursive: true });

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '64kb' }));

/* ---- helpers ----------------------------------------------------------- */
function cacheKey(text, voice) {
  return crypto.createHash('sha1').update(voice + '|' + MODEL + '|' + text).digest('hex');
}
function cachePath(key) { return path.join(CACHE_DIR, key + '.mp3'); }

async function synthesize(text, voice) {
  if (!API_KEY) {
    const err = new Error(KEY_STATUS === 'placeholder_key'
      ? 'ELEVENLABS_API_KEY is a placeholder value. Set a real ElevenLabs key.'
      : 'ELEVENLABS_API_KEY is not configured on the server.');
    err.status = 501;
    throw err;
  }
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true }
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(`ElevenLabs error ${res.status}: ${detail.slice(0, 300)}`);
    err.status = res.status === 401 ? 502 : res.status;
    throw err;
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Return a cached MP3 buffer or synthesize + cache it. */
async function getAudio(text, voice) {
  const key = cacheKey(text, voice);
  const file = cachePath(key);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const buf = await synthesize(text, voice);
  fs.writeFileSync(file, buf);
  return buf;
}

function sendAudio(res, buf) {
  res.set('Content-Type', 'audio/mpeg');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(buf);
}

/* ---- routes ------------------------------------------------------------ */
app.get('/api/health', (_req, res) => {
  let cached = 0;
  try { cached = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.mp3')).length; } catch {}
  res.json({ ok: true, keyConfigured: !!API_KEY, keyStatus: KEY_STATUS, voice: VOICE_ID, model: MODEL, cached });
});

app.get('/api/voices', async (_req, res) => {
  if (!API_KEY) return res.status(501).json({ error: KEY_STATUS === 'placeholder_key' ? 'elevenlabs_placeholder_key' : 'elevenlabs_key_missing' });
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': API_KEY } });
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
});

async function handleTts(req, res) {
  const text = (req.method === 'GET' ? req.query.text : req.body.text || '');
  const voice = (req.method === 'GET' ? req.query.voice : req.body.voice) || VOICE_ID;
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing "text"' });
  if (text.length > 500) return res.status(413).json({ error: 'Text too long (max 500 chars)' });
  try {
    const buf = await getAudio(text, String(voice));
    sendAudio(res, buf);
  } catch (e) {
    res.status(e.status || 500).json({ error: String(e.message || e) });
  }
}
app.get('/api/tts', handleTts);
app.post('/api/tts', handleTts);

/* Optionally serve the static frontend when co-hosted (single-service deploy). */
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(FRONTEND_DIR)) {
  app.use('/', express.static(FRONTEND_DIR));
}

app.listen(PORT, () => {
  console.log(`Survival Finnish TTS backend on :${PORT}`);
  console.log(`  voice=${VOICE_ID} model=${MODEL} key=${KEY_STATUS}`);
  console.log(`  cache=${CACHE_DIR}`);
});
