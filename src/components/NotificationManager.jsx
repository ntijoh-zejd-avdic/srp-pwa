'use client'
import { useEffect } from 'react'
import { useSettings } from '../contexts/SettingsContext'

export default function NotificationManager() {
  const { settings } = useSettings()
  
  useEffect(() => {
    // Request notification permission if enabled in settings
    if (settings.notifications && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }, [settings.notifications])
  
  useEffect(() => {
    // Function to send native notifications
    const sendNativeNotification = (title, options) => {
      if (!settings.notifications) return
      
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, options)
        } catch (error) {
          console.error('Error sending notification:', error)
        }
      }
    }
    
    // Listen for achievement events to send native notifications
    const handleAchievement = (event) => {
      const { title, message } = event.detail
      
      sendNativeNotification('Achievement Unlocked!', {
        body: `${title}: ${message}`,
        icon: '/icons/icon-192.png'
      })
    }
    
    window.addEventListener('achievement', handleAchievement)
    
    return () => {
      window.removeEventListener('achievement', handleAchievement)
    }
  }, [settings.notifications])
  
  // This component doesn't render anything
  return null
}
