import { NavLink } from 'react-router-dom';
import { Users, Activity, Settings, Shield } from 'lucide-react';

const AdminNavBar = () => {
  const navItems = [
    {
      path: '/media/ayush/Hack/alert-drive-insight-72654-80547-40615-72251/src/pages/AdminUsers.tsx',
      label: 'Users',
      icon: Users
    },
    {
      path: '/dashboard/logs',
      label: 'Logs',
      icon: Activity
    },
    {
      path: '/dashboard/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0B0C10] border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'bg-[#00B4D8] text-black shadow-lg shadow-[#00B4D8]/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminNavBar;
