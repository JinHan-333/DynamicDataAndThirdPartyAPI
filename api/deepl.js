// Vercel Serverless Function - DeepL Proxy
// Protects API key from client exposure

export default async function handler(req, res) {
  const API_KEY = process.env.DEEPL_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'DeepL API key not configured' });
  }

  // Determine which endpoint to call based on query parameter or path
  const { endpoint = 'translate' } = req.query;

  if (endpoint === 'translate') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, target_lang, source_lang } = req.body;

    if (!text || !target_lang) {
      return res.status(400).json({ error: 'Text and target_lang are required' });
    }

    try {
      const body = {
        text: Array.isArray(text) ? text : [text],
        target_lang: target_lang.toUpperCase(),
      };

      if (source_lang) {
        body.source_lang = source_lang.toUpperCase();
      }

      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errorData.message || 'Translation failed'
        });
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (endpoint === 'languages') {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { type = 'target' } = req.query;
      const params = new URLSearchParams({ type });

      const response = await fetch(`https://api-free.deepl.com/v2/languages?${params}`, {
        headers: {
          'Authorization': `DeepL-Auth-Key ${API_KEY}`,
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: 'Failed to fetch languages'
        });
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid endpoint parameter' });
  }
}
