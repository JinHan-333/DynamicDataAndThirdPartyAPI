const express = require('express');
const router = express.Router();
const axios = require('axios');

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2';

// Helper to handle DeepL requests
const callDeepL = async (endpoint, data, res) => {
  if (!DEEPL_API_KEY) {
    return res.status(500).json({ error: 'DeepL API key not configured' });
  }

  try {
    const response = await axios.post(`${DEEPL_API_URL}/${endpoint}`, data, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(`DeepL API Error (${endpoint}):`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || 'Translation failed' 
    });
  }
};

router.post('/', async (req, res) => {
  const { endpoint } = req.query;
  
  if (endpoint === 'translate') {
    await callDeepL('translate', req.body, res);
  } else {
    res.status(400).json({ error: 'Invalid endpoint' });
  }
});

router.get('/', async (req, res) => {
  const { endpoint, type } = req.query;

  if (endpoint === 'languages') {
    if (!DEEPL_API_KEY) {
      return res.status(500).json({ error: 'DeepL API key not configured' });
    }
    try {
      const response = await axios.get(`${DEEPL_API_URL}/languages?type=${type || 'target'}`, {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('DeepL API Error (languages):', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: 'Failed to fetch languages' });
    }
  } else {
    res.status(400).json({ error: 'Invalid endpoint' });
  }
});

module.exports = router;
