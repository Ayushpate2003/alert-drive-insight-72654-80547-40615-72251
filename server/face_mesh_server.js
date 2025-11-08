const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuration
const PORT = process.env.PORT || 8000;
const USE_MEDIAPIPE = false; // JavaScript doesn't have MediaPipe, using mock mode

// FaceMesh landmark indices (same as Python version)
const LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380];
const MOUTH_IDX = [61, 291, 0, 17, 57, 287];

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
        // Calculate Eye Aspect Ratio
        // Using 6 points: (p2-p6 + p3-p5) / (2 * p1-p4)
        const [p1, p2, p3, p4, p5, p6] = eyePoints;
        const dist = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
        return (dist(p2, p6) + dist(p3, p5)) / (2.0 * dist(p1, p4) + 1e-6);
    }

    calculateMAR(mouthPoints) {
        // Calculate Mouth Aspect Ratio
        // Using 6 points: similar to EAR formula for mouth
        const [p1, p2, p3, p4, p5, p6] = mouthPoints;
        const dist = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
        return (dist(p2, p6) + dist(p3, p5)) / (2.0 * dist(p1, p4) + 1e-6);
    }

    async processFrame(frameData) {
        try {
            // Decode base64 image
            const base64Data = frameData.split(',')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');

            // Get image dimensions using sharp
            const metadata = await sharp(imageBuffer).metadata();
            const { width, height } = metadata;

            const currentTime = Date.now() / 1000;

            // Initialize response
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

            if (USE_MEDIAPIPE) {
                // TODO: Implement MediaPipe JavaScript version if available
                // For now, fallback to mock mode
                response.face_detected = Math.random() > 0.2;
            } else {
                // Mock mode - generate random data
                response.face_detected = Math.random() > 0.2;

                if (response.face_detected) {
                    // Generate mock face mesh points
                    const mockPoints = [];
                    for (let i = 0; i < 468; i++) {
                        mockPoints.push([
                            Math.floor(Math.random() * width),
                            Math.floor(Math.random() * height)
                        ]);
                    }
                    response.face_mesh_points = mockPoints;

                    // Generate mock EAR and MAR
                    const ear = 0.2 + Math.random() * 0.2; // 0.2 to 0.4
                    const mar = 10 + Math.random() * 20; // 10 to 30

                    response.ear = ear;
                    response.mar = mar;

                    // Mock blink detection
                    if (ear < this.earThreshold && (currentTime - this.lastBlinkTime) > this.blinkMinInterval) {
                        this.blinkHistory.push(currentTime);
                        this.lastBlinkTime = currentTime;
                    }

                    // Mock yawn detection
                    if (mar > this.lipThreshold && Math.random() < 0.1) {
                        this.yawnHistory.push(currentTime);
                    }

                    // Clean up old data (keep last 5 minutes)
                    const cutoffTime = currentTime - 300;
                    this.blinkHistory = this.blinkHistory.filter(t => t > cutoffTime);
                    this.yawnHistory = this.yawnHistory.filter(t => t > cutoffTime);

                    // Calculate rates
                    const blinkRate = this.blinkHistory.length / 5.0; // per minute (5 minutes window)
                    const yawnsCount = this.yawnHistory.length;

                    response.blink_rate_per_min = blinkRate;
                    response.yawns_last_5m = yawnsCount;

                    // Calculate fatigue score
                    response.fatigue_score = Math.min(1.0,
                        (blinkRate / 40.0) * 0.6 +
                        (yawnsCount / 6.0) * 0.35 +
                        (mar / 50.0) * 0.05
                    );
                }
            }

            return response;

        } catch (error) {
            console.error('Error processing frame:', error);
            return { error: error.message };
        }
    }
}

// Global processor instance
const processor = new FaceMeshProcessor();

// WebSocket connection handling
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

// HTTP endpoints
app.get('/', (req, res) => {
    res.json({
        message: "FaceMesh Processing Server",
        status: "running",
        mode: USE_MEDIAPIPE ? "mediapipe" : "mock",
        websocket_endpoint: "/ws/face-mesh"
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mode: USE_MEDIAPIPE ? "mediapipe" : "mock"
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`FaceMesh Processing Server listening on http://localhost:${PORT}`);
    console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws/face-mesh`);
    console.log(`Mode: ${USE_MEDIAPIPE ? 'MediaPipe' : 'Mock'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down FaceMesh server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('Shutting down FaceMesh server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = { app, server };
