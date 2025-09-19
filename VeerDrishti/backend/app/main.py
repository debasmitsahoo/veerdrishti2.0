"""
FastAPI main application for VeerDrishti threat detection and soldier monitoring.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import time
from typing import List, Dict, Any

from app.inference import inference_engine
from app.soldier_data import soldier_monitor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="VeerDrishti API",
    description="Threat detection and soldier monitoring system",
    version="1.0.0"
)

# Enable CORS for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SimulationRequest(BaseModel):
    id: str

class DetectionResponse(BaseModel):
    detections: List[Dict[str, Any]]
    timestamp: float

class SoldierResponse(BaseModel):
    soldiers: List[Dict[str, Any]]
    timestamp: float

class AlertResponse(BaseModel):
    alerts: List[Dict[str, Any]]
    timestamp: float

# Global variables for tracking alerts
last_high_alert_time = 0
alert_history = []

@app.on_event("startup")
async def startup_event():
    """Start background tasks on application startup."""
    logger.info("Starting VeerDrishti backend services...")
    
    # Start inference engine
    inference_engine.start()
    
    # Start soldier monitoring
    soldier_monitor.start()
    
    logger.info("All services started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop background tasks on application shutdown."""
    logger.info("Stopping VeerDrishti backend services...")
    
    # Stop inference engine
    inference_engine.stop()
    
    # Stop soldier monitoring
    soldier_monitor.stop()
    
    logger.info("All services stopped")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "VeerDrishti API",
        "version": "1.0.0",
        "endpoints": {
            "detections": "/api/detections",
            "soldiers": "/api/soldiers",
            "simulate_emergency": "/api/soldiers/simulate",
            "alerts": "/api/alerts"
        }
    }

@app.get("/api/detections", response_model=DetectionResponse)
async def get_detections():
    """Get latest threat detections from video analysis."""
    try:
        detections = inference_engine.get_detections()
        
        # Convert detections to alert format if confidence >= 0.5
        current_time = time.time()
        for detection in detections:
            if detection["confidence"] >= 0.5:
                alert = {
                    "type": "threat_detection",
                    "message": f"Threat detected: {detection['label']} (confidence: {detection['confidence']:.2f})",
                    "meta": {
                        "label": detection["label"],
                        "confidence": detection["confidence"],
                        "bbox": detection["bbox"]
                    },
                    "severity": "HIGH" if detection["confidence"] >= 0.8 else "MEDIUM",
                    "timestamp": detection["timestamp"]
                }
                
                # Add to alert history if not already present
                if alert not in alert_history:
                    alert_history.append(alert)
        
        return DetectionResponse(
            detections=detections,
            timestamp=current_time
        )
    except Exception as e:
        logger.error(f"Error getting detections: {e}")
        raise HTTPException(status_code=500, detail="Failed to get detections")

@app.get("/api/soldiers", response_model=SoldierResponse)
async def get_soldiers():
    """Get current soldier status and data."""
    try:
        soldiers = soldier_monitor.get_soldiers()
        current_time = time.time()
        
        return SoldierResponse(
            soldiers=soldiers,
            timestamp=current_time
        )
    except Exception as e:
        logger.error(f"Error getting soldiers: {e}")
        raise HTTPException(status_code=500, detail="Failed to get soldier data")

@app.post("/api/soldiers/simulate")
async def simulate_emergency(request: SimulationRequest):
    """Simulate emergency for a specific soldier."""
    try:
        success = soldier_monitor.simulate_emergency(request.id)
        
        if success:
            return {
                "message": f"Emergency simulated for soldier {request.id}",
                "success": True
            }
        else:
            raise HTTPException(status_code=404, detail=f"Soldier {request.id} not found")
    except Exception as e:
        logger.error(f"Error simulating emergency: {e}")
        raise HTTPException(status_code=500, detail="Failed to simulate emergency")

@app.get("/api/alerts", response_model=AlertResponse)
async def get_alerts():
    """Get unified alerts from both threat detection and soldier monitoring."""
    try:
        current_time = time.time()
        all_alerts = []
        
        # Get soldier alerts
        soldier_alerts = soldier_monitor.get_alerts()
        all_alerts.extend(soldier_alerts)
        
        # Get threat detection alerts
        detections = inference_engine.get_detections()
        for detection in detections:
            if detection["confidence"] >= 0.5:
                alert = {
                    "type": "threat_detection",
                    "message": f"Threat detected: {detection['label']} (confidence: {detection['confidence']:.2f})",
                    "meta": {
                        "label": detection["label"],
                        "confidence": detection["confidence"],
                        "bbox": detection["bbox"]
                    },
                    "severity": "HIGH" if detection["confidence"] >= 0.8 else "MEDIUM",
                    "timestamp": detection["timestamp"]
                }
                all_alerts.append(alert)
        
        # Sort alerts by timestamp (newest first)
        all_alerts.sort(key=lambda x: x["timestamp"], reverse=True)
        
        # Keep only recent alerts (last 10 minutes)
        cutoff_time = current_time - 600  # 10 minutes ago
        all_alerts = [alert for alert in all_alerts if alert["timestamp"] > cutoff_time]
        
        return AlertResponse(
            alerts=all_alerts,
            timestamp=current_time
        )
    except Exception as e:
        logger.error(f"Error getting alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to get alerts")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "inference": "running" if inference_engine.running else "stopped",
            "soldier_monitor": "running" if soldier_monitor.running else "stopped"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
