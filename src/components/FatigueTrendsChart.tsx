import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface FatigueData {
  date: Date;
  fatigue: number;
  stress: number;
  focus: number;
  overallScore: number;
}

interface FatigueTrendsChartProps {
  data: FatigueData[];
  timeRange: '7d' | '30d' | '90d';
}

export const FatigueTrendsChart = ({ data, timeRange }: FatigueTrendsChartProps) => {
  // Transform data for chart
  const chartData = data.map(point => ({
    date: format(point.date, 'MMM dd'),
    fullDate: point.date,
    fatigue: Math.round(point.fatigue * 100),
    stress: Math.round(point.stress * 100),
    focus: Math.round(point.focus * 100),
    overallScore: Math.round(point.overallScore * 100),
  }));

  // Calculate trends
  const calculateTrend = (metric: keyof FatigueData) => {
    if (data.length < 2) return { trend: 'stable', percentage: 0 };

    const recent = data.slice(-7); // Last 7 days
    const previous = data.slice(-14, -7); // Previous 7 days

    if (previous.length === 0) return { trend: 'stable', percentage: 0 };

    const recentAvg = recent.reduce((sum, d) => sum + (d[metric] as number), 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + (d[metric] as number), 0) / previous.length;

    const percentage = ((recentAvg - previousAvg) / previousAvg) * 100;

    return {
      trend: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    };
  };

  const fatigueTrend = calculateTrend('fatigue');
  const stressTrend = calculateTrend('stress');
  const focusTrend = calculateTrend('focus');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-400';
      case 'down': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  // Current averages
  const currentAvg = data.length > 0 ? {
    fatigue: Math.round(data.slice(-7).reduce((sum, d) => sum + d.fatigue, 0) / Math.min(7, data.length) * 100),
    stress: Math.round(data.slice(-7).reduce((sum, d) => sum + d.stress, 0) / Math.min(7, data.length) * 100),
    focus: Math.round(data.slice(-7).reduce((sum, d) => sum + d.focus, 0) / Math.min(7, data.length) * 100),
    overallScore: Math.round(data.slice(-7).reduce((sum, d) => sum + d.overallScore, 0) / Math.min(7, data.length) * 100),
  } : { fatigue: 0, stress: 0, focus: 0, overallScore: 0 };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Fatigue Level</span>
            {getTrendIcon(fatigueTrend.trend)}
          </div>
          <p className="text-2xl font-bold text-foreground">{currentAvg.fatigue}%</p>
          <p className={`text-xs ${getTrendColor(fatigueTrend.trend)}`}>
            {fatigueTrend.percentage.toFixed(1)}% vs last week
          </p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Stress Level</span>
            {getTrendIcon(stressTrend.trend)}
          </div>
          <p className="text-2xl font-bold text-foreground">{currentAvg.stress}%</p>
          <p className={`text-xs ${getTrendColor(stressTrend.trend)}`}>
            {stressTrend.percentage.toFixed(1)}% vs last week
          </p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Focus Score</span>
            {getTrendIcon(focusTrend.trend)}
          </div>
          <p className="text-2xl font-bold text-foreground">{currentAvg.focus}%</p>
          <p className={`text-xs ${getTrendColor(focusTrend.trend)}`}>
            {focusTrend.percentage.toFixed(1)}% vs last week
          </p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">{currentAvg.overallScore}%</p>
          <p className="text-xs text-muted-foreground">
            Last 7 days average
          </p>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-xl font-bold text-foreground">Fatigue Trends</h3>
              <p className="text-sm text-muted-foreground">
                {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {format(new Date(), 'HH:mm')}
            </Badge>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fatigueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--monitor-danger))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--monitor-danger))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--monitor-warning))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--monitor-warning))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--monitor-safe))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--monitor-safe))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 100]}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return format(payload[0].payload.fullDate, 'MMM dd, yyyy');
                  }
                  return label;
                }}
              />
              <Legend
                wrapperStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="fatigue"
                stroke="hsl(var(--monitor-danger))"
                fillOpacity={1}
                fill="url(#fatigueGradient)"
                strokeWidth={2}
                name="Fatigue %"
              />
              <Area
                type="monotone"
                dataKey="stress"
                stroke="hsl(var(--monitor-warning))"
                fillOpacity={1}
                fill="url(#stressGradient)"
                strokeWidth={2}
                name="Stress %"
              />
              <Area
                type="monotone"
                dataKey="focus"
                stroke="hsl(var(--monitor-safe))"
                fillOpacity={1}
                fill="url(#focusGradient)"
                strokeWidth={2}
                name="Focus %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-muted-foreground">Fatigue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-muted-foreground">Stress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-muted-foreground">Focus</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
