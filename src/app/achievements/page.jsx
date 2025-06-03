'use client'
import { useState, useEffect } from 'react'

// Define all possible achievements
const ACHIEVEMENTS = [
  {
    id: 'first_entry',
    title: 'First Steps',
    description: 'Log your first SRP entry',
    icon: '🏆'
  },
  {
    id: 'streak_7',
    title: 'Consistent Reader',
    description: 'Maintain a 7-day streak',
    icon: '🔥'
  },
  {
    id: 'streak_30',
    title: 'Scripture Master',
    description: 'Maintain a 30-day streak',
    icon: '📚'
  },
  {
    id: 'points_50',
    title: 'Halfway There',
    description: 'Earn a total of 50 points',
    icon: '⭐'
  },
  {
    id: 'points_100',
    title: 'Century Club',
    description: 'Earn a total of 100 points',
    icon: '🌟'
  },
  {
    id: 'theme_change',
    title: 'Customizer',
    description: 'Change the app theme color',
    icon: '🎨'
  },
  {
    id: 'data_export',
    title: 'Data Manager',
    description: 'Export your data for the first time',
    icon: '💾'
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Log entries for 7 consecutive days',
    icon: '📅'
  }
]

export default function AchievementsPage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Load unlocked achievements from localStorage
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]')
    setUnlockedAchievements(achievements)
    
    // Calculate progress percentage
    const progressPercentage = (achievements.length / ACHIEVEMENTS.length) * 100
    setProgress(progressPercentage)
    
    // Check for new achievements
    checkAchievements()
  }, [])
  
  const checkAchievements = () => {
    const savedPoints = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    const dates = Object.keys(savedPoints).sort()
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]')
    let updated = false
    
    // First entry achievement
    if (dates.length > 0 && !achievements.includes('first_entry')) {
      achievements.push('first_entry')
      updated = true
    }
    
    // Points achievements
    const totalPoints = Object.values(savedPoints).reduce(
      (sum, val) => sum + parseFloat(val), 0
    )
    
    if (totalPoints >= 50 && !achievements.includes('points_50')) {
      achievements.push('points_50')
      updated = true
    }
    
    if (totalPoints >= 100 && !achievements.includes('points_100')) {
      achievements.push('points_100')
      updated = true
    }
    
    // Streak achievements
    let maxStreak = 1
    let tempStreak = 1
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1])
      const currDate = new Date(dates[i])
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate - prevDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    
    if (maxStreak >= 7 && !achievements.includes('streak_7')) {
      achievements.push('streak_7')
      updated = true
    }
    
    if (maxStreak >= 30 && !achievements.includes('streak_30')) {
      achievements.push('streak_30')
      updated = true
    }
    
    // Perfect week achievement
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    let perfectWeek = true
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      if (!savedPoints[dateStr]) {
        perfectWeek = false
        break
      }
    }
    
    if (perfectWeek && !achievements.includes('perfect_week')) {
      achievements.push('perfect_week')
      updated = true
    }
    
    if (updated) {
      localStorage.setItem('achievements', JSON.stringify(achievements))
      setUnlockedAchievements(achievements)
      setProgress((achievements.length / ACHIEVEMENTS.length) * 100)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Achievements</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: 'var(--theme-color)'
              }}
            ></div>
          </div>
          <span className="ml-4 font-semibold">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You've unlocked {unlockedAchievements.length} out of {ACHIEVEMENTS.length} achievements.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id)
          
          return (
            <div
              key={achievement.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 ${
                isUnlocked
                  ? 'border-green-500'
                  : 'border-gray-300 dark:border-gray-600 opacity-70'
              }`}
            >
              <div className="flex items-start">
                <div className="text-3xl mr-4">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold">
                    {achievement.title}
                    {isUnlocked && (
                      <span className="ml-2 text-green-500">✓</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

