import { Sparkles, Loader2 } from "lucide-react";

interface AIAnalysisCardProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  inputText: string;
  setInputText: (text: string) => void;
}

export function AIAnalysisCard({
  onAnalyze,
  isAnalyzing,
  inputText,
  setInputText
}: AIAnalysisCardProps) {

  const handleAnalyze = () => {
    if (inputText.trim()) {
      onAnalyze(inputText);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-6">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">AI Emotional Analysis</h2>
          <p className="text-sm text-gray-400">Describe your day</p>
        </div>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Describe your day..."
        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
      />

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !inputText.trim()}
        className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white flex items-center gap-2 disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyze My Mood
          </>
        )}
      </button>
    </div>
  );
}