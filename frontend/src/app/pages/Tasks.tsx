import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { TaskSection } from "../components/TaskSection";
import { CheckCircle2, Trash2, AlertCircle } from "lucide-react";

interface Task {
  id?: number;
  _id?: string;
  text: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?._id) return;

      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${user._id}`);
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : data.tasks || []);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };

    loadTasks();
  }, []);

  // Add task
  const addTask = async (text: string, priority: string, deadline: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    try {
      const res = await fetch("http://localhost:5000/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          text,
          priority,
          deadline
        })
      });

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  // Toggle task
  const toggleTask = (id: number | string) => {
    setTasks((prev) =>
      prev.map((t) =>
        (t._id === id || t.id === id)
          ? { ...t, completed: !t.completed }
          : t
      )
    );
  };

  // Delete task
  const deleteTask = async (id: string | number) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${user._id}/task/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Tasks</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold mt-2">{tasks.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active</p>
                  <p className="text-2xl font-bold mt-2 text-yellow-400">{activeCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400 opacity-50" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold mt-2 text-green-400">{completedCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6 bg-white/5 border border-white/10 rounded-xl p-2">
            {(["all", "active", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filter === tab
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Add Task Section */}
          <div className="mb-8">
            <TaskSection
              tasks={filteredTasks}
              onToggleTask={toggleTask}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}