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

import { getCustomRecipeById } from './api';

/**
 * Get cocktail details by ID
 * @param {string} id - Cocktail ID
 * @returns {Promise<Object|null>} Cocktail details
 */
export const getCocktailById = async (id) => {
  // Try custom recipe first if ID looks like a MongoDB ObjectId (24 hex chars)
  if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
    try {
      const customRecipe = await getCustomRecipeById(id);
      if (customRecipe) {
        // Transform to match CocktailDB format
        return {
          idDrink: customRecipe._id,
          strDrink: customRecipe.name,
          strInstructions: customRecipe.instructions,
          strGlass: customRecipe.glass,
          strCategory: customRecipe.category,
          strDrinkThumb: customRecipe.image,
          strAlcoholic: 'Alcoholic', // Default for now
          // Map ingredients
          ...customRecipe.ingredients.reduce((acc, ing, i) => {
            acc[`strIngredient${i + 1}`] = ing.name;
            acc[`strMeasure${i + 1}`] = ing.measure;
            return acc;
          }, {})
        };
      }
    } catch (e) {
      // Ignore error and fall back to external API
      console.log('Not a custom recipe or failed to fetch, trying external API');
    }
  }

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

