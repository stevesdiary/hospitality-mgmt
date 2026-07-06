# Product Requirements Document (PRD)
## Hospitality Management Platform

**Version:** 1.0  
**Status:** Draft  
**Date:** 2026-06-14  
**Author:** [PRODUCT OWNER]  
**Reviewed By:** [TO BE ASSIGNED]

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [Success Metrics](#4-success-metrics)
5. [Users & Personas](#5-users--personas)
6. [Assumptions & Constraints](#6-assumptions--constraints)
7. [Functional Requirements](#7-functional-requirements)
   - 7.1 Authentication & Account Management
   - 7.2 Multi-Tenancy & Company Management
   - 7.3 Hotel Management
   - 7.4 Room Management
   - 7.5 Facility Management
   - 7.6 Discovery & Search
   - 7.7 Reservations & Booking
   - 7.8 Digital Check-In / Check-Out
   - 7.9 Ratings & Reviews
   - 7.10 Media & File Uploads
   - 7.11 Background Jobs & Notifications
   - 7.12 Audit Logging
   - 7.13 Admin Suite
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Data Model Reference](#9-data-model-reference)
10. [API Reference](#10-api-reference)
11. [UI / UX Requirements](#11-ui--ux-requirements)
12. [Security Requirements](#12-security-requirements)
13. [Compliance & Legal Requirements](#13-compliance--legal-requirements)
14. [Infrastructure & Deployment](#14-infrastructure--deployment)
15. [Out of Scope (v1)](#15-out-of-scope-v1)
16. [Open Questions](#16-open-questions)
17. [Milestones & Launch Checklist](#17-milestones--launch-checklist)

---

## 1. Executive Summary

The **Hospitality Management Platform** is a multi-tenant SaaS marketplace that
connects Nigerian hotel and guest-house owners with domestic and international
travellers. Hotel Owners list their properties and manage operations (rooms,
facilities, reservations, check-in/check-out) through a unified dashboard. Guests
discover, compare, and book hotels with a fully digital experience that eliminates
paper-form check-in.

The platform is built on a TypeScript/Express API with PostgreSQL, and a React 18
single-page application, deployed as containerised services.

---

## 2. Problem Statement

### For Guests

- Booking a hotel in Nigeria often requires phone calls, WhatsApp messages, or
  walk-ins with no guarantee of availability.
- Physical check-in forms at reception waste time and create data-entry errors.
- There is no single trusted platform for comparing prices, amenities, and reviews
  across Nigerian hotels.

### For Hotel Owners

- Managing reservations, room availability, and guest data relies on spreadsheets,
  WhatsApp groups, and paper ledgers.
- No centralised system exists for tracking check-in/check-out status,
  occupancy, or guest history.
- Listing on international OTAs (Booking.com, Expedia) requires complex setups
  and high commission rates that disadvantage smaller operators.

---

## 3. Product Vision & Goals

**Vision:** Build the definitive Nigerian hotel booking and management platform —
one that is as easy for a guest-house owner in Ibadan to operate as for a
business traveller in Lagos to use.

### Goals

| # | Goal | Target |
|---|------|--------|
| G1 | Enable Hotel Owners to go fully digital in ≤ 1 day | Onboarding to first live listing in < 24 h |
| G2 | Eliminate paper check-in forms entirely | 100% of check-ins done via QR scan by launch |
| G3 | Provide Guests with rich discovery and instant booking confirmation | Booking confirmation delivered < 60 s after payment |
| G4 | Ensure Guest and Hotel Owner data is protected per NDPA 2023 | Zero data-protection enforcement actions at launch |
| G5 | Build a financially sustainable platform via commission | Platform commission collected on every successful booking |

---

## 4. Success Metrics

| Metric | Definition | v1 Target |
|--------|-----------|-----------|
| **Hotel Owners onboarded** | Companies created + at least 1 live hotel + 1 room | 50 within 90 days of launch |
| **Reservations completed** | Bookings reaching `checked-out` status | 500 within 90 days |
| **Check-in digitalisation rate** | % of check-ins done via QR / front-desk console | ≥ 90% |
| **Booking confirmation time** | p95 latency from payment to confirmation email | < 60 s |
| **System uptime** | Monthly platform availability | ≥ 99.5% |
| **Support ticket volume** | Tickets per 100 bookings | < 5 |
| **Review submission rate** | % of completed stays that generate a review | ≥ 20% |

---

## 5. Users & Personas

### 5.1 Guest (Traveller)

**Who:** Nigerian domestic traveller, business professional, or diaspora visitor
aged 22–55 with a smartphone and a Nigerian bank card.

**Goals:**
- Find a hotel in a specific city that fits their budget and amenity preferences.
- Book instantly without phone calls.
- Arrive at the hotel and check in quickly without filling out paper forms.
- Leave a review after their stay.

**Pain points:** Unreliable availability information, no single trusted comparison
source, time-consuming paper check-in.

**Access level:** `regular` / `premium`

---

### 5.2 Hotel Owner (Tenant)

**Who:** Owner or manager of a Nigerian hotel, guest-house, or serviced apartment,
ranging from a 5-room family business to a 100-room commercial hotel.

**Goals:**
- List their property, set room prices and availability, and start receiving
  bookings within a day.
- Manage day-to-day operations: track upcoming reservations, check guests in and
  out, and view occupancy at a glance.
- Respond to reviews to maintain their reputation.

**Pain points:** Manual reservation tracking, paper guest registration forms,
no consolidated view of occupancy.

**Access level:** `org_admin` (scoped to their own Company / `companyId`)

---

### 5.3 Front-Desk Staff

**Who:** Hotel receptionist or front-desk agent employed by a Hotel Owner.

**Goals:**
- Look up an incoming guest's reservation by booking ID or QR scan.
- Check the guest in with one click and hand over a key card.
- Check guests out and record the timestamp.

**Pain points:** Manual form-filling, delays at reception, lost paper records.

**Access level:** `org_admin` or a future `staff` role (see Section 15)

---

### 5.4 Platform Administrator

**Who:** Internal [COMPANY LEGAL NAME] staff responsible for tenant onboarding,
platform integrity, and support escalations.

**Goals:**
- Provision new Tenant (Company) accounts.
- View and manage all hotels, users, and reservations across all tenants.
- Investigate suspicious activity via audit logs.
- Remove listings or users that violate the Terms of Use.

**Access level:** `admin` (system-wide)

---

## 6. Assumptions & Constraints

| # | Assumption / Constraint |
|---|------------------------|
| A1 | Users have smartphones with internet access (3G or better). |
| A2 | Hotel Owners have a business email address and a Nigerian phone number. |
| A3 | Payments will be processed via **Stripe**; integration with local payment gateways (Paystack, Flutterwave) is deferred to v2. |
| A4 | The platform is primary for the Nigerian market; all phone numbers are in Nigerian format (+234 / 0XX). |
| A5 | The platform does not own or operate any hotels; it is a marketplace only. |
| A6 | NDPA 2023 compliance is a hard requirement before live data collection from real users. |
| A7 | The API and client are deployed as Docker containers on a single VPS for v1; Kubernetes migration is deferred. |
| A8 | Image storage is provided by Backblaze B2; CDN distribution is deferred to v2. |
| A9 | Bed-type tracking (single/double/king) and room-photo management per room are deferred to v2. |

---

## 7. Functional Requirements

### 7.1 Authentication & Account Management

#### Registration

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | A new user can register with first name, last name, email, Nigerian phone number, and password. | Must |
| AUTH-02 | Phone numbers must be validated to Nigerian format (starts with +234 or 0, followed by 10 digits). | Must |
| AUTH-03 | Passwords must meet a minimum security standard (minimum 8 characters, mix of characters). | Must |
| AUTH-04 | Email addresses must be unique across the platform. | Must |
| AUTH-05 | New accounts are assigned the `regular` role by default. | Must |
| AUTH-06 | A Hotel Owner's `org_admin` role is assigned by a platform `admin` when their Company is provisioned. | Must |

#### Login & Session

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-07 | Users log in with email + password; the system returns a signed JWT (HS256, 7-day expiry). | Must |
| AUTH-08 | The JWT payload carries: `id`, `email`, `type` (role), `companyId`. | Must |
| AUTH-09 | All protected endpoints require the JWT in the `Authorization: Bearer <token>` header. | Must |
| AUTH-10 | A 401 response on the client redirects the user to `/login` and clears the stored token. | Must |
| AUTH-11 | Logout invalidates the client-side token (server-side stateless; no token blocklist in v1). | Must |

#### Password Reset

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-12 | A user can request a password-reset link by submitting their email address. | Must |
| AUTH-13 | The system sends a signed reset token to the user's email via Nodemailer (Gmail SMTP). | Must |
| AUTH-14 | Reset tokens expire after **12 minutes**. | Must |
| AUTH-15 | Submitting a valid token + new password updates the bcrypt hash and invalidates the token. | Must |

#### Rate Limiting

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-16 | Auth endpoints (`/signup`, `/login`, `/forgot`, `/reset`) are rate-limited to **20 requests / 15 minutes** per IP. | Must |

---

### 7.2 Multi-Tenancy & Company Management

| ID | Requirement | Priority |
|----|-------------|----------|
| MT-01 | Every Hotel Owner operates under a **Company** (Tenant) record. A Company has: name, contact email, contact phone, address, logo URL, and `isActive` flag. | Must |
| MT-02 | Only a platform `admin` can create or delete a Company. | Must |
| MT-03 | All core resources (Hotel, Room, Facility, Reservation, Review, MediaFile) carry a `companyId` foreign key. | Must |
| MT-04 | All queries by `org_admin` and `regular`/`premium` users are automatically scoped to their `companyId` via `resolveCompanyScope()`. | Must |
| MT-05 | An `org_admin` can only read/modify resources belonging to their own Company. | Must |
| MT-06 | A platform `admin` can read/modify resources across all Companies. | Must |
| MT-07 | An `org_admin` can view their own Company record and update non-critical fields (name, logo, contact). | Should |
| MT-08 | Deactivating a Company (`isActive: false`) prevents new bookings but does not delete historical data. | Should |

---

### 7.3 Hotel Management

| ID | Requirement | Priority |
|----|-------------|----------|
| HTL-01 | An `admin` or `org_admin` can create a hotel with: name, address, city, state, description, hotel type, number of rooms, contact email, contact phone, and optional terms & conditions. | Must |
| HTL-02 | Hotel types: `budget`, `mid-range`, `luxury`, `resort`, `boutique`. | Must |
| HTL-03 | A room is linked to a hotel via the hotel's `contactEmail` (used to look up and inherit `companyId` at room creation). | Must |
| HTL-04 | An `admin` or `org_admin` can update a hotel they own. | Must |
| HTL-05 | An `admin` or `org_admin` can soft-delete a hotel; the record is flagged `deletedAt` and hidden from public listings. | Must |
| HTL-06 | Hotel detail responses aggregate: rooms, facilities, reviews, and reservations. | Must |
| HTL-07 | A hotel with no associated rooms must not appear in booking search results. | Must |

---

### 7.4 Room Management

| ID | Requirement | Priority |
|----|-------------|----------|
| RM-01 | An `admin` or `org_admin` can create a room linked to a hotel, specifying: category, capacity, description, price, check-in time, check-out time, availability, deals/discount, discount code, and condition. | Must |
| RM-02 | Room categories: `regular`, `luxury`, `conference`, `event hall`, `studio apartment`. | Must |
| RM-03 | Room condition: `excellent`, `good`, `fair`, `needs-maintenance`. | Must |
| RM-04 | The `availability` flag (boolean) is used for manual marking. Date-range availability is checked dynamically via the reservation table. | Must |
| RM-05 | A room's `companyId` is inherited from its parent hotel at creation time. | Must |
| RM-06 | Rooms can be soft-deleted; existing confirmed reservations against a deleted room are not automatically cancelled (they must be handled manually). | Must |
| RM-07 | Deal/discount information (percentage + optional promo code) is stored on the room and surfaced in search results. | Should |

---

### 7.5 Facility Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FAC-01 | An `admin` or `org_admin` can create a facility record for a hotel. | Must |
| FAC-02 | Facility fields (all boolean unless noted): restaurant (string — name/type), bar lounge, security, Wi-Fi/internet, swimming pool, DSTV, gym, CCTV, car hire, room service, 24-hour front desk, 24-hour electricity, car park. | Must |
| FAC-03 | A hotel has at most one Facility record. Creating a second record for the same hotel is an error. | Must |
| FAC-04 | Facility data is included in hotel detail responses and surfaced as filter options on the discovery/search pages. | Must |
| FAC-05 | An `org_admin` can update or delete their hotel's facility record. | Must |

---

### 7.6 Discovery & Search

| ID | Requirement | Priority |
|----|-------------|----------|
| DISC-01 | **All Hotels listing** — returns all active hotels; supports pagination. No authentication required. | Must |
| DISC-02 | **Top Deals** — returns hotels with rooms that have a `deals` value set (discounted rooms). Sorted by discount depth. | Must |
| DISC-03 | **Top Hotels by State** — groups hotels by Nigerian state; surfaces the highest-rated hotel per state. | Must |
| DISC-04 | **Hotels by City** — filters hotels by city name (case-insensitive). | Must |
| DISC-05 | **Top Destinations** — returns the most-booked or most-reviewed cities/states. | Must |
| DISC-06 | **Availability by Date** — filters rooms/hotels where no confirmed reservation overlaps the requested date range. | Must |
| DISC-07 | **Faceted Search** — allows filtering by: city, state, price range (min/max), and facility amenities (Wi-Fi, pool, gym, etc.). | Must |
| DISC-08 | **Full-text search** — searches across hotel name, city, and state fields. | Should |
| DISC-09 | Discovery endpoints are publicly accessible without authentication. | Must |
| DISC-10 | Hotel listing cards show: name, city, state, price (lowest room price), overall rating, and deal badge (if applicable). | Must |

---

### 7.7 Reservations & Booking

#### Creating a Reservation

| ID | Requirement | Priority |
|----|-------------|----------|
| RES-01 | An authenticated user (any role) can create a reservation by specifying: hotel ID, room ID, check-in date, check-out date, and guest count. | Must |
| RES-02 | The system must validate that the room is available for the requested date range (no overlapping `confirmed` or `checked-in` reservation exists). | Must |
| RES-03 | A newly created reservation starts with status `pending`. | Must |
| RES-04 | On successful reservation creation, a **Booking Confirmation** email is sent to the guest containing: booking ID, hotel name, room, dates, guest count, and QR code data. | Must |
| RES-05 | Guest count defaults to 1 if not specified. | Must |
| RES-06 | The `companyId` of the reservation is inherited from the hotel. | Must |

#### Reservation Status Lifecycle

| ID | Requirement | Priority |
|----|-------------|----------|
| RES-07 | Status transitions: `pending` → `confirmed` → `checked-in` → `checked-out`. | Must |
| RES-08 | Status `cancelled` can be reached from `pending` or `confirmed`. | Must |
| RES-09 | Status `no-show` can be set by `org_admin` / `admin` when a guest fails to arrive. | Should |
| RES-10 | Invalid status transitions (e.g., `checked-out` → `checked-in`) are rejected with a 409 Conflict response. | Must |

#### Viewing & Managing Reservations

| ID | Requirement | Priority |
|----|-------------|----------|
| RES-11 | A guest can view their own reservations (all statuses). | Must |
| RES-12 | An `org_admin` can view all reservations for their Company's hotels. | Must |
| RES-13 | A platform `admin` can view all reservations across all tenants. | Must |
| RES-14 | A guest can cancel a reservation in `pending` or `confirmed` status; cancellation policy is enforced at the application layer. | Must |
| RES-15 | An `admin` / `org_admin` can bulk-delete reservations. | Should |

---

### 7.8 Digital Check-In / Check-Out

#### QR Booking Pass

| ID | Requirement | Priority |
|----|-------------|----------|
| CKI-01 | Upon booking confirmation, the guest receives a **QR-coded Booking Pass** containing their booking UUID, displayable on the `/booking/:id/confirmation` page. | Must |
| CKI-02 | The QR code encodes the booking ID at error-correction level `H` (high redundancy), size 160 px on screen. | Must |
| CKI-03 | The confirmation page displays: hotel name, room, check-in/check-out dates, guest count, guest name and email, and actual check-in time (if already checked in). | Must |
| CKI-04 | The guest can print the confirmation page via a browser print dialog. | Should |

#### Front-Desk Console

| ID | Requirement | Priority |
|----|-------------|----------|
| CKI-05 | `org_admin` / `admin` can access the **Front-Desk Console** at `/admin/front-desk`. | Must |
| CKI-06 | Staff can look up any reservation by booking ID (manual entry or QR scan). | Must |
| CKI-07 | The lookup response displays pre-filled guest details: full name, email, phone, hotel, room, dates, guest count. | Must |
| CKI-08 | A "Check In — Issue Key Card" button transitions the reservation to `checked-in` and records `checkInTime: new Date()`. | Must |
| CKI-09 | A "Check Out Guest" button transitions the reservation to `checked-out` and records `checkOutTime: new Date()`. | Must |
| CKI-10 | The console shows the current status badge and displays actual `checkInTime` / `checkOutTime` once recorded. | Must |
| CKI-11 | The front-desk console does not display the main site navigation (no `MainLayout` wrapper). | Should |
| CKI-12 | Invalid transitions (e.g., checking in a `checked-out` guest) are rejected with a descriptive error message. | Must |

---

### 7.9 Ratings & Reviews

| ID | Requirement | Priority |
|----|-------------|----------|
| REV-01 | An authenticated user can submit one review per hotel stay. | Must |
| REV-02 | Review fields: title, body text, like (boolean), overall rating (1–5), and individual category scores for: cleanliness, comfort, service, security, location (all 1–5). | Must |
| REV-03 | Reviews are displayed on the hotel detail page with reviewer's first name, last name, date, and scores. | Must |
| REV-04 | A user can update or delete their own review. | Must |
| REV-05 | Reviews are tenant-scoped (a review can only be made against a hotel in the same Company scope). | Must |
| REV-06 | Platform `admin` can delete any review for policy violations. | Should |
| REV-07 | Hotel Owners can see all reviews for their hotels; they cannot delete guest reviews without admin escalation. | Should |
| REV-08 | A hotel's aggregate overall rating is computed from the `overallRating` field across all its reviews. | Should |

---

### 7.10 Media & File Uploads

| ID | Requirement | Priority |
|----|-------------|----------|
| MED-01 | `admin` / `org_admin` users can upload images via `POST /upload`. | Must |
| MED-02 | Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`. All others are rejected with 400. | Must |
| MED-03 | Maximum file size: **5 MB**. Larger files are rejected. | Must |
| MED-04 | Files are stored in **Backblaze B2** object storage. The returned URL is stored as `fileUrl` in the MediaFile record. | Must |
| MED-05 | Temporary files on the server's local disk are deleted in a `finally {}` block after B2 upload, regardless of success or failure. | Must |
| MED-06 | Upload endpoint is rate-limited to **10 requests / minute** per authenticated user. | Must |
| MED-07 | A MediaFile record links the uploaded file to a hotel and/or room. | Must |
| MED-08 | Hotel detail responses include associated MediaFile URLs for rendering gallery images. | Should |

---

### 7.11 Background Jobs & Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| JOB-01 | Transactional emails (booking confirmation, password reset, cancellation notice) are dispatched via **Upstash QStash** serverless queues to decouple email delivery from the HTTP request path. | Must |
| JOB-02 | QStash message signatures are verified using `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` to prevent spoofed queue messages. | Must |
| JOB-03 | Failed queue jobs are retried by QStash per its default retry policy. | Must |
| JOB-04 | Notification types in scope: reservation confirmation, reservation cancellation, password reset, no-show notification (to Hotel Owner). | Must |
| JOB-05 | Payment confirmation and payout notification queues are defined but not yet connected to a payment processor in v1. | Should |

---

### 7.12 Audit Logging

| ID | Requirement | Priority |
|----|-------------|----------|
| AUD-01 | All sensitive operations are written to an **AuditLog** table with: actor ID, event type, resource type, resource ID, IP address, user-agent, and success/failure status. | Must |
| AUD-02 | Audit event types: `auth`, `data_mutation`, `admin_action`, `payment`. | Must |
| AUD-03 | Auth events captured: login (success/fail), logout, password reset request, password changed. | Must |
| AUD-04 | Data mutation events captured: hotel create/update/delete, room create/update/delete, reservation create/update/delete, check-in, check-out, user update/delete. | Must |
| AUD-05 | Admin action events captured: company create/delete, user role change, review deletion. | Must |
| AUD-06 | Audit logs are retained for **2 years** and are not soft-deleted. | Must |
| AUD-07 | Platform `admin` can query audit logs (implementation timeline: v1.1). | Should |

---

### 7.13 Admin Suite

| ID | Requirement | Priority |
|----|-------------|----------|
| ADM-01 | **Admin Dashboard** (`/admin`) — displays KPI summary cards: total hotels, total rooms, total users, total reservations, occupancy rate, and recent activity. | Must |
| ADM-02 | **Manage Hotels** (`/admin/hotels`) — list, create, edit, and delete hotels. | Must |
| ADM-03 | **Manage Rooms** (`/admin/rooms`) — list, create, edit, and delete rooms. | Must |
| ADM-04 | **Manage Reservations** (`/admin/reservations`) — list all reservations with status filters; update status manually. | Must |
| ADM-05 | **Manage Users** (`/admin/users`) — list all users; change roles; soft-delete accounts. | Must |
| ADM-06 | **Front-Desk Console** (`/admin/front-desk`) — booking lookup, QR scan, check-in, check-out. | Must |
| ADM-07 | All admin pages are protected by `ProtectedRoute` requiring `admin` or `org_admin` role. | Must |
| ADM-08 | `org_admin` views in admin pages are automatically scoped to their Company; they cannot see other tenants' data. | Must |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P1 | API response time (p95) for search and listing endpoints | < 500 ms |
| NFR-P2 | API response time (p95) for authenticated CRUD operations | < 300 ms |
| NFR-P3 | Booking confirmation email delivered after payment | < 60 s |
| NFR-P4 | Image upload (5 MB file) to B2 and response | < 10 s |
| NFR-P5 | React client initial page load (LCP) | < 3 s on 3G |

### 8.2 Availability & Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-A1 | Monthly API uptime | ≥ 99.5% |
| NFR-A2 | Database backup frequency | Daily, retained 30 days |
| NFR-A3 | Graceful degradation: if QStash is unavailable, email is queued for retry; the booking confirmation response is still returned synchronously | Required |

### 8.3 Scalability

| ID | Requirement |
|----|-------------|
| NFR-S1 | The API is stateless (JWT, no server sessions) and can be horizontally scaled behind a load balancer without sticky sessions. |
| NFR-S2 | The multi-tenant `companyId` column is indexed on all core tables to ensure per-tenant queries remain efficient as row counts grow. |
| NFR-S3 | Soft deletes (`paranoid: true`) are used throughout; all queries include `WHERE deletedAt IS NULL` via Sequelize default scoping. |

### 8.4 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-M1 | All backend code is written in TypeScript with strict type checking. |
| NFR-M2 | Environment configuration is validated at server startup via `validateEnv()`; the server refuses to start with missing or invalid config. |
| NFR-M3 | Database schema changes are managed via Sequelize migrations (never `sync({ force: true })` in production). |

---

## 9. Data Model Reference

### Entity Relationships

```
Company (1) ──< (N) User
Company (1) ──< (N) Hotel
Hotel   (1) ──< (N) Room
Hotel   (1) ──< (1) Facility
Hotel   (1) ──< (N) RatingAndReview
Hotel   (1) ──< (N) Reservation
Hotel   (1) ──< (N) MediaFile
Room    (1) ──< (N) Reservation
Room    (1) ──< (N) MediaFile
User    (1) ──< (N) Reservation
User    (1) ──< (N) RatingAndReview
```

### Field Summary by Model

#### User
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | UUIDV4, auto |
| firstName | STRING | Required |
| lastName | STRING | Required |
| gender | ENUM | `male`, `female`, `other` |
| phoneNumber | BIGINT | Nigerian format |
| email | STRING | Unique, required |
| password | STRING(64) | bcrypt hash |
| type | ENUM | `guest`, `regular`, `premium`, `org_admin`, `admin` |
| companyId | UUID (FK) | → Companies.id |

#### Hotel
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | |
| name | STRING | Required |
| address | STRING | Required |
| city | STRING | Required |
| state | STRING | Required |
| description | STRING | Required |
| hotelType | STRING | `budget` / `mid-range` / `luxury` / `resort` / `boutique` |
| numberOfRooms | INTEGER | |
| contactEmail | STRING | Used to link rooms |
| contactPhone | INTEGER | |
| termsAndConditions | STRING | |
| companyId | UUID (FK) | → Companies.id |

#### Room
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | |
| hotelId | UUID (FK) | → Hotels.id |
| companyId | UUID (FK) | → Companies.id |
| category | ENUM | `regular`, `luxury`, `conference`, `event hall`, `studio apartment` |
| capacity | INTEGER | Required |
| description | STRING | Required |
| price | INTEGER | Nightly rate (NGN) |
| deals | INTEGER | Discount % if active |
| discount | INTEGER | Discount amount |
| discountCode | STRING | Promo code |
| checkIn | TIME | Default check-in time |
| checkOut | TIME | Default check-out time |
| availability | BOOLEAN | Manual flag |
| condition | STRING | `excellent`, `good`, `fair`, `needs-maintenance` |

#### Reservation
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | UUIDV4, auto |
| hotelId | UUID (FK) | → Hotels.id |
| roomId | UUID (FK) | → Rooms.id |
| userId | UUID (FK) | → Users.id |
| companyId | UUID (FK) | → Companies.id |
| dateIn | DATE | Check-in date |
| dateOut | DATE | Check-out date |
| guestCount | INTEGER | Default 1 |
| status | ENUM | `pending`, `confirmed`, `checked-in`, `checked-out`, `cancelled`, `no-show` |
| paymentStatus | BOOLEAN | |
| checkInTime | DATE | Actual check-in timestamp |
| checkOutTime | DATE | Actual check-out timestamp |

#### Facility
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | |
| hotelId | UUID (FK) | → Hotels.id |
| companyId | UUID (FK) | → Companies.id |
| restaurant | STRING | Name or type |
| barLounge | BOOLEAN | |
| security | BOOLEAN | |
| wifiInternet | BOOLEAN | |
| swimmingPool | BOOLEAN | |
| dstv | BOOLEAN | |
| gym | BOOLEAN | |
| cctv | BOOLEAN | |
| carHire | BOOLEAN | |
| roomService | BOOLEAN | |
| frontDesk24h | BOOLEAN | |
| electricity24h | BOOLEAN | |
| carPark | BOOLEAN | |

#### RatingAndReview
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | |
| hotelId | UUID (FK) | → Hotels.id |
| userId | UUID (FK) | → Users.id |
| companyId | UUID (FK) | → Companies.id |
| reviewTitle | STRING | Required |
| date | DATE | |
| firstName / lastName | STRING | Reviewer name |
| review | STRING | Body text |
| like | BOOLEAN | Thumbs up/down |
| overallRating | INTEGER | 1–5 |
| cleanliness | INTEGER | 1–5 |
| comfort | INTEGER | 1–5 |
| service | INTEGER | 1–5 |
| security | INTEGER | 1–5 |
| location | INTEGER | 1–5 |

#### Company
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | |
| name | STRING | Required |
| contactEmail | STRING | Unique |
| contactPhone | BIGINT | |
| address | STRING | |
| logoUrl | STRING | |
| isActive | BOOLEAN | Default true |

---

## 10. API Reference

### Base URL

```
Production:  https://api.yourdomain.com/api
Development: http://localhost:3360/api
```

### Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt-token>
```

### Rate Limits

| Tier | Limit | Scope |
|------|-------|-------|
| Global | 100 req / 15 min | Per IP |
| Auth endpoints | 20 req / 15 min | Per IP |
| Upload endpoint | 10 req / 1 min | Per authenticated user |

### Endpoints

#### Auth

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/signup` | — | — | Register new user |
| POST | `/login` | — | — | Login; returns JWT |
| POST | `/logout` | Bearer | any | Logout |
| POST | `/forgot` | — | — | Request password reset email |
| POST | `/reset/:token` | — | — | Submit new password |

#### Companies (Tenant Management)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/companies` | Bearer | admin | Provision new tenant |
| GET | `/companies` | Bearer | admin | List all companies |
| GET | `/companies/:id` | Bearer | admin, org_admin | Get company |
| PUT | `/companies/:id` | Bearer | admin, org_admin | Update company |
| DELETE | `/companies/:id` | Bearer | admin | Delete company |

#### Hotels

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/createhotel` | Bearer | admin, org_admin | Create hotel |
| GET | `/findall` | — | — | List all hotels |
| GET | `/topdeals` | — | — | Hotels with discounted rooms |
| GET | `/tophotels` | — | — | Top-rated hotels by state |
| GET | `/hotels-by-cities` | — | — | Hotels filtered by city |
| GET | `/topdestinations` | — | — | Most popular cities/states |
| GET | `/findone/:id` | — | — | Hotel detail (rooms, facilities, reviews) |
| GET | `/bydate` | — | — | Hotels with availability for date range |
| PUT | `/update/:id` | Bearer | admin, org_admin | Update hotel |
| DELETE | `/delete/:id` | Bearer | admin, org_admin | Soft-delete hotel |

#### Rooms

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/room` | Bearer | admin, org_admin | Create room |
| GET | `/rooms` | — | — | List all rooms |
| GET | `/room/:id` | — | — | Get room detail |
| PUT | `/updateroom/:id` | Bearer | admin, org_admin | Update room |
| DELETE | `/deleteroom/:id` | Bearer | admin, org_admin | Soft-delete room |

#### Facilities

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/createfacility` | Bearer | admin, org_admin | Add facilities to hotel |
| GET | `/findfacilities` | — | — | List all facility records |
| GET | `/findfacility/:hotel_id` | — | — | Get hotel's facilities |
| PUT | `/facility/:id` | Bearer | admin, org_admin | Update facility record |
| DELETE | `/facility/:id` | Bearer | admin, org_admin | Delete facility record |

#### Reservations

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/reservation` | Bearer | any | Create reservation |
| GET | `/getall` | Bearer | any | Get caller's reservations |
| GET | `/getone/:id` | Bearer | any | Get single reservation |
| GET | `/lookup/:id` | Bearer | admin, org_admin | Front-desk lookup (any booking) |
| PUT | `/checkin/:id` | Bearer | admin, org_admin | Check guest in |
| PUT | `/checkout/:id` | Bearer | admin, org_admin | Check guest out |
| PUT | `/updatereservation/:id` | Bearer | any | Update own reservation |
| DELETE | `/deletereservation/:id` | Bearer | any | Delete own reservation |
| DELETE | `/removereservations` | Bearer | admin, org_admin | Bulk delete |

#### Reviews

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/createrating/:userId` | Bearer | any | Submit review |
| GET | `/getrating/:id` | — | — | Get review |
| PUT | `/updaterating/:id` | Bearer | any | Update own review |
| DELETE | `/deleterating/:id` | Bearer | any | Delete own review |

#### Users

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/alluser` | Bearer | admin, org_admin | List all users |
| GET | `/user/:id` | Bearer | any | Get user profile |
| PUT | `/updateuser/:id` | Bearer | any | Update user profile |
| DELETE | `/deleteuser/:id` | Bearer | admin | Delete user |

#### Media

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/upload` | Bearer | admin, org_admin | Upload image to B2 |

#### System

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/health` | — | — | Liveness check for load balancer |

### Standard Response Envelope

```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "must be a valid email" }
  ]
}
```

---

## 11. UI / UX Requirements

### 11.1 Design System

| ID | Requirement |
|----|-------------|
| UI-01 | The client is built with **React 18**, **Vite**, **Tailwind CSS**, and **Framer Motion** for animations. |
| UI-02 | The visual style is inspired by hotels.ng — clean, photo-forward, card-based layouts — but with modern animation and interaction polish. |
| UI-03 | All page transitions and card entrances use Framer Motion (fade + slide-up). |
| UI-04 | The colour palette, typography, and spacing follow a consistent design token system (Tailwind config). |
| UI-05 | The React client is a single-page application with client-side routing (`react-router-dom`). |

### 11.2 Responsive Design

| ID | Requirement |
|----|-------------|
| UI-06 | All pages are fully responsive: mobile (≥ 320 px), tablet (≥ 768 px), desktop (≥ 1280 px). |
| UI-07 | The hotel search and listing grids collapse from 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile). |
| UI-08 | The front-desk console must be usable on a tablet (landscape) at a hotel reception. |

### 11.3 Navigation

| ID | Requirement |
|----|-------------|
| UI-09 | `MainLayout` wraps all public and guest pages: includes top navigation bar with logo, search, login/register, and footer with policy links. |
| UI-10 | Admin pages use a sidebar navigation layout, not `MainLayout`. |
| UI-11 | The front-desk page (`/admin/front-desk`) has no navigation wrapper — fullscreen, focused UI. |
| UI-12 | Footer must include links to: Privacy Policy, Terms of Use, Cookie Policy, and a support/contact page. |

### 11.4 Page Inventory

| Page | Route | Auth Required | Role |
|------|-------|--------------|------|
| Home | `/` | No | — |
| Hotel Listing | `/hotels` | No | — |
| Hotel Detail | `/hotels/:id` | No | — |
| Search Results | `/search` | No | — |
| Room Detail | `/rooms/:id` | No | — |
| Login | `/login` | No | — |
| Register | `/register` | No | — |
| Forgot Password | `/forgot-password` | No | — |
| Reset Password | `/reset-password` | No | — |
| Booking | `/book/:roomId` | Yes | any |
| Booking Confirmation | `/booking/:id/confirmation` | Yes | any |
| My Profile | `/profile` | Yes | any |
| My Reservations | `/my-reservations` | Yes | any |
| Settings | `/settings` | Yes | any |
| Admin Dashboard | `/admin` | Yes | admin, org_admin |
| Manage Hotels | `/admin/hotels` | Yes | admin, org_admin |
| Manage Rooms | `/admin/rooms` | Yes | admin, org_admin |
| Manage Reservations | `/admin/reservations` | Yes | admin, org_admin |
| Manage Users | `/admin/users` | Yes | admin, org_admin |
| Front Desk | `/admin/front-desk` | Yes | admin, org_admin |

### 11.5 Key User Flows

#### Guest Booking Flow
```
Home → Search / Browse Hotels → Hotel Detail → Select Room →
Book Room (dates + guest count) → Payment → Booking Confirmation (QR Pass)
```

#### Digital Check-In Flow
```
[Front Desk] Enter booking ID (or scan QR) → View pre-filled guest info →
Click "Check In" → Status → checked-in → Hand over key card
```

#### Hotel Owner Onboarding
```
[Admin] Create Company → Assign org_admin user → [Owner] Login →
Create Hotel → Add Rooms → Add Facility → Go Live
```

---

## 12. Security Requirements

| ID | Requirement |
|----|-------------|
| SEC-01 | All API traffic must be served over **TLS (HTTPS)** in production. |
| SEC-02 | JWT tokens are signed with HS256; `JWT_SECRET` must be ≥ 32 chars (dev) and ≥ 64 chars (production). |
| SEC-03 | Passwords are hashed with **bcrypt** before storage; plaintext passwords are never stored or logged. |
| SEC-04 | **Helmet** is applied to all responses: sets `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, and removes `X-Powered-By`. |
| SEC-05 | **CORS** is restricted to the configured `CORS_ORIGIN` in production; wildcard origins (`*`) are rejected by `validateEnv()`. |
| SEC-06 | Rate limiting is enforced at three tiers: global (100/15min), auth (20/15min), upload (10/1min). |
| SEC-07 | File uploads are restricted to image MIME types only; the upload endpoint validates MIME type server-side (not just by extension). |
| SEC-08 | Temporary upload files are deleted from the local filesystem in a `finally {}` block after upload. |
| SEC-09 | Multi-tenant data isolation: every query is scoped by `companyId`; `assertOwnsResource()` is called before any mutation. |
| SEC-10 | SQL injection: Sequelize ORM with parameterised queries is used throughout. Raw `Sequelize.literal()` calls must use double-quoted PostgreSQL identifiers, not user input. |
| SEC-11 | All sensitive actions are audit-logged per Section 7.12. |
| SEC-12 | A **Responsible Disclosure / Vulnerability Reporting** policy (`SECURITY.md`) must be published before launch. |
| SEC-13 | QStash webhook signatures are verified using `QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY`. |

---

## 13. Compliance & Legal Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| LEG-01 | Platform must comply with the **Nigeria Data Protection Act 2023 (NDPA)**. | In progress |
| LEG-02 | A **Privacy Policy** covering all NDPA data-subject rights must be published before collecting real user data. | Draft ready — legal review pending |
| LEG-03 | **Terms of Use** must be published before the platform goes live. | Draft ready — legal review pending |
| LEG-04 | A **Data Processing Agreement (DPA)** between the platform and each Hotel Owner (Tenant) must be signed before tenants process guest data. | Not started |
| LEG-05 | A **Cookie Policy** and consent banner must be implemented if cookies other than strictly necessary are set. | Not started |
| LEG-06 | If NDPC registration thresholds are met, the Company must register with the **Nigeria Data Protection Commission (NDPC)** and appoint a **DPO**. | Not started |
| LEG-07 | A **Hotel Owner / Merchant Agreement** defining commission, payout terms, SLAs, and content warranties must be signed by each Hotel Owner before going live. | Not started |
| LEG-08 | A **Refund & Cancellation Policy** must be formalised and made available to guests before the first booking. | Not started |
| LEG-09 | A **consent checkpoint** must be implemented at registration: users must accept Terms of Use and Privacy Policy. | Not started |
| LEG-10 | Minimum age requirement (18 years) must be enforced at registration with a date-of-birth field or checkbox acknowledgement. | Not started |
| LEG-11 | An **Incident Response & Breach Notification Plan** must be in place, with 72-hour NDPC notification commitment. | Not started |
| LEG-12 | A **KYC / AML Policy** for Hotel Owners receiving payouts must be in place before live payout processing. | Not started |

---

## 14. Infrastructure & Deployment

### 14.1 Architecture

```
Internet → Nginx (reverse proxy / SPA host, port 80/443)
         → React Client (static build, served by Nginx)
         → Express API (port 3360)
             → PostgreSQL 16 (port 5432)
             → Backblaze B2 (external)
             → Upstash QStash (external)
             → Gmail SMTP / Nodemailer (external)
```

### 14.2 Docker

| Service | Image | Port |
|---------|-------|------|
| `db` | `postgres:16-alpine` | 5432 (internal) |
| `api` | Multi-stage build (node:20-slim) | 3360 |
| `client` | Multi-stage build → `nginx:1.27-alpine` | 80 |

- `db` and `api` share an internal Docker network.
- `api` and `client` share an external network.
- `api` depends on `db` with `service_healthy` condition.
- `client` depends on `api` with `service_healthy` condition.
- API container runs as non-root user `nodeapp` (uid 1001).

### 14.3 Health Checks

| Service | Check | Interval | Timeout | Retries |
|---------|-------|----------|---------|---------|
| `db` | `pg_isready -U $POSTGRES_USER` | 10 s | 5 s | 5 |
| `api` | `GET /health` via `wget` | 30 s | 10 s | 3 |
| `client` | `GET /health` via `wget` | 30 s | 10 s | 3 |

### 14.4 Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DIALECT` | Always | PostgreSQL connection |
| `JWT_SECRET` | Always | ≥ 32 chars; ≥ 64 in production |
| `B2_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET_ID`, `B2_BUCKET_NAME` | Always | Backblaze B2 credentials |
| `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` | Always | Upstash QStash |
| `EMAIL_USER`, `EMAIL_PASS` | Production | Gmail SMTP credentials |
| `CORS_ORIGIN` | Production | Must not be `*` |
| `PUBLIC_URL` | Production | Canonical API base URL |
| `LOCAL_PORT` | Optional | Default: 3360 |
| `NODE_ENV` | Optional | `development` / `production` |

### 14.5 Database Migrations

- All schema changes are applied via Sequelize CLI migrations.
- `npm run migrate` runs pending migrations.
- The server never calls `sequelize.sync({ force: true })` or `alter: true` in production.

---

## 15. Out of Scope (v1)

The following features are deferred to v2 or later:

| Feature | Rationale |
|---------|-----------|
| **Local payment gateway** (Paystack / Flutterwave) | Stripe in scope for v1; local gateway required for NGN card processing |
| **Bed type tracking** (single, double, king, twin) | Room category field covers v1 needs |
| **Per-room photo galleries** | MediaFile model is in place; UI gallery management deferred |
| **Front-desk `staff` role** | Hotel Owners share `org_admin` with front-desk staff in v1 |
| **Audit log admin UI** | Logs are written; query/search UI deferred to v1.1 |
| **Channel manager / OTA sync** | No Booking.com / Expedia integration in v1 |
| **Multi-currency display** | NGN only in v1 |
| **SMS notifications** | Email only in v1 |
| **In-app messaging** | Guest–owner direct messaging deferred |
| **Dynamic pricing / yield management** | Static room prices set by Hotel Owner in v1 |
| **Kubernetes / auto-scaling** | Single VPS Docker Compose deployment for v1 |
| **CDN for B2 images** | Direct B2 URLs in v1; CloudFront/Cloudflare CDN deferred |
| **Analytics dashboard** | Basic KPI cards in admin; full analytics (Metabase/Grafana) deferred |
| **Revenue / payout dashboard for Hotel Owners** | Commission accounting deferred pending payment integration |

---

## 16. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-01 | What is the platform commission rate, and how is it structured (flat fee vs. percentage)? | Business | Pre-launch |
| OQ-02 | Will the platform hold funds in escrow, or pass payment directly to the Hotel Owner? | Finance / Legal | Pre-launch |
| OQ-03 | Which Nigerian states / cities will be in scope at launch? Or is the platform nationwide from day one? | Product | Sprint 1 |
| OQ-04 | Should Hotel Owners be able to set their own cancellation policies per listing, or is there a platform-wide policy? | Product / Legal | Pre-launch |
| OQ-05 | What is the minimum viable KYC requirement for Hotel Owner onboarding — CAC certificate only, or also director ID? | Legal | Pre-launch |
| OQ-06 | Is a `staff` role (front-desk agent without full `org_admin` access) required for v1, or can Hotel Owners share `org_admin` credentials? | Product | Sprint 2 |
| OQ-07 | Will the platform support multiple hotels per Hotel Owner (`org_admin`) in v1? The data model supports it; the UX needs confirmation. | Product | Sprint 1 |
| OQ-08 | Who owns the guest's government ID data that a Hotel Owner collects at check-in — does it live in our system or only on paper at the hotel? | Legal / Eng | Pre-launch |
| OQ-09 | What is the target domain name and SSL certificate provider? | Infra | Sprint 1 |
| OQ-10 | Is Stripe available for Nigerian merchant accounts, or should Paystack be the primary integration? | Finance | Sprint 1 |

---

## 17. Milestones & Launch Checklist

### Phase 1 — Foundation (Complete)

- [x] TypeScript backend migration (Express + Sequelize)
- [x] Authentication & JWT (stateless, no Redis)
- [x] Multi-tenancy with companyId scoping
- [x] Hotel, Room, Facility, Reservation, Review CRUD
- [x] Digital check-in: QR booking pass + front-desk console
- [x] Security middleware (Helmet, CORS, rate limiting, fail-fast env validation)
- [x] File upload to Backblaze B2 (authenticated, image-only, 5 MB limit)
- [x] Docker multi-stage builds + Docker Compose
- [x] React client: public pages, auth flows, booking flow, admin suite
- [x] Audit logging infrastructure

### Phase 2 — Pre-Launch (In Progress)

- [ ] Privacy Policy (draft done; **legal review required**)
- [ ] Terms of Use (draft done; **legal review required**)
- [ ] Cookie Policy
- [ ] Consent checkpoint at registration (Terms + Privacy)
- [ ] Refund & Cancellation Policy
- [ ] Hotel Owner / Merchant Agreement
- [ ] Data Processing Agreement (DPA) with each Tenant
- [ ] NDPC registration (if threshold met)
- [ ] DPO appointment
- [ ] `SECURITY.md` — Responsible Disclosure policy
- [ ] Footer links in React client (Privacy, Terms, Cookie Policy, Support)
- [ ] KYC / Hotel Owner verification flow in admin
- [ ] Payment integration (resolve OQ-10 first)
- [ ] `staff` role decision (OQ-06)
- [ ] End-to-end test of booking → confirmation email → front-desk check-in

### Phase 3 — Launch Hardening

- [ ] Load/stress testing (target: 100 concurrent users without degradation)
- [ ] Penetration test or security audit
- [ ] Database backup & restore drill
- [ ] Incident response runbook
- [ ] Monitoring & alerting setup (uptime + error rate + p95 latency)
- [ ] Soft launch to 5–10 pilot Hotel Owners
- [ ] Feedback loop: support channel open, bug backlog triaged

### Phase 4 — Post-Launch (v2 Planning)

- [ ] Local payment gateway (Paystack / Flutterwave)
- [ ] CDN for B2 images
- [ ] Bed type + per-room photo management
- [ ] Analytics dashboard
- [ ] SMS notifications
- [ ] Revenue / payout dashboard for Hotel Owners
- [ ] Audit log admin UI
- [ ] Channel manager exploration

---

*This PRD is a living document. Update the version number and revision date when
sections change. All open questions in Section 16 must be resolved before the
Phase 2 milestone is closed.*
