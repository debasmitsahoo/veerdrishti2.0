import { useState, useEffect } from 'react'
import Head from 'next/head'
import VideoFeed from '../components/VideoFeed'
import SoldierStatus from '../components/SoldierStatus'
import AlertPanel from '../components/AlertPanel'

export default function Dashboard() {
  const [detections, setDetections] = useState([])
  const [soldiers, setSoldiers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [hasHighAlert, setHasHighAlert] = useState(false)
  const [lastHighAlertTime, setLastHighAlertTime] = useState(0)

  // Poll API endpoints every 1 second
  useEffect(() => {
    const pollData = async () => {
      try {
        // Fetch detections
        const detectionsRes = await fetch('http://localhost:8000/api/detections')
        if (detectionsRes.ok) {
          const detectionsData = await detectionsRes.json()
          setDetections(detectionsData.detections || [])
        }

        // Fetch soldiers
        const soldiersRes = await fetch('http://localhost:8000/api/soldiers')
        if (soldiersRes.ok) {
          const soldiersData = await soldiersRes.json()
          setSoldiers(soldiersData.soldiers || [])
        }

        // Fetch alerts
        const alertsRes = await fetch('http://localhost:8000/api/alerts')
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json()
          setAlerts(alertsData.alerts || [])
          
          // Check for new HIGH alerts
          const highAlerts = alertsData.alerts.filter(alert => alert.severity === 'HIGH')
          if (highAlerts.length > 0) {
            const latestHighAlert = highAlerts[0]
            if (latestHighAlert.timestamp > lastHighAlertTime) {
              setHasHighAlert(true)
              setLastHighAlertTime(latestHighAlert.timestamp)
              
              // Play beep sound for new HIGH alerts
              try {
                const audio = new Audio('/beep.mp3')
                audio.play().catch(e => console.log('Could not play beep sound:', e))
              } catch (e) {
                console.log('Beep sound not available:', e)
              }
            }
          } else {
            setHasHighAlert(false)
          }
        }
      } catch (error) {
        console.error('Error polling data:', error)
      }
    }

    // Initial poll
    pollData()

    // Set up polling interval
    const interval = setInterval(pollData, 1000)

    return () => clearInterval(interval)
  }, [lastHighAlertTime])

  return (
    <>
      <Head>
        <title>VeerDrishti - Threat Detection Dashboard</title>
        <meta name="description" content="Real-time threat detection and soldier monitoring system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* High Alert Banner */}
        {hasHighAlert && (
          <div className="alert-banner bg-red-600 text-white text-center py-3 px-4 font-bold">
            🚨 HIGH ALERT - IMMEDIATE ATTENTION REQUIRED 🚨
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VeerDrishti</h1>
                <p className="text-sm text-gray-600">Threat Detection & Soldier Monitoring</p>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Video Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Feed</h2>
                <VideoFeed detections={detections} />
              </div>
            </div>

            {/* Middle Panel - Soldier Status */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Soldier Status</h2>
                <SoldierStatus soldiers={soldiers} />
              </div>
            </div>

            {/* Right Panel - Alert Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Panel</h2>
                <AlertPanel alerts={alerts} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
