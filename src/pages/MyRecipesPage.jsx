import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

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
    <div className="min-h-screen bg-black text-white flex flex-col"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white uppercase tracking-wider">My Recipes</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-2 rounded border-2 border-gray-500 text-gray-400 hover:border-white hover:text-white transition uppercase tracking-widest font-bold text-sm"
            >
              + Create New
            </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center text-gray-400 py-20 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-800">
             <p className="text-xl uppercase tracking-widest mb-4">You haven't created any recipes yet.</p>
             <button
               onClick={() => setIsModalOpen(true)}
               className="text-white border-b border-white hover:text-gray-300 transition pb-1"
             >
               CREATE YOUR FIRST COCKTAIL
             </button>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-black/40 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 flex h-64 group relative hover:border-white/30 transition"
              >
                {/* Image Section (Left) */}
                <div 
                  className="w-1/2 h-full relative cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                >
                   {!recipe.image ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-4xl">📝</span>
                      </div>
                   ) : (
                      <img
                        src={recipe.image || '/images/placeholder.png'}
                        alt={recipe.name}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                      />
                   )}
                </div>

                {/* Content Section (Right) */}
                <div className="w-1/2 p-6 flex flex-col justify-between relative">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 
                        className="text-xl font-bold text-white uppercase tracking-wider cursor-pointer hover:text-gray-300 transition"
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                      >
                        {recipe.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-400 uppercase tracking-wide">
                      <p><span className="text-gray-500">Category:</span> {recipe.category}</p>
                      <p><span className="text-gray-500">Glass:</span> {recipe.glass}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button 
                      className="border border-white/30 text-white px-4 py-1 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                    >
                      View
                    </button>
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateRecipeModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </div>
  );
}
