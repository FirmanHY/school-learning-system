const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

// Authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// RBAC Middleware
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
}

// ABAC Helper: Check if resource attribute matches user value
function checkAttributeMatch(resource, attribute, userValue) {
  return resource[attribute] === userValue;
}

// Combined RBAC + ABAC Middleware
function authorizeRBACABAC({ roles = [], abac = () => true }) {
  return (req, res, next) => {
    // RBAC check
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient role (RBAC)" });
    }
    // ABAC check
    if (!abac(req)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Attribute mismatch (ABAC)" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
  checkAttributeMatch,
  authorizeRBACABAC,
};
