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
        navigate(`/recipe/${results[0].idDrink}`)
      }
    } catch (error) {
      console.error('Search by letter failed:', error)
    } finally {
      setIsLoading(false)
      setSelectedLetter(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Browse by Letter</h3>
        <p className="text-gray-600">Click a letter to discover cocktails starting with that letter</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={isLoading}
            className={`
              w-12 h-12 rounded-lg font-bold text-lg transition
              ${selectedLetter === letter
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center mt-4">
          <p className="text-gray-600">Searching for cocktails starting with "{selectedLetter}"...</p>
        </div>
      )}
    </div>
  )
}

export default AlphabetNav
