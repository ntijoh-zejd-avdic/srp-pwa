'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Notification() {
  const [notification, setNotification] = useState(null)
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    // Listen for notification events
    const handleNotification = (event) => {
      setNotification(event.detail)
      setVisible(true)
      
      // Hide after specified duration
      setTimeout(() => {
        setVisible(false)
      }, event.detail.duration || 3000)
    }
    
    window.addEventListener('showNotification', handleNotification)
    
    return () => {
      window.removeEventListener('showNotification', handleNotification)
    }
  }, [])
  
  // Get background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500'
      case 'error':
        return 'bg-red-50 border-red-500'
      case 'warning':
        return 'bg-yellow-50 border-yellow-500'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-500'
    }
  }
  
  // Get text color based on notification type
  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
      default:
        return 'text-blue-800'
    }
  }
  
  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg p-4 max-w-xs w-full border-l-4 z-50 ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex items-start">
            <div className="ml-3">
              <h3 className={`font-bold ${getTextColor(notification.type)}`}>
                {notification.title}
              </h3>
              <p className={`text-sm ${getTextColor(notification.type)}`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex ${getTextColor(notification.type)} hover:bg-gray-100 focus:ring-2 focus:ring-gray-300`}
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}




