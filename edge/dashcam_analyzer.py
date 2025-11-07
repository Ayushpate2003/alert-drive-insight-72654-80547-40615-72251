from dataclasses import dataclass
from typing import Dict, Optional, Tuple
import numpy as np
import cv2

try:
    from ultralytics import YOLO
except Exception:  # pragma: no cover
    YOLO = None


@dataclass
class CameraParams:
    focal_px: float = 1000.0  # approximate focal length in pixels
    vehicle_real_height_m: float = 1.5  # assumed average height of car
    fps: float = 10.0


class DashcamAnalyzer:
    def __init__(self, model_path: str = 'yolov8n.pt', params: CameraParams = CameraParams()):
        self.params = params
        self.model = YOLO(model_path) if YOLO else None
        self.prev_gray: Optional[np.ndarray] = None
        self.prev_roi_gray: Optional[np.ndarray] = None
        self.prev_roi_box: Optional[Tuple[int, int, int, int]] = None

    def _estimate_distance(self, box: Tuple[int, int, int, int]) -> Optional[float]:
        x1, y1, x2, y2 = box
        h_px = max(1, y2 - y1)
        # Pinhole: Z = f * H / h
        Z = (self.params.focal_px * self.params.vehicle_real_height_m) / float(h_px)
        return float(Z)

    def _relative_speed(self, gray: np.ndarray, box: Tuple[int, int, int, int]) -> Optional[float]:
        if self.prev_roi_gray is None or self.prev_roi_box is None:
            return 0.0
        x1, y1, x2, y2 = box
        x1p, y1p, x2p, y2p = self.prev_roi_box
        # Intersect ROIs to compute optical flow on overlapping area only
        ix1, iy1 = max(x1, x1p), max(y1, y1p)
        ix2, iy2 = min(x2, x2p), min(y2, y2p)
        if ix2 <= ix1 or iy2 <= iy1:
            return 0.0
        roi_curr = gray[iy1:iy2, ix1:ix2]
        roi_prev = self.prev_gray[iy1:iy2, ix1:ix2]
        if roi_curr.size == 0 or roi_prev.size == 0:
            return 0.0
        flow = cv2.calcOpticalFlowFarneback(roi_prev, roi_curr, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        # Forward motion implies vertical flow; use median of dy
        dy = np.median(flow[..., 1]) if flow is not None else 0.0
        # Convert pixel/frame to m/s via scale: distance change proportional to bbox height change; here approximate
        # Use a small scale factor; this is heuristic without calibration
        meters_per_px = self._estimate_distance(box) / max(1, (box[3] - box[1]))
        v_m_per_s = (-dy * meters_per_px) * self.params.fps
        return float(max(-50.0, min(50.0, v_m_per_s * 3.6)))  # clamp and convert to km/h

    def detect_and_track(self, frame) -> Dict[str, float]:
        h, w = frame.shape[:2]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        out = {"distance_m": None, "relative_speed_kmh": None}

        # Run detection if model is available
        target_box = None
        if self.model:
            res = self.model.predict(frame, imgsz=640, conf=0.25, verbose=False)
            # Choose the nearest vehicle-like class (car=2, truck=7, bus=5 in COCO)
            cand_classes = {2, 5, 7}
            best_score = -1.0
            for r in res:
                boxes = r.boxes
                for b in boxes:
                    cls = int(b.cls[0].item())
                    if cls not in cand_classes:
                        continue
                    x1, y1, x2, y2 = map(int, b.xyxy[0].tolist())
                    score = float(b.conf[0].item())
                    # Prefer largest bbox (likely closest)
                    area = (x2 - x1) * (y2 - y1)
                    if area * score > best_score:
                        best_score = area * score
                        target_box = (x1, y1, x2, y2)

        if target_box is not None:
            dist = self._estimate_distance(target_box)
            out["distance_m"] = dist
            out["relative_speed_kmh"] = self._relative_speed(gray, target_box)
            # update prev
            self.prev_roi_box = target_box
        else:
            self.prev_roi_box = None
            out["distance_m"] = None
            out["relative_speed_kmh"] = 0.0

        self.prev_gray = gray
        return out


# Backward-compatible function
_singleton: Optional[DashcamAnalyzer] = None


def detect_and_track(frame):
    global _singleton
    if _singleton is None:
        _singleton = DashcamAnalyzer()
    return _singleton.detect_and_track(frame)
