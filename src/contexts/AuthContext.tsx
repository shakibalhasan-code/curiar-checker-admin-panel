"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthService, NotificationService } from '../services';
import { User, AuthResponse, RegisterRequest, ProfileUpdateRequest } from '../types/api';

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    name: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    phone?: string,
  ) => Promise<void>
  logout: () => void
  updateProfile: (userData: ProfileUpdateRequest) => Promise<void>
  isLoading: boolean
  isInitialized: boolean
  verifyOTP: (email: string, otp: string) => Promise<void>
  resendOTP: (email: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
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
    // Initialize authentication from storage
    AuthService.initializeAuth();

    const userData = AuthService.getStoredUser()
    const token = AuthService.getStoredToken()

    if (token && userData) {
      // Check if token is expired
      if (AuthService.isTokenExpired()) {
        // Try to refresh user data
        AuthService.refreshUserData().then(refreshedUser => {
          if (refreshedUser) {
            setUser(refreshedUser)
          } else {
            // Token refresh failed, logout
            AuthService.logout()
          }
        }).catch(() => {
          AuthService.logout()
        })
      } else {
        setUser(userData)
      }
    }

    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await AuthService.login({ email, password })

      if (response.user) {
        setUser(response.user)
        NotificationService.loginSuccess(response.user.username)
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle specific error cases
      if (error.requiresVerification) {
        NotificationService.otpRequired(error.email || email)
      } else {
        NotificationService.loginFailed(error.message || 'Login failed')
      }

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    phone?: string,
  ) => {
    setIsLoading(true)
    try {
      const userData: RegisterRequest = {
        username: username || name,
        email,
        password,
        firstName: firstName || name,
        lastName: lastName || "",
        company: company || "",
        phone: phone || "",
      }

      const response = await AuthService.register(userData)

      if (response.requiresVerification) {
        NotificationService.registrationSuccess(email)
        // Don't set user yet, they need to verify OTP
      } else if (response.user) {
        setUser(response.user)
        NotificationService.registrationSuccess(email)
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      NotificationService.registrationFailed(error.message || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true)
    try {
      const response = await AuthService.verifyOTP({ email, otp })

      if (response.user) {
        setUser(response.user)
        NotificationService.otpVerified()
      }
    } catch (error: any) {
      console.error("OTP verification error:", error)
      NotificationService.otpInvalid()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async (email: string) => {
    try {
      await AuthService.resendOTP(email)
      NotificationService.info('OTP Resent', 'A new OTP has been sent to your email.')
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      NotificationService.error('OTP Resend Failed', error.message || 'Failed to resend OTP')
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await AuthService.forgotPassword(email)
      NotificationService.info('Password Reset', 'Password reset instructions have been sent to your email.')
    } catch (error: any) {
      console.error("Forgot password error:", error)
      NotificationService.error('Password Reset Failed', error.message || 'Failed to send reset instructions')
      throw error
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await AuthService.resetPassword(token, newPassword)
      NotificationService.success('Password Reset', 'Your password has been successfully reset.')
    } catch (error: any) {
      console.error("Reset password error:", error)
      NotificationService.error('Password Reset Failed', error.message || 'Failed to reset password')
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await AuthService.changePassword(currentPassword, newPassword)
      NotificationService.passwordChanged()
    } catch (error: any) {
      console.error("Change password error:", error)
      NotificationService.error('Password Change Failed', error.message || 'Failed to change password')
      throw error
    }
  }

  const logout = () => {
    console.log("Logging out user")
    AuthService.logout()
    setUser(null)
  }

  const updateProfile = async (userData: ProfileUpdateRequest) => {
    setIsLoading(true)
    try {
      const response = await AuthService.updateProfile(userData)

      if (response.user) {
        setUser(response.user)
        NotificationService.profileUpdated()
      }
    } catch (error: any) {
      console.error("Profile update error:", error)
      NotificationService.error('Profile Update Failed', error.message || 'Failed to update profile')
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
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
