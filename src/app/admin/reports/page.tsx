'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Clock, User, TrendingUp } from 'lucide-react'

/**
 * Report interface
 */
interface Report {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  created_at: string
  generated_by: string
}

/**
 * AdminReports Component
 *
 * Report management interface with:
 * - Generate new reports
 * - View report history
 * - Download reports
 * - Schedule automated reports
 */
export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly')

  /**
   * Load reports list
   */
  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/reports/generate')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Generate new report
   */
  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: selectedType,
          sections: ['overview', 'users', 'revenue', 'tools'],
        }),
      })

      if (response.ok) {
        const report = await response.json()
        
        // Download the report
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${selectedType}-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Reload reports list
        loadReports()
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
    }
  }

  /**
   * Format date
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /**
   * Get report type badge color
   */
  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-700'
      case 'weekly':
        return 'bg-purple-100 text-purple-700'
      case 'monthly':
        return 'bg-green-100 text-green-700'
      case 'custom':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">
          Generate and download comprehensive analytics reports
        </p>
      </div>

      {/* Generate Report Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Generate New Report</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          <div className="pt-6">
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Reports include overview metrics, user growth, revenue analysis, and tool usage statistics.
            The report will be automatically downloaded as a JSON file.
          </p>
        </div>
      </div>

      {/* Report History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Report History</h2>
          <button
            onClick={loadReports}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reports generated yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Generate your first report to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Download report logic would go here
                    window.open(`/api/admin/reports/${report.id}/download`, '_blank')
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Reports</p>
              <p className="text-3xl font-bold mt-1">{reports.length}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">This Month</p>
              <p className="text-3xl font-bold mt-1">
                {reports.filter(r => {
                  const reportDate = new Date(r.created_at)
                  const now = new Date()
                  return reportDate.getMonth() === now.getMonth() && 
                         reportDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Most Common</p>
              <p className="text-xl font-bold mt-1 capitalize">
                {(() => {
                  if (reports.length === 0) return 'N/A'
                  const typeCounts = reports.reduce((acc, r) => {
                    acc[r.type] = (acc[r.type] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                  const mostCommon = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]
                  return mostCommon ? mostCommon[0] : 'N/A'
                })()}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
