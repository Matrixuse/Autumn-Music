import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(() => { 
    try { 
        return JSON.parse(localStorage.getItem('autumn_user')) || null 
    } catch { 
        return null 
    } 
  })
  useEffect(() => {
    authApi.getUser().then((response) => {
      const nextUser = response?.data || null
      if (nextUser) localStorage.setItem('autumn_user', JSON.stringify(nextUser))
      setUser(nextUser)
    }).catch(() => {
      localStorage.removeItem('autumn_user')
      setUser(null)
    }).finally(() => setLoading(false))
  }, [])

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
  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, loginWithGoogle, signup, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)