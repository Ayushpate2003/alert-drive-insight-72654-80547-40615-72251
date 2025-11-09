from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
# import mediapipe as mp  # Temporarily disabled for testing
import numpy as np
from scipy.spatial import distance as dist
from scipy.spatial import ConvexHull
import json
import asyncio
import base64
import time
from collections import deque

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MediaPipe setup (temporarily disabled)
# mp_face_mesh = mp.solutions.face_mesh
# mp_drawing = mp.solutions.drawing_utils
# mp_drawing_styles = mp.solutions.drawing_styles

# FaceMesh landmark indices
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]
UPPER_LIP_IDX = 13
LOWER_LIP_IDX = 14

# Face mask landmark indices (comprehensive facial region)
FACE_MASK_IDX = [
    # Jawline
    152, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454, 356, 389, 251, 284, 332, 297, 338, 10, 109,
    # Left eyebrow
    70, 63, 105, 66, 107,
    # Right eyebrow
    336, 296, 334, 293, 300,
    # Nose
    1, 2, 98, 327, 168,
    # Left eye
    33, 160, 158, 133, 153, 144,
    # Right eye
    362, 385, 387, 263, 373, 380,
    # Mouth
    61, 291, 0, 17, 57, 287, 61, 291
]

class FaceMeshProcessor:
    def __init__(self):
        # Temporarily disable MediaPipe for testing
        # self.face_mesh = mp_face_mesh.FaceMesh(
        #     static_image_mode=False,
        #     max_num_faces=1,
        #     refine_landmarks=True,
        #     min_detection_confidence=0.7,  # Increased for better accuracy
        #     min_tracking_confidence=0.7,   # Increased for better tracking
        #     model_selection=0  # Use the more accurate model (slower but better)
        # )
        self.blink_history = []
        self.yawn_history = []
        self.last_blink_time = 0
        self.ear_threshold = 0.21
        self.lip_threshold = 18.0
        self.blink_min_interval = 0.15

        # For temporal smoothing
        self.mask_history = deque(maxlen=5)  # Keep last 5 frames for smoothing
        self.pose_history = deque(maxlen=5)  # Keep last 5 pose estimates

    def calculate_ear(self, eye_points):
        """Calculate Eye Aspect Ratio"""
        # Using 6 points: (p2-p6 + p3-p5) / (2 * p1-p4)
        p1, p2, p3, p4, p5, p6 = eye_points
        return (dist.euclidean(p2, p6) + dist.euclidean(p3, p5)) / (2.0 * dist.euclidean(p1, p4) + 1e-6)

    def calculate_face_pose(self, landmarks):
        """Calculate face orientation (yaw, pitch, roll)"""
        # Use nose bridge and eye positions for pose estimation
        nose_bridge = landmarks[168]  # Nose bridge point
        left_eye = landmarks[33]      # Left eye inner corner
        right_eye = landmarks[362]    # Right eye inner corner

        # Calculate yaw (left-right rotation)
        eye_center_x = (left_eye[0] + right_eye[0]) / 2
        yaw = (nose_bridge[0] - eye_center_x) / (right_eye[0] - left_eye[0] + 1e-6)

        # Calculate pitch (up-down rotation)
        eye_center_y = (left_eye[1] + right_eye[1]) / 2
        pitch = (nose_bridge[1] - eye_center_y) / (abs(right_eye[0] - left_eye[0]) + 1e-6)

        # Calculate roll (tilt)
        eye_distance = dist.euclidean(left_eye, right_eye)
        roll = np.arctan2(right_eye[1] - left_eye[1], right_eye[0] - left_eye[0])

        return {
            'yaw': float(yaw),
            'pitch': float(pitch),
            'roll': float(np.degrees(roll))
        }

    def generate_face_mask(self, landmarks):
        """Generate face mask using convex hull of facial landmarks"""
        # Extract face mask points
        mask_points = []
        for idx in FACE_MASK_IDX:
            if idx < len(landmarks):
                mask_points.append(landmarks[idx])

        if len(mask_points) < 3:
            return []

        # Calculate convex hull
        points_array = np.array(mask_points)
        hull = ConvexHull(points_array)
        hull_points = points_array[hull.vertices]

        return hull_points.tolist()

    def apply_pose_transformation(self, mask_points, pose):
        """Apply pose-based scaling and rotation to mask points"""
        if not mask_points or not pose:
            return mask_points

        # Convert to numpy array for easier manipulation
        points = np.array(mask_points)

        # Calculate center of mask
        center = np.mean(points, axis=0)

        # Apply rotation based on roll
        roll_rad = np.radians(pose.get('roll', 0))
        rotation_matrix = np.array([
            [np.cos(roll_rad), -np.sin(roll_rad)],
            [np.sin(roll_rad), np.cos(roll_rad)]
        ])

        # Translate to origin, rotate, translate back
        translated_points = points - center
        rotated_points = np.dot(translated_points, rotation_matrix.T)
        final_points = rotated_points + center

        # Apply scaling based on yaw (face turning left/right affects perceived width)
        yaw_scale = 1.0 + abs(pose.get('yaw', 0)) * 0.1  # Slight width adjustment
        pitch_scale = 1.0 + abs(pose.get('pitch', 0)) * 0.05  # Slight height adjustment

        # Scale from center
        scaled_points = center + (final_points - center) * np.array([yaw_scale, pitch_scale])

        return scaled_points.tolist()

    def smooth_mask(self, current_mask):
        """Apply temporal smoothing to mask points"""
        if not current_mask:
            return current_mask

        self.mask_history.append(current_mask)

        if len(self.mask_history) < 2:
            return current_mask

        # Average the last few masks
        smoothed_mask = []
        num_points = len(current_mask)

        for i in range(num_points):
            avg_x = sum(mask[i][0] for mask in self.mask_history) / len(self.mask_history)
            avg_y = sum(mask[i][1] for mask in self.mask_history) / len(self.mask_history)
            smoothed_mask.append([avg_x, avg_y])

        return smoothed_mask

    def smooth_pose(self, current_pose):
        """Apply temporal smoothing to pose estimates"""
        if not current_pose:
            return current_pose

        self.pose_history.append(current_pose)

        if len(self.pose_history) < 2:
            return current_pose

        # Average the pose values
        smoothed_pose = {}
        for key in current_pose.keys():
            smoothed_pose[key] = sum(pose[key] for pose in self.pose_history) / len(self.pose_history)

        return smoothed_pose

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
            # Temporarily use mock results instead of MediaPipe
            # results = self.face_mesh.process(rgb)
            results = None  # Mock for now

            current_time = time.time()

            # Initialize response
            response = {
                "face_detected": False,
                "face_mesh_points": [],
                "head_pose": {"pitch": 0.0, "yaw": 0.0, "roll": 0.0},
                "face_mask_points": [],
                "blink_rate_per_min": 0.0,
                "yawns_last_5m": 0,
                "fatigue_score": 0.0,
                "ear": 0.0,
                "mar": 0.0
            }

            # Mock face detection for testing
            h, w, _ = frame.shape
            response["face_detected"] = True

            # Generate mock face mesh points
            mesh_points = []
            landmark_dict = {}

            # Create realistic face landmark positions
            center_x, center_y = w // 2, h // 2
            face_width, face_height = w // 3, h // 2

            for idx in range(468):  # MediaPipe has 468 landmarks
                # Create a rough face shape with some variation
                if idx < 100:  # Jawline
                    angle = (idx / 100) * 2 * np.pi
                    x = center_x + face_width * 0.4 * np.cos(angle)
                    y = center_y + face_height * 0.3 + face_height * 0.2 * np.sin(angle)
                elif idx < 200:  # Eyes and eyebrows
                    eye_x = center_x + (face_width * 0.2 if idx % 2 == 0 else -face_width * 0.2)
                    eye_y = center_y - face_height * 0.1
                    x = eye_x + np.random.normal(0, face_width * 0.05)
                    y = eye_y + np.random.normal(0, face_height * 0.05)
                elif idx < 300:  # Nose
                    x = center_x + np.random.normal(0, face_width * 0.1)
                    y = center_y + np.random.normal(0, face_height * 0.1)
                else:  # Mouth and rest
                    x = center_x + np.random.normal(0, face_width * 0.15)
                    y = center_y + face_height * 0.15 + np.random.normal(0, face_height * 0.05)

                x, y = max(0, min(w-1, int(x))), max(0, min(h-1, int(y)))
                mesh_points.append([x, y])
                landmark_dict[idx] = (x, y)

            response["face_mesh_points"] = mesh_points

            # Calculate face pose
            face_pose = self.calculate_face_pose(landmark_dict)
            smoothed_pose = self.smooth_pose(face_pose)
            response["head_pose"] = smoothed_pose

            # Generate face mask
            face_mask = self.generate_face_mask(landmark_dict)
            pose_transformed_mask = self.apply_pose_transformation(face_mask, smoothed_pose)
            smoothed_mask = self.smooth_mask(pose_transformed_mask)
            response["face_mask_points"] = smoothed_mask

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
