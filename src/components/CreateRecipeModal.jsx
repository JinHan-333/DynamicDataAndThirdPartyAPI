import { useState, useEffect, useRef } from 'react';
import { createRecipe, getMetadata } from '../services/api';
import CustomSelect from './CustomSelect';

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

  // Autocomplete state
  const [activeIngredientIndex, setActiveIngredientIndex] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setActiveIngredientIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);

    if (field === 'name') {
      setActiveIngredientIndex(index);
      if (value.trim()) {
        const filtered = metadata.ingredient.filter(item => 
          item.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }
  };

  const selectSuggestion = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = value;
    setIngredients(newIngredients);
    setActiveIngredientIndex(null);
    setFilteredSuggestions([]);
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
      // Reset form
      setFormData({
        name: '',
        glass: metadata.glass[0] || 'Highball glass',
        instructions: '',
        category: metadata.category[0] || 'Cocktail',
        image: '',
        isPublic: true 
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
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
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
                <CustomSelect
                  label="Glass Type"
                  name="glass"
                  value={formData.glass}
                  onChange={handleInputChange}
                  options={metadata.glass.length > 0 ? metadata.glass : ['Highball glass']}
                />
              </div>
            </div>

            <div>
              <CustomSelect
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={metadata.category.length > 0 ? metadata.category : ['Cocktail']}
              />
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
                  <div key={index} className="flex gap-4 items-center relative z-20">
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
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        onFocus={() => setActiveIngredientIndex(index)}
                        className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                        placeholder="Ingredient Name (e.g. Vodka)"
                        required
                        autoComplete="off"
                      />
                      
                      {/* Custom Autocomplete Dropdown */}
                      {activeIngredientIndex === index && filteredSuggestions.length > 0 && (
                        <div 
                          ref={suggestionsRef}
                          className="absolute left-0 right-0 top-full mt-1 bg-black border border-gray-500 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
                        >
                          {filteredSuggestions.map((suggestion, i) => (
                            <div
                              key={i}
                              onClick={() => selectSuggestion(index, suggestion)}
                              className="px-3 py-2 hover:bg-gray-800 cursor-pointer text-white text-sm"
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 focus:ring-2"
              />
              <label htmlFor="isPublic" className="text-white text-sm">Make Public</label>
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
