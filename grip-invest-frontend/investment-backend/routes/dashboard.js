const express = require("express");
const router = express.Router();
const { getPortfolio, getTransactions } = require("../controllers/dashboardController");
const authenticateToken = require("../middleware/authMiddleware"); // ✅ direct import

// All routes require authentication
router.get("/portfolio", authenticateToken, getPortfolio);
router.get("/transactions", authenticateToken, getTransactions);

module.exports = router;
