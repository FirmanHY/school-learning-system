const express = require("express");
const {
  authenticateToken,
  authorizeRBACABAC,
  checkAttributeMatch,
} = require("../middleware/auth");
const {
  tasks,
  getNextTaskId,
  getNextSubmissionId,
  submissions,
} = require("../data/inMemoryData");

const tasksRouter = express.Router();
tasksRouter.use(authenticateToken);

tasksRouter.get("/", (req, res) => {
  let visibleTasks;
  if (req.user.role === "admin") {
    visibleTasks = tasks;
  } else {
    visibleTasks = tasks.filter((t) =>
      checkAttributeMatch(t, "class_id", req.user.class_id)
    );
  }
  res.json(visibleTasks);
});

tasksRouter.get("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  const hasAccess =
    req.user.role === "admin" ||
    checkAttributeMatch(task, "class_id", req.user.class_id);
  if (!hasAccess)
    return res.status(403).json({ error: "Forbidden: Attribute mismatch" });
  res.json(task);
});

tasksRouter.post(
  "/",
  authorizeRBACABAC({
    roles: ["teacher", "admin"],
    abac: (req) =>
      req.user.role === "admin" ||
      (req.body.class_id === req.user.class_id && req.body.status === "draft"),
  }),
  (req, res) => {
    const newTask = { id: getNextTaskId(), owner_id: req.user.id, ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
  }
);

tasksRouter.put(
  "/:id",
  authorizeRBACABAC({
    roles: ["teacher", "admin"],
    abac: (req) => {
      const task = tasks.find((t) => t.id === parseInt(req.params.id));
      if (!task || req.body.status !== "draft") return false;
      return (
        req.user.role === "admin" ||
        (task.owner_id === req.user.id && task.class_id === req.user.class_id)
      );
    },
  }),
  (req, res) => {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });
    Object.assign(task, req.body);
    res.json(task);
  }
);

tasksRouter.post(
  "/:id/submit",
  authorizeRBACABAC({
    roles: ["student"],
    abac: (req) => {
      const task = tasks.find((t) => t.id === parseInt(req.params.id));
      return (
        task && task.class_id === req.user.class_id && task.status === "open"
      );
    },
  }),
  (req, res) => {
    const newSubmission = {
      id: getNextSubmissionId(),
      task_id: parseInt(req.params.id),
      student_id: req.user.id,
      ...req.body,
    };
    submissions.push(newSubmission);
    res.status(201).json(newSubmission);
  }
);

tasksRouter.delete(
  "/:id",
  authorizeRBACABAC({
    roles: ["teacher", "admin"], // RBAC
    abac: (req) => {
      const task = tasks.find((t) => t.id === parseInt(req.params.id));
      if (!task || task.status !== "draft") return false;
      return req.user.role === "admin" || task.class_id === req.user.class_id;
    },
  }),
  (req, res) => {
    const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Task not found" });
    tasks.splice(index, 1);
    res.json({ message: "Task deleted" });
  }
);

module.exports = tasksRouter;
