import { createContext, useContext, useState, useEffect } from 'react'
import pb from '../lib/pocketbase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.model)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleAuthChange = () => setUser(pb.authStore.model)
    window.addEventListener('pb-auth-change', handleAuthChange)
    return () => window.removeEventListener('pb-auth-change', handleAuthChange)
  }, [])

  // Refresh auth on mount if we have a stored token
  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('users').authRefresh().catch(() => pb.authStore.clear())
    }
  }, [])

  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
      })
      setUser(authData.record)
      return authData
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
