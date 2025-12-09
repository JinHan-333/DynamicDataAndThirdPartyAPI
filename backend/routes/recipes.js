const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET all custom recipes or search by name
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    const visibilityQuery = req.user 
      ? { $or: [{ isPublic: true }, { owner: req.user._id }] }
      : { isPublic: true };

    const finalQuery = { ...query, ...visibilityQuery };
    
    // Wait, `query` has `name`. `visibilityQuery` has `isPublic` or `$or`.
    // If `visibilityQuery` has `$or`, and `query` has `name`, merging works (MongoDB combines top-level).
    
    const recipes = await Recipe.find(finalQuery).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my recipes
router.get('/my-recipes', requireAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one recipe
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    // Check visibility
    if (!recipe.isPublic) {
        if (!req.user || req.user._id !== recipe.owner?.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
    }
    
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const { generateCocktailImage } = require('../services/imageGenerator');
const fs = require('fs');
const path = require('path');

// POST create recipe
router.post('/', optionalAuth, async (req, res) => {
  // If private, require user
  if (req.body.isPublic === false && !req.user) {
      return res.status(401).json({ message: 'You must be logged in to create private recipes.' });
  }

  const recipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    glass: req.body.glass,
    category: req.body.category,
    image: req.body.image,
    owner: req.user ? req.user._id : null,
    isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true
  });

  try {
    const newRecipe = await recipe.save();

    // Generate Image
    try {
      const imageBuffer = await generateCocktailImage(newRecipe);
      if (imageBuffer) {
        const imageName = `${newRecipe._id}.png`;
        const publicDir = path.join(__dirname, '../../public/images/custom');
        
        // Ensure directory exists
        if (!fs.existsSync(publicDir)){
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const imagePath = path.join(publicDir, imageName);
        fs.writeFileSync(imagePath, imageBuffer);
        
        console.log('--------------------------------------------------');
        console.log('Generated Image Saved To:', imagePath);
        console.log('Public URL:', `/api/images/custom/${imageName}`);
        console.log('--------------------------------------------------');

        // Update recipe with image URL
        newRecipe.image = `/api/images/custom/${imageName}`;
        await newRecipe.save();
      }
    } catch (imgErr) {
      console.error('Image generation/saving failed:', imgErr);
      // Continue without image
    }

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (req.body.name != null) recipe.name = req.body.name;
    if (req.body.ingredients != null) recipe.ingredients = req.body.ingredients;
    if (req.body.instructions != null) recipe.instructions = req.body.instructions;
    if (req.body.glass != null) recipe.glass = req.body.glass;
    if (req.body.category != null) recipe.category = req.body.category;
    if (req.body.image != null) recipe.image = req.body.image;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
