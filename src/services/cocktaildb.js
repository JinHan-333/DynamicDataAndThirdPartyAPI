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

/**
 * List all available ingredients
 * @returns {Promise<Array>} Array of ingredients
 */
export const listIngredients = async () => {
  const response = await fetch('/api/cocktaildb/list?type=ingredients');
  const data = await response.json();
  return data.drinks || [];
};

/**
 * Search ingredient by name
 * @param {string} name - Ingredient name
 * @returns {Promise<Object|null>} Ingredient details
 */
export const searchIngredientByName = async (name) => {
  const response = await fetch(`/api/cocktaildb/search?i=${encodeURIComponent(name)}`);
  const data = await response.json();
  return data.ingredients ? data.ingredients[0] : null;
};

/**
 * Filter cocktails by ingredient
 * @param {string} ingredient - Ingredient name
 * @returns {Promise<Array>} Array of cocktails
 */
export const filterByIngredient = async (ingredient) => {
  const response = await fetch(`/api/cocktaildb/filter?i=${encodeURIComponent(ingredient)}`);
  const data = await response.json();
  return data.drinks || [];
};

/**
 * Filter cocktails by category
 * @param {string} category - Category name (e.g., "Cocktail", "Shot", "Ordinary Drink")
 * @returns {Promise<Array>} Array of cocktails
 */
export const filterByCategory = async (category) => {
  const response = await fetch(`/api/cocktaildb/filter?c=${encodeURIComponent(category)}`);
  const data = await response.json();
  return data.drinks || [];
};

/**
 * Filter cocktails by alcoholic status
 * @param {string} status - "Alcoholic", "Non_Alcoholic", or "Optional_alcohol"
 * @returns {Promise<Array>} Array of cocktails
 */
export const filterByAlcoholic = async (status) => {
  const response = await fetch(`/api/cocktaildb/filter?a=${encodeURIComponent(status)}`);
  const data = await response.json();
  return data.drinks || [];
};

/**
 * List all categories
 * @returns {Promise<Array>} Array of categories
 */
export const listCategories = async () => {
  const response = await fetch('/api/cocktaildb/list?type=categories');
  const data = await response.json();
  return data.drinks || [];
};

/**
 * List all glasses
 * @returns {Promise<Array>} Array of glass types
 */
export const listGlasses = async () => {
  const response = await fetch('/api/cocktaildb/list?type=glasses');
  const data = await response.json();
  return data.drinks || [];
};
