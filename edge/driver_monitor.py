from collections import deque
from dataclasses import dataclass
from typing import Deque, Dict, Tuple
import math
import time

import cv2

try:
    import mediapipe as mp
except Exception:  # pragma: no cover
    mp = None


# MediaPipe FaceMesh landmark indices for eyes and mouth
# Left eye: [33, 160, 158, 133, 153, 144]
# Right eye: [362, 385, 387, 263, 373, 380]
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]
UPPER_LIP_IDX = 13
LOWER_LIP_IDX = 14


@dataclass
class DriverMonitorConfig:
    ear_thresh: float = 0.21
    lip_thresh_px: float = 18.0
    blink_min_interval: float = 0.15  # seconds between blinks
    rate_window_sec: int = 60 * 5


def _euclid(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def _ear(pts: Dict[int, Tuple[float, float]], idx: list[int]) -> float:
    # Using 6 points: (p2-p6 + p3-p5) / (2 * p1-p4)
    p1, p2, p3, p4, p5, p6 = [pts[i] for i in idx]
    return (_euclid(p2, p6) + _euclid(p3, p5)) / (2.0 * _euclid(p1, p4) + 1e-6)


class DriverMonitor:
    def __init__(self, cfg: DriverMonitorConfig | None = None):
        self.cfg = cfg or DriverMonitorConfig()
        self._blinks: Deque[float] = deque()
        self._yawns: Deque[float] = deque()
        self._last_blink_ts: float = 0.0
        self._mp = mp
        if self._mp:
            self._face_mesh = self._mp.solutions.face_mesh.FaceMesh(
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5,
            )
        else:
            self._face_mesh = None

    def _update_rates(self, now: float):
        window = self.cfg.rate_window_sec
        while self._blinks and now - self._blinks[0] > window:
            self._blinks.popleft()
        while self._yawns and now - self._yawns[0] > window:
            self._yawns.popleft()

    def process_frame(self, frame) -> Dict[str, float]:
        now = time.time()
        h, w = frame.shape[:2]
        metrics = {
            'blink_rate_per_min': 0.0,
            'yawns_last_5m': 0,
            'fatigue_score': 0.0,
            'head_stability': 1.0,
        }

        if not self._face_mesh:
            self._update_rates(now)
            # Return only rates accumulated externally (none by default)
            metrics['blink_rate_per_min'] = len(self._blinks) / (self.cfg.rate_window_sec / 60.0)
            metrics['yawns_last_5m'] = len(self._yawns)
            metrics['fatigue_score'] = min(1.0, (metrics['blink_rate_per_min'] / 40.0) * 0.5 + (metrics['yawns_last_5m'] / 6.0) * 0.5)
            return metrics

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = self._face_mesh.process(rgb)
        if not res.multi_face_landmarks:
            self._update_rates(now)
            metrics['blink_rate_per_min'] = len(self._blinks) / (self.cfg.rate_window_sec / 60.0)
            metrics['yawns_last_5m'] = len(self._yawns)
            metrics['fatigue_score'] = min(1.0, (metrics['blink_rate_per_min'] / 40.0) * 0.5 + (metrics['yawns_last_5m'] / 6.0) * 0.5)
            return metrics

        lm = res.multi_face_landmarks[0]
        pts = {i: (lm.landmark[i].x * w, lm.landmark[i].y * h) for i in range(len(lm.landmark))}

        ear_left = _ear(pts, LEFT_EYE_IDX)
        ear_right = _ear(pts, RIGHT_EYE_IDX)
        ear = (ear_left + ear_right) / 2.0

        upper = pts[UPPER_LIP_IDX]
        lower = pts[LOWER_LIP_IDX]
        lip_dist = _euclid(upper, lower)

        # Blink detection with refractory period
        if ear < self.cfg.ear_thresh and (now - self._last_blink_ts) > self.cfg.blink_min_interval:
            self._blinks.append(now)
            self._last_blink_ts = now

        # Yawn detection
        if lip_dist > self.cfg.lip_thresh_px:
            self._yawns.append(now)

        self._update_rates(now)

        blink_rate = len(self._blinks) / (self.cfg.rate_window_sec / 60.0)
        yawns_5m = len(self._yawns)
        head_stability = 1.0  # Placeholder; add pose variation estimate if needed

        fatigue = min(1.0, max(0.0, 0.6 * (blink_rate / 40.0) + 0.35 * (yawns_5m / 6.0) + 0.05 * (1.0 - head_stability)))

        metrics['blink_rate_per_min'] = float(blink_rate)
        metrics['yawns_last_5m'] = int(yawns_5m)
        metrics['fatigue_score'] = float(fatigue)
        metrics['head_stability'] = float(head_stability)
        return metrics


def run_camera_loop(streamer, camera_index: int = 0):
    cap = cv2.VideoCapture(camera_index)
    mon = DriverMonitor()
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open driver camera index {camera_index}")
    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            m = mon.process_frame(frame)
            payload = {
                'driverId': 'DRV-LOCAL',
                'vehicleId': 'VH-LOCAL',
                'type': 'DRIVER_STATE',
                'severity': 'INFO',
                'metrics': {
                    'blink_rate_per_min': m['blink_rate_per_min'],
                    'yawns_last_5m': m['yawns_last_5m'],
                    'fatigue_score': m['fatigue_score'],
                },
                'context': {
                    'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                }
            }
            streamer.emit_event(payload)
            # throttle
            time.sleep(1.0)
    finally:
        cap.release()
