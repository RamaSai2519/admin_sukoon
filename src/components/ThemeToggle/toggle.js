"use client"

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '../../contexts/useDarkMode'
import { Button } from '../ui/button'

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useDarkMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="relative w-[74px] h-8 ml-3 rounded-full transition-colors duration-300 ease-in-out bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-purple-500 dark:to-indigo-600"
    >
      <div
        className={`absolute flex items-center justify-center w-8 h-full rounded-full transition-transform duration-300 ease-in-out ${
          darkMode ? 'bg-indigo-200 -translate-x-5' : 'translate-x-5 bg-yellow-200'
        }`}
      >
        {darkMode ? (
          <Moon className="h-4 w-4 text-indigo-700" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-700" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ThemeToggle

