const express = require("express");
const router = express.Router();
const pool = require("../db"); // use your db connection

router.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // simple DB test
    res.json({
      status: "ok",
      service: "backend",
      database: "connected",
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      service: "backend",
      database: "disconnected",
      error: err.message,
      timestamp: new Date()
    });
  }
});

module.exports = router;
