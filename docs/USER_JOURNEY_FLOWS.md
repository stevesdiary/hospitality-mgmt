# User Journey Flows
## Hospitality Management Platform

This document maps every primary user journey across the three actor types —
**Guest**, **Hotel Owner (org_admin)**, and **Platform Admin** — with Mermaid
flow diagrams for each.

> Diagrams use [Mermaid](https://mermaid.js.org/) syntax and render natively in
> GitHub, GitLab, Notion, and most modern documentation tools.

---

## Table of Contents

1. [Guest Journeys](#1-guest-journeys)
   - 1.1 Account Registration
   - 1.2 Hotel Discovery & Search
   - 1.3 Hotel Booking (Happy Path)
   - 1.4 Physical Arrival & Check-In
   - 1.5 Check-Out
   - 1.6 Leaving a Review
   - 1.7 Managing Bookings (View / Cancel)
   - 1.8 Forgot Password
2. [Hotel Owner Journeys](#2-hotel-owner-journeys)
   - 2.1 Onboarding (First-Time Setup)
   - 2.2 Managing Daily Reservations
   - 2.3 Front-Desk Check-In
   - 2.4 Front-Desk Check-Out
   - 2.5 Updating Hotel & Room Information
3. [Platform Admin Journeys](#3-platform-admin-journeys)
   - 3.1 Provisioning a New Hotel Owner (Tenant)
   - 3.2 Reviewing & Managing Users
4. [System Event Flows](#4-system-event-flows)
   - 4.1 Booking Confirmation Email Flow
   - 4.2 Password Reset Email Flow
   - 4.3 Reservation Status Lifecycle

---

## 1. Guest Journeys

### 1.1 Account Registration

**Entry point:** Any page with a "Sign Up" / "Register" CTA, or the `/register` page directly.

```mermaid
flowchart TD
    A([Guest arrives on platform]) --> B[Clicks 'Sign Up']
    B --> C[/Register page /register/]
    C --> D[Fills form:\nFirst name, Last name\nEmail, Phone, Password]
    D --> E{Form valid?}
    E -- No --> F[Validation errors shown inline]
    F --> D
    E -- Yes --> G[POST /signup]
    G --> H{Email already\nregistered?}
    H -- Yes --> I[Error: 'Email already in use']
    I --> D
    H -- No --> J[Account created\ntype = 'regular'\nJWT returned]
    J --> K[Token stored in localStorage]
    K --> L[Redirected to Home page]
    L --> M([Guest is logged in])
```

---

### 1.2 Hotel Discovery & Search

**Entry point:** Home page hero search bar, or the Hotels listing page.

```mermaid
flowchart TD
    A([Guest arrives on Home page]) --> B{How does guest\nwant to find a hotel?}

    B -- Browse all --> C[Clicks 'Browse Hotels'\n/hotels]
    B -- Search by city/state --> D[Types city or state\nin hero search bar]
    B -- Browse featured --> E[Clicks Top Deal card\nor Top Destination card]

    C --> F[/hotels — full listing\nwith filters panel]
    D --> G[/search?city=Lagos&...\nSearch results page]
    E --> H{Top Deal or\nDestination?}
    H -- Top Deal --> I[/topdeals results]
    H -- Destination --> J[/topdestinations → city filter]

    F --> K[Guest applies filters:\nPrice range, Amenities\nHotel type, Date range]
    G --> K
    I --> K
    J --> K

    K --> L[Filtered hotel cards\nshown with name, city,\nprice, rating, deal badge]
    L --> M[Guest clicks hotel card]
    M --> N[/hotels/:id — Hotel Detail Page]
    N --> O[Views photos, description,\nfacilities, reviews, rooms]
    O --> P{Interested in\na room?}
    P -- No --> L
    P -- Yes --> Q([Proceeds to Booking Journey])
```

---

### 1.3 Hotel Booking (Happy Path)

**Entry point:** Hotel Detail page, after selecting a room.

```mermaid
flowchart TD
    A([Guest on Hotel Detail page]) --> B[Clicks 'Book Now' on a room]
    B --> C{Is guest\nlogged in?}
    C -- No --> D[Redirected to /login\nwith return URL]
    D --> E[Guest logs in]
    E --> B
    C -- Yes --> F[/book/:roomId — Booking page]
    F --> G[Selects:\nCheck-in date\nCheck-out date\nNumber of guests]
    G --> H{Dates valid &\nroom available?}
    H -- No --> I[Error: 'Room not available\nfor selected dates']
    I --> G
    H -- Yes --> J[Reviews booking summary:\nHotel, Room, Dates, Price total]
    J --> K[Enters payment details\nvia Stripe widget]
    K --> L{Payment\nauthorised?}
    L -- No --> M[Payment error shown\nGuest can retry or use\ndifferent card]
    M --> K
    L -- Yes --> N[POST /reservation\nstatus = 'pending']
    N --> O[Reservation created\nPayment captured\nStatus → 'confirmed']
    O --> P[Booking confirmation email\nqueued via QStash]
    P --> Q[Email delivered to guest\nwith booking details + QR code]
    O --> R[Redirected to\n/booking/:id/confirmation]
    R --> S[Confirmation page shows:\nHotel, Room, Dates\nGuest count, QR pass]
    S --> T([Guest saves / prints QR pass])
```

---

### 1.4 Physical Arrival & Check-In

**Entry point:** Guest arrives at hotel with booking ID or QR pass.

```mermaid
flowchart TD
    A([Guest arrives at hotel]) --> B[Presents QR pass on phone\nor states booking ID at front desk]
    B --> C[Front-desk staff opens\n/admin/front-desk]
    C --> D[Staff scans QR code\nor types booking ID]
    D --> E[GET /lookup/:id]
    E --> F{Booking found?}
    F -- No --> G[Error: 'Booking not found'\nStaff asks guest to\ncheck confirmation email]
    G --> D
    F -- Yes --> H[Booking details displayed:\nGuest name, email, phone\nRoom, dates, guest count\nStatus badge]
    H --> I{Current status?}
    I -- pending --> J[Staff clicks 'Confirm & Check In']
    I -- confirmed --> J
    I -- checked-in --> K[Already checked in\nDisplay checkInTime\nNo action needed]
    I -- cancelled/no-show --> L[Error: 'Booking is cancelled'\nEscalate to manager]
    I -- checked-out --> M[Already checked out\nDisplay history]
    J --> N[PUT /checkin/:id]
    N --> O[Status → 'checked-in'\ncheckInTime recorded]
    O --> P[Front desk hands\nover key card]
    P --> Q([Guest proceeds to room])
```

---

### 1.5 Check-Out

**Entry point:** Guest returns key card at front desk on departure day.

```mermaid
flowchart TD
    A([Guest at front desk to check out]) --> B[Staff opens /admin/front-desk]
    B --> C[Looks up booking by ID]
    C --> D[GET /lookup/:id]
    D --> E{Status?}
    E -- checked-in --> F[Staff clicks 'Check Out Guest']
    E -- confirmed/pending --> G[Warn: Guest has not\nyet formally checked in\nConfirm late check-out?]
    G --> F
    E -- checked-out --> H[Already checked out\nNothing to do]
    E -- cancelled --> I[Error state\nEscalate to manager]
    F --> J[PUT /checkout/:id]
    J --> K[Status → 'checked-out'\ncheckOutTime recorded]
    K --> L{Any\nincidentals\nor extras?}
    L -- No --> M[Check-out complete]
    L -- Yes --> N[Process separately\noutside platform v1]
    M --> O([Guest departs])
    N --> O
```

---

### 1.6 Leaving a Review

**Entry point:** Email CTA after check-out, or "My Reservations" page.

```mermaid
flowchart TD
    A([Guest receives post-stay email\nor visits My Reservations]) --> B[Clicks 'Leave a Review'\nfor a checked-out booking]
    B --> C{Is guest\nlogged in?}
    C -- No --> D[Redirected to /login]
    D --> B
    C -- Yes --> E[Review form opens]
    E --> F[Guest fills in:\nReview title\nReview body\nOverall rating 1–5\nCleanliness, Comfort\nService, Security\nLocation 1–5\nOptional: thumbs up/down]
    F --> G{All required\nfields filled?}
    G -- No --> H[Validation errors shown]
    H --> F
    G -- Yes --> I[POST /createrating/:userId]
    I --> J[Review saved with\nguest name + ratings]
    J --> K[Review appears on\nHotel Detail page]
    K --> L([Review submitted])
```

---

### 1.7 Managing Bookings (View / Cancel)

**Entry point:** User menu → "My Reservations" or `/my-reservations`.

```mermaid
flowchart TD
    A([Guest logs in]) --> B[Navigates to\nMy Reservations /my-reservations]
    B --> C[GET /getall — lists all\nguest's reservations]
    C --> D[Reservations shown with\nstatus badges:\npending, confirmed\nchecked-in, checked-out\ncancelled]
    D --> E{What does\nguest want to do?}
    E -- View confirmation --> F[Clicks booking → /booking/:id/confirmation\nShows QR pass again]
    E -- Cancel booking --> G[Clicks 'Cancel']
    G --> H{Status allows\ncancellation?}
    H -- pending or confirmed --> I[Cancellation policy shown\n'Are you sure?' dialog]
    I --> J{Guest confirms\ncancellation?}
    J -- No --> D
    J -- Yes --> K[DELETE /deletereservation/:id\nor status change to 'cancelled']
    K --> L{Refund\neligible?}
    L -- Yes --> M[Refund initiated\nvia Stripe refund flow]
    L -- No --> N[No refund\nper policy]
    M --> O[Cancellation confirmation\nemail sent to guest]
    N --> O
    O --> D
    H -- checked-in or checked-out --> P[Cannot cancel\nError shown]
    P --> D
```

---

### 1.8 Forgot Password

**Entry point:** Login page → "Forgot password?" link.

```mermaid
flowchart TD
    A([Guest on Login page]) --> B[Clicks 'Forgot password?']
    B --> C[/forgot-password page]
    C --> D[Enters registered email address]
    D --> E[POST /forgot]
    E --> F{Email found\nin system?}
    F -- No --> G[Generic response:\n'If this email is registered\nyou will receive a link'\nNo info leakage]
    F -- Yes --> H[Signed reset token generated\nExpires in 12 minutes]
    H --> I[Token queued for\nemail delivery via QStash]
    I --> J[Guest receives email\nwith reset link]
    G --> K[Guest checks inbox]
    J --> K
    K --> L[Clicks link → /reset-password?token=...]
    L --> M{Token valid\n& not expired?}
    M -- No --> N[Error: 'Link expired or invalid'\nOffer to resend]
    N --> C
    M -- Yes --> O[New password form shown]
    O --> P[Guest enters new password\n& confirmation]
    P --> Q{Passwords\nmatch & meet\nrequirements?}
    Q -- No --> R[Validation error shown]
    R --> P
    Q -- Yes --> S[POST /reset/:token]
    S --> T[Password updated\nToken invalidated]
    T --> U[Redirected to /login\nSuccess message]
    U --> V([Guest logs in with new password])
```

---

## 2. Hotel Owner Journeys

### 2.1 Onboarding (First-Time Setup)

**Prerequisite:** Platform admin has created the Company and assigned `org_admin` role.

```mermaid
flowchart TD
    A([Hotel Owner receives\nwelcome email with credentials]) --> B[Logs in at /login]
    B --> C[Admin dashboard /admin]
    C --> D[Step 1: Create Hotel]
    D --> E[POST /createhotel\nName, address, city, state\ndescription, type, contact\nT&Cs]
    E --> F{Hotel created\nsuccessfully?}
    F -- No --> G[Error: fix validation\nand retry]
    G --> E
    F -- Yes --> H[Step 2: Add Rooms]
    H --> I[POST /room\nCategory, capacity, price\ncheck-in/check-out times\ncondition, availability]
    I --> J{More rooms\nto add?}
    J -- Yes --> I
    J -- No --> K[Step 3: Add Facilities]
    K --> L[POST /createfacility\nSelect amenities:\nWi-Fi, pool, gym, CCTV\nrestaurant, bar, etc.]
    L --> M[Step 4: Upload Photos]
    M --> N[POST /upload\nJPEG/PNG/WebP/GIF\nmax 5 MB per file]
    N --> O{More photos\nto upload?}
    O -- Yes --> N
    O -- No --> P[Hotel now visible\nto guests in search]
    P --> Q([Hotel Owner is live\non the platform])
```

---

### 2.2 Managing Daily Reservations

**Entry point:** Admin dashboard or Manage Reservations page.

```mermaid
flowchart TD
    A([Hotel Owner logs in]) --> B[/admin/reservations]
    B --> C[GET /getall — scoped\nto their companyId only]
    C --> D[Reservation list shown\nwith status filters]
    D --> E{What action\nis needed?}

    E -- View upcoming check-ins --> F[Filter: status = 'confirmed'\nSort by dateIn ascending]
    F --> G[Review guest list\nfor today / tomorrow]

    E -- Mark no-show --> H[Find booking\nfor guest who didn't arrive]
    H --> I[Update status → 'no-show'\nPUT /updatereservation/:id]
    I --> D

    E -- Go to front desk --> J[Opens /admin/front-desk\nfor physical check-in workflow]
    J --> K([Front-Desk Journey])

    E -- View history --> L[Filter: status = 'checked-out'\nDate range picker]
    L --> M[Historical reservations shown]
    M --> D
```

---

### 2.3 Front-Desk Check-In

*(Detailed version of Guest Journey 1.4, from the Hotel Owner / staff perspective.)*

```mermaid
flowchart TD
    A([Staff at /admin/front-desk]) --> B[Guest arrives and\npresents booking]
    B --> C{How is booking\npresented?}
    C -- QR code --> D[Scan QR → booking UUID\nauto-filled in lookup field]
    C -- Verbal / paper --> E[Staff types booking ID\nmanually]
    D --> F[GET /lookup/:id]
    E --> F
    F --> G{Booking\nfound?}
    G -- No --> H[Display: 'No booking found'\nAsk guest to check email\nor try alternate ID]
    H --> B
    G -- Yes --> I[Display guest card:\nFull name · Email · Phone\nRoom · Dates · Guest count\nStatus badge]
    I --> J{Status?}
    J -- 'confirmed' or 'pending' --> K[Click 'Check In — Issue Key Card'\ngreen button]
    K --> L[PUT /checkin/:id]
    L --> M[Status → 'checked-in'\ncheckInTime stamped]
    M --> N[Key card issued\nto guest]
    N --> O([Check-in complete])
    J -- 'checked-in' --> P[Already checked in\nShow checkInTime\nNo button active]
    J -- 'cancelled' --> Q[Booking cancelled\nDo not issue key card\nEscalate to manager]
    J -- 'no-show' --> Q
    J -- 'checked-out' --> R[Guest already checked out\nShow history]
```

---

### 2.4 Front-Desk Check-Out

```mermaid
flowchart TD
    A([Guest returns key card\nto front desk]) --> B[Staff at /admin/front-desk]
    B --> C[Look up booking by ID]
    C --> D[GET /lookup/:id]
    D --> E[Guest card displayed]
    E --> F{Current\nstatus?}
    F -- 'checked-in' --> G[Click 'Check Out Guest'\nblue button]
    G --> H[PUT /checkout/:id]
    H --> I[Status → 'checked-out'\ncheckOutTime stamped]
    I --> J{Additional\ncharges?}
    J -- No --> K[Guest departs]
    J -- Yes --> L[Handle outside\nplatform v1]
    L --> K
    K --> M([Check-out complete])
    F -- not 'checked-in' --> N[Display current status\n& timestamps\nInform guest]
```

---

### 2.5 Updating Hotel & Room Information

**Entry point:** `/admin/hotels` or `/admin/rooms`.

```mermaid
flowchart TD
    A([Hotel Owner in admin dashboard]) --> B{What needs\nupdating?}

    B -- Hotel details --> C[/admin/hotels\nClick Edit on hotel]
    C --> D[Hotel edit form\npre-filled with current data]
    D --> E[Modify: name, description\ncontact info, T&Cs, type]
    E --> F[PUT /update/:id]
    F --> G{Saved?}
    G -- No --> H[Validation error\nFix and retry]
    H --> E
    G -- Yes --> I[Hotel listing updated\nglobally]

    B -- Room pricing/availability --> J[/admin/rooms\nClick Edit on room]
    J --> K[Room edit form]
    K --> L[Modify: price, deals\navailability, condition\ncategory, capacity]
    L --> M[PUT /updateroom/:id]
    M --> N{Saved?}
    N -- No --> O[Validation error]
    O --> L
    N -- Yes --> P[Room updated\nNew price visible in search]

    B -- Facilities --> Q[GET /findfacility/:hotel_id\nClick Edit]
    Q --> R[Toggle facility checkboxes]
    R --> S[PUT /facility/:id]
    S --> T[Facilities updated\nSearch filters reflect changes]

    B -- Upload new photos --> U[POST /upload\nDrag-and-drop or file picker]
    U --> V[Image stored in B2\nMediaFile record created]
    V --> W[Photos visible on\nHotel Detail page]
```

---

## 3. Platform Admin Journeys

### 3.1 Provisioning a New Hotel Owner (Tenant)

**Entry point:** A Hotel Owner has completed KYC / business verification off-platform.

```mermaid
flowchart TD
    A([Platform admin receives\napproved Hotel Owner application]) --> B[Logs in with admin credentials]
    B --> C[/admin — System Admin Dashboard]
    C --> D[Step 1: Create Company]
    D --> E[POST /companies\nName, contact email\ncontact phone, address]
    E --> F[Company record created\nwith unique companyId]
    F --> G[Step 2: Create org_admin user\nor update existing user's role]
    G --> H{User already\nhas an account?}
    H -- No --> I[POST /signup\nCreate account for Hotel Owner\nor instruct them to self-register]
    H -- Yes --> J[GET /alluser\nFind user by email]
    I --> K[PUT /updateuser/:id\nSet type = 'org_admin'\nSet companyId = new company ID]
    J --> K
    K --> L[Hotel Owner now has\norg_admin access\nScoped to their Company]
    L --> M[Send onboarding email\nto Hotel Owner\nwith login credentials & guide]
    M --> N([Hotel Owner begins\nonboarding journey])
```

---

### 3.2 Reviewing & Managing Users

**Entry point:** `/admin/users` — platform-wide user management.

```mermaid
flowchart TD
    A([Admin at /admin/users]) --> B[GET /alluser\nAll users across all tenants]
    B --> C[User list with:\nName, email, role, company\ncreated date, status]
    C --> D{What action\nis needed?}

    D -- Promote to org_admin --> E[Click user → Edit role]
    E --> F[PUT /updateuser/:id\ntype = 'org_admin'\ncompanyId = assigned company]
    F --> G[User role updated\nAudit log entry created]

    D -- Suspend / remove user --> H[Click 'Delete User']
    H --> I[DELETE /deleteuser/:id\nSoft delete — deletedAt stamped]
    I --> J[User can no longer log in\nReservation history preserved]

    D -- Investigate activity --> K[Cross-reference\nAudit Log by actorId\nAdmin UI — v1.1]

    D -- View user's reservations --> L[GET /getall\nFiltered by userId]
    L --> M[Show reservation history\nfor support investigation]
```

---

## 4. System Event Flows

### 4.1 Booking Confirmation Email Flow

**Triggered by:** Successful reservation creation.

```mermaid
sequenceDiagram
    participant G as Guest (Browser)
    participant A as Express API
    participant DB as PostgreSQL
    participant Q as Upstash QStash
    participant E as Gmail SMTP

    G->>A: POST /reservation {hotelId, roomId, dateIn, dateOut, guestCount}
    A->>DB: Check room availability (no overlap)
    DB-->>A: Available
    A->>DB: INSERT reservation (status='pending')
    DB-->>A: Reservation created {id, ...}
    A->>DB: UPDATE reservation status='confirmed'
    A->>Q: Enqueue email job {to, subject, bookingId, qrData, ...}
    A-->>G: 201 Created {reservation, qrCodeData}
    Note over G: Redirected to /booking/:id/confirmation
    Q->>E: Deliver email with booking details + QR code
    E-->>G: Booking confirmation email received
```

---

### 4.2 Password Reset Email Flow

**Triggered by:** User submits forgot-password request.

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant A as Express API
    participant DB as PostgreSQL
    participant Q as Upstash QStash
    participant E as Gmail SMTP

    U->>A: POST /forgot {email}
    A->>DB: Lookup user by email
    alt User found
        DB-->>A: User record
        A->>A: Generate signed reset token (12-min expiry)
        A->>DB: Save hashed token + expiry on user record
        A->>Q: Enqueue email job {to, resetLink}
        A-->>U: 200 OK (generic message — no info leakage)
        Q->>E: Deliver reset email
        E-->>U: Email with reset link received
    else User not found
        DB-->>A: null
        A-->>U: 200 OK (same generic message)
    end

    U->>A: POST /reset/:token {newPassword}
    A->>DB: Find user by hashed token, check expiry
    alt Token valid
        DB-->>A: User record
        A->>A: bcrypt hash new password
        A->>DB: Update password, clear token
        A-->>U: 200 OK — password updated
    else Token invalid or expired
        A-->>U: 400 — 'Link expired or invalid'
    end
```

---

### 4.3 Reservation Status Lifecycle

**State machine for a single Reservation record.**

```mermaid
stateDiagram-v2
    [*] --> pending : POST /reservation\n(guest books room)

    pending --> confirmed : Payment captured\n(auto-transition on booking)
    pending --> cancelled : Guest cancels\nor admin cancels

    confirmed --> checked_in : PUT /checkin/:id\n(front-desk check-in)\nrecords checkInTime
    confirmed --> cancelled : Guest cancels\n(pre-arrival)
    confirmed --> no_show : org_admin marks\nno-show

    checked_in --> checked_out : PUT /checkout/:id\n(front-desk check-out)\nrecords checkOutTime

    cancelled --> [*]
    no_show --> [*]
    checked_out --> [*]

    note right of checked_in
        Status cannot go backward.
        Once checked_in, cannot
        be cancelled — must be
        checked_out first.
    end note
```

---

## Summary: Journey Touch-Points by Actor

| Journey | Actor | Key Endpoints | Pages |
|---------|-------|--------------|-------|
| Registration | Guest | `POST /signup` | `/register` |
| Login | All | `POST /login` | `/login` |
| Hotel discovery | Guest | `GET /findall`, `/topdeals`, `/bydate`, `/hotels-by-cities` | `/hotels`, `/search` |
| Booking | Guest | `POST /reservation` | `/book/:roomId`, `/booking/:id/confirmation` |
| View QR pass | Guest | `GET /getone/:id` | `/booking/:id/confirmation` |
| Check-in | Guest + Staff | `GET /lookup/:id`, `PUT /checkin/:id` | `/admin/front-desk` |
| Check-out | Guest + Staff | `PUT /checkout/:id` | `/admin/front-desk` |
| Leave review | Guest | `POST /createrating/:userId` | Hotel detail page |
| Cancel booking | Guest | `DELETE /deletereservation/:id` | `/my-reservations` |
| Forgot password | Guest | `POST /forgot`, `POST /reset/:token` | `/forgot-password`, `/reset-password` |
| Hotel onboarding | Hotel Owner | `POST /createhotel`, `/room`, `/createfacility`, `/upload` | `/admin/hotels`, `/admin/rooms` |
| Daily reservations | Hotel Owner | `GET /getall`, `PUT /updatereservation/:id` | `/admin/reservations` |
| Provision tenant | Platform Admin | `POST /companies`, `PUT /updateuser/:id` | `/admin`, `/admin/users` |
| User management | Platform Admin | `GET /alluser`, `DELETE /deleteuser/:id` | `/admin/users` |
