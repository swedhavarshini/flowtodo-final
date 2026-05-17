import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Bell, Lock, Eye, Zap, ToggleRight, ToggleLeft } from "lucide-react";

export default function Settings() {
  const { autoLoginEnabled, setAutoLoginEnabled, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="max-w-2xl space-y-6">
          
          {/* Account Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-400" />
              Account Settings
            </h2>

            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-[#1E293B] rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Email Address</p>
                <p className="text-white font-medium flex items-center justify-between">
                  {user?.email || "Not logged in"}
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Verified</span>
                </p>
              </div>

              {/* Auto-Login */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Auto-Login</p>
                    <p className="text-gray-400 text-sm">Automatically log in on app launch</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoLoginEnabled(!autoLoginEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    autoLoginEnabled ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      autoLoginEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Save Details */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Save Login Details</p>
                    <p className="text-gray-400 text-sm">Keep login credentials for faster access</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    showSensitiveData ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      showSensitiveData ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-400" />
              Notification Settings
            </h2>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Get notified about task updates</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    notificationsEnabled ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      notificationsEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Daily Digest */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div>
                  <p className="text-white font-medium">Daily Digest</p>
                  <p className="text-gray-400 text-sm">Receive daily productivity summary</p>
                </div>
                <button className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors bg-blue-500`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-7`} />
                </button>
              </div>

              {/* AI Suggestions */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div>
                  <p className="text-white font-medium">AI Suggestions</p>
                  <p className="text-gray-400 text-sm">Get personalized AI recommendations</p>
                </div>
                <button className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors bg-blue-500`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-7`} />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-400" />
              Preferences
            </h2>

            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-gray-400 text-sm">Always use dark theme</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    darkMode ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Task Reminders */}
              <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-4 hover:bg-[#253249] transition-colors">
                <div>
                  <p className="text-white font-medium">Task Reminders</p>
                  <p className="text-gray-400 text-sm">Get reminded about upcoming deadlines</p>
                </div>
                <button className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors bg-blue-500`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-7`} />
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
            <p className="text-blue-300 text-sm">
              💡 <span className="font-semibold">Auto-Login Tip:</span> When enabled, your session will be restored automatically on your next visit. Make sure to disable this on shared devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}