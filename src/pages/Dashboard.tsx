import { useEffect, useState } from 'react';
import { DriverStatusCard } from '@/components/DriverStatusCard';
import { LiveMetricsChart } from '@/components/LiveMetricsChart';
import { RAGAdvicePanel } from '@/components/RAGAdvicePanel';
import { EnhancedCameraPreview } from '@/components/EnhancedCameraPreview';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { TripHistoryPanel } from '@/components/TripHistoryPanel';
import { ProfileSection } from '@/components/ProfileSection';
import { DashCamSubPages } from '@/components/DashCamSubPages';
import { InteractiveMap } from '@/components/InteractiveMap';
import { TripSummaryCards } from '@/components/TripSummaryCards';
import { TripControls } from '@/components/TripControls';
import { AlertFilters } from '@/components/AlertFilters';
import { EnhancedAlertCard } from '@/components/EnhancedAlertCard';
import { AlertStatistics } from '@/components/AlertStatistics';
import DriverNavBar from '@/components/DriverNavBar';
import { useSimulatedData } from '@/hooks/useSimulatedData';
import { useSocketIO } from '@/hooks/useSocketIO';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, ArrowLeft, LogOut, MapPin, AlertTriangle, Camera, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const location = useLocation();
  const { driverStatus, metricsHistory, recommendations } = useSimulatedData();
  const { user, logout } = useAuth();
  const { connected, lastEvent } = useSocketIO({ url: 'http://localhost:3000', orgId: 'org_123' });
  const [blinkRate, setBlinkRate] = useState<number | undefined>(undefined);
  const [yawns5m, setYawns5m] = useState<number | undefined>(undefined);
  const [headPos, setHeadPos] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('trips');
  const [isTripTracking, setIsTripTracking] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [alertFilters, setAlertFilters] = useState({ severity: [], timeRange: 'all', location: '', type: [] });

  useEffect(() => {
    if (!lastEvent?.metrics) return;
    const m = lastEvent.metrics;
    if (typeof m.blink_rate_per_min === 'number') setBlinkRate(m.blink_rate_per_min);
    if (typeof m.yawns_last_5m === 'number') setYawns5m(m.yawns_last_5m);
    if (typeof m.head_pose_label === 'string') setHeadPos(m.head_pose_label);
  }, [lastEvent]);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/trips')) setActiveTab('trips');
    else if (path.includes('/alerts')) setActiveTab('alerts');
    else if (path.includes('/dashcam')) setActiveTab('dashcam');
    else if (path.includes('/profile')) setActiveTab('profile');
    else setActiveTab('trips'); // default
  }, [location.pathname]);

  const tabs = [
    { id: 'trips', label: 'Trips', icon: MapPin },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'dashcam', label: 'DashCam', icon: Camera },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleStartTrip = () => {
    setIsTripTracking(true);
    setCurrentTrip({
      id: `trip_${Date.now()}`,
      startTime: new Date(),
      distance: 0,
      avgSpeed: 0
    });
  };

  const handlePauseTrip = () => {
    setIsTripTracking(false);
  };

  const handleStopTrip = () => {
    setIsTripTracking(false);
    setCurrentTrip(null);
  };

  const handleResumeTrip = () => {
    setIsTripTracking(true);
  };

  const mockTripSummaries = [
    {
      id: '1',
      route: 'NYC → Boston',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 2 + 67 * 60 * 1000),
      distance: 45.2,
      duration: 67,
      fuelUsed: 4.2,
      fuelEfficiency: 10.8,
      avgSpeed: 40.5,
      maxSpeed: 65,
      stops: 1,
      cost: 45.20,
      status: 'completed' as const
    },
    {
      id: '2',
      route: 'Boston → Washington DC',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 + 145 * 60 * 1000),
      distance: 128.7,
      duration: 145,
      fuelUsed: 12.1,
      fuelEfficiency: 9.4,
      avgSpeed: 53.2,
      maxSpeed: 85,
      stops: 2,
      cost: 128.70,
      status: 'completed' as const
    },
    {
      id: '3',
      route: 'Washington DC → Philadelphia',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 48 + 98 * 60 * 1000),
      distance: 89.3,
      duration: 98,
      fuelUsed: 8.7,
      fuelEfficiency: 9.8,
      avgSpeed: 54.7,
      maxSpeed: 72,
      stops: 0,
      cost: 89.30,
      status: 'completed' as const
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trips':
        return (
          <div className="space-y-6">
            {/* Trip Controls */}
            <TripControls
              isActive={isTripTracking}
              isPaused={false}
              onStart={handleStartTrip}
              onPause={handlePauseTrip}
              onStop={handleStopTrip}
              onResume={handleResumeTrip}
              currentTrip={currentTrip}
            />

            {/* Interactive Map */}
            <InteractiveMap
              currentTrip={[]}
              tripHistory={[]}
              isActive={isTripTracking}
            />

            {/* Trip Summary Cards */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Recent Trips</h3>
              <TripSummaryCards
                trips={mockTripSummaries}
              />
            </div>

            {/* Legacy Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DriverStatusCard status={driverStatus} />
              <LiveMetricsChart data={metricsHistory} />
            </div>
            <TripHistoryPanel />
          </div>
        );
      case 'alerts':
        return (
          <div className="space-y-6">
            {/* Alert Statistics */}
            <AlertStatistics
              stats={{
                total: 24,
                critical: 3,
                warning: 12,
                info: 9,
                resolved: 18,
                pending: 6,
                today: 3,
                thisWeek: 12,
                avgResponseTime: 45,
                mostCommonType: 'fatigue',
                trend: 'down',
                trendPercentage: -15
              }}
              timeRange={alertFilters.timeRange}
            />

            {/* Alert Filters */}
            <AlertFilters
              activeFilters={alertFilters}
              onFilterChange={setAlertFilters}
            />

            {/* Real-Time Alerts Feed */}
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Real-Time Alerts
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live Feed Active</span>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Mock alerts data */}
                {[
                  {
                    id: 'alert_001',
                    timestamp: new Date(Date.now() - 1000 * 60 * 2),
                    severity: 'critical' as const,
                    type: 'collision_risk',
                    message: 'Too close to vehicle ahead. Maintain safe distance.',
                    location: 'I-95 N, Mile 234',
                    context: 'Speed: 85 mph, Distance: 15.2 ft, Fatigue: 72%',
                    videoUrl: 'mock_video_001.mp4',
                    resolved: false
                  },
                  {
                    id: 'alert_002',
                    timestamp: new Date(Date.now() - 1000 * 60 * 15),
                    severity: 'warning' as const,
                    type: 'fatigue',
                    message: 'Fatigue levels rising. Consider taking a break.',
                    context: 'Fatigue level: 78%, Eye closure rate increased',
                    resolved: false
                  },
                  {
                    id: 'alert_003',
                    timestamp: new Date(Date.now() - 1000 * 60 * 45),
                    severity: 'info' as const,
                    type: 'following_distance',
                    message: 'Following distance improved. Good job maintaining safe gap.',
                    location: 'US-1 S, Exit 12',
                    context: 'Distance: 42.3 ft, Speed: 65 mph',
                    videoUrl: 'mock_video_003.mp4',
                    resolved: true,
                    resolvedAt: new Date(Date.now() - 1000 * 60 * 30)
                  }
                ].map((alert) => (
                  <EnhancedAlertCard
                    key={alert.id}
                    alert={alert}
                    onViewDetails={(alert) => console.log('View details:', alert)}
                    onResolve={(alert) => console.log('Resolve alert:', alert)}
                  />
                ))}
              </div>
            </Card>

            <RAGAdvicePanel recommendations={recommendations} />
          </div>
        );
      case 'dashcam':
        return (
          <div className="space-y-6">
            <EnhancedCameraPreview isActive={true} blinkRatePerMin={blinkRate} yawnsLast5m={yawns5m} headPosLabel={headPos} showFaceMask={true} />
            <DashCamSubPages />
          </div>
        );
      case 'profile':
        return <ProfileSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <ConnectionStatus isConnected={connected} />
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Driver Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name} - Real-time safety monitoring
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* Driver Navigation Bar - Fixed at Bottom */}
      <DriverNavBar />
    </div>
  );
};

export default Dashboard;
