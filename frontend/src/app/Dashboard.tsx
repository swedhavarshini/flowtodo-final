import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { AIAnalysisCard } from "./components/AIAnalysisCard";
import { StatusCards } from "./components/StatusCards";
import { TaskSection } from "./components/TaskSection";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";

interface Task {
  id?: number;
  _id?: string;
  text: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

export default function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("");
  const [workCapacity, setWorkCapacity] = useState(0);
  const [suggestion, setSuggestion] = useState("");

  const [accuracy, setAccuracy] = useState(0);

  // 🔥 EMOJI
  const mapMoodToEmoji = (moodValue: string) => {
    if (!moodValue) return "😐";
    const m = moodValue.toLowerCase();
    if (m.includes("happy")) return "😊";
    if (m.includes("tired") || m.includes("stressed")) return "😟";
    if (m.includes("energetic")) return "⚡";
    return "🙂";
  };

  const moodData = mood
    ? {
        mood,
        emoji: mapMoodToEmoji(mood),
        energy,
        capacity: workCapacity,
        suggestion
      }
    : null;

  const getScheduleClass = (action: string) => {
    if (action.toLowerCase().includes("do now")) {
      return "bg-red-500/10 border border-red-400 text-red-100";
    }
    if (action.toLowerCase().includes("do later")) {
      return "bg-yellow-500/10 border border-yellow-400 text-yellow-100";
    }
    if (action.toLowerCase().includes("skip")) {
      return "bg-slate-700/80 border border-slate-600 text-slate-100";
    }
    return "bg-[#1E293B] border border-white/10 text-white";
  };

  const sortedSchedule = [...schedule].sort((a, b) => {
    const order = { "do now": 0, "do later": 1, skip: 2 };
    const aKey = a.action.toLowerCase() as keyof typeof order;
    const bKey = b.action.toLowerCase() as keyof typeof order;
    return (order[aKey] ?? 3) - (order[bKey] ?? 3);
  });

  // ✅ AI CALL
  const analyzeMood = async (text: string) => {
  try {
    setIsAnalyzing(true);

    // ✅ FILTER ONLY UNCOMPLETED TASKS
    const pendingTasks = tasks.filter((t) => !t.completed);
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const currentDay = now.toLocaleDateString(undefined, { weekday: "long" });
    const currentDate = now.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

    const res = await fetch("http://localhost:5000/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        tasks: pendingTasks,
        currentTime,
        currentDay,
        currentDate
      })
    });



let normalizedSchedule = [];
const data = await res.json();

console.log("FULL AI RESPONSE:", data);

setMood(data.mood);
setEnergy(data.energy);
setWorkCapacity(data.workCapacity);
setSuggestion(data.suggestion || "");

// ✅ IMPROVED SCHEDULE HANDLING


if (Array.isArray(data.schedule)) {

  normalizedSchedule = data.schedule;

} else if (
  data.schedule &&
  typeof data.schedule === "object"
) {

  normalizedSchedule = Object.values(data.schedule);

}

// ✅ FALLBACK IF AI RETURNS EMPTY
if (
  normalizedSchedule.length === 0 &&
  pendingTasks.length > 0
) {

  normalizedSchedule = pendingTasks.map((task) => ({
    task: task.text,
    priority: task.priority || "Medium",
    action: "Do Later",
    deadline: task.deadline || "",
    reason: "Pending task detected"
  }));
}

console.log("FINAL SCHEDULE:", normalizedSchedule);

setSchedule(normalizedSchedule);

setShowAnalytics(false);

if (Array.isArray(data.schedule)) {

  normalizedSchedule = data.schedule;

} else if (
  data.schedule &&
  typeof data.schedule === "object"
) {

  normalizedSchedule = Object.values(data.schedule);

}

// ✅ FALLBACK IF AI RETURNS EMPTY
if (
  normalizedSchedule.length === 0 &&
  pendingTasks.length > 0
) {

  normalizedSchedule = pendingTasks.map((task) => ({
    task: task.text,
    priority: task.priority || "Medium",
    action: "Do Later",
    deadline: task.deadline || "",
    reason: "Pending task detected"
  }));
}





  } catch (err) {
    console.error(err);
    alert("AI failed");
  } finally {
    setIsAnalyzing(false);
  }
};

  // ✅ FEEDBACK
  const sendFeedback = async (isCorrect: boolean) => {
    try {
      await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: inputText,
          predictedMood: mood,
          predictedEnergy: energy,
          workCapacity,
          correct: isCorrect
        })
      });

      alert("Feedback saved ✅");

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOAD ACCURACY
  useEffect(() => {
    const loadAccuracy = async () => {
      const res = await fetch("http://localhost:5000/api/feedback/accuracy");
      const data = await res.json();
      setAccuracy(data.accuracy || 0);
    };

    loadAccuracy();
  }, []);

  // ✅ LOAD TASKS
  useEffect(() => {
    const loadTasks = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?._id) return;

      const res = await fetch(`http://localhost:5000/api/tasks/${user._id}`);
      const data = await res.json();

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    };

    loadTasks();
  }, []);

  // ✅ ADD TASK
  const addTask = async (text: string, priority: string, deadline: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

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

    // After adding a task, re-run AI analysis so the new task is included in suggestions.
    try {
      const summary = Array.isArray(data)
        ? data.map((t) => `- ${t.text} (priority: ${t.priority || 'Medium'}, deadline: ${t.deadline || 'none'})`).join("\n")
        : "";

      if (inputText && inputText.trim()) {
        await analyzeMood(inputText);
      } else if (summary) {
        await analyzeMood(`Please analyze my current tasks:\n${summary}`);
      }
    } catch (err) {
      console.error("Auto-analyze after add failed:", err);
    }

    return data;
  };

  // ✅ Add a schedule item returned by AI into the user's tasks
  const addScheduleItemToTasks = async (item: any) => {
    const title = item.task || item.title || "Untitled task";
    const priority = item.priority || "Medium";
    // prefer ISO date if provided; otherwise empty string
    const deadline = item.deadline || "";

    try {
      await addTask(title, priority, deadline);
      alert(`Added task: ${title}`);
    } catch (err) {
      console.error("Failed to add AI task:", err);
      alert("Failed to add AI task");
    }
  };
  

  // ✅ TOGGLE (persist to backend)
  const toggleTask = async (id: number | string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?._id) return;

      const res = await fetch(`http://localhost:5000/api/tasks/${user._id}/task/${id}`, {
        method: "PATCH"
      });

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Toggle failed:", err);
      // fallback to local toggle
      setTasks((prev) =>
        prev.map((t) =>
          (t._id === id || t.id === id) ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  // ✅ DELETE
  const deleteTask = async (id: string | number) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const res = await fetch(
      `http://localhost:5000/api/tasks/${user._id}/task/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">

      <Sidebar />

      <div className="flex-1 p-6 overflow-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showAnalytics 
                ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
        </div>

        {showAnalytics && (
          <AnalyticsDashboard tasks={tasks} accuracy={accuracy} />
        )}

        <StatusCards moodData={moodData} isAnalyzing={isAnalyzing} />

        <TaskSection
          tasks={tasks}
          onToggleTask={toggleTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
        />

        {/* ✅ PREDICTED MOOD */}
        {mood && (
          <div className="mt-4 text-cyan-300">
            Predicted mood: {mapMoodToEmoji(mood)} {mood}
          </div>
        )}

        {/* ✅ FEEDBACK UI (FIXED POSITION) */}
        {mood && (
          <div className="mt-4">
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => sendFeedback(true)}
                className="px-4 py-2 bg-green-500 rounded"
              >
                👍 Correct
              </button>

              <button
                onClick={() => sendFeedback(false)}
                className="px-4 py-2 bg-red-500 rounded"
              >
                👎 Wrong
              </button>
            </div>

            <div className="text-cyan-300 text-sm">
              🎯 Accuracy: {accuracy.toFixed(1)}%
            </div>
          </div>
        )}

        <AIAnalysisCard
          onAnalyze={analyzeMood}
          isAnalyzing={isAnalyzing}
          inputText={inputText}
          setInputText={setInputText}
        />

        {/* ✅ AI SCHEDULE */}
        {schedule.length > 0 ? (
          <div className="mt-6 bg-white/5 p-4 rounded-xl">
            <h3 className="text-white mb-3 font-semibold">
              🤖 AI Task Plan
            </h3>

            {sortedSchedule.map((item, i) => (
              <div key={i} className={`mb-2 p-3 rounded-lg ${getScheduleClass(item.action)}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-white font-semibold">{item.task}</p>
                  <span className="text-xs uppercase tracking-wide opacity-80">
                    {item.action}
                  </span>
                </div>
                <p className="text-sm text-gray-200 mt-1">{item.priority}</p>
                <p className="text-xs text-gray-300 mt-2">{item.reason}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => addScheduleItemToTasks(item)}
                    className="px-3 py-1 bg-green-500 rounded text-sm"
                  >
                    Add to Tasks
                  </button>

                  {item.deadline && (
                    <div className="text-xs text-gray-300 px-2 py-1 bg-white/5 rounded">
                      Deadline: {item.deadline}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          mood && (
            <div className="mt-6 p-4 bg-yellow-600/10 rounded-xl text-yellow-200">
              ⚠️ AI did not return a task plan. Add tasks or describe your day in more detail to receive a next-step schedule.
            </div>
          )
        )}

        {suggestion && (
          <div className="mt-6 p-4 bg-purple-600/20 rounded-xl">
            💡 {suggestion}
          </div>
        )}

      </div>
    </div>
  );
}