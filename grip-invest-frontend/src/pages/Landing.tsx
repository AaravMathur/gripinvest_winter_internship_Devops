import React from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center w-96">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Grip Invest</h1>
        <p className="text-gray-600 mb-8">Manage your investments, track your portfolio, and grow your wealth.</p>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Landing;
