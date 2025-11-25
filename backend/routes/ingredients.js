const express = require('express');
const router = express.Router();
const { generateIngredientIcon } = require('../services/imageGenerator');
const fs = require('fs');
const path = require('path');

// POST generate icon
router.post('/icon', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Ingredient name is required' });

  // Sanitize filename
  const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const imageName = `${safeName}.png`;
  const publicDir = path.join(__dirname, '../../public/images/ingredients');
  const imagePath = path.join(publicDir, imageName);

  // Check if exists
  if (fs.existsSync(imagePath)) {
    return res.json({ url: `/api/images/ingredients/${imageName}` });
  }

  // Generate
  try {
    // Ensure directory exists
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const imageBuffer = await generateIngredientIcon(name);
    if (imageBuffer) {
      fs.writeFileSync(imagePath, imageBuffer);
      console.log(`Generated Icon Saved To: ${imagePath}`);
      return res.json({ url: `/api/images/ingredients/${imageName}` });
    } else {
      return res.status(500).json({ message: 'Failed to generate icon' });
    }
  } catch (err) {
    console.error('Icon generation error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
