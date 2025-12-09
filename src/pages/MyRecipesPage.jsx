import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CocktailHero from '../components/CocktailHero';
import { getMyRecipes } from '../services/api';
import CreateRecipeModal from '../components/CreateRecipeModal';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Refresh recipes when modal closes (in case new recipe added)
  // Actually, CreateRecipeModal doesn't trigger refresh directly, maybe we pass a callback?
  // Or just re-fetch.
  
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getMyRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch my recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleModalClose = () => {
      setIsModalOpen(false);
      fetchRecipes();
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Recipes</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black px-6 py-2 uppercase font-bold hover:bg-gray-200 transition-colors"
            >
              + Create New
            </button>
        </div>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : recipes.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            You haven't created any recipes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <CocktailHero 
                key={recipe._id} 
                cocktail={{
                  idDrink: recipe._id,
                  strDrink: recipe.name,
                  strDrinkThumb: recipe.image || '', 
                  strCategory: recipe.category,
                  strInstructions: recipe.instructions,
                }} 
                onContentClick={() => navigate(`/recipe/${recipe._id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <CreateRecipeModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </div>
  );
}
