const jwt = require("jsonwebtoken");

// This middleware protects any route it's attached to.
// It reads the "Authorization: Bearer <token>" header, verifies the JWT,
// and either lets the request through (attaching req.user) or rejects it.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}

module.exports = { requireAuth };
