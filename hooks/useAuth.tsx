"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authAPI } from "@/lib/api"

interface User {
  id: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token")
        if (token) {
          const response = await authAPI.getMe()
          setUser(response.user)
        }
      } catch (error) {
        localStorage.removeItem("admin_token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password)
    setUser(response.user)
    return response.user  // ✅ Return the user so you can get the role
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await authAPI.changePassword(currentPassword, newPassword)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, changePassword }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}