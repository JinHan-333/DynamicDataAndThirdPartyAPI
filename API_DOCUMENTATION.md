# CocktailDB API Documentation

> **Official API:** https://www.thecocktaildb.com/api.php
> **API Version:** v1 (Free tier)
> **Base URL:** `https://www.thecocktaildb.com/api/json/v1/1`

---

## Important Notes

### Multiple Results Handling
**⚠️ When search returns multiple results, we ONLY display the first one.**

Example: Searching for "margarita" returns 6 results, but we only use `drinks[0]`.

### Image URLs

**Cocktail Thumbnails:**
- Provided directly in API response via `strDrinkThumb` field
- Full URL: `https://www.thecocktaildb.com/images/media/drink/{id}.jpg`
- Example: `https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg`

**Ingredient Images:**
- NOT provided in API response - must construct manually
- Pattern: `https://www.thecocktaildb.com/images/ingredients/{name}-{size}.png`
- Sizes available:
  - `{name}-Small.png` (recommended for ingredient grids)
  - `{name}-Medium.png`
  - `{name}.png` (large, no suffix)
- Example: `https://www.thecocktaildb.com/images/ingredients/Vodka-Small.png`

---

## API Endpoints Used in Project

### 1. Search Cocktail by Name

**Endpoint:** `GET /search.php?s={query}`

**Use Case:** Main search functionality

**Example:**
```bash
curl "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita"
```

**Response Structure:**
```json
{
  "drinks": [
    {
      "idDrink": "11007",
      "strDrink": "Margarita",
      "strDrinkAlternate": null,
      "strTags": "IBA,ContemporaryClassic",
      "strVideo": null,
      "strCategory": "Ordinary Drink",
      "strIBA": "Contemporary Classics",
      "strAlcoholic": "Alcoholic",
      "strGlass": "Cocktail glass",
      "strInstructions": "Rub the rim of the glass...",
      "strInstructionsES": "Frota el borde del vaso...",
      "strInstructionsDE": "Reiben Sie den Rand...",
      "strInstructionsFR": "Frotter le bord...",
      "strInstructionsIT": "Strofina il bordo...",
      "strInstructionsZH-HANS": null,
      "strInstructionsZH-HANT": null,
      "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
      "strIngredient1": "Tequila",
      "strIngredient2": "Triple sec",
      "strIngredient3": "Lime juice",
      "strIngredient4": "Salt",
      "strIngredient5": null,
      ... (up to strIngredient15)
      "strMeasure1": "1 1/2 oz ",
      "strMeasure2": "1/2 oz ",
      "strMeasure3": "1 oz ",
      "strMeasure4": null,
      ... (up to strMeasure15)
      "strImageSource": null,
      "strImageAttribution": null,
      "strCreativeCommonsConfirmed": "No",
      "dateModified": "2015-08-18 14:42:59"
    }
    // ... more results
  ]
}
```

**Key Fields:**
- `idDrink` - Unique cocktail ID (use for navigation)
- `strDrink` - Cocktail name
- `strDrinkThumb` - Thumbnail URL (always use this)
- `strCategory` - Category (e.g., "Ordinary Drink", "Cocktail")
- `strAlcoholic` - "Alcoholic", "Non alcoholic", or "Optional alcohol"
- `strGlass` - Glass type (e.g., "Cocktail glass")
- `strInstructions` - English instructions
- `strInstructions{XX}` - Translated instructions (ES, DE, FR, IT, etc.)
- `strIngredient1-15` - Ingredients (check for null)
- `strMeasure1-15` - Measurements (can be null or empty)

**Note:** Returns array of matches. **Use only `drinks[0]`** per requirement.

---

### 2. Get Random Cocktail

**Endpoint:** `GET /random.php`

**Use Case:** "Random" button on landing page

**Example:**
```bash
curl "https://www.thecocktaildb.com/api/json/v1/1/random.php"
```

**Response:** Same structure as search, but always returns exactly 1 result in `drinks` array.

**Usage:**
```javascript
const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
const cocktail = data.drinks[0];
```

---

### 3. Lookup Cocktail by ID

**Endpoint:** `GET /lookup.php?i={id}`

**Use Case:** Recipe page - get full details for a specific cocktail

**Example:**
```bash
curl "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007"
```

**Response:** Same structure as search, returns single result in `drinks` array.

**Test Result (ID: 11007 - Margarita):**
```
Name: Margarita
Category: Ordinary Drink
Alcoholic: Alcoholic
Glass: Cocktail glass
Thumbnail: https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg

Ingredients:
  - 1 1/2 oz Tequila
  - 1/2 oz Triple sec
  - 1 oz Lime juice
  - Salt
```

---

### 4. Search by First Letter

**Endpoint:** `GET /search.php?f={letter}`

**Use Case:** A-Z navigation bar

**Example:**
```bash
curl "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a"
```

**Response:** Array of cocktails starting with that letter.

**Test Result (Letter 'A'):**
```
Number of results: 25
  1. A1 (ID: 17222)
  2. ABC (ID: 13501)
  3. Ace (ID: 17225)
  4. ACID (ID: 14610)
  5. AT&T (ID: 13938)
  ...
```

**Note:** Can return many results. **Use only `drinks[0]`** per requirement.

---

### 5. Filter by Ingredient

**Endpoint:** `GET /filter.php?i={ingredient}`

**Use Case:** (Optional) Advanced search by ingredient

**Example:**
```bash
curl "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka"
```

**Response Structure (LIMITED DATA):**
```json
{
  "drinks": [
    {
      "strDrink": "155 Belmont",
      "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/yqvvqs1475667388.jpg",
      "idDrink": "15346"
    }
    // ... more results
  ]
}
```

**⚠️ Important:** Filter endpoints return ONLY:
- `strDrink` (name)
- `strDrinkThumb` (thumbnail)
- `idDrink` (ID)

**To get full details, use lookup by ID:**
```javascript
// Step 1: Filter returns limited data
const filtered = await fetch('/filter.php?i=Vodka');
const firstResult = filtered.drinks[0];

// Step 2: Get full details using ID
const full = await fetch(`/lookup.php?i=${firstResult.idDrink}`);
const cocktail = full.drinks[0];
```

**Test Result (Ingredient: Vodka):**
- Returns 94 cocktails containing Vodka
- Each result has name, ID, and thumbnail only

---

## Data Transformation

### Parsing Ingredients

CocktailDB uses a flat structure with `strIngredient1` through `strIngredient15`. Transform this into a clean array:

```javascript
const parseIngredients = (drink) => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({
        name: ingredient,
        measure: measure?.trim() || '',
        // Construct ingredient image URL
        image: `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`
      });
    }
  }
  return ingredients;
};
```

**Example output:**
```javascript
[
  { name: "Tequila", measure: "1 1/2 oz", image: "https://..." },
  { name: "Triple sec", measure: "1/2 oz", image: "https://..." },
  { name: "Lime juice", measure: "1 oz", image: "https://..." },
  { name: "Salt", measure: "", image: "https://..." }
]
```

### Parsing Instructions

Instructions are provided as a single paragraph. Split into steps:

```javascript
const parseInstructions = (instructions) => {
  return instructions
    .split(/\.\s+|\n/)  // Split by period+space or newline
    .filter(step => step.trim().length > 0)
    .map(step => step.trim());
};
```

---

## Complete API Service Implementation

```javascript
// src/services/cocktaildb.js
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const searchCocktails = async (query) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  // Return only first result per requirement
  return data.drinks?.[0] || null;
};

export const getCocktailById = async (id) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.drinks?.[0] || null;
};

export const getRandomCocktail = async () => {
  const res = await fetch(`${BASE_URL}/random.php`);
  const data = await res.json();
  return data.drinks?.[0] || null;
};

export const searchByFirstLetter = async (letter) => {
  const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
  const data = await res.json();
  // Return only first result per requirement
  return data.drinks?.[0] || null;
};

export const filterByIngredient = async (ingredient) => {
  const res = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
  const data = await res.json();
  // Return first result, then fetch full details
  const firstResult = data.drinks?.[0];
  if (!firstResult) return null;

  return getCocktailById(firstResult.idDrink);
};
```

---

## Image Handling Best Practices

### Cocktail Images
```javascript
// Always use strDrinkThumb from API
<img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />

// With fallback
<img
  src={cocktail.strDrinkThumb || '/placeholders/cocktail-default.jpg'}
  alt={cocktail.strDrink}
/>
```

### Ingredient Images
```javascript
// Construct URL from ingredient name
const ingredientImageUrl = (name) =>
  `https://www.thecocktaildb.com/images/ingredients/${name}-Small.png`;

// With error handling
<img
  src={ingredientImageUrl(ingredient.name)}
  alt={ingredient.name}
  onError={(e) => {
    e.target.src = '/placeholders/ingredient-placeholder.png';
  }}
/>
```

### Image Sizes Reference

| Type | Size | URL Pattern | Use Case |
|------|------|-------------|----------|
| Cocktail Thumbnail | ~300x300 | `{strDrinkThumb}` | Cards, thumbnails |
| Ingredient Small | 100x100 | `.../{name}-Small.png` | Ingredient grids |
| Ingredient Medium | 350x350 | `.../{name}-Medium.png` | Larger displays |
| Ingredient Large | 700x700 | `.../{name}.png` | Hero sections |

---

## Tested Endpoints Summary

| Endpoint | Tested | Returns Multiple | Use First Only | Has Thumbnails |
|----------|--------|------------------|----------------|----------------|
| `search.php?s=` | ✅ | Yes (6 for "margarita") | ✅ Yes | ✅ Yes |
| `random.php` | ✅ | No (always 1) | N/A | ✅ Yes |
| `lookup.php?i=` | ✅ | No (always 1) | N/A | ✅ Yes |
| `search.php?f=` | ✅ | Yes (25 for "A") | ✅ Yes | ✅ Yes |
| `filter.php?i=` | ✅ | Yes (94 for "Vodka") | ✅ Yes | ✅ Yes (limited) |

---

## Translation Support

The API provides pre-translated instructions in multiple languages:

- `strInstructions` - English (default)
- `strInstructionsES` - Spanish
- `strInstructionsDE` - German
- `strInstructionsFR` - French
- `strInstructionsIT` - Italian
- `strInstructionsZH-HANS` - Chinese (Simplified)
- `strInstructionsZH-HANT` - Chinese (Traditional)

**Note:** Not all cocktails have all translations. Some may be `null`.

**For this project:** We use DeepL API for dynamic translation instead of these pre-translated fields, as they don't cover ingredient names or other dynamic content.

---

## Error Handling

### No Results
```javascript
// API returns null drinks array when no results
{
  "drinks": null
}

// Always check:
const data = await res.json();
if (!data.drinks || data.drinks.length === 0) {
  // Handle no results
  return null;
}
```

### Invalid ID
```javascript
// Returns null drinks array
const data = await fetch('/lookup.php?i=99999999');
// { "drinks": null }
```

### Network Errors
```javascript
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.drinks?.[0] || null;
} catch (error) {
  console.error('API Error:', error);
  return null;
}
```

---

## Rate Limiting

**Free Tier:** TheCocktailDB free API has no documented rate limits, but best practices:
- Cache responses when possible
- Don't make excessive parallel requests
- Use debouncing for search input

---

## Additional Endpoints (Not Used in This Project)

For reference, these endpoints are available but not needed:

- `filter.php?a={alcoholic}` - Filter by alcoholic/non-alcoholic
- `filter.php?c={category}` - Filter by category
- `filter.php?g={glass}` - Filter by glass type
- `list.php?c=list` - List all categories
- `list.php?g=list` - List all glass types
- `list.php?i=list` - List all ingredients
- `list.php?a=list` - List all alcoholic filters
