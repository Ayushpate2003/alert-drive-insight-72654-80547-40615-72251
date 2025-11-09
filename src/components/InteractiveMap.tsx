import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Navigation,
  Route,
  Clock,
  Fuel,
  Zap,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface TripPoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  speed: number;
  fatigue: number;
}

interface InteractiveMapProps {
  currentTrip?: TripPoint[];
  tripHistory?: TripPoint[][];
  isActive?: boolean;
}

export const InteractiveMap = ({ currentTrip = [], tripHistory = [], isActive = false }: InteractiveMapProps) => {
  const [selectedPoint, setSelectedPoint] = useState<TripPoint | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default

  // Mock map data - in real app, this would integrate with Google Maps or similar
  const mockMapData = {
    currentLocation: { lat: 40.7589, lng: -73.9851 }, // Times Square
    route: [
      { lat: 40.7589, lng: -73.9851 },
      { lat: 40.7505, lng: -73.9934 },
      { lat: 40.7420, lng: -74.0048 },
      { lat: 40.7306, lng: -74.0027 },
    ]
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Live Route Map
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
            {isActive ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {isActive ? 'Active Trip' : 'Trip Paused'}
          </Badge>
        </div>
      </div>

      {/* Map Container - Mock representation */}
      <div className="relative bg-secondary/30 rounded-lg border border-primary/20 h-96 mb-4 overflow-hidden">
        {/* Mock map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-primary/30" style={{ top: `${i * 10}%` }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-primary/30" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Route visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            {/* Route path */}
            <path
              d="M50,50 L100,80 L150,60 L200,90 L250,70 L300,100 L350,80"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />

            {/* Current position marker */}
            <circle
              cx="200"
              cy="90"
              r="8"
              fill="hsl(var(--primary))"
              className="animate-ping"
            />
            <circle
              cx="200"
              cy="90"
              r="4"
              fill="hsl(var(--primary))"
            />

            {/* Destination marker */}
            <circle
              cx="350"
              cy="80"
              r="6"
              fill="hsl(var(--destructive))"
              stroke="white"
              strokeWidth="2"
            />
          </svg>

          {/* Map overlay info */}
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="font-medium">New York → Boston</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>ETA: 3h 45m</span>
              <span>215 mi remaining</span>
            </div>
          </div>

          {/* Speed indicator */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-bold text-lg">65</span>
              <span className="text-sm text-muted-foreground">mph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Recenter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Fuel className="w-4 h-4" />
            Fuel Stops
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Traffic
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Landmarks
          </Button>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Distance</p>
          <p className="text-lg font-bold text-foreground">142.3 mi</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="text-lg font-bold text-foreground">2h 15m</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Avg Speed</p>
          <p className="text-lg font-bold text-foreground">62 mph</p>
        </div>
      </div>
    </Card>
  );
};
