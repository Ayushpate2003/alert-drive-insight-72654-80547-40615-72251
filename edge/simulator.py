import json
import random
import time
import socketio
import uuid
from datetime import datetime, timezone

SERVER_URL = 'http://localhost:3001'
ORG_ID = 'org_123'
VEHICLE_ID = 'VH-0082'
DRIVER_ID = 'DRV-4521'

sio = socketio.Client()

@sio.event
def connect():
    print('Simulator connected to server')
    # Socket.IO rooms are joined from server on event; we send orgId inside payload

@sio.event
def disconnect():
    print('Simulator disconnected')


def make_event():
    fatigue = max(0.0, min(1.0, random.gauss(0.5, 0.2)))
    yawns_5m = max(0, int(random.gauss(1 + 4*fatigue, 1)))
    blink_rate = int(12 + 20*fatigue + random.randint(-3, 3))
    distance = max(3.0, random.gauss(12.0 - 6*fatigue, 4.0))
    rel_speed = max(0.0, random.gauss(10.0*fatigue, 5.0))

    critical = fatigue > 0.7 and distance < 10 and rel_speed > 8
    evt_type = 'CRITICAL_RISK' if critical else 'WARNING_FATIGUE' if fatigue > 0.6 else 'INFO_EVENT'
    severity = 'CRITICAL' if critical else 'WARNING' if fatigue > 0.6 else 'INFO'

    payload = {
        "eventId": str(uuid.uuid4()),
        "orgId": ORG_ID,
        "vehicleId": VEHICLE_ID,
        "driverId": DRIVER_ID,
        "type": evt_type,
        "severity": severity,
        "metrics": {
            "distance_m": round(distance, 2),
            "relative_speed_kmh": round(rel_speed, 2),
            "fatigue_score": round(fatigue, 2),
            "blink_rate_per_min": blink_rate,
            "yawns_last_5m": yawns_5m,
        },
        "context": {
            "gps": {"lat": 19.076, "lng": 72.8777},
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "road_type": "HIGHWAY",
        },
        "t0_edge": time.time(),
    }
    return payload


def main():
    sio.connect(SERVER_URL)
    try:
        while True:
            evt = make_event()
            sio.emit('driver-alert', evt)
            print('Emitted:', json.dumps(evt))
            time.sleep(2)
    except KeyboardInterrupt:
        pass
    finally:
        sio.disconnect()


if __name__ == '__main__':
    main()
