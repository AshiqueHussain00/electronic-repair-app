# Electronic — Project Structure & Developer Documentation

> Full-Stack Appliance Repair Booking Platform built with React 19, TypeScript, Node.js/Express, and Vite.

---

## 🗂️ Root Directory Structure

```
Magic-Mistry/
├── dist/                    # Production build output (Vite + esbuild compiled)
├── src/                     # Frontend React application source
├── Magic-Mistry/src/        # Nested mirror source (dev server sync copy)
├── server.ts                # Express backend API server (Node.js + JWT + Bcrypt)
├── database.json            # File-based persistent database (JSON flat-file store)
├── index.html               # HTML entry point (Vite root)
├── vite.config.ts           # Vite configuration (dev proxy + build options)
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript compiler configuration
├── package.json             # NPM dependencies and scripts
└── README.md                # This file
```

---

## 📁 Source Directory (src/)

```
src/
├── animations/
│   └── index.ts             # Shared Framer Motion animation variants
│                            # (pageTransition, buttonPress, containerStagger, itemFadeIn)
│
├── components/
│   ├── LazyImage.tsx        # Viewport IntersectionObserver lazy image component
│   │                        # — Pulsed skeleton placeholder, 700ms opacity fade-in
│   ├── LoadingScreen.tsx    # Full-page gradient spinning loading screen (Suspense fallback)
│   ├── Navbar.tsx           # Persistent global header navigation bar
│   │                        # — Desktop links + mobile hamburger drawer
│   │                        # — Smart hash vs route navigation resolver
│   │                        # — User profile dropdown + logout
│   └── PublicLayout.tsx     # React Router layout wrapper for public pages
│                            # — Mounts Navbar once; renders Outlet for page content
│
├── constants/
│   └── index.ts             # App-wide static data
│                            # — SERVICE_CATEGORIES[] array (8 categories)
│                            # — WORK_HOURS[] time slot strings for booking scheduler
│
├── context/
│   └── AuthContext.tsx      # Global authentication context provider
│                            # — JWT token management (localStorage: accessToken)
│                            # — Role-based user state (CUSTOMER | TECHNICIAN | ADMIN)
│                            # — Login / Logout / Signup / checkAuth flow
│                            # — Offline mock mode fallback (network failure only)
│
├── pages/
│   ├── Home.tsx             # Landing page (Hero, 4-category grid, photo catalog, vendor CTA)
│   ├── AllServices.tsx      # Full 8-category services catalog page (/services route)
│   ├── BecomeVendor.tsx     # Vendor onboarding page (/become-a-vendor route)
│   ├── Login.tsx            # Login form page
│   ├── Signup.tsx           # Customer registration form
│   ├── VerifyOTP.tsx        # Email OTP verification page
│   ├── ForgotPassword.tsx   # Password recovery request page
│   ├── CustomerDashboard.tsx    # Customer portal
│   ├── TechnicianDashboard.tsx  # Vendor/Technician portal
│   └── AdminDashboard.tsx       # Admin control panel
│
├── routes/
│   └── index.tsx            # React Router route tree + guards
│                            # — React.lazy() dynamic imports for code splitting
│                            # — Suspense with LoadingScreen fallback
│                            # — PublicLayout wraps /, /services, /become-a-vendor
│                            # — ProtectedRoute: JWT auth gate with role checking
│
├── services/
│   ├── api.ts               # Axios instance (base URL: /api)
│   ├── auth.ts              # Auth API calls
│   └── booking.ts           # Booking API calls
│
├── types/
│   └── index.ts             # TypeScript interface definitions
│
├── utils/
│   └── index.ts             # Utility helper functions
│
└── App.tsx                  # Root app wrapper
```

---

## 🖥️ Backend (server.ts)

| Layer             | Details                                                              |
|-------------------|----------------------------------------------------------------------|
| Runtime           | Node.js + TypeScript (compiled via esbuild to dist/server.cjs)      |
| Framework         | Express.js                                                           |
| Auth              | JWT (jsonwebtoken) — 2-hour expiry tokens                            |
| Password Hashing  | Bcrypt (bcryptjs) — salt rounds: 10                                  |
| Database          | Flat-file JSON (database.json)                                       |
| Dev Integration   | Vite Dev Middleware mounted for SPA hot-reload support               |
| Token Middleware  | authenticateToken() — verifies JWT + checks live user BLOCKED status |

### API Routes

| Method | Endpoint                            | Auth      | Description                               |
|--------|-------------------------------------|-----------|-------------------------------------------|
| POST   | /api/auth/register                  | None      | Customer-only registration                |
| POST   | /api/auth/login                     | None      | Login (Admin uses hardcoded password)     |
| GET    | /api/auth/me                        | JWT       | Get current authenticated user           |
| GET    | /api/bookings                       | JWT       | Get bookings (role-filtered)              |
| POST   | /api/bookings                       | JWT       | Create a new booking                      |
| PATCH  | /api/bookings/:id/status            | JWT       | Update booking status                     |
| POST   | /api/bookings/:id/accept            | JWT       | Technician accepts a booking              |
| POST   | /api/bookings/:id/review            | JWT       | Submit booking review                     |
| GET    | /api/admin/stats                    | JWT+ADMIN | Admin dashboard statistics                |
| POST   | /api/admin/users/:id/toggle-block   | JWT+ADMIN | Block or unblock a user                   |
| POST   | /api/admin/vendors                  | JWT+ADMIN | Create a new vendor/technician account    |

---

## 🔌 Technology Stack

| Layer         | Technology                                          |
|---------------|-----------------------------------------------------|
| Frontend      | React 19, TypeScript, Vite 6                        |
| Styling       | Tailwind CSS v3                                     |
| Animations    | Framer Motion (motion/react)                        |
| Routing       | React Router DOM v7                                 |
| Icons         | Lucide React                                        |
| HTTP Client   | Axios                                               |
| Notifications | react-hot-toast                                     |
| Backend       | Node.js, Express 4, TypeScript                      |
| Auth          | JWT (jsonwebtoken), Bcrypt (bcryptjs)               |
| Build Tools   | Vite (frontend), esbuild (backend server)           |
| Database      | JSON flat-file (database.json)                      |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ and npm v9+

### Installation

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

---

## 📦 NPM Scripts

| Script        | Description                              |
|---------------|------------------------------------------|
| npm run dev   | Start full-stack dev server              |
| npm run build | Build frontend + compile backend server  |
| npm start     | Start production server                  |

---

## 🏗️ Key Architecture Patterns

- **Code Splitting** — Every page uses React.lazy() with Suspense fallback
- **Image Lazy Loading** — LazyImage.tsx with IntersectionObserver API
- **Persistent Navbar** — PublicLayout.tsx wraps all public routes; Navbar never unmounts
- **RBAC** — ProtectedRoute on client + authenticateToken middleware on server
- **Live Block Enforcement** — JWT middleware checks database status on every API request
- **Offline Fallback** — Mock mode activates only on complete network failures

---

© 2026 Electronic Repair Platform. All rights reserved.
