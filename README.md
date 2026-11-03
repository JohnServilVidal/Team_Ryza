# 🚀 Hope ERP System

An all-in-one Enterprise Resource Planning (ERP) web application engineered for modern business operations. The platform integrates real-time inventory tracking, multi-tier Role-Based Access Control (RBAC), Point of Sale (POS) transaction processing with live stock deduction, and interactive analytics reporting.

---

## 👥 Scrum Team Roles & Technical Deliverables

### 👔 Product Owner / Scrum Master
- **Sprint 1:** Defined MVP scope, established project repository, managed backlog, and enforced GitHub Pull Request (PR) workflow targeting `main-v2`.
- **Sprint 2 & 2.1:** Facilitated Sprint Planning for Inventory management, prioritizing product categorization and core CRUD operations.
- **Sprint 2.2:** Defined security criteria and privilege boundaries for multi-tier system roles (`super_admin`, `admin`, `developer`, `tester`, `staff`).
- **Sprint 3 & 4:** Conducted Sprint Reviews and Acceptance Testing for POS integration, stock deduction logic, and executive reporting metrics.

### 💻 Developers (Frontend & Backend)
- **Sprint 1:** Configured Next.js App Router layout, environment variables, Supabase client authentication, and routing architecture (`/`, `/login`, `/dashboard`).
- **Sprint 2 & 2.1:** Implemented full Inventory CRUD logic (`/inventory`), handling modal forms, server state updates, and product deletions.
- **Sprint 2.2:** Built User Management UI (`/users`) and integrated role selection APIs backed by Supabase profiles.
- **Sprint 3:** Engineered POS interface (`/sales`) with automated transactional backend logic to deduct stock levels upon checkout.
- **Sprint 4:** Developed Reports & Analytics page (`/reports`), calculating real-time aggregates for revenue, total units sold, and low-stock alerts.

### 🎨 UI/UX Designer
- **Sprint 1:** Created the visual layout hierarchy, color system (slate dark theme with emerald accents), and responsive navigation headers.
- **Sprint 2 & 2.1:** Designed user-friendly inventory tables, modal dialogs for product creation/editing, and status badges.
- **Sprint 2.2:** Formatted user management cards, role selector dropdowns, and permission indicator tags.
- **Sprint 3:** Styled the Point-of-Sale (POS) grid interface, shopping cart component, and checkout workflow.
- **Sprint 4:** Designed summary metric cards, alert banners for low stock, and structured transaction history tables.

### 🗄️ Database Administrator (DB Admin)
- **Sprint 1:** Set up Supabase PostgreSQL project instance and initialized core authentication schemas.
- **Sprint 2 & 2.1:** Designed `products` database table schema (SKU, title, price, quantity, status) and established indexes for high performance.
- **Sprint 2.2:** Architected `profiles` schema with foreign key mapping to Auth users and defined Row-Level Security (RLS) policies for RBAC enforcement.
- **Sprint 3:** Created `sales` transactions database table and implemented ACID-compliant updates for inventory stock deduction.
- **Sprint 4:** Formatted SQL aggregation queries for revenue summation, sales history retrieval, and low-stock threshold triggers.

### 🧪 Quality Assurance (QA / Tester)
- **Sprint 1:** Executed authentication flow tests (sign-up, log-in, invalid credentials error handling, and route protection).
- **Sprint 2 & 2.1:** Performed edge-case functional testing on inventory CRUD operations (negative price values, empty inputs, duplicate SKUs).
- **Sprint 2.2:** Verified RBAC boundary enforcement—testing restricted actions across Super Admin, Admin, Dev, Tester, and Staff roles.
- **Sprint 3:** Tested POS checkout flow, verifying that completed sales correctly reduce physical stock in the database in real-time.
- **Sprint 4:** Validated mathematical accuracy of financial reporting totals, item counts, and low-stock notification triggers.

---

## 📦 Sprint Breakdown & Deliverables Summary

| Sprint | Module | Key Features / Deliverables |
| :--- | :--- | :--- |
| **Sprint 1** | Authentication & Core Routing | Welcome page (`/`), Sign-in/up (`/login`), Next.js router setup, base layout. |
| **Sprint 2 & 2.1** | Inventory Management | Full CRUD operations for products, pricing, and stock monitoring (`/inventory`). |
| **Sprint 2.2** | User Management & RBAC | Role assignment UI, privilege enforcement, Supabase RLS security (`/users`). |
| **Sprint 3** | Sales & POS | Sales terminal, automated live inventory stock deduction (`/sales`). |
| **Sprint 4** | Reports & Analytics | Total Revenue, Units Sold metrics, Low Stock Alerts, sales logs (`/reports`). |

---

## ⚙️ Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/JohnServilVidal/Team_Ryza.git](https://github.com/JohnServilVidal/Team_Ryza.git)
   cd team-ryza-app