const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  // For simplicity in this demo, we'll just store a list of recipe IDs.
  // In a real app with users, this would reference a User.
  // Since we don't have auth, we'll just have one global "Favorites" list or use a session/device ID if we wanted to be fancy.
  // But the requirement says "Let the user be able to create a 'favorite' list", implying singular or simple.
  // We'll assume a single global list for this demo, or maybe a named list.
  name: {
    type: String,
    default: 'My Favorites'
  },
  recipes: [{
    type: String, // Storing IDs as strings to support both MongoDB ObjectIds and external API IDs
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
