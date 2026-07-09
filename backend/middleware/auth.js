const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch {
    // Invalid token — continue without user
  }

  next();
}

module.exports = auth;
module.exports.optionalAuth = optionalAuth;