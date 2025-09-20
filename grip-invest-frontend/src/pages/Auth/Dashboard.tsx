import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

const LineChart: React.FC<{ data: number[] }> = ({ data }) => {
  if (!data.length) return null;
  const max = Math.max(...data);
  const points = data
    .map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-48">
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        points={points}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

const RecentTransactions: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  if (!transactions.length) return <p className="text-gray-500">No transactions found.</p>;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Date</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-2">{t.date}</td>
              <td>{t.product}</td>
              <td>{t.amount}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    t.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [investmentsCount, setInvestmentsCount] = useState(0);
  const [growthData, setGrowthData] = useState<number[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const portfolioRes = await api.get("/dashboard/portfolio", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPortfolioValue(portfolioRes.data.portfolioValue);
      setInvestmentsCount(portfolioRes.data.investmentsCount);
      setGrowthData(portfolioRes.data.growthData);

      const transactionsRes = await api.get("/dashboard/transactions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const handleInvestmentUpdate = () => fetchDashboardData();
    window.addEventListener("investmentUpdated", handleInvestmentUpdate);
    return () => {
      window.removeEventListener("investmentUpdated", handleInvestmentUpdate);
    };
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading dashboard...</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1 overflow-auto space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-lg font-semibold">Portfolio Value</h2>
              <p className="text-2xl mt-2 font-bold text-blue-600">${portfolioValue.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-lg font-semibold">Investments Count</h2>
              <p className="text-2xl mt-2 font-bold text-purple-600">{investmentsCount}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-lg font-semibold">AI Insights</h2>
              <p className="mt-2 text-sm text-gray-600">Balanced risk portfolio recommended</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Portfolio Growth</h2>
            <LineChart data={growthData} />
          </div>

          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
