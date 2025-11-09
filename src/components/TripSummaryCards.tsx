import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  MapPin,
  Fuel,
  TrendingUp,
  Activity,
  DollarSign,
  Route,
  Zap
} from 'lucide-react';

interface TripSummary {
  id: string;
  route: string;
  startTime: Date;
  endTime: Date;
  distance: number;
  duration: number; // in minutes
  fuelUsed: number;
  fuelEfficiency: number; // mpg
  avgSpeed: number;
  maxSpeed: number;
  stops: number;
  cost: number;
  status: 'completed' | 'ongoing' | 'paused';
}

interface TripSummaryCardsProps {
  trips: TripSummary[];
}

export const TripSummaryCards = ({ trips }: TripSummaryCardsProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <Card key={trip.id} className="p-6 bg-card border-border hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">{trip.route}</h3>
            </div>
            <Badge className={getStatusColor(trip.status)}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-3">
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-semibold text-foreground">{trip.distance.toFixed(1)} mi</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">{formatDuration(trip.duration)}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Speed</p>
                  <p className="font-semibold text-foreground">{trip.avgSpeed} mph</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Max Speed</p>
                  <p className="font-semibold text-foreground">{trip.maxSpeed} mph</p>
                </div>
              </div>
            </div>

            {/* Fuel & Cost */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Fuel Used</p>
                  <p className="font-semibold text-foreground">{trip.fuelUsed.toFixed(1)} gal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-semibold text-foreground">{formatCurrency(trip.cost)}</p>
                </div>
              </div>
            </div>

            {/* Efficiency & Stops */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className="font-semibold text-foreground">{trip.fuelEfficiency.toFixed(1)} mpg</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Stops</p>
                  <p className="font-semibold text-foreground">{trip.stops}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Started: {trip.startTime.toLocaleDateString()}</span>
              {trip.status === 'completed' && (
                <span>Ended: {trip.endTime.toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
