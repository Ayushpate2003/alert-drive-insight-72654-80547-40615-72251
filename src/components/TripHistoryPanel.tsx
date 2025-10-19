import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface Trip {
  id: string;
  route: string;
  startTime: Date;
  endTime: Date;
  distance: number;
  avgFatigue: number;
  status: 'completed' | 'ongoing';
}

const mockTrips: Trip[] = [
  {
    id: '1',
    route: 'New York → Boston',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    endTime: new Date(Date.now() - 1000 * 60 * 30),
    distance: 215,
    avgFatigue: 35,
    status: 'completed',
  },
  {
    id: '2',
    route: 'Boston → Philadelphia',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    distance: 308,
    avgFatigue: 52,
    status: 'completed',
  },
  {
    id: '3',
    route: 'Philadelphia → Baltimore',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 22),
    distance: 106,
    avgFatigue: 28,
    status: 'completed',
  },
];

export const TripHistoryPanel = () => {
  const getFatigueColor = (fatigue: number) => {
    if (fatigue < 40) return 'text-[hsl(var(--success))]';
    if (fatigue < 60) return 'text-[hsl(var(--warning))]';
    return 'text-[hsl(var(--destructive))]';
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Recent Trips
      </h2>
      <div className="space-y-3">
        {mockTrips.map((trip) => (
          <div
            key={trip.id}
            className="p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <p className="font-semibold text-foreground">{trip.route}</p>
              </div>
              <Badge variant="secondary">{trip.status}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground">
                  {Math.round((trip.endTime.getTime() - trip.startTime.getTime()) / (1000 * 60))} min
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Distance</p>
                <p className="font-medium text-foreground">{trip.distance} mi</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Fatigue</p>
                <p className={`font-bold ${getFatigueColor(trip.avgFatigue)}`}>
                  {trip.avgFatigue}%
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {format(trip.startTime, 'MMM dd, HH:mm')} - {format(trip.endTime, 'HH:mm')}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
