import { useState } from 'react'

export default function SoldierStatus({ soldiers }) {
  const [simulating, setSimulating] = useState(new Set())

  const simulateEmergency = async (soldierId) => {
    setSimulating(prev => new Set(prev).add(soldierId))
    
    try {
      const response = await fetch('http://localhost:8000/api/soldiers/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: soldierId }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Emergency simulated:', result)
      } else {
        console.error('Failed to simulate emergency')
      }
    } catch (error) {
      console.error('Error simulating emergency:', error)
    } finally {
      setSimulating(prev => {
        const newSet = new Set(prev)
        newSet.delete(soldierId)
        return newSet
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
        return 'status-ok'
      case 'AT_RISK':
        return 'status-at-risk'
      case 'CRITICAL':
        return 'status-critical'
      default:
        return 'status-ok'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK':
        return '✅'
      case 'AT_RISK':
        return '⚠️'
      case 'CRITICAL':
        return '🚨'
      default:
        return '❓'
    }
  }

  const getHeartRateColor = (heartRate) => {
    if (heartRate < 70 || heartRate > 90) {
      return 'text-red-600'
    }
    return 'text-green-600'
  }

  return (
    <div className="space-y-4">
      {soldiers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">👥</div>
          <p>No soldier data available</p>
          <p className="text-sm">Check backend connection</p>
        </div>
      ) : (
        soldiers.map((soldier) => (
          <div
            key={soldier.id}
            className={`soldier-card border rounded-lg p-4 ${getStatusColor(soldier.status)}`}
          >
            {/* Soldier Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getStatusIcon(soldier.status)}</span>
                <div>
                  <h3 className="font-semibold text-sm">{soldier.name}</h3>
                  <p className="text-xs text-gray-600">ID: {soldier.id}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(soldier.status)}`}>
                {soldier.status}
              </span>
            </div>

            {/* Vital Signs */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                <p className={`text-sm font-medium ${getHeartRateColor(soldier.heart_rate)}`}>
                  {soldier.heart_rate} BPM
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">GPS</p>
                <p className="text-xs font-mono">
                  {soldier.gps.lat.toFixed(4)}, {soldier.gps.lon.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Emergency Button */}
            <button
              onClick={() => simulateEmergency(soldier.id)}
              disabled={simulating.has(soldier.id) || soldier.status === 'CRITICAL'}
              className={`w-full text-xs font-medium py-2 px-3 rounded transition-colors ${
                simulating.has(soldier.id)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : soldier.status === 'CRITICAL'
                  ? 'bg-red-200 text-red-600 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {simulating.has(soldier.id)
                ? 'Simulating...'
                : soldier.status === 'CRITICAL'
                ? 'Emergency Active'
                : 'Simulate Emergency'}
            </button>

            {/* Last Update */}
            <div className="mt-2 text-xs text-gray-500">
              Updated: {new Date(soldier.last_update * 1000).toLocaleTimeString()}
            </div>
          </div>
        ))
      )}

      {/* Summary Stats */}
      {soldiers.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-green-600">
                {soldiers.filter(s => s.status === 'OK').length}
              </div>
              <div className="text-gray-600">OK</div>
            </div>
            <div>
              <div className="font-semibold text-yellow-600">
                {soldiers.filter(s => s.status === 'AT_RISK').length}
              </div>
              <div className="text-gray-600">At Risk</div>
            </div>
            <div>
              <div className="font-semibold text-red-600">
                {soldiers.filter(s => s.status === 'CRITICAL').length}
              </div>
              <div className="text-gray-600">Critical</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
