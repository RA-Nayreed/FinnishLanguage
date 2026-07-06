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

const VALIDATION_TTL_MS = 10 * 60 * 1000;
let validationCache = null;

function statusFromUpstream(status, detail) {
  if (status === 401 || status === 403) return 'invalid_key';
  if (/paid_plan_required|voice_not_found|voice.*not.*available/i.test(detail || '')) return 'voice_unavailable';
  return 'tts_unavailable';
}

async function validateApiKey(key = getApiKey(), options = {}) {
  if (isPlaceholderKey(key)) {
    return { valid: false, reason: key ? 'placeholder_key' : 'missing_key' };
  }

  const voice = String(options.voice || '').trim();
  const model = String(options.model || '').trim();
  if (!voice || !model) return { valid: true };

  const cacheKey = key + '|' + voice + '|' + model;
  const now = Date.now();
  if (validationCache && validationCache.cacheKey === cacheKey && now - validationCache.time < VALIDATION_TTL_MS) {
    return validationCache.result;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_22050_32`, {
      method: 'POST',
      headers: {
        'xi-api-key': key,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg'
      },
      body: JSON.stringify({
        text: 'Hei',
        model_id: model,
        voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0, use_speaker_boost: true }
      }),
      signal: controller.signal
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const result = { valid: false, reason: statusFromUpstream(response.status, detail), status: response.status };
      validationCache = { cacheKey, time: now, result };
      return result;
    }
    await response.arrayBuffer().catch(() => null);
    const result = { valid: true };
    validationCache = { cacheKey, time: now, result };
    return result;
  } catch (error) {
    return { valid: false, reason: error.name === 'AbortError' ? 'validation_timeout' : 'validation_failed' };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { getApiKey, isPlaceholderKey, validateApiKey };
