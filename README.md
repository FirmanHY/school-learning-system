# 📘 School Learning System

This repository contains a **full-stack school learning system** application.

---

## 🧩 Overview

A simple yet complete school management system featuring **user authentication**, **authorization (RBAC & ABAC)**, and **CRUD operations** for materials, tasks, and grades.  
Includes both **backend (Node.js)** and **frontend (Vanilla JS + Bootstrap)** components.

---

## ⚙️ Tech Stack

### 🖥️ Backend

- **Node.js** + **Express.js**
- **JWT Authentication**
- **Google OAuth**
- **Role-Based Access Control (RBAC)**
- **Attribute-Based Access Control (ABAC)**
- **In-memory data storage** (no database used)

### Frontend

- **Vanilla JavaScript**
- **Bootstrap 5**
- Simple web interface for:
  - Login / Logout
  - Dashboard
  - Managing materials, tasks, and grades

---

## Features

- **User Authentication**
  - Login via username/password
  - Login via Google OAuth
- **Role-Based Access**
  - Admin, Teacher, and Student roles
- **Protected API Endpoints**
  - Manage learning materials
  - Manage tasks
  - Manage grades
- 🖥️ **Frontend Dashboard**
  - Role-specific views
  - CRUD operations for materials, tasks, and grades

---

## Prerequisites

Before running the application, ensure you have:

- [Node.js](https://nodejs.org/) **v18+** (recommended)
- A modern **web browser** for frontend testing (no build tools required)

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd server
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

- Copy
```bash 
cp .env.example to .env
```
- Fill in your Google OAuth credentials and secrets:

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=your-secret-key-change-this-in-production
SESSION_SECRET=your-session-secret
```

## Running The Application

### 1. Backend

- Start the server:

```bash
node server/src/app.js
```

- The API will run on http://localhost:3000.

### 2. Frontend

- Open login.html in your browser (e.g., via live server or directly).
   - For development, use a simple HTTP server like npx http-server in the root directory.
   - Access: http://localhost:8080/login.html (adjust port as needed).

## Testing

### Backend Testing (using Postman or curl)

- JWT Login: POST /auth/login with body { "username": "admin", "password": "Admin123" }.
- Google Login: GET /auth/google (redirects to Google).
- Get Materials: GET /materials with authorization token in headers.
- Test credentials:
  - Admin: username=admin, password=Admin123
  - Teacher: username=teacher1, password=Teacher123
  - Student: username=student1, password=Student123

### Frontend Testing

- Open login.html and login with test credentials or Google.
- After login, you'll be redirected to dashboard.html.
- Depending on role:
  - Admin: See all data, users list.
  - Teacher: Create/edit/delete materials/tasks in their class.
  - Student: View materials/tasks, submit tasks, view own grades.

## Common Issues

- Ensure backend is running before accessing frontend (frontend makes API calls to localhost:3000).
- For Google OAuth, ensure callback URL matches your .env.
- Data resets on server restart (in-memory storage).
