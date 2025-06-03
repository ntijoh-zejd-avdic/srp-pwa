'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    themeColor: '#2563eb',
    incrementStep: '0.1',
    notifications: true,
    confirmBeforeDelete: true,
    darkMode: false
  })
  
  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('srpSettings') || '{}')
    
    // Merge with defaults
    const mergedSettings = {
      ...settings,
      ...savedSettings
    }
    
    setSettings(mergedSettings)
    
    // Apply theme color
    document.documentElement.style.setProperty('--theme-color', mergedSettings.themeColor || '#2563eb')
    
    // Apply dark mode
    if (mergedSettings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  
  // Update settings
  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('srpSettings', JSON.stringify(newSettings))
  }
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}




