const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Get the main favorites list (creating it if it doesn't exist)
router.get('/', async (req, res) => {
  try {
    let favorites = await Favorite.findOne({ name: 'My Favorites' });
    if (!favorites) {
      favorites = new Favorite({ name: 'My Favorites', recipes: [] });
      await favorites.save();
    }
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a recipe to favorites
router.post('/', async (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ message: 'Recipe ID is required' });

  try {
    let favorites = await Favorite.findOne({ name: 'My Favorites' });
    if (!favorites) {
      favorites = new Favorite({ name: 'My Favorites', recipes: [] });
    }

    if (!favorites.recipes.includes(recipeId)) {
      favorites.recipes.push(recipeId);
      await favorites.save();
    }
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a recipe from favorites
router.delete('/:id', async (req, res) => {
  try {
    let favorites = await Favorite.findOne({ name: 'My Favorites' });
    if (favorites) {
      favorites.recipes = favorites.recipes.filter(id => id !== req.params.id);
      await favorites.save();
    }
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
