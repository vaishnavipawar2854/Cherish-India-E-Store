import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    const init = async () => {
      if (userInfo) {
        try {
          const tokenObj = JSON.parse(userInfo)
          // api has base '/api' and request interceptor to attach token from localStorage
          const profileResp = await api.get('/auth/profile')
          setUser({ ...profileResp.data, token: tokenObj.token })
        } catch (err) {
          // token invalid or fetch failed
          localStorage.removeItem('userInfo')
          setUser(null)
        }
      }
      setLoading(false)
    }

    init()
  }, [])

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post('/api/auth/login', { email, password }, config)

      // store only the token in localStorage (avoid persisting isAdmin)
      localStorage.setItem('userInfo', JSON.stringify({ token: data.token }))

  // fetch profile to get user details (including isAdmin) in memory
  // api will use Authorization header from interceptor (we stored token in localStorage)
  const profileResp = await api.get('/auth/profile')
  setUser({ ...profileResp.data, token: data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post('/api/auth/register', { name, email, password }, config)

      // store only token
      localStorage.setItem('userInfo', JSON.stringify({ token: data.token }))

  // fetch profile and set user in memory
  const profileResp = await api.get('/auth/profile')
  setUser({ ...profileResp.data, token: data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userInfo')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    setUser, // Export setUser so Profile page can update user context
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}