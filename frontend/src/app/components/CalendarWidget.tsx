import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarWidget() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 6; // March 2026 starts on Sunday (0-indexed, so 6 = Saturday for padding)
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);
  const currentDay = 28;

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">March 2026</h3>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map((day) => (
          <button
            key={day}
            className={`aspect-square rounded-xl flex items-center justify-center text-sm transition-all duration-300 ${
              day === currentDay
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
