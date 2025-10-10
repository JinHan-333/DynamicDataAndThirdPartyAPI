import Header from '../components/Header'
import Hero from '../components/Hero'
import AIAssistant from '../components/AIAssistant'
import AlphabetNav from '../components/AlphabetNav'
import InfoSections from '../components/InfoSections'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <AIAssistant />

      <InfoSections />
      <AlphabetNav />
    </div>
  )
}

export default LandingPage
