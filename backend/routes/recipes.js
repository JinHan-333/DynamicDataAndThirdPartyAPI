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
const multer = require('multer');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const publicDir = path.join(__dirname, '../../public/images/custom');
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir, { recursive: true });
    }
    cb(null, publicDir)
  },
  filename: function (req, file, cb) {
    // secure filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
});

const upload = multer({ storage: storage });

// POST create recipe
router.post('/', optionalAuth, upload.single('image'), async (req, res) => {
  // Parse body (multer handles multipart, but if JSON was sent, existing body parser handles it. 
  // However, mixing is tricky. Frontend will switch to FormData for this request).
  
  // Convert "null" strings to actual null or booleans if coming from FormData
  const parseBool = (val) => val === 'true' || val === true;
  const parseJson = (val) => {
      try { return typeof val === 'string' ? JSON.parse(val) : val; } catch(e) { return val; }
  };

  const isPublic = req.body.isPublic !== undefined ? parseBool(req.body.isPublic) : true;

  // If private, require user
  if (isPublic === false && !req.user) {
      // Clean up uploaded file if auth fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ message: 'You must be logged in to create private recipes.' });
  }

  const recipe = new Recipe({
    name: req.body.name,
    ingredients: parseJson(req.body.ingredients),
    instructions: req.body.instructions,
    glass: req.body.glass,
    category: req.body.category,
    // If file uploaded, use it. Else use body.image (if any URL provided) or null
    image: req.file ? `/api/images/custom/${req.file.filename}` : (req.body.image || ''),
    owner: req.user ? req.user._id : null,
    isPublic: isPublic
  });

  try {
    const newRecipe = await recipe.save();

    // If NO file uploaded and NO image URL provided, Generate Image
    if (!req.file && !req.body.image) {
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
    }

    res.status(201).json(newRecipe);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path); // Clean up on error
    res.status(400).json({ message: err.message });
  }
});

// PUT update recipe
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Check ownership
    // Note: recipe.owner is an ObjectId, req.user._id is usually a string (from JWT payload), but check types.
    // recipe.owner might be null for older public recipes? Assume standard checks.
    if (!recipe.owner || recipe.owner.toString() !== req.user._id) {
        return res.status(403).json({ message: 'You are not authorized to edit this recipe' });
    }

    if (req.body.name != null) recipe.name = req.body.name;
    if (req.body.ingredients != null) recipe.ingredients = req.body.ingredients;
    if (req.body.instructions != null) recipe.instructions = req.body.instructions;
    if (req.body.glass != null) recipe.glass = req.body.glass;
    if (req.body.category != null) recipe.category = req.body.category;
    if (req.body.image != null) recipe.image = req.body.image;
    if (req.body.isPublic != null) recipe.isPublic = req.body.isPublic;

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
