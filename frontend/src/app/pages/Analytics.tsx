import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";

interface Task {
  id?: number;
  _id?: string;
  text: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

export default function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?._id) return;

      try {
        // Load tasks
        const tasksRes = await fetch(`http://localhost:5000/api/tasks/${user._id}`);
        const tasksData = await tasksRes.json();
        setTasks(Array.isArray(tasksData) ? tasksData : tasksData.tasks || []);

        // Load accuracy
        const accuracyRes = await fetch("http://localhost:5000/api/feedback/accuracy");
        const accuracyData = await accuracyRes.json();
        setAccuracy(accuracyData.accuracy || 0);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Analytics & Progress</h1>
          <AnalyticsDashboard tasks={tasks} accuracy={accuracy} />
        </div>
      </div>
    </div>
  );
}