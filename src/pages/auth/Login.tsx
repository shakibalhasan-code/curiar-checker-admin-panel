"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Mail, Lock, Eye, EyeOff, Search, Globe } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useLanguage } from "../../contexts/LanguageContext"

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onAuthSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onSwitchToForgotPassword, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const { login, isLoading } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
    }

    if (showLanguageDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showLanguageDropdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(formData.email, formData.password)
      onAuthSuccess()
    } catch (err) {
      setError(t("login.error"))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLanguageSelect = (lang: "bn" | "en") => {
    setLanguage(lang)
    setShowLanguageDropdown(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{language === "bn" ? "বাংলা" : "English"}</span>
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleLanguageSelect("bn")}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${language === "bn"
                      ? "text-blue-400 bg-slate-700"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => handleLanguageSelect("en")}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${language === "en"
                      ? "text-blue-400 bg-slate-700"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t("login.title")}</h1>
          <p className="text-slate-400 mt-2">{t("login.subtitle")}</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                {t("login.email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                  placeholder={t("login.email_placeholder")}
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                {t("login.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 pr-12"
                  placeholder={t("login.password_placeholder")}
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>
                {isLoading ? t("login.loading") : t("login.login_button")}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {t("login.no_account")}{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {t("login.signup")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
