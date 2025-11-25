const express = require('express');
const router = express.Router();
const axios = require('axios');

const COCKTAIL_DB_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// Helper function to fetch from CocktailDB
const fetchFromCocktailDB = async (endpoint, params, res) => {
  try {
    const response = await axios.get(`${COCKTAIL_DB_BASE_URL}${endpoint}`, { params });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching from CocktailDB (${endpoint}):`, error.message);
    res.status(500).json({ error: 'Failed to fetch data from CocktailDB' });
  }
};

// Search cocktails by name (?s=name) or first letter (?f=letter)
router.get('/search', async (req, res) => {
  const { s, f } = req.query;
  if (s) {
    await fetchFromCocktailDB('/search.php', { s }, res);
  } else if (f) {
    await fetchFromCocktailDB('/search.php', { f }, res);
  } else {
    res.status(400).json({ error: 'Missing search parameter (s or f)' });
  }
});

// Lookup cocktail by ID (?i=id)
router.get('/lookup', async (req, res) => {
  const { i } = req.query;
  if (!i) {
    return res.status(400).json({ error: 'Missing ID parameter (i)' });
  }
  await fetchFromCocktailDB('/lookup.php', { i }, res);
});

// Get random cocktail
router.get('/random', async (req, res) => {
  await fetchFromCocktailDB('/random.php', {}, res);
});

module.exports = router;
