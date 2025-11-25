const API_URL = '/api';
const BASE_URL = '/api/recipes';
const FAVORITES_URL = '/api/favorites';
const METADATA_URL = '/api/metadata';

export const getCustomRecipes = async (name = '') => {
  const url = name ? `${BASE_URL}?name=${encodeURIComponent(name)}` : BASE_URL;
  const response = await fetch(url);
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
  const response = await fetch(`${API_URL}/favorites`);
  if (!response.ok) throw new Error('Failed to fetch favorites'); // Re-added error handling
  return response.json();
};

export const createFavoriteGroup = async (name) => {
  const response = await fetch(`${API_URL}/favorites/group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create favorite group'); // Added error handling
  return response.json();
};

export const deleteFavoriteGroup = async (id) => {
  const response = await fetch(`${API_URL}/favorites/group/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete favorite group'); // Added error handling
  return response.json();
};

export const addToFavorites = async (recipeId, groupId = null) => {
  const response = await fetch(`${API_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId, groupId }),
  });
  if (!response.ok) throw new Error('Failed to add to favorites'); // Re-added error handling
  return response.json();
};

export const removeFromFavorites = async (recipeId, groupId = null) => {
  let url = `${API_URL}/favorites/${recipeId}`;
  if (groupId) {
    url += `?groupId=${groupId}`;
  }
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove from favorites'); // Re-added error handling
  return response.json();
};

export const getMetadata = async () => {
  const response = await fetch(METADATA_URL);
  if (!response.ok) throw new Error('Failed to fetch metadata');
  return response.json();
};
