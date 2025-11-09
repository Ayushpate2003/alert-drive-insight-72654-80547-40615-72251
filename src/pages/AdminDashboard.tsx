import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Database,
  Activity,
  Cpu,
  HardDrive,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock data for demonstration
  const metrics = {
    totalUsers: 1247,
    activeUsers: 892,
    systemHealth: 98.5,
    totalTrips: 15432,
    alertsToday: 23,
    memoryUsage: 67.3,
    cpuUsage: 45.2,
    storageUsage: 78.9
  };

  const recentActivity = [
    {
      id: 1,
      type: 'user_login',
      message: 'Driver John Doe logged in',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      severity: 'info'
    },
    {
      id: 2,
      type: 'alert_triggered',
      message: 'Fatigue alert for Driver Sarah Wilson',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      severity: 'warning'
    },
    {
      id: 3,
      type: 'system_update',
      message: 'AI model retrained successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      severity: 'success'
    }
  ];



  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">System Overview</h2>
        <p className="text-gray-400">Monitor your SafeYatra platform performance and user activity</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-[#1a1a1a] border-gray-700 hover:bg-[#202020] transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#00B4D8]/20">
              <Users className="w-6 h-6 text-[#00B4D8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a1a] border-gray-700 hover:bg-[#202020] transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#00B4D8]/20">
              <Activity className="w-6 h-6 text-[#00B4D8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Active Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a1a] border-gray-700 hover:bg-[#202020] transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#00B4D8]/20">
              <TrendingUp className="w-6 h-6 text-[#00B4D8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.totalTrips.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Trips</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a1a] border-gray-700 hover:bg-[#202020] transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.systemHealth}%</p>
              <p className="text-sm text-gray-400">System Health</p>
            </div>
          </div>
        </Card>
      </div>

      {/* System Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-[#1a1a1a] border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00B4D8]/20">
                <Cpu className="w-5 h-5 text-[#00B4D8]" />
              </div>
              CPU Usage
            </h3>
            <span className="text-2xl font-bold text-white">{metrics.cpuUsage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-[#00B4D8] rounded-full h-3 transition-all duration-300"
              style={{ width: `${metrics.cpuUsage}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">System processing load</p>
        </Card>

        <Card className="p-6 bg-[#1a1a1a] border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00B4D8]/20">
                <HardDrive className="w-5 h-5 text-[#00B4D8]" />
              </div>
              Memory Usage
            </h3>
            <span className="text-2xl font-bold text-white">{metrics.memoryUsage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-[#00B4D8] rounded-full h-3 transition-all duration-300"
              style={{ width: `${metrics.memoryUsage}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">RAM utilization</p>
        </Card>

        <Card className="p-6 bg-[#1a1a1a] border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00B4D8]/20">
                <Database className="w-5 h-5 text-[#00B4D8]" />
              </div>
              Storage Usage
            </h3>
            <span className="text-2xl font-bold text-white">{metrics.storageUsage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-[#00B4D8] rounded-full h-3 transition-all duration-300"
              style={{ width: `${metrics.storageUsage}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">Database storage</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-[#1a1a1a] border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00B4D8]/20">
            <Clock className="w-5 h-5 text-[#00B4D8]" />
          </div>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const getActivityIcon = (type: string) => {
              switch (type) {
                case 'user_login': return CheckCircle;
                case 'alert_triggered': return AlertTriangle;
                case 'system_update': return TrendingUp;
                default: return Activity;
              }
            };

            const getActivityColor = (severity: string) => {
              switch (severity) {
                case 'warning': return 'text-yellow-400';
                case 'success': return 'text-green-400';
                default: return 'text-[#00B4D8]';
              }
            };

            const Icon = getActivityIcon(activity.type);
            const timeAgo = Math.floor((Date.now() - activity.timestamp.getTime()) / (1000 * 60));

            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-[#252525] border border-gray-600">
                <div className={`p-2 rounded-lg bg-gray-700 ${getActivityColor(activity.severity)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.message}</p>
                  <p className="text-gray-400 text-sm">{timeAgo} minutes ago</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-[#1a1a1a] border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('users')}
            className="p-4 rounded-lg bg-[#252525] border border-gray-600 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#00B4D8]/20 group-hover:bg-[#00B4D8]/30 transition-colors">
                <Users className="w-5 h-5 text-[#00B4D8]" />
              </div>
              <span className="text-white font-medium">Manage Users</span>
            </div>
            <p className="text-gray-400 text-sm">Add, edit, or remove system users</p>
          </div>

          <div
            onClick={() => navigate('logs')}
            className="p-4 rounded-lg bg-[#252525] border border-gray-600 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#00B4D8]/20 group-hover:bg-[#00B4D8]/30 transition-colors">
                <Activity className="w-5 h-5 text-[#00B4D8]" />
              </div>
              <span className="text-white font-medium">View Logs</span>
            </div>
            <p className="text-gray-400 text-sm">Monitor system activity and events</p>
          </div>

          <div
            onClick={() => navigate('settings')}
            className="p-4 rounded-lg bg-[#252525] border border-gray-600 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#00B4D8]/20 group-hover:bg-[#00B4D8]/30 transition-colors">
                <Settings className="w-5 h-5 text-[#00B4D8]" />
              </div>
              <span className="text-white font-medium">System Settings</span>
            </div>
            <p className="text-gray-400 text-sm">Configure application parameters</p>
          </div>

          <div className="p-4 rounded-lg bg-[#252525] border border-gray-600 hover:bg-[#2a2a2a] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white font-medium">Security Center</span>
            </div>
            <p className="text-gray-400 text-sm">Advanced security configuration</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
