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
│   │   ├── assets.routes.js
│   │   ├── dailyChecks.routes.js
│   │   └── maintenance.routes.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── assets.controller.js
│   │   ├── dailyChecks.controller.js
│   │   └── maintenance.controller.js
│   ├── repositories
│   │   ├── auth.repository.js
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
│   └── seed.sql
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
| `POST` | `/login`            | Login (returns JWT + user)     |
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

## Authentication

- **Login**: `POST /api/v1/login` with `{ "email": "...", "password": "..." }`
- Returns `{ "token": "...", "user": { ... } }`
- Use the token in protected requests: `Authorization: Bearer <token>`
- Seed users have password: `password123` (change in production)

## Implementation Notes

- **RFC endpoints** are implemented as specified: asset management, daily inspection recording, maintenance tracking, and user authentication.
- **Additional CRUD endpoints** (GET list, GET by ID, PATCH, DELETE) were added for assets, daily checks, and maintenance to support full management workflows.
