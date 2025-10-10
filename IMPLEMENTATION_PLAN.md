# Implementation Plan - Cocktail Recipe Website

## Implementation Priority

**Order of execution:**
1. ✅ Search + Display Ingredients (Core functionality)
2. ⏳ Translation Feature
3. ⏳ Chat Feature

Build incrementally. Get search working, then add translation, finally chat.

---

## Core Data Structures

```javascript
// The only data that matters:
Cocktail {
  id, name, category, alcoholic, glass,
  image, ingredients[], measures[], instructions
}

SearchState {
  query, results[], loading, error
}

TranslationState {
  targetLang, translatedContent
}

ChatState {
  messages[], loading
}
```

**Rule:** These four structures handle everything. No special cases.

---

## Phase 1: Project Foundation (30 min)

### 1.1 Initialize React + Vite
```bash
npm create vite@latest . -- --template react
npm install
```

### 1.2 Install Dependencies
```bash
npm install react-router-dom tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.3 Configure Tailwind
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cocktail-dark': '#0a0a0a',
        'cocktail-gold': '#d4a574',
      },
      fontFamily: {
        'heading': ['Georgia', 'serif'],
      }
    }
  }
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.4 Environment Setup (Placeholder)
Create `.env` file:
```
VITE_DEEPL_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
```

CocktailDB is public (no key needed).

### 1.5 Placeholder Images Setup
Create `public/placeholders/` directory:
```bash
mkdir -p public/placeholders
```

**Placeholder images needed:**
- `cocktail-default.jpg` - Default cocktail image (400x600)
- `ingredient-placeholder.png` - Missing ingredient images (200x200)
- `hero-background.jpg` - Hero section background (1920x1080)
- `info-section-1.jpg` - First info section image (600x400)
- `info-section-2.jpg` - Second info section image (600x400)

Use online placeholder services initially:
- https://via.placeholder.com/400x600/1a1a1a/d4a574?text=Cocktail
- https://via.placeholder.com/200x200/1a1a1a/ffffff?text=Ingredient

---

## Phase 2: CocktailDB API Only (30 min)

**Focus:** Get cocktail data flowing. Skip DeepL and OpenAI for now.

### 2.1 Create `src/services/cocktaildb.js`
```javascript
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const searchCocktails = async (query) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  return data.drinks || [];
};

export const getCocktailById = async (id) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.drinks?.[0] || null;
};

export const getRandomCocktail = async () => {
  const res = await fetch(`${BASE_URL}/random.php`);
  const data = await res.json();
  return data.drinks?.[0] || null;
};

export const searchByFirstLetter = async (letter) => {
  const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
  const data = await res.json();
  return data.drinks || [];
};
```

### 2.2 Create Placeholder Service Files
Create empty files for later:

`src/services/deepl.js`:
```javascript
// TODO: Implement translation
export const translateText = async (text, targetLang) => {
  console.warn('Translation not implemented yet');
  return text;
};
```

`src/services/openai.js`:
```javascript
// TODO: Implement chat
export const askChatGPT = async (question) => {
  console.warn('Chat not implemented yet');
  return 'Chat feature coming soon!';
};
```

---

## Phase 3: Routing Setup (15 min)

### 3.1 Create `src/App.jsx`
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RecipePage from './pages/RecipePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cocktail/:id" element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

Two routes. Keep it flat.

---

## Phase 4: Search & Display - Landing Page (3 hours)

### 4.1 Component Structure
```
LandingPage/
├── Header (Home, Language Dropdown, Search Bar)
├── Hero (Title, Featured Cocktail, Random Button)
├── AIAssistant (PLACEHOLDER - coming in Phase 6)
├── AlphabetNav (A-Z search links)
└── InfoSections (Static content with images)
```

### 4.2 Implementation Order

#### 4.2.1 Header Component (`src/components/Header.jsx`)
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Trigger search in parent component
    }
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-white text-xl font-heading">HOME</a>

        {/* Language dropdown - placeholder for now */}
        <select className="bg-black text-white border border-gray-700 px-3 py-1">
          <option>EN</option>
        </select>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ingredient or category..."
            className="w-full bg-gray-900 text-white px-4 py-2 rounded"
          />
        </form>
      </div>
    </header>
  );
}
```

#### 4.2.2 Hero Component (`src/components/Hero.jsx`)
```javascript
import { useState, useEffect } from 'react';
import { getRandomCocktail } from '../services/cocktaildb';

function Hero() {
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRandom = async () => {
    setLoading(true);
    const data = await getRandomCocktail();
    setCocktail(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRandom();
  }, []);

  if (loading) return <div className="h-screen bg-black" />;

  return (
    <section className="relative h-screen bg-black">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${cocktail?.strDrinkThumb || '/placeholders/hero-background.jpg'})` }}
      />

      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4">
        <div className="text-white">
          <h1 className="text-7xl font-heading mb-4">MIXOLOGY<br/>TALES</h1>
          <p className="text-xl mb-8">Discover, Mix, and Enjoy Cocktails</p>

          <button
            onClick={loadRandom}
            className="border-2 border-cocktail-gold px-8 py-3 text-cocktail-gold hover:bg-cocktail-gold hover:text-black transition"
          >
            RANDOM
          </button>
        </div>

        {/* Ingredients overlay */}
        {cocktail && (
          <div className="absolute right-8 top-1/4 bg-black/80 p-6 max-w-xs">
            <h3 className="text-cocktail-gold mb-3">INGREDIENTS</h3>
            <p className="text-sm text-gray-300">{/* Extract ingredients here */}</p>
            <button className="mt-4 text-cocktail-gold hover:underline">READ MORE</button>
          </div>
        )}
      </div>
    </section>
  );
}
```

#### 4.2.3 AlphabetNav Component (`src/components/AlphabetNav.jsx`)
```javascript
function AlphabetNav({ onLetterClick }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <nav className="bg-black py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex justify-center gap-4 flex-wrap">
        {letters.map(letter => (
          <button
            key={letter}
            onClick={() => onLetterClick(letter)}
            className="text-gray-400 hover:text-cocktail-gold transition"
          >
            {letter}
          </button>
        ))}
      </div>
    </nav>
  );
}
```

#### 4.2.4 AIAssistant Component - PLACEHOLDER (`src/components/AIAssistant.jsx`)
```javascript
function AIAssistant() {
  return (
    <section className="bg-black py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl text-white mb-8 flex items-center gap-2">
          🍸 Ask our AI ASSISTANT about Cocktail
        </h2>

        {/* Suggested questions - static for now */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700">
            How to make Mojito less sweet?
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700">
            How to make Margarita?
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700">
            Daiquiri vs Margarita?
          </button>
        </div>

        {/* Input - placeholder */}
        <div className="flex gap-2 bg-gray-900 p-4 rounded">
          <span className="text-gray-500">🍸</span>
          <input
            type="text"
            placeholder="Ask any questions about cocktail"
            className="flex-1 bg-transparent text-white outline-none"
            disabled
          />
          <button className="bg-gray-700 p-2 rounded-full">➤</button>
        </div>

        <p className="text-gray-600 mt-4 text-sm">⚠️ Chat feature coming soon (Phase 6)</p>
      </div>
    </section>
  );
}
```

#### 4.2.5 InfoSections Component (`src/components/InfoSections.jsx`)
```javascript
function InfoSections() {
  return (
    <div className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
          <div className="text-white">
            <p className="text-lg leading-relaxed">
              Shake things up with one click: try a random cocktail, search by ingredient, or
              browse by category. Each recipe comes with clear steps, vibrant images, and
              options to translate or check nutrition. Mixing drinks has never been this easy!
            </p>
          </div>
          <img
            src="/placeholders/info-section-1.jpg"
            alt="Cocktail preparation"
            className="w-full h-64 object-cover rounded"
          />
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/placeholders/info-section-2.jpg"
            alt="Cocktail varieties"
            className="w-full h-64 object-cover rounded"
          />
          <div className="text-white">
            <p className="text-lg leading-relaxed">
              Love cocktails but tired of scattered recipes? Discover new drinks, see
              nutrition details, and get recipes in your language—all in one place. From
              inspiration to delightful choices, it's never been easier.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
```

### 4.3 LandingPage Main File (`src/pages/LandingPage.jsx`)
```javascript
import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AIAssistant from '../components/AIAssistant';
import AlphabetNav from '../components/AlphabetNav';
import InfoSections from '../components/InfoSections';
import { searchCocktails, searchByFirstLetter } from '../services/cocktaildb';

function LandingPage() {
  const [searchResults, setSearchResults] = useState([]);

  const handleLetterClick = async (letter) => {
    const results = await searchByFirstLetter(letter);
    setSearchResults(results);
    // TODO: Display results in a modal or results section
  };

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <Hero />
      <AIAssistant />
      <AlphabetNav onLetterClick={handleLetterClick} />
      <InfoSections />
    </div>
  );
}

export default LandingPage;
```

---

## Phase 5: Recipe Page - Display Ingredients (2.5 hours)

### 5.1 Component Structure
```
RecipePage/
├── Header (reuse)
├── CocktailHero (Image, Name, Info, PLACEHOLDER Translate Button)
├── Ingredients (Grid with images + measurements)
├── Instructions (Numbered steps)
├── GlassInfo (Glass type display)
└── RelatedCocktails (Thumbnail grid)
```

### 5.2 Data Transformation Utility (`src/utils/cocktailParser.js`)
```javascript
// Handle CocktailDB's garbage format
export const parseIngredients = (drink) => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({
        name: ingredient,
        measure: measure?.trim() || '',
        // CocktailDB provides ingredient images
        image: `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`
      });
    }
  }
  return ingredients;
};

export const parseInstructions = (instructions) => {
  // Split by periods or line breaks
  return instructions
    .split(/\.\s+|\n/)
    .filter(step => step.trim().length > 0)
    .map(step => step.trim());
};
```

### 5.3 Ingredients Component (`src/components/Ingredients.jsx`)
```javascript
function Ingredients({ ingredients }) {
  return (
    <section className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl text-white text-center mb-8">INGREDIENTS</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {ingredients.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-32 h-32 mx-auto mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/placeholders/ingredient-placeholder.png';
                  }}
                />
              </div>
              <p className="text-white text-sm">{item.measure} {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 5.4 Instructions Component (`src/components/Instructions.jsx`)
```javascript
function Instructions({ steps }) {
  return (
    <section className="bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl text-white text-center mb-8">INSTRUCTIONS</h2>

        <ol className="text-white space-y-4">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="text-cocktail-gold font-bold">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

### 5.5 CocktailHero Component (`src/components/CocktailHero.jsx`)
```javascript
function CocktailHero({ cocktail }) {
  return (
    <section className="relative h-96 bg-black">
      <img
        src={cocktail.strDrinkThumb || '/placeholders/cocktail-default.jpg'}
        alt={cocktail.strDrink}
        className="absolute left-12 top-12 w-80 h-96 object-cover rounded shadow-2xl"
      />

      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-white">
        <h1 className="text-5xl font-heading mb-4">{cocktail.strDrink}</h1>
        <p className="text-lg mb-2">Alcoholic: {cocktail.strAlcoholic}</p>
        <p className="text-lg mb-2">Category: {cocktail.strCategory}</p>
        <p className="text-lg mb-6">Glass: {cocktail.strGlass}</p>

        {/* PLACEHOLDER - Translation button */}
        <button
          className="border-2 border-cocktail-gold px-6 py-2 text-cocktail-gold opacity-50 cursor-not-allowed"
          disabled
        >
          TRANSLATE (Coming Soon)
        </button>
      </div>
    </section>
  );
}
```

### 5.6 RecipePage Main File (`src/pages/RecipePage.jsx`)
```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCocktailById } from '../services/cocktaildb';
import { parseIngredients, parseInstructions } from '../utils/cocktailParser';
import Header from '../components/Header';
import CocktailHero from '../components/CocktailHero';
import Ingredients from '../components/Ingredients';
import Instructions from '../components/Instructions';

function RecipePage() {
  const { id } = useParams();
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCocktail = async () => {
      const data = await getCocktailById(id);
      setCocktail(data);
      setLoading(false);
    };
    loadCocktail();
  }, [id]);

  if (loading) return <div className="bg-black h-screen" />;
  if (!cocktail) return <div className="bg-black h-screen text-white">Not found</div>;

  const ingredients = parseIngredients(cocktail);
  const instructions = parseInstructions(cocktail.strInstructions);

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <CocktailHero cocktail={cocktail} />
      <Ingredients ingredients={ingredients} />
      <Instructions steps={instructions} />

      {/* Glass info */}
      <section className="bg-black py-8 text-center">
        <h3 className="text-2xl text-white">GLASS</h3>
        <p className="text-cocktail-gold text-xl mt-2">Serve: {cocktail.strGlass}</p>
      </section>

      {/* Related cocktails - TODO Phase 5 */}
      <section className="bg-black py-12">
        <h3 className="text-2xl text-white text-center mb-4">BROWSE / RELATED</h3>
        <p className="text-gray-600 text-center">Coming soon...</p>
      </section>
    </div>
  );
}

export default RecipePage;
```

---

## Phase 6: Add Translation Feature (1.5 hours)

### 6.1 Implement DeepL Service (`src/services/deepl.js`)
```javascript
export const translateText = async (text, targetLang) => {
  const apiKey = import.meta.env.VITE_DEEPL_API_KEY;

  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      auth_key: apiKey,
      text: text,
      target_lang: targetLang.toUpperCase()
    })
  });

  const data = await res.json();
  return data.translations[0].text;
};

export const translateMultiple = async (texts, targetLang) => {
  const promises = texts.map(text => translateText(text, targetLang));
  return Promise.all(promises);
};
```

### 6.2 Update CocktailHero with Working Translation
```javascript
import { useState } from 'react';
import { translateText } from '../services/deepl';

function CocktailHero({ cocktail, onTranslate }) {
  const [translating, setTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState('ES');

  const handleTranslate = async () => {
    setTranslating(true);
    await onTranslate(targetLang);
    setTranslating(false);
  };

  return (
    <section className="relative h-96 bg-black">
      {/* ... existing code ... */}

      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-white">
        {/* ... existing info ... */}

        <div className="flex gap-2 items-center">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-3 py-2"
          >
            <option value="ES">Spanish</option>
            <option value="FR">French</option>
            <option value="DE">German</option>
            <option value="IT">Italian</option>
            <option value="JA">Japanese</option>
          </select>

          <button
            onClick={handleTranslate}
            disabled={translating}
            className="border-2 border-cocktail-gold px-6 py-2 text-cocktail-gold hover:bg-cocktail-gold hover:text-black transition disabled:opacity-50"
          >
            {translating ? 'Translating...' : 'TRANSLATE'}
          </button>
        </div>
      </div>
    </section>
  );
}
```

### 6.3 Update RecipePage to Handle Translation
```javascript
function RecipePage() {
  // ... existing state ...
  const [translated, setTranslated] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);

  const handleTranslate = async (targetLang) => {
    // Collect all text to translate
    const textsToTranslate = [
      cocktail.strDrink,
      cocktail.strInstructions,
      ...ingredients.map(i => i.name),
      cocktail.strCategory,
      cocktail.strAlcoholic
    ];

    const translated = await translateMultiple(textsToTranslate, targetLang);

    setTranslatedData({
      name: translated[0],
      instructions: translated[1],
      ingredients: translated.slice(2, 2 + ingredients.length),
      category: translated[translated.length - 2],
      alcoholic: translated[translated.length - 1]
    });
    setTranslated(true);
  };

  // Use translated data if available
  const displayData = translated ? translatedData : {
    name: cocktail.strDrink,
    instructions: cocktail.strInstructions,
    // ... etc
  };

  return (
    // ... render with displayData
  );
}
```

---

## Phase 7: Add Chat Feature (2 hours)

### 7.1 Implement OpenAI Service (`src/services/openai.js`)
```javascript
export const askChatGPT = async (question, conversationHistory = []) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const messages = [
    {
      role: 'system',
      content: 'You are a cocktail expert. Answer questions about cocktails, ingredients, and mixing techniques.'
    },
    ...conversationHistory,
    { role: 'user', content: question }
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 200
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
};
```

### 7.2 Update AIAssistant Component
```javascript
import { useState } from 'react';
import { askChatGPT } from '../services/openai';

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'How to make Mojito less sweet?',
    'How to make Margarita?',
    'Daiquiri vs Margarita?',
    'Best cocktails for party?'
  ];

  const handleAsk = async (question) => {
    setInput('');
    setLoading(true);

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);

    const answer = await askChatGPT(question, messages);

    const assistantMsg = { role: 'assistant', content: answer };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <section className="bg-black py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl text-white mb-8 flex items-center gap-2">
          🍸 Ask our AI ASSISTANT about Cocktail
        </h2>

        {/* Suggested questions */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 hover:border-cocktail-gold transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="bg-gray-900 p-4 rounded mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 ${msg.role === 'user' ? 'text-cocktail-gold' : 'text-white'}`}
              >
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-500">AI is thinking...</div>}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 bg-gray-900 p-4 rounded">
          <span className="text-gray-500">🍸</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && input.trim() && handleAsk(input)}
            placeholder="Ask any questions about cocktail"
            className="flex-1 bg-transparent text-white outline-none"
          />
          <button
            onClick={() => input.trim() && handleAsk(input)}
            disabled={loading || !input.trim()}
            className="bg-cocktail-gold p-2 rounded-full disabled:opacity-50 hover:bg-opacity-80 transition"
          >
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}
```

---

## Phase 8: Polish & Edge Cases (1 hour)

### 8.1 Loading States
Add spinners and skeletons where needed.

### 8.2 Error Handling
Wrap API calls in try-catch, show error messages.

### 8.3 Empty States
- No search results → "No cocktails found. Try another search."
- No ingredients → Hide section
- API failure → "Oops! Something went wrong. Please try again."

### 8.4 Related Cocktails
Implement by fetching random cocktails or by category.

---

## File Structure

```
demo/
├── public/
│   └── placeholders/        # Placeholder images
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── AlphabetNav.jsx
│   │   ├── InfoSections.jsx
│   │   ├── CocktailHero.jsx
│   │   ├── Ingredients.jsx
│   │   └── Instructions.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── RecipePage.jsx
│   ├── services/
│   │   ├── cocktaildb.js    # Phase 2
│   │   ├── deepl.js          # Phase 6
│   │   └── openai.js         # Phase 7
│   ├── utils/
│   │   └── cocktailParser.js # Phase 5
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json
```

---

## Implementation Checklist

### Phase 1-5: Core Search & Display ✅
- [ ] Initialize project
- [ ] Setup Tailwind
- [ ] Create placeholder images
- [ ] Implement CocktailDB service
- [ ] Build routing
- [ ] Build landing page (search disabled initially)
- [ ] Build recipe page with ingredients display
- [ ] Test search functionality

### Phase 6: Translation ⏳
- [ ] Implement DeepL service
- [ ] Add language selector
- [ ] Add translate button
- [ ] Test translation on recipe page

### Phase 7: Chat ⏳
- [ ] Implement OpenAI service
- [ ] Enable AIAssistant component
- [ ] Add conversation history
- [ ] Test chat functionality

### Phase 8: Polish ⏳
- [ ] Add loading states
- [ ] Error handling
- [ ] Related cocktails section
- [ ] Mobile responsiveness
- [ ] Final testing

---

## Total Time Estimate: 8-10 hours

**Breakdown:**
- Phase 1: Foundation - 30 min
- Phase 2: CocktailDB API - 30 min
- Phase 3: Routing - 15 min
- Phase 4: Landing page - 3 hours
- Phase 5: Recipe page - 2.5 hours
- Phase 6: Translation - 1.5 hours
- Phase 7: Chat - 2 hours
- Phase 8: Polish - 1 hour

---

## Critical Principles

1. **Build incrementally.** Search first, then translate, then chat.
2. **Use placeholders.** Don't block on missing features.
3. **No abstractions.** Direct API calls, simple state.
4. **Handle the ugly data once.** Transform CocktailDB format in one utility.
5. **Test each phase before moving on.**

**Ship features one by one. Each phase should work independently.**
