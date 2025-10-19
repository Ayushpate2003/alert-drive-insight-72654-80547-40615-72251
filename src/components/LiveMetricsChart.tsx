import { Card } from '@/components/ui/card';
import { MetricDataPoint } from '@/types/monitoring';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface LiveMetricsChartProps {
  data: MetricDataPoint[];
}

export const LiveMetricsChart = ({ data }: LiveMetricsChartProps) => {
  const chartData = data.map(point => ({
    time: format(point.timestamp, 'HH:mm:ss'),
    fatigue: Math.round(point.fatigue * 100),
    stress: Math.round(point.stress * 100),
    steering: Math.round(point.steeringStability * 100),
  }));

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">Real-Time Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend 
            wrapperStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Line 
            type="monotone" 
            dataKey="fatigue" 
            stroke="hsl(var(--monitor-danger))" 
            strokeWidth={2}
            dot={false}
            name="Fatigue %"
          />
          <Line 
            type="monotone" 
            dataKey="stress" 
            stroke="hsl(var(--monitor-warning))" 
            strokeWidth={2}
            dot={false}
            name="Stress %"
          />
          <Line 
            type="monotone" 
            dataKey="steering" 
            stroke="hsl(var(--monitor-safe))" 
            strokeWidth={2}
            dot={false}
            name="Steering Stability %"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};