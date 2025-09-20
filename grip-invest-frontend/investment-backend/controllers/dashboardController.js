// investment-backend/controllers/dashboardController.js
const db = require("../db/connection");

// Get portfolio info
const getPortfolio = async (req, res) => {
  try {
    const [investments] = await db.query(
      "SELECT amount FROM investments WHERE user_id = ?",
      [req.user.id]
    );

    const portfolioValue = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
    const investmentsCount = investments.length;

    // Dummy growth data for now, you can calculate based on your transactions
    const growthData = investments.map((inv, i) => (i + 1) * 100);

    res.json({ portfolioValue, investmentsCount, growthData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch portfolio data" });
  }
};

// Get recent transactions (from investments table)
const getTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query(
      `SELECT i.id, i.invested_at AS date, p.name AS product, i.amount, i.status
       FROM investments i
       JOIN investment_products p ON i.product_id = p.id
       WHERE i.user_id = ?
       ORDER BY i.invested_at DESC
       LIMIT 10`,
      [req.user.id]
    );

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

module.exports = { getPortfolio, getTransactions };
