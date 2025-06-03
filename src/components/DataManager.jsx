'use client'
import { useState } from 'react'

export default function DataManager() {
  const [importError, setImportError] = useState('')
  
  const handleExport = () => {
    // Get all data from localStorage
    const data = {
      savedPoints: JSON.parse(localStorage.getItem('savedPoints') || '{}'),
      achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
      settings: JSON.parse(localStorage.getItem('srpSettings') || '{}')
    }
    
    // Convert to JSON string
    const jsonData = JSON.stringify(data, null, 2)
    
    // Create a blob and download link
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `srp-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    
    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // Show notification
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        title: 'Data Exported',
        message: 'Your data has been exported successfully.',
        type: 'success',
        duration: 3000
      }
    }))
    
    // Check for data_export achievement
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]')
    if (!achievements.includes('data_export')) {
      achievements.push('data_export')
      localStorage.setItem('achievements', JSON.stringify(achievements))
      
      // Trigger achievement notification
      window.dispatchEvent(new CustomEvent('achievement', {
        detail: { 
          title: 'Data Manager', 
          message: 'Export your data for the first time'
        }
      }))
    }
  }
  
  const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate data structure
        if (!data.savedPoints || !data.achievements || !data.settings) {
          setImportError('Invalid data format')
          return
        }
        
        // Import data to localStorage
        localStorage.setItem('savedPoints', JSON.stringify(data.savedPoints))
        localStorage.setItem('achievements', JSON.stringify(data.achievements))
        localStorage.setItem('srpSettings', JSON.stringify(data.settings))
        
        // Reset file input
        event.target.value = null
        
        // Show notification
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            title: 'Data Imported',
            message: 'Your data has been imported successfully. Refresh the page to see changes.',
            type: 'success',
            duration: 5000
          }
        }))
        
        setImportError('')
      } catch (error) {
        setImportError('Failed to parse JSON file')
      }
    }
    
    reader.readAsText(file)
  }
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      // Clear all app data
      localStorage.removeItem('savedPoints')
      localStorage.removeItem('achievements')
      
      // Keep settings
      
      // Show notification
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          title: 'Data Reset',
          message: 'All your data has been reset. Refresh the page to see changes.',
          type: 'info',
          duration: 5000
        }
      }))
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Data Management</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
            style={{ backgroundColor: 'var(--theme-color)' }}
          >
            Export Data
          </button>
          
          <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          {importError && (
            <p className="text-red-500 text-sm mt-2">{importError}</p>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reset All Data
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This will delete all your saved points and achievements. Your settings will be preserved.
          </p>
        </div>
      </div>
    </div>
  )
}



