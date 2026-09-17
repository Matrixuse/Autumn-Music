import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [loading] = useState(false)
  const [user, setUser] = useState(() => { 
    try { 
        return JSON.parse(localStorage.getItem('autumn_user')) || null 
    } catch { 
        return null 
    } 
  })

  useEffect(() => {
    if (!user) return undefined

    let cancelled = false
    const refreshSession = async () => {
      try {
        const response = await authApi.getUser()
        if (!cancelled && response?.data) localStorage.setItem('autumn_user', JSON.stringify(response.data))
      } catch {
        // Keep the local session during temporary API outages.
      }
    }

    refreshSession()
    const interval = window.setInterval(refreshSession, 12 * 60 * 60 * 1000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [user])

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    const nextUser = response.data
    localStorage.setItem('autumn_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const loginWithGoogle = async (idToken) => {
    const response = await authApi.loginWithGoogle(idToken)
    const nextUser = response.data
    localStorage.setItem('autumn_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const signup = async (credentials) => {
    const response = await authApi.signup(credentials)
    const nextUser = response.data
    localStorage.setItem('autumn_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const logout = async () => {
    try { await authApi.logout() } finally {
      localStorage.removeItem('autumn_user')
      setUser(null)
    }
  }
  const updateProfile = (updates) => {
    const nextUser = { ...user, ...updates }
    localStorage.setItem('autumn_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }
  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, loginWithGoogle, signup, logout, updateProfile }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)