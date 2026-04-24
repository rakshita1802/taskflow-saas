# Multi-Tenant Task Management System (TaskFlow API)

A robust, multi-tenant task management system built with Node.js and PostgreSQL. It features strict data isolation between organizations, Role-Based Access Control (RBAC), JWT authentication, comprehensive audit logging, and is fully containerized with Docker.

## Project Modules
- **M1:** Project structure, package.json, environment config, folder scaffold
- **M2:** Database schema (PostgreSQL migrations: orgs, users, tasks, audit_logs)
- **M3:** Auth service (JWT login/register, refresh tokens, Redis blacklist)
- **M4:** RBAC middleware (tenant isolation + role permission guards)
- **M5:** Task service (full CRUD with tenant + role enforcement)
- **M6:** Audit log service (auto-record every task action)
- **M7:** OAuth (Google Passport.js strategy + callback flow)
- **M8:** Docker (Dockerfile, docker-compose.yml, nginx config)

## Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL
- Redis
- Docker & Docker Compose (optional, for M8)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the `.env.example` file to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```
   Ensure you provide valid PostgreSQL and Redis connection details.

3. **Database Setup**
   *(To be completed in M2 - Migrations)*

4. **Run the Application**
   - For development (with hot-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## Folder Structure
- `src/config`: Application configurations (DB, Redis, Passport).
- `src/constants`: Reusable constants (Roles, Audit Actions).
- `src/controllers`: Request handlers.
- `src/middleware`: Express middlewares (Auth, Error handling, RBAC, Tenant Isolation).
- `src/models`: Database models / interactors.
- `src/routes`: API route definitions.
- `src/services`: Core business logic.
- `src/utils`: Utility functions (Logger, API Responses).
- `src/validators`: Request payload validation (Joi).
- `migrations`: Database migration scripts.
- `tests`: Test suites.
- `nginx`: NGINX configuration for Docker.

## License
MIT
