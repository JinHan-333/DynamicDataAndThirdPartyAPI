// Vercel Serverless Function - CocktailDB Filter
// Handles: filter by ingredient (i), category (c), alcoholic status (a)

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { i, c, a } = req.query;

  try {
    let url;
    if (i) {
      // Filter by ingredient
      url = `${BASE_URL}/filter.php?i=${encodeURIComponent(i)}`;
    } else if (c) {
      // Filter by category
      url = `${BASE_URL}/filter.php?c=${encodeURIComponent(c)}`;
    } else if (a) {
      // Filter by alcoholic status
      url = `${BASE_URL}/filter.php?a=${encodeURIComponent(a)}`;
    } else {
      return res.status(400).json({ error: 'Missing filter parameter: i, c, or a required' });
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
