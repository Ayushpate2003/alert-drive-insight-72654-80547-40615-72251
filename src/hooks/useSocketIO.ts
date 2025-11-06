import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Options {
  url?: string;
  orgId?: string;
}

export const useSocketIO = (options?: Options) => {
  const url = options?.url || 'http://localhost:3001';
  const orgId = options?.orgId || 'org_123';
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const s = io(url, { transports: ['websocket'] });
    socketRef.current = s;

    s.on('connect', () => {
      setConnected(true);
      s.emit('join-fleet', orgId);
    });

    s.on('disconnect', () => setConnected(false));
    s.on('alert', (evt: any) => setLastEvent(evt));

    return () => {
      s.removeAllListeners();
      s.disconnect();
    };
  }, [url, orgId]);

  const emit = (event: string, payload?: any) => {
    socketRef.current?.emit(event, payload);
  };

  return { connected, lastEvent, emit };
};
