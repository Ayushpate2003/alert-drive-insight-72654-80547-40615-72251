import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RAGRecommendation } from '@/types/monitoring';
import { AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RAGAdvicePanelProps {
  recommendations: RAGRecommendation[];
}

export const RAGAdvicePanel = ({ recommendations }: RAGAdvicePanelProps) => {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertOctagon;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'hsl(var(--monitor-critical))';
      case 'warning': return 'hsl(var(--monitor-warning))';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <Card className="p-6 bg-card border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">AI Safety Advisor</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">RAG Active</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recommendations at this time.</p>
              <p className="text-sm mt-1">Drive safely!</p>
            </div>
          ) : (
            recommendations.map((rec) => {
              const Icon = getIcon(rec.severity);
              const color = getColor(rec.severity);
              
              return (
                <div 
                  key={rec.id}
                  className="p-4 rounded-lg bg-secondary border-l-4 transition-all hover:bg-secondary/80"
                  style={{ borderLeftColor: color }}
                >
                  <div className="flex gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color }} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        {rec.message}
                      </p>
                      {rec.context && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {rec.context}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(rec.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};