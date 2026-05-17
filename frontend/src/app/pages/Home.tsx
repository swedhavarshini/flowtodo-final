import { useNavigate } from "react-router-dom";
import { Brain, Zap, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#121826] to-[#0B0F1A] text-white overflow-hidden">
      
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">BalanceAI</h1>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 py-20 flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-6 relative z-10">
          AI-Powered <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Productivity</span>
        </h2>
        
        <p className="text-xl text-gray-400 max-w-2xl mb-8 relative z-10">
          BalanceAI uses advanced AI to analyze your mood, energy levels, and work capacity to create personalized task schedules that maximize your productivity.
        </p>
        
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all relative z-10 mb-12"
        >
          Get Started Free
        </button>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-16 relative z-10">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Analysis"
            description="Smart mood and energy detection"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Work Capacity"
            description="Personalized workload suggestions"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Analytics"
            description="Track your progress over time"
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="Smart Scheduling"
            description="AI-driven task prioritization"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-20 px-6 py-8 text-center text-gray-400">
        <p>© 2026 BalanceAI. Your AI Productivity Assistant.</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
