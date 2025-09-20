import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface TransactionLog {
  id: number;
  created_at: string;
  endpoint: string;
  http_method: string;
  status_code: number;
  error_message: string | null;
}

const Transactions: React.FC = () => {
  const [logs, setLogs] = useState<TransactionLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  const mapStatus = (code: number) => {
    if (code >= 200 && code < 300) return "Success";
    if (code >= 400 && code < 500) return "Failed";
    if (code >= 500) return "Server Error";
    return "Unknown";
  };

  const statusColor = (code: number) => {
    if (code >= 200 && code < 300) return "text-green-600";
    if (code >= 400 && code < 500) return "text-red-600";
    if (code >= 500) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="flex bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Transaction Logs</h1>

          <div className="bg-white p-4 rounded-2xl shadow-md overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-2 text-left text-sm font-semibold text-gray-600 min-w-[150px]">
                    Date
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600 min-w-[250px]">
                    Endpoint
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600 min-w-[100px]">
                    Method
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600 min-w-[120px]">
                    Status
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600 min-w-[200px]">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-2 font-medium whitespace-nowrap min-w-[250px]">
                      {log.endpoint}
                    </td>
                    <td className="p-2 whitespace-nowrap min-w-[100px]">{log.http_method}</td>
                    <td className={`p-2 font-semibold min-w-[120px] ${statusColor(log.status_code)}`}>
                      {mapStatus(log.status_code)}
                    </td>
                    <td className="p-2 min-w-[200px]">{log.error_message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
