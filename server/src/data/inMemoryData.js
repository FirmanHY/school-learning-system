const bcrypt = require("bcryptjs");

// ===================== USERS =====================
let users = [
  {
    id: 1,
    username: "admin",
    passwordHash: bcrypt.hashSync("Admin123", 10),
    role: "admin",
    email: "admin@example.com",
    google_id: null,
    class_id: null,
  },
  {
    id: 2,
    username: "teacher1",
    passwordHash: bcrypt.hashSync("Teacher123", 10),
    role: "teacher",
    email: "teacher1@example.com",
    google_id: null,
    class_id: 1,
  },
  {
    id: 3,
    username: "teacher2",
    passwordHash: bcrypt.hashSync("Teacher123", 10),
    role: "teacher",
    email: "teacher2@example.com",
    google_id: null,
    class_id: 2,
  },
  {
    id: 4,
    username: "student1",
    passwordHash: bcrypt.hashSync("Student123", 10),
    role: "student",
    email: "student1@example.com",
    google_id: null,
    class_id: 1,
  },
  {
    id: 5,
    username: "student2",
    passwordHash: bcrypt.hashSync("Student123", 10),
    role: "student",
    email: "student2@example.com",
    google_id: null,
    class_id: 1,
  },
  {
    id: 6,
    username: "student3",
    passwordHash: bcrypt.hashSync("Student123", 10),
    role: "student",
    email: "student3@example.com",
    google_id: null,
    class_id: 2,
  },
  {
    id: 7,
    username: "student4",
    passwordHash: bcrypt.hashSync("Student123", 10),
    role: "student",
    email: "student4@example.com",
    google_id: null,
    class_id: 2,
  },
];
let nextUserId = users.length + 1;

// ===================== CLASSES =====================
let classes = [
  { id: 1, name: "10A", description: "Class 10A" },
  { id: 2, name: "10B", description: "Class 10B" },
  { id: 3, name: "11A", description: "Class 11A" },
];
let nextClassId = classes.length + 1;

// ===================== SUBJECTS =====================
let subjects = [
  { id: 1, name: "Mathematics", teacher_id: 2, class_id: 1 },
  { id: 2, name: "Science", teacher_id: 3, class_id: 2 },
  { id: 3, name: "English", teacher_id: 2, class_id: 1 },
  { id: 4, name: "History", teacher_id: 3, class_id: 2 },
];
let nextSubjectId = subjects.length + 1;

// ===================== MATERIALS =====================
let materials = [
  {
    id: 1,
    title: "Math Intro",
    content: "Basic math concepts",
    subject_id: 1,
    class_id: 1,
    owner_id: 2,
    privacy_level: "shared",
  },
  {
    id: 2,
    title: "Science Experiment Guide",
    content: "Introduction to simple experiments",
    subject_id: 2,
    class_id: 2,
    owner_id: 3,
    privacy_level: "shared",
  },
  {
    id: 3,
    title: "English Vocabulary List",
    content: "List of new words for this week",
    subject_id: 3,
    class_id: 1,
    owner_id: 2,
    privacy_level: "shared",
  },
  {
    id: 4,
    title: "History Timeline",
    content: "Important events from 1900–2000",
    subject_id: 4,
    class_id: 2,
    owner_id: 3,
    privacy_level: "shared",
  },
];
let nextMaterialId = materials.length + 1;

// ===================== TASKS =====================
let tasks = [
  {
    id: 1,
    title: "Math Homework #1",
    description: "Solve 10 algebra problems",
    subject_id: 1,
    class_id: 1,
    owner_id: 2,
    due_date: "2025-10-30",
    status: "closed",
  },
  {
    id: 2,
    title: "Science Report",
    description: "Write a report on recent experiment",
    subject_id: 2,
    class_id: 2,
    owner_id: 3,
    due_date: "2025-11-05",
    status: "open",
  },
  {
    id: 3,
    title: "English Essay",
    description: "Write an essay about your holiday",
    subject_id: 3,
    class_id: 1,
    owner_id: 2,
    due_date: "2025-11-02",
    status: "open",
  },
];
let nextTaskId = tasks.length + 1;

// ===================== SUBMISSIONS =====================
let submissions = [
  {
    id: 1,
    task_id: 1,
    student_id: 4,
    content: "Answers for algebra problems",
    submitted_at: new Date("2025-10-20T10:00:00"),
  },
  {
    id: 2,
    task_id: 1,
    student_id: 5,
    content: "Completed all problems",
    submitted_at: new Date("2025-10-20T11:00:00"),
  },
  {
    id: 3,
    task_id: 2,
    student_id: 6,
    content: "My science report",
    submitted_at: new Date("2025-10-21T09:00:00"),
  },
];
let nextSubmissionId = submissions.length + 1;

// ===================== GRADES =====================
let grades = [
  {
    id: 1,
    student_id: 4,
    subject_id: 1,
    value: 85.0,
    status: "final",
    privacy_level: "private",
  },
  {
    id: 2,
    student_id: 5,
    subject_id: 1,
    value: 90.0,
    status: "final",
    privacy_level: "private",
  },
  {
    id: 3,
    student_id: 6,
    subject_id: 2,
    value: 88.5,
    status: "draft",
    privacy_level: "private",
  },
  {
    id: 4,
    student_id: 7,
    subject_id: 2,
    value: 75.0,
    status: "draft",
    privacy_level: "private",
  },
];
let nextGradeId = grades.length + 1;

// ===================== TOKENS =====================
const refreshTokens = new Set();

// ===================== EXPORT =====================
module.exports = {
  users,
  classes,
  subjects,
  materials,
  tasks,
  submissions,
  grades,
  refreshTokens,
  getNextUserId: () => nextUserId++,
  getNextClassId: () => nextClassId++,
  getNextSubjectId: () => nextSubjectId++,
  getNextMaterialId: () => nextMaterialId++,
  getNextTaskId: () => nextTaskId++,
  getNextSubmissionId: () => nextSubmissionId++,
  getNextGradeId: () => nextGradeId++,
};
