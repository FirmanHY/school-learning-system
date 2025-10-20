const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} = require("../../config/config");
const store = require("src/data/inMemoryData");

const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    class_id: user.class_id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const generateRefreshToken = (user) => {
  const payload = { id: user.id, type: "refresh" };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  store.refreshTokens.add(token);
  return token;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
