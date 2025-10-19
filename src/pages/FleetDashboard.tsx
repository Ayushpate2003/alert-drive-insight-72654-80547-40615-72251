import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, AlertTriangle, TrendingUp, LogOut } from 'lucide-react';

const FleetDashboard = () => {
  const { user, logout } = useAuth();

  const mockDrivers = [
    { id: 1, name: 'John Driver', status: 'alert', fatigueScore: 78, vehicle: 'Truck-A101' },
    { id: 2, name: 'Sarah Connor', status: 'normal', fatigueScore: 45, vehicle: 'Truck-B202' },
    { id: 3, name: 'Mike Johnson', status: 'warning', fatigueScore: 62, vehicle: 'Truck-C303' },
    { id: 4, name: 'Emily Davis', status: 'normal', fatigueScore: 38, vehicle: 'Truck-D404' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alert': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background dark p-4 md:p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
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
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">92%</p>
              <p className="text-sm text-muted-foreground">Fleet Safety Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Driver List */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Driver Status</h2>
        <div className="space-y-3">
          {mockDrivers.map((driver) => (
            <div
              key={driver.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-foreground">{driver.name}</p>
                  <Badge variant={getStatusColor(driver.status)}>
                    {driver.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Vehicle: {driver.vehicle}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{driver.fatigueScore}</p>
                <p className="text-xs text-muted-foreground">Fatigue Score</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FleetDashboard;
