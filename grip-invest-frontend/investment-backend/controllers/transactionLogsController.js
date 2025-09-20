const db = require("../db/connection");

const getTransactionLogs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM transaction_logs");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTransactionLogs };
