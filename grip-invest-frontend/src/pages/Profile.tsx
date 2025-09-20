import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const Profile: React.FC = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    risk_appetite: "moderate",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

          <div className="bg-white p-10 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-transform transform animate-fadeInUp w-full max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500">First Name</h2>
                <p className="text-lg font-medium text-gray-800">
                  {user.first_name || "—"}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-500">Last Name</h2>
                <p className="text-lg font-medium text-gray-800">
                  {user.last_name || "—"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <h2 className="text-sm font-semibold text-gray-500">Email</h2>
                <p className="text-lg font-medium text-gray-800 break-words">
                  {user.email || "—"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <h2 className="text-sm font-semibold text-gray-500">Risk Appetite</h2>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    user.risk_appetite === "low"
                      ? "bg-green-100 text-green-700"
                      : user.risk_appetite === "moderate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.risk_appetite}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
