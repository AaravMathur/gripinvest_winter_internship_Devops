import React from "react";

const Navbar: React.FC = () => (
  <nav className="h-14 bg-blue-600 text-white flex items-center justify-between px-6 shadow-md">
    <h1 className="text-xl font-bold">Grip Invest</h1>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
    >
      Logout
    </button>
  </nav>
);

export default Navbar;
