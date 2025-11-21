const BASE_URL = '/api/recipes';
const FAVORITES_URL = '/api/favorites';
const METADATA_URL = '/api/metadata';

export const getCustomRecipes = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
};

export const getCustomRecipeById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch recipe');
  return response.json();
};

export const createRecipe = async (recipeData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
  });
  if (!response.ok) throw new Error('Failed to create recipe');
  return response.json();
};

export const deleteRecipe = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete recipe');
  return response.json();
};

export const getFavorites = async () => {
  const response = await fetch(FAVORITES_URL);
  if (!response.ok) throw new Error('Failed to fetch favorites');
  return response.json();
};

export const addToFavorites = async (recipeId) => {
  const response = await fetch(FAVORITES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId }),
  });
  if (!response.ok) throw new Error('Failed to add to favorites');
  return response.json();
};

export const removeFromFavorites = async (recipeId) => {
  const response = await fetch(`${FAVORITES_URL}/${recipeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove from favorites');
  return response.json();
};

export const getMetadata = async () => {
  const response = await fetch(METADATA_URL);
  if (!response.ok) throw new Error('Failed to fetch metadata');
  return response.json();
};
