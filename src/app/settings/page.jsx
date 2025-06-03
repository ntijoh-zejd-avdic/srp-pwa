'use client'
import { useState, useEffect } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import DataManager from '../../components/DataManager'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [themeColor, setThemeColor] = useState('#2563eb')
  const [incrementStep, setIncrementStep] = useState('0.1')
  const [notifications, setNotifications] = useState(true)
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  
  useEffect(() => {
    // Load settings
    setThemeColor(settings.themeColor || '#2563eb')
    setIncrementStep(settings.incrementStep || '0.1')
    setNotifications(settings.notifications !== false)
    setConfirmBeforeDelete(settings.confirmBeforeDelete !== false)
    setDarkMode(settings.darkMode || false)
    
    // Apply theme color
    document.documentElement.style.setProperty('--theme-color', settings.themeColor || '#2563eb')
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings])
  
  const handleSaveSettings = () => {
    const newSettings = {
      ...settings,
      themeColor,
      incrementStep,
      notifications,
      confirmBeforeDelete,
      darkMode
    }
    
    updateSettings(newSettings)
    
    // Apply theme color immediately
    document.documentElement.style.setProperty('--theme-color', themeColor)
    
    // Apply dark mode immediately
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Show settings saved notification
    window.dispatchEvent(new CustomEvent('settingsSaved'))
    
    // Check for theme change achievement
    if (themeColor !== '#2563eb') {
      const achievements = JSON.parse(localStorage.getItem('achievements') || '[]')
      if (!achievements.includes('theme_change')) {
        achievements.push('theme_change')
        localStorage.setItem('achievements', JSON.stringify(achievements))
        
        // Trigger achievement notification
        window.dispatchEvent(new CustomEvent('achievement', {
          detail: { 
            title: 'Customizer', 
            message: 'Change the app theme color'
          }
        }))
      }
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme Color
            </label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Dark Mode
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Behavior</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Increment Step
            </label>
            <select
              value={incrementStep}
              onChange={(e) => setIncrementStep(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="0.1">0.1</option>
              <option value="0.5">0.5</option>
              <option value="1">1.0</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirmBeforeDelete"
              checked={confirmBeforeDelete}
              onChange={(e) => setConfirmBeforeDelete(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="confirmBeforeDelete" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Confirm Before Deleting Entries
            </label>
          </div>
        </div>
      </div>
      
      <DataManager />
      
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 text-white rounded-md hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}



