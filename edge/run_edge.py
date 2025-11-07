import argparse
import time
from typing import Optional

import cv2

from alert_streamer import AlertStreamer
from driver_monitor import DriverMonitor, DriverMonitorConfig
from dashcam_analyzer import detect_and_track
from fusion_engine import fuse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--server', default='http://localhost:3001')
    parser.add_argument('--org', default='org_123')
    parser.add_argument('--driver-cam', type=int, default=0)
    parser.add_argument('--road-cam', type=int, default=1)
    parser.add_argument('--fps', type=float, default=5.0)
    parser.add_argument('--vehicle-id', default='VH-LOCAL')
    parser.add_argument('--driver-id', default='DRV-LOCAL')
    args = parser.parse_args()

    streamer = AlertStreamer(args.server, args.org)
    streamer.connect()

    mon = DriverMonitor(DriverMonitorConfig())

    cap_driver = cv2.VideoCapture(args.driver_cam)
    cap_road = cv2.VideoCapture(args.road_cam)

    if not cap_driver.isOpened():
        raise RuntimeError(f'Cannot open driver camera index {args.driver_cam}')
    if not cap_road.isOpened():
        print(f'[WARN] Cannot open road camera index {args.road_cam}, falling back to driver cam frames for road metrics')
        cap_road = None

    period = 1.0 / max(0.1, args.fps)
    try:
        while True:
            t0 = time.time()
            ok_d, frame_d = cap_driver.read()
            if not ok_d:
                break
            m_driver = mon.process_frame(frame_d)

            road_metrics = {}
            if cap_road is not None:
                ok_r, frame_r = cap_road.read()
                if ok_r:
                    road_metrics = detect_and_track(frame_r) or {}
            else:
                road_metrics = {}

            fused = fuse(
                driver={
                    'fatigue_score': m_driver.get('fatigue_score', 0.0),
                    'blink_rate_per_min': m_driver.get('blink_rate_per_min', 0.0),
                    'yawns_last_5m': m_driver.get('yawns_last_5m', 0),
                },
                road=road_metrics,
            )

            payload = {
                'orgId': args.org,
                'vehicleId': args.vehicle_id,
                'driverId': args.driver_id,
                **fused,
            }
            streamer.emit_event(payload)

            dt = time.time() - t0
            sleep_for = max(0.0, period - dt)
            time.sleep(sleep_for)
    finally:
        try:
            streamer.disconnect()
        except Exception:
            pass
        cap_driver.release()
        if cap_road is not None:
            cap_road.release()


if __name__ == '__main__':
    main()
