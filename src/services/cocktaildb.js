// CocktailDB API Service
// Calls serverless functions at /api/cocktaildb/*
// API proxied for consistency and potential rate limiting

/**
 * Search cocktails by name
 * @param {string} name - Cocktail name to search
 * @returns {Promise<Array>} Array of cocktails
 */
export const searchCocktailByName = async (name) => {
  const response = await fetch(`/api/cocktaildb/search?s=${encodeURIComponent(name)}`);
  const data = await response.json();
  return data.drinks || [];
};

/**
 * Get cocktail details by ID
 * @param {string} id - Cocktail ID
 * @returns {Promise<Object|null>} Cocktail details
 */
export const getCocktailById = async (id) => {
  const response = await fetch(`/api/cocktaildb/lookup?i=${id}`);
  const data = await response.json();
  return data.drinks ? data.drinks[0] : null;
};

/**
 * Get a random cocktail
 * @returns {Promise<Object|null>} Random cocktail
 */
export const getRandomCocktail = async () => {
  const response = await fetch('/api/cocktaildb/random');
  const data = await response.json();
  return data.drinks ? data.drinks[0] : null;
};

/**
 * Search cocktails by first letter
 * @param {string} letter - First letter (a-z)
 * @returns {Promise<Array>} Array of cocktails
 */
export const searchCocktailByLetter = async (letter) => {
  const response = await fetch(`/api/cocktaildb/search?f=${letter}`);
  const data = await response.json();
  return data.drinks || [];
};

