import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomCocktail } from '../services/cocktaildb'

function Hero() {
  const [randomCocktail, setRandomCocktail] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchInitialCocktail = async () => {
      setIsLoading(true)
      try {
        const cocktail = await getRandomCocktail()
        setRandomCocktail(cocktail)
      } catch (error) {
        console.error('Failed to fetch random cocktail:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitialCocktail()
  }, [])

  const handleRandomCocktail = async () => {
    setIsLoading(true)
    try {
      const cocktail = await getRandomCocktail()
      navigate(`/recipe/${cocktail.idDrink}`)
    } catch (error) {
      console.error('Failed to fetch random cocktail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewRecipe = () => {
    if (randomCocktail) {
      navigate(`/recipe/${randomCocktail.idDrink}`)
    }
  }

  return (
    <div 
      className="text-white h-[95vh] flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/images/background.png)' }}
    >
      <div className="max-w-7xl mx-auto px-16 w-full flex-1 flex flex-col">
        <div className="flex justify-between flex-1">
          {/* Left Side - Title and Random Button */}
          <div className="flex-1 flex flex-col justify-between mt-16">
            <h1 className="text-8xl font-bold text-white mb-2">
              MIXOLOGY
              <br />
              TALES
            </h1>
            <div className="flex flex-col items-start mb-12">
              <p className="text-2xl italic text-white mb-8 subtitle">
                Discover, Mix, and Enjoy Cocktails
              </p>
              <button
                onClick={handleRandomCocktail}
                disabled={isLoading}
                className="px-12 py-4 border-2 border-white
                 text-white text-xl font-bold hover:bg-white hover:text-gray-800 transition disabled:opacity-50
                 "
              >
                <h3 className="uppercase text-4xl">
                  {isLoading ? 'LOADING...' : 'RANDOM'}
                </h3>

              </button>
            </div>
          </div>

           <div className="flex-1 items-end flex flex-col justify-end mt-20">


          {/* Right Side - Ingredients */}
            {randomCocktail && (
              <div className="flex-1 text-right flex flex-col justify-end mb-12">
                <h3 className="text-2xl uppercase tracking-wider text-white mb-6 secondary-heading w-[35vh]">
                  INGREDIENTS
                </h3>
                <div className="text-white text-sm mb-8 leading-relaxed uppercase w-[35vh]">
                  {/* {randomCocktail.strIngredient1 && (
                    <p>
                      {randomCocktail.strIngredient1} {randomCocktail.strMeasure1}
                      {randomCocktail.strIngredient2 && `, ${randomCocktail.strIngredient2} ${randomCocktail.strMeasure2 || ''}`}
                      {randomCocktail.strIngredient3 && `, ${randomCocktail.strIngredient3} ${randomCocktail.strMeasure3 || ''}`}
                      {randomCocktail.strIngredient4 && `, ${randomCocktail.strIngredient4} ${randomCocktail.strMeasure4 || ''}`}
                      {randomCocktail.strIngredient5 && `, ${randomCocktail.strIngredient5} ${randomCocktail.strMeasure5 || ''}`}
                    </p>
                  )} */}

                  Bourbon Whiskey 50ml, Sugar Cube 1, Angostura Bitters 2-3 dashes, Orange Slice 1, Ice Cubes, Rosemary sprig, Alcohol ~32%
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleViewRecipe}
                    className="text-white text-sm uppercase tracking-wider hover:underline "
                  >
                    <b>READ MORE</b>
                  </button>
                </div>
              </div>
            )}
                    </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
