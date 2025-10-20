const express = require("express");
const { authenticateToken, authorizeRBACABAC } = require("../middleware/auth");
const { grades, subjects } = require("../data/inMemoryData");

const gradesRouter = express.Router();
gradesRouter.use(authenticateToken);

gradesRouter.get("/", (req, res) => {
  let visibleGrades;
  if (req.user.role === "admin") {
    visibleGrades = grades;
  } else if (req.user.role === "teacher") {
    visibleGrades = grades.filter((g) =>
      subjects.some(
        (s) => s.id === g.subject_id && s.class_id === req.user.class_id
      )
    );
  } else {
    // student
    visibleGrades = grades.filter((g) => g.student_id === req.user.id);
  }
  res.json(visibleGrades);
});

gradesRouter.get("/:id", (req, res) => {
  const grade = grades.find((g) => g.id === parseInt(req.params.id));
  if (!grade) return res.status(404).json({ error: "Grade not found" });
  let hasAccess = false;
  if (req.user.role === "admin") {
    hasAccess = true;
  } else if (req.user.role === "teacher") {
    const subject = subjects.find((s) => s.id === grade.subject_id);
    hasAccess = subject && subject.class_id === req.user.class_id;
  } else {
    // student
    hasAccess = grade.student_id === req.user.id;
  }
  if (!hasAccess)
    return res.status(403).json({ error: "Forbidden: Attribute mismatch" });
  res.json(grade);
});

gradesRouter.put(
  "/:id",
  authorizeRBACABAC({
    roles: ["teacher", "admin"],
    abac: (req) => {
      const grade = grades.find((g) => g.id === parseInt(req.params.id));
      if (!grade || grade.status !== "draft") return false;
      const subject = subjects.find((s) => s.id === grade.subject_id);
      return (
        req.user.role === "admin" ||
        (subject &&
          subject.teacher_id === req.user.id &&
          subject.class_id === req.user.class_id)
      );
    },
  }),
  (req, res) => {
    const grade = grades.find((g) => g.id === parseInt(req.params.id));
    if (!grade) return res.status(404).json({ error: "Grade not found" });
    Object.assign(grade, req.body);
    res.json(grade);
  }
);

module.exports = gradesRouter;
