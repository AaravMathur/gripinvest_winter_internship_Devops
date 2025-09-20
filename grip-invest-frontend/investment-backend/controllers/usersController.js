
// grip-invest-frontend/investment-backend/controllers/usersController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
require('dotenv').config();

const createUser = async (req, res) => {
  const { first_name, last_name, email, password, risk_appetite } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = 'user'; // default role

    const sql = `INSERT INTO users 
      (first_name, last_name, email, password_hash, risk_appetite, role)
      VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      first_name,
      last_name,
      email,
      hashedPassword,
      risk_appetite || 'moderate',
      role,
    ]);

    // create JWT including role
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, role }); // send role to frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, role: user.role }); // ← send role
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // set by JWT middleware
    const [rows] = await db.query("SELECT first_name, last_name, email, risk_appetite FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/me
const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, risk_appetite } = req.body;
    await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, risk_appetite = ? WHERE id = ?",
      [first_name, last_name, risk_appetite, userId]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createUser, loginUser, getMe, updateMe };
