import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCocktailById, getRandomCocktail } from '../services/cocktaildb'
import { parseIngredients, parseInstructions } from '../utils/cocktailParser'
import { translateText } from '../services/deepl'
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/api'
import CocktailHero from '../components/CocktailHero'
import Ingredients from '../components/Ingredients'
import Instructions from '../components/Instructions'
import Header from '../components/Header'
import AddToGroupModal from '../components/AddToGroupModal'

function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cocktail, setCocktail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [translatedData, setTranslatedData] = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [relatedDrinks, setRelatedDrinks] = useState([])
  
  // Favorites State
  const [isFavorite, setIsFavorite] = useState(false)
  const [allGroups, setAllGroups] = useState([])
  const [containingGroupIds, setContainingGroupIds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch favorites and groups
  const refreshFavorites = async () => {
    try {
      const groups = await getFavorites()
      setAllGroups(groups)
      
      // Find which groups contain this recipe
      const containing = groups.filter(g => g.recipes.includes(id)).map(g => g._id)
      setContainingGroupIds(containing)

      // Update "Heart" status (true if in ANY group, or specifically "My Favorites"?)
      // Let's say true if in "My Favorites" to keep the quick indicator consistent, 
      // OR true if in ANY group. 
      // Given the new UI, "Favorited" usually means "Saved somewhere".
      setIsFavorite(containing.length > 0)
    } catch (err) {
      console.error('Failed to check favorite status:', err)
    }
  }

  useEffect(() => {
    if (id) refreshFavorites()
  }, [id])

  const handleSaveGroups = async (newSelectedIds) => {
    try {
      const oldSet = new Set(containingGroupIds)
      const newSet = new Set(newSelectedIds)

      // Groups to add
      const toAdd = newSelectedIds.filter(gid => !oldSet.has(gid))
      // Groups to remove
      const toRemove = containingGroupIds.filter(gid => !newSet.has(gid))

      await Promise.all([
        ...toAdd.map(gid => addToFavorites(id, gid)),
        ...toRemove.map(gid => removeFromFavorites(id, gid))
      ])

      await refreshFavorites()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save groups:', err)
      alert('Failed to update favorites')
    }
  }

  useEffect(() => {
    const fetchCocktail = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCocktailById(id)
        if (data) {
          setCocktail(data)
          setTranslatedData(null) // Reset translation when cocktail changes
        } else {
          setError('Cocktail not found')
        }
      } catch (err) {
        console.error('Failed to fetch cocktail:', err)
        setError('Failed to load cocktail details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCocktail()
    }
  }, [id])

  useEffect(() => {
    const fetchRelatedDrinks = async () => {
      try {
        const drinks = await Promise.all([
          getRandomCocktail(),
          getRandomCocktail(),
          getRandomCocktail(),
          getRandomCocktail()
        ])
        setRelatedDrinks(drinks.filter(drink => drink !== null))
      } catch (err) {
        console.error('Failed to fetch related drinks:', err)
      }
    }

    fetchRelatedDrinks()
  }, [id])

  const handleTranslate = async (targetLang) => {
    if (!cocktail) return;

    setIsTranslating(true);
    try {
      const ingredients = parseIngredients(cocktail);
      const instructions = parseInstructions(cocktail);

      // Translate cocktail name
      const nameResult = await translateText(cocktail.strDrink, targetLang);

      // Translate alcoholic type
      const alcoholicResult = cocktail.strAlcoholic
        ? await translateText(cocktail.strAlcoholic, targetLang)
        : null;

      // Translate category
      const categoryResult = cocktail.strCategory
        ? await translateText(cocktail.strCategory, targetLang)
        : null;

      // Translate glass type
      const glassResult = cocktail.strGlass
        ? await translateText(cocktail.strGlass, targetLang)
        : null;

      // Translate instructions (all steps as one text)
      const instructionsText = instructions.join(' ');
      const instructionsResult = await translateText(instructionsText, targetLang);
      const translatedSteps = instructionsResult.translatedText
        .split(/\.\s+/)
        .map(step => step.trim())
        .filter(step => step.length > 0)
        .map(step => step.endsWith('.') ? step : `${step}.`);

      // Translate ingredient names and measures
      const translatedIngredients = await Promise.all(
        ingredients.map(async (ing) => {
          try {
            const nameResult = await translateText(ing.name, targetLang);
            const measureResult = ing.measure
              ? await translateText(ing.measure, targetLang)
              : null;

            return {
              ...ing,
              originalName: ing.name,
              name: nameResult.translatedText,
              measure: measureResult?.translatedText || ing.measure,
            };
          } catch (err) {
            console.error(`Failed to translate ingredient ${ing.name}:`, err);
            return ing; // Keep original if translation fails
          }
        })
      );

      setTranslatedData({
        name: nameResult.translatedText,
        alcoholic: alcoholicResult?.translatedText,
        category: categoryResult?.translatedText,
        glass: glassResult?.translatedText,
        instructions: translatedSteps,
        ingredients: translatedIngredients,
        targetLang,
      });
    } catch (err) {
      console.error('Translation failed:', err);
      alert(`Translation failed: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const ingredients = translatedData?.ingredients || (cocktail ? parseIngredients(cocktail) : []);
  const instructions = translatedData?.instructions || (cocktail ? parseInstructions(cocktail) : []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading cocktail...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !cocktail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-2xl text-red-600 mb-4">{error || 'Cocktail not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gray-900"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      <CocktailHero
        cocktail={cocktail}
        translatedData={translatedData}
        onTranslate={handleTranslate}
        isTranslating={isTranslating}
      />
      
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition transform hover:scale-105 ${
            isFavorite 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          <span className="text-2xl">{isFavorite ? '♥' : '♡'}</span>
          {isFavorite ? 'Saved' : 'Add to Favorites'}
        </button>
      </div>

      <Ingredients ingredients={ingredients} isCustom={cocktail?.isCustom} />
      <Instructions steps={instructions} />

      {/* Glass Section */}
      {cocktail.strGlass && (
        <div className="max-w-7xl mx-auto px-8 py-12 bg-black/70 backdrop-blur-sm my-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-white uppercase tracking-wide">Glass</h2>
          <p className="text-xl text-white">Serve: {translatedData?.glass || cocktail.strGlass}</p>
        </div>
      )}

      {/* Related Drinks Section */}
      {relatedDrinks.length > 0 && (
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-wide text-center">
            Related Drinks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDrinks.map((drink) => (
              <div
                key={drink.idDrink}
                onClick={() => navigate(`/recipe/${drink.idDrink}`)}
                className="bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105 hover:bg-black/80 border-2 border-transparent hover:border-white"
              >
                <img
                  src={drink.strDrinkThumb}
                  alt={drink.strDrink}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white text-center uppercase tracking-wide">
                    {drink.strDrink}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-8 py-12 text-center">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition uppercase tracking-wide"
        >
          ← Back to Home
        </button>
      </div>

      {/* Add to Group Modal */}
      <AddToGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGroups}
        groups={allGroups}
        initialSelectedIds={containingGroupIds}
      />
    </div>
  )
}

export default RecipePage
