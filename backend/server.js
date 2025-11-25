const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jingwenhan3_db_user:DFNSGXdNERbgby8y@cluster0.lxiytyw.mongodb.net/?appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const recipesRouter = require('./routes/recipes');
const favoritesRouter = require('./routes/favorites');
const metadataRouter = require('./routes/metadata');
const ingredientsRouter = require('./routes/ingredients');
const cocktailDbRouter = require('./routes/cocktaildb');
const deeplRouter = require('./routes/deepl');

app.use('/api/recipes', recipesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/metadata', metadataRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/cocktaildb', cocktailDbRouter);
app.use('/api/deepl', deeplRouter);
app.use('/api/images', express.static(path.join(__dirname, '../public/images')));

app.get('/', (req, res) => {
  res.send('Cocktail API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
