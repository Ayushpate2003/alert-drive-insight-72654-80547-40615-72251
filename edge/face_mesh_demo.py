import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial import distance as dist

mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Initialize webcam
cap = cv2.VideoCapture(0)

# Mediapipe FaceMesh setup
with mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as face_mesh:

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert BGR → RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Draw face mesh
                mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                        .get_default_face_mesh_tesselation_style()
                )

                # Convert landmarks to pixel coordinates
                h, w, _ = frame.shape
                mesh_points = np.array(
                    [(int(p.x * w), int(p.y * h)) for p in face_landmarks.landmark]
                )

                # Eye indices (example: left eye upper/lower)
                LEFT_EYE_TOP = mesh_points[159]
                LEFT_EYE_BOTTOM = mesh_points[145]
                EAR = dist.euclidean(LEFT_EYE_TOP, LEFT_EYE_BOTTOM)

                # Display EAR (eye aspect ratio)
                cv2.putText(frame, f"EAR: {EAR:.2f}", (30, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

                # Yawn detection (mouth distance)
                top_lip = mesh_points[13]
                bottom_lip = mesh_points[14]
                MAR = dist.euclidean(top_lip, bottom_lip)
                cv2.putText(frame, f"MAR: {MAR:.2f}", (30, 80),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)

                # Fatigue heuristic
                fatigue_score = min(1.0, (MAR/40 + (1 - EAR/0.2)) / 2)
                cv2.putText(frame, f"Fatigue: {fatigue_score:.2f}", (30, 110),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        cv2.imshow("Driver Face Mapping", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
