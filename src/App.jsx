import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreateRecipePage from './pages/CreateRecipePage'
import FavoritesPage from './pages/FavoritesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/create" element={<CreateRecipePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
