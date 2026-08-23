# 🌿 Verdant — Personal Expense Tracker

Verdant is a full-stack expense tracking application that lets users register an account, log in securely, and record, filter, and visualize their personal spending. It's built as a MERN-style app (MongoDB, Express, React, Node.js) with JWT-based authentication and a clean, nature-themed UI.

---

## ✨ Features

- 🔐 **User authentication** — register, login, JWT-based sessions, change password, update profile.
- 💸 **Expense management** — create, edit, delete, and list expenses with title, amount, category, date, and notes.
- 🔎 **Filtering & search** — filter by category, date range, and free-text title search.
- 📊 **Statistics & charts** — category breakdown (pie chart) and spending overview (bar chart) powered by Recharts, plus aggregate stats (total, average, highest expense) computed on the backend via MongoDB aggregation.
- 🌱 **Themed UI** — a custom "earthy/green" design system built with plain inline styles (no CSS framework dependency).
- ⚡ **Fast dev experience** — Vite-powered frontend with hot reload and an API proxy to the backend.

---

## 🧰 Tech Stack

**Backend**
- [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) via [Mongoose 8](https://mongoosejs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for auth tokens
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
- [cors](https://github.com/expressjs/cors), [dotenv](https://github.com/motdotla/dotenv)
- [nodemon](https://nodemon.io/) for local development

**Frontend**
- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/) (build tool & dev server)
- [Recharts 3](https://recharts.org/) for data visualization
- [ESLint](https://eslint.org/) for linting

---

## 📁 Project Structure

```
Verdent/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js         
│   ├── package.json
│   └── .env            
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx            
│   │   ├── AppShell.jsx          
│   │   ├── ExpenseTrackerConnected.jsx  
│   │   ├── expensetracker.jsx   
│   │   ├── index.css
│   │   └── main.jsx          
│   ├── public/
│   ├── index.html
│   ├── vite.config.js         
│   ├── package.json
│   └── .env                       
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or later (v20+ recommended)
- **npm** (comes with Node.js)
- A **MongoDB** database — either:
  - A local MongoDB instance (`mongodb://localhost:27017`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended)

---

## 🚀 Getting Started

### 1️⃣ Clone / Extract the Project

If you haven't already, extract the project archive and `cd` into it:

```bash
cd Verdent
```

You should see two main folders: `backend/` and `frontend/`.

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables) below), then start the server:

```bash
# Development (auto-restart on file changes via nodemon)
npm run dev

# Production
npm start
```

By default the backend runs on **http://localhost:5000**.

### 3️⃣ Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

By default the frontend runs on **http://localhost:5173** and will open automatically in your browser.

---

## 🔑 Environment Variables

### ⚙️ `backend/.env`

| Variable          | Description                                                       | Example                                      |
|-------------------|---------------------------------------------------------------------|-----------------------------------------------|
| `PORT`            | Port the Express server listens on                                | `5000`                                        |
| `MONGO_URI`       | MongoDB connection string                                          | `mongodb+srv://<user>:<password>@cluster.../verdant` |
| `JWT_SECRET`      | Secret key used to sign JWTs — **use a long, random string**       | `a-very-long-random-secret`                   |
| `JWT_EXPIRES_IN`  | Token lifetime                                                     | `7d`                                           |
| `NODE_ENV`        | Environment mode                                                   | `development` / `production`                  |
| `FRONTEND_URL`    | URL allowed by CORS (your frontend's origin)                       | `http://localhost:5173`                       |


### ⚙️ `frontend/.env`

| Variable        | Description                                                                 | Example                          |
|-----------------|------------------------------------------------------------------------------|-----------------------------------|
| `VITE_API_URL`  | Base URL for API requests. Leave empty during local development — the Vite dev server proxies `/api` calls to the backend (see `vite.config.js`). Set this for production builds. | `https://api.yourdomain.com/api` |

---

## ▶️ Running the App

1. Start MongoDB (if running locally) or make sure your Atlas cluster is reachable.
2. Start the backend: `cd backend && npm run dev` → runs on `http://localhost:5000`.
3. Start the frontend: `cd frontend && npm run dev` → runs on `http://localhost:5173`.
4. Visit `http://localhost:5173` in your browser, sign up for an account, and start tracking expenses.

A health check endpoint is available at `GET http://localhost:5000/api/health`, which returns `{ status: "ok", time: <ISO timestamp> }`.

---

## 🗃️ Data Models

### 👤 User

| Field       | Type    | Notes                                             |
|-------------|---------|-----------------------------------------------------|
| `name`      | String  | Required, 2–50 characters                          |
| `email`     | String  | Required, unique, lowercased                       |
| `password`  | String  | Required, min 6 chars, hashed with bcrypt, hidden by default (`select: false`) |
| `avatar`    | String  | Optional                                            |
| `currency`  | String  | Defaults to `"PKR"`                                 |

Passwords are hashed automatically via a Mongoose `pre("save")` hook, and the `password` field is stripped from any JSON response via a custom `toJSON` method.

### 💸 Expense

| Field       | Type    | Notes                                                        |
|-------------|---------|------------------------------------------------------------------|
| `user`      | ObjectId | Reference to the owning `User`, indexed                        |
| `title`     | String  | Required, max 100 characters                                    |
| `amount`    | Number  | Required, must be greater than 0                                 |
| `category`  | String  | Required, one of the fixed category enum                        |
| `date`      | String  | Required, stored as `"YYYY-MM-DD"` to match the frontend's date inputs |
| `notes`     | String  | Optional, max 500 characters                                     |

A compound index on `{ user: 1, date: -1 }` keeps date-sorted, per-user queries fast.

---

## 🖥️ Frontend Overview

- **`AuthContext.jsx`** exposes `user`, `login`, `register`, `logout`, and `updateUser` via a React context. The JWT is persisted to `localStorage` under the key `verdant_token`.
- **`App.jsx`** switches between the marketing `HomePage`, `LoginPage`, `SignupPage`, and the authenticated app shell depending on whether a `user` is present in context.
- **`AppShell.jsx`** is the authenticated container: it fetches the user's expenses from the API on mount and provides `addExpense` / `editExpense` / `deleteExpense` handlers (each calling the backend, then updating local state) down to the dashboard UI.
- **`ExpenseTrackerConnected.jsx`** is the main dashboard: expense list, add/edit modal, category & date-range filters, search, and a summary tab with `PieChart`/`BarChart` visualizations built with Recharts.
- **`expensetracker.jsx`** is a self-contained/demo version of the tracker UI (useful as a reference or for offline/local-only experimentation, not wired to the API by default).
- **`services/api.js`** is a thin `fetch` wrapper (`authApi`, `expensesApi`) that automatically attaches the JWT bearer token and the `VITE_API_URL` base path.

---

## 🛡️ Security Notes

- Passwords are hashed with `bcryptjs` (12 salt rounds) before being stored.
- JWTs are signed with `JWT_SECRET` and expire after `JWT_EXPIRES_IN` (7 days by default).
- All expense routes are protected by the `protect` middleware, which validates the bearer token and attaches `req.user`.
- **Rotate the MongoDB password and JWT secret** currently checked into `backend/.env` before using this project beyond local testing — those values should be treated as public/leaked.
- CORS is restricted to the origin specified in `FRONTEND_URL`.

---


## 🔮 Future Improvements

Ideas for extending the project:

- Add refresh tokens / persistent sessions instead of relying solely on `localStorage`.
- Add pagination controls in the UI (the backend already supports `page`/`limit`).
- Support multi-currency conversion using the `currency` field on `User`.
- Add automated tests (Jest/Supertest for the backend, Vitest/React Testing Library for the frontend).
- Deploy with Docker Compose (Mongo + backend + frontend) for easier local/prod parity.

---
