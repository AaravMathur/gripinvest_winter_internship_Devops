import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Product {
  id: string;
  name: string;
  investment_type: "bond" | "fd" | "mf" | "etf" | "other";
  tenure_months: number;
  annual_yield: number;
  risk_level: "low" | "moderate" | "high";
  min_investment: number;
  max_investment?: number | null;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // product add/edit modal
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    investment_type: "bond",
    tenure_months: 12,
    annual_yield: 5.0,
    risk_level: "moderate",
    min_investment: 1000,
    max_investment: null,
    description: "",
  });

  // invest modal
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(0);

  const role = localStorage.getItem("role")?.trim();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // open add/edit modal
  const openModal = (product?: Product) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        ...product,
        max_investment: product.max_investment ?? null,
      });
    } else {
      setEditProduct(null);
      setFormData({
        name: "",
        investment_type: "bond",
        tenure_months: 12,
        annual_yield: 5.0,
        risk_level: "moderate",
        min_investment: 1000,
        max_investment: null,
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tenure_months" ||
        name === "annual_yield" ||
        name === "min_investment" ||
        name === "max_investment"
          ? Number(value)
          : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        max_investment: formData.max_investment || null,
      };

      if (editProduct) {
        const res = await axios.put(
          `http://localhost:5000/api/products/${editProduct.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(products.map((p) => (p.id === editProduct.id ? res.data : p)));
      } else {
        const res = await axios.post("http://localhost:5000/api/products", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProducts([...products, res.data]);
      }
      setShowModal(false);
    } catch (err: any) {
      console.error("Failed to save product:", err.response || err);
      alert(err.response?.data?.message || "Failed to save product.");
    }
  };

  const openInvestModal = (product: Product) => {
    setSelectedProduct(product);
    setInvestAmount(product.min_investment);
    setShowInvestModal(true);
  };

  const handleInvestSubmit = async () => {
    if (!selectedProduct) return;
    try {
      await axios.post(
        "http://localhost:5000/api/investments",
        { product_id: selectedProduct.id, amount: investAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Investment successful!");
      setShowInvestModal(false);
      setSelectedProduct(null);
      setInvestAmount(0);
      window.dispatchEvent(new Event("investmentUpdated"));
    } catch (err: any) {
      console.error("Failed to invest:", err.response || err);
      alert(err.response?.data?.message || "Investment failed. Try again.");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading products...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Products</h1>

          {role === "admin" && (
            <button
              onClick={() => openModal()}
              className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Add Product
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p>Type: {product.investment_type}</p>
                <p>Yield: {product.annual_yield}%</p>
                <p>Risk: {product.risk_level}</p>

                {role === "admin" ? (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openModal(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:shadow-md transition transform hover:-translate-y-0.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this product?")) {
                          axios.delete(`http://localhost:5000/api/products/${product.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setProducts(products.filter((p) => p.id !== product.id));
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:shadow-md transition transform hover:-translate-y-0.5"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openInvestModal(product)}
                    className="bg-blue-500 text-white px-4 py-2 mt-3 rounded hover:shadow-md transition transform hover:-translate-y-1"
                  >
                    Invest
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
                required
              />

              <select
                name="investment_type"
                value={formData.investment_type}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
              >
                <option value="bond">Bond</option>
                <option value="fd">FD</option>
                <option value="mf">Mutual Fund</option>
                <option value="etf">ETF</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                name="tenure_months"
                placeholder="Tenure (months)"
                value={formData.tenure_months}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
                required
              />

              <input
                type="number"
                name="annual_yield"
                placeholder="Annual Yield (%)"
                value={formData.annual_yield}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
                step="0.01"
                required
              />

              <select
                name="risk_level"
                value={formData.risk_level}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>

              <input
                type="number"
                name="min_investment"
                placeholder="Min Investment"
                value={formData.min_investment}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
                required
              />

              <input
                type="number"
                name="max_investment"
                placeholder="Max Investment (optional)"
                value={formData.max_investment ?? ""}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleFormChange}
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  {editProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              Invest in {selectedProduct.name}
            </h2>

            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(Number(e.target.value))}
              min={selectedProduct.min_investment}
              max={selectedProduct.max_investment || undefined}
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInvestModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleInvestSubmit}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
