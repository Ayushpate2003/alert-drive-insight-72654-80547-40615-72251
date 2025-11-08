                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';                                                                                                                                                                                                                                                                                                                                                                                                                                              
import { Camera, VideoOff, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface EnhancedCameraPreviewProps {
  isActive?: boolean;
  blinkRatePerMin?: number;
  yawnsLast5m?: number;
  headPosLabel?: string;
}

export const EnhancedCameraPreview = ({
  isActive = true,
  blinkRatePerMin,
  yawnsLast5m,
  headPosLabel
}: EnhancedCameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamOn, setStreamOn] = useState(false);
  const [status, setStatus] = useState<'initializing' | 'active' | 'error' | 'processing'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string>('');                                                                                                     
  const [faceMeshData, setFaceMeshData] = useState<any>(null);
  const [framesReceived, setFramesReceived] = useState(0);
  const [fatigueScore, setFatigueScore] = useState<number | undefined>(undefined);
  const wsRef = useRef<WebSocket | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    let isCapturing = false;

    const setupCamera = async () => {
      try {
        setStatus('processing');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });
        currentStream = stream;

        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            setStreamOn(true);
            setStatus('active');
            connectWebSocket();
          };
        }
      } catch (e: any) {
        setStreamOn(false);
        setStatus('error');
        if (e.name === 'NotAllowedError') {
          setErrorMessage('Camera access denied. Please allow camera permissions.');
        } else if (e.name === 'NotFoundError') {
          setErrorMessage('No camera found on this device.');
        } else if (e.name === 'NotReadableError') {
          setErrorMessage('Camera is already in use by another application.');
        } else {
          setErrorMessage(`Camera error: ${e.message}`);
        }
      }
    };

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8000/ws/face-mesh');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('FaceMesh WebSocket connected');
          setStatus('active');
          startFrameCapture();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received FaceMesh data:', data);
            if (data.error) {
              console.error('FaceMesh processing error:', data.error);
              setStatus('error');
              setErrorMessage(`FaceMesh processing error: ${data.error}`);
            } else {
              setFaceMeshData(data);
              setFramesReceived(prev => prev + 1);
              setFatigueScore(data.fatigue_score);
              // Update status to active if we receive data
              if (status !== 'active') {
                setStatus('active');
              }
            }
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
            setStatus('error');
            setErrorMessage('Failed to parse server response');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setStatus('error');
          setErrorMessage('Failed to connect to FaceMesh processing server');
          wsRef.current = null;
        };

        ws.onclose = (event) => {
          console.log('FaceMesh WebSocket disconnected:', event.code, event.reason);
          isCapturing = false;
          wsRef.current = null;
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (isActive && !wsRef.current) {
              console.log('Attempting to reconnect WebSocket...');
              connectWebSocket();
            }
          }, 1000);
        };
      } catch (e) {
        console.error('Failed to create WebSocket connection:', e);
      }
    };

    const startFrameCapture = () => {
      if (isCapturing) return;
      isCapturing = true;
      let lastFrameTime = 0;
      const targetFPS = 10; // Limit to 10 FPS to reduce load
      const frameInterval = 1000 / targetFPS;

      const captureFrame = (timestamp: number) => {
        if (!isCapturing || !video || !canvas || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        // Throttle frame capture
        if (timestamp - lastFrameTime < frameInterval) {
          animationFrameRef.current = requestAnimationFrame(captureFrame);
          return;
        }
        lastFrameTime = timestamp;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            try {
              // Set canvas size to match video
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              // Draw video frame to canvas
              ctx.drawImage(video, 0, 0);

              // Convert canvas to base64
              const imageData = canvas.toDataURL('image/jpeg', 0.8);

              // Send to WebSocket
              wsRef.current.send(JSON.stringify({ image: imageData }));
            } catch (e) {
              console.error('Failed to capture/send frame:', e);
              // Don't stop capturing on single frame errors, just log
            }
          }
        }

        if (isCapturing) {
          animationFrameRef.current = requestAnimationFrame(captureFrame);
        }
      };

      animationFrameRef.current = requestAnimationFrame(captureFrame);
    };

    if (isActive) {
      setupCamera();
    }

    return () => {
      isCapturing = false;
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  // Separate effect for drawing face mesh overlay
  useEffect(() => {
    const drawFaceMesh = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || !faceMeshData || !faceMeshData.face_mesh_points) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas and redraw video frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw face mesh points
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#00ff00';

      // Draw key facial landmarks
      const keyPoints = [
        // Eyes
        33, 133, 362, 263, // Eye corners
        // Nose
        1, 2, 98, 327, // Nose tip and bridge
        // Mouth
        61, 291, 0, 17, // Mouth corners and center
        // Eyebrows
        70, 63, 105, 66, 107, 336, 296, 334, 293, 300 // Eyebrow points
      ];

      keyPoints.forEach((idx) => {
        if (faceMeshData.face_mesh_points[idx]) {
          const point = faceMeshData.face_mesh_points[idx];
          ctx.beginPath();
          ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Draw face outline
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const outlinePoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
      outlinePoints.forEach((idx, i) => {
        if (faceMeshData.face_mesh_points[idx]) {
          const point = faceMeshData.face_mesh_points[idx];
          if (i === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        }
      });
      ctx.closePath();
      ctx.stroke();

      // Draw eye contours
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 1;

      // Left eye
      ctx.beginPath();
      [33, 160, 158, 133, 153, 144].forEach((idx, i) => {
        if (faceMeshData.face_mesh_points[idx]) {
          const point = faceMeshData.face_mesh_points[idx];
          if (i === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        }
      });
      ctx.closePath();
      ctx.stroke();

      // Right eye
      ctx.beginPath();
      [362, 385, 387, 263, 373, 380].forEach((idx, i) => {
        if (faceMeshData.face_mesh_points[idx]) {
          const point = faceMeshData.face_mesh_points[idx];
          if (i === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        }
      });
      ctx.closePath();
      ctx.stroke();

      // Draw mouth contour
      ctx.strokeStyle = '#ff0000';
      ctx.beginPath();
      [61, 291, 0, 17, 57, 287].forEach((idx, i) => {
        if (faceMeshData.face_mesh_points[idx]) {
          const point = faceMeshData.face_mesh_points[idx];
          if (i === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        }
      });
      ctx.closePath();
      ctx.stroke();
    };

    drawFaceMesh();
  }, [faceMeshData]);

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <Camera className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return '🟢 Camera active';
      case 'error':
        return `🔴 ${errorMessage}`;
      case 'processing':
        return '🟡 Processing...';
      default:
        return 'Initializing...';
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">Driver Camera - FaceMesh Tracking</h3>
      <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              style={{ display: 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            />
            {/* Hidden video element for processing */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              style={{ display: 'none' }}
            />
            {/* Debug info */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
              Stream: {streamOn ? 'ON' : 'OFF'} | Frames: {framesReceived} | WS: {wsRef.current?.readyState === WebSocket.OPEN ? 'OPEN' : 'CLOSED'}
            </div>
            {status !== 'error' && (
              <Camera className="w-16 h-16 text-muted-foreground opacity-50" />
            )}
            {status === 'error' && (
              <div className="flex flex-col items-center gap-2">
                <VideoOff className="w-16 h-16 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground text-center px-4">
                  {errorMessage}
                </p>
              </div>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full">
              {getStatusIcon()}
              <span className="text-xs font-medium text-foreground">LIVE</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Blink Rate:</span>
                  <span className="ml-2 text-foreground font-medium">
                    {faceMeshData?.blink_rate_per_min?.toFixed(1) ?? blinkRatePerMin?.toFixed(0) ?? '0'}/min
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Yawns:</span>
                  <span className="ml-2 text-foreground font-medium">
                    {faceMeshData?.yawns_last_5m ?? yawnsLast5m ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fatigue:</span>
                  <span className="ml-2 text-foreground font-medium">
                    {fatigueScore !== undefined ? (fatigueScore * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Face:</span>
                  <span className="ml-2 text-foreground font-medium">
                    {faceMeshData?.face_detected ? 'Detected' : 'Not Found'}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <VideoOff className="w-16 h-16 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">Camera Offline</p>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {getStatusIcon()}
        <p className="text-sm text-foreground">{getStatusText()}</p>
        {framesReceived > 0 && (
          <p className="text-sm text-green-600">Frames: {framesReceived}</p>
        )}
      </div>
    </Card>
  );
};
