import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, getCustomRecipeById } from '../services/api';
import { getCocktailById } from '../services/cocktaildb';
import Header from '../components/Header';

function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favData = await getFavorites();
        const recipeIds = favData.recipes || [];

        // Fetch details for each favorite
        const drinksPromises = recipeIds.map(async (id) => {
          // Try custom first, then external
          // Note: In a real app, we'd probably store the type (custom/external) or have a unified ID system.
          // For now, we'll guess based on ID format or just try both.
          // MongoDB IDs are 24 hex chars. External IDs are usually numeric strings.
          
          if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
             try {
               return await getCustomRecipeById(id);
             } catch (e) {
               // If failed, maybe it's external (unlikely if 24 hex, but possible collision)
               return await getCocktailById(id);
             }
          } else {
             return await getCocktailById(id);
          }
        });

        const drinks = await Promise.all(drinksPromises);
        setFavorites(drinks.filter(d => d !== null));
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl mb-4">You haven't added any favorites yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Cocktails
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((drink) => (
              <div
                key={drink._id || drink.idDrink}
                onClick={() => navigate(`/recipe/${drink._id || drink.idDrink}`)}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105 hover:bg-gray-700 border border-gray-700 hover:border-blue-500"
              >
                <img
                  src={drink.image || drink.strDrinkThumb || '/images/placeholder.png'}
                  alt={drink.name || drink.strDrink}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white truncate">
                    {drink.name || drink.strDrink}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {drink.category || drink.strCategory}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
