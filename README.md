# 💎 Feedback Management System (FMS)

A modern, responsive, full-stack **Feedback Management System (FMS)** built with React, Vite, Tailwind CSS, Framer Motion, Node.js, Express, and PostgreSQL (Prisma ORM). Designed with a modern **Blue Glassmorphism Dashboard UI**, role-based JWT authentication, interactive rating systems, real-time analytics visualizations, search/filter/pagination, category management, and Docker containerization.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend Client (React + Vite)"]
        UI["Glassmorphism UI Dashboard"]
        AuthContext["Auth Context & JWT State"]
        Router["React Router v6"]
        Recharts["Recharts Data Visualization"]
        Forms["React Hook Form & Stars"]
    end

    subgraph API ["Backend API Server (Node.js + Express)"]
        Middleware["Auth Middleware (JWT & Role Guard)"]
        AuthCtrl["Auth Controller (Login/Register/Reset)"]
        FbCtrl["Feedback Controller (CRUD & User Stats)"]
        AdminCtrl["Admin Controller (Aggregates & Pagination)"]
        CatCtrl["Category Controller (CRUD & Validation)"]
    end

    subgraph Database ["Cloud PostgreSQL Database (Neon)"]
        UserTable[("Users Table")]
        FbTable[("Feedback Table")]
        CatTable[("Categories Table")]
        Indexes[("B-Tree Indexes")]
    end

    Client -->|HTTPS REST API Requests| API
    API -->|Prisma ORM Queries| Database
    Database -->|Aggregated Data & Paginated Results| API
    API -->|JSON Response| Client
```

---

## ✨ Features Highlight

### 👤 Normal User Capabilities
- **Authentication**: Registration, Login, Direct Password Reset, Profile Password Management.
- **User Dashboard**: Metric cards (*Total Feedback*, *Average Rating*, *Latest Feedback Date*, *Top Category*) and **Recharts Rating Distribution BarChart**.
- **Submit Feedback**: Category dropdown, interactive 5-star rating preview with micro-animations, and validated comment submission.
- **My Feedback**: View past submissions, edit category/rating/comment via modal, and delete submitted feedback.

### 🛡️ Administrator Capabilities
- **Analytics Dashboard**: Real-time aggregate indicators (*Total Feedback*, *Average Rating*, *Positive % (≥4 Stars)*, *Negative % (≤2 Stars)*), Recharts **Rating Breakdown BarChart**, and **Category Distribution PieChart**.
- **Paginated Feedback Management**: Database-level debounced search (by user name, email, or comment), category filtering, rating filtering, server-side pagination, and admin deletion capability.
- **Category Management**: View category list with feedback count validation, add new categories, rename existing categories, and delete categories (with safety validation preventing deletion of categories containing feedback).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, React Hook Form |
| **Backend** | Node.js (v20), Express.js, JSON Web Tokens (JWT), bcryptjs, CORS |
| **Database & ORM** | PostgreSQL (Neon Cloud DB), Prisma ORM v5 |
| **Containerization** | Docker, Multi-Stage Builds, Nginx, Docker Compose |

---

## 📁 Repository Structure

```text
feedback-management-system/
├── client/                     # Frontend React (Vite) Application
│   ├── public/
│   │   └── favicon.svg         # FMS Monogram Icon
│   ├── src/
│   │   ├── components/         # Glass UI Design System (GlassCard, StatCard, RatingStars, Modal, etc.)
│   │   ├── context/            # AuthContext & JWT Token State
│   │   ├── hooks/              # Custom hooks (useDebounce)
│   │   ├── layouts/            # AppLayout (Responsive Glass Sidebar + Top Navbar)
│   │   ├── pages/              # Login, Register, UserDashboard, SubmitFeedback, MyFeedback, Profile, AdminDashboard, FeedbackManagement, AdminCategoryManagement
│   │   ├── services/           # Centralized HTTP API client
│   │   ├── App.jsx             # React Router config & Protected Guards
│   │   ├── index.css           # Glassmorphism utilities & Tailwind imports
│   │   └── main.jsx
│   ├── Dockerfile              # Multi-stage Dockerfile (Vite Build + Nginx)
│   ├── nginx.conf              # Nginx SPA fallback config
│   ├── index.html              # Custom tab title ("Feedback Management System")
│   ├── tailwind.config.js      # Glass theme design tokens
│   └── package.json
│
├── server/                     # Backend Express.js Server
│   ├── controllers/            # authController, feedbackController, adminController, categoryController
│   ├── middleware/             # authMiddleware (JWT protect & adminOnly), errorHandler
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL Schema & Indexes
│   │   └── seed.js             # Seeding script for categories & Admin credentials
│   ├── routes/                 # Express REST endpoints
│   ├── utils/                  # Prisma client singleton
│   ├── Dockerfile              # Node.js Server Dockerfile
│   ├── server.js               # Main Express application entry point
│   └── package.json
│
├── docker-compose.yml          # Container orchestration config
├── .gitignore                  # Git ignore rules for node_modules, .env, and builds
└── README.md                   # System Architecture & Documentation
```

---

## ⚡ Quick Setup & Local Development

### 1. Environment Configuration

Copy environment settings in `server/.env`:

```ini
DATABASE_URL="postgresql://neondb_owner:npg_4JWaYK2lUwxm@ep-noisy-dawn-ays2ew88-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="fms_super_secret_jwt_key_2026_neon_db_secure"
PORT=5000
ADMIN_NAME="System Administrator"
ADMIN_EMAIL="admin@fms.com"
ADMIN_PASSWORD="123456"
```

And in `client/.env`:
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Database Synchronization & Seed
```bash
cd server
npm run prisma:migrate
node prisma/seed.js
```

### 3. Run Development Servers

In Terminal 1 (Backend Server):
```bash
cd server
npm run dev
```

In Terminal 2 (Frontend Client):
```bash
cd client
npm run dev
```

Navigate to `http://localhost:5173`.

---

## 🐳 Docker Deployment

To launch the containerized full-stack application using Docker Compose:

```bash
docker-compose up --build -d
```

- **Frontend Client**: Accessible at `http://localhost` (Nginx on Port 80)
- **Backend API**: Accessible at `http://localhost:5000`

---

## 📊 Time & Space Complexity Analysis

| Operation | Time Complexity | Space Complexity | Performance Optimizations |
| :--- | :--- | :--- | :--- |
| **Login & Auth Lookup** | $O(1)$ | $O(1)$ | Indexed `@unique` B-Tree lookup on `users.email` |
| **Submit Feedback** | $O(1)$ | $O(1)$ | Direct row insert into `feedback` table |
| **User Dashboard Metrics** | $O(n)$ | $O(1)$ | PostgreSQL native aggregations (`AVG()`, `COUNT()`, `GROUP BY`) |
| **Admin Pagination & Search**| $O(\log N + M)$ | $O(M)$ | Server-side pagination ($M=10$ page limit) with indexed filtering |

---

## 🔐 Default Credentials

- **Admin Account**: `admin@fms.com` / `123456`
- **User Registration**: Available on the public `/register` page.
