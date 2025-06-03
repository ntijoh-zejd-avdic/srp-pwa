'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsSaved() {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    // Listen for settings saved event
    const handleSettingsSaved = () => {
      setVisible(true)
      
      // Hide after 3 seconds
      setTimeout(() => {
        setVisible(false)
      }, 3000)
    }
    
    window.addEventListener('settingsSaved', handleSettingsSaved)
    
    return () => {
      window.removeEventListener('settingsSaved', handleSettingsSaved)
    }
  }, [])
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 max-w-xs w-full z-50"
        >
          <div className="flex items-center">
            <div className="text-green-800">
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">Settings saved successfully!</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100 inline-flex"
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

