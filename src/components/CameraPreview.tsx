import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Camera, VideoOff } from 'lucide-react';

interface CameraPreviewProps {
  isActive?: boolean;
  blinkRatePerMin?: number;
  yawnsLast5m?: number;
  headPosLabel?: string;
}

export const CameraPreview = ({ isActive = true, blinkRatePerMin, yawnsLast5m, headPosLabel }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamOn, setStreamOn] = useState(false);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreamOn(true);
      } catch (e) {
        setStreamOn(false);
      }
    };
    start();
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">Driver Camera</h3>
      <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
        {isActive ? (
          <>
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/50" />
            {!streamOn && <Camera className="w-16 h-16 text-muted-foreground opacity-50" />}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-foreground">LIVE</span>
            </div>
            
            {/* Simulated face detection overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-48 h-64 border-2 rounded-lg"
                style={{ borderColor: 'hsl(var(--primary))' }}
              >
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: 'hsl(var(--primary))' }} />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: 'hsl(var(--primary))' }} />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: 'hsl(var(--primary))' }} />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: 'hsl(var(--primary))' }} />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Blink Rate:</span>
                  <span className="ml-2 text-foreground font-medium">{(blinkRatePerMin ?? 18).toFixed(0)}/min</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Yawns:</span>
                  <span className="ml-2 text-foreground font-medium">{yawnsLast5m ?? 2}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Head Pos:</span>
                  <span className="ml-2 text-foreground font-medium">{headPosLabel ?? 'Normal'}</span>
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
    </Card>
  );
};