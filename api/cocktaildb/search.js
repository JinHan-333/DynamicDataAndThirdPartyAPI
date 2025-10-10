// Vercel Serverless Function - CocktailDB Search
// Handles: search by name (s), search by letter (f), search ingredient (i)

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { s, f, i } = req.query;

  try {
    let url;
    if (s) {
      // Search by name
      url = `${BASE_URL}/search.php?s=${encodeURIComponent(s)}`;
    } else if (f) {
      // Search by first letter
      url = `${BASE_URL}/search.php?f=${encodeURIComponent(f)}`;
    } else if (i) {
      // Search ingredient by name
      url = `${BASE_URL}/search.php?i=${encodeURIComponent(i)}`;
    } else {
      return res.status(400).json({ error: 'Missing search parameter: s, f, or i required' });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'CocktailDB API request failed'
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
