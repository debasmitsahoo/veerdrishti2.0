"""
Video inference module for threat detection.
Supports YOLO model with OpenCV motion detection fallback.
"""

import cv2
import numpy as np
import time
import logging
from typing import List, Dict, Any, Optional
import threading
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VideoInference:
    def __init__(self, video_path: str = "../sample_videos/demo1.mp4"):
        self.video_path = video_path
        self.detections = []
        self.model = None
        self.cap = None
        self.running = False
        self.thread = None
        
        # Watchlist for threat detection
        self.watchlist = ["person", "car", "truck", "motorbike", "knife", "gun", "vehicle", "intrusion"]
        
        # Initialize model (YOLO or fallback)
        self._initialize_model()
        
    def _initialize_model(self):
        """Initialize YOLO model or set up OpenCV fallback."""
        try:
            from ultralytics import YOLO
            self.model = YOLO("yolov8n.pt")
            logger.info("YOLO model loaded successfully")
        except ImportError:
            logger.warning("Ultralytics not available, using OpenCV motion detection fallback")
            self.model = "opencv_fallback"
        except Exception as e:
            logger.warning(f"YOLO model failed to load: {e}, using OpenCV fallback")
            self.model = "opencv_fallback"
    
    def _yolo_detect(self, frame) -> List[Dict[str, Any]]:
        """Run YOLO inference on frame."""
        try:
            results = self.model(frame, verbose=False)
            detections = []
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        # Get box coordinates and confidence
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        confidence = box.conf[0].cpu().numpy()
                        class_id = int(box.cls[0].cpu().numpy())
                        
                        # Get class name
                        class_name = self.model.names[class_id]
                        
                        # Only include watchlist items with confidence >= 0.5
                        if class_name in self.watchlist and confidence >= 0.5:
                            detection = {
                                "label": class_name,
                                "confidence": float(confidence),
                                "bbox": [float(x1), float(y1), float(x2), float(y2)],
                                "timestamp": time.time()
                            }
                            detections.append(detection)
            
            return detections
        except Exception as e:
            logger.error(f"YOLO detection error: {e}")
            return []
    
    def _opencv_detect(self, frame, prev_frame) -> List[Dict[str, Any]]:
        """OpenCV motion detection fallback."""
        try:
            if prev_frame is None:
                return []
            
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
            
            # Calculate frame difference
            diff = cv2.absdiff(gray, prev_gray)
            _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)
            
            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            detections = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 1000:  # Minimum area threshold
                    x, y, w, h = cv2.boundingRect(contour)
                    detection = {
                        "label": "intrusion",
                        "confidence": 0.7,  # Fixed confidence for motion detection
                        "bbox": [float(x), float(y), float(x + w), float(y + h)],
                        "timestamp": time.time()
                    }
                    detections.append(detection)
            
            return detections
        except Exception as e:
            logger.error(f"OpenCV detection error: {e}")
            return []
    
    def _inference_loop(self):
        """Main inference loop running in background thread."""
        try:
            self.cap = cv2.VideoCapture(self.video_path)
            if not self.cap.isOpened():
                logger.error(f"Could not open video: {self.video_path}")
                return
            
            prev_frame = None
            frame_count = 0
            
            while self.running:
                ret, frame = self.cap.read()
                if not ret:
                    # Loop video
                    self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    prev_frame = None
                    continue
                
                # Process at 1 FPS
                if frame_count % 30 == 0:  # Assuming 30 FPS video
                    if self.model == "opencv_fallback":
                        detections = self._opencv_detect(frame, prev_frame)
                    else:
                        detections = self._yolo_detect(frame)
                    
                    if detections:
                        self.detections = detections
                        logger.info(f"Detected {len(detections)} threats")
                
                prev_frame = frame.copy()
                frame_count += 1
                
                # Sleep to maintain 1 FPS processing
                time.sleep(1.0)
                
        except Exception as e:
            logger.error(f"Inference loop error: {e}")
        finally:
            if self.cap:
                self.cap.release()
    
    def start(self):
        """Start the inference loop."""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._inference_loop, daemon=True)
            self.thread.start()
            logger.info("Inference loop started")
    
    def stop(self):
        """Stop the inference loop."""
        self.running = False
        if self.thread:
            self.thread.join()
        logger.info("Inference loop stopped")
    
    def get_detections(self) -> List[Dict[str, Any]]:
        """Get latest detections."""
        return self.detections.copy()

# Global inference instance
inference_engine = VideoInference()
