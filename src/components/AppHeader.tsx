"use client"

import { useState, useEffect } from "react"
import { Smartphone, Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function AppHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateIsDark = () => {
      if (theme === "dark") {
        setIsDark(true)
      } else if (theme === "light") {
        setIsDark(false)
      } else if (theme === "system") {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
      }
    }

    updateIsDark()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", updateIsDark)

    return () => mediaQuery.removeEventListener("change", updateIsDark)
  }, [theme, mounted])

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="hidden md:flex fixed top-6 right-6 z-50">
      <div className="flex items-center gap-2 bg-black/80 dark:bg-gray-800/90 backdrop-blur-md rounded-full px-3 py-1 shadow-lg border border-white/10">
        {/* Get App Button */}
        <button className="flex items-center gap-2 text-white hover:bg-white/20 transition-all text-sm font-medium px-3 py-1.5 rounded-full cursor-pointer">
          <Smartphone className="w-4 h-4" />
          <span>Get App</span>
        </button>
        
        {/* Divider */}
        <div className="w-px h-5 bg-white/20" />
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 text-white hover:bg-white/20 transition-all rounded-full cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
