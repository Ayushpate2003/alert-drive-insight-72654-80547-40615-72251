import time
import socketio
from typing import Any, Dict

class AlertStreamer:
    def __init__(self, server_url: str, org_id: str):
        self.server_url = server_url
        self.org_id = org_id
        self.sio = socketio.Client()

    def connect(self):
        if not self.sio.connected:
            self.sio.connect(self.server_url)

    def disconnect(self):
        if self.sio.connected:
            self.sio.disconnect()

    def emit_event(self, payload: Dict[str, Any]):
        payload.setdefault('orgId', self.org_id)
        payload.setdefault('t0_edge', time.time())
        self.sio.emit('driver-alert', payload)
