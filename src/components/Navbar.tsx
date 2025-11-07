import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  Home,
  Info,
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  User,
  Users,
  BarChart3,
  FileText,
  Settings,
  Activity,
  Zap,
  Camera,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";

interface NavLinkItem {
  name: string;
  path: string;
  icon?: any;
}

const navLinksByRole: Record<string, NavLinkItem[]> = {
  driver: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Trips", path: "/trips", icon: MapPin },
    { name: "Alerts", path: "/alerts", icon: AlertTriangle },
    { name: "Profile", path: "/profile", icon: User },
  ],
  fleet_manager: [
    { name: "Dashboard", path: "/fleet-dashboard", icon: LayoutDashboard },
    { name: "Drivers", path: "/drivers", icon: Users },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Reports", path: "/reports", icon: FileText },
  ],
  admin: [
    { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users },
    { name: "System Logs", path: "/logs", icon: Activity },
    { name: "Settings", path: "/settings", icon: Settings },
  ],
};

const publicLinks = [
  { name: "About", path: "/about", icon: Info },
  { name: "DashCam", path: "#dashcam", icon: Camera },
  { name: "Roles", path: "#roles", icon: Users },
  { name: "Features", path: "#features", icon: Zap },
  { name: "Dashboard Preview", path: "#dashboard-preview", icon: BarChart3 },
  { name: "How it Works", path: "#how-it-works", icon: Settings },
];

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const smoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(targetId.replace("#", ""));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks =
    isAuthenticated && user?.role
      ? navLinksByRole[user.role] || []
      : publicLinks;

  const handleBrandClick = () => {
    if (isAuthenticated && user?.role) {
      if (user.role === "driver") navigate("/dashboard");
      else if (user.role === "fleet_manager") navigate("/fleet-dashboard");
      else if (user.role === "admin") navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    if (logout) {
      logout();
    }
    navigate("/");
  };

  return (
    <>
      <style>{`
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @media (max-width: 640px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>

      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "shadow-xl shadow-cyan-500/20 backdrop-blur-xl bg-black/80"
            : "shadow-lg bg-black/60 backdrop-blur-md"
        }`}
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(6, 182, 212, 0.3)"
            : "1px solid rgba(6, 182, 212, 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Section */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              onClick={handleBrandClick}
              aria-label="Go to home"
            >
              <img
                src="/Gemini_Generated_Image_q390vgq390vgq390-removebg-preview (Edited).png"
                alt="Logo"
                className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300"
                width="32"
                height="32"
              />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Safe</span>
                <span className="text-cyan-400">Yatra</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  {link.path.startsWith("#") ? (
                    <a
                      href={link.path}
                      onClick={(e) => smoothScroll(e, link.path)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      aria-label={link.name}
                    >
                      {link.icon && <link.icon className="w-4 h-4" aria-hidden="true" />}
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "text-cyan-400"
                            : "text-gray-300 hover:text-white"
                        }`
                      }
                      aria-label={link.name}
                    >
                      {link.icon && <link.icon className="w-4 h-4" aria-hidden="true" />}
                      <span>{link.name}</span>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm min-w-[100px]"
                    onClick={() => navigate("/login")}
                    aria-label="Sign in"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="text-sm bg-cyan-600 hover:bg-cyan-700 min-w-[120px]"
                    onClick={() => navigate("/signup")}
                    aria-label="Get started"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 bg-black/95 backdrop-blur-lg">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group">
                {link.path.startsWith("#") ? (
                  <a
                    href={link.path}
                    onClick={(e) => {
                      smoothScroll(e, link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    aria-label={link.name}
                    style={{ color: "hsl(228, 100%, 94%)" }}
                  >
                    {link.icon && <link.icon className="w-5 h-5" />}
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    to={link.path}
                    end
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? "bg-cyan-500/25 border-l-4 border-cyan-500 shadow-lg shadow-cyan-500/30"
                          : "hover:bg-cyan-500/15 hover:translate-x-2"
                      }`
                    }
                    style={({ isActive }) => ({
                      color: isActive
                        ? "hsl(199, 93%, 59%)"
                        : "hsl(228, 100%, 94%)",
                      textShadow: isActive
                        ? "0 0 10px hsl(199, 93%, 59%)"
                        : "none",
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {link.icon && (
                          <link.icon
                            className="w-5 h-5 transition-all duration-300"
                            style={{
                              color: isActive
                                ? "hsl(199, 93%, 59%)"
                                : "hsl(228, 100%, 94%)",
                            }}
                          />
                        )}
                        <span className="ml-2">{link.name}</span>
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            ))}

            {/* Mobile Login/User Section */}
            <div
              className="pt-4 border-t animate-fade-in"
              style={{ borderColor: "rgba(6, 182, 212, 0.2)" }}
            >
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div
                    className="px-4 py-2 text-sm font-medium opacity-80"
                    style={{ color: "hsl(228, 100%, 94%)" }}
                  >
                    {user.name}
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm hover:bg-cyan-500/10 transition-all hover:translate-x-1"
                    style={{ color: "hsl(228, 100%, 94%)" }}
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm hover:bg-cyan-500/10 transition-all hover:translate-x-1"
                    style={{ color: "hsl(228, 100%, 94%)" }}
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 rounded-md text-sm hover:bg-cyan-500/10 transition-all hover:translate-x-1"
                    style={{ color: "hsl(228, 100%, 94%)" }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    variant="ghost"
                    className="w-full hover:bg-cyan-500/10"
                    style={{ color: "hsl(228, 100%, 94%)" }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/signup");
                    }}
                    className="w-full"
                    style={{
                      backgroundColor: "hsl(199, 93%, 59%)",
                      color: "hsl(218, 64%, 10%)",
                      boxShadow: "0 0 20px hsl(199, 93%, 59%, 0.5)",
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
