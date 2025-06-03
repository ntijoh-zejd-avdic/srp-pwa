'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AchievementTracker() {
  const [achievement, setAchievement] = useState(null)
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    // Listen for achievement events
    const handleAchievement = (event) => {
      setAchievement(event.detail)
      setVisible(true)
      
      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false)
      }, 5000)
    }
    
    window.addEventListener('achievement', handleAchievement)
    
    return () => {
      window.removeEventListener('achievement', handleAchievement)
    }
  }, [])
  
  // Check for achievements on mount
  useEffect(() => {
    checkAchievements()
  }, [])
  
  const checkAchievements = () => {
    const savedPoints = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]')
    
    // Calculate total points
    const totalPoints = Object.values(savedPoints).reduce(
      (sum, val) => sum + parseFloat(val), 0
    )
    
    // Check for points milestones
    if (totalPoints >= 50 && !achievements.includes('points_50')) {
      achievements.push('points_50')
      localStorage.setItem('achievements', JSON.stringify(achievements))
      
      setAchievement({
        title: 'Halfway There',
        message: 'Earn a total of 50 points'
      })
      setVisible(true)
      
      setTimeout(() => {
        setVisible(false)
      }, 5000)
    }
    
    if (totalPoints >= 100 && !achievements.includes('points_100')) {
      achievements.push('points_100')
      localStorage.setItem('achievements', JSON.stringify(achievements))
      
      setAchievement({
        title: 'Century Club',
        message: 'Earn a total of 100 points'
      })
      setVisible(true)
      
      setTimeout(() => {
        setVisible(false)
      }, 5000)
    }
  }
  
  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs w-full border-l-4 border-yellow-500 z-50"
        >
          <div className="flex items-center">
            <div className="text-3xl mr-3">🏆</div>
            <div>
              <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
              <p className="font-semibold">{achievement.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {achievement.message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

