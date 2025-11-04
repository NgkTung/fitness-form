import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  NotebookPen,
  User,
  Settings,
  X,
  Dumbbell,
  LogOut,
} from "lucide-react";
import Cookies from "js-cookie";

type Props = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Plans", path: "/plans", icon: NotebookPen },
  { name: "Exercises", path: "/exercises", icon: Dumbbell },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ open, onClose }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("key");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-md border-r border-blue-100 shadow-lg transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-0 lg:w-96 flex flex-col`}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-blue-100 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">FitForm</h1>
          <button
            aria-label="Close sidebar"
            className="lg:hidden p-2 rounded-lg border border-blue-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-xl transition font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-2 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
