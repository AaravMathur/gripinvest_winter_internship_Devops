import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

interface Investment {
  id: string;
  product_id: string;
  name?: string;
  amount: number;
  status: "active" | "matured" | "cancelled";
  expected_return?: number;
}

interface Product {
  id: string;
  name: string;
}

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6"];

const Investments: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [selectedProduct, setSelectedProduct] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [investmentsRes, productsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/investments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(productsRes.data);

      const investmentsWithNames = investmentsRes.data.map((inv: Investment) => ({
        ...inv,
        name: productsRes.data.find((p: Product) => p.id === inv.product_id)?.name || "Unknown",
        amount: Number(inv.amount) || 0,
      }));

      setInvestments(investmentsWithNames);
    } catch (err) {
      console.error("Error fetching investments or products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvest = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedProduct || amount <= 0) {
        alert("Please select a product and enter a valid amount.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/investments",
        { product_id: selectedProduct, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Investment response:", res.data);
      alert("Investment successful!");

      // refresh state without reloading page
      fetchData();
      setSelectedProduct("");
      setAmount(0);
    } catch (err: any) {
      console.error("Error while investing:", err.response || err);
      alert(err.response?.data?.message || "Failed to invest. Check console for details.");
    }
  };

  const pieData = investments.filter((inv) => inv.amount > 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Investments</h1>

          {/* Investment Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Make a New Investment</h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="border p-2 rounded"
              />

              <button
                onClick={handleInvest}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Invest
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading investments...</p>
          ) : investments.length === 0 ? (
            <p className="text-gray-600">No investments found.</p>
          ) : (
            <>
              {/* Investment Distribution Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">Investment Distribution</h2>
                <div style={{ width: "100%", height: 300, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="amount"
                        nameKey="name"
                        outerRadius={80}
                        label={(entry: any) => {
                          const name = entry.payload?.name || "Unknown";
                          const percent = entry?.percent ? (entry.percent * 100).toFixed(0) : "0";
                          return `${name} (${percent}%)`;
                        }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Investment Table */}
              <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Expected Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => (
                      <tr key={inv.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-2">{inv.name}</td>
                        <td className="p-2">₹{inv.amount.toLocaleString()}</td>
                        <td
                          className={`p-2 font-medium ${
                            inv.status === "active"
                              ? "text-green-600"
                              : inv.status === "matured"
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {inv.status}
                        </td>
                        <td className="p-2">
                          {inv.expected_return ? `₹${inv.expected_return.toLocaleString()}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investments;
