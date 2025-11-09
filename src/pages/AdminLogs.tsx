import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  Activity,
  Download,
  Search,
  Filter,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Database
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  event: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'success' | 'failed';
  details?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:25',
    user: 'Sarah Johnson',
    event: 'User login successful',
    type: 'success',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:28:12',
    user: 'Mike Chen',
    event: 'Updated fatigue model threshold',
    type: 'info',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:25:45',
    user: 'System',
    event: 'AI model retraining completed',
    type: 'success',
    status: 'success'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:20:33',
    user: 'Alex Rodriguez',
    event: 'Failed to connect to DashCam feed',
    type: 'error',
    status: 'failed'
  },
  {
    id: '5',
    timestamp: '2024-01-15 14:15:18',
    user: 'Emma Wilson',
    event: 'Trip data synchronization warning',
    type: 'warning',
    status: 'success'
  }
];

const AdminLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [eventType, setEventType] = useState('all');

  useEffect(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.event.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (timeRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate);
    }

    // Filter by event type
    if (eventType !== 'all') {
      filtered = filtered.filter(log => log.type === eventType);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, timeRange, eventType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>;
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Info</Badge>;
    }
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(log => log.type === 'error').length,
    warnings: logs.filter(log => log.type === 'warning').length,
    uptime: 99.8
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#00B4D8]" />
            System Activity & Logs
          </h1>
          <p className="text-gray-400 mt-1">Monitor system events and activity in real-time</p>
        </div>
        <Button className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-black font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Errors</p>
              <p className="text-2xl font-bold text-red-400">{stats.errors}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Warnings</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.warnings}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Uptime</p>
              <p className="text-2xl font-bold text-green-400">{stats.uptime}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1A1A1A] border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search logs by user or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0B0C10] border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full lg:w-48 bg-[#0B0C10] border-gray-600 text-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-gray-600">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-full lg:w-48 bg-[#0B0C10] border-gray-600 text-white">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-gray-600">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="bg-[#1A1A1A] border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0C10] border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#151515] transition-colors duration-200">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {log.event}
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(log.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.status)}
                      <span className={`text-sm ${log.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="border-gray-600 text-gray-500">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Next
            </Button>
          </div>
        </div>
      </Card>


    </div>
  );
};

export default AdminLogs;
