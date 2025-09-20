const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

const {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} = require("../controllers/investmentsController");

router.get("/", authenticateToken, getInvestments);
router.get("/:id", authenticateToken, getInvestmentById);
router.post("/", authenticateToken, createInvestment);
router.put("/:id", authenticateToken, updateInvestment);
router.delete("/:id", authenticateToken, deleteInvestment);

module.exports = router;
