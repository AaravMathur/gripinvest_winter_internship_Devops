// controllers/investmentsController.js
const db = require("../db/connection");

// Get all investments for the logged-in user
const getInvestments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT i.*, p.name, p.annual_yield, p.risk_level
       FROM investments i
       JOIN investment_products p ON i.product_id = p.id
       WHERE i.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching investments:", err);
    res.status(500).json({ message: "Failed to fetch investments" });
  }
};

// Get a single investment by ID
const getInvestmentById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT i.*, p.name, p.annual_yield, p.risk_level
       FROM investments i
       JOIN investment_products p ON i.product_id = p.id
       WHERE i.id = ? AND i.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Investment not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching investment:", err);
    res.status(500).json({ message: "Failed to fetch investment" });
  }
};

// Create a new investment
const createInvestment = async (req, res) => {
  try {
    const { product_id, amount } = req.body;
    const user_id = req.user.id;

    console.log("📌 Incoming investment request:", {
      user_id,
      product_id,
      amount,
      typeOfAmount: typeof amount,
    });

    // Validate product
    const [productRows] = await db.query(
      "SELECT * FROM investment_products WHERE id = ?",
      [product_id]
    );
    if (!productRows.length) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = productRows[0];

    // Validate amount range
    if (amount < product.min_investment ||
      (product.max_investment && amount > product.max_investment)) {
      return res.status(400).json({ message: "Amount not within allowed range" });
    }

    // Insert investment
    await db.query(
      "INSERT INTO investments (user_id, product_id, amount) VALUES (?, ?, ?)",
      [user_id, product_id, amount]
    );

    res.status(201).json({ message: "Investment successful" });
  } catch (err) {
    console.error("❌ Error creating investment:", err);
    res.status(500).json({ message: "Failed to create investment", error: err.message });
  }
};

// Update investment
const updateInvestment = async (req, res) => {
  try {
    const { amount } = req.body;
    await db.query(
      "UPDATE investments SET amount = ? WHERE id = ? AND user_id = ?",
      [amount, req.params.id, req.user.id]
    );
    res.json({ message: "Investment updated" });
  } catch (err) {
    console.error("❌ Error updating investment:", err);
    res.status(500).json({ message: "Failed to update investment" });
  }
};

// Delete investment
const deleteInvestment = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM investments WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    res.json({ message: "Investment deleted" });
  } catch (err) {
    console.error("❌ Error deleting investment:", err);
    res.status(500).json({ message: "Failed to delete investment" });
  }
};

module.exports = {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};
