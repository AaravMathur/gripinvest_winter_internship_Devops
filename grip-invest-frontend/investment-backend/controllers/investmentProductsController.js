// controllers/investmentProductsController.js
const db = require("../db/connection");

// Get all investment products
const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM investment_products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single investment product
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM investment_products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new investment product
const createProduct = async (req, res) => {
  const {
    name,
    investment_type,
    tenure_months,
    annual_yield,
    risk_level,
    min_investment,
    max_investment,
    description,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO investment_products
      (name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        investment_type,
        tenure_months,
        annual_yield,
        risk_level,
        min_investment || 1000,
        max_investment || null,
        description || "",
      ]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: err.message });
  }
};
// Update investment product
// Update investment product
const updateProduct = async (req, res) => {
  const {
    name,
    investment_type,
    tenure_months,
    annual_yield,
    risk_level,
    min_investment,
    max_investment,
    description,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE investment_products 
       SET name=?, investment_type=?, tenure_months=?, annual_yield=?, 
           risk_level=?, min_investment=?, max_investment=?, description=? 
       WHERE id=?`,
      [
        name,
        investment_type,
        tenure_months,
        annual_yield,
        risk_level,
        min_investment,
        max_investment,
        description,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      id: req.params.id,
      name,
      investment_type,
      tenure_months,
      annual_yield,
      risk_level,
      min_investment,
      max_investment,
      description,
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: err.message });
  }
};



// Delete investment product
const deleteProduct = async (req, res) => {
  try {
    await db.query("DELETE FROM investment_products WHERE id=?", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
