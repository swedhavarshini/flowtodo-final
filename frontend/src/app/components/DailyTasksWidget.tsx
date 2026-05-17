import { Clock, Check } from 'lucide-react';

export function DailyTasksWidget() {
  const tasks = [
    { id: 1, text: 'Review team presentation', time: '2:00 PM', completed: false },
    { id: 2, text: 'Buy groceries on the way home', time: '', completed: true },
  ];

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                task.completed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-transparent'
                  : 'border-gray-400'
              }`}>
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.text}
                </p>
                {task.time && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
