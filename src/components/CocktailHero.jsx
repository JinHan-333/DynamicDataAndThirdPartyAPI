import { useState } from 'react'
import PropTypes from 'prop-types'

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

function CocktailHero({ cocktail, translatedData, onTranslate, isTranslating }) {
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
    <div className="relative bg-black/60 backdrop-blur-sm text-white">
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
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="w-full max-w-md rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="text-5xl font-bold mb-6 uppercase tracking-wide">{displayName}</h1>

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

            {/* Translation Controls */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="px-8 py-3 border-2 border-white text-white uppercase tracking-wider hover:bg-white hover:text-black transition"
                >
                  {showLanguageSelector ? 'Hide Languages' : 'Translate'}
                </button>
{/* 
                {translatedData && (
                  <span className="text-sm text-green-400">
                    Translated to {SUPPORTED_LANGUAGES.find(l => l.code === translatedData.targetLang)?.name}
                  </span>
                )} */}
              </div>

              {showLanguageSelector && (
                <div className="bg-black/50 p-6 rounded-lg border border-white/20">
                  <label className="block text-sm font-medium mb-3">Select Language:</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLang(lang.code)}
                        className={`px-4 py-2 border rounded transition ${
                          selectedLang === lang.code
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white border-white/40 hover:border-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className={`w-full px-6 py-3 border-2 border-white text-white uppercase tracking-wider transition ${
                      isTranslating
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-white hover:text-black'
                    }`}
                  >
                    {isTranslating ? 'Translating...' : `Translate to ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name}`}
                  </button>
                </div>
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
};

export default CocktailHero;
