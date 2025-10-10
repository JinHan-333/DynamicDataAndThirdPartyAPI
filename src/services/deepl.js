// DeepL Translation Service
// API Documentation: https://www.deepl.com/docs-api
// Requires API key (configured in .env as VITE_DEEPL_API_KEY)
// Implementation in Phase 6

const API_KEY = import.meta.env.VITE_DEEPL_API_KEY;

/**
 * Translate text using DeepL API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'ES', 'FR', 'DE')
 * @param {string} sourceLang - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<Object>} Translation result
 */
export const translateText = async (text, targetLang, sourceLang = null) => {
  if (!API_KEY || API_KEY === 'your_deepl_api_key_here') {
    throw new Error('DeepL API key not configured. Please set VITE_DEEPL_API_KEY in .env file.');
  }

  if (!text || !targetLang) {
    throw new Error('Text and target language are required');
  }

  const baseUrl = '/api/deepl/v2/translate';
  const body = {
    text: [text],
    target_lang: targetLang.toUpperCase(),
  };

  if (sourceLang) {
    body.source_lang = sourceLang.toUpperCase();
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Translation failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    translatedText: data.translations[0].text,
    detectedSourceLang: data.translations[0].detected_source_language,
  };
};

/**
 * Get list of supported languages
 * @returns {Promise<Array>} Array of supported languages
 */
export const getSupportedLanguages = async () => {
  if (!API_KEY || API_KEY === 'your_deepl_api_key_here') {
    throw new Error('DeepL API key not configured');
  }

  const baseUrl = '/api/deepl/v2/languages';
  const params = new URLSearchParams({
    type: 'target',
  });

  const response = await fetch(`${baseUrl}?${params}`, {
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
