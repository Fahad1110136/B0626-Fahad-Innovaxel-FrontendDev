# 🌿 Verdant — Pocket Expense Tracker

A complete personal finance web application. Track expenses, view spending summaries with charts, and manage your own private account — all wrapped in a calm, editorial style design.

---

## ✨ Features

- 🏠 **Public landing page** — every visitor lands here first, regardless of login history
- 🔐 **Sign up / Sign in** — JWT-based authentication, bcrypt-hashed passwords
- 👤 **Personal data** — each user only ever sees their own expenses
- ➕ **Add / edit / delete expenses** — title, amount, category, date, optional notes
- 🏷️ **8 built-in categories** — Food, Transport, Utilities, Health, Entertainment, Shopping, Education, Other
- 🔍 **Search & filter** — by keyword, category, and date range
- 📊 **Summary dashboard** — pie chart by category, bar chart by month, full category breakdown table
- 🚪 **Logout always returns to the home page** — never auto-logs back in on next visit

---

## 📁 Project Structure

```
verdant/
├── package.json                      
├── README.md                          
├── backend/                           
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js                  
│       ├── models/
│       ├── routes/
│       └── middleware/
└── frontend/                          
    ├── index.html
    ├── vite.config.js                 
    ├── package.json
    ├── .env
    ├── public/
    └── src/
        ├── main.jsx                  
        ├── App.jsx                    
        ├── AppShell.jsx                
        ├── ExpenseTrackerConnected.jsx 
        ├── index.css
        ├── context/
        ├── services/
        └── pages/
```

## ⚙️ Prerequisites

- 🟢 **Node.js** v18 or higher
- 🍃 **MongoDB** — either:
  - Installed locally (`mongod` running on port 27017), or
  - A free **MongoDB Atlas** cluster (recommended — also needed for deployment)

---

## 🛠️ Local Setup

### 📦 1. Install dependencies

From the project root:

```bash
npm install
```

This installs the root tooling plus both `backend/` and `frontend/` dependencies.

### ⚙️ 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in real values:

```dotenv
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster1.xxxxx.mongodb.net/verdant?retryWrites=true&w=majority
JWT_SECRET=<a long random string — see below>
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
### 🖥️ 3. Configure the frontend

```bash
cd frontend
cp .env.example .env
```

## 🔑 Environment Variables

### 🖥️ Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.../verdant` |
| `JWT_SECRET` | Secret used to sign auth tokens | long random hex string |
| `JWT_EXPIRES_IN` | How long a login session lasts | `7d` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### 🌐 Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API. Leave blank locally (proxy handles it) | `https://verdant-backend.onrender.com/api` |

---

## 🔒 Security Checklist

Before going live:

- [ ] 🔑 `JWT_SECRET` is a long, random string — never reused from development
- [ ] 🌍 `NODE_ENV=production` is set on the backend
- [ ] 🔐 HTTPS is enabled on both frontend and backend (Let's Encrypt / host-provided SSL)
- [ ] 🌐 `FRONTEND_URL` on the backend matches your exact production frontend domain (strict CORS)
- [ ] 🍃 MongoDB Atlas network access is restricted to known IPs where possible (instead of `0.0.0.0/0`) for production-grade security
- [ ] 🙈 `.env` files are never committed to git (already covered by `.gitignore`)

---

