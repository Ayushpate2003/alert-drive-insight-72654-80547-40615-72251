import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  MapPin,
  Navigation,
  Clock,
  Activity
} from 'lucide-react';

interface TripControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onResume: () => void;
  currentTrip?: {
    id: string;
    startTime: Date;
    distance: number;
    duration: number;
    avgSpeed: number;
  };
}

export const TripControls = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onStop,
  onResume,
  currentTrip
}: TripControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    if (!isActive) return <Badge variant="secondary">Not Started</Badge>;
    if (isPaused) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Paused</Badge>;
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Navigation className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Trip Controls</h3>
            <p className="text-sm text-muted-foreground">Manage your current trip</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Current Trip Info */}
      {currentTrip && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg border border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Duration</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatDuration(currentTrip.duration)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Distance</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {currentTrip.distance.toFixed(1)} mi
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Speed</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {currentTrip.avgSpeed.toFixed(0)} mph
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Trip ID</span>
            </div>
            <p className="text-sm font-mono text-foreground">
              {currentTrip.id.slice(-6)}
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        {!isActive ? (
          <Button
            onClick={onStart}
            size="lg"
            className="px-8 py-3 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Start New Trip
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            {isPaused ? (
              <Button
                onClick={onResume}
                size="lg"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Resume
              </Button>
            ) : (
              <Button
                onClick={onPause}
                size="lg"
                variant="outline"
                className="px-6 py-3 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Pause className="w-5 h-5" />
                Pause
              </Button>
            )}

            <Button
              onClick={onStop}
              size="lg"
              variant="outline"
              className="px-6 py-3 border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Square className="w-5 h-5" />
              End Trip
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="lg"
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-3 hover:bg-secondary/50 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Emergency Stop
        </Button>
        <span className="text-muted-foreground">•</span>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Report Issue
        </Button>
        <span className="text-muted-foreground">•</span>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Call Support
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-3">Trip Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto-save every 5 min</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Real-time sync</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Voice alerts</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data collection</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
