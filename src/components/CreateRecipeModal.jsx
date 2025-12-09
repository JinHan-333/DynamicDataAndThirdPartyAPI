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

  // Image Preview and File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = (e) => {
      e.stopPropagation();
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };



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
      // Use FormData to allow file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('glass', formData.glass);
      data.append('instructions', formData.instructions);
      data.append('category', formData.category);
      data.append('isPublic', formData.isPublic !== false); // ensure boolean sent as string/boolean
      
      // Stringify complex objects for backend to parse
      data.append('ingredients', JSON.stringify(validIngredients));

      if (selectedFile) {
          data.append('image', selectedFile);
      }

      await createRecipe(data);
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
      setSelectedFile(null);
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





            <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-white uppercase mb-4">Upload Image (Optional)</label>
                 
                 <div 
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-400 bg-black/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                 >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files[0])}
                        className="hidden"
                    />

                    {previewUrl ? (
                        <div className="relative group mx-auto w-full max-w-sm">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="w-full h-64 object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-bold uppercase text-sm"
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                                Add an Image to Your Custom Drink
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                Upload a photo of the cocktail you made, or choose a picture you want to display for your custom drink.
                            </p>
                            
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={onButtonClick}
                                    className="px-6 py-3 bg-white text-black font-bold uppercase text-sm rounded hover:bg-gray-200 transition flex items-center gap-2 mx-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload your image
                                </button>
                                <p className="text-gray-500 text-xs mt-3 uppercase tracking-wider">or drop it here</p>
                                <p className="text-gray-500 text-xs mt-4 italic opacity-70">
                                    (If no image is uploaded, an auto-generated drink image will be used)
                                </p>
                            </div>
                        </div>
                    )}
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
