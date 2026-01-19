import React from 'react'

/**
 * Maintenance Report Card Component
 * Used on tenant dashboard to display individual reports
 */
export const ReportCard = ({ report }) => {
  const isOngoing = report.status === 'pågående'
  const bgColor = isOngoing ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
  const badgeBgColor = isOngoing ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
  const statusText = isOngoing ? 'Pågående' : 'Åtgärdad'

  return (
    <div className={`border rounded-lg p-4 ${bgColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{report.title}</h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</p>
          <p className="text-xs text-gray-500 mt-2">{report.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${badgeBgColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  )
}
