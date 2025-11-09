import { NavLink, useLocation } from "react-router-dom";
import { MapPin, AlertTriangle, Camera, User } from "lucide-react";

export default function DriverNavBar() {
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname.includes('/trips')) return 'trips';
    if (location.pathname.includes('/alerts')) return 'alerts';
    if (location.pathname.includes('/dashcam')) return 'dashcam';
    if (location.pathname.includes('/profile')) return 'profile';
    return 'trips'; // default
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0B0C10] border-t border-gray-700 z-50 shadow-lg shadow-cyan-500/30">
      <div className="flex justify-center items-center space-x-8 py-3 px-4">
        <NavLink
          to="/dashboard/driver/trips"
          className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            activeTab === 'trips'
              ? "bg-[#00B4D8] text-black shadow-lg shadow-cyan-500/50"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          <MapPin className="text-xl" />
          <span className="text-sm mt-1 font-medium">Trips</span>
        </NavLink>

        <NavLink
          to="/dashboard/driver/alerts"
          className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            activeTab === 'alerts'
              ? "bg-[#00B4D8] text-black shadow-lg shadow-cyan-500/50"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          <AlertTriangle className="text-xl" />
          <span className="text-sm mt-1 font-medium">Alerts</span>
        </NavLink>

        <NavLink
          to="/dashboard/driver/dashcam"
          className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            activeTab === 'dashcam'
              ? "bg-[#00B4D8] text-black shadow-lg shadow-cyan-500/50"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          <Camera className="text-xl" />
          <span className="text-sm mt-1 font-medium">DashCam</span>
        </NavLink>

        <NavLink
          to="/dashboard/driver/profile"
          className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            activeTab === 'profile'
              ? "bg-[#00B4D8] text-black shadow-lg shadow-cyan-500/50"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          <User className="text-xl" />
          <span className="text-sm mt-1 font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
