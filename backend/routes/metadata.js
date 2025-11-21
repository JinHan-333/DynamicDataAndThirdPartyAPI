const express = require('express');
const router = express.Router();
const Metadata = require('../models/Metadata');

// Get all metadata
router.get('/', async (req, res) => {
  try {
    const metadata = await Metadata.find();
    // Transform into an object { category: [...], glass: [...], ... }
    const result = metadata.reduce((acc, item) => {
      acc[item.type] = item.values;
      return acc;
    }, {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific type
router.get('/:type', async (req, res) => {
  try {
    const data = await Metadata.findOne({ type: req.params.type });
    if (!data) return res.status(404).json({ message: 'Type not found' });
    res.json(data.values);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
