'use client'
import { useSettings } from '../contexts/SettingsContext'

export default function SaveButton({ dailyPoints, label = 'Save Today', onSave }) {
  const { settings } = useSettings()
  
  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0]
    const previous = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    const isFirstSave = !previous[today]

    localStorage.setItem(
      'savedPoints',
      JSON.stringify({
        ...previous,
        [today]: dailyPoints,
      })
    )

    console.log(`Saved ${dailyPoints} points for ${today}`)
    
    // Show notification if it's the first save of the day
    if (isFirstSave && settings.notifications) {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          title: 'Points Saved',
          message: `You saved ${dailyPoints} points for today!`,
          type: 'success',
          duration: 3000
        }
      }))
    }
    
    // Trigger pointsSaved event for achievement tracking
    window.dispatchEvent(new Event('pointsSaved'))
    
    if (onSave) {
      onSave()
    }
  }

  return (
    <button
      onClick={handleSave}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-lg shadow text-sm"
      style={{ backgroundColor: 'var(--theme-color)' }}
    >
      {label}
    </button>
  )
}
