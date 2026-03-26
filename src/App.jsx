import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import ProtectedRoute from './components/ProtectedRoute'
import Nav from './components/Nav'

import Home from './pages/Home'
import Login from './pages/Login'
import RecipeDetail from './pages/RecipeDetail'
import AddRecipe from './pages/AddRecipe'
import InstagramImport from './pages/InstagramImport'
import ShareTarget from './pages/ShareTarget'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/share-target" element={<ShareTarget />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Nav />}>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/add" element={<AddRecipe />} />
              <Route path="/add/instagram" element={<InstagramImport />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
