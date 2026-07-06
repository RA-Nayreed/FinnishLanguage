const PLACEHOLDER_KEYS = new Set([
  'sk_3767267f32ebbb4522e33d2869d7ae7f934abe292be8f362',
  'sk_real_elevenlabs_key_here',
  'your_real_elevenlabs_key_here'
]);
const PLACEHOLDER_PATTERN = /(placeholder|example|changeme|your[_-]?real|real[_-]?elevenlabs[_-]?key[_-]?here)/i;

function getApiKey() {
  return String(process.env.ELEVENLABS_API_KEY || '').trim();
}

function isPlaceholderKey(key = getApiKey()) {
  const value = String(key || '').trim();
  return !value || PLACEHOLDER_KEYS.has(value) || PLACEHOLDER_PATTERN.test(value);
}

async function validateApiKey(key = getApiKey()) {
  if (isPlaceholderKey(key)) {
    return { valid: false, reason: key ? 'placeholder_key' : 'missing_key' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': key, Accept: 'application/json' },
      signal: controller.signal
    });
    if (!response.ok) {
      return { valid: false, reason: 'invalid_key', status: response.status };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, reason: error.name === 'AbortError' ? 'validation_timeout' : 'validation_failed' };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { getApiKey, isPlaceholderKey, validateApiKey };
