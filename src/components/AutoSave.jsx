'use client'
import { useEffect } from 'react'
import { useSettings } from '../contexts/SettingsContext'

export default function AutoSave({ dailyPoints }) {
  const { settings } = useSettings()
  
  useEffect(() => {
    if (!settings.autoSave || !dailyPoints) return
    
    const today = new Date().toISOString().split('T')[0]
    const previous = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    
    // Only auto-save if the value has changed
    if (previous[today] !== dailyPoints) {
      localStorage.setItem(
        'savedPoints',
        JSON.stringify({
          ...previous,
          [today]: dailyPoints,
        })
      )
      console.log(`Auto-saved ${dailyPoints} points for ${today}`)
    }
  }, [dailyPoints, settings.autoSave])
  
  return null // This is a utility component with no UI
}