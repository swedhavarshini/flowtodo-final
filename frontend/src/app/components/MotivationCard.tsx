import { Sparkles } from 'lucide-react';

export function MotivationCard() {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-xl shadow-purple-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Hi Starshine! 👋</h3>
      </div>
      <p className="text-gray-200 mb-4">
        Keep up the great work! 👍
      </p>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="text-sm font-medium text-cyan-300 mb-2">💡 Focus Tip:</div>
        <p className="text-sm text-gray-200">
          Take a deep breath and stretch 🌿
        </p>
      </div>
    </div>
  );
}
