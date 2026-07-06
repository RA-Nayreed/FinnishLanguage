const { getApiKey, validateApiKey } = require('./elevenlabs');

const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const DEFAULT_MODEL = 'eleven_multilingual_v2';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'private, max-age=60');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const keyStatus = await validateApiKey(getApiKey());
  return res.status(200).json({
    ok: true,
    provider: 'elevenlabs',
    keyConfigured: keyStatus.valid,
    keyStatus: keyStatus.valid ? 'valid' : keyStatus.reason,
    voice: process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID,
    model: process.env.ELEVENLABS_MODEL || DEFAULT_MODEL
  });
};
