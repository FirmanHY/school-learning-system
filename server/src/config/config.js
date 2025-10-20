require("dotenv").config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = "1h"; // Access token expiration
const REFRESH_EXPIRES_IN = "7d"; // Refresh token expiration

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET";
const CALLBACK_URL =
  process.env.CALLBACK_URL || "http://localhost:3000/auth/google/callback";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "your-secret-key-change-in-production";

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CALLBACK_URL,
  SESSION_SECRET,
};
