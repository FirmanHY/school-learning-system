const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} = require("../config/config");
const { users, refreshTokens } = require("../data/inMemoryData");

function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    class_id: user.class_id, // Include attributes in token for quick ABAC checks
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function generateRefreshToken(user) {
  const payload = { id: user.id, type: "refresh" };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  refreshTokens.add(token);
  return token;
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  findUserById,
};
