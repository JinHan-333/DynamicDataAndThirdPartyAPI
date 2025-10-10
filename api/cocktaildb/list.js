// Vercel Serverless Function - CocktailDB List
// Handles: list ingredients (i), categories (c), glasses (g)

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  try {
    let url;
    if (type === 'ingredients') {
      url = `${BASE_URL}/list.php?i=list`;
    } else if (type === 'categories') {
      url = `${BASE_URL}/list.php?c=list`;
    } else if (type === 'glasses') {
      url = `${BASE_URL}/list.php?g=list`;
    } else {
      return res.status(400).json({ error: 'Missing or invalid type parameter: ingredients, categories, or glasses required' });
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
