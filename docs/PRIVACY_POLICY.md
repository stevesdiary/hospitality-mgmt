# Privacy Policy

> **Legal Review Notice:** This document is a **working draft** prepared to
> guide professional legal review. It must be reviewed and approved by a
> qualified attorney before publication. It is intended to comply with the
> **Nigeria Data Protection Act (NDPA) 2023** and, where applicable, the EU
> General Data Protection Regulation (GDPR) for guests located in the European
> Union. Do not publish this document without professional review and sign-off.

**Effective Date:** [TO BE SET BEFORE LAUNCH]  
**Version:** 0.1 (Draft — Not Yet in Force)  
**Last Revised:** [DATE]

---

## 1. Who We Are

The Hospitality Management Platform ("Platform", "we", "us", "our") is operated
by **[COMPANY LEGAL NAME]**, a company registered in the Federal Republic of
Nigeria (RC No. **[REGISTRATION NUMBER]**), with its registered address at
**[REGISTERED ADDRESS]**.

We provide an online marketplace that connects travellers ("Guests") with
independently operated hotels and guest-houses ("Hotel Owners" or "Tenants").

**Data Protection Officer (DPO):**  
Name: [DPO NAME]  
Email: [dpo@yourdomain.com]  
Address: [DPO MAILING ADDRESS]

For any data-related enquiries or to exercise your rights, contact the DPO at
the address above.

---

## 2. Scope of This Policy

This Privacy Policy explains how we collect, use, share, store, and protect
personal data when you:

- Visit or use our website and mobile applications.
- Create an account as a Guest or Hotel Owner.
- Make or manage a hotel reservation.
- Operate a hotel on the Platform as a Tenant.

It applies to all users worldwide; however, it is primarily designed to satisfy
the requirements of the **Nigeria Data Protection Act 2023 (NDPA)** and its
implementing regulations. Where data is processed for users in the European
Economic Area (EEA), the additional GDPR requirements set out in Section 13
apply.

---

## 3. Personal Data We Collect

### 3.1 Data You Provide Directly

| Category | Examples |
|---|---|
| **Identity** | Full name, government-issued ID type and number (collected by Hotel Owner at check-in) |
| **Contact** | Email address, Nigerian mobile phone number (format: +234 XXX XXX XXXX) |
| **Account credentials** | Hashed password (bcrypt); we never store plaintext passwords |
| **Hotel Owner / Business** | Business name, hotel name, hotel address, state, city, contact email, terms & conditions, proof of ownership / business registration documents |
| **Reservation data** | Check-in/check-out dates, room selected, number of guests, booking status, QR booking pass |
| **Review content** | Rating scores (cleanliness, comfort, service, security, location), written review text |
| **Payment metadata** | Transaction reference, payment status, payout instructions (bank account details for Hotel Owners) — full card numbers are processed exclusively by our payment processor and are not stored on our servers |
| **Communications** | Messages sent through our support channels |

### 3.2 Data Collected Automatically

| Category | Examples |
|---|---|
| **Usage data** | Pages visited, search queries (city, state, price filters, amenities), click paths, session duration |
| **Device & technical data** | IP address, browser type and version, operating system, device identifiers |
| **Log data** | Server access logs, error logs, API request timestamps |
| **Cookies & similar** | Session cookies, preference cookies (see Section 11) |

### 3.3 Data We Receive from Hotel Owners (about Guests)

When a Hotel Owner checks a guest in through the front-desk console, they may
confirm or supplement reservation data including the guest's government-issued ID
details. This data is provided to fulfil the booking contract and to comply with
applicable hotel and hospitality regulations in Nigeria.

---

## 4. How We Collect Personal Data

- **Directly from you** when you register, create a reservation, upload photos,
  write a review, or contact support.
- **Automatically** through cookies, server logs, and analytics tools when you
  use our Platform.
- **From Hotel Owners** when they input guest details at check-in via the
  front-desk console.
- **From third-party payment processors** (transaction confirmation and status
  updates).

---

## 5. Purposes and Lawful Basis for Processing

We process personal data only where we have a valid lawful basis under the NDPA
2023 and, where applicable, the GDPR.

| Purpose | Lawful Basis (NDPA / GDPR) |
|---|---|
| Creating and managing your account | **Contract** — necessary to provide the service you signed up for |
| Processing and managing hotel reservations | **Contract** — necessary to fulfil the booking |
| Sending booking confirmations and QR check-in passes | **Contract** |
| Sending transactional emails (reservation updates, password resets) | **Contract** |
| Processing payments and payouts to Hotel Owners | **Contract** / **Legal obligation** |
| Verifying Hotel Owner identity and business registration (KYC) | **Legal obligation** / **Legitimate interest** (preventing fraud) |
| Audit logging of sensitive actions | **Legitimate interest** (security, fraud prevention, dispute resolution) |
| Displaying your review (name + ratings) on the Platform | **Consent** (given when you submit a review) / **Legitimate interest** |
| Sending marketing emails and promotions | **Consent** — you may opt out at any time |
| Improving the Platform, analytics, and product research | **Legitimate interest** (improving our services) |
| Complying with legal obligations (tax, AML, court orders) | **Legal obligation** |
| Detecting and preventing fraud and abuse | **Legitimate interest** |
| Enforcing our Terms of Use | **Legitimate interest** |

---

## 6. Multi-Tenant Data Sharing Between Platform and Hotel Owners

The Platform operates a **shared-database, multi-tenant architecture**. Each
Hotel Owner (Tenant) is assigned a unique `companyId` and can only access data
that belongs to their own property. Specifically:

- Hotel Owners can view reservation records, guest names, contact details, check-in
  times, and room assignments **only for bookings made at their own hotel**.
- Hotel Owners **cannot** access data from other hotels or other tenants on the
  Platform.
- System-level administrators at [COMPANY LEGAL NAME] may access data across all
  tenants for support, compliance, audit, and platform-integrity purposes. Such
  access is role-controlled and audit-logged.

By making a reservation, Guests consent to the relevant Hotel Owner accessing
the reservation and identity data necessary to fulfil their booking and comply
with hotel registration requirements.

A formal **Data Processing Agreement (DPA)** is in place between the Platform
and each Hotel Owner (Tenant), defining their respective controller and processor
obligations under the NDPA 2023. Hotel Owners who collect or process guest data
through the Platform are themselves data controllers and must comply with
applicable data protection law.

---

## 7. Third-Party Data Processors

We engage the following sub-processors to help deliver our services. Each
processor is bound by appropriate data protection agreements.

| Processor | Purpose | Data Shared | Location |
|---|---|---|---|
| **Backblaze B2** | Object storage for hotel photos and uploaded images | File contents, metadata | United States |
| **Upstash (QStash)** | Serverless message queues for email delivery, notifications, and background tasks | Message payloads (may include email addresses) | United States / EU |
| **Nodemailer / Gmail SMTP** | Transactional email delivery (booking confirmations, password resets) | Name, email address, booking reference | United States |
| **Stripe** | Payment processing and Hotel Owner payouts | Payment metadata, bank account details (Hotel Owners) | United States / Ireland |
| **[Hosting Provider]** | Cloud infrastructure and database hosting | All data stored on the Platform | [LOCATION — TO BE SPECIFIED] |

We do not sell personal data to third parties. We do not share personal data
with third parties for their own marketing purposes.

---

## 8. International Data Transfers

Some of our sub-processors are located outside Nigeria. Where we transfer
personal data outside Nigeria, we ensure that adequate safeguards are in place
as required by the NDPA 2023, including:

- Transfers to countries recognised as providing adequate data protection; or
- Standard Contractual Clauses (SCCs) or equivalent contractual protections; or
- The data subject's explicit consent.

You may request a copy of the transfer safeguards we rely on by contacting the
DPO.

---

## 9. Data Retention

We retain personal data for as long as necessary to fulfil the purposes set
out in this Policy, or as required by law.

| Data Type | Retention Period |
|---|---|
| Account and profile data | Duration of account + 3 years after closure (or as required by law) |
| Reservation records | 7 years (tax and audit requirements) |
| Payment records | 7 years |
| Reviews and user-generated content | Until deletion requested or account is closed |
| Audit logs (security and administrative) | 2 years |
| Server and access logs | 90 days |
| Marketing consent records | Duration of consent + 2 years |
| Password reset tokens | 12 minutes (auto-expired) |

**Soft Deletion:** When you delete your account or a record through the Platform,
we apply a **soft delete** (the record is flagged as deleted and hidden from
normal view) rather than an immediate hard deletion. This allows us to honour
legal retention obligations and respond to disputes. Upon expiry of the
applicable retention period, or upon a valid erasure request (see Section 10),
data is permanently deleted.

---

## 10. Your Rights Under the NDPA 2023

You have the following rights in relation to your personal data:

| Right | Description |
|---|---|
| **Access** | Request a copy of the personal data we hold about you. |
| **Rectification** | Ask us to correct inaccurate or incomplete data. |
| **Erasure ("Right to be Forgotten")** | Request permanent deletion of your data where there is no compelling reason for continued processing. Note: we may retain certain data to comply with legal obligations. |
| **Data Portability** | Receive your data in a structured, machine-readable format. |
| **Objection** | Object to processing based on legitimate interest, including direct marketing. |
| **Restriction** | Ask us to restrict processing in certain circumstances (e.g., while a dispute is resolved). |
| **Withdraw Consent** | Where processing is based on consent, withdraw it at any time without affecting processing before withdrawal. |

**How to Exercise Your Rights:** Submit a written request to the DPO at
[dpo@yourdomain.com]. We will respond within **21 days** as required by the
NDPA 2023 (or within 30 days under the GDPR where applicable), and we may
extend this by a further 30 days for complex requests.

We may need to verify your identity before processing a request. We will not
charge a fee for most requests, but may charge a reasonable fee for manifestly
unfounded or excessive requests.

**Right to Lodge a Complaint:** You may lodge a complaint with the **Nigeria
Data Protection Commission (NDPC)** at:

> Nigeria Data Protection Commission  
> No. 5 Donau Crescent, Off Amazon Street, Maitama District, Abuja  
> Website: [https://ndpc.gov.ng](https://ndpc.gov.ng)

---

## 11. Cookies and Tracking Technologies

We use cookies and similar tracking technologies to:

- Maintain your login session (session cookies).
- Remember your preferences and settings.
- Analyse how users navigate the Platform (analytics cookies).

**Cookie Categories:**

| Category | Required? | Purpose |
|---|---|---|
| Strictly Necessary | Yes — cannot be disabled | Authentication session, security tokens |
| Functional | Optional | User preferences, language settings |
| Analytics | Optional — requires consent | Understanding usage patterns to improve the Platform |

You may manage or withdraw cookie consent through our cookie consent banner at
any time. Note that disabling strictly necessary cookies will prevent you from
using the Platform. Full details are in our separate **Cookie Policy** [LINK].

---

## 12. Security Measures

We implement appropriate technical and organisational security measures,
including:

- **Stateless JWT authentication** (HS256) with time-limited tokens; no
  server-side sessions.
- **bcrypt** password hashing with a secure salt factor.
- **TLS encryption** in transit for all API and web traffic.
- **HTTP security headers** via Helmet (including HSTS, CSP, X-Frame-Options).
- **Rate limiting**: global (100 req/15 min), authentication endpoints (20
  req/15 min), and file uploads (10 req/min).
- **Role-based access control** with a strict hierarchy: `admin` >
  `org_admin` > `regular`/`premium` > `guest`.
- **Comprehensive audit logging** of all sensitive actions (`auth`,
  `data_mutation`, `admin_action`, `payment`) capturing actor ID, resource,
  IP address, user-agent, and success/failure status.
- **Tenant data isolation**: database queries are automatically scoped by
  `companyId` so tenants cannot access each other's data.
- **File upload restrictions**: images only (JPEG/PNG/WebP/GIF), 5 MB maximum,
  with server-side MIME type validation and automatic temp-file cleanup.

No method of transmission over the internet is 100% secure. We cannot guarantee
absolute security but commit to notifying you and the NDPC in the event of a
data breach as required by law.

---

## 13. Personal Data of Children

The Platform is not directed to children under the age of **18 years**. We do
not knowingly collect personal data from children. If you believe a child has
provided us with personal data, please contact the DPO and we will delete it
promptly.

---

## 14. Data Breach Notification

In the event of a personal data breach that poses a risk to your rights and
freedoms, we will:

1. Notify the **Nigeria Data Protection Commission (NDPC)** within **72 hours**
   of becoming aware of the breach (or as otherwise required by applicable law).
2. Notify affected data subjects without undue delay where the breach is likely
   to result in high risk.

Notifications will describe the nature of the breach, categories and approximate
number of data subjects affected, likely consequences, and the measures taken or
proposed to address the breach.

---

## 15. Additional Rights for Users in the European Economic Area (GDPR)

Where the GDPR applies (e.g., guests located in the EEA accessing the Platform),
you are entitled to the rights set out in Section 10 above, enforceable under
the GDPR in addition to the NDPA. You may also lodge a complaint with your
local EU supervisory authority.

Our lawful bases for processing under the GDPR mirror those listed in Section 5.

---

## 16. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we make material
changes, we will:

- Update the **"Last Revised"** date at the top of this document.
- Display a notice on the Platform and/or send you an email notification at
  least **14 days** before the changes take effect.
- Where required by law, obtain fresh consent.

Continued use of the Platform after the effective date of a revised Policy
constitutes acceptance of the changes.

---

## 17. Contact Us

For any questions about this Privacy Policy or to exercise your data protection
rights:

**Data Protection Officer**  
[COMPANY LEGAL NAME]  
[REGISTERED ADDRESS]  
Email: [dpo@yourdomain.com]  
Phone: [+234 XXX XXX XXXX]

---

*This document is a working draft for legal review and is not yet in force.*
