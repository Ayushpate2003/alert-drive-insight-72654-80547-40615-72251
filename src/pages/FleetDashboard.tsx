import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FleetAnalyticsChart } from '@/components/FleetAnalyticsChart';
import { useAuth } from '@/contexts/AuthContext';
import { useFleetData } from '@/hooks/useFleetData';
import { useSocketIO } from '@/hooks/useSocketIO';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  LogOut, 
  Search,
  Download,
  Bell,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

const FleetDashboard = () => {
  const { user, logout } = useAuth();
  const { drivers, analytics, alerts } = useFleetData();
  const [searchQuery, setSearchQuery] = useState('');
  const { connected, lastEvent } = useSocketIO({ url: 'http://localhost:3001', orgId: 'org_123' });

  useEffect(() => {
    if (!lastEvent) return;
    const { type, severity, metrics, driverId, vehicleId } = lastEvent;
    const title = `${severity || 'INFO'}: ${type || 'ALERT'}`;
    const desc = `Driver ${driverId || 'N/A'} • Vehicle ${vehicleId || 'N/A'} • Dist ${metrics?.distance_m ?? '-'}m • dV ${metrics?.relative_speed_kmh ?? '-'}km/h • Fatigue ${metrics?.fatigue_score ?? '-'}`;
    toast(title, {
      description: desc,
    });
  }, [lastEvent]);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.vehicleId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (alertLevel: string) => {
    switch (alertLevel) {
      case 'critical': return { variant: 'destructive' as const, label: 'CRITICAL' };
      case 'warning': return { variant: 'default' as const, label: 'WARNING' };
      default: return { variant: 'secondary' as const, label: 'NORMAL' };
    }
  };

  const getFatigueColor = (score: number) => {
    if (score < 40) return 'text-[hsl(var(--success))]';
    if (score < 60) return 'text-[hsl(var(--warning))]';
    return 'text-[hsl(var(--destructive))]';
  };

  return (
    <div className="min-h-screen bg-background dark p-4 md:p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Fleet Manager Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>
      </header>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.activeDrivers}/{analytics.totalDrivers}</p>
              <p className="text-sm text-muted-foreground">Active Drivers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.criticalAlerts}</p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(var(--success))]/20">
              <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.fleetSafetyScore}%</p>
              <p className="text-sm text-muted-foreground">Fleet Safety Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.totalTripsToday}</p>
              <p className="text-sm text-muted-foreground">Trips Today</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <FleetAnalyticsChart />
        </div>

        {/* Recent Alerts */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Recent Alerts
          </h2>
          <p className="text-xs text-muted-foreground mb-2">Live feed: {connected ? 'Connected' : 'Disconnected'}</p>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'critical' 
                    ? 'bg-destructive/10 border-destructive/30' 
                    : 'bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30'
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{alert.driverName}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(alert.timestamp, 'HH:mm:ss')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Driver List */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Driver Status Monitor</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredDrivers.map((driver) => {
            const statusBadge = getStatusBadge(driver.alertLevel);
            return (
              <div
                key={driver.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    <Badge variant="outline">{driver.status.replace('-', ' ').toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Vehicle: {driver.vehicleId}</span>
                    <span>•</span>
                    <span>{driver.email}</span>
                    <span>•</span>
                    <span>Trips: {driver.totalTrips}</span>
                  </div>
                </div>
                <div className="flex gap-8 text-center">
                  <div>
                    <p className={`text-2xl font-bold ${getFatigueColor(driver.fatigueScore)}`}>
                      {driver.fatigueScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">Fatigue</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${getFatigueColor(driver.stressLevel)}`}>
                      {driver.stressLevel}%
                    </p>
                    <p className="text-xs text-muted-foreground">Stress</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default FleetDashboard;
