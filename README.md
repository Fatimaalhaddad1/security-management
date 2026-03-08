# Security Management System

Backend API for managing security screening devices, daily inspections, and maintenance activities across multiple airports (sites).

## Description

This system allows technicians to register devices, perform daily inspections, record maintenance activities, and view operational history. Each user is assigned to one site (airport) and can only access data belonging to that site. It is built according to an RFC specification.

## Tech Stack

- **Node.js** – Runtime
- **Express.js** – Web framework
- **PostgreSQL** – Database (Docker)
- **JWT** – Authentication
- **bcrypt** – Password hashing
- **Swagger** – API documentation (swagger-jsdoc, swagger-ui-express)

## Folder Structure

```
security-management-system
├── src
│   ├── server.js
│   ├── app.js
│   ├── config
│   │   └── db.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── assets.routes.js
│   │   ├── dailyChecks.routes.js
│   │   └── maintenance.routes.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── assets.controller.js
│   │   ├── dailyChecks.controller.js
│   │   └── maintenance.controller.js
│   ├── repositories
│   │   ├── auth.repository.js
│   │   ├── users.repository.js
│   │   ├── assets.repository.js
│   │   ├── dailyChecks.repository.js
│   │   └── maintenance.repository.js
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   └── utils
│       ├── jwt.js
│       └── validators.js
├── database
│   ├── schema.sql
│   ├── seed.sql
│   ├── migration_super_admin.sql
│   └── migration_registration.sql
├── .env
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL with Docker

```bash
docker compose up -d
```

### 4. Run schema and seed

Apply the schema (creates tables):

```bash
docker exec -i security_management_db psql -U postgres -d security_management < database/schema.sql
```

Load sample data (sites, users, assets, daily checks, maintenance records):

```bash
docker exec -i security_management_db psql -U postgres -d security_management < database/seed.sql
```

### 5. Start the server

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The server runs on `http://localhost:3000` by default.

## Database Migrations

Use migrations to update an **existing** database without recreating it. Fresh installs use `schema.sql` and `seed.sql` only.

### migration_super_admin.sql

Adds the `super_admin` role to the users table role constraint. Run if your schema was created before super_admin support.

```bash
docker exec -i security_management_db psql -U postgres -d security_management < database/migration_super_admin.sql
```

Then insert the super_admin user (see `seed.sql` for the INSERT statement).

### migration_registration.sql

Adds the registration and approval flow:
- `status`, `approved_by`, `approved_at` columns
- Nullable `role` and `site_id` (for pending users)
- Constraints for status and role

Run if your database was created with the old users schema (without registration flow).

```bash
docker exec -i security_management_db psql -U postgres -d security_management < database/migration_registration.sql
```

### Fresh database reset

To drop and recreate the database from scratch:

```bash
docker exec -i security_management_db psql -U postgres -c "DROP DATABASE IF EXISTS security_management;"
docker exec -i security_management_db psql -U postgres -c "CREATE DATABASE security_management;"
docker exec -i security_management_db psql -U postgres -d security_management < database/schema.sql
docker exec -i security_management_db psql -U postgres -d security_management < database/seed.sql
```

## Environment Variables

| Variable    | Description                | Example                          |
|-------------|----------------------------|----------------------------------|
| `PORT`      | Server port                | `3000`                           |
| `DB_HOST`   | PostgreSQL host            | `localhost`                      |
| `DB_PORT`   | PostgreSQL port            | `5432`                           |
| `DB_NAME`   | Database name              | `security_management`            |
| `DB_USER`   | Database user              | `postgres`                       |
| `DB_PASSWORD` | Database password        | `postgres` (Docker default)      |
| `JWT_SECRET` | Secret for JWT signing   | *(use a strong secret in production)* |

## Swagger Documentation

Interactive API documentation is available at:

**http://localhost:3000/api-docs**

You can try all endpoints, authenticate with a JWT (Bearer token), and inspect request/response schemas.

## Main API Endpoints

Base URL: `/api/v1`

| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| `POST` | `/register`         | Register (pending approval)    |
| `POST` | `/login`            | Login (returns JWT + user)     |
| `PATCH`| `/users/assign`     | Approve and assign user (super_admin) |
| `GET`  | `/sites`            | List all sites                 |
| `GET`  | `/assets`           | List assets                    |
| `GET`  | `/assets/:id`       | Get asset with history         |
| `POST` | `/assets`           | Create asset                   |
| `PATCH`| `/assets/:id`       | Update asset                   |
| `DELETE`| `/assets/:id`      | Delete asset                   |
| `GET`  | `/daily-checks`     | List daily checks              |
| `GET`  | `/daily-checks/:id` | Get daily check                |
| `POST` | `/daily-checks`     | Record daily inspection        |
| `PATCH`| `/daily-checks/:id` | Update daily check             |
| `DELETE`| `/daily-checks/:id`| Delete daily check             |
| `GET`  | `/maintenance`      | List maintenance records       |
| `GET`  | `/maintenance/:id`  | Get maintenance record         |
| `POST` | `/maintenance`      | Add maintenance record         |
| `PATCH`| `/maintenance/:id`  | Update maintenance record      |
| `DELETE`| `/maintenance/:id` | Delete maintenance record      |

## Authentication & Registration

- **Register**: `POST /api/v1/register` with `{ "full_name": "...", "email": "...", "password": "..." }` — public, creates pending user
- **Login**: `POST /api/v1/login` with `{ "email": "...", "password": "..." }` — only approved users can log in
- **Assign**: `PATCH /api/v1/users/assign` — super_admin only, approves user and assigns role/site
- Use the token in protected requests: `Authorization: Bearer <token>`
- Seed users have password: `password123` (change in production)
- Super admin: `superadmin@company.com` / `password123` — can access all sites

## Implementation Notes

- **RFC endpoints** are implemented as specified: asset management, daily inspection recording, maintenance tracking, and user authentication.
- **Additional CRUD endpoints** (GET list, GET by ID, PATCH, DELETE) were added for assets, daily checks, and maintenance to support full management workflows.
