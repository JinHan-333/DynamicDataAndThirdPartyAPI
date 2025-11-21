import { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import AIAssistant from '../components/AIAssistant'
import AlphabetNav from '../components/AlphabetNav'
import InfoSections from '../components/InfoSections'
import CreateRecipeModal from '../components/CreateRecipeModal'

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      {/* Add Recipe Button Section */}
      <div className="bg-black py-12 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-12 py-4 border-2 border-white text-white text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
        >
          Add Your Own Drink Recipes
        </button>
      </div>

      <AIAssistant />

      <InfoSections />
      <AlphabetNav />

      <CreateRecipeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default LandingPage
