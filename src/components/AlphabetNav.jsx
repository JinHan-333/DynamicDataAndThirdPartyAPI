import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchCocktailByLetter } from '../services/cocktaildb'

function AlphabetNav() {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const handleLetterClick = async (letter) => {
    setSelectedLetter(letter)
    setIsLoading(true)

    try {
      const results = await searchCocktailByLetter(letter.toLowerCase())
      if (results && results.length > 0) {
        // Navigate to first result
        // Randomly generate a number between 0 and length of results
        const randomIndex = Math.floor(Math.random() * results.length)
        navigate(`/recipe/${results[randomIndex].idDrink}`)
      }
    } catch (error) {
      console.error('Search by letter failed:', error)
    } finally {
      setIsLoading(false)
      setSelectedLetter(null)
    }
  }

  return (
    <div className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">Browse by Letter</h3>
          <p className="text-gray-400">Click a letter to discover cocktails starting with that letter</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              disabled={isLoading}
              className={`
                w-12 h-12 font-bold text-lg transition
                ${selectedLetter === letter
                  ? 'bg-white text-black border-2 border-white'
                  : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center mt-4">
            <p className="text-gray-400">Searching for cocktails starting with "{selectedLetter}"...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlphabetNav
