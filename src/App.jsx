import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RecipePage from './pages/RecipePage'
import FavoritesPage from './pages/FavoritesPage'

import { AuthProvider } from './context/AuthContext'
import MyRecipesPage from './pages/MyRecipesPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-recipes" element={<MyRecipesPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
