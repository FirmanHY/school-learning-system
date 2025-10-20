/*
 * ============================================
 * SCHOOL LEARNING SYSTEM API
 * ============================================
 * This is a simple REST API for a school learning system implementing:
 * - JWT Authentication (username/password)
 * - OAuth 2.0 (Google Login) integrated with JWT
 * - RBAC (Roles: admin, teacher, student)
 * - ABAC (Attributes: class_id, subject_id, owner_id, status, etc.)
 * - Combination of RBAC and ABAC
 *
 * Storage: In-memory (arrays/objects) as per request - no database required.
 *
 * KEY FEATURES:
 * - Access Tokens: JWT for all authenticated requests
 * - Refresh Tokens: For renewing access tokens
 * - Google OAuth: Logs in via Google, generates JWT
 * - Protected Endpoints: For materials, tasks, grades, etc.
 *
 * RUNNING THE APP:
 * 1. Install dependencies: npm install express jsonwebtoken bcryptjs passport passport-google-oauth20 express-session dotenv
 * 2. Create .env file with:
 *    GOOGLE_CLIENT_ID=your_client_id
 *    GOOGLE_CLIENT_SECRET=your_client_secret
 *    CALLBACK_URL=http://localhost:3000/auth/google/callback
 *    JWT_SECRET=your-secret-key-change-this-in-production
 *    SESSION_SECRET=your-session-secret
 * 3. Run: node src/app.js
 *
 * TEST CREDENTIALS:
 * - Admin: username=admin, password=admin123
 * - Teacher: username=teacher1, password=teacher123
 * - Student: username=student1, password=student123
 * ============================================
 */

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  SESSION_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CALLBACK_URL,
} = require("./config/config");
const { users, getNextUserId } = require("./data/inMemoryData");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (for Passport)
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Find or create user based on Google ID or email
      let user = users.find(
        (u) => u.google_id === profile.id || u.email === profile.emails[0].value
      );
      if (!user) {
        // Create new user with default role 'student'
        user = {
          id: getNextUserId(),
          username: profile.displayName.replace(/\s/g, "").toLowerCase(), // Simple username from name
          passwordHash: null, // No password for Google users
          role: "student",
          email: profile.emails[0].value,
          google_id: profile.id,
          class_id: null, // Default no class, can be assigned later
        };
        users.push(user);
      } else {
        // Update existing user
        user.google_id = profile.id;
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

// Mount routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const materialsRouter = require("./routes/materials");
const tasksRouter = require("./routes/tasks");
const gradesRouter = require("./routes/grades");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/materials", materialsRouter);
app.use("/tasks", tasksRouter);
app.use("/grades", gradesRouter);

// SERVER STARTUP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`School Learning System API running on http://localhost:${PORT}`);
  console.log(`\nTest with Postman or browser.`);
  console.log(`JWT Login: POST /auth/login {username, password}`);
  console.log(`Google Login: GET /auth/google`);
  console.log(`Protected: GET /materials with Authorization: Bearer <token>`);
});

module.exports = app;
