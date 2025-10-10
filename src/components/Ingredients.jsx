import PropTypes from 'prop-types'
import { getIngredientImageUrl } from '../utils/cocktailParser'

function Ingredients({ ingredients }) {
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
          <div
            key={index}
            className="bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:bg-black/60 transition border border-white/10"
          >
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img
                src={getIngredientImageUrl(ingredient.originalName || ingredient.name)}
                alt={ingredient.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                }}
              />
            </div>
            <h3 className="font-semibold text-lg mb-1 text-white secondary-heading">{ingredient.name}</h3>
            {ingredient.measure && (
              <p className="text-sm text-gray-300">{ingredient.measure}</p>
            )}
          </div>
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
};

export default Ingredients;
