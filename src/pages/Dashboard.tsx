import { useEffect, useState } from 'react';
import { DriverStatusCard } from '@/components/DriverStatusCard';
import { LiveMetricsChart } from '@/components/LiveMetricsChart';
import { RAGAdvicePanel } from '@/components/RAGAdvicePanel';
import { CameraPreview } from '@/components/CameraPreview';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { TripHistoryPanel } from '@/components/TripHistoryPanel';
import { ProfileSection } from '@/components/ProfileSection';
import { useSimulatedData } from '@/hooks/useSimulatedData';
import { useSocketIO } from '@/hooks/useSocketIO';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { driverStatus, metricsHistory, recommendations } = useSimulatedData();
  const { user, logout } = useAuth();
  const { connected, lastEvent } = useSocketIO({ url: 'http://localhost:3001', orgId: 'org_123' });
  const [blinkRate, setBlinkRate] = useState<number | undefined>(undefined);
  const [yawns5m, setYawns5m] = useState<number | undefined>(undefined);
  const [headPos, setHeadPos] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!lastEvent?.metrics) return;
    const m = lastEvent.metrics;
    if (typeof m.blink_rate_per_min === 'number') setBlinkRate(m.blink_rate_per_min);
    if (typeof m.yawns_last_5m === 'number') setYawns5m(m.yawns_last_5m);
    if (typeof m.head_pose_label === 'string') setHeadPos(m.head_pose_label);
  }, [lastEvent]);

  return (
    <div className="min-h-screen bg-background dark p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Main Metrics */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <DriverStatusCard status={driverStatus} />
          <LiveMetricsChart data={metricsHistory} />
          <TripHistoryPanel />
          <CameraPreview isActive={true} blinkRatePerMin={blinkRate} yawnsLast5m={yawns5m} headPosLabel={headPos} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <ProfileSection />
          <RAGAdvicePanel recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
