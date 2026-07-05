# Product Realignment — Management Platform First

**Status:** Proposed · **Date:** 2026-07-05 · **Branch:** `claude/review-multi-tenant-hospitality-ORUYc`

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

## 2. Target model: Management-first

1. **Foreground the console.** The authenticated management dashboard
   (front desk, reservations, rooms, staff, occupancy, reporting) is the
   product a hotel signs up for. It becomes the default post-login surface.
2. **Scope guest booking per-hotel.** A guest books *one specific hotel* via
   that hotel's own branded page / link / QR — not a competitive cross-hotel
   search. No tenant wants the platform steering their guest to a rival.
3. **Demote the public multi-hotel directory to an opt-in Phase-2 feature.**
   If kept, a hotel *chooses* to appear in a public directory; it is not the
   front door and not the default.

The data model already supports all three without schema changes.

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
- [ ] **New default route.** Authenticated hotel staff land on the management
      dashboard (`/admin` → rename toward `/console` or `/dashboard`), not the
      marketing home.
- [ ] **Reframe `/` and `/hotels`.** The cross-tenant marketing homepage and the
      "browse all hotels" grid become optional/Phase-2, or convert `/hotels/:id`
      into each hotel's standalone public booking page.
- [ ] **Per-hotel public booking page.** A single-hotel branded surface (gallery,
      rooms, availability, book) reachable by direct link / QR.

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

## 5. Open questions to confirm

1. **Tenant addressing:** subdomain per hotel (`ekohotels.stayng.com`), path
   (`/h/eko-hotels`), or direct booking links + QR only?
2. **Does a guest account live at the platform level or per-hotel?** (Affects
   whether "My Reservations" spans hotels or is per-stay.)
3. **Is a public directory in scope at all**, or is discovery entirely off-platform
   (hotels drive their own traffic to their booking link)?

---

*Nothing in this plan requires changing the database schema. The multi-tenant
foundation is sound; the work is re-scoping reads, re-routing the frontend, and
re-centering the design on the console.*
