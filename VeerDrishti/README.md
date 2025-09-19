# VeerDrishti - Threat Detection & Soldier Monitoring System

A full-stack demo application that merges video-based threat detection with simulated soldier safety monitoring. Built for 24-hour hackathons with real-time threat detection, soldier status tracking, and unified alert management.

## 🚀 Features

- **Real-time Video Analysis**: YOLO-based threat detection with OpenCV fallback
- **Soldier Monitoring**: GPS tracking, heart rate monitoring, and status management
- **Unified Alert System**: Centralized alerts with severity levels and audio notifications
- **Interactive Dashboard**: Three-panel layout with live updates
- **Emergency Simulation**: Test emergency scenarios with one-click simulation
- **Mobile-Friendly**: Responsive design for various screen sizes

## 📁 Project Structure

```
VeerDrishti/
├── frontend/           # Next.js React application
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   ├── public/         # Static assets
│   └── styles/         # CSS styles
├── backend/            # FastAPI Python application
│   └── app/            # Python modules
├── sample_videos/      # Video files for detection
└── README.md          # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **Git** (for cloning)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd VeerDrishti/backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   
   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Add sample video** (optional):
   - Place a 10-30 second MP4 video in `../sample_videos/demo1.mp4`
   - Any video with people/vehicles works for detection

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd VeerDrishti/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add beep sound** (optional):
   - Replace `public/beep.mp3` with a short beep sound
   - Used for HIGH severity alert notifications

## 🚀 Running the Application

### Start Backend Server

```bash
cd VeerDrishti/backend
python -m app.main
```

**Alternative** (if module import issues):
```bash
cd VeerDrishti/backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: `http://localhost:8000`

### Start Frontend Server

```bash
cd VeerDrishti/frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📱 Usage

### Dashboard Overview

The dashboard consists of three main panels:

1. **Video Feed (Left Panel)**:
   - Displays live video with threat detection overlays
   - Shows bounding boxes around detected objects
   - Confidence scores for each detection

2. **Soldier Status (Middle Panel)**:
   - Real-time soldier monitoring
   - GPS coordinates and heart rate
   - Emergency simulation buttons
   - Status indicators (OK/AT_RISK/CRITICAL)

3. **Alert Panel (Right Panel)**:
   - Unified alert system
   - Severity filtering (High/Medium/Low)
   - Real-time updates
   - Audio notifications for HIGH alerts

### Key Features

- **Automatic Updates**: Data refreshes every 1 second
- **Emergency Simulation**: Click "Simulate Emergency" to test soldier alerts
- **Threat Detection**: Automatic detection of people, vehicles, weapons
- **Audio Alerts**: Beep sound for HIGH severity alerts
- **Mobile Responsive**: Works on phones and tablets

## 🔧 API Endpoints

### Backend API (Port 8000)

- `GET /` - API information
- `GET /api/detections` - Latest threat detections
- `GET /api/soldiers` - Soldier status data
- `POST /api/soldiers/simulate` - Simulate emergency
- `GET /api/alerts` - Unified alerts
- `GET /health` - Health check

### Example API Calls

```bash
# Get detections
curl http://localhost:8000/api/detections

# Get soldiers
curl http://localhost:8000/api/soldiers

# Simulate emergency
curl -X POST http://localhost:8000/api/soldiers/simulate \
  -H "Content-Type: application/json" \
  -d '{"id": "soldier-3"}'
```

## 🎯 Detection System

### YOLO Model (Primary)
- Uses YOLOv8n for object detection
- Detects: person, car, truck, motorbike, knife, gun, vehicle
- Confidence threshold: 0.5
- Automatic model download on first run

### OpenCV Fallback
- Motion detection when YOLO unavailable
- Frame difference analysis
- Detects movement as "intrusion"
- Works without external dependencies

## 👥 Soldier Simulation

### Default Soldiers
- 6 simulated soldiers with realistic data
- Random GPS coordinates around Delhi
- Heart rate monitoring (60-100 BPM)
- Status changes based on vital signs

### Emergency Simulation
- Set any soldier to CRITICAL status
- Elevated heart rate (120-150 BPM)
- Immediate alert generation
- One-click testing interface

## 🚨 Alert System

### Alert Types
- **Threat Detection**: Video analysis alerts
- **Soldier Emergency**: Critical soldier status
- **Soldier Warning**: At-risk soldier status

### Severity Levels
- **HIGH**: Confidence ≥ 0.8, Critical soldiers
- **MEDIUM**: Confidence 0.5-0.8, At-risk soldiers
- **LOW**: General notifications

### Audio Notifications
- Beep sound for new HIGH alerts
- One-time playback per alert
- Configurable sound file

## 🛠️ Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check Python version (3.8+)
   - Install dependencies: `pip install -r requirements.txt`
   - Check port 8000 availability

2. **Frontend won't start**:
   - Check Node.js version (16+)
   - Install dependencies: `npm install`
   - Check port 3000 availability

3. **No video detection**:
   - Add video file to `sample_videos/demo1.mp4`
   - Check video format (MP4)
   - Verify file permissions

4. **YOLO model issues**:
   - System automatically falls back to OpenCV
   - Check internet connection for model download
   - Verify ultralytics installation

5. **CORS errors**:
   - Backend configured for all origins
   - Check firewall settings
   - Verify port accessibility

### Performance Tips

- **Video Processing**: Runs at 1 FPS for performance
- **Memory Usage**: YOLO model loads once at startup
- **Network**: Local API calls for real-time updates
- **Browser**: Modern browsers recommended

## 🔒 Security Notes

- **CORS**: Enabled for all origins (demo only)
- **Authentication**: None (demo system)
- **Data**: All data is simulated
- **Network**: Local development only

## 📊 System Requirements

### Minimum
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB free space
- **Network**: Local only

### Recommended
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 5GB free space
- **GPU**: Optional (for YOLO acceleration)

## 🎨 Customization

### Adding New Detection Classes
Edit `backend/app/inference.py`:
```python
self.watchlist = ["person", "car", "truck", "motorbike", "knife", "gun", "vehicle", "intrusion"]
```

### Modifying Soldier Data
Edit `backend/app/soldier_data.py`:
```python
soldier_data = [
    {"id": "soldier-1", "name": "Your Name", "lat": 28.6139, "lon": 77.2090},
    # Add more soldiers...
]
```

### Styling Changes
Edit `frontend/styles/globals.css` for custom styling.

## 📝 Development Notes

- **Real-time Updates**: 1-second polling interval
- **Error Handling**: Graceful fallbacks for all components
- **Logging**: Comprehensive logging for debugging
- **Modular Design**: Easy to extend and modify

## 🤝 Contributing

This is a demo project for hackathons. Feel free to:
- Add new features
- Improve detection accuracy
- Enhance UI/UX
- Add new alert types
- Implement additional monitoring

## 📄 License

Demo project - use freely for hackathons and learning purposes.

---

**Ready to run in minutes!** 🚀

For questions or issues, check the troubleshooting section or review the code comments.
