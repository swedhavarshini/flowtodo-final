import { Battery, TrendingUp, Loader2 } from 'lucide-react';

interface StatusCardsProps {
  moodData: {
    mood: string;
    emoji: string;
    energy: string;
    capacity: number;
    suggestion: string;
  } | null;
  isAnalyzing: boolean;
}

export function StatusCards({ moodData, isAnalyzing }: StatusCardsProps) {
  if (isAnalyzing) {
    return (
      <div className="flex items-center gap-6 mb-8">
        <div className="flex gap-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl"
            >
              <div className="flex items-center justify-center h-20">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl rounded-2xl p-5 border border-blue-400/20 shadow-xl">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-cyan-300 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!moodData) {
    return (
      <div className="flex items-center gap-6 mb-8">
        <div className="flex gap-4 flex-1">
          {['Current Mood', 'Energy', 'Work Capacity'].map((label) => (
            <div
              key={label}
              className="flex-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl"
            >
              <div className="text-sm text-gray-400 mb-2">{label}</div>
              <div className="text-gray-500 text-sm">No data yet</div>
            </div>
          ))}
        </div>
        <div className="w-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl rounded-2xl p-5 border border-blue-400/20 shadow-xl">
          <div className="text-sm text-cyan-300 font-medium">💡 AI Suggestion</div>
          <p className="text-sm text-gray-400 mt-2">
            Describe your mood to get personalized insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 mb-8 animate-fade-in">
      <div className="flex gap-4 flex-1">
        {/* Current Mood */}
        <div className="flex-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="text-sm text-gray-400 mb-2">Current Mood</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{moodData.emoji}</span>
            <span className="text-lg font-semibold text-white">{moodData.mood}</span>
          </div>
        </div>

        {/* Energy */}
        <div className="flex-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <div className="text-sm text-gray-400 mb-2">Energy</div>
          <div className="flex items-center gap-2">
            <Battery
              className={`w-6 h-6 ${
                moodData.energy === 'High'
                  ? 'text-green-400'
                  : moodData.energy === 'Medium'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            />
            <span className="text-lg font-semibold text-white">{moodData.energy}</span>
          </div>
        </div>

        {/* Work Capacity */}
        <div className="flex-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
          <div className="text-sm text-gray-400 mb-2">Work Capacity</div>
          <div className="flex items-center gap-2">
            <TrendingUp
              className={`w-6 h-6 ${
                moodData.capacity >= 70
                  ? 'text-green-400'
                  : moodData.capacity >= 40
                  ? 'text-yellow-400'
                  : 'text-orange-400'
              }`}
            />
            <span className="text-lg font-semibold text-white">{moodData.capacity}%</span>
          </div>
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                moodData.capacity >= 70
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                  : moodData.capacity >= 40
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  : 'bg-gradient-to-r from-orange-400 to-red-400'
              }`}
              style={{ width: `${moodData.capacity}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Suggestion */}
      <div className="w-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl rounded-2xl p-5 border border-blue-400/20 shadow-xl">
        <div className="text-sm text-cyan-300 font-medium">💡 AI Suggestion</div>
        <p className="text-sm text-gray-300 mt-2">{moodData.suggestion}</p>
      </div>
    </div>
  );
}
