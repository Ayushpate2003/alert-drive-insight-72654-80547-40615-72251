import { Card } from '@/components/ui/card';
import { DriverStatus } from '@/types/monitoring';
import { Activity, Brain, Gauge } from 'lucide-react';

interface DriverStatusCardProps {
  status: DriverStatus;
}

export const DriverStatusCard = ({ status }: DriverStatusCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Safe': return 'hsl(var(--monitor-safe))';
      case 'Warning': return 'hsl(var(--monitor-warning))';
      case 'Critical': return 'hsl(var(--monitor-danger))';
      case 'Danger': return 'hsl(var(--monitor-critical))';
      default: return 'hsl(var(--primary))';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 0.3) return 'hsl(var(--monitor-safe))';
    if (value < 0.6) return 'hsl(var(--monitor-warning))';
    if (value < 0.8) return 'hsl(var(--monitor-danger))';
    return 'hsl(var(--monitor-critical))';
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{status.name}</h2>
          <p className="text-sm text-muted-foreground">Driver ID: {status.driverId}</p>
        </div>
        <div 
          className="px-4 py-2 rounded-lg font-bold text-lg"
          style={{ 
            backgroundColor: getCategoryColor(status.category) + '20',
            color: getCategoryColor(status.category),
            border: `2px solid ${getCategoryColor(status.category)}`
          }}
        >
          {status.category}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricGauge
          icon={Brain}
          label="Fatigue Level"
          value={status.fatigue}
          color={getMetricColor(status.fatigue)}
        />
        <MetricGauge
          icon={Activity}
          label="Stress Level"
          value={status.stress}
          color={getMetricColor(status.stress)}
        />
        <MetricGauge
          icon={Gauge}
          label="Steering Stability"
          value={1 - status.steeringStability}
          color={getMetricColor(1 - status.steeringStability)}
          inverted
        />
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Overall Driver Score</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${status.overallScore * 100}%`,
                  backgroundColor: getCategoryColor(status.category)
                }}
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              {Math.round(status.overallScore * 100)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface MetricGaugeProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  inverted?: boolean;
}

const MetricGauge = ({ icon: Icon, label, value, color, inverted }: MetricGaugeProps) => {
  const displayValue = inverted ? 1 - value : value;
  
  return (
    <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
      <Icon className="w-6 h-6 mb-2" style={{ color }} />
      <span className="text-xs text-muted-foreground mb-2">{label}</span>
      <div className="relative w-20 h-20">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="hsl(var(--border))"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 32}`}
            strokeDashoffset={`${2 * Math.PI * 32 * (1 - displayValue)}`}
            className="transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>
            {Math.round(displayValue * 100)}
          </span>
        </div>
      </div>
    </div>
  );
};