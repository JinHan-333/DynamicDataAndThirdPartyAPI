// Vercel Serverless Function - CocktailDB Random
// Returns a random cocktail

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${BASE_URL}/random.php`);

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
