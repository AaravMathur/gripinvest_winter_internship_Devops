const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");  // MySQL pool

// Routes
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/investmentProducts");
const investmentsRoutes = require("./routes/investments");
const transactionsRouter = require("./routes/transactions");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const logTransaction = require("./middleware/loggerMiddleware");
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Public routes (no token required)
app.use("/api/users", usersRoutes);   // signup, login inside usersRoutes
app.use("/api", authRoutes);          // if you have extra auth routes

// Protected routes (require JWT + log)
app.use("/api/products", authenticateToken, logTransaction, productsRoutes);
app.use("/api/investments", authenticateToken, logTransaction, investmentsRoutes);
app.use("/api/transactions", authenticateToken, logTransaction, transactionsRouter);
app.use("/api/dashboard", authenticateToken, logTransaction, dashboardRoutes);

// Root test
app.get("/", (req, res) => res.send("Server is running"));

// Health check route
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // DB connectivity check
    res.json({
      status: "ok",
      service: "backend",
      database: "connected",
      timestamp: new Date()
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      service: "backend",
      database: "disconnected",
      error: e.message,
      timestamp: new Date()
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
