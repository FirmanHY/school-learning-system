const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { findUserById } = require("../helpers/helpers");

const userRouter = express.Router();
userRouter.use(authenticateToken);

userRouter.get("/profile", (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

module.exports = userRouter;
