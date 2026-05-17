import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Settings,
  Brain,
  Home,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#0B0F1A] to-[#121826] border-r border-white/10 p-6 flex flex-col">

      {/* LOGO */}
      <div 
        className="flex items-center gap-3 mb-12 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate("/")}
      >

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Brain className="w-6 h-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            BalanceAI
          </h1>

          <p className="text-xs text-gray-400">
            Productivity Assistant
          </p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-3">

        {menuItems.map((item) => {

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-2xl
                transition-all duration-300
                ${isActive 
                  ? "bg-gradient-to-r from-blue-500/30 to-purple-600/30 text-white border border-blue-500/30" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <Icon className="w-5 h-5" />

              <span className="font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* USER INFO & LOGOUT */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        {user && (
          <div className="px-4 py-2 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-4 px-4 py-3 rounded-2xl
            text-gray-400 hover:text-red-400 hover:bg-red-500/10
            transition-all duration-300
          "
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium tracking-wide">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}