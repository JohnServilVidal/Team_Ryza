# 🚀 Hope ERP System

An all-in-one Enterprise Resource Planning (ERP) web application engineered for modern business management, featuring real-time inventory tracking, secure role-based access control (RBAC), point-of-sale (POS) processing with live stock deductions, and dynamic analytics reporting.

---

## 👥 Scrum Team & Responsibilities
- **Scrum Master / Product Owner:** Oversees sprint planning, backlog grooming, and overall project direction.
- **Developers (Frontend/Backend):** Implemented Next.js App Router architecture, Supabase integration, and core application modules.
- **UI/UX Designer:** Designed a modern, responsive dark-themed user interface utilizing Tailwind CSS.
- **Database Administrator (DB Admin):** Architected Supabase tables (`products`, `profiles`, `sales`), foreign keys, and Row Level Security (RLS) policies.
- **Quality Assurance (Tester):** Executed end-to-end testing, RBAC role verification, and transaction validation.

---

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Version Control:** Git & GitHub (`main-v2` branch workflow)

---

## 📦 Core Sprints & Features

1. **Sprint 1: Authentication & Project Layout**
   - Secure user sign-in and sign-up using Supabase Auth.
   - Welcome / Landing page (`/`) leading to system entry points.
   - Centralized Navigation and Dashboard layout (`/dashboard`).

2. **Sprint 2 & 2.1: Inventory Management**
   - Full CRUD operations (Create, Read, Update, Delete) for products (`/inventory`).
   - Real-time stock quantity adjustments and pricing management.

3. **Sprint 2.2: Role-Based Access Control (RBAC) & User Management**
   - Multi-tier system roles: `super_admin`, `admin`, `developer`, `tester`, and `staff` (`/users`).
   - Secure profile management and administrative privilege handling.

4. **Sprint 3: Sales Module & Live Stock Deduction**
   - Point of Sale (POS) interface (`/sales`).
   - Automated inventory deduction upon successful transaction logging.

5. **Sprint 4: Reports & Analytics Dashboard**
   - Comprehensive revenue tracking metrics and total items sold statistics (`/reports`).
   - Low stock warning alerts for items running low on inventory.

---

## ⚙️ Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/JohnServilVidal/Team_Ryza.git](https://github.com/JohnServilVidal/Team_Ryza.git)
   cd team-ryza-app