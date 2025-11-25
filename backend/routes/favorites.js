const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Get all favorite groups
router.get('/', async (req, res) => {
  try {
    // Ensure default group exists
    let defaultGroup = await Favorite.findOne({ name: 'My Favorites' });
    if (!defaultGroup) {
      defaultGroup = new Favorite({ name: 'My Favorites', recipes: [] });
      await defaultGroup.save();
    }
    
    const favorites = await Favorite.find().sort({ createdAt: 1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new favorite group
router.post('/group', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Group name is required' });

  try {
    const existing = await Favorite.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Group already exists' });

    const newGroup = new Favorite({ name, recipes: [] });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a favorite group
router.delete('/group/:id', async (req, res) => {
  try {
    const group = await Favorite.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (group.name === 'My Favorites') {
      return res.status(400).json({ message: 'Cannot delete the default group' });
    }

    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a recipe to a group (default to "My Favorites" if no groupId)
router.post('/', async (req, res) => {
  const { recipeId, groupId } = req.body;
  if (!recipeId) return res.status(400).json({ message: 'Recipe ID is required' });

  try {
    let group;
    if (groupId) {
      group = await Favorite.findById(groupId);
    } else {
      group = await Favorite.findOne({ name: 'My Favorites' });
    }

    if (!group) {
        // Fallback create default if missing
        group = new Favorite({ name: 'My Favorites', recipes: [] });
    }

    if (!group.recipes.includes(recipeId)) {
      group.recipes.push(recipeId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a recipe from a group
router.delete('/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { groupId } = req.query; // Pass groupId as query param

  try {
    let group;
    if (groupId) {
      group = await Favorite.findById(groupId);
    } else {
      group = await Favorite.findOne({ name: 'My Favorites' });
    }

    if (group) {
      group.recipes = group.recipes.filter(id => id !== recipeId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
