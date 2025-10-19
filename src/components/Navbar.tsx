import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';

const navLinksByRole = {
  driver: [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Trips', path: '/trips' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Profile', path: '/profile' },
  ],
  fleet_manager: [
    { name: 'Dashboard', path: '/fleet-dashboard' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Reports', path: '/reports' },
  ],
  admin: [
    { name: 'Dashboard', path: '/admin-dashboard' },
    { name: 'Users', path: '/users' },
    { name: 'System Logs', path: '/logs' },
    { name: 'Settings', path: '/settings' },
  ],
};

const publicLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = isAuthenticated && user?.role
    ? navLinksByRole[user.role] || []
    : publicLinks;

  const handleBrandClick = () => {
    if (isAuthenticated && user?.role) {
      if (user.role === 'driver') navigate('/dashboard');
      else if (user.role === 'fleet_manager') navigate('/fleet-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Section */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleBrandClick}
          >
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">SafeYatra</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all hover:opacity-80 pb-1 ${
                    isActive 
                      ? 'border-b-2 border-accent' 
                      : 'border-b-2 border-transparent'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Section - Login/User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                variant="secondary"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary/80 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-primary/80'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Mobile Login/User Section */}
            <div className="pt-4 border-t border-primary-foreground/10">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm font-medium opacity-80">
                    {user.name}
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm hover:bg-primary/80 transition-colors"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm hover:bg-primary/80 transition-colors"
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      // Logout functionality will be handled by UserMenu
                    }}
                    className="block w-full text-left px-4 py-2 rounded-md text-sm hover:bg-primary/80 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
