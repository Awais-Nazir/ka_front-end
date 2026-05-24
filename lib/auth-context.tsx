'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, fullName: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('[v0] Failed to parse stored user', error)
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail?.[0]?.msg || error.message || 'Login failed')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      // Fetch user info after login
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` },
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, fullName: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail?.[0]?.msg || error.message || 'Registration failed')
      }

      const data = await response.json()
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
