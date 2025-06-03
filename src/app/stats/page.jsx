'use client'
import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function StatsPage() {
  const [savedPoints, setSavedPoints] = useState({})
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    streak: 0,
    best: 0,
    daysLogged: 0
  })
  const [chartData, setChartData] = useState(null)
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('all')
  
  useEffect(() => {
    // Load saved points from localStorage
    const points = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    setSavedPoints(points)
    
    // Calculate stats
    calculateStats(points)
    
    // Prepare chart data
    prepareChartData(points, chartType, timeRange)
  }, [chartType, timeRange])
  
  const calculateStats = (points) => {
    const dates = Object.keys(points).sort()
    
    if (dates.length === 0) {
      setStats({
        total: 0,
        average: 0,
        streak: 0,
        best: 0,
        daysLogged: 0
      })
      return
    }
    
    // Calculate total points
    const total = Object.values(points).reduce(
      (sum, val) => sum + parseFloat(val), 0
    )
    
    // Calculate average
    const average = total / dates.length
    
    // Calculate current streak
    let currentStreak = 0
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    // Check if logged today or yesterday
    if (points[today] || points[yesterday]) {
      currentStreak = 1
      
      // Sort dates in reverse (newest first)
      const reversedDates = [...dates].reverse()
      
      // Start from most recent date
      let prevDate = new Date(reversedDates[0])
      
      for (let i = 1; i < reversedDates.length; i++) {
        const currDate = new Date(reversedDates[i])
        
        // Calculate difference in days
        const diffTime = Math.abs(prevDate - currDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          currentStreak++
          prevDate = currDate
        } else {
          break
        }
      }
    }
    
    // Calculate best streak
    let bestStreak = 1
    let tempStreak = 1
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1])
      const currDate = new Date(dates[i])
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate - prevDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        tempStreak++
        bestStreak = Math.max(bestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    
    setStats({
      total: parseFloat(total.toFixed(1)),
      average: parseFloat(average.toFixed(1)),
      streak: currentStreak,
      best: bestStreak,
      daysLogged: dates.length
    })
  }
  
  const prepareChartData = (points, type, range) => {
    const dates = Object.keys(points).sort()
    
    if (dates.length === 0) {
      setChartData(null)
      return
    }
    
    // Filter dates based on time range
    let filteredDates = [...dates]
    const now = new Date()
    
    if (range === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredDates = dates.filter(date => new Date(date) >= weekAgo)
    } else if (range === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredDates = dates.filter(date => new Date(date) >= monthAgo)
    }
    
    // Format dates for display
    const labels = filteredDates.map(date => {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
    
    // Get values
    const values = filteredDates.map(date => points[date])
    
    // Create cumulative values for line chart
    let cumulativeValues = []
    let sum = 0
    
    filteredDates.forEach(date => {
      sum += parseFloat(points[date])
      cumulativeValues.push(parseFloat(sum.toFixed(1)))
    })
    
    setChartData({
      labels,
      datasets: [
        {
          label: type === 'line' ? 'Cumulative Points' : 'Daily Points',
          data: type === 'line' ? cumulativeValues : values,
          borderColor: 'var(--theme-color)',
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          tension: 0.1
        }
      ]
    })
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartType === 'line' ? 'Cumulative Points Over Time' : 'Daily Points',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Points</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>{stats.total}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Daily Average</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>{stats.average}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Current Streak</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>{stats.streak} days</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Days Logged</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>{stats.daysLogged}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white mr-2"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="month">Last 30 Days</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>
        </div>
        
        <div className="h-64">
          {chartData ? (
            chartType === 'line' ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        
        <div className="flex items-center">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${Math.min((stats.total / 100) * 100, 100)}%`,
                backgroundColor: 'var(--theme-color)'
              }}
            ></div>
          </div>
          <span className="ml-4 font-semibold">
            {stats.total}/100 Points
          </span>
        </div>
        
        <div className="mt-4">
          <a 
            href="/achievements" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            style={{ color: 'var(--theme-color)' }}
          >
            View all achievements →
          </a>
        </div>
      </div>
    </div>
  )
}


