from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import json
import asyncio
import base64
import time
from scipy.spatial import distance as dist

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MediaPipe FaceMesh setup
try:
    import mediapipe as mp
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    USE_MEDIAPIPE = True
    print("✅ Using MediaPipe FaceMesh detector")
except ImportError:
    print("⚠️ MediaPipe not available, using mock mode")
    USE_MEDIAPIPE = False

# FaceMesh landmark indices
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]
MOUTH_IDX = [61, 291, 0, 17, 57, 287]

class FaceMeshProcessor:
    def __init__(self):
        self.blink_history = []
        self.yawn_history = []
        self.last_blink_time = 0
        self.ear_threshold = 0.21
        self.lip_threshold = 18.0
        self.blink_min_interval = 0.15

    def calculate_ear(self, eye_points):
        """Calculate Eye Aspect Ratio"""
        # Using 6 points: (p2-p6 + p3-p5) / (2 * p1-p4)
        p1, p2, p3, p4, p5, p6 = eye_points
        return (dist.euclidean(p2, p6) + dist.euclidean(p3, p5)) / (2.0 * dist.euclidean(p1, p4) + 1e-6)

    def calculate_mar(self, mouth_points):
        """Calculate Mouth Aspect Ratio"""
        # Using 6 points: similar to EAR formula for mouth
        p1, p2, p3, p4, p5, p6 = mouth_points
        return (dist.euclidean(p2, p6) + dist.euclidean(p3, p5)) / (2.0 * dist.euclidean(p1, p4) + 1e-6)

    def process_frame(self, frame_data):
        """Process a frame and return face mesh data and metrics"""
        try:
            # Decode base64 image
            img_data = base64.b64decode(frame_data.split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                return {"error": "Invalid image data"}

            current_time = time.time()

            # Initialize response
            response = {
                "face_detected": False,
                "face_mesh_points": [],
                "head_pose": {"pitch": 0.0, "yaw": 0.0, "roll": 0.0},
                "blink_rate_per_min": 0.0,
                "yawns_last_5m": 0,
                "fatigue_score": 0.0,
                "ear": 0.0,
                "mar": 0.0
            }

            if USE_MEDIAPIPE:
                # Use MediaPipe for face detection
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = face_mesh.process(rgb_frame)

                if results.multi_face_landmarks:
                    face_landmarks = results.multi_face_landmarks[0]
                    response["face_detected"] = True

                    # Convert landmarks to pixel coordinates
                    h, w, _ = frame.shape
                    mesh_points = np.array(
                        [(int(p.x * w), int(p.y * h)) for p in face_landmarks.landmark]
                    )
                    response["face_mesh_points"] = mesh_points.tolist()

                    # Calculate EAR (Eye Aspect Ratio) - using eye landmarks
                    left_eye_points = mesh_points[LEFT_EYE_IDX]
                    left_ear = self.calculate_ear(left_eye_points)
                    response["ear"] = left_ear

                    # Calculate MAR (Mouth Aspect Ratio) - using mouth landmarks
                    mouth_points = mesh_points[MOUTH_IDX]
                    mar = self.calculate_mar(mouth_points)
                    response["mar"] = mar

                    # Blink detection
                    if left_ear < self.ear_threshold and (current_time - self.last_blink_time) > self.blink_min_interval:
                        self.blink_history.append(current_time)
                        self.last_blink_time = current_time

                    # Yawn detection
                    if mar > self.lip_threshold:
                        self.yawn_history.append(current_time)

                    # Clean up old data (keep last 5 minutes)
                    cutoff_time = current_time - 300  # 5 minutes
                    self.blink_history = [t for t in self.blink_history if t > cutoff_time]
                    self.yawn_history = [t for t in self.yawn_history if t > cutoff_time]

                    # Calculate rates
                    blink_rate = len(self.blink_history) / 5.0  # per minute (5 minutes window)
                    yawns_count = len(self.yawn_history)

                    response["blink_rate_per_min"] = blink_rate
                    response["yawns_last_5m"] = yawns_count

                    # Calculate fatigue score
                    fatigue_score = min(1.0, (blink_rate / 40.0) * 0.6 + (yawns_count / 6.0) * 0.35 + (mar / 50.0) * 0.05)
                    response["fatigue_score"] = fatigue_score
            else:
                # Mock mode - generate random data
                response["face_detected"] = np.random.choice([True, False], p=[0.8, 0.2])
                if response["face_detected"]:
                    # Generate mock face mesh points
                    h, w = frame.shape[:2]
                    mock_points = [[np.random.randint(0, w), np.random.randint(0, h)] for _ in range(468)]
                    response["face_mesh_points"] = mock_points

                    ear = np.random.uniform(0.2, 0.4)
                    mar = np.random.uniform(10, 30)

                    response["ear"] = ear
                    response["mar"] = mar

                    # Mock blink and yawn detection
                    if np.random.random() < 0.1:  # 10% chance of blink
                        self.blink_history.append(current_time)
                    if np.random.random() < 0.05:  # 5% chance of yawn
                        self.yawn_history.append(current_time)

                    # Clean up old data
                    cutoff_time = current_time - 300
                    self.blink_history = [t for t in self.blink_history if t > cutoff_time]
                    self.yawn_history = [t for t in self.yawn_history if t > cutoff_time]

                    blink_rate = len(self.blink_history) / 5.0
                    yawns_count = len(self.yawn_history)

                    response["blink_rate_per_min"] = blink_rate
                    response["yawns_last_5m"] = yawns_count
                    response["fatigue_score"] = min(1.0, (blink_rate / 40.0) * 0.6 + (yawns_count / 6.0) * 0.35)

            return response

        except Exception as e:
            return {"error": str(e)}

# Global processor instance
processor = FaceMeshProcessor()

@app.websocket("/ws/face-mesh")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    try:
        while True:
            try:
                # Receive frame data from client
                data = await websocket.receive_text()
                frame_data = json.loads(data)

                # Process the frame
                result = processor.process_frame(frame_data["image"])

                # Send back the processed data
                await websocket.send_text(json.dumps(result, default=str))
            except json.JSONDecodeError:
                print("Invalid JSON received")
                continue
            except Exception as e:
                print(f"Processing error: {e}")
                continue
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.get("/")
async def root():
    return {"message": "FaceMesh Processing Server", "status": "running", "mode": "mediapipe" if USE_MEDIAPIPE else "mock"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
