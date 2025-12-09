const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    name: { type: String, required: true },
    measure: { type: String, default: '' }
  }],
  instructions: {
    type: String,
    required: true
  },
  glass: {
    type: String,
    default: 'Highball glass'
  },
  category: {
    type: String,
    default: 'Cocktail'
  },
  image: {
    type: String,
    default: '' // Could be a URL or placeholder
  },
  isCustom: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
