import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  AlertTriangle,
  Info,
  AlertOctagon,
  Clock,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';

interface AlertFiltersProps {
  onFilterChange: (filters: AlertFilterState) => void;
  activeFilters: AlertFilterState;
}

export interface AlertFilterState {
  severity: string[];
  timeRange: string;
  location: string;
  type: string[];
}

export const AlertFilters = ({ onFilterChange, activeFilters }: AlertFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityOptions = [
    { value: 'critical', label: 'Critical', icon: AlertOctagon, color: 'text-red-400' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-400' },
    { value: 'info', label: 'Info', icon: Info, color: 'text-blue-400' },
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
  ];

  const typeOptions = [
    { value: 'fatigue', label: 'Fatigue' },
    { value: 'speeding', label: 'Speeding' },
    { value: 'distraction', label: 'Distraction' },
    { value: 'collision', label: 'Collision Risk' },
    { value: 'system', label: 'System' },
  ];

  const handleSeverityToggle = (severity: string) => {
    const newSeverity = activeFilters.severity.includes(severity)
      ? activeFilters.severity.filter(s => s !== severity)
      : [...activeFilters.severity, severity];

    onFilterChange({
      ...activeFilters,
      severity: newSeverity,
    });
  };

  const handleTypeToggle = (type: string) => {
    const newType = activeFilters.type.includes(type)
      ? activeFilters.type.filter(t => t !== type)
      : [...activeFilters.type, type];

    onFilterChange({
      ...activeFilters,
      type: newType,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      severity: [],
      timeRange: 'all',
      location: '',
      type: [],
    });
  };

  const activeFilterCount = activeFilters.severity.length + activeFilters.type.length +
    (activeFilters.timeRange !== 'all' ? 1 : 0) + (activeFilters.location ? 1 : 0);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Alert Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="flex flex-wrap gap-2 mb-4">
        {severityOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilters.severity.includes(option.value);
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeverityToggle(option.value)}
              className={`flex items-center gap-1 transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50'
                  : 'hover:bg-primary/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Time Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Time Range
            </label>
            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange({ ...activeFilters, timeRange: option.value })}
                  className={activeFilters.timeRange === option.value ? 'bg-primary text-primary-foreground' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Alert Types
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.type.includes(option.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeToggle(option.value)}
                  className={activeFilters.type.includes(option.value) ? 'bg-primary text-primary-foreground' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="Filter by location..."
              value={activeFilters.location}
              onChange={(e) => onFilterChange({ ...activeFilters, location: e.target.value })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {activeFilters.severity.map(severity => (
              <Badge key={severity} variant="secondary" className="text-xs">
                {severityOptions.find(s => s.value === severity)?.label}
              </Badge>
            ))}
            {activeFilters.type.map(type => (
              <Badge key={type} variant="secondary" className="text-xs">
                {typeOptions.find(t => t.value === type)?.label}
              </Badge>
            ))}
            {activeFilters.timeRange !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {timeRangeOptions.find(t => t.value === activeFilters.timeRange)?.label}
              </Badge>
            )}
            {activeFilters.location && (
              <Badge variant="secondary" className="text-xs">
                Location: {activeFilters.location}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
