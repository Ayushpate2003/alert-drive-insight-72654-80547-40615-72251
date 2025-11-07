from dataclasses import dataclass
from typing import Dict, Any
import time

@dataclass
class FusionConfig:
    fatigue_crit: float = 0.7
    safe_distance_m: float = 10.0
    speed_diff_kmh: float = 8.0


def fuse(driver: Dict[str, Any], road: Dict[str, Any], cfg: FusionConfig = FusionConfig()) -> Dict[str, Any]:
    fatigue = float(driver.get('fatigue_score', 0.0))
    distance = road.get('distance_m')
    rel_speed = road.get('relative_speed_kmh')

    unsafe_following = False
    if distance is not None and rel_speed is not None:
        unsafe_following = (rel_speed > cfg.speed_diff_kmh) and (distance < cfg.safe_distance_m)

    if fatigue > cfg.fatigue_crit and unsafe_following:
        evt_type = 'CRITICAL_RISK'
        severity = 'CRITICAL'
    elif fatigue > 0.6 or unsafe_following:
        evt_type = 'WARNING_BEHAVIOR'
        severity = 'WARNING'
    else:
        evt_type = 'INFO_EVENT'
        severity = 'INFO'

    metrics = {
        'fatigue_score': round(fatigue, 2),
        'blink_rate_per_min': int(driver.get('blink_rate_per_min', 0)),
        'yawns_last_5m': int(driver.get('yawns_last_5m', 0)),
    }
    if distance is not None:
        metrics['distance_m'] = round(float(distance), 2)
    if rel_speed is not None:
        metrics['relative_speed_kmh'] = round(float(rel_speed), 2)

    return {
        'type': evt_type,
        'severity': severity,
        'metrics': metrics,
        'context': {
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'road_type': 'UNKNOWN',
        }
    }
