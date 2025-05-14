import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      axios.get('http://localhost:5001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email,
      password
    })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const register = async (name, email, password) => {
    const response = await axios.post('http://localhost:5001/api/users/register', {
      name,
      email,
      password
    })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 