import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Shield, Users, Database, Settings, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const mockUsers = [
    { id: 1, name: 'John Driver', email: 'driver@test.com', role: 'driver', status: 'active' },
    { id: 2, name: 'Sarah Manager', email: 'manager@test.com', role: 'fleet_manager', status: 'active' },
    { id: 3, name: 'Mike Admin', email: 'admin2@test.com', role: 'admin', status: 'active' },
  ];

  const systemStats = [
    { label: 'Total Users', value: '156', icon: Users },
    { label: 'Active Sessions', value: '42', icon: Shield },
    { label: 'Database Size', value: '2.4 GB', icon: Database },
    { label: 'System Health', value: '98%', icon: Settings },
  ];

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
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* User Management */}
      <Card className="p-6 bg-card border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <Button size="sm">Add New User</Button>
        </div>
        <div className="space-y-3">
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <Badge variant="secondary">{user.role.replace('_', ' ').toUpperCase()}</Badge>
                  <Badge variant="outline">{user.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
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
