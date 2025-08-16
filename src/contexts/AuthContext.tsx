"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  name: string
  firstName: string
  lastName: string
  company?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
    company?: string,
    phone?: string,
  ) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  isLoading: boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
      }
    }
    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting login with:", { email })

      const response = await fetch("http://45.80.181.58:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.log("[v0] Login error response:", errorData)
        throw new Error(`Login failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Login success data:", data)

      if (data.token && data.user) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userData", JSON.stringify(data.user))
        setUser(data.user)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
    company?: string,
    phone?: string,
  ) => {
    setIsLoading(true)
    try {
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        company: company || "",
        phone: phone || "",
      }

      console.log("[v0] Attempting signup with:", { ...userData, password: "[REDACTED]" })

      const response = await fetch("http://45.80.181.58:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("[v0] Signup response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.log("[v0] Signup error response:", errorData)
        throw new Error(`Signup failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Signup success data:", data)

      if (data.token && data.user) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userData", JSON.stringify(data.user))
        setUser(data.user)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user")
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setUser(null)
  }

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No auth token found")
      }

      const response = await fetch("http://45.80.181.58:3000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`Profile update failed: ${response.status}`)
      }

      const updatedUser = await response.json()
      localStorage.setItem("userData", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
    isInitialized,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
