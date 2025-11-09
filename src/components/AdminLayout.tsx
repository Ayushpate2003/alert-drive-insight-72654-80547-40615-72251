import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  Shield,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      path: '',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: 'users',
      label: 'Users',
      icon: Users
    },
    {
      path: 'logs',
      label: 'Logs',
      icon: Activity
    },
    {
      path: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col">
      {/* 🔝 Top Navigation */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-[#0B0C10] shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-[#00B4D8]" />
            <div>
              <h1 className="text-[#00B4D8] text-xl font-bold">SafeYatra</h1>
              <span className="text-xs text-gray-400">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ''}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                    isActive
                      ? 'text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin Name and Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#00B4D8]" />
            <span className="text-[#00B4D8] font-semibold">
              Welcome, {user?.name || 'Admin'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet /> {/* Renders the selected admin sub-page */}
      </main>
    </div>
  );
};

export default AdminLayout;
