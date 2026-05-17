import { useState, useEffect } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState(""); // controls view
  const [routine, setRoutine] = useState("");
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    setRoutine(storedUser?.routine || "");
  }, []);

  const handleSaveRoutine = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          routine
        })
      });

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));

      alert("Routine saved!");
      setActiveTab(""); // go back
    } catch (err) {
      console.error(err);
      alert("Error saving routine");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // go to login
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#121826] p-6 text-white">
      <h2 className="text-2xl mb-6">Settings</h2>

      {/* 🔹 MAIN SETTINGS LIST */}
      {activeTab === "" && (
        <div className="space-y-4">

          {/* Notification */}
          <div className="flex justify-between items-center bg-white/10 p-4 rounded">
            <span>Notification</span>
            <input
              type="checkbox"
              checked={notification}
              onChange={() => setNotification(!notification)}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex justify-between items-center bg-white/10 p-4 rounded">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>

          {/* Daily Routine */}
          <div
            className="bg-white/10 p-4 rounded cursor-pointer hover:bg-white/20"
            onClick={() => setActiveTab("routine")}
          >
            Daily Routine
          </div>

          {/* Logout */}
          <div
            className="bg-red-500/20 p-4 rounded cursor-pointer hover:bg-red-500/40"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}

      {/* 🔹 ROUTINE EDIT SCREEN */}
      {activeTab === "routine" && (
        <div>
          <button
            className="mb-4 text-blue-400"
            onClick={() => setActiveTab("")}
          >
            ← Back
          </button>

          <h3 className="text-xl mb-4">Edit Daily Routine</h3>

          <textarea
  className="w-full p-3 h-32 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
  value={routine}
  onChange={(e) => setRoutine(e.target.value)}
  placeholder="Describe your daily routine..."
/>

          <button
            className="bg-purple-500 px-4 py-2 mt-4 rounded"
            onClick={handleSaveRoutine}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}