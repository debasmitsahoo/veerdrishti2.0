"""
Soldier monitoring data simulation.
Manages soldier status, GPS, heart rate, and emergency simulation.
"""

import time
import random
import threading
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Soldier:
    id: str
    name: str
    gps_lat: float
    gps_lon: float
    heart_rate: int
    status: str  # "OK", "AT_RISK", "CRITICAL"
    last_update: float

class SoldierMonitor:
    def __init__(self):
        self.soldiers = []
        self.running = False
        self.thread = None
        self._initialize_soldiers()
    
    def _initialize_soldiers(self):
        """Initialize 6 simulated soldiers with random data."""
        soldier_data = [
            {"id": "soldier-1", "name": "Lt. Rajesh Kumar", "lat": 28.6139, "lon": 77.2090},
            {"id": "soldier-2", "name": "Sgt. Priya Sharma", "lat": 28.6140, "lon": 77.2095},
            {"id": "soldier-3", "name": "Cpl. Amit Singh", "lat": 28.6145, "lon": 77.2100},
            {"id": "soldier-4", "name": "Pvt. Sunita Devi", "lat": 28.6142, "lon": 77.2098},
            {"id": "soldier-5", "name": "Maj. Vikram Joshi", "lat": 28.6148, "lon": 77.2105},
            {"id": "soldier-6", "name": "Capt. Anjali Patel", "lat": 28.6143, "lon": 77.2102}
        ]
        
        for data in soldier_data:
            soldier = Soldier(
                id=data["id"],
                name=data["name"],
                gps_lat=data["lat"],
                gps_lon=data["lon"],
                heart_rate=random.randint(60, 100),
                status="OK",
                last_update=time.time()
            )
            self.soldiers.append(soldier)
        
        logger.info(f"Initialized {len(self.soldiers)} soldiers")
    
    def _simulate_soldier_data(self):
        """Simulate soldier data updates every second."""
        while self.running:
            for soldier in self.soldiers:
                # Only update if not in CRITICAL status (emergency simulation)
                if soldier.status != "CRITICAL":
                    # Random heart rate variation (60-100 bpm)
                    heart_rate_change = random.randint(-5, 5)
                    soldier.heart_rate = max(60, min(100, soldier.heart_rate + heart_rate_change))
                    
                    # Random GPS drift (small movements)
                    lat_change = random.uniform(-0.0001, 0.0001)
                    lon_change = random.uniform(-0.0001, 0.0001)
                    soldier.gps_lat += lat_change
                    soldier.gps_lon += lon_change
                    
                    # Determine status based on heart rate
                    if soldier.heart_rate < 70 or soldier.heart_rate > 90:
                        soldier.status = "AT_RISK"
                    else:
                        soldier.status = "OK"
                
                soldier.last_update = time.time()
            
            time.sleep(1.0)  # Update every second
    
    def start(self):
        """Start the soldier monitoring simulation."""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._simulate_soldier_data, daemon=True)
            self.thread.start()
            logger.info("Soldier monitoring started")
    
    def stop(self):
        """Stop the soldier monitoring simulation."""
        self.running = False
        if self.thread:
            self.thread.join()
        logger.info("Soldier monitoring stopped")
    
    def get_soldiers(self) -> List[Dict[str, Any]]:
        """Get current soldier data."""
        return [
            {
                "id": soldier.id,
                "name": soldier.name,
                "gps": {"lat": soldier.gps_lat, "lon": soldier.gps_lon},
                "heart_rate": soldier.heart_rate,
                "status": soldier.status,
                "last_update": soldier.last_update
            }
            for soldier in self.soldiers
        ]
    
    def simulate_emergency(self, soldier_id: str) -> bool:
        """Simulate emergency for a specific soldier."""
        for soldier in self.soldiers:
            if soldier.id == soldier_id:
                soldier.status = "CRITICAL"
                soldier.heart_rate = random.randint(120, 150)  # Elevated heart rate
                soldier.last_update = time.time()
                logger.info(f"Emergency simulated for {soldier.name} ({soldier.id})")
                return True
        
        logger.warning(f"Soldier {soldier_id} not found")
        return False
    
    def get_alerts(self) -> List[Dict[str, Any]]:
        """Get current alerts from soldier data."""
        alerts = []
        current_time = time.time()
        
        for soldier in self.soldiers:
            # Check for status alerts
            if soldier.status == "CRITICAL":
                alerts.append({
                    "type": "soldier_emergency",
                    "message": f"CRITICAL: {soldier.name} requires immediate assistance",
                    "meta": {
                        "soldier_id": soldier.id,
                        "soldier_name": soldier.name,
                        "heart_rate": soldier.heart_rate,
                        "gps": {"lat": soldier.gps_lat, "lon": soldier.gps_lon}
                    },
                    "severity": "HIGH",
                    "timestamp": soldier.last_update
                })
            elif soldier.status == "AT_RISK":
                alerts.append({
                    "type": "soldier_warning",
                    "message": f"WARNING: {soldier.name} shows concerning vital signs",
                    "meta": {
                        "soldier_id": soldier.id,
                        "soldier_name": soldier.name,
                        "heart_rate": soldier.heart_rate,
                        "gps": {"lat": soldier.gps_lat, "lon": soldier.gps_lon}
                    },
                    "severity": "MEDIUM",
                    "timestamp": soldier.last_update
                })
        
        return alerts

# Global soldier monitor instance
soldier_monitor = SoldierMonitor()
