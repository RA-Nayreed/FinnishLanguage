#!/usr/bin/env node
/* ============================================================================
 * pregenerate-audio.mjs
 *
 * Walks the course data, collects every spoken Finnish phrase, and renders
 * each one to  frontend/audio/<hash>.mp3  using ElevenLabs. Writes
 * frontend/audio/manifest.json (the list of available hashes) so the
 * frontend can play the pre-rendered files with no backend and no API key at
 * runtime - useful for a static Vercel deployment.
 *
 * The <hash> is Lingua.hashPhrase(text) - the SAME hash the browser computes
 * for say(text), so a lookup is a simple manifest membership test.
 *
 * Env:
 *   ELEVENLABS_API_KEY   (required; without it the script writes an empty
 *                         manifest and exits 0 so the site still builds)
 *   ELEVENLABS_VOICE_ID  (default George)
 *   ELEVENLABS_MODEL     (default eleven_multilingual_v2)
 *   AUDIO_CONCURRENCY    (default 4)
 *   PREGEN_NUM_MAX       (default 100 - pre-render numbers 0..N)
 *
 * Usage:  node scripts/pregenerate-audio.mjs
 * ==========================================================================*/
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');
const AUDIO_DIR = path.join(FRONTEND, 'audio');

const Lingua = require(path.join(FRONTEND, 'shared', 'lingua.js'));
const { hashPhrase, numFi, clockFi } = Lingua;

const PLACEHOLDER_KEYS = new Set([
  'sk_3767267f32ebbb4522e33d2869d7ae7f934abe292be8f362',
  'sk_real_elevenlabs_key_here',
  'your_real_elevenlabs_key_here'
]);
const PLACEHOLDER_PATTERN = /(placeholder|example|changeme|your[_-]?real|real[_-]?elevenlabs[_-]?key[_-]?here)/i;
const RAW_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const RAW_API_KEY_TRIMMED = String(RAW_API_KEY).trim();
const IS_PLACEHOLDER_KEY = !RAW_API_KEY_TRIMMED || PLACEHOLDER_KEYS.has(RAW_API_KEY_TRIMMED) || PLACEHOLDER_PATTERN.test(RAW_API_KEY_TRIMMED);
const API_KEY = IS_PLACEHOLDER_KEY ? '' : RAW_API_KEY_TRIMMED;
const KEY_STATUS = API_KEY ? 'configured' : (RAW_API_KEY ? 'placeholder_key' : 'missing_key');
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
const CONCURRENCY = Number(process.env.AUDIO_CONCURRENCY || 4);
const NUM_MAX = Number(process.env.PREGEN_NUM_MAX || 100);

/* ---- 1. collect every spoken phrase ------------------------------------ */
function collectPhrases() {
  const phrases = new Set();
  const add = (t) => { const s = String(t == null ? '' : t).trim(); if (s) phrases.add(s); };

  // Run data.js in a sandbox where spk() records its argument. Building the
  // MODULES / DECKS literals fires every spk()/vgrid()/dlg() call.
  const dataSrc = fs.readFileSync(path.join(FRONTEND, 'js', 'data.js'), 'utf8');
  const sandbox = {
    esc: (s) => String(s),
    spk: (t) => { add(t); return ''; },
    say: () => {},
    ttsOK: true,
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(dataSrc, sandbox, { filename: 'data.js' });

  // Alphabet letter-names (spoken from the onclick handlers).
  (sandbox.ALPHA || []).forEach((a) => add(a[1]));

  // Flashcard fronts (spoken on each card).
  (sandbox.DECKS || []).forEach((d) => d.cards.forEach((c) => add(c[0])));

  // Dynamic generators: numbers 0..NUM_MAX and every clock string.
  for (let n = 0; n <= NUM_MAX; n++) add(numFi(n));
  const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  for (let h = 1; h <= 12; h++) for (const m of mins) add('kello on ' + clockFi(h, m));

  return [...phrases];
}

/* ---- 2. synthesize with ElevenLabs ------------------------------------- */
async function validateApiKey() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': API_KEY, Accept: 'application/json' },
      signal: controller.signal
    });
    if (!res.ok) return { valid: false, reason: `invalid_key_${res.status}` };
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: e.name === 'AbortError' ? 'validation_timeout' : 'validation_failed' };
  } finally {
    clearTimeout(timeout);
  }
}

async function synth(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true }
    })
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
  return Buffer.from(await res.arrayBuffer());
}

/* ---- 3. drive it ------------------------------------------------------- */
async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  if (process.env.VERCEL && process.env.PREGENERATE_AUDIO !== 'true') {
    console.warn('! PREGENERATE_AUDIO is not true, writing an empty manifest.');
    console.warn('  Vercel will use live /api/tts audio instead of build-time MP3 generation.');
    fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'), '[]');
    return;
  }

  const phrases = collectPhrases();
  console.log(`Collected ${phrases.length} unique Finnish phrases.`);

  if (!API_KEY) {
    console.warn(KEY_STATUS === 'placeholder_key'
      ? '! ELEVENLABS_API_KEY is a placeholder value, writing an empty manifest.'
      : '! ELEVENLABS_API_KEY not set, writing an empty manifest.');
    console.warn('  The site will fall back to the browser voice / live backend.');
    fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'), '[]');
    return;
  }

  const validation = await validateApiKey();
  if (!validation.valid) {
    console.warn(`! ELEVENLABS_API_KEY was rejected (${validation.reason}), writing an empty manifest.`);
    console.warn('  Set a real ElevenLabs key to generate MP3 files.');
    fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'), '[]');
    return;
  }

  const targets = phrases.map((text) => ({ text, hash: hashPhrase(text), file: '' }));
  targets.forEach((t) => { t.file = path.join(AUDIO_DIR, t.hash + '.mp3'); });

  let done = 0, made = 0, skipped = 0, failed = 0;
  const queue = targets.slice();

  async function worker() {
    while (queue.length) {
      const t = queue.shift();
      done++;
      if (fs.existsSync(t.file) && fs.statSync(t.file).size > 0) { skipped++; continue; }
      try {
        const buf = await synth(t.text);
        fs.writeFileSync(t.file, buf);
        made++;
        if (made % 25 === 0) console.log(`  …${done}/${targets.length} (new ${made})`);
      } catch (e) {
        failed++;
        console.warn(`  ✗ "${t.text.slice(0, 40)}": ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

  // Manifest = every target whose mp3 exists on disk.
  const manifest = targets.filter((t) => fs.existsSync(t.file) && fs.statSync(t.file).size > 0).map((t) => t.hash);
  fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'), JSON.stringify(manifest));
  console.log(`Done. new=${made} cached=${skipped} failed=${failed} manifest=${manifest.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
