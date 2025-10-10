/**
 * Parse ingredients from cocktail data
 * CocktailDB API returns ingredients as strIngredient1-15 and strMeasure1-15
 */
export const parseIngredients = (cocktail) => {
  if (!cocktail) return [];

  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || '',
      });
    }
  }

  return ingredients;
};

/**
 * Parse instructions from cocktail data
 * Splits instructions by period or newline into numbered steps
 */
export const parseInstructions = (cocktail) => {
  if (!cocktail?.strInstructions) return [];

  const instructions = cocktail.strInstructions
    .split(/\.\s+|\n/)
    .map(step => step.trim())
    .filter(step => step.length > 0)
    .map(step => step.endsWith('.') ? step : `${step}.`);

  return instructions;
};

/**
 * Get ingredient image URL from CocktailDB
 */
export const getIngredientImageUrl = (ingredientName) => {
  if (!ingredientName) return null;
  const encoded = encodeURIComponent(ingredientName.trim());
  return `https://www.thecocktaildb.com/images/ingredients/${encoded}-Small.png`;
};
