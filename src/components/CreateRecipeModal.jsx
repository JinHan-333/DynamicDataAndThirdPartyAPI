import { useState, useEffect } from 'react';
import { createRecipe, getMetadata } from '../services/api';

function CreateRecipeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    glass: 'Highball glass',
    instructions: '',
    category: 'Cocktail',
    image: '',
  });
  
  const [ingredients, setIngredients] = useState([{ name: '', measure: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metadata, setMetadata] = useState({
    glass: [],
    category: [],
    ingredient: [],
    alcoholic: []
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await getMetadata();
        setMetadata(data);
        // Set defaults if available
        if (data.glass && data.glass.length > 0) {
            setFormData(prev => ({ ...prev, glass: data.glass[0] }));
        }
        if (data.category && data.category.length > 0) {
            setFormData(prev => ({ ...prev, category: data.category[0] }));
        }
      } catch (error) {
        console.error('Failed to load metadata:', error);
      }
    };
    if (isOpen) {
      fetchMetadata();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', measure: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== '');

    try {
      await createRecipe({
        ...formData,
        ingredients: validIngredients,
      });
      alert('Recipe created successfully!');
      onClose();
      setFormData({
        name: '',
        glass: metadata.glass[0] || 'Highball glass',
        instructions: '',
        category: metadata.category[0] || 'Cocktail',
        image: ''
      });
      setIngredients([{ name: '', measure: '' }]);
    } catch (error) {
      console.error('Failed to create recipe:', error);
      alert('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black border border-white w-full max-w-2xl relative rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wider">
            Add Your Own Drink Recipes
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-2">Cocktail Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-2">Glass Type</label>
                <select
                  name="glass"
                  value={formData.glass}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none transition-colors appearance-none"
                >
                  {metadata.glass.length > 0 ? (
                    metadata.glass.map(g => <option key={g} value={g} className="bg-black">{g}</option>)
                  ) : (
                    <option className="bg-black">Highball glass</option>
                  )}
                </select>
              </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-white uppercase mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none transition-colors appearance-none"
                >
                  {metadata.category.length > 0 ? (
                    metadata.category.map(c => <option key={c} value={c} className="bg-black">{c}</option>)
                  ) : (
                    <option className="bg-black">Cocktail</option>
                  )}
                </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase mb-2">Instructions for the Cocktail</label>
              <textarea
                name="instructions"
                required
                value={formData.instructions}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white text-center uppercase tracking-wider mb-6">Ingredients</h3>
              <div className="border border-dashed border-gray-600 rounded-lg p-6 space-y-4">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-24">
                      <div className="relative">
                        <input
                          type="text"
                          value={ing.measure}
                          onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                          className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none text-right pr-8"
                          placeholder="0"
                        />
                        <span className="absolute right-2 top-2 text-gray-400 text-xs">ML</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                        placeholder="Ingredient Name (e.g. Vodka)"
                        list={`ingredient-list-${index}`}
                        required
                      />
                      <datalist id={`ingredient-list-${index}`}>
                        {metadata.ingredient.map(i => <option key={i} value={i} />)}
                      </datalist>
                    </div>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-gray-500 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="w-full py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded transition-colors text-sm uppercase"
                >
                  + Add Another Ingredient
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors uppercase text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-white text-black border border-white hover:bg-gray-200 transition-colors uppercase text-sm font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipeModal;
