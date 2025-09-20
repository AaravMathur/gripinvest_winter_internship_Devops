const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware"); // ✅ direct function
const db = require("../db/connection");

// GET /api/transactions
// Fetch all transaction logs for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [logs] = await db.query(
      `SELECT id, created_at, endpoint, http_method, status_code, error_message
       FROM transaction_logs
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(logs);
  } catch (err) {
    console.error("Error fetching transaction logs:", err);
    res.status(500).json({ error: "Failed to fetch transaction logs" });
  }
});

module.exports = router;
