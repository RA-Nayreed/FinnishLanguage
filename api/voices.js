const { getApiKey, isPlaceholderKey } = require('./elevenlabs');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

  const apiKey = getApiKey();
  if (isPlaceholderKey(apiKey)) return res.status(501).json({ error: apiKey ? 'elevenlabs_placeholder_key' : 'elevenlabs_key_missing' });

  const upstream = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey, 'Accept': 'application/json' }
  });
  const text = await upstream.text();
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
  res.setHeader('Cache-Control', 'private, max-age=300');
  return res.status(upstream.status).send(text);
};
