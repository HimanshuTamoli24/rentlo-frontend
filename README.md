# Rentlo – Property Rental & Visit Management Platform

Rentlo is a premium property rental discovery and visit scheduling platform that connects tenants, owners, and administrators in a seamless, role-based ecosystem. Built with a focus on structured workflows and high-performance technologies, Rentlo streamlines the journey from property discovery to move-in.

---

## 🏗️ Architecture & Core Flows

Rentlo is built on a modular architecture with a clear separation of concerns between the frontend and backend.

### 🔄 System Workflows

The platform is driven by strict state transitions for both property listings and user visits.

#### Tenant Journey:

1.  **Discovery**: Search and filter properties by location, budget, and amenities.
2.  **Engagement**: Request a physical property visit.
3.  **Coordination**: Owners schedule sessions based on requests.
4.  **Completion**: Visit the property → Receive decision/Approval → Move-in.

#### Property Lifecycle:

`DRAFT` ➔ `REVIEW` ➔ `PUBLISHED`

#### Visit Lifecycle:

`REQUESTED` ➔ `SCHEDULED` ➔ `VISITED` ➔ `DECISION (Approved/Rejected)`

### 🖼️ Architecture References (tldraw)

![System Architecture](file:///c:/notagain/rentlo-frontend/public/images/1.png)
_Figure 1: High-level architecture, database schemas, and module interactions._

![UI Components](file:///c:/notagain/rentlo-frontend/public/images/2.png)
_Figure 2: Frontend layout design and component structure._

![Visit Management Flow](file:///c:/notagain/rentlo-frontend/public/images/3.png)
_Figure 3: Detailed visit management and owner-tenant interaction flow._

---

## 🛠️ Tech Stack

### Frontend (`rentlo-frontend`)

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Radix UI (Headless components)
- **State & Data**: TanStack React Query 5, Axios
- **Forms**: React Hook Form, Zod (Schema validation)
- **UI/UX**: Lucide React (Icons), Sonner (Toasts), Facehash (Dynamic avatars)
- **Routing**: React Router 7

### Backend (`renlo-backend`)

- **Runtime**: Node.js / Bun
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (Authentication), HttpOnly Cookies, Helmet, Bcrypt
- **Validation**: Zod
- **Logging**: Pino

---

## 🚦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>

# Install Frontend Dependencies
cd rentlo-frontend
bun install

# Install Backend Dependencies
cd ../renlo-backend
bun install
```

### 2. Environment Configuration

Create `.env` files in both directories based on the `.env.sample` provided.

### 3. Run Development Servers

```bash
# Start Backend (from renlo-backend)
bun run dev

# Start Frontend (from rentlo-frontend)
bun run dev
```

---

## 💻 Coding Practices & Principles

- **Modular Design**: Code is split into logical modules (Auth, List, User, Visit) for both FE and BE.
- **RESTful API**: Standardized responses using a custom `ApiResponse` class.
- **RBAC (Role-Based Access Control)**: Strict route protection for `TENANT`, `OWNER`, and `BIGBOSS`.
- **Schema-First Validation**: Every API request and form is validated using Zod schemas.
- **Premium UI**: Focus on custom animations, glassmorphism, and responsive layouts.
- **Express Proxy Trust**: Configured for secure cookie handling in production environments (Render/Vercel).

---

## 👤 User Roles

- **TENANT**: Browse properties, request visits, track visit history, manage profile.
- **OWNER**: Manage listings (Create/Edit), schedule visits, approve/reject visit requests.
- **BIGBOSS (Admin)**: System-wide oversight, user management, and platform analytics.
