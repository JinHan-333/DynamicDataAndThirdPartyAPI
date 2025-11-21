const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['category', 'glass', 'ingredient', 'alcoholic'],
    unique: true
  },
  values: [{
    type: String,
    required: true
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Metadata', metadataSchema);
