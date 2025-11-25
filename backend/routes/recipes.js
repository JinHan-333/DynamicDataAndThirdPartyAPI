const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET all custom recipes or search by name
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const { generateCocktailImage } = require('../services/imageGenerator');
const fs = require('fs');
const path = require('path');

// POST create recipe
router.post('/', async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    glass: req.body.glass,
    category: req.body.category,
    image: req.body.image
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
