#!/usr/bin/env node
/* ============================================================================
 * batch-generate-audio.mjs
 *
 * Generates one audio batch with ElevenLabs timestamps, then crops each phrase
 * into frontend/audio/<hash>.mp3 using ffmpeg. This reduces API request count
 * while preserving the same manifest lookup used by the browser.
 *
 * Env:
 *   TTS_TIMESTAMPS_API_URL  optional deployed /api/tts-timestamps URL
 *   ELEVENLABS_API_KEY      optional direct ElevenLabs key when no proxy is used
 *   ELEVENLABS_VOICE_ID     default George
 *   ELEVENLABS_MODEL        default eleven_multilingual_v2
 *   ELEVENLABS_OUTPUT_FORMAT default mp3_44100_128
 *   AUDIO_CONCURRENCY       crop concurrency, default 4
 *   BATCH_CHAR_LIMIT        max chars per timing request, default 3500
 *   PREGEN_NUM_MAX          default 100
 *   PREGEN_LIMIT            optional cap for test runs
 *   AUDIO_OUT_DIR           optional output directory, default frontend/audio
 * ==========================================================================*/
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

loadEnvFile(path.join(ROOT, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));
loadEnvFile(path.join(ROOT, 'backend', '.env'));

const Lingua = require(path.join(FRONTEND, 'shared', 'lingua.js'));
const { hashPhrase, numFi, clockFi } = Lingua;

const PLACEHOLDER_KEYS = new Set([
  'sk_3767267f32ebbb4522e33d2869d7ae7f934abe292be8f362',
  'sk_real_elevenlabs_key_here',
  'your_real_elevenlabs_key_here'
]);
const PLACEHOLDER_PATTERN = /(placeholder|example|changeme|your[_-]?real|real[_-]?elevenlabs[_-]?key[_-]?here)/i;
const TIMING_API_URL = String(process.env.TTS_TIMESTAMPS_API_URL || '').trim();
const API_KEY_RAW = String(process.env.ELEVENLABS_API_KEY || '').trim();
const API_KEY = !API_KEY_RAW || PLACEHOLDER_KEYS.has(API_KEY_RAW) || PLACEHOLDER_PATTERN.test(API_KEY_RAW) ? '' : API_KEY_RAW;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
const OUTPUT_FORMAT = process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128';
const AUDIO_DIR = process.env.AUDIO_OUT_DIR ? path.resolve(process.env.AUDIO_OUT_DIR) : path.join(FRONTEND, 'audio');
const CONCURRENCY = Math.max(1, Number(process.env.AUDIO_CONCURRENCY || 4));
const BATCH_CHAR_LIMIT = Math.max(300, Number(process.env.BATCH_CHAR_LIMIT || 3500));
const NUM_MAX = Number(process.env.PREGEN_NUM_MAX || 100);
const PREGEN_LIMIT = Number(process.env.PREGEN_LIMIT || 0);
const START_PAD = Number(process.env.CROP_START_PAD || 0.025);
const END_PAD = Number(process.env.CROP_END_PAD || 0.075);
const GAP = Number(process.env.CROP_MIN_GAP || 0.015);
const SEPARATOR = '\n\n';

function collectPhrases() {
  const phrases = new Set();
  const add = (t) => { const s = String(t == null ? '' : t).trim(); if (s) phrases.add(s); };
  const dataSrc = fs.readFileSync(path.join(FRONTEND, 'js', 'data.js'), 'utf8');
  const sandbox = { esc: String, spk: (t) => { add(t); return ''; }, say: () => {}, ttsOK: true, console };
  vm.createContext(sandbox);
  vm.runInContext(dataSrc, sandbox, { filename: 'data.js' });
  (sandbox.ALPHA || []).forEach((a) => add(a[1]));
  (sandbox.DECKS || []).forEach((d) => d.cards.forEach((c) => add(c[0])));
  for (let n = 0; n <= NUM_MAX; n++) add(numFi(n));
  const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  for (let h = 1; h <= 12; h++) for (const m of mins) add('kello on ' + clockFi(h, m));
  return [...phrases];
}

function batchTargets(targets) {
  const batches = [];
  let current = [];
  let length = 0;
  for (const target of targets) {
    const extra = target.text.length + (current.length ? SEPARATOR.length : 0);
    if (current.length && length + extra > BATCH_CHAR_LIMIT) {
      batches.push(current);
      current = [];
      length = 0;
    }
    current.push(target);
    length += extra;
  }
  if (current.length) batches.push(current);
  return batches;
}

function makeBatchText(batch) {
  return batch.map((target) => target.text).join(SEPARATOR);
}

async function requestTiming(text) {
  if (TIMING_API_URL) {
    const response = await fetch(TIMING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ text, voice: VOICE_ID, model: MODEL, output_format: OUTPUT_FORMAT })
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`timing proxy ${response.status}: ${body.slice(0, 240)}`);
    return JSON.parse(body);
  }
  if (!API_KEY) throw new Error('Set TTS_TIMESTAMPS_API_URL or ELEVENLABS_API_KEY.');
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(VOICE_ID)}/with-timestamps?output_format=${encodeURIComponent(OUTPUT_FORMAT)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0, use_speaker_boost: true }
    })
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${body.slice(0, 240)}`);
  return JSON.parse(body);
}

function findPhraseWindows(batch, alignment) {
  const chars = alignment && Array.isArray(alignment.characters) ? alignment.characters : [];
  const starts = alignment && Array.isArray(alignment.character_start_times_seconds) ? alignment.character_start_times_seconds : [];
  const ends = alignment && Array.isArray(alignment.character_end_times_seconds) ? alignment.character_end_times_seconds : [];
  const alignedText = chars.join('');
  let cursor = 0;
  return batch.map((target) => {
    const idx = alignedText.indexOf(target.text, cursor);
    if (idx < 0) throw new Error(`Could not align phrase: ${target.text.slice(0, 80)}`);
    const phraseEnd = idx + target.text.length - 1;
    cursor = phraseEnd + 1;

    let first = idx;
    while (first <= phraseEnd && !Number.isFinite(starts[first])) first++;
    let last = phraseEnd;
    while (last >= idx && !Number.isFinite(ends[last])) last--;
    if (first > phraseEnd || last < idx) throw new Error(`No timing data for phrase: ${target.text.slice(0, 80)}`);
    return { target, start: starts[first], end: ends[last] };
  });
}

function padWindows(windows) {
  return windows.map((window, i) => {
    const next = windows[i + 1];
    let start = Math.max(0, window.start - START_PAD);
    let end = window.end + END_PAD;
    if (next) end = Math.min(end, Math.max(start + 0.05, next.start - GAP));
    return { ...window, start, end };
  });
}

async function cropAudio(batchFile, window) {
  const duration = Math.max(0.05, window.end - window.start);
  await execFileAsync('ffmpeg', [
    '-y', '-v', 'error',
    '-ss', window.start.toFixed(3),
    '-t', duration.toFixed(3),
    '-i', batchFile,
    '-vn', '-acodec', 'libmp3lame', '-q:a', '4',
    window.target.file
  ]);
}

async function cropWindows(batchFile, windows) {
  const queue = windows.slice();
  let made = 0;
  async function worker() {
    while (queue.length) {
      const window = queue.shift();
      await cropAudio(batchFile, window);
      made++;
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, windows.length) }, worker));
  return made;
}

async function main() {
  await execFileAsync('ffmpeg', ['-version']);
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  let targets = collectPhrases().map((text) => ({ text, hash: hashPhrase(text), file: '' }));
  if (PREGEN_LIMIT > 0) targets = targets.slice(0, PREGEN_LIMIT);
  targets.forEach((target) => { target.file = path.join(AUDIO_DIR, target.hash + '.mp3'); });

  const missing = targets.filter((target) => !fs.existsSync(target.file) || fs.statSync(target.file).size === 0);
  const batches = batchTargets(missing);
  console.log(`Collected ${targets.length} phrase(s). Missing ${missing.length}. Batches ${batches.length}.`);
  console.log(TIMING_API_URL ? `Rendering through ${TIMING_API_URL}` : `Rendering directly with voice ${VOICE_ID}.`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-audio-batches-'));
  let made = 0;
  let failed = 0;
  try {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const text = makeBatchText(batch);
      console.log(`Batch ${i + 1}/${batches.length}: ${batch.length} phrase(s), ${text.length} chars.`);
      try {
        const payload = await requestTiming(text);
        const audio = Buffer.from(payload.audio_base64 || '', 'base64');
        if (!audio.length) throw new Error('No audio_base64 in timing response.');
        const batchFile = path.join(tmpDir, `batch-${String(i + 1).padStart(4, '0')}.mp3`);
        fs.writeFileSync(batchFile, audio);
        const alignment = payload.alignment || payload.normalized_alignment;
        const windows = padWindows(findPhraseWindows(batch, alignment));
        made += await cropWindows(batchFile, windows);
      } catch (e) {
        failed += batch.length;
        console.warn(`  failed batch ${i + 1}: ${String(e.message || e).slice(0, 300)}`);
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const manifest = targets
    .filter((target) => fs.existsSync(target.file) && fs.statSync(target.file).size > 0)
    .map((target) => target.hash);
  fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'), JSON.stringify(manifest));
  console.log(`Done. made=${made} failed=${failed} manifest=${manifest.length}`);
  if (failed) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
