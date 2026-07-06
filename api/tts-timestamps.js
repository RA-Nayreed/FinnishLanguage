const { getApiKey, isPlaceholderKey } = require('./elevenlabs');

const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';
const DEFAULT_MODEL = 'eleven_multilingual_v2';
const MAX_TEXT_LENGTH = 5000;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return { text: req.body }; }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > MAX_TEXT_LENGTH + 2000) req.destroy();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { resolve({ text: raw }); }
    });
    req.on('error', reject);
  });
}

function getQuery(req) {
  return new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`).searchParams;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const apiKey = getApiKey();
  if (isPlaceholderKey(apiKey)) return res.status(501).json({ error: apiKey ? 'elevenlabs_placeholder_key' : 'elevenlabs_key_missing' });

  const query = getQuery(req);
  const body = await readBody(req);
  const text = String(body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text_required' });
  if (text.length > MAX_TEXT_LENGTH) return res.status(413).json({ error: 'text_too_long', max: MAX_TEXT_LENGTH });

  const voice = String(query.get('voice') || body.voice || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID).trim();
  const model = String(query.get('model') || body.model || process.env.ELEVENLABS_MODEL || DEFAULT_MODEL).trim();
  const outputFormat = String(query.get('output_format') || body.output_format || process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128').trim();

  const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/with-timestamps?output_format=${encodeURIComponent(outputFormat)}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: {
        stability: Number(process.env.ELEVENLABS_STABILITY || 0.55),
        similarity_boost: Number(process.env.ELEVENLABS_SIMILARITY_BOOST || 0.8),
        style: Number(process.env.ELEVENLABS_STYLE || 0),
        use_speaker_boost: process.env.ELEVENLABS_SPEAKER_BOOST !== 'false'
      }
    })
  });

  const payload = await upstream.text();
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
  res.setHeader('Cache-Control', 'private, no-store');
  return res.status(upstream.status).send(payload);
};
