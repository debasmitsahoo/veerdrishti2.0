import { useState, useEffect, useRef } from 'react'

export default function VideoFeed({ detections }) {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadeddata', () => setVideoLoaded(true))
      video.addEventListener('error', () => {
        console.log('Video failed to load, using placeholder')
        setVideoLoaded(false)
      })
    }
  }, [])

  return (
    <div className="relative">
      {/* Video Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/sample_videos/demo1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay for Detection Boxes */}
        {videoLoaded && detections.length > 0 && (
          <div className="video-overlay">
            {detections.map((detection, index) => {
              const { bbox, label, confidence } = detection
              const [x1, y1, x2, y2] = bbox
              const width = x2 - x1
              const height = y2 - y1

              return (
                <div
                  key={index}
                  className="detection-box"
                  style={{
                    left: `${x1}px`,
                    top: `${y1}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className="detection-label">
                    {label} ({Math.round(confidence * 100)}%)
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Video Loading/Error State */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-sm">Video feed unavailable</p>
              <p className="text-xs text-gray-400 mt-1">
                Place demo1.mp4 in /sample_videos/
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detection Summary */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Active Detections: {detections.length}
          </span>
          <span className="text-gray-500">
            {detections.length > 0 ? 'Threats detected' : 'All clear'}
          </span>
        </div>
        
        {detections.length > 0 && (
          <div className="mt-2 space-y-1">
            {detections.map((detection, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-red-50 p-2 rounded">
                <span className="font-medium text-red-800">
                  {detection.label}
                </span>
                <span className="text-red-600">
                  {Math.round(detection.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
