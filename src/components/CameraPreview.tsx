import { Card } from '@/components/ui/card';
import { Camera, VideoOff } from 'lucide-react';

interface CameraPreviewProps {
  isActive?: boolean;
}

export const CameraPreview = ({ isActive = true }: CameraPreviewProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">Driver Camera</h3>
      <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
        {isActive ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/50" />
            <Camera className="w-16 h-16 text-muted-foreground opacity-50" />
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
                  <span className="ml-2 text-foreground font-medium">18/min</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Yawns:</span>
                  <span className="ml-2 text-foreground font-medium">2</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Head Pos:</span>
                  <span className="ml-2 text-foreground font-medium">Normal</span>
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