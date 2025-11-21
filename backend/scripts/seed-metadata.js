const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Metadata = require('../models/Metadata');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cocktail-app';

const COCKTAIL_DB_BASE = 'https://www.thecocktaildb.com/api/json/v1/1/list.php';

const fetchList = async (param) => {
  try {
    const response = await fetch(`${COCKTAIL_DB_BASE}?${param}=list`);
    const data = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error(`Failed to fetch ${param}:`, error);
    return [];
  }
};

const seedMetadata = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Categories
    console.log('Fetching Categories...');
    const categories = await fetchList('c');
    const categoryValues = categories.map(item => item.strCategory).sort();
    await Metadata.findOneAndUpdate(
      { type: 'category' },
      { type: 'category', values: categoryValues, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    console.log(`Saved ${categoryValues.length} categories.`);

    // 2. Glasses
    console.log('Fetching Glasses...');
    const glasses = await fetchList('g');
    const glassValues = glasses.map(item => item.strGlass).sort();
    await Metadata.findOneAndUpdate(
      { type: 'glass' },
      { type: 'glass', values: glassValues, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    console.log(`Saved ${glassValues.length} glasses.`);

    // 3. Ingredients
    console.log('Fetching Ingredients...');
    const ingredients = await fetchList('i');
    const ingredientValues = ingredients.map(item => item.strIngredient1).sort();
    await Metadata.findOneAndUpdate(
      { type: 'ingredient' },
      { type: 'ingredient', values: ingredientValues, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    console.log(`Saved ${ingredientValues.length} ingredients.`);

    // 4. Alcoholic Filters
    console.log('Fetching Alcoholic Filters...');
    const alcoholic = await fetchList('a');
    const alcoholicValues = alcoholic.map(item => item.strAlcoholic).sort();
    await Metadata.findOneAndUpdate(
      { type: 'alcoholic' },
      { type: 'alcoholic', values: alcoholicValues, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    console.log(`Saved ${alcoholicValues.length} alcoholic filters.`);

    console.log('Metadata seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedMetadata();
