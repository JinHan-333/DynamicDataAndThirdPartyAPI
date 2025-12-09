// Use environment variable for production backend URL, or relative path for development
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || '';
const API_URL = `${BACKEND_BASE}/api`;
const BASE_URL = `${BACKEND_BASE}/api/recipes`;
const FAVORITES_URL = `${BACKEND_BASE}/api/favorites`;
const METADATA_URL = `${BACKEND_BASE}/api/metadata`;

export const signup = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const text = await response.text();
    try {
        const error = JSON.parse(text);
        throw new Error(error.error || 'Failed to sign up');
    } catch (e) {
        throw new Error(text || `Signup failed with status ${response.status}`);
    }
  }
  return response.json();
};

export const signin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const text = await response.text();
    try {
        const error = JSON.parse(text);
        throw new Error(error.error || 'Failed to sign in');
    } catch (e) {
        throw new Error(text || `Signin failed with status ${response.status}`);
    }
  }
  return response.json();
};

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getCustomRecipes = async (name = '') => {
  const url = name ? `${BASE_URL}?name=${encodeURIComponent(name)}` : BASE_URL;
  const headers = getHeaders();
  // Remove Content-Type for GET
  delete headers['Content-Type'];
  
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
};

export const getCustomRecipeById = async (id) => {
  const headers = getHeaders();
  delete headers['Content-Type'];
  const response = await fetch(`${BASE_URL}/${id}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch recipe');
  return response.json();
};

export const getMyRecipes = async () => {
    const headers = getHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/my-recipes`, { headers });
    if (!response.ok) throw new Error('Failed to fetch my recipes');
    return response.json();
};

export const createRecipe = async (recipeData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(recipeData),
  });
  if (!response.ok) throw new Error('Failed to create recipe');
  return response.json();
};

export const updateRecipe = async (id, recipeData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(recipeData),
  });
  if (!response.ok) throw new Error('Failed to update recipe');
  return response.json();
};

export const deleteRecipe = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete recipe');
  return response.json();
};

export const getFavorites = async () => {
  const response = await fetch(`${API_URL}/favorites`);
  if (!response.ok) throw new Error('Failed to fetch favorites');
  return response.json();
};

export const createFavoriteGroup = async (name) => {
  const response = await fetch(`${API_URL}/favorites/group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create favorite group');
  return response.json();
};

export const deleteFavoriteGroup = async (id) => {
  const response = await fetch(`${API_URL}/favorites/group/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete favorite group');
  return response.json();
};

export const addToFavorites = async (recipeId, groupId = null) => {
  const response = await fetch(`${API_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId, groupId }),
  });
  if (!response.ok) throw new Error('Failed to add to favorites');
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
  if (!response.ok) throw new Error('Failed to remove from favorites');
  return response.json();
};

export const getMetadata = async () => {
  const response = await fetch(METADATA_URL);
  if (!response.ok) throw new Error('Failed to fetch metadata');
  return response.json();
};
