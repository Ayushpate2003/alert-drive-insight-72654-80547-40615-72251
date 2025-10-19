import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`bg-primary text-white shadow-md sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-xl shadow-primary/30 backdrop-blur-md bg-primary/95' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-3">
        <div className="flex justify-between items-center h-16">
          {/* Brand Section */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 group"
            onClick={handleBrandClick}
          >
            <Shield className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Safe</span>
              <span className="text-accent">Yatra</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 group ${
                    isActive 
                      ? 'bg-white/10' 
                      : 'hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent animate-fade-in" />
                    )}
                    {!isActive && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Section - Login/User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="text-white hover:bg-transparent hover:underline underline-offset-4 transition-all duration-200"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg px-6 hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Button>
              </>
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
      <div className={`md:hidden border-t border-white/20 bg-primary/98 backdrop-blur-md overflow-hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
      }`}>
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ 
                animationDelay: `${index * 50}ms`,
                animation: isMobileMenuOpen ? 'fade-in 0.3s ease-out forwards' : 'none'
              }}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 border-l-4 border-accent shadow-md' 
                    : 'hover:bg-white/10 hover:translate-x-1'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
            
          {/* Mobile Login/User Section */}
          <div className="pt-4 border-t border-white/20 animate-fade-in">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm font-medium opacity-80">
                  {user.name}
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-md text-sm hover:bg-white/10 transition-all hover:translate-x-1"
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-md text-sm hover:bg-white/10 transition-all hover:translate-x-1"
                >
                  Settings
                </NavLink>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Logout functionality will be handled by UserMenu
                  }}
                  className="block w-full text-left px-4 py-2 rounded-md text-sm hover:bg-white/10 transition-all hover:translate-x-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/signup');
                  }}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
