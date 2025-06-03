'use client'
import { useState, useEffect } from 'react'
import SaveButton from '../components/SaveButton'
import AutoSave from '../components/AutoSave'
import { useSettings } from '../contexts/SettingsContext'

export default function Home() {
  const [dailyPoints, setDailyPoints] = useState(0)
  const [savedToday, setSavedToday] = useState(false)
  const { settings } = useSettings()
  
  useEffect(() => {
    // Check if we already have points saved for today
    const today = new Date().toISOString().split('T')[0]
    const savedPoints = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    
    if (savedPoints[today]) {
      setDailyPoints(parseFloat(savedPoints[today]))
      setSavedToday(true)
    }
  }, [])
  
  const handleIncrement = () => {
    const step = parseFloat(settings.incrementStep || 0.1)
    setDailyPoints(prev => parseFloat((prev + step).toFixed(1)))
    setSavedToday(false)
  }
  
  const handleDecrement = () => {
    const step = parseFloat(settings.incrementStep || 0.1)
    setDailyPoints(prev => Math.max(0, parseFloat((prev - step).toFixed(1))))
    setSavedToday(false)
  }
  
  const handleSave = () => {
    setSavedToday(true)
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 ${
        settings.displayMode === 'compact' ? 'max-w-xs' : 'max-w-md w-full'
      }`}>
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold mb-6" style={{ color: 'var(--theme-color)' }}>
            {dailyPoints.toFixed(1)}
          </div>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleDecrement}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-full text-xl"
            >
              -
            </button>
            <button
              onClick={handleIncrement}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-full text-xl"
            >
              +
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <SaveButton dailyPoints={dailyPoints} onSave={handleSave} />
            {savedToday && (
              <span className="text-green-600 dark:text-green-400 text-sm">
                ✓ Saved
              </span>
            )}
          </div>
        </div>
      </div>
      
      <AutoSave dailyPoints={dailyPoints} />
    </div>
  )
}
