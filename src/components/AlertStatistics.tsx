import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  AlertOctagon,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';

interface AlertStats {
  total: number;
  critical: number;
  warning: number;
  info: number;
  resolved: number;
  pending: number;
  today: number;
  thisWeek: number;
  avgResponseTime: number; // in minutes
  mostCommonType: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface AlertStatisticsProps {
  stats: AlertStats;
  timeRange: string;
}

export const AlertStatistics = ({ stats, timeRange }: AlertStatisticsProps) => {
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

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold text-foreground">{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-primary/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon(stats.trend)}
            <span className={`text-sm ${getTrendColor(stats.trend)}`}>
              {stats.trendPercentage > 0 ? '+' : ''}{stats.trendPercentage}% from last {timeRange}
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
            </div>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertOctagon className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {((stats.critical / stats.total) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-400">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.resolved} of {stats.total} resolved
          </p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-400">{formatTime(stats.avgResponseTime)}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Industry avg: 45m
          </p>
        </Card>
      </div>

      {/* Severity Breakdown */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alert Severity Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertOctagon className="w-6 h-6 text-red-400" />
            <div className="flex-1">
              <p className="font-semibold text-red-400">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {stats.total > 0 ? Math.round((stats.critical / stats.total) * 100) : 0}%
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-400">{stats.warning}</p>
              <p className="text-sm text-muted-foreground">Warning</p>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {stats.total > 0 ? Math.round((stats.warning / stats.total) * 100) : 0}%
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Info className="w-6 h-6 text-blue-400" />
            <div className="flex-1">
              <p className="font-semibold text-blue-400">{stats.info}</p>
              <p className="text-sm text-muted-foreground">Info</p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {stats.total > 0 ? Math.round((stats.info / stats.total) * 100) : 0}%
            </Badge>
          </div>
        </div>
      </Card>

      {/* Time-based Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="font-semibold text-foreground">{stats.today}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-semibold text-foreground">{stats.thisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <span className="font-semibold text-yellow-400">{stats.pending}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Common Alert Types</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Most Common</span>
              <Badge variant="secondary">{stats.mostCommonType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.trend)}
                <span className={`text-sm ${getTrendColor(stats.trend)}`}>
                  {stats.trendPercentage > 0 ? '+' : ''}{stats.trendPercentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolution Rate</span>
              <span className="font-semibold text-green-400">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
