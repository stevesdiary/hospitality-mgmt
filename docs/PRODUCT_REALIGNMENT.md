# Product Realignment — Management Platform First

**Status:** Confirmed · **Date:** 2026-07-05 · **Branch:** `claude/review-multi-tenant-hospitality-ORUYc`

> This document records a product-direction review and the concrete plan to
> re-center the platform on its **sole aim**: a management system for the
> hospitality industry where hotels and guest houses run their own business.
> No code has been changed yet — this is the map for the work.

---

## 1. The divergence we found

Two different products are currently entangled in the codebase:

| | **Management Platform** (the goal) | **Booking Marketplace / OTA** (the drift) |
|---|---|---|
| Customer | The hotel / guest house | The travelling guest |
| Core surface | Admin console: front desk, reservations, rooms, staff, reporting | Public catalogue of every hotel, cross-hotel search & compare |
| Guest booking | Per-hotel (a hotel's own page / link / QR) | Competitive multi-hotel search |
| Analogues | Cloudbeds, Hotelogix, RoomRaccoon, Little Hotelier | Booking.com, Hotels.ng |

The intended product is the **left column**. Several surfaces drifted right.

### Where each layer stands today

| Layer | Built for | Verdict |
|---|---|---|
| Data model (`Company → Hotel + User + Reservation`, `companyId` scoping, `assertOwnsResource`) | Management ✅ | Correct multi-tenant backbone. Keep. |
| Admin suite (`FrontDesk`, `ManageHotels/Rooms/Reservations/Users`, `AdminDashboard`) | Management ✅ | This **is** the core product. Keep & foreground. |
| Read/discovery API (`getAllHotels`, `topDeals`, `topDestinations`) | Marketplace ⚠️ | `resolveCompanyScope()` returns `null` for public + platform-admin, aggregating across **all tenants**. |
| Public routes (`/findall`, `/topdeals`, `/topdestinations`) | Marketplace ⚠️ | Unauthenticated, open cross-tenant catalogue. |
| Frontend + design (Home hero search, `/hotels` listing, Canva/Figma decks) | Marketplace ⚠️ | Leads with cross-hotel discovery, not the management console. |

### The single decision that flips the product

`controllers/hotelController.ts:9`

```ts
const resolveCompanyScope = (req) => {
  const user = req.user;
  if (!user) return null;            // public visitor → sees ALL hotels
  if (user.type === 'admin') return null;
  return user.companyId || null;
};
```

A `null` scope means "show every tenant's hotels." That is what turns a
management tool into a marketplace. **The backbone is fine — the emphasis is not.**

---

## 2. Target model: Management-first (CONFIRMED)

Two distinct surfaces, one shared multi-tenant backbone:

### A. Per-hotel public landing page (guest-facing)
Every client hotel gets its **own branded landing/booking page** — e.g.
*ABC Hotels & Suites* — that shows **only that hotel's** rooms and services and
lets customers book **directly from there**. It is a single-tenant microsite:

- Hero / branding for that hotel (name, logo, photos)
- That hotel's rooms, amenities, and services
- Availability + booking flow scoped to that hotel
- Reachable by direct link / QR the hotel shares with its own guests

There is **no** cross-hotel search, compare, or "browse all hotels" surface.
Discovery is the hotel's job (their traffic, their link); ours is booking +
management for that one hotel.

### B. Management console (client-facing, the platform's focus)
Each client logs into **their own dashboard** to run operations:

- Front desk (QR / manual check-in & check-out)
- Reservations management
- Rooms & availability
- Services / facilities
- Staff / users (scoped to their company)
- Occupancy & reporting

This is the product the client pays for and the default surface after login.

The existing data model already supports both without schema changes — every
read/booking simply resolves **one** hotel/tenant instead of aggregating across
all of them.

---

## 3. Concrete change list

### Backend
- [ ] **Scope public reads to a single hotel/tenant.** Guest-facing hotel and
      room lookups must resolve a specific `hotelId` (or a tenant slug/subdomain),
      never a null cross-tenant scope. Reserve the aggregate `getAllHotels` for
      platform-admin only.
- [ ] **Split "platform admin" from "hotel admin (org_admin)" clearly.** Only a
      platform super-admin should ever see across tenants; `org_admin` is scoped
      to their own `companyId`. Audit every `resolveCompanyScope`/`type === 'admin'`
      branch against this rule.
- [ ] **Gate discovery endpoints.** `topDeals`, `topDestinations`, `hotels-by-cities`
      become either (a) per-hotel context or (b) part of the optional Phase-2
      directory behind an explicit flag — not open defaults.
- [ ] **Booking flow keyed by hotel.** Reservation creation should originate from
      a hotel's own page and always carry that hotel's `companyId`.

### Frontend
- [x] **New default route.** Authenticated hotel staff land on `/admin` after
      login; `org_admin` is allowed through the console's admin gate.
- [x] **Reframe `/` and retire the marketplace.** `/` is now a SaaS product
      landing for hotel owners (run your hotel, your own booking page). The
      cross-tenant `/hotels`, `/hotels/:id` and `/search` routes redirect to `/`
      and their pages were deleted. Nav/footer point to product sections.
- [x] **Per-hotel public booking page.** `/h/:slug` renders a single hotel's
      branded page (hero, amenities, rooms with direct Book CTAs), backed by the
      public by-slug endpoint.

### Design
- [ ] **Regenerate the hero.** The Canva/Figma "hero" should be the management
      console (occupancy, arrivals today, front desk), not "2,400+ Hotels · Top
      Destinations · Top Deals."
- [ ] **Keep** the admin dashboard, front desk, and data-table screens already
      designed — they are on-target.

---

## 4. Suggested phasing

- **Phase 1 — Management core.** Console as default surface; per-hotel booking;
  reads scoped to a hotel/tenant; platform-admin vs hotel-admin separation.
- **Phase 2 — Optional public directory.** Cross-hotel discovery as an opt-in
  add-on for hotels that want inbound marketplace traffic.

---

## 5. Decisions

**Resolved**
- ✅ **Per-hotel landing pages, not a marketplace.** Each hotel has its own
  branded page listing only its rooms/services; guests book there directly.
- ✅ **Public multi-hotel directory is out of scope.** Discovery is off-platform;
  each hotel drives its own traffic to its own booking link/QR.
- ✅ **Management console is the platform's focus and default post-login surface.**

**Still to confirm**
1. **Tenant addressing for the landing page.** Options:
   - Path-based slug — `stayng.com/h/abc-hotels-and-suites` *(recommended to start:
     no wildcard DNS/TLS, simplest to ship)*
   - Subdomain — `abc-hotels.stayng.com` *(more branded; needs wildcard DNS +
     TLS; can be added later)*
   - Custom domain — `book.abchotels.com` *(Phase 3, premium tier)*
2. **Guest account scope.** Recommended: lightweight **guest checkout** on each
   hotel page (name/phone/email at booking), with optional account creation.
   "My Reservations" would then be per-booking-reference rather than a
   cross-hotel account — keeps the guest side thin and the focus on management.

---

*Nothing in this plan requires changing the database schema. The multi-tenant
foundation is sound; the work is re-scoping reads, re-routing the frontend, and
re-centering the design on the console.*
