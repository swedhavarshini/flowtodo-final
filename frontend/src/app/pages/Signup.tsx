import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password: password.trim() 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || data.msg || "Signup failed");
        return;
      }

      alert("Signup successful! Please login");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg("Connection failed. Make sure the backend is running at http://localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSignup();
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

        <h2 className="text-3xl mb-2 font-semibold text-center">Create Account</h2>
        <p className="text-center text-gray-400 mb-8">Join BalanceAI to boost your productivity</p>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm">{errorMsg}</p>
          </div>
        )}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              className="w-full p-3 rounded-lg bg-[#1E293B] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              className="w-full p-3 rounded-lg bg-[#1E293B] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Password */}
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                className="w-full p-3 rounded-lg bg-[#1E293B] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" className="w-4 h-4 rounded bg-[#1E293B] border-gray-600 cursor-pointer" />
            <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">
              I agree to the Terms of Service
            </label>
          </div>
        </div>

        {/* Signup Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg mt-6 shadow-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:text-blue-300 font-semibold"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}