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
├── client/                     
│   ├── public/
│   │   └── favicon.svg         
│   ├── src/
│   │   ├── components/         
│   │   ├── context/           
│   │   ├── hooks/             
│   │   ├── layouts/            
│   │   ├── pages/            
│   │   ├── services/           
│   │   ├── App.jsx             
│   │   ├── index.css           
│   │   └── main.jsx
│   ├── Dockerfile              
│   ├── nginx.conf              
│   ├── index.html              
│   ├── tailwind.config.js      
│   └── package.json
│
├── server/                     
│   ├── controllers/            
│   ├── middleware/             
│   ├── prisma/
│   │   ├── schema.prisma       
│   │   └── seed.js            
│   ├── routes/                 
│   ├── utils/                  
│   ├── Dockerfile              
│   ├── server.js               
│   └── package.json
│
├── docker-compose.yml          
├── .gitignore                 
└── README.md                  
```

---

## ⚡ Quick Setup & Local Development

### 1. Environment Configuration

Copy environment settings in `server/.env`:

```ini
# PostgreSQL Database URL (e.g., Neon / Supabase / local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/fms_db?sslmode=require"

# JWT Secret Key
JWT_SECRET="fms_super_secret_jwt_key_2026_change_in_production"

# Server Port
PORT=5000

# Admin Default Credentials for Seeding
ADMIN_NAME="System Administrator"
ADMIN_EMAIL="admin@fms.com"
ADMIN_PASSWORD="654321"

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



---


