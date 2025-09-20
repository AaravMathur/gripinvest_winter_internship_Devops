const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/usersController');
const { getMe, updateMe } = require("../controllers/usersController");
const  authenticateToken = require("../middleware/authMiddleware");
// Signup
router.post('/signup', createUser);

// Login
router.post('/login', loginUser);

router.get("/me", authenticateToken, getMe);

// Update profile
router.put("/me", authenticateToken, updateMe);

module.exports = router;
