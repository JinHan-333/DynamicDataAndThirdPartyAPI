// DeepL Translation Service
// Calls serverless function at /api/deepl
// API key is protected on server-side

// Use environment variable for production backend URL, or relative path for development
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Translate text using DeepL API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'ES', 'FR', 'DE')
 * @param {string} sourceLang - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<Object>} Translation result
 */
export const translateText = async (text, targetLang, sourceLang = null) => {
  if (!text || !targetLang) {
    throw new Error('Text and target language are required');
  }

  const body = {
    text: [text],
    target_lang: targetLang.toUpperCase(),
  };

  if (sourceLang) {
    body.source_lang = sourceLang.toUpperCase();
  }

  const response = await fetch(`${BACKEND_BASE}/api/deepl?endpoint=translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Translation failed: ${response.status}`);
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
  const response = await fetch(`${BACKEND_BASE}/api/deepl?endpoint=languages&type=target`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch languages: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
