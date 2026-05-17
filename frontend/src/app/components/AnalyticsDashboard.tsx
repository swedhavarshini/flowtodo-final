import { useState, useEffect } from "react";
import { Calendar, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

interface Task {
  id?: number;
  _id?: string;
  text: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

interface AnalyticsDashboardProps {
  tasks: Task[];
  accuracy?: number;
}

export function AnalyticsDashboard({ tasks, accuracy = 0 }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    highPriorityTasks: 0,
    mediumPriorityTasks: 0,
    lowPriorityTasks: 0
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => {
      const deadline = new Date(t.deadline);
      deadline.setHours(0, 0, 0, 0);
      return !t.completed && deadline < today;
    }).length;

    const highPriority = tasks.filter(t => t.priority?.toLowerCase() === "high").length;
    const mediumPriority = tasks.filter(t => t.priority?.toLowerCase() === "medium").length;
    const lowPriority = tasks.filter(t => t.priority?.toLowerCase() === "low").length;

    setStats({
      totalTasks: tasks.length,
      completedTasks: completed,
      overdueTasks: overdue,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      highPriorityTasks: highPriority,
      mediumPriorityTasks: mediumPriority,
      lowPriorityTasks: lowPriority
    });
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Completed"
          value={stats.completedTasks}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Overdue"
          value={stats.overdueTasks}
          icon={<AlertCircle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={<Calendar className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-white">Completion Progress</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray={`${(stats.completionRate / 100) * 314} 314`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.3s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{stats.completionRate}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-white">Priority Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">High</span>
              </div>
              <span className="font-semibold text-white">{stats.highPriorityTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300">Medium</span>
              </div>
              <span className="font-semibold text-white">{stats.mediumPriorityTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Low</span>
              </div>
              <span className="font-semibold text-white">{stats.lowPriorityTasks}</span>
            </div>
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-white">AI Accuracy</h3>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold text-blue-400 mb-2">{accuracy.toFixed(1)}%</div>
            <p className="text-sm text-gray-400 text-center">
              AI prediction accuracy based on your feedback
            </p>
            <div className="w-full bg-[#1e293b] rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Status Overview */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4 text-white">Task Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.completedTasks}</div>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalTasks - stats.completedTasks - stats.overdueTasks}</div>
            <p className="text-xs text-gray-400 mt-1">In Progress</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{stats.overdueTasks}</div>
            <p className="text-xs text-gray-400 mt-1">Overdue</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalTasks}</div>
            <p className="text-xs text-gray-400 mt-1">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    red: "from-red-500/20 to-red-600/10 border-red-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30"
  };

  const iconColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    red: "text-red-400",
    purple: "text-purple-400"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} border rounded-2xl p-6 hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`${iconColors[color as keyof typeof iconColors]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
