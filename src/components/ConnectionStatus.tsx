import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Backend Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Simulated Mode</span>
        </>
      )}
    </div>
  );
};