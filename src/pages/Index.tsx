import { DriverStatusCard } from '@/components/DriverStatusCard';
import { LiveMetricsChart } from '@/components/LiveMetricsChart';
import { RAGAdvicePanel } from '@/components/RAGAdvicePanel';
import { CameraPreview } from '@/components/CameraPreview';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useSimulatedData } from '@/hooks/useSimulatedData';
import { Activity } from 'lucide-react';

const Index = () => {
  const { driverStatus, metricsHistory, recommendations } = useSimulatedData();

  return (
    <div className="min-h-screen bg-background dark p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Driver Fatigue Monitor
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time AI-powered safety monitoring
            </p>
          </div>
        </div>
        <ConnectionStatus isConnected={false} />
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Main Metrics */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <DriverStatusCard status={driverStatus} />
          <LiveMetricsChart data={metricsHistory} />
          <CameraPreview isActive={true} />
        </div>

        {/* Right Column - RAG Advice */}
        <div className="lg:col-span-1">
          <RAGAdvicePanel recommendations={recommendations} />
        </div>
      </div>

      {/* Backend Connection Info */}
      <div className="mt-6 p-4 rounded-lg bg-secondary border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Backend Configuration</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Currently running in simulation mode. Connect to your Node.js backend:
        </p>
        <code className="text-xs bg-card px-2 py-1 rounded text-primary block">
          WebSocket: ws://your-backend-url/ws/live
        </code>
        <code className="text-xs bg-card px-2 py-1 rounded text-primary block mt-1">
          REST API: https://your-backend-url/api/v1/
        </code>
      </div>
    </div>
  );
};

export default Index;
