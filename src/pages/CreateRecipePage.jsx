import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/api';
import Header from '../components/Header';

function CreateRecipePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cocktail',
    glass: 'Highball glass',
    instructions: '',
    image: '',
  });
  const [ingredients, setIngredients] = useState([{ name: '', measure: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Filter out empty ingredients
    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== '');

    try {
      await createRecipe({
        ...formData,
        ingredients: validIngredients,
      });
      alert('Recipe created successfully!');
      navigate('/'); // Or navigate to the new recipe page if we had the ID
    } catch (error) {
      console.error('Failed to create recipe:', error);
      alert('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Create Your Custom Cocktail
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cocktail Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="e.g., Midnight Sparkler"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option>Cocktail</option>
                  <option>Shot</option>
                  <option>Ordinary Drink</option>
                  <option>Coffee / Tea</option>
                  <option>Other / Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Glass Type</label>
                <input
                  type="text"
                  name="glass"
                  value={formData.glass}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="e.g., Highball glass"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image URL (Optional)</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Ingredients</label>
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient (e.g., Rum)"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ing.measure}
                      onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                      placeholder="Measure (e.g., 2 oz)"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Instructions</label>
            <textarea
              name="instructions"
              required
              value={formData.instructions}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Step 1: Mix ingredients..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Cocktail'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRecipePage;
