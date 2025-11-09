import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Info,
  AlertOctagon,
  Clock,
  MapPin,
  Play,
  Pause,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  location?: string;
  context?: string;
  videoUrl?: string;
  resolved: boolean;
  resolvedAt?: Date;
}

interface EnhancedAlertCardProps {
  alert: Alert;
  onResolve?: (id: string) => void;
  onViewDetails?: (alert: Alert) => void;
  showVideoControls?: boolean;
}

export const EnhancedAlertCard = ({
  alert,
  onResolve,
  onViewDetails,
  showVideoControls = true
}: EnhancedAlertCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertOctagon,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        };
    }
  };

  const config = getSeverityConfig(alert.severity);
  const Icon = config.icon;

  return (
    <Card className={`p-4 ${config.bgColor} border ${config.borderColor} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={config.badgeColor}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {alert.type}
                </Badge>
                {alert.resolved && (
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                    Resolved
                  </Badge>
                )}
              </div>
              <h4 className="font-semibold text-foreground text-sm leading-tight">
                {alert.message}
              </h4>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 p-1 hover:bg-secondary/50"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
            </div>
            {alert.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {alert.location}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {showVideoControls && alert.videoUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="flex items-center gap-1 text-xs"
              >
                {isVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isVideoPlaying ? 'Pause' : 'Replay'}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(alert)}
              className="flex items-center gap-1 text-xs"
            >
              <Eye className="w-3 h-3" />
              Details
            </Button>

            {!alert.resolved && onResolve && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve(alert.id)}
                className="flex items-center gap-1 text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
              >
                <ExternalLink className="w-3 h-3" />
                Resolve
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          {alert.context && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-foreground mb-1">Context</h5>
              <p className="text-sm text-muted-foreground">{alert.context}</p>
            </div>
          )}

          {/* Video Player Mock */}
          {showVideoControls && alert.videoUrl && isVideoPlaying && (
            <div className="mb-3">
              <div className="bg-secondary/50 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-center h-32 bg-secondary/30 rounded">
                  <div className="text-center text-muted-foreground">
                    <Play className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Video playback would be here</p>
                    <p className="text-xs">Timestamp: {alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Alert ID:</span>
              <span className="ml-1 font-mono text-foreground">{alert.id.slice(-8)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-1 text-foreground">{alert.type}</span>
            </div>
            {alert.resolvedAt && (
              <>
                <div>
                  <span className="text-muted-foreground">Resolved:</span>
                  <span className="ml-1 text-foreground">
                    {formatDistanceToNow(alert.resolvedAt, { addSuffix: true })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-1 text-green-400">Resolved</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
