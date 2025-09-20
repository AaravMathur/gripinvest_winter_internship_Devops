// grip-invest-frontend/src/pages/Auth/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type:'error', message:string} | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await api.post("/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user_id", res.data.id);
        navigate("/dashboard");
      } else {
        setFeedback({type:'error', message:'Invalid credentials'});
      }
    } catch (err: any) {
      console.error(err.response || err);
      setFeedback({type:'error', message: err.response?.data?.message || 'Login failed. Try again.'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-600 to-purple-700 px-4 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-bounce-slow"
            style={{
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
            }}
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-12 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col gap-6 animate-fadeInUp"
      >
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 animate-slideIn">Welcome Back</h2>
          <p className="text-gray-500 mt-2 animate-slideIn delay-150">Login to continue your journey 🚀</p>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="p-3 rounded-lg text-center font-semibold bg-red-100 text-red-700 animate-shake">
            {feedback.message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                       transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                       transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:-translate-y-1
                     duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-blue-600 hover:underline cursor-pointer">
            Sign Up
          </span>
        </p>

        <div className="mt-4 text-center text-gray-400 text-xs">
          © 2025 Grip Invest. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default Login;
