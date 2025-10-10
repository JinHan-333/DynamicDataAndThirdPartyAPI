// Placeholder image URLs for development
export const PLACEHOLDER_IMAGES = {
  // Cocktail placeholder
  cocktail: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Cocktail',

  // Ingredient placeholders
  ingredient: 'https://via.placeholder.com/150x150/2a2a2a/ffffff?text=Ingredient',

  // Hero/Banner placeholders
  hero: 'https://via.placeholder.com/1200x400/1a1a1a/ffffff?text=Hero+Image',

  // Default fallback
  default: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Image',
}

// Helper function to get placeholder or actual image
export const getImageUrl = (url, type = 'default') => {
  return url || PLACEHOLDER_IMAGES[type] || PLACEHOLDER_IMAGES.default
}
