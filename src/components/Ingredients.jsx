import { useState } from 'react'
import PropTypes from 'prop-types'
import { getIngredientImageUrl } from '../utils/cocktailParser'

function IngredientCard({ ingredient, isCustom }) {
  const [imgSrc, setImgSrc] = useState(getIngredientImageUrl(ingredient.originalName || ingredient.name));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleError = async () => {
    if (isGenerating) return; // Prevent double calls
    setIsGenerating(true);
    
    try {
      // Call backend to generate icon
      const response = await fetch('/api/ingredients/icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: ingredient.name })
      });
      
      if (response.ok) {
        const data = await response.json();
        setImgSrc(data.url);
      } else {
        // Fallback if generation fails
        setImgSrc('https://via.placeholder.com/96x96?text=No+Image');
      }
    } catch (err) {
      console.error('Failed to generate icon:', err);
      setImgSrc('https://via.placeholder.com/96x96?text=No+Image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:bg-black/60 transition border border-white/10">
      <div className="w-24 h-24 mb-4 flex items-center justify-center relative">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
        <img
          src={imgSrc}
          alt={ingredient.name}
          className="max-w-full max-h-full object-contain"
          onError={handleError}
        />
      </div>
      <h3 className="font-semibold text-lg mb-1 text-white secondary-heading">{ingredient.name}</h3>
      {ingredient.measure && (
        <p className="text-sm text-gray-300">
          {ingredient.measure}
          {isCustom && !ingredient.measure.toLowerCase().includes('ml') && ' ml'}
        </p>
      )}
    </div>
  );
}

IngredientCard.propTypes = {
  ingredient: PropTypes.object.isRequired,
  isCustom: PropTypes.bool
};

function Ingredients({ ingredients, isCustom }) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Ingredients</h2>
        <p className="text-gray-500">No ingredients available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 bg-black/70 backdrop-blur-sm my-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-wide">Ingredients</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ingredients.map((ingredient, index) => (
          <IngredientCard key={index} ingredient={ingredient} isCustom={isCustom} />
        ))}
      </div>
    </div>
  );
}

Ingredients.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      measure: PropTypes.string,
    })
  ),
  isCustom: PropTypes.bool,
};

export default Ingredients;
