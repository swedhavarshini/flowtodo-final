import { Plus, Heart, Trash2 } from "lucide-react";
import { useState } from "react";

// ✅ SAFE DATE PARSE
const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
};

// ✅ FORMAT DATE (FIXED)
const formatDate = (dateStr: string) => {
  if (!dateStr) return "No deadline";

  const date = parseLocalDate(dateStr);
  if (!date) return "No deadline";

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";

  const day = date.getDate();
  const month = date.toLocaleString("en-IN", { month: "short" });

  return `${day} ${month}`;
};

// ✅ COLOR BASED ON DEADLINE
const getColor = (dateStr: string) => {
  if (!dateStr) return "text-gray-400";

  const date = parseLocalDate(dateStr);
  if (!date) return "text-gray-400";

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "text-red-400";     // 🔴 Today
  if (diff === 1) return "text-yellow-400";  // 🟡 Tomorrow
  return "text-gray-400";                    // ⚪ Later
};

interface Task {
  id?: number;
  _id?: string;
  text: string;
  priority: string;
  deadline: string;
  completed: boolean;
  favorite?: boolean;
}

interface TaskSectionProps {
  tasks: Task[];
  onToggleTask: (id: number | string) => void;
  onAddTask: (text: string, priority: string, deadline: string) => void;
  onDeleteTask: (id: number | string) => void;
}

export function TaskSection({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask
}: TaskSectionProps) {

  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState(new Date().toLocaleString("en-US", { month: "short" }).toLowerCase());
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const handleAddTask = () => {
    if (!taskText.trim() || !day.trim()) return;

    const dayNum = Number(day);
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    const monthIndex = months.indexOf(month.toLowerCase());
    if (isNaN(dayNum) || monthIndex === -1 || dayNum < 1 || dayNum > 31) return;

    const year = new Date().getFullYear();
    const deadlineDate = new Date(year, monthIndex, dayNum);
    if (deadlineDate.getDate() !== dayNum || deadlineDate.getMonth() !== monthIndex) return;

    const deadline = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    onAddTask(taskText, priority, deadline);

    setTaskText("");
    setDay("");
    setMonth(new Date().toLocaleString("en-US", { month: "short" }).toLowerCase());
    setPriority("Medium");
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const displayedTasks = activeTab === "pending" ? pendingTasks : completedTasks;

  return (
    <div className="space-y-6">

      {/* ADD TASK */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-4">Add New Task</h3>

        <div className="flex gap-3 items-center">

          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter your task..."
            className="flex-1 bg-[#1E293B] p-3 rounded-xl text-white"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-[#1E293B] p-3 rounded-xl text-white"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="Day"
            min="1"
            max="31"
            className="w-20 bg-[#1E293B] p-3 rounded-xl text-white"
          />

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-[#1E293B] p-3 rounded-xl text-white"
          >
            <option value="jan">Jan</option>
            <option value="feb">Feb</option>
            <option value="mar">Mar</option>
            <option value="apr">Apr</option>
            <option value="may">May</option>
            <option value="jun">Jun</option>
            <option value="jul">Jul</option>
            <option value="aug">Aug</option>
            <option value="sep">Sep</option>
            <option value="oct">Oct</option>
            <option value="nov">Nov</option>
            <option value="dec">Dec</option>
          </select>

          <button
            onClick={handleAddTask}
            className="px-4 py-3 bg-blue-500 rounded-xl text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>

        </div>
      </div>

      {/* TASK LIST */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Task List</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-2 rounded-xl text-sm ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-[#1E293B] text-gray-300"}`}
            >
              Pending ({pendingTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-2 rounded-xl text-sm ${activeTab === "completed" ? "bg-blue-500 text-white" : "bg-[#1E293B] text-gray-300"}`}
            >
              Completed ({completedTasks.length})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {displayedTasks.length === 0 ? (
            <p className="text-gray-500">No {activeTab} tasks</p>
          ) : (
            displayedTasks.map((task) => (
              <div
                key={task._id || task.id}
                className="bg-[#1E293B] p-4 rounded-xl flex items-center gap-3"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task._id || task.id!)}
                />

                {/* Task Info */}
                <div className="flex-1">
                  <p className="text-white">{task.text}</p>

                  <p className={`text-xs ${getColor(task.deadline)}`}>
                    {task.priority} • {formatDate(task.deadline)}
                  </p>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-3">

                  {task.favorite && (
                    <Heart className="text-red-400 w-5 h-5 fill-red-400" />
                  )}

                  {/* ✅ DELETE BUTTON */}
                  <Trash2
                    onClick={() => onDeleteTask(task._id || task.id!)}
                    className="w-5 h-5 text-red-400 cursor-pointer hover:scale-110 transition"
                  />

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}