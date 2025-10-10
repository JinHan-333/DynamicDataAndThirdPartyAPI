import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchCocktailByName } from '../services/cocktaildb'

function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const results = await searchCocktailByName(searchTerm)
      if (results && results.length > 0) {
        navigate(`/recipe/${results[0].idDrink}`)
        setSearchTerm('')
      } else {
        alert('No cocktails found. Try a different search term.')
      }
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <header className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
            className="cursor-pointer transition-all duration-300 hover:scale-105"
          > 
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              isHovering ? 'text-blue-400' : 'text-white'
            }`}>
              Home
            </h1>
          </button>
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl ml-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cocktails..."
                className="flex-1 px-4 py-3 bg-transparent border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !searchTerm.trim()}
                className="px-8 py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition disabled:opacity-50"
              >
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header
