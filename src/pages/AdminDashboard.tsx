import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Database, 
  Settings, 
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  Activity,
  Cpu,
  HardDrive
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { users, auditLogs, metrics } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'fleet_manager': return 'default';
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
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>
      </header>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.activeSessions}</p>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.databaseSize}</p>
              <p className="text-sm text-muted-foreground">Database Size</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(var(--success))]/20">
              <Shield className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.systemHealth}%</p>
              <p className="text-sm text-muted-foreground">System Health</p>
            </div>
          </div>
        </Card>
      </div>

      {/* System Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              CPU Usage
            </h3>
            <span className="text-xl font-bold text-foreground">{metrics.cpuUsage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${metrics.cpuUsage}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" />
              Memory Usage
            </h3>
            <span className="text-xl font-bold text-foreground">{metrics.memoryUsage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${metrics.memoryUsage}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              API Calls (24h)
            </h3>
            <span className="text-xl font-bold text-foreground">{metrics.apiCalls24h}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            All endpoints operating normally
          </p>
        </Card>
      </div>

      {/* User Management */}
      <Card className="p-6 bg-card border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredUsers.map((userData) => (
            <div
              key={userData.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-foreground">{userData.name}</p>
                  <Badge variant={getRoleColor(userData.role)}>
                    {userData.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant={userData.status === 'active' ? 'secondary' : 'outline'}>
                    {userData.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{userData.email}</span>
                  <span>•</span>
                  <span>Last login: {format(userData.lastLogin, 'MMM dd, HH:mm')}</span>
                  <span>•</span>
                  <span>Joined: {format(userData.createdAt, 'MMM dd, yyyy')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Logs */}
      <Card className="p-6 bg-card border-border mb-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Audit Logs</h2>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border text-sm"
            >
              <div className="flex-1">
                <span className="font-medium text-foreground">{log.userName}</span>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="text-muted-foreground">{log.action.replace('_', ' ')}</span>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="text-muted-foreground text-xs">{log.details}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(log.timestamp, 'MMM dd, HH:mm:ss')}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* System Configuration */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">System Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Settings className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">General Settings</p>
              <p className="text-xs text-muted-foreground">Configure system preferences</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Database className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Database Management</p>
              <p className="text-xs text-muted-foreground">Manage data and backups</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Shield className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Security Settings</p>
              <p className="text-xs text-muted-foreground">Configure security policies</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Users className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Role Management</p>
              <p className="text-xs text-muted-foreground">Manage user roles and permissions</p>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
