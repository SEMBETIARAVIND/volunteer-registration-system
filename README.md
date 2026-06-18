# 🤝 VolunteerHub — Volunteer Registration System

A professional, full-featured volunteer registration and management system built with React.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher

### Installation & Run

```bash
# 1. Extract the zip and navigate into the folder
cd volunteer-system

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open in browser
# http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@volunteerportal.org | Admin@123 |
| **Volunteer** | priya.sharma@example.com | Admin@123 |

---

## ✨ Features

### 🌐 Public
- **Landing Page** — Hero, stats, features, categories, testimonials, CTA
- **Volunteer Registration** — 3-step form with skills, availability, interests
- **Login** — Email + password authentication

### 👤 Volunteer Portal
- **Dashboard** — Stats, registered events, upcoming opportunities, badges
- **Browse Events** — Filter by category, status; register with one click
- **Profile Management** — Edit personal info, skills, availability, interests
- **Activity History** — View all events joined

### 🛡️ Admin Panel
- **Dashboard** — Live KPIs, charts (bar, pie, area), recent activity, pending approvals
- **Volunteer Management** — Full CRUD, approve/reject, filter, search, export CSV
- **Event Management** — Create/edit/delete events with all details
- **Reports & Analytics** — Growth trends, volunteer demographics, skills distribution, event analytics, export

---

## 🗄️ Database

Uses `localStorage` as an in-browser database — no backend required! All data persists between page reloads.

Pre-loaded with:
- 1 Admin user
- 5 Sample volunteers
- 3 Sample events
- Activity log

---

## 🏗️ Project Structure

```
src/
├── contexts/
│   └── AuthContext.js       # Auth state, login, register, logout
├── utils/
│   └── db.js                # localStorage database layer
├── components/
│   └── AdminLayout.js       # Sidebar + topbar layout
├── pages/
│   ├── LandingPage.js       # Public homepage
│   ├── LoginPage.js         # Sign in
│   ├── RegisterPage.js      # 3-step volunteer registration
│   ├── AdminDashboard.js    # Admin home with charts
│   ├── VolunteerDashboard.js # Volunteer home
│   ├── VolunteersPage.js    # Admin volunteer management
│   ├── EventsPage.js        # Events (admin + volunteer view)
│   ├── ReportsPage.js       # Analytics & reports
│   └── ProfilePage.js       # Volunteer profile editor
├── index.css                # Global design system
├── App.js                   # Routing
└── index.js                 # Entry point
```

---

## 🎨 Design System

- **Font**: Inter (body) + Playfair Display (headings)
- **Primary**: #1a56db (Blue)
- **Success**: #0f9d58 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #dc2626 (Red)
- Fully responsive (mobile-friendly)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage (simulated DB) |
| Styling | Custom CSS (design tokens) |
| Date Utils | date-fns |

---

## 🔮 Production Upgrade Path

To upgrade to a production system:
1. Replace `localStorage` in `utils/db.js` with API calls to Express/Node.js + MongoDB/PostgreSQL
2. Add JWT tokens in `AuthContext.js`
3. Deploy frontend to Vercel/Netlify
4. Deploy backend to Railway/Render

---

Made with ❤️ — VolunteerHub
