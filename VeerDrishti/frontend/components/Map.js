import { useEffect, useRef } from 'react'

export default function Map({ soldiers = [] }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Simple static map implementation
    // In a real application, you would use Leaflet or Google Maps
    if (mapRef.current && soldiers.length > 0) {
      // Clear previous content
      mapRef.current.innerHTML = ''
      
      // Create a simple grid-based map representation
      const mapContainer = document.createElement('div')
      mapContainer.className = 'w-full h-48 bg-green-100 border-2 border-green-300 rounded-lg relative overflow-hidden'
      
      // Add grid lines
      for (let i = 0; i < 10; i++) {
        const line = document.createElement('div')
        line.className = 'absolute bg-green-200'
        if (i % 2 === 0) {
          line.style.width = '100%'
          line.style.height = '1px'
          line.style.top = `${i * 10}%`
        } else {
          line.style.height = '100%'
          line.style.width = '1px'
          line.style.left = `${i * 10}%`
        }
        mapContainer.appendChild(line)
      }
      
      // Add soldier markers
      soldiers.forEach((soldier, index) => {
        const marker = document.createElement('div')
        marker.className = `absolute w-4 h-4 rounded-full border-2 ${
          soldier.status === 'CRITICAL' ? 'bg-red-500 border-red-700' :
          soldier.status === 'AT_RISK' ? 'bg-yellow-500 border-yellow-700' :
          'bg-green-500 border-green-700'
        }`
        
        // Position markers in a grid pattern
        const x = (index % 3) * 30 + 15 // 3 columns
        const y = Math.floor(index / 3) * 30 + 15 // rows
        marker.style.left = `${x}%`
        marker.style.top = `${y}%`
        marker.title = `${soldier.name} (${soldier.status})`
        
        mapContainer.appendChild(marker)
      })
      
      // Add title
      const title = document.createElement('div')
      title.className = 'absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium shadow'
      title.textContent = 'Soldier Positions'
      mapContainer.appendChild(title)
      
      mapRef.current.appendChild(mapContainer)
    }
  }, [soldiers])

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">Tactical Map</div>
      
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-48">
        {soldiers.length === 0 && (
          <div className="w-full h-48 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🗺️</div>
              <p className="text-sm">No soldier data</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full border border-green-700"></div>
          <span>OK</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-700"></div>
          <span>At Risk</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-red-700"></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  )
}
