const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const { users } = require("../data/inMemoryData");

const adminRouter = express.Router();
adminRouter.use(authenticateToken);
adminRouter.use(authorizeRole("admin"));

adminRouter.get("/users", (req, res) => {
  res.json(
    users.map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      class_id: u.class_id,
    }))
  );
});

module.exports = adminRouter;
