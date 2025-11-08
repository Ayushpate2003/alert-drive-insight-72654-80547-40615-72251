from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial import distance as dist
import json
import asyncio
import base64
import time

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MediaPipe setup
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# FaceMesh landmark indices
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]
UPPER_LIP_IDX = 13
LOWER_LIP_IDX = 14

class FaceMeshProcessor:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
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

    def process_frame(self, frame_data):
        """Process a frame and return face mesh data and metrics"""
        try:
            # Decode base64 image
            img_data = base64.b64decode(frame_data.split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                return {"error": "Invalid image data"}

            # Convert BGR to RGB
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb)

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

            if results.multi_face_landmarks:
                face_landmarks = results.multi_face_landmarks[0]
                response["face_detected"] = True

                h, w, _ = frame.shape

                # Convert landmarks to pixel coordinates
                mesh_points = []
                landmark_dict = {}

                for idx, landmark in enumerate(face_landmarks.landmark):
                    x, y = int(landmark.x * w), int(landmark.y * h)
                    mesh_points.append([x, y])
                    landmark_dict[idx] = (landmark.x * w, landmark.y * h)

                response["face_mesh_points"] = mesh_points

                # Calculate EAR for both eyes
                if all(idx in landmark_dict for idx in LEFT_EYE_IDX) and all(idx in landmark_dict for idx in RIGHT_EYE_IDX):
                    left_eye_points = [landmark_dict[idx] for idx in LEFT_EYE_IDX]
                    right_eye_points = [landmark_dict[idx] for idx in RIGHT_EYE_IDX]

                    ear_left = self.calculate_ear(left_eye_points)
                    ear_right = self.calculate_ear(right_eye_points)
                    ear = (ear_left + ear_right) / 2.0
                    response["ear"] = ear

                    # Blink detection
                    if ear < self.ear_threshold and (current_time - self.last_blink_time) > self.blink_min_interval:
                        self.blink_history.append(current_time)
                        self.last_blink_time = current_time

                # Calculate MAR (Mouth Aspect Ratio)
                if UPPER_LIP_IDX in landmark_dict and LOWER_LIP_IDX in landmark_dict:
                    upper_lip = landmark_dict[UPPER_LIP_IDX]
                    lower_lip = landmark_dict[LOWER_LIP_IDX]
                    mar = dist.euclidean(upper_lip, lower_lip)
                    response["mar"] = mar

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

            return response

        except Exception as e:
            return {"error": str(e)}

# Global processor instance
processor = FaceMeshProcessor()

@app.websocket("/ws/face-mesh")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive frame data from client
            data = await websocket.receive_text()
            frame_data = json.loads(data)

            # Process the frame
            result = processor.process_frame(frame_data["image"])

            # Send back the processed data
            await websocket.send_text(json.dumps(result))

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.send_text(json.dumps({"error": str(e)}))

@app.get("/")
async def root():
    return {"message": "FaceMesh Processing Server", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
