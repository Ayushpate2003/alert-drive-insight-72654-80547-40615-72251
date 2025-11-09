import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import WebSocket from 'ws';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

// Import our modules
import pool from './db.js';
import authRoutes from './routes/auth.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});

// WebSocket server for face mesh processing
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;

  if (pathname === '/ws/face-mesh') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// FaceMesh Processor Class (from face_mesh_server.js)
class FaceMeshProcessor {
  constructor() {
    this.blinkHistory = [];
    this.yawnHistory = [];
    this.lastBlinkTime = 0;
    this.earThreshold = 0.21;
    this.lipThreshold = 18.0;
    this.blinkMinInterval = 0.15;
  }

  calculateEAR(eyePoints) {
    const [p1, p2, p3, p4, p5, p6] = eyePoints;
    const dist = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    return (dist(p2, p6) + dist(p3, p5)) / (2.0 * dist(p1, p4) + 1e-6);
  }

  calculateMAR(mouthPoints) {
    const [p1, p2, p3, p4, p5, p6] = mouthPoints;
    const dist = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    return (dist(p2, p6) + dist(p3, p5)) / (2.0 * dist(p1, p4) + 1e-6);
  }

  async processFrame(frameData) {
    try {
      const base64Data = frameData.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const metadata = await sharp(imageBuffer).metadata();
      const { width, height } = metadata;
      const currentTime = Date.now() / 1000;

      const response = {
        face_detected: false,
        face_mesh_points: [],
        head_pose: { pitch: 0.0, yaw: 0.0, roll: 0.0 },
        blink_rate_per_min: 0.0,
        yawns_last_5m: 0,
        fatigue_score: 0.0,
        ear: 0.0,
        mar: 0.0
      };

      response.face_detected = Math.random() > 0.2;

      if (response.face_detected) {
        const mockPoints = [];
        for (let i = 0; i < 468; i++) {
          mockPoints.push([
            Math.floor(Math.random() * width),
            Math.floor(Math.random() * height)
          ]);
        }
        response.face_mesh_points = mockPoints;

        const ear = 0.2 + Math.random() * 0.2;
        const mar = 10 + Math.random() * 20;

        response.ear = ear;
        response.mar = mar;

        if (ear < this.earThreshold && (currentTime - this.lastBlinkTime) > this.blinkMinInterval) {
          this.blinkHistory.push(currentTime);
          this.lastBlinkTime = currentTime;
        }

        if (mar > this.lipThreshold && Math.random() < 0.1) {
          this.yawnHistory.push(currentTime);
        }

        const cutoffTime = currentTime - 300;
        this.blinkHistory = this.blinkHistory.filter(t => t > cutoffTime);
        this.yawnHistory = this.yawnHistory.filter(t => t > cutoffTime);

        const blinkRate = this.blinkHistory.length / 5.0;
        const yawnsCount = this.yawnHistory.length;

        response.blink_rate_per_min = blinkRate;
        response.yawns_last_5m = yawnsCount;

        response.fatigue_score = Math.min(1.0,
          (blinkRate / 40.0) * 0.6 +
          (yawnsCount / 6.0) * 0.35 +
          (mar / 50.0) * 0.05
        );
      }

      return response;
    } catch (error) {
      console.error('Error processing frame:', error);
      return { error: error.message };
    }
  }
}

const processor = new FaceMeshProcessor();

// Socket.IO for fleet alerts
io.on('connection', (socket) => {
  socket.on('join-fleet', (orgId) => {
    if (orgId) socket.join(`fleet:${orgId}`);
  });

  socket.on('driver-alert', (evt) => {
    const eventId = evt?.eventId || randomUUID();
    const payload = { ...evt, eventId, t1_server: Date.now() / 1000 };
    if (evt?.orgId) io.to(`fleet:${evt.orgId}`).emit('alert', payload);
    io.emit('alert', payload);
  });
});

// WebSocket for face mesh
wss.on('connection', (ws) => {
  console.log('Client connected to face mesh WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const result = await processor.processFrame(data.image);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(result));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: 'Failed to process frame' }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from face mesh WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Face mesh status
app.get('/', (req, res) => {
  res.json({
    message: "Alert Drive Insight Backend Server",
    status: "running",
    websocket_endpoints: ["/socket.io", "/ws/face-mesh"],
    api_base: "/api"
  });
});

// Emit alert endpoint (for testing)
app.post('/emit', (req, res) => {
  const evt = req.body || {};
  const eventId = evt?.eventId || randomUUID();
  const payload = { ...evt, eventId, t1_server: Date.now() / 1000 };
  if (evt?.orgId) io.to(`fleet:${evt.orgId}`).emit('alert', payload);
  io.emit('alert', payload);
  res.json({ ok: true, eventId });
});

// Protected routes example
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
  console.log(`Socket.IO endpoint: ws://localhost:${PORT}/socket.io`);
  console.log(`Face mesh WebSocket: ws://localhost:${PORT}/ws/face-mesh`);
  console.log(`API base: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await pool.end();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await pool.end();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
