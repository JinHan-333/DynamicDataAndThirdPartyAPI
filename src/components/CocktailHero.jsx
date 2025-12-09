import { useState } from 'react'
import PropTypes from 'prop-types'
import { normalizeImageUrl } from '../utils/cocktailParser'

const SUPPORTED_LANGUAGES = [
  { code: 'ES', name: 'Spanish' },
  { code: 'FR', name: 'French' },
  { code: 'DE', name: 'German' },
  { code: 'IT', name: 'Italian' },
  { code: 'PT', name: 'Portuguese' },
  { code: 'JA', name: 'Japanese' },
  { code: 'ZH', name: 'Chinese' },
  { code: 'RU', name: 'Russian' },
];

function CocktailHero({ cocktail, translatedData, onTranslate, isTranslating, isFavorite, onToggleFavorite, onContentClick }) {
  const [selectedLang, setSelectedLang] = useState('ES');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  if (!cocktail) return null;

  const handleTranslate = () => {
    if (onTranslate && selectedLang) {
      onTranslate(selectedLang);
    }
  };

  const displayName = translatedData?.name || cocktail.strDrink;
  const displayAlcoholic = translatedData?.alcoholic || cocktail.strAlcoholic;
  const displayCategory = translatedData?.category || cocktail.strCategory;
  const displayGlass = translatedData?.glass || cocktail.strGlass;

  return (
    <div 
      className={`relative bg-black/60 backdrop-blur-sm text-white ${onContentClick ? 'cursor-pointer hover:bg-black/70 transition' : ''}`}
      onClick={onContentClick}
    >
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Image or Custom Label */}
          <div className="flex justify-center">
            {cocktail.isCustom && !cocktail.strDrinkThumb ? (
              <div className="w-full max-w-md aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-6xl mb-4 block">📝</span>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Custom Recipe</h2>
                  <p className="text-gray-400 mt-2">Created by You</p>
                </div>
              </div>
            ) : (
              <img
                src={normalizeImageUrl(cocktail.strDrinkThumb)}
                alt={cocktail.strDrink}
                className="w-full max-w-md rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* Right: Details */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-5xl font-bold uppercase tracking-wide">{displayName}</h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite && onToggleFavorite();
                }}
                className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition flex-shrink-0"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <span className="text-xl">{isFavorite ? '♥' : '♡'}</span>
              </button>
            </div>

            <div className="space-y-2 mb-8 text-lg">
              {displayAlcoholic && (
                <p>
                  <span className="text-gray-400">Alcoholic:</span> {displayAlcoholic}
                </p>
              )}
              {displayCategory && (
                <p>
                  <span className="text-gray-400">Category:</span> {displayCategory}
                </p>
              )}
              {displayGlass && (
                <p>
                  <span className="text-gray-400">Glass:</span> {displayGlass}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CocktailHero.propTypes = {
  cocktail: PropTypes.object,
  translatedData: PropTypes.object,
  onTranslate: PropTypes.func,
  isTranslating: PropTypes.bool,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  onContentClick: PropTypes.func,
};

export default CocktailHero;
