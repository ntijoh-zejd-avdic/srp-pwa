'use client'

import SaveButton from './SaveButton'

export default function DailySummary({ dailyPoints }) {
  return (
    <div className="bg-summary-section px-4 py-2 rounded-xl shadow-lg flex items-center space-x-4 w-fit">
      <p className="text-sm font-medium text-black">
        Points Today: <span className="font-bold text-black">{dailyPoints}</span>
      </p>
      <SaveButton dailyPoints={dailyPoints} label="Save" />
    </div>
  )
}
