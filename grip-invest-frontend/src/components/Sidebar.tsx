import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Investments", path: "/investments" },
    { name: "Transactions", path: "/transactions" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-gray-100 h-screen p-6 shadow-lg overflow-y-auto custom-scrollbar">
      <h2 className="text-lg font-bold mb-6 tracking-wide">Menu</h2>
      <ul className="space-y-3">
        {links.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded-lg transition-transform transform ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-white hover:shadow-md hover:scale-105"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
