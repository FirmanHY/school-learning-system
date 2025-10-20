const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { users } = require("../data/inMemoryData");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/helpers");
const { refreshTokens } = require("../data/inMemoryData");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 🔹 Validasi input kosong
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // 🔹 Validasi panjang username
  if (username.length < 5) {
    return res
      .status(400)
      .json({ error: "Username must be at least 5 characters long" });
  }

  // 🔹 Validasi kekuatan password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long and include uppercase, lowercase, and a number",
    });
  }

  // 🔹 Cek user di database
  const user = users.find((u) => u.username === username);
  if (
    !user ||
    user.passwordHash === null ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 🔹 Generate token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

authRouter.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshTokens.has(refreshToken))
    return res.status(403).json({ error: "Invalid refresh token" });
  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      refreshTokens.delete(refreshToken);
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate JWT after Google login
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    // Redirect or send tokens (for simplicity, send as query params - in production, use secure method)
    res.redirect(
      `/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

authRouter.get("/success", (req, res) => {
  res.json({
    message: "Google login successful",
    accessToken: req.query.accessToken,
    refreshToken: req.query.refreshToken,
  });
});

authRouter.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) refreshTokens.delete(refreshToken);
  if (req.logout) req.logout(() => {}); // For Passport session
  res.json({ message: "Logged out" });
});

module.exports = authRouter;
