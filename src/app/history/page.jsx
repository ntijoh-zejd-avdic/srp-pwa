'use client'
import { useState, useEffect } from 'react'
import { useSettings } from '../../contexts/SettingsContext'

export default function HistoryPage() {
  const [entries, setEntries] = useState([])
  const [isEditing, setIsEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const { settings } = useSettings()
  
  useEffect(() => {
    loadEntries()
  }, [])
  
  const loadEntries = () => {
    const savedPoints = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    
    // Convert to array and sort by date (newest first)
    const entriesArray = Object.entries(savedPoints).map(([date, points]) => ({
      date,
      points: parseFloat(points),
      formattedDate: formatDate(date)
    }))
    
    entriesArray.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    setEntries(entriesArray)
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const handleEdit = (entry) => {
    setIsEditing(entry.date)
    setEditValue(entry.points.toString())
  }
  
  const handleSaveEdit = () => {
    if (!isEditing) return
    
    const savedPoints = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    savedPoints[isEditing] = parseFloat(editValue)
    
    localStorage.setItem('savedPoints', JSON.stringify(savedPoints))
    
    setIsEditing(null)
    loadEntries()
    
    // Show notification
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        title: 'Entry Updated',
        message: 'Your entry has been updated successfully.',
        type: 'success',
        duration: 3000
      }
    }))
  }
  
  const handleDelete = (date) => {
    if (settings.confirmBeforeDelete) {
      if (!window.confirm('Are you sure you want to delete this entry?')) {
        return
      }
    }
    
    const savedPoints = JSON.parse(localStorage.getItem('savedPoints') || '{}')
    delete savedPoints[date]
    
    localStorage.setItem('savedPoints', JSON.stringify(savedPoints))
    
    loadEntries()
    
    // Show notification
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        title: 'Entry Deleted',
        message: 'Your entry has been deleted.',
        type: 'info',
        duration: 3000
      }
    }))
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">History</h1>
      
      {entries.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">No entries yet. Start logging your SRP points!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {entries.map((entry) => (
                <tr key={entry.date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.formattedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {isEditing === entry.date ? (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span>{entry.points}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isEditing === entry.date ? (
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-4"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                        style={{ color: 'var(--theme-color)' }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(entry.date)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
