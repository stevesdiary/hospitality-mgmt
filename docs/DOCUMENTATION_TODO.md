# 📋 Documentation & Legal Write-up — TODO

A working checklist for the user-facing, operational, and legal documents the
Hospitality Management Platform needs before public launch.

> ⚠️ **Legal disclaimer**: The legal documents below (Privacy Policy, Terms of
> Use, and related agreements) are **drafts to be reviewed and approved by a
> qualified attorney** before publication. They must comply with the **Nigeria
> Data Protection Act (NDPA) 2023** and, where applicable, GDPR for guests in
> the EU. Do not publish legal documents without professional review.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## 1. "How It Works" Document (Onboarding & Operations)

### 1a. Hotel / Guest-House Owner Onboarding
- [ ] **Account creation & company provisioning** — how an owner signs up, how a
      tenant (Company) is created, and the `org_admin` role assignment.
- [ ] **Verification / KYC step** — what proof of ownership / business
      registration is required before a hotel goes live.
- [ ] **Uploading hotel information** — step-by-step: hotel profile (name,
      address, city, state, contact, terms & conditions), photos via the
      Backblaze B2 image upload.
- [ ] **Adding rooms** — room categories, bed types, occupancy, pricing,
      deals/discount flags, availability.
- [ ] **Adding facilities** — selecting amenities (Wi-Fi, pool, restaurant,
      bar lounge, gym, CCTV, 24h security, etc.).
- [ ] **Managing reservations** — viewing bookings, the front-desk console,
      QR-code check-in / check-out workflow.
- [ ] **Responding to reviews** — how reviews appear and moderation rules.
- [ ] **Payouts & fees** — how the owner receives payment, platform commission,
      and settlement timelines. *(Coordinate with payments/finance.)*
- [ ] **Screenshots / GIFs** for each step; keep them versioned with releases.

### 1b. Guest / Traveller Onboarding
- [ ] **Registration & login** — signup with Nigerian phone format, password
      rules, email verification, password reset.
- [ ] **Searching & discovering hotels** — search by city/state, filters
      (price, amenities), top deals, top destinations.
- [ ] **Making a reservation** — selecting room/dates/guests, booking flow.
- [ ] **Booking confirmation & QR pass** — what the confirmation contains and
      how to present it at the front desk (no paper forms).
- [ ] **Arriving & checking in** — what to bring (valid government ID), how the
      key-card handover works.
- [ ] **Managing bookings** — viewing, modifying, cancelling reservations.
- [ ] **Leaving a review** — rating categories and guidelines.

### 1c. Format & Delivery
- [ ] Decide format: in-app help center, README section, or standalone docs site.
- [ ] Add a short **FAQ** for both owners and guests.
- [ ] Add a **support / contact** section.

---

## 2. Privacy Policy
- [ ] **What data we collect** — account data (name, email, Nigerian phone),
      reservation data, reviews, payment metadata, device/usage data, cookies.
- [ ] **How data is collected** — directly from users, automatically, and from
      hotel owners (for guests checking in).
- [ ] **Why we process it (lawful basis under NDPA 2023)** — contract,
      consent, legitimate interest, legal obligation.
- [ ] **Multi-tenant data sharing** — clarify that hotel owners (tenants) can
      see the reservation/guest data necessary to fulfil a booking.
- [ ] **Third-party processors** — Backblaze B2 (storage), Upstash QStash
      (queues), email provider (Nodemailer/Gmail), payment processor (Stripe).
- [ ] **Data retention** — how long records are kept; note soft-deletes
      (`paranoid`) and hard-deletion process for erasure requests.
- [ ] **Data subject rights (NDPA / GDPR)** — access, rectification, erasure,
      portability, objection; how to exercise them.
- [ ] **International transfers** — B2/QStash/Stripe servers outside Nigeria.
- [ ] **Security measures** — JWT auth, bcrypt hashing, TLS, helmet, rate
      limiting, audit logging.
- [ ] **Children's data** — minimum age statement.
- [ ] **Breach notification** — process and timelines per NDPA.
- [ ] **Contact / Data Protection Officer (DPO)** details.
- [ ] **Effective date & change-notification** process.

---

## 3. Terms of Use
- [ ] **Definitions** — platform, user, guest, hotel owner/tenant, content.
- [ ] **Eligibility & account responsibilities** — accurate info, credential
      security, one-account rules.
- [ ] **Acceptable use** — prohibited conduct (fraud, scraping, abuse,
      circumventing fees).
- [ ] **Bookings & contracts** — clarify the platform facilitates a contract
      between guest and hotel; who is responsible for fulfilment.
- [ ] **Pricing, taxes & payment** — how prices/taxes display, payment auth.
- [ ] **Cancellation & no-show** — reference the Refund/Cancellation Policy.
- [ ] **Reviews & user content** — license granted to the platform, moderation.
- [ ] **Intellectual property** — platform IP, trademarks, owner content.
- [ ] **Liability limitations & disclaimers** — "as is", no guarantee of
      availability, third-party hotel conduct.
- [ ] **Indemnification.**
- [ ] **Suspension & termination** — grounds and process.
- [ ] **Governing law & dispute resolution** — Nigerian law, jurisdiction,
      arbitration clause.
- [ ] **Changes to terms** — notice and acceptance.

---

## 4. Other Important Documents (Risk & Compliance)

### Operational / Commercial
- [ ] **Refund & Cancellation Policy** — formalize the paper-form policy
      (check-in 2 PM, check-out 12 PM, late-checkout fees, non-refundable
      payments). Make tenant-configurable if possible.
- [ ] **Hotel Owner / Merchant Agreement** — commercial terms between the
      platform and tenants: commission, payouts, obligations, SLAs, listing
      accuracy, content warranties.
- [ ] **Service Level Agreement (SLA)** — uptime, support response times.
- [ ] **Cookie Policy** — types of cookies, consent banner behavior.

### Data Protection & Security
- [ ] **Data Processing Agreement (DPA)** — between platform and hotel owners,
      defining controller/processor roles for guest data (NDPA requirement).
- [ ] **Sub-processor list** — public list of B2, QStash, Stripe, email
      provider, with locations.
- [ ] **NDPA 2023 / NDPR Compliance Audit** — registration with the NDPC if
      thresholds are met; appoint a DPO; maintain a Record of Processing
      Activities (RoPA).
- [ ] **Incident Response & Breach Notification Plan** — internal runbook
      tied to the existing audit-logging system.
- [ ] **Vulnerability Disclosure / Responsible Security Policy** —
      (`SECURITY.md`) how researchers report issues.

### Payments & Financial
- [ ] **Payment Terms & Chargeback Policy** — Stripe flows, disputes, refunds.
- [ ] **AML / KYC Policy** — verifying hotel owners receiving payouts.

### Content & Conduct
- [ ] **Acceptable Use Policy (AUP)** — detailed prohibited-content rules.
- [ ] **Review / Content Moderation Policy** — how reviews are vetted, removed,
      and disputed.
- [ ] **Community Guidelines** — tone for guest–owner interactions.

### Accessibility & Misc
- [ ] **Accessibility Statement** — WCAG target for the React client.
- [ ] **Disclaimer** — general non-liability for third-party hotel info.
- [ ] **Anti-Discrimination Policy** — equal treatment of guests.

---

## 5. Cross-Cutting Tasks
- [ ] Decide canonical home for documents (in-app pages, footer links, docs site).
- [ ] Add footer links in the React client (`MainLayout`) to Privacy, Terms,
      Cookie Policy, etc.
- [ ] Add a **consent checkpoint** at registration (accept Terms + Privacy).
- [ ] Implement a **cookie consent banner** if cookies/analytics are used.
- [ ] Version every document with an **effective date** and changelog.
- [ ] Schedule **legal review** of all Section 2–4 documents before launch.
- [ ] Translate / localize if serving non-English-speaking users.

---

## Suggested Priority Order
1. **Privacy Policy** + **Terms of Use** + **Cookie Policy** — required before
   collecting any real user data.
2. **DPA** + **NDPA compliance** + **Refund/Cancellation Policy** — required
   before onboarding real hotel owners and processing guest data.
3. **Hotel Owner Agreement** + **Payment/AML** — required before live payouts.
4. **"How It Works"** onboarding guides — required for launch usability.
5. **Security, Accessibility, Moderation** policies — fast-follow post-launch.
