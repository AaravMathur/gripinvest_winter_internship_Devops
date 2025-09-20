// grip-invest-frontend/src/pages/Auth/Signup.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [riskAppetite, setRiskAppetite] = useState("moderate");
  const [loading, setLoading] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordSuggestion, setPasswordSuggestion] = useState("");

  const navigate = useNavigate();

  // password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      setPasswordSuggestion("");
      return;
    }

    let strength = "Weak";
    let suggestion = "Use at least 8 chars with numbers & symbols.";

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (password.length >= 12 && hasUpper && hasLower && hasNumber && hasSymbol) {
      strength = "Strong";
      suggestion = "Great! Your password looks strong.";
    } else if (
      password.length >= 8 &&
      (hasNumber || hasSymbol) &&
      (hasUpper || hasLower)
    ) {
      strength = "Medium";
      suggestion = "Add more variety: upper/lowercase, numbers, symbols.";
    }

    setPasswordStrength(strength);
    setPasswordSuggestion(suggestion);
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      localStorage.removeItem("token");
      const res = await api.post("/users/signup", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        risk_appetite: riskAppetite,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user_id", res.data.id);

        alert("Signup successful!");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(err.response || err);
      const message = err.response?.data?.message || "Signup failed. Try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // map strength to progress bar
  const getStrengthData = () => {
    switch (passwordStrength) {
      case "Strong":
        return { width: "100%", color: "bg-green-500" };
      case "Medium":
        return { width: "66%", color: "bg-yellow-500" };
      case "Weak":
        return { width: "33%", color: "bg-red-500" };
      default:
        return { width: "0%", color: "bg-transparent" };
    }
  };

  const { width, color } = getStrengthData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-10 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col gap-6 animate-fadeInUp"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 animate-slideIn">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2 animate-slideIn delay-150">
            Join us and start investing smartly 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                       transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                       transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                     transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
          required
        />

        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                       transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
            required
          />

          {/* password strength bar */}
          <div className="w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${color}`}
              style={{ width }}
            ></div>
          </div>

          {password && (
            <p className="text-xs text-gray-600 mt-1">
              <span
                className={`font-semibold ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {passwordStrength}
              </span>{" "}
              - {passwordSuggestion}
            </p>
          )}
        </div>

        <input
          type="password"
          placeholder="Retype Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                     transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
          required
        />

        <select
          value={riskAppetite}
          onChange={(e) => setRiskAppetite(e.target.value)}
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none
                     transition transform duration-200 ease-in-out focus:scale-105 focus:shadow-lg"
        >
          <option value="low">Low Risk</option>
          <option value="moderate">Moderate Risk</option>
          <option value="high">High Risk</option>
        </select>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:-translate-y-1
                     duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>

        <div className="mt-4 text-center text-gray-400 text-xs">
          © 2025 Grip Invest. All rights reserved.
        </div>
      </form>
    </div>
  );
}
