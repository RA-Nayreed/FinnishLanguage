const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const DEFAULT_MODEL = 'eleven_multilingual_v2';

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  return res.status(200).json({
    ok: true,
    provider: 'elevenlabs',
    keyConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    voice: process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID,
    model: process.env.ELEVENLABS_MODEL || DEFAULT_MODEL
  });
};
