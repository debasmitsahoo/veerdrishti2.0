import { useState } from 'react'

export default function AlertPanel({ alerts }) {
  const [filter, setFilter] = useState('all')

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'severity-high'
      case 'MEDIUM':
        return 'severity-medium'
      case 'LOW':
        return 'severity-low'
      default:
        return 'severity-low'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'HIGH':
        return '🚨'
      case 'MEDIUM':
        return '⚠️'
      case 'LOW':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'threat_detection':
        return '🎯'
      case 'soldier_emergency':
        return '👤'
      case 'soldier_warning':
        return '👤'
      default:
        return '📢'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'high') return alert.severity === 'HIGH'
    if (filter === 'medium') return alert.severity === 'MEDIUM'
    if (filter === 'low') return alert.severity === 'LOW'
    return true
  })

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)

    if (diffMins > 0) {
      return `${diffMins}m ${diffSecs}s ago`
    } else {
      return `${diffSecs}s ago`
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-3 py-1 text-xs rounded ${
            filter === 'high'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          High ({alerts.filter(a => a.severity === 'HIGH').length})
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-3 py-1 text-xs rounded ${
            filter === 'medium'
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Med ({alerts.filter(a => a.severity === 'MEDIUM').length})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-sm">No alerts</p>
            <p className="text-xs">All systems normal</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <span className="text-lg">
                    {getTypeIcon(alert.type)}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {alert.severity}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(alert.timestamp)}
                </span>
              </div>

              {/* Alert Message */}
              <p className="text-sm font-medium mb-2">
                {alert.message}
              </p>

              {/* Alert Meta */}
              {alert.meta && (
                <div className="text-xs text-gray-600 space-y-1">
                  {alert.type === 'threat_detection' && (
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-mono">
                        {Math.round(alert.meta.confidence * 100)}%
                      </span>
                    </div>
                  )}
                  {alert.type === 'soldier_emergency' && (
                    <div className="flex justify-between">
                      <span>Heart Rate:</span>
                      <span className="font-mono">{alert.meta.heart_rate} BPM</span>
                    </div>
                  )}
                  {alert.meta.gps && (
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-mono text-xs">
                        {alert.meta.gps.lat.toFixed(4)}, {alert.meta.gps.lon.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-red-600">
                {alerts.filter(a => a.severity === 'HIGH').length}
              </div>
              <div className="text-gray-600">High</div>
            </div>
            <div>
              <div className="font-semibold text-yellow-600">
                {alerts.filter(a => a.severity === 'MEDIUM').length}
              </div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">
                {alerts.filter(a => a.severity === 'LOW').length}
              </div>
              <div className="text-gray-600">Low</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
