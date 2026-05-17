import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MoodEntry {
  time: string;
  mood: number;
  emoji: string;
  id: string;
}

interface AnalyticsSectionProps {
  moodHistory: MoodEntry[];
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export function AnalyticsSection({
  moodHistory,
  completedTasks,
  pendingTasks,
  overdueTasks,
}: AnalyticsSectionProps) {
  const taskData = [
    { category: 'Completed', count: completedTasks, color: '#10B981', fill: '#10B981' },
    { category: 'Pending', count: pendingTasks, color: '#FBBF24', fill: '#FBBF24' },
    { category: 'Overdue', count: overdueTasks, color: '#EF4444', fill: '#EF4444' },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      {/* Mood & Focus Analysis */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-6">Mood & Focus Analysis</h3>
        {moodHistory.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No mood data yet. Complete an AI analysis to start tracking.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                  }}
                  labelStyle={{ color: '#E5E7EB' }}
                  itemStyle={{ color: '#22D3EE' }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="url(#moodGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 6, strokeWidth: 2, stroke: '#1E40AF' }}
                  activeDot={{ r: 8, stroke: '#60A5FA', strokeWidth: 2 }}
                  animationDuration={1000}
                />
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-4 pt-4 border-t border-white/10">
              {moodHistory.slice(-5).map((item) => (
                <div key={item.id} className="text-center">
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Task Completion Stats */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-6">Task Completion Stats</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={taskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="category" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
              }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Bar dataKey="count" radius={[12, 12, 0, 0]} animationDuration={800}>
              {taskData.map((entry) => (
                <Cell key={`cell-${entry.category}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          {taskData.map((item, i) => (
            <div key={i} className="text-center">
              <div
                className="text-2xl font-bold transition-all duration-500"
                style={{ color: item.color }}
              >
                {item.count}
              </div>
              <div className="text-xs text-gray-400 mt-1">{item.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}