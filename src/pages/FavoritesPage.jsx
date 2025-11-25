
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, createFavoriteGroup, deleteFavoriteGroup, removeFromFavorites } from '../services/api';
import { getCocktailById } from '../services/cocktaildb';
import Header from '../components/Header';

function FavoritesPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeRecipes, setActiveRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const data = await getFavorites();
      setGroups(data);
      if (data.length > 0 && !activeGroupId) {
        setActiveGroupId(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch recipes when active group changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!activeGroupId) return;
      
      const group = groups.find(g => g._id === activeGroupId);
      if (!group) return;

      const recipeIds = group.recipes || [];
      const drinksPromises = recipeIds.map(id => getCocktailById(id));
      const drinks = await Promise.all(drinksPromises);
      setActiveRecipes(drinks.filter(d => d !== null));
    };

    fetchRecipes();
  }, [activeGroupId, groups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await createFavoriteGroup(newGroupName);
      setNewGroupName('');
      setIsCreating(false);
      fetchGroups(); // Refresh list
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      await deleteFavoriteGroup(groupId);
      // If deleting active group, switch to default
      if (groupId === activeGroupId) {
        setActiveGroupId(groups[0]._id);
      }
      fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleRemoveRecipe = async (e, recipeId) => {
    e.stopPropagation();
    if (!window.confirm('Remove from favorites?')) return;
    try {
      await removeFromFavorites(recipeId, activeGroupId);
      fetchGroups(); // Refresh to update local state
    } catch (error) {
      console.error('Failed to remove recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  const activeGroup = groups.find(g => g._id === activeGroupId);

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
        <h1 className="text-4xl font-bold mb-8 text-white uppercase tracking-wider">My Recipes</h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {groups.map(group => (
            <button
              key={group._id}
              onClick={() => setActiveGroupId(group._id)}
              className={`px-8 py-2 rounded border-2 transition uppercase tracking-widest font-bold text-sm ${
                activeGroupId === group._id
                  ? 'bg-gray-300 text-black border-gray-300'
                  : 'bg-transparent text-white border-white hover:bg-white/10'
              }`}
            >
              {group.name}
            </button>
          ))}
          
          {/* Add Group Button */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="px-8 py-2 rounded border-2 border-gray-500 text-gray-400 hover:border-white hover:text-white transition uppercase tracking-widest font-bold text-sm"
            >
              + Customize
            </button>
          ) : (
            <form onSubmit={handleCreateGroup} className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="NAME"
                className="bg-black/50 border border-white text-white px-4 py-2 rounded focus:outline-none uppercase text-sm w-32"
                autoFocus
              />
              <button type="submit" className="text-white hover:text-green-400">✓</button>
              <button type="button" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-red-400">✕</button>
            </form>
          )}
        </div>

        {/* Delete Group Option */}
        {activeGroup?.name !== 'My Favorites' && (
          <div className="flex justify-end mb-4">
             <button
                onClick={() => handleDeleteGroup(activeGroup._id)}
                className="text-red-400 hover:text-red-300 text-xs uppercase tracking-widest flex items-center gap-1 opacity-60 hover:opacity-100 transition"
              >
                Delete "{activeGroup?.name}"
              </button>
          </div>
        )}

        {/* Recipe Grid */}
        {activeRecipes.length === 0 ? (
          <div className="text-center text-gray-400 py-20 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-800">
            <p className="text-xl uppercase tracking-widest mb-4">No recipes in this list</p>
            <button
              onClick={() => navigate('/')}
              className="text-white border-b border-white hover:text-gray-300 transition pb-1"
            >
              BROWSE COCKTAILS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeRecipes.map((drink) => (
              <div
                key={drink.idDrink}
                className="bg-black/40 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 flex h-64 group relative hover:border-white/30 transition"
              >
                {/* Image Section (Left) */}
                <div 
                  className="w-1/2 h-full relative cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/recipe/${drink.idDrink}`)}
                >
                   {drink.isCustom && !drink.strDrinkThumb ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-4xl">📝</span>
                      </div>
                   ) : (
                      <img
                        src={drink.strDrinkThumb || '/images/placeholder.png'}
                        alt={drink.strDrink}
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
                        onClick={() => navigate(`/recipe/${drink.idDrink}`)}
                      >
                        {drink.strDrink}
                      </h3>
                      {/* Heart Icon */}
                      <button
                        onClick={(e) => handleRemoveRecipe(e, drink.idDrink)}
                        className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition flex-shrink-0"
                        title="Remove from list"
                      >
                        <span className="text-sm">♥</span>
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-400 uppercase tracking-wide">
                      <p><span className="text-gray-500">Alcoholic:</span> {drink.strAlcoholic || 'Unknown'}</p>
                      <p><span className="text-gray-500">Category:</span> {drink.strCategory}</p>
                      <p><span className="text-gray-500">Glass:</span> {drink.strGlass}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button 
                      className="border border-white/30 text-white px-4 py-1 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
                      onClick={() => navigate(`/recipe/${drink.idDrink}`)}
                    >
                      Translate
                    </button>
                    
                    <button
                      onClick={() => navigate(`/recipe/${drink.idDrink}`)}
                      className="text-gray-400 text-xs uppercase tracking-widest hover:text-white transition border-b border-transparent hover:border-white pb-0.5"
                    >
                      Detail
                    </button>
                  </div>
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
