import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUser, setAutoLoginEnabled } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim() 
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(
          data.message || data.msg || data.error || "Login failed. Please check your credentials."
        );
        return;
      }

      // ✅ Store user
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ Handle auto-login
      if (rememberMe) {
        setAutoLoginEnabled(true);
        localStorage.setItem("autoLoginEnabled", JSON.stringify(true));
      } else {
        setAutoLoginEnabled(false);
        localStorage.setItem("autoLoginEnabled", JSON.stringify(false));
      }

      setUser(data);

      // ✅ Check routine
      if (!data.routine) {
        navigate("/routine");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Connection failed. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#121826] text-white">
      
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold">BalanceAI</h1>
        </div>

        <h2 className="text-3xl mb-2 font-semibold text-center">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Sign in to your account to continue</p>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              className="w-full p-3 rounded-lg bg-[#1E293B] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              type="email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                className="w-full p-3 rounded-lg bg-[#1E293B] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#1E293B] border-gray-600 cursor-pointer"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer">
              Remember me & auto-login next time
            </label>
          </div>
        </div>

        {/* Login Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg mt-6 shadow-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:text-blue-300 font-semibold"
            onClick={() => !isLoading && navigate("/signup")}
          >
            Sign up
          </span>
        </p>

        {/* Debug Info */}
        <div className="mt-6 p-3 bg-gray-800/50 rounded text-xs text-gray-400">
          <p>Backend: http://localhost:5000</p>
          <p>Endpoint: /api/auth/login</p>
        </div>
      </div>
    </div>
  );
}