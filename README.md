    TEAM RYZA
  Hope, Inc. ERP

Scrum Master Vidal John Servil V.
UI/UX Designer Claire, Valencia
Developer, Ginaline Lopez
DB Admin Periarce Cherry Rose S.
Test Engineer, Imboc, Raniene C


Project Development and GitHub Management Plan
The goal is to develop a HOPE Management System within eight weeks using GitHub to manage source code, tasks, teamwork, testing, and documentation.

1. Technology stack
Frontend: Next.js, TypeScript, Tailwind CSS

Backend: Next.js API routes and server-side business logic

Database: PostgreSQL

Version control: Git and GitHub

Testing: Vitest and Playwright

Design: Figma for wireframes and high-fidelity mockups

Confirm the technology requirements with your instructor before implementation.

2. Development process
Develop the system in this order:

Project setup: Create the application scaffold, environment configuration, database connection, migrations, and README.

Authentication: Implement registration, login, logout, password hashing, password setup/reset, and session handling.

User Management: Build user listing, editing, blocking, approval, role assignment, and rights management.

Customer and Product: Implement CRUD, search, filtering, soft delete/restore, and product price history.

Human Resources: Implement departments, jobs, employees, job history, salary permissions, and employee profiles.

Sales and Reports: Implement sales transactions, line items, payments, balances, seven reports, PDF output, and audit-log viewing.

Testing and release: Perform security checks, regression testing, usability reviews, database rebuild verification, and final documentation.

Security must be implemented throughout the project. Every protected API must check the user's session and permissions on the server.


Manage the project in GitHub
Repository structure

hope-management-system/
├── src/
├── migrations/
├── scripts/
├── tests/
├── docs/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
├── .env.example
├── .gitignore
└── README.md
