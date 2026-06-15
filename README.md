# 🌿 Verdant — Personal Expense Tracker

A single-page application (SPA) for tracking personal expenses. Now track your pocket with modern interface for efficient management.
---

## 📸 Overview

Verdant lets you add, view, edit, and delete personal expenses with a visual summary of your spending habits — all stored locally in your browser with no backend required.

---

## ✨ Features

- **Add Expense** — Title, Amount (PKR), Category, Date, and optional Notes
- **View All Expenses** — Sorted by date, most recent first
- **Edit & Delete** — Inline action buttons on every expense row
- **Summary View** — Total spent, category-wise pie chart and bar chart, and a detailed breakdown table
- **Search** — Live title search across all expenses
- **Filter by Category** — Dropdown to filter by any category
- **Filter by Date Range** — From/To date pickers with inclusive boundaries
- **Date Range Validation** — Error shown if "From" date is set after "To" date
- **Future Date Blocked** — Cannot add or edit an expense with a future date
- **Input Validation** — Required fields enforced, no negative or zero amounts allowed
- **Responsive Design** — Works on mobile and desktop
- **Smooth UI/UX** — Slide-in animations, hover states, toast notifications
- **LocalStorage Persistence** — Data survives page refreshes

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework (SPA) |
| Vite | Development server and bundler |
| Recharts | Pie chart and bar chart |
| LocalStorage | Client-side data persistence |
| Google Fonts | Playfair Display + Lato typography |

---

## 🎨 Design

**Theme:** Eco-friendly organic light theme — warm parchment backgrounds, forest greens, earthy ambers, and terracotta accents.

**Typography:** *Playfair Display* (serif) for headings paired with *Lato* for UI text.

**Colors:** Each expense category has its own distinct organic color identity.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js v18 or higher installed:

```bash
node -v
npm -v
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

**2. Install dependencies**
```bash
npm install
npm install recharts
```

**3. Replace the default App component**

update `src/main.jsx` to:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ExpenseTracker.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**4. Start the development server**
```bash
npm run dev
```

Open your browser at `http://localhost:5173`

---

## 📁 Project Structure

```
verdant-tracker/
├── src/
│   ├── ExpenseTracker.jsx   # Entire application (components + styles)
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

> All styling is done via inline style objects and a single injected `<style>` tag inside the component. No external CSS files are needed.

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy on Vercel, Netlify, or any static host.

---

## 🗂 Expense Categories

| Category | Color |
|---|---|
| Food | Forest Green |
| Transport | Deep Teal |
| Utilities | Warm Amber |
| Health | Terracotta |
| Entertainment | Sage |
| Shopping | Earth Brown |
| Education | Slate Blue |
| Other | Muted Gray |

---

## 🎨 Figma Design

Link: https://www.figma.com/make/HMmBBSrRePV3m8vsig5zCE/Personal-Expense-Tracker-App?t=9oE8wE9sXP2Gp7mp-20&fullscreen=1

---

## 📄 License: 

MIT Licensed and secured.

---
