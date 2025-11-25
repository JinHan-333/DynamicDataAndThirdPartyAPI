const { GoogleGenAI } = require("@google/genai");

/**
 * Generate a cocktail image based on recipe details
 * @param {Object} recipe - The recipe object
 * @returns {Promise<Buffer|null>} The image buffer or null if failed
 */
async function generateCocktailImage(recipe) {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY is missing. Using MOCK image generation.");
    // Return a 1x1 red pixel PNG mock image
    const mockImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    return Buffer.from(mockImageBase64, 'base64');
  }

  try {
    console.log(`Attempting to generate image for ${recipe.name} using Gemini (Nano Banana)...`);
    
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    
    const prompt = `Generate a photorealistic, high-quality image of a cocktail named "${recipe.name}". 
    It contains: ${recipe.ingredients.map(i => i.name).join(', ')}. 
    Served in a ${recipe.glass}. 
    The lighting should be moody and elegant, suitable for a premium bar menu.`;

    console.log("Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // Iterate through candidates to find the image
    // Based on documentation: response.candidates[0].content.parts
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          console.log("Image generation successful!");
          return Buffer.from(imageData, "base64");
        }
      }
    }

    console.warn("No image data found in response. Falling back to mock.");
    // Fallback to mock if no image found in response
    const mockImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    return Buffer.from(mockImageBase64, 'base64');

  } catch (error) {
    console.error("Image generation failed:", error.message);
    console.warn("Using MOCK image generation due to error.");
    // Fallback to mock on error
    const mockImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    return Buffer.from(mockImageBase64, 'base64');
  }
}

/**
 * Generate an ingredient icon
 * @param {string} ingredientName - The name of the ingredient
 * @returns {Promise<Buffer|null>} The image buffer or null if failed
 */
async function generateIngredientIcon(ingredientName) {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY is missing. Using MOCK icon generation.");
    // Return a 1x1 transparent pixel PNG mock image
    const mockImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    return Buffer.from(mockImageBase64, 'base64');
  }

  try {
    console.log(`Attempting to generate icon for ${ingredientName}...`);
    
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    
    const prompt = `Generate a simple, flat, minimalist vector icon of "${ingredientName}". 
    Isolated on a transparent background. 
    The style should be clean and suitable for a cocktail app ingredient list.`;

    console.log("Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          console.log("Icon generation successful!");
          return Buffer.from(imageData, "base64");
        }
      }
    }

    console.warn("No icon data found in response. Falling back to mock.");
    // Transparent 1x1 pixel
    const mockImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    return Buffer.from(mockImageBase64, 'base64');

  } catch (error) {
    console.error("Icon generation failed:", error.message);
    // Transparent 1x1 pixel
    const mockImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    return Buffer.from(mockImageBase64, 'base64');
  }
}

module.exports = { generateCocktailImage, generateIngredientIcon };
