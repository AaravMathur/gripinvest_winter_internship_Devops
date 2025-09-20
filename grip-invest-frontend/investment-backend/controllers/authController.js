const db = require("../db/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ----------------- Signup -----------------
const signupUser = async (req, res) => {
  const { first_name, last_name, email, password, risk_appetite } = req.body;

  try {
    // 1. Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 3. Insert into DB
    const [result] = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, risk_appetite, role) 
   VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password_hash, risk_appetite || "moderate", "user"]
    );

    // 4. Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role || "user" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------- Login -----------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Sign JWT with id + email
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role || "user" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { signupUser, loginUser };
