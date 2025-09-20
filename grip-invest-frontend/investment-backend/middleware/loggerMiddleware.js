// middleware/loggerMiddleware.js
const db = require("../db/connection");

const logTransaction = async (req, res, next) => {
  const start = Date.now();

  // Capture the original send function to get status code
  const originalSend = res.send;
  res.send = async function (body) {
    try {
      const userId = req.user?.id || null;
      const email = req.user?.email || null;
      const endpoint = req.originalUrl;
      const http_method = req.method;
      const status_code = res.statusCode;
      const error_message = res.statusCode >= 400 ? body?.toString() : null;

      await db.query(
        `INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, email, endpoint, http_method, status_code, error_message]
      );
    } catch (err) {
      console.error("Failed to log transaction:", err);
    }

    // Call the original send function
    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = logTransaction;
