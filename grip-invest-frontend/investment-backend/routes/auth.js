const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/authController");

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

module.exports = router;
