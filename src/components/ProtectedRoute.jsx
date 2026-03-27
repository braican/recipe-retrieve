import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../lib/auth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
