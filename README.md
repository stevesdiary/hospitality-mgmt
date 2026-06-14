# 🏨 Hospitality Management Platform

A multi-tenant hotel & guest-house management platform — covering hotels, rooms, facilities, reservations, reviews, and a seamless digital check-in experience. Built with a TypeScript Express API, PostgreSQL, and a modern animated React client.

> ER Diagram: [view on Google Drive](https://drive.google.com/file/d/1wcMPmo-OC0hs_yM52ycmOa5PyPEPK1Hk/view?usp=drive_link)

---

## ✨ Features

### Multi-Tenancy
- **Shared-schema multi-tenancy** — every tenant (Company) is isolated by a `companyId` column on all core resources.
- **Tenant scoping** — queries are automatically scoped to the caller's company via `resolveCompanyScope()`, with ownership enforced by `assertOwnsResource()`.
- **System admins** can see across all tenants; **org admins** are confined to their own company.

### Authentication & Authorization
- **Stateless JWT** authentication (HS256) over `Authorization: Bearer <token>` — no server-side sessions.
- **bcrypt** password hashing.
- **Role hierarchy**: `admin` > `org_admin` > `premium`/`regular` > `guest`.
- **Password reset** via time-limited (12-minute) signed email tokens, delivered with Nodemailer.
- Signup, login, logout, forgot-password, and reset-password flows.

### Hotels
- Full CRUD for hotels (create restricted to `admin` / `org_admin`).
- Rich discovery endpoints: **top deals**, **top hotels by state**, **hotels by city**, **top destinations**, and **availability-by-date** search.
- Faceted search across name/city/state with price-range and facility filters.
- Each hotel aggregates its rooms, facilities, reviews, and reservations.

### Rooms
- CRUD for rooms, linked to a hotel by contact email and inheriting the hotel's `companyId`.
- Room categories, bed types, occupancy, price, condition, and deals flags.

### Facilities
- Per-hotel facility records (restaurant, bar lounge, gym, pool, Wi-Fi, DSTV, CCTV, 24h security/front-desk/electricity, car hire, car park, room service).
- CRUD with tenant scoping.

### Reservations & Digital Check-In
- Guests create reservations against a hotel/room with date ranges and guest counts.
- **Lifecycle status**: `pending` → `confirmed` → `checked-in` → `checked-out`, plus `cancelled` / `no-show`.
- **QR-coded booking confirmation** — guests receive a scannable booking pass instead of filling out paper forms on arrival.
- **Front-desk console** — staff look up a booking by ID (or QR scan), see pre-filled guest details, and check guests in/out with one click. Actual check-in/out timestamps are recorded.

### Ratings & Reviews
- Guests leave reviews scored across cleanliness, comfort, service, security, and location, plus an overall rating.
- Reviews are tenant-scoped and carry the reviewer's name.

### Media / File Storage
- Image uploads backed by **Backblaze B2** object storage.
- Upload endpoint is authenticated, role-gated (`admin` / `org_admin`), rate-limited, and restricted to images (JPEG/PNG/WebP/GIF, max 5 MB), with automatic temp-file cleanup.

### Background Jobs
- **Upstash QStash** serverless queues for email, notifications, reservations, payments, and cleanup tasks (replacing legacy Redis).

### Audit Logging
- All sensitive actions are logged across four event types: `auth`, `data_mutation`, `admin_action`, and `payment`, with actor, resource, IP, user-agent, and success/failure status.

### Security Hardening
- **Helmet** security headers and configurable **CORS** (denies wildcard origins in production).
- **Rate limiting** — global (100 req / 15 min), stricter auth (20 req / 15 min), and upload (10 req / min) tiers.
- **Fail-fast environment validation** — the server refuses to start with missing or weak configuration (e.g. short `JWT_SECRET`, wildcard CORS in production).

### React Client
- **Modern, animated UI** (hotels.ng-inspired) built with React 18, Vite, Tailwind CSS, and Framer Motion.
- Pages: home, hotel listing/detail, search, room detail, booking + QR confirmation, auth (login/register/forgot/reset), user profile/reservations/settings.
- **Admin suite**: dashboard, front desk, and management screens for hotels, rooms, reservations, and users.
- Redux Toolkit for auth state; Axios client with token injection and 401 handling.

---

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|------------|
| API          | Node.js, Express 4, TypeScript |
| Database     | PostgreSQL + Sequelize 6 (soft deletes via `paranoid`) |
| Auth         | JWT (HS256), bcrypt |
| Storage      | Backblaze B2 |
| Queues       | Upstash QStash |
| Email        | Nodemailer |
| Client       | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Redux Toolkit |
| Infra        | Docker (multi-stage), Docker Compose, Nginx |

---

## 📡 API Overview

| Area         | Endpoints |
|--------------|-----------|
| **Auth**     | `POST /signup`, `POST /login`, `POST /logout`, `POST /forgot`, `POST /reset/:token` |
| **Companies**| `POST /companies`, `GET /companies`, `GET /companies/:id`, `PUT /companies/:id`, `DELETE /companies/:id` |
| **Hotels**   | `POST /createhotel`, `GET /findall`, `GET /topdeals`, `GET /tophotels`, `GET /hotels-by-cities`, `GET /topdestinations`, `GET /findone/:id`, `GET /bydate`, `PUT /update/:id`, `DELETE /delete/:id` |
| **Rooms**    | `POST /room`, `GET /room/:id`, `GET /rooms`, `PUT /updateroom/:id`, `DELETE /deleteroom/:id` |
| **Facilities**| `POST /createfacility`, `GET /findfacility/:hotel_id`, `GET /findfacilities`, `PUT /facility/:id`, `DELETE /facility/:id` |
| **Reservations**| `POST /reservation`, `GET /getone/:id`, `GET /getall`, `GET /lookup/:id`, `PUT /checkin/:id`, `PUT /checkout/:id`, `PUT /updatereservation/:id`, `DELETE /deletereservation/:id`, `DELETE /removereservations` |
| **Reviews**  | `POST /createrating/:userId`, `GET /getrating/:id`, `PUT /updaterating/:id`, `DELETE /deleterating/:id` |
| **Users**    | `GET /alluser`, `GET /user/:id`, `PUT /updateuser/:id`, `DELETE /deleteuser/:id` |
| **Upload**   | `POST /upload` |
| **Health**   | `GET /health` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Backblaze B2 account (for image uploads)

### Local development

```bash
# 1. Configure environment
cp .env.example .env        # fill in DB, JWT_SECRET, B2, email, etc.

# 2. Install dependencies
npm install

# 3. Run database migrations
npm run migrate

# 4. Start the API (hot reload)
npm run dev                 # http://localhost:3360

# 5. Start the client
cd CLIENT
npm install
npm run dev                 # http://localhost:3001
```

### Build for production

```bash
npm run build               # compiles TypeScript to dist/
npm start                   # runs dist/app.js
```

### Run the full stack with Docker

```bash
cp .env.example .env        # fill in secrets
docker compose up --build   # postgres + api (:3360) + client (:80)
```

---

## 📂 Project Structure

```
.
├── app.ts                  # Express entry point (security middleware, routes)
├── config/                 # DB config + fail-fast env validation
├── controllers/            # Request handlers (auth, hotel, room, facility, …)
├── middleware/             # auth, role checks, validation, audit, errors
├── models/                 # Sequelize models (User, Hotel, Room, Reservation, …)
├── routes/                 # Express routers
├── services/               # Business logic (auth, hotel, facility, user, …)
├── src/shared/             # B2 storage, QStash, response/validation utils
├── migrations/             # Sequelize migrations
├── CLIENT/                 # React + Vite frontend
├── Dockerfile              # Multi-stage API image
├── docker-compose.yml      # Full-stack orchestration
└── README.md
```

---

## 👤 Author

**Stephen Oyeyemi**

## 📄 License

ISC
