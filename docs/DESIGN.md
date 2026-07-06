# StayNG — UI Design Prompts for Google Stitch

Each section below is a **self-contained prompt** you can copy and paste directly
into [Google Stitch](https://stitch.withgoogle.com/) to generate a high-fidelity
mockup for that screen or component.

---

## Design System Reference (apply to every prompt)

```
BRAND: StayNG — Nigeria's #1 hotel booking platform
FONTS:
  Headings / Display → Plus Jakarta Sans (weights 600, 700, 800)
  Body / UI labels  → Inter (weights 400, 500, 600)
  Import: https://fonts.google.com/specimen/Plus+Jakarta+Sans
          https://fonts.google.com/specimen/Inter

COLOUR TOKENS:
  Primary      #0F2444   deep navy
  Accent       #F59E0B   warm amber
  Background   #F7F6F3   warm off-white
  Surface      #FFFFFF   card white
  Text         #111827   near-black
  Text-muted   #6B7280   secondary grey
  Border       #E5E7EB   light grey
  Success      #10B981   emerald
  Warning      #F59E0B   amber (same as accent)
  Danger       #EF4444   red
  Overlay      rgba(15,36,68,0.72)  dark navy overlay

SHAPE:
  Card radius    12 px
  Modal radius   20 px
  Button radius   8 px
  Chip radius   999 px (pill)

SHADOW:
  Card      0 1px 3px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.05)
  Elevated  0 4px 16px rgba(0,0,0,.10), 0 16px 40px rgba(0,0,0,.08)
  Nav       0 1px 0 rgba(0,0,0,.06), 0 2px 16px rgba(0,0,0,.04)

SPACING GRID: 8 px base unit

APPLE HIG PRINCIPLES:
  Clarity    — generous white space, strong typographic hierarchy
  Deference  — content is primary; chrome is invisible
  Depth      — frosted glass nav, layered cards with shadow, sticky sidebars
  Motion     — subtle spring transitions (200–350 ms), no decorative spin
```

---

## 0. Design Token Sheet & Component Library

```
Design a component library reference sheet for a hotel booking web app called
StayNG. The sheet should be divided into clearly labelled sections on a warm
off-white (#F7F6F3) canvas.

TYPOGRAPHY SCALE (Plus Jakarta Sans for all headings, Inter for body):
  Display   — 48 px / 700 / line-height 1.15  (hero titles)
  H1        — 36 px / 700 / line-height 1.2
  H2        — 28 px / 700 / line-height 1.25
  H3        — 22 px / 600 / line-height 1.3
  H4        — 18 px / 600 / line-height 1.35
  Body LG   — 17 px / 400 / Inter / line-height 1.6
  Body      — 15 px / 400 / Inter / line-height 1.6
  Caption   — 13 px / 500 / Inter / uppercase letter-spacing 0.04 em
  Mono      — 13 px / 500 / JetBrains Mono / for booking IDs

COLOUR SWATCHES: Show all 10 tokens as 80×80 rounded squares with HEX label.

BUTTON STATES:
  Primary   — bg #0F2444, text white, hover darken 8%
  Accent    — bg #F59E0B, text white, hover darken 8%
  Outline   — border 1.5 px #0F2444, text #0F2444, hover bg #0F2444 text white
  Ghost     — text #6B7280, hover bg #F7F6F3
  Danger    — bg #EF4444, text white
  All buttons 44 px tall min (Apple touch target), 8 px radius, Inter 600 font.

FORM INPUTS:
  Default   — border #E5E7EB, bg white, 44 px tall, 12 px radius
  Focus     — border #0F2444 2 px, shadow 0 0 0 3px rgba(15,36,68,.12)
  Error     — border #EF4444, error text below in #EF4444 13 px
  Disabled  — bg #F9FAFB, text #9CA3AF

BADGE / STATUS CHIPS (pill shape):
  Confirmed  — bg #D1FAE5 / text #065F46 / dot #10B981
  Pending    — bg #FEF3C7 / text #92400E / dot #F59E0B
  Cancelled  — bg #FEE2E2 / text #991B1B / dot #EF4444
  Checked-in — bg #DBEAFE / text #1E40AF / dot #3B82F6
  No-show    — bg #F3F4F6 / text #374151 / dot #6B7280

CARD COMPONENT: White surface, 12 px radius, Card shadow, 20 px padding.
  Show three card size variants: compact (h 80 px), standard, expanded.

ICON SET: Use 24×24 line icons (2 px stroke, rounded line-caps).
  Show 16 icons in a grid: MapPin, Star, Heart, Wifi, Pool, Dumbbell, Shield,
  Clock, Calendar, Users, ChevronRight, Search, Upload, QrCode, LogOut, Bell.

MOBILE NOTE: All touch targets minimum 44×44 px. Labels stack below icon on
mobile. Font sizes scale down 1 step on screens < 768 px.
```

---

## 1. Navigation Bar

```
Design the top navigation bar for StayNG, a Nigerian hotel booking platform.

LAYOUT:
  Fixed, full-width, 64 px tall on desktop / 56 px on mobile.
  Frosted-glass background: white at 88% opacity, backdrop-blur 20 px.
  Bottom border: 1 px solid rgba(0,0,0,.06).
  Apple HIG depth — the bar floats above page content with subtle shadow.

LEFT SIDE:
  Logo mark — a stylised door-arch icon in #0F2444 navy, 32 px tall.
  Wordmark — "StayNG" in Plus Jakarta Sans 700, 20 px, color #0F2444.
  Logo + wordmark sit side by side with 8 px gap.

CENTRE (desktop only):
  Three ghost-style nav links in Inter 500 15 px color #374151:
  "Hotels"  |  "Search"  |  "Deals"
  Active link: text #0F2444, underline 2 px solid #F59E0B, sits 2 px below text.
  Hover: text #0F2444 with 200 ms ease transition.

RIGHT SIDE — LOGGED-OUT STATE:
  "Sign In" — ghost button (text #0F2444, no background).
  "Get Started" — accent filled button (#F59E0B, text white, 8 px radius).
  8 px gap between buttons.

RIGHT SIDE — LOGGED-IN STATE:
  Bell icon (24 px, #6B7280) with amber dot indicator for unread notifications.
  User avatar chip: 36 px circular avatar in #0F2444 navy with white initials
  (Inter 600 14 px), followed by user first name in Inter 500 14 px.
  Chevron-down icon (16 px).
  On click: dropdown card (white, 16 px radius, elevated shadow) with options:
    My Profile / My Reservations / [Admin Dashboard if admin] / Sign Out.

MOBILE (< 768 px):
  Hide centre nav links and "Get Started" button.
  Show only logo + hamburger menu icon (24 px, #0F2444).
  On hamburger tap: full-height right-side drawer slides in (320 px wide, white,
  contains nav links + auth buttons stacked vertically with 16 px gaps).
  Drawer has close ✕ icon at top-right.

APPLE HIG: Bar is invisible when possible — uses blur instead of solid white to
let page content show through. No drop shadow on scroll, only the subtle blur.
```

---

## 2. Hero Section + Search Widget

```
Design the full-bleed hero section for StayNG's home page. This is the most
prominent section — it must communicate luxury, trust, and simplicity.

BACKGROUND:
  Deep navy gradient: linear-gradient(135deg, #0A1628 0%, #0F2444 50%, #1A3560 100%).
  Subtle noise texture overlay at 4% opacity for depth.
  Two large, soft radial glow orbs in the background:
    — Amber (#F59E0B) orb at 20% opacity, top-right, 600 px diameter, blurred 120 px
    — Indigo (#4F46E5) orb at 10% opacity, bottom-left, 400 px diameter, blurred 80 px
  The orbs create a dreamy, premium atmosphere without being garish.

CONTENT (vertically centred, horizontally centred, max-width 840 px):

  Top badge (pill chip):
    — Small amber dot + "Nigeria's #1 Hotel Booking Platform" in Inter 600 13 px
    — Pill background: rgba(245,158,11,.15) / border 1 px rgba(245,158,11,.3)
    — Text colour: #F59E0B
    — Animated: fades in and slides up 12 px on load (300 ms spring)

  Main headline (stacked, centre-aligned):
    Line 1: "Find Your" — Plus Jakarta Sans 700, 64 px, white
    Line 2: "Perfect Stay" — Plus Jakarta Sans 800, 64 px, warm amber #F59E0B
    Letter-spacing: -0.02 em. Line-height: 1.1.
    Animated: each line fades in with 80 ms stagger.

  Subheadline:
    "Discover and book the best hotels across Nigeria — confirmed instantly,
    no queues, no paper forms."
    Inter 400, 18 px, rgba(255,255,255,0.72), max-width 540 px, line-height 1.6.

  SEARCH WIDGET CARD (most important element):
    White card, 20 px radius, Elevated shadow, 24 px internal padding.
    Sits 32 px below the subheadline.
    Horizontal row on desktop (4 fields side by side + search button):

    Field 1 — Location:
      Left icon: MapPin 20 px #6B7280.
      Label above: Inter 600 12 px uppercase #6B7280 "DESTINATION".
      Input: Inter 500 16 px #111827 placeholder "City or state...".
      Right side: subtle vertical divider 1 px #E5E7EB.

    Field 2 — Check-in:
      Left icon: Calendar 20 px #6B7280.
      Label: "CHECK-IN".
      Value: date in format "Mon, 14 Jul".

    Field 3 — Check-out:
      Left icon: Calendar 20 px #6B7280.
      Label: "CHECK-OUT".
      Value: date in format "Wed, 16 Jul".

    Field 4 — Guests:
      Left icon: Users 20 px #6B7280.
      Label: "GUESTS".
      Value: "2 Adults" with a small minus/plus stepper.

    Search Button:
      48 px tall, 140 px wide, bg #F59E0B, radius 10 px.
      Search icon (white, 20 px) + "Search" in Inter 700 16 px white.
      Hover: scale 1.02, darken 6%.

    Below search fields — city quick-pick chips:
      "Popular:" label in Inter 500 13 px #9CA3AF, followed by:
      Lagos · Abuja · Port Harcourt · Kano · Ibadan · Calabar
      Pill chips: bg rgba(255,255,255,0.12), text white Inter 500 13 px,
      border 1 px rgba(255,255,255,0.2), hover bg rgba(255,255,255,0.2).

  Scroll indicator:
    Bottom-centre: animated bouncing chevron-down icon in white at 50% opacity.

HERO HEIGHT: 100 vh on desktop, 85 vh on mobile.

MOBILE (< 768 px):
  Headline drops to 42 px.
  Search widget stacks into 2×2 grid (Location + Guests top row, dates bottom).
  Search button full-width below fields.
  Quick-pick chips scroll horizontally.
```

---

## 3. Stats Strip

```
Design a compact stats strip section for StayNG's home page, placed immediately
below the hero section.

BACKGROUND: White (#FFFFFF), full-width. 48 px top padding, 48 px bottom padding.
Border-top: 1 px solid #E5E7EB.

LAYOUT: 4 stat items in a horizontal row, evenly spaced, max-width 960 px,
centred on page. Each item centre-aligned.

STAT ITEM ANATOMY (repeat × 4):
  Large number: Plus Jakarta Sans 800, 36 px, color #0F2444.
    Formatted: "5,000+" / "36" / "500K+" / "8+"
  Label below: Inter 500, 14 px, color #6B7280.
    Labels: "Hotels Listed" / "States Covered" / "Happy Guests" / "Years of Trust"
  Icon above number: 32 px icon in a 52×52 circle bg #F7F6F3:
    Building2 / MapPin / SmilePlus / Award

DIVIDERS: 1 px vertical line in #E5E7EB between each stat on desktop only.

ANIMATION: Numbers count up from 0 to their final value over 1.5 s using an
ease-out curve when the section scrolls into view.

MOBILE (< 768 px):
  Reflow to 2×2 grid. Remove vertical dividers. Reduce number to 28 px.
  Add subtle horizontal divider between top and bottom rows.
```

---

## 4. Top Destinations Grid

```
Design the "Explore Nigeria — Popular Destinations" section for the StayNG home page.

SECTION HEADER:
  Left-aligned, max-width 1200 px centred on page.
  Eyebrow label: "EXPLORE NIGERIA" — Inter 600 12 px uppercase letter-spacing 0.12 em
    color #F59E0B (accent).
  Title: "Popular Destinations" — Plus Jakarta Sans 700 36 px color #0F2444.
  Subtext: "Choose your next escape from Nigeria's most loved cities."
    — Inter 400 16 px color #6B7280.
  Right side: "See all cities →" text link in Inter 600 14 px #0F2444.

DESTINATIONS GRID:
  6 city cards in a 3-column × 2-row grid on desktop.
  Cards are tall image cards (aspect ratio 3:4 on desktop / 16:9 on mobile).
  Each card shows a rich, full-bleed city photo with a dark gradient overlay
  at the bottom (transparent → rgba(0,0,0,0.72), from 40% height to bottom).

  CARD CONTENT (pinned to bottom-left, over the photo):
    Hotel count badge: pill chip, bg rgba(245,158,11,0.9), text white Inter 700 12 px.
      e.g. "142 Hotels"
    City name: Plus Jakarta Sans 700 22 px white.
    State label: Inter 500 14 px rgba(255,255,255,0.75).

  CARD HOVER STATE:
    Scale up 1.03 (300 ms spring). Gradient darkens slightly.
    A subtle amber bottom-border (3 px) appears on the card.

  CARD RADIUS: 16 px.
  CARD SHADOW: Card shadow.
  GAP between cards: 16 px.

  Cities in order: Lagos (largest, top-left), Abuja, Port Harcourt, Kano,
  Ibadan, Calabar.

MOBILE (< 768 px):
  Reflow to horizontal scroll carousel. Cards 72 vw wide × 220 px tall.
  Snap-scroll between cards. Show half of next card to hint at scrollability.
```

---

## 5. Top Deals — Hotel Cards

```
Design the "Top Deals — Limited Time Offers" section for the StayNG home page.
This section features a horizontal row of 4 hotel deal cards.

SECTION HEADER (same pattern as Section 4):
  Eyebrow: "LIMITED TIME" in #F59E0B.
  Title: "Top Deals" in Plus Jakarta Sans 700 36 px #0F2444.
  Right: "View all deals →" link.

HOTEL DEAL CARD (repeat × 4, each ~300 px wide):
  White surface, 16 px radius, Card shadow.
  Hover: Elevated shadow + translate up -4 px (200 ms spring).

  IMAGE AREA (top, height 180 px):
    Full-width image with deep navy fallback gradient if image missing.
    Top-left: DEAL BADGE — pill chip bg #EF4444, text white Inter 700 12 px:
      "−30% OFF"
    Top-right: Heart/wishlist button — 36×36 circle, white bg, shadow,
      HeartIcon #6B7280 / filled #EF4444 when toggled.
    Bottom-left: Category badge — pill bg rgba(0,0,0,0.55) text white 12 px:
      "Luxury" / "Budget" / "Boutique" etc.

  CARD BODY (20 px padding):
    Star rating row: 5 stars (solid amber #F59E0B for filled, grey for empty),
      numeric rating "4.8" Inter 700 14 px, review count "(124 reviews)" grey 13 px.

    Hotel name: Plus Jakarta Sans 600 17 px #111827, max 2 lines clamped.

    Location: MapPin icon 14 px #6B7280 + city name Inter 500 14 px #6B7280.

    Amenity chips (horizontal row, scrollable if overflow):
      Wifi / Pool / Gym — each: small icon (14 px) + label Inter 500 12 px
      bg #F7F6F3 colour #374151, 6 px vertical / 10 px horizontal padding, pill.

    Price row (flush to bottom):
      Original price strikethrough: "₦45,000" Inter 400 14 px #9CA3AF.
      Discounted price: "₦31,500" Inter 700 22 px #0F2444.
      "/night" suffix Inter 400 13 px #6B7280.
      Right side: "Book" button — accent filled #F59E0B text white Inter 600 14 px,
        40 px tall, 8 px radius, full-width on mobile.

GRID: 4 columns on desktop / 2 columns on tablet / 1 column on mobile (vertical scroll).
GAP: 20 px.

MOBILE: Cards stack to full width. Image height shrinks to 160 px.
```

---

## 6. Why StayNG — Trust Section

```
Design a "Why Choose Us" trust-and-features section for StayNG's home page.

BACKGROUND: Warm off-white #F7F6F3. 80 px vertical padding.

SECTION HEADER (centred):
  Eyebrow: "WHY STAYNGN" #F59E0B.
  Title: "Book with Confidence" Plus Jakarta Sans 700 36 px #0F2444 centred.
  Subtext: "Everything you need for a seamless Nigerian hotel experience."
    Inter 400 17 px #6B7280 centred.

FEATURES GRID: 3 equal cards side by side.

FEATURE CARD:
  White surface, 16 px radius, Card shadow, 32 px padding.
  Centre-aligned content.

  Icon container: 64×64 circle, gradient background, centred.
    Card 1 — Shield: gradient #0F2444 → #1E40AF, ShieldCheck icon 28 px white.
    Card 2 — Clock: gradient #0D9488 → #0891B2, Clock icon white.
    Card 3 — Tag: gradient #D97706 → #F59E0B, BadgePercent icon white.

  Feature title: Plus Jakarta Sans 700 20 px #0F2444, 16 px below icon.
    "Secure Booking" / "24/7 Support" / "Best Price Guarantee"

  Feature description: Inter 400 15 px #6B7280, line-height 1.65, 8 px below title.
    1–2 sentences explaining the feature.

  Bottom: A subtle "Learn more →" text link in Inter 600 14 px #0F2444
    that appears on hover (opacity 0 → 1, translate-x 4 px on hover).

CARD HOVER: Card lifts with Elevated shadow + translate up -4 px (200 ms).

MOBILE: Stack to 1 column. Cards full-width. Left-align content.
```

---

## 7. Newsletter CTA Banner

```
Design a full-width newsletter call-to-action section for the bottom of the
StayNG home page.

BACKGROUND:
  Rich gradient: linear-gradient(135deg, #0A1628 0%, #0F2444 60%, #1A3560 100%).
  Same amber and indigo glow orbs as Hero section but smaller (200–300 px diameter).
  80 px vertical padding.

LAYOUT: Two-column on desktop (60% text / 40% form), single column on mobile.

LEFT COLUMN:
  Amber eyebrow label: "GET EXCLUSIVE DEALS" Inter 600 12 px uppercase #F59E0B.
  Headline: "Never Miss a Great Deal" Plus Jakarta Sans 700 36 px white.
    "Never Miss a" on line 1, "Great Deal" on line 2 in amber.
  Subtext: "Join 500,000+ travellers getting the best hotel rates in Nigeria."
    Inter 400 16 px rgba(255,255,255,0.72).

  Three micro-benefit chips below (horizontal row):
    ✓ Weekly deal alerts
    ✓ Exclusive discounts
    ✓ No spam, ever
    Each: Inter 500 14 px white / checkmark in #10B981 emerald.

RIGHT COLUMN:
  Email input field:
    bg rgba(255,255,255,0.1), border 1 px rgba(255,255,255,0.2),
    16 px radius, 52 px tall, text white Inter 500 16 px,
    placeholder "Your email address" rgba(255,255,255,0.5),
    Mail icon left-inside 20 px.

  "Subscribe" button below input (full width):
    bg #F59E0B, text white Inter 700 16 px, 52 px tall, 12 px radius.
    Arrow-right icon 16 px white on right side of text.

  Disclaimer below button:
    "By subscribing you agree to our Privacy Policy. Unsubscribe anytime."
    Inter 400 12 px rgba(255,255,255,0.45) centred.

MOBILE: Stack columns. Headline reduces to 28 px. Full-width input and button.
```

---

## 8. Footer

```
Design the footer for StayNG, a Nigerian hotel booking platform.

BACKGROUND: #0A1628 (deepest navy). 64 px top padding / 32 px bottom padding.

TOP SECTION — 4-column grid (desktop):

  Column 1 — Brand (widest, ~30%):
    Logo mark + "StayNG" wordmark in white.
    Tagline: "Nigeria's #1 hotel booking and management platform."
      Inter 400 14 px rgba(255,255,255,0.60), max 240 px.
    Social icons (horizontal row, 32 px each, 8 px gap):
      Twitter/X · Instagram · LinkedIn · Facebook
      Circle bg rgba(255,255,255,0.08), icon rgba(255,255,255,0.60).
      Hover: bg #F59E0B, icon white.

  Column 2 — Explore:
    Heading: "Explore" Inter 600 14 px uppercase #F59E0B letter-spacing 0.1 em.
    Links: Browse Hotels / Top Deals / Destinations / Search / Reviews
    Inter 400 14 px rgba(255,255,255,0.60), 12 px vertical gap between links.
    Hover: text white, translate-x 4 px (150 ms).

  Column 3 — Company:
    Heading: "Company" (same style as above).
    Links: About Us / Careers / Blog / Press / Partners

  Column 4 — Contact & Support:
    Heading: "Support".
    Links: Help Center / Contact Us / Privacy Policy / Terms of Use / Cookie Policy
    Phone: +234 800 000 0000 in white, PhoneCall icon left.
    Email: support@staynghotels.com with Mail icon.

DIVIDER: 1 px solid rgba(255,255,255,0.08) horizontally across full width.

BOTTOM BAR (below divider, 32 px top padding):
  Left: © 2026 StayNG. All rights reserved. Inter 400 13 px rgba(255,255,255,0.40).
  Right: "Made with ♥ in Nigeria" Inter 500 13 px rgba(255,255,255,0.40).

MOBILE (< 768 px):
  Columns stack to 1 column. Column 1 full width. Other columns in 2×2 grid.
  Social icons centred. Bottom bar stacks.
```

---

## 9. Hotels Listing — Page Header & Category Tabs

```
Design the page header and category tab bar for the StayNG Hotels Listing page (/hotels).

PAGE HEADER (below main nav, bg white, 32 px padding):
  Breadcrumb: "Home > Hotels" Inter 500 13 px #9CA3AF, chevron-right separator.
  Title: "Browse Hotels" Plus Jakarta Sans 700 32 px #0F2444.
  Results count: "1,240 properties found across Nigeria"
    Inter 400 15 px #6B7280.

CATEGORY TAB BAR (below header, sticky below nav on scroll):
  White background, border-bottom 1 px #E5E7EB, horizontal padding 24 px.
  Tabs: All · Luxury · Mid-Range · Budget · Boutique · Resort

  TAB STYLE:
    Default: Inter 600 14 px #6B7280, 40 px tall, 16 px horizontal padding.
    Active tab: text #0F2444, 3 px amber #F59E0B border-bottom, bg transparent.
    Hover: text #0F2444.
    Transition: 150 ms ease.

  RIGHT SIDE of tab bar (desktop only):
    Sort dropdown: "Sort: Recommended ▾" Inter 500 14 px, outlined 1 px #E5E7EB,
      8 px radius, 36 px tall. Options: Recommended / Price Low→High /
      Price High→Low / Top Rated.

MOBILE: Tab bar scrolls horizontally (no wrapping). Sort control moves to top of
results list as a chip dropdown.
```

---

## 10. Hotels Listing — Filter Sidebar

```
Design the filter sidebar for the StayNG hotels listing page.

CONTAINER:
  Width: 256 px. Position: sticky, top 128 px (below nav + tabs).
  White card, 16 px radius, Card shadow, 24 px padding. Full page height.

SIDEBAR HEADER:
  "Filters" Plus Jakarta Sans 700 18 px #0F2444 with SlidersHorizontal icon 18 px.
  Right: "Clear all" text button Inter 600 13 px #EF4444 (only shown when filters active).

FILTER GROUP 1 — Price Range:
  Group label: Inter 600 14 px #374151 uppercase 0.06 em, with Tag icon 16 px.
  Price display: "₦10,000 — ₦80,000" Inter 700 16 px #0F2444, centred.
  Dual-handle range slider: track bg #E5E7EB, filled portion bg #0F2444,
    handles 20 px circles white border-2 #0F2444, shadow.
  Min/max labels Inter 400 12 px #9CA3AF at ends.

FILTER GROUP 2 — Amenities:
  Group label: "Amenities" with Filter icon.
  List of checkbox items (vertical), 12 px gap:
    Wifi · Swimming Pool · Gym · Restaurant · 24h Security · CCTV
    · Bar & Lounge · Car Park · Room Service
  Checkbox: 18×18 px, border 2 px #D1D5DB, checked: bg #0F2444 with white checkmark.
  Label: Inter 500 14 px #374151, icon left of label (16 px, #6B7280).

FILTER GROUP 3 — Minimum Rating:
  Group label: "Minimum Rating" with Star icon.
  Three pill toggle buttons in a row:
    "4+ ★" / "4.5+ ★" / "4.8+ ★"
    Default: bg #F7F6F3 border #E5E7EB text #374151.
    Selected: bg #0F2444 text white.

FILTER GROUP 4 — Hotel Type:
  Group label: "Hotel Type".
  Grid of 2-column type chips:
    Luxury / Mid-Range / Budget / Boutique / Resort / All
    Same toggle pill style as rating buttons.

DIVIDERS: 1 px #E5E7EB between each filter group, 20 px vertical margin.

MOBILE (< 768 px):
  Sidebar is hidden by default. A "Filters" button (with SlidersHorizontal icon)
  appears above the results grid. Tap opens a bottom sheet (slides up from bottom,
  20 px top radius, 80% of screen height, white background) containing the same
  filter groups. Bottom of sheet: "Apply Filters" primary button + "Reset" ghost button.
```

---

## 11. Hotels Listing — Hotel Card (Grid Item)

```
Design the hotel card component used in the StayNG hotels listing grid.

CARD CONTAINER:
  White surface, 16 px radius, Card shadow.
  Hover: translate-y -6 px, Elevated shadow (250 ms spring).
  Cursor: pointer. Full card is clickable.

IMAGE AREA (top, height 200 px):
  Full-width hotel photo. Object-fit cover. 16 px top-left/right radius.
  Gradient overlay bottom 40%: transparent → rgba(0,0,0,0.50).

  Top-left badge: Hotel category chip
    bg rgba(15,36,68,0.75), text white Inter 700 12 px, 6 px radius.
    "Luxury" / "Budget" / "Boutique"

  Top-right: Heart/wishlist button
    36×36 white circle, shadow, HeartIcon.
    Default: #D1D5DB. Saved: #EF4444 filled.
    Animated scale pulse on toggle.

  Bottom-left (over gradient): Deal badge (only when deal available)
    bg #EF4444, pill, text white Inter 700 12 px: "−25% OFF"

CARD BODY (20 px all sides):

  Row 1 — Rating:
    5 stars (amber #F59E0B, 14 px). Numeric "4.8" Inter 700 14 px #0F2444.
    "(218 reviews)" Inter 400 13 px #9CA3AF.

  Row 2 — Hotel Name:
    Plus Jakarta Sans 600 18 px #111827. Max 2 lines, ellipsis overflow.

  Row 3 — Location:
    MapPin icon 14 px #9CA3AF. "Lagos Island, Lagos" Inter 500 14 px #6B7280.

  Row 4 — Amenity chips (3 max, then "+2 more"):
    Chip: bg #F7F6F3, text #374151 Inter 500 12 px, icon 12 px, 6/10 px padding.
    Icons: Wifi / Dumbbell / Waves / Utensils / Car

  Row 5 — Price + CTA (flex, space-between, align bottom):
    LEFT: Price block
      Original crossed price "₦45,000" Inter 400 13 px #9CA3AF strikethrough
        (only shown if deal active).
      Main price: "₦31,500" Plus Jakarta Sans 700 22 px #0F2444.
      "/night" Inter 400 13 px #6B7280.
    RIGHT: "View Deal" button
      bg #F59E0B, text white Inter 600 14 px, 36 px tall, 8 px radius, 16 px padding.
      ChevronRight icon 14 px right of text.

MOBILE: Cards go full width. Image height reduces to 180 px.
```

---

## 12. Hotel Detail — Gallery Header

```
Design the top section of the Hotel Detail page (/hotels/:id) for StayNG.

GALLERY AREA (full-width, height 480 px on desktop / 280 px on mobile):
  Primary large photo (70% of width, left side).
  Right side: 2×2 grid of smaller thumbnail photos (30% width).
    All photos same height, object-fit cover, no gaps between them.
  Bottom-right thumbnail: dark overlay with "View all photos" text + Grid icon.
  Top-left: "← Back to hotels" ghost button (white, frosted glass bg).
  Top-right: Two icon buttons (white circle, frosted glass):
    HeartIcon (wishlist) + ShareIcon.

  BELOW GALLERY — Hotel Identity Bar (white bg, 32 px padding, border-bottom):
    Left: Hotel name Plus Jakarta Sans 800 32 px #0F2444.
    Below name: MapPin icon + "14 Adeola Odeku St, Victoria Island, Lagos"
      Inter 400 15 px #6B7280.
    Rating row: Stars + "4.8" + "(412 reviews)" + amber verified badge.

    Right side (desktop): Price preview from "₦28,000/night" and CTA.

MOBILE: Single full-width photo (swipeable carousel with dot indicators).
  Gallery grid hidden on mobile. Name/address below photo.
```

---

## 13. Hotel Detail — Info, Amenities & Reviews (Left Column)

```
Design the main content column of the Hotel Detail page for StayNG.
This is a 2/3-width left column on desktop, full-width on mobile.

SECTION 1 — Description:
  Section title: "About this hotel" Plus Jakarta Sans 700 22 px #0F2444.
  Body text: Inter 400 16 px #374151 line-height 1.7. Show 3 lines with
  "Read more" expand link in #0F2444 Inter 600 14 px when collapsed.

SECTION 2 — Amenities:
  Section title: "What's included" Plus Jakarta Sans 700 22 px #0F2444.
  Grid of amenity items: 3 columns × N rows.
  Each item: icon 20 px #0F2444 + label Inter 500 15 px #374151.
    Border 1 px #E5E7EB, 12 px radius, 16 px padding.
    Active/available: bg white. Unavailable: bg #F7F6F3, icon #D1D5DB, text #9CA3AF.
  Amenities: Restaurant / Bar & Lounge / Swimming Pool / Gym / Wifi /
    DSTV / CCTV / 24h Security / Car Park / Car Hire / Room Service / 24h Power

SECTION 3 — Available Rooms:
  Section title: "Choose your room" Plus Jakarta Sans 700 22 px #0F2444.

  ROOM CARD (white, 12 px radius, border 1 px #E5E7EB, 20 px padding):
    Left side (30%): Room photo placeholder 120 px tall, 12 px radius.
    Right side (70%):
      Room name: Plus Jakarta Sans 600 18 px #0F2444.
      Capacity: Users icon + "Up to 2 guests" Inter 500 14 px #6B7280.
      Room condition badge (Excellent / Good / Fair).
      Description: Inter 400 14 px #6B7280 2 lines.
      Bottom row: "₦28,000 / night" Plus Jakarta Sans 700 18 px #0F2444 +
        "Select Room →" amber button right-aligned.

    SELECTED STATE: Border 2 px #F59E0B, bg #FFFBEB, a small amber checkmark chip top-right.
    FULLY BOOKED STATE: Overlay: bg rgba(255,255,255,0.7), "Fully Booked" red pill centre.

  Multiple room cards stacked with 16 px gaps.

SECTION 4 — Reviews:
  Section title: "Guest reviews" Plus Jakarta Sans 700 22 px #0F2444.
  Subtitle: Rating summary "4.8 overall · 412 reviews".

  RATING BREAKDOWN BAR (compact):
    5 categories horizontal: Cleanliness / Comfort / Service / Security / Location.
    Each: label Inter 500 13 px + progress bar (bg #E5E7EB, filled #F59E0B) + score "4.9".

  REVIEW CARDS (stacked, 16 px gap):
    Guest avatar circle (40×40, bg #0F2444, white initials) + guest name Inter 600 14 px.
    Date: Inter 400 13 px #9CA3AF. Stars 14 px.
    Review body: Inter 400 15 px #374151 line-height 1.65. Max 4 lines, expand link.

  Divider then "Load more reviews" ghost button centred.

MOBILE: All sections full-width, stacked vertically.
```

---

## 14. Hotel Detail — Sticky Booking Widget (Right Column)

```
Design the sticky booking widget sidebar for the StayNG Hotel Detail page.
This is a 1/3-width right column on desktop that sticks while scrolling.

WIDGET CONTAINER:
  White surface, 20 px radius, Elevated shadow, 24 px padding.
  Sticky: top 96 px.

PRICE HEADER:
  "₦28,000" Plus Jakarta Sans 800 32 px #0F2444.
  "/night" Inter 400 16 px #6B7280.
  Right side: Star "4.8" Inter 700 14 px #0F2444 + "(412 reviews)" #9CA3AF.

BOOKING FORM:
  Border 1 px #E5E7EB, 12 px radius, overflow hidden.
  Divides into a 2×2 grid of date/guest inputs:

  Top-left: CHECK-IN (Inter 600 11 px uppercase #6B7280)
    Date value: Inter 500 16 px #111827.
  Top-right: CHECK-OUT (same style).
    Separator: 1 px solid #E5E7EB vertical on desktop / horizontal on mobile.
  Bottom (full-width): GUESTS (Inter 600 11 px uppercase #6B7280)
    "2 guests" Inter 500 16 px #111827. Plus/minus stepper right side.

PRICE BREAKDOWN (shown when dates are selected, 16 px top margin):
  Subtle bg #F7F6F3, 10 px radius, 16 px padding.
  Line items (Inter 400 15 px #374151):
    "₦28,000 × 3 nights"  ₦84,000
    "Taxes & fees"          ₦7,560
  Divider line.
  "Total" Inter 700 16 px #0F2444 + bold total amount right-aligned.

CTA BUTTON:
  "Reserve Now" — full-width, 52 px tall, bg #0F2444, text white Inter 700 16 px,
    12 px radius. Chevron-right icon right side.
  Hover: bg lighten 8%, scale 1.01.
  Disabled state (no dates): bg #E5E7EB text #9CA3AF.

TRUST CHIPS below button (3 items, horizontal, centre-aligned):
  ShieldCheck icon + "Free cancellation" / Clock icon + "Instant confirmation" /
  Tag icon + "Best price guarantee"
  All: Inter 500 12 px #6B7280. Icons 14 px #10B981.

"You won't be charged yet." Inter 400 13 px #9CA3AF, centred below trust chips.

MOBILE: Widget becomes a fixed bottom bar (not full sidebar).
  Shows "₦28,000 / night" on left + "Reserve Now" amber button right.
  Tap button opens a bottom sheet containing the full booking form.
```

---

## 15. Search Results Page

```
Design the search results page for StayNG (/search?city=Lagos&dateIn=...&dateOut=...&guests=2).

PAGE HEADER (white bg, 24 px padding):
  Compact search bar (full-width, same 4-field layout as hero but condensed, 44 px tall).
  Below bar: "Showing results for Lagos · 14–16 Jul · 2 guests"
    Inter 500 14 px #6B7280. Edit icon right.

RESULTS LAYOUT: Same 2-column layout as Hotels Listing page (filter sidebar left
+ cards grid right). Re-use the filter sidebar from Prompt 10 unchanged.

RESULTS GRID: 3 columns on desktop, 2 on tablet, 1 on mobile.
Use identical hotel cards from Prompt 11.

EMPTY STATE (when no results):
  Centred illustration: MagnifyingGlass icon 80 px #D1D5DB.
  "No hotels found in Lagos for those dates." Plus Jakarta Sans 700 22 px #0F2444.
  "Try adjusting your dates, guests, or filters." Inter 400 15 px #6B7280.
  "Edit search" primary button + "Browse all hotels" ghost button.

MAP TOGGLE (top-right of results area, desktop only):
  Toggle pill: "List" | "Map" — Map view is a future feature; show Map tab as
  disabled with a "Coming soon" tooltip on hover.

MOBILE: Search bar collapses to a single row showing summary text + Edit icon.
  Filter button appears above results. No sidebar on mobile (use bottom sheet).
```

---

## 16. Auth Layout — Shared Left Panel

```
Design the shared split-panel auth layout used for Login, Register, Forgot
Password, and Reset Password pages on StayNG.

OVERALL LAYOUT: Full-screen, 2 columns.
  Left panel: 5/12 of width. Hidden on screens < 768 px.
  Right panel: 7/12 of width. Full width on mobile (takes over entire screen).

LEFT PANEL (decorative, brand storytelling):
  Background: same deep navy gradient as Hero (#0A1628 → #0F2444 → #1A3560).
  Ambient orbs: amber + indigo, same as Hero section.
  Padding: 48 px.

  Top-left: Logo mark + "StayNG" wordmark in white.

  Centre content (vertically centred):
    Headline: Plus Jakarta Sans 800 40 px white.
      "Nigeria's #1 Hotel Booking Platform"
    Sub: Inter 400 18 px rgba(255,255,255,0.70).
      "Discover, book, and check in — all in one place."

    Trust stats (3 items, horizontal, 24 px gap):
      Each stat: large number Plus Jakarta Sans 800 32 px #F59E0B + label white 14 px.
        "5,000+" Hotels / "36" States / "4.8 ★" Rating
      Subtle separator: vertical amber line between stats.

    Testimonial card (mt 32 px):
      White at 10% opacity bg, 12 px radius, 20 px padding.
      Quote mark " in amber 40 px.
      Quote text: Inter 400 15 px white/80%.
      Guest avatar (32 px circle) + name + "Lagos, Nigeria".

  Bottom-left: "© 2026 StayNG" Inter 400 13 px white/40%.

RIGHT PANEL (the form area):
  White background. Vertical + horizontal centred form container, max-width 440 px.
  On mobile: full-screen white. Show logo at top-left (mobile only) 24 px margin.
```

---

## 17. Login Page

```
Design the login form for StayNG placed in the right panel of the auth layout.

FORM CONTAINER (max-width 440 px, centred in right panel):

  FORM HEADER:
    "Welcome back" Plus Jakarta Sans 700 30 px #0F2444.
    "Sign in to your StayNG account." Inter 400 15 px #6B7280. mt 8 px.
    Divider: 1 px #E5E7EB mt 24 px mb 24 px.

  FIELD 1 — Email:
    Label row: "Email address" Inter 600 14 px #374151 left, no right label.
    Input: 52 px tall, 12 px radius, border 1 px #E5E7EB.
      Mail icon 18 px #9CA3AF inside-left (16 px padding from edge).
      Placeholder: "you@example.com" #9CA3AF.
      Focus: border #0F2444 2 px, 0 0 0 3px rgba(15,36,68,.12) shadow.
      Error: border #EF4444, below the field: "Please enter a valid email."
        Inter 400 13 px #EF4444. Animated slide-down 200 ms.

  FIELD 2 — Password:
    Label row: "Password" left + "Forgot password?" right (Inter 600 13 px #0F2444 link).
    Input: same 52 px height.
      Lock icon 18 px left. Eye/EyeOff toggle icon 18 px right (toggles visibility).

  SUBMIT BUTTON:
    "Sign In" full-width 52 px, bg #0F2444, text white Plus Jakarta Sans 700 16 px,
    12 px radius. mt 24 px.
    Loading state: spinner (20 px white) + "Signing in…" text.

  DIVIDER:
    "or continue with" horizontal rule (lines either side of text), Inter 400 13 px #9CA3AF.

  SOCIAL AUTH ROW (2 buttons side by side, same height 48 px):
    Google: border 1 px #E5E7EB, Google logo icon + "Google" Inter 600 14 px #374151.
    Apple: border 1 px #E5E7EB, Apple icon + "Apple" Inter 600 14 px #374151.
    Hover: bg #F7F6F3.
    (These are display-only if social auth is not implemented; mark as future.)

  FOOTER:
    "Don't have an account? Create one free →"
    Inter 500 14 px #6B7280. "Create one free →" in #0F2444 Inter 700.
    Centred below submit. mt 24 px.

MOBILE: Right panel takes full screen. Remove left panel. Form has 24 px side padding.
```

---

## 18. Register Page

```
Design the registration form for StayNG in the right panel of the auth layout.

FORM HEADER:
  "Create account" Plus Jakarta Sans 700 30 px #0F2444.
  "Join StayNG and discover Nigeria's best hotels." Inter 400 15 px #6B7280.

FORM FIELDS (stacked with 20 px gap between fields):

  ROW 1 — Name (2 columns, 12 px gap):
    First Name: User icon + placeholder "Chidi"
    Last Name: placeholder "Okonkwo"
    Each field 52 px tall, same input style as Login.

  ROW 2 — Email Address:
    Full-width. Mail icon. Placeholder "chidi@example.com".

  ROW 3 — Phone Number:
    Full-width. Phone icon.
    Left inside: "+234" country prefix chip (bg #F7F6F3, border-right 1 px #E5E7EB).
    Placeholder "0801 234 5678".
    Helper text below: Inter 400 12 px #9CA3AF "Nigerian phone number format."

  ROW 4 — Password:
    Lock icon + eye toggle. Placeholder "Min. 8 characters".
    Password strength bar below input (4 segments: weak=red / fair=amber / strong=green / very strong=emerald). Animated fill as user types.

  ROW 5 — Confirm Password:
    Lock icon + eye toggle. Placeholder "Repeat your password".
    Inline match check: green checkmark when passwords match.

  TERMS ACCEPTANCE:
    18×18 px checkbox (rounded 4 px) + "I agree to the Terms of Use and Privacy Policy"
    Inter 400 13 px #6B7280. "Terms of Use" and "Privacy Policy" are amber links.

  SUBMIT BUTTON:
    "Create Account" full-width 52 px bg #F59E0B text white Plus Jakarta Sans 700 16 px.
    12 px radius.

  FOOTER: "Already have an account? Sign in →" (same style as Login).

MOBILE: Name fields stack to 1 column. All other fields full-width.
Password strength bar always visible.
```

---

## 19. Forgot Password & Reset Password

```
Design two compact password-recovery screens for StayNG, both using the same
auth layout split panel.

--- SCREEN A: FORGOT PASSWORD (/forgot-password) ---

FORM HEADER:
  Lock icon in a 64×64 circle bg #F7F6F3 centred above text.
  "Reset your password" Plus Jakarta Sans 700 28 px #0F2444 centred.
  "Enter your email address and we'll send you a secure reset link."
  Inter 400 15 px #6B7280 centred.

EMAIL FIELD: Full-width, same input style. Mail icon. Placeholder "you@example.com".

CTA BUTTON: "Send Reset Link" full-width 52 px bg #0F2444 white text.
  Loading state: spinner + "Sending…"

BACK LINK: "← Back to sign in" Inter 500 14 px #6B7280 centred below button.

SUCCESS STATE (shown after submission, replaces form):
  CheckCircle icon 64 px #10B981 centred.
  "Check your inbox" Plus Jakarta Sans 700 24 px #0F2444.
  "We sent a reset link to you@example.com. Check spam if you don't see it."
  Inter 400 15 px #6B7280.
  "Resend email" ghost link + countdown "Resend in 0:58" timer in #9CA3AF.

--- SCREEN B: RESET PASSWORD (/reset-password?token=...) ---

FORM HEADER:
  KeyRound icon in circle centred.
  "Set a new password" Plus Jakarta Sans 700 28 px #0F2444.

FIELDS:
  New Password: Lock icon + eye toggle + password strength bar.
  Confirm Password: Lock icon + eye toggle + inline match check.

REQUIREMENTS CHECKLIST (below fields):
  Compact checklist, each item Inter 400 13 px:
  ✓ At least 8 characters / ✓ One uppercase letter / ✓ One number
  Unchecked: bullet grey. Checked: green checkmark + text #374151.

CTA: "Update Password" full-width amber button.

EXPIRED TOKEN STATE: Red alert box with AlertCircle icon + "This link has expired."
  + "Request a new link" amber button.
```

---

## 20. Booking Page

```
Design the room booking page for StayNG (/book/:roomId).

BREADCRUMB (white bg, 16 px padding):
  "Hotels > The Eko Hotel > Superior Room > Booking"
  Inter 500 13 px #9CA3AF, chevron-right separators.

LAYOUT: 2 columns on desktop (60% form left / 40% summary right).

LEFT COLUMN — BOOKING FORM:
  Section header: "Complete your booking" Plus Jakarta Sans 700 28 px #0F2444.

  BLOCK 1 — "Your trip" (white card, 20 px padding, 12 px radius):
    Check-in / Check-out date pickers side by side (calendar dropdown on click).
    Guests stepper: minus button / count / plus button.
    "Total: 3 nights" Inter 600 14 px #0F2444 below dates.

  BLOCK 2 — "Guest details" (white card):
    Pre-filled from user profile (read-only display with edit pencil icon):
      Full name / Email address / Phone number.
    "Update profile to change" inter 400 13 px #9CA3AF link.

  BLOCK 3 — "Special requests" (white card):
    Textarea: "Any requests for the hotel?" 100 px tall, same input style.
    "Requests are not guaranteed but hotels will try to accommodate."
    Inter 400 13 px #9CA3AF.

  BLOCK 4 — "Payment" (white card):
    Credit card icon row + accepted cards (Visa / Mastercard / Verve).
    Card number field: CreditCard icon inside, monospaced placeholder.
    Expiry + CVV side by side.
    "Your payment is secured with 256-bit SSL." ShieldCheck green icon.

RIGHT COLUMN — BOOKING SUMMARY (sticky):
  White card, 20 px radius, Elevated shadow.

  Hotel photo (top, 160 px, rounded-top-12).
  Hotel name Plus Jakarta Sans 700 18 px #0F2444.
  MapPin icon + address Inter 500 14 px #6B7280.
  Room name chip: Inter 600 13 px bg #F7F6F3.

  Divider. Price breakdown:
    ₦28,000 × 3 nights           ₦84,000
    Taxes & fees (9%)             ₦7,560
    Divider.
    Total                         ₦91,560

  "Confirm and Pay" full-width 52 px bg #F59E0B button.
  "You won't be charged until confirmed." Inter 400 12 px #9CA3AF centred.
  Trust strip: Lock icon + "Secure payment" / Calendar icon + "Free cancellation" badges.

MOBILE: Columns stack. Summary collapses to a "Show price summary" accordion at top.
  Pay button fixed at bottom of screen.
```

---

## 21. Booking Confirmation & QR Pass

```
Design the booking confirmation page for StayNG (/booking/:id/confirmation).

BACKGROUND: Soft gradient bg #EFF6FF to #F7F6F3, full page.

TOP NAV (minimal): Logo only + "← My Bookings" text link. No main navigation.

SUCCESS BANNER (full-width, bg #ECFDF5, border-bottom 1 px #A7F3D0, 20 px padding):
  CheckCircle icon 32 px #10B981 left.
  "Booking Confirmed!" Plus Jakarta Sans 700 22 px #065F46 inline.
  Subtext: "Show your QR code at the hotel front desk — no forms to fill in."
    Inter 400 14 px #047857.

MAIN CONFIRMATION CARD (white, 20 px radius, Elevated shadow, max-width 560 px, centred):

  CARD HEADER (bg: deep navy gradient, 24 px padding, rounded-top-20):
    Hotel name: Plus Jakarta Sans 700 24 px white.
    Address: MapPin icon + address Inter 500 14 px rgba(255,255,255,0.70).
    Status badge: "Confirmed" chip — bg rgba(255,255,255,0.15) text white
      + green dot.

  QR CODE SECTION (bg white, 28 px padding, centred):
    QR code: 180×180 px, error level H, black on white, 12 px white padding inside.
      Thin 1 px #E5E7EB border, 8 px radius.
    Below QR: "Booking Number" Inter 500 12 px uppercase #9CA3AF.
    Code display: "STN-8A4F..." JetBrains Mono 600 18 px #0F2444 letter-spacing 0.06 em.
    Full UUID below in Mono 400 12 px #9CA3AF.
    Dashed horizontal separator (2 px dashed #E5E7EB).

  DATES GRID (2 columns, 16 px gap, 20 px padding):
    Check-in card (bg #F7F6F3, 12 px radius):
      Calendar icon 20 px #0F2444. "CHECK-IN" Inter 600 11 px uppercase #9CA3AF.
      Date: Plus Jakarta Sans 700 18 px #0F2444. "From 2:00 PM" 13 px #6B7280.
    Check-out card (same style):
      "By 12:00 PM" below date.

  STAY SUMMARY BAR (bg #EFF6FF, 16 px padding, border-top 1 px bottom 1 px #DBEAFE):
    Left: Room name Inter 600 14 px #0F2444.
    Centre: "3 nights" Inter 700 16 px #0F2444.
    Right: Users icon + "2 guests" Inter 500 14 px #374151.

  GUEST INFO (20 px padding, white):
    Guest avatar 40 px circle (navy bg, white initials) + full name Inter 600 15 px #0F2444.
    Email: Inter 400 14 px #6B7280. Border-bottom divider.

  INSTRUCTIONS BOX (bg #FFF8E7, border-left 3 px #F59E0B, 16 px padding, 10 px radius):
    "At the front desk" Plus Jakarta Sans 700 15 px #92400E.
    Numbered list:
      1. Show QR code or state your booking number
      2. Present valid government-issued ID
      3. Collect your key card from reception
    Inter 400 14 px #78350F.

  CARD FOOTER (white, 20 px padding, 2-button row):
    "Print / Save PDF" button: outline style + Download icon 16 px. 48 px tall.
    "All Bookings" button: bg #0F2444 text white. 48 px tall. ArrowRight icon.

MOBILE: Card is full-width with 16 px margin. QR code 160 px. Buttons stack.
```

---

## 22. My Reservations Page

```
Design the My Reservations page (/my-reservations) for authenticated StayNG guests.

PAGE HEADER (white bg, 24 px padding, border-bottom 1 px #E5E7EB):
  "My Reservations" Plus Jakarta Sans 700 28 px #0F2444.
  "Your complete booking history." Inter 400 15 px #6B7280.

STATUS FILTER TABS (horizontal, same tab bar as Hotels Listing):
  All · Upcoming · Active Stays · Completed · Cancelled
  Tab style same as Prompt 9.

RESERVATION CARD LIST (stacked, 16 px gap, max-width 800 px):

  RESERVATION CARD (white, 12 px radius, Card shadow, 20 px padding):
    Left side (120 px wide): Hotel thumbnail, 12 px radius, object-cover.
    Right side (remaining width):
      Status badge (see Design Token Sheet — pill chip by status).
      Hotel name Plus Jakarta Sans 600 18 px #0F2444.
      Room name: chip bg #F7F6F3 Inter 500 13 px.
      Dates row: Calendar icon "14 Jul — 16 Jul · 3 nights" Inter 500 14 px #374151.
      Guests: Users icon + "2 guests" Inter 400 14 px #6B7280.
    Bottom row (inside card, border-top 1 px #F7F6F3, 12 px top padding mt):
      Left: "₦91,560" Plus Jakarta Sans 700 18 px #0F2444 (total paid).
      Right buttons (flex row 8 px gap):
        "View QR Pass" → ghost/outline 36 px button (if confirmed/checked-in)
        "Cancel Booking" → red ghost 36 px button (if pending/confirmed)
        "Leave a Review" → amber ghost 36 px button (if checked-out)
        "View Details" → primary ghost 36 px button (always).

EMPTY STATE:
  CalendarX icon 80 px #D1D5DB centred.
  "No reservations yet" Plus Jakarta Sans 700 22 px.
  "Start planning your next Nigerian getaway." Inter 400 15 px #6B7280.
  "Browse Hotels" amber button.

MOBILE: Card image hidden (mobile). Buttons wrap to two rows.
```

---

## 23. User Profile & Settings

```
Design the user profile and settings page (/profile, /settings) for StayNG guests.

LAYOUT: 2-column on desktop (240 px sidebar left / content right).

SIDEBAR:
  User avatar (80×80, navy circle, white initials 32 px OR actual photo).
  User full name Plus Jakarta Sans 700 20 px #0F2444.
  User email Inter 400 14 px #6B7280.
  Role badge: "Traveller" (or "Hotel Owner" / "Admin") — pill #F7F6F3.

  Navigation list (vertical, 8 px gap):
    Person icon + "Profile"
    Shield icon + "Security"
    Bell icon + "Notifications"
    CreditCard icon + "Payment Methods"
    LogOut icon + "Sign Out" (red text #EF4444)
  Active: bg #F7F6F3 border-left 3 px #0F2444 Inter 600 14 px #0F2444.
  Inactive: Inter 500 14 px #6B7280, icon #9CA3AF.

CONTENT AREA — PROFILE TAB:
  Section title: "Personal Information" Plus Jakarta Sans 700 22 px #0F2444.
  "Edit Profile" pencil icon button top-right.

  2-column form grid:
    First Name / Last Name (editable inputs)
    Email (read-only — shows verified green badge)
    Phone Number (editable, with +234 prefix)
    Gender select (radio chips: Male / Female / Prefer not to say)

  Save button (amber, right-aligned, 44 px tall) visible only in edit mode.

CONTENT AREA — SECURITY TAB:
  Change Password block (white card):
    Current Password / New Password / Confirm Password fields.
    "Update Password" navy button.
  
  2FA section: Toggle switch (amber when on).
  "Trusted devices" list.

MOBILE: Sidebar becomes a horizontal scrollable chip row of navigation items.
Content area full width below.
```

---

## 24. Admin Dashboard

```
Design the admin/org_admin dashboard for StayNG (/admin).

LAYOUT: Full app frame — left sidebar navigation + right content area.
No MainLayout header/footer. Dark sidebar.

LEFT SIDEBAR (240 px wide, bg #0F2444, full height, fixed):
  Top section:
    StayNG logo + wordmark in white. 24 px padding.
    Admin name + role chip below ("System Admin" or "Hotel Owner").
    Thin amber divider line.

  Navigation groups (vertical list, 8 px gap):
    Group "OVERVIEW":
      LayoutDashboard icon + "Dashboard" — active state: bg rgba(245,158,11,.15)
        text #F59E0B, border-left 3 px #F59E0B.
      Inactive: text rgba(255,255,255,0.60), icon same colour.
    Group "MANAGEMENT":
      Building2 "Hotels"
      BedDouble "Rooms"
      CalendarCheck "Reservations"
      Users "Users"
    Group "OPERATIONS":
      Scan "Front Desk"
      Star "Reviews"
    Group "SYSTEM" (admin only):
      Building "Companies"
      ScrollText "Audit Logs"
  
  Sidebar footer:
    Bell notification icon (with amber badge count).
    Settings cog.
    "Sign Out" (LogOut icon + text rgba(255,255,255,0.60)).

MAIN CONTENT AREA (bg #F7F6F3, flex-1):

  TOP BAR (white, 64 px, border-bottom):
    "Dashboard" Plus Jakarta Sans 700 24 px #0F2444.
    Right: date + time / Bell icon / user chip.

  KPI CARDS ROW (4 cards, 24 px gap):
    Each card: white, 12 px radius, Card shadow, 20 px padding.
      Large metric: Plus Jakarta Sans 800 36 px #0F2444.
      Label: Inter 600 14 px #6B7280 uppercase.
      Trend chip: "↑ 12% this month" bg #ECFDF5 text #065F46 (or red for negative).
      Icon right: 48×48 circle gradient bg, white icon 24 px.
    Cards: Total Hotels (Building2 / indigo) · Total Reservations (CalendarCheck / teal)
      · Active Guests (Users / amber) · Revenue (Banknote / emerald)

  CHARTS ROW (2 columns, 16 px gap):
    Left (60%): "Reservations Overview" — line chart, 7-day trend.
      Subtle navy area fill under line. Axis labels Inter 400 12 px #9CA3AF.
    Right (40%): "Bookings by Status" — donut chart with legend.
      Colours: confirmed #0F2444 / pending #F59E0B / checked-in #3B82F6 / cancelled #EF4444.

  RECENT RESERVATIONS TABLE (white card, 20 px padding):
    Table header: Inter 600 13 px uppercase #9CA3AF, border-bottom 1 px #E5E7EB.
    Row: Guest name + avatar chip / Hotel name / Dates / Status badge / Amount / Actions.
    Row hover: bg #F7F6F3. Actions: View (eye icon) / Check-in (log-in icon).
    "View all reservations →" link below table.

MOBILE: Sidebar collapses to bottom tab bar (5 icons). Content area full screen.
```

---

## 25. Front-Desk Console — Search State

```
Design the front-desk search screen for StayNG (/admin/front-desk).
This is a focused, distraction-free operations screen — no sidebar, no footer.

FULL SCREEN LAYOUT:
  Background: deep navy #0F2444 full-screen (Apple-style immersive focus mode).

TOP BAR (no sidebar — full-width, 64 px, border-bottom rgba(255,255,255,0.08)):
  Left: Back arrow icon (white) + "Front Desk" Plus Jakarta Sans 700 20 px white.
  Right: Current date/time in Inter 400 14 px rgba(255,255,255,0.60).

CENTRE CONTENT (vertically centred, max-width 560 px, horizontally centred):
  Icon: Scan icon 64 px in a 96×96 circle, bg rgba(255,255,255,0.08).
  Title: "Find Reservation" Plus Jakarta Sans 700 32 px white. mt 24 px.
  Subtitle: "Scan the guest's QR code or enter their booking number."
    Inter 400 16 px rgba(255,255,255,0.60).

  SEARCH INPUT (mt 32 px):
    bg rgba(255,255,255,0.10), border 1 px rgba(255,255,255,0.20), 16 px radius, 56 px tall.
    Left: Hash icon 20 px rgba(255,255,255,0.50).
    Placeholder: "STN-XXXXXXXX or full booking ID" Inter 500 16 px rgba(255,255,255,0.40).
    Font: JetBrains Mono when text is entered (for monospace booking IDs).
    Right: QrCode icon button (scan), 36×36 circle, bg rgba(255,255,255,0.12).
    Focus: border rgba(245,158,11,0.8) 2 px, outer shadow rgba(245,158,11,0.2).

  "Look Up Booking" button (full-width, mt 16 px, 56 px tall):
    bg #F59E0B, text #0F2444 Plus Jakarta Sans 700 16 px.
    ChevronRight icon right side.
    Hover: scale 1.01, shadow glow rgba(245,158,11,0.40).

  Tip text below: Inter 400 13 px rgba(255,255,255,0.40) centred.
    "The booking ID is in the guest's confirmation email."

NOT FOUND STATE (replaces tip text, animated):
  Red alert box: bg rgba(239,68,68,0.15) border 1 px rgba(239,68,68,0.30) 10 px radius.
  AlertCircle icon 16 px #EF4444 + "No booking found. Check the ID and try again."
  Inter 500 14 px #FCA5A5.

MOBILE: Full-screen, same layout. Keyboard pushes content up gracefully.
```

---

## 26. Front-Desk Console — Reservation Result Card

```
Design the reservation result state of the StayNG Front-Desk Console.
Shown after a successful booking lookup — screen bg still deep navy.

RESULT CARD (max-width 640 px, centred, white bg, 20 px radius, Elevated shadow):

  CARD STATUS BAR (top, 12 px tall):
    Full-width colour stripe matching status:
      confirmed → #0F2444 navy / checked-in → #10B981 emerald / checked-out → #6B7280.
    Status label: Inter 700 12 px uppercase white inside bar, left-aligned.
    Booking ID: Inter 600 12 px white right-aligned (monospace).

  GUEST INFO SECTION (24 px padding, border-bottom 1 px #E5E7EB):
    80×80 circle avatar (bg #0F2444, white initials Plus Jakarta Sans 700 28 px).
    Guest full name: Plus Jakarta Sans 700 24 px #0F2444. Right of avatar.
    Email: Mail icon 14 px + address Inter 400 14 px #6B7280.
    Phone: Phone icon 14 px + number Inter 400 14 px #6B7280.

  HOTEL + ROOM GRID (2 columns, bg #F7F6F3, 16 px padding, 0 border-radius sides):
    Left card (bg white 12 px radius, 12 px padding):
      Building2 icon 18 px #0F2444. "HOTEL" Inter 600 11 px uppercase #9CA3AF.
      Hotel name Inter 600 15 px #0F2444.
      City Inter 400 13 px #6B7280.
    Right card:
      BedDouble icon. "ROOM". Room category + room number.

  DATES GRID (3 columns, bg white, 16 px padding):
    Check-in card: Calendar icon + "CHECK-IN" label + formatted date (large 18 px navy).
    Check-out card: same.
    Guests card: Users icon + "GUESTS" + count (large 18 px).
    Each cell: bg #EFF6FF, 8 px radius.

  ACTUAL TIMESTAMPS (shown after check-in / check-out, bg #ECFDF5, 12 px padding 10 px radius):
    Clock icon #10B981 + "Checked in at 14:32 on Mon 14 Jul 2026" Inter 600 14 px #065F46.
    Second row when checked-out: "Checked out at 11:45 on Wed 16 Jul 2026".

  ACTION BUTTON (24 px padding, border-top 1 px #E5E7EB):
    FOR confirmed/pending STATUS:
      Full-width 56 px, bg #10B981, text white Plus Jakarta Sans 700 16 px.
      LogIn icon left. "Check In — Issue Key Card".
      Below: Inter 400 13 px #6B7280 "Guest has not yet been checked in."

    FOR checked-in STATUS:
      Full-width 56 px, bg #0F2444, text white.
      LogOut icon left. "Check Out Guest".
      Below: "Guest checked in at [time]" #6B7280.

    FOR checked-out STATUS:
      Full-width bg #F7F6F3, text #9CA3AF Inter 600 (disabled appearance).
      "Reservation complete — guest has checked out." below.

  "Search another booking" ghost text link centred below card.

ANIMATION: Card slides up from bottom (translate-y 24 px → 0, opacity 0 → 1, 300 ms spring)
when result loads.
MOBILE: Card is full-width. Dates grid wraps to 1 column. Avatar shrinks to 60 px.
```

---

## 27. Admin Data Table (Shared Pattern — Hotels / Rooms / Reservations / Users)

```
Design the admin data management page pattern used for Hotels, Rooms, Reservations,
and Users management pages. These four pages share identical layout and table UX.

LAYOUT: Same sidebar (from Prompt 24) + content area.

PAGE HEADER (white card, 20 px padding, mb 20 px, Card shadow, 12 px radius):
  Left: Page title "Manage Hotels" Plus Jakarta Sans 700 26 px #0F2444.
    Subtitle: "42 total hotels across all companies" Inter 400 14 px #6B7280.
  Right: 
    Search input (36 px tall, bg #F7F6F3, border #E5E7EB, Search icon left, 8 px radius)
      Placeholder "Search hotels..."
    "Add Hotel" amber button (Plus icon + text, 40 px, 8 px radius).

FILTER CHIP ROW (below header, flex row 8 px gap):
  Status filter pills: All · Active · Inactive (toggle chips same style as auth).
  Sort dropdown: "Sort by: Newest ▾"

DATA TABLE (white card, 16 px radius, Card shadow):
  TABLE HEADER ROW (bg #F7F6F3, border-bottom 1 px #E5E7EB, 12 px padding):
    Checkbox (select all) · Column labels Inter 600 13 px uppercase #9CA3AF 0.06 em.
    Sortable columns show ChevronUp/Down icon on hover.

  TABLE ROW (48 px tall, border-bottom 1 px #F3F4F4, hover bg #F7F6F3):
    Checkbox · Thumbnail/Avatar (32 px) · Primary info (name) · 
    Secondary info (city/email) · Status badge chip · Meta (date/price) · 
    Actions (3-dot menu or icon buttons: Eye / Pencil / Trash).

    Row selection: checked → row bg #EFF6FF.
    Trash icon: #EF4444 on hover. Confirm delete → amber modal with warning.

  TABLE FOOTER (24 px padding):
    Left: "Showing 1–20 of 42" Inter 400 14 px #6B7280.
    Right: Pagination — prev / [1] [2] [3] ... [5] / next.
      Current page: bg #0F2444 text white 32×32 circle.
      Other pages: ghost 32×32 circle.

EMPTY TABLE:
  PackageOpen icon 64 px #D1D5DB centred in table body.
  "No results found." Plus Jakarta Sans 700 18 px.
  "Try adjusting your search or filters." Inter 400 14 px #6B7280.

BULK ACTIONS (appears above table when ≥1 row selected):
  Floating bar: bg #0F2444, text white Inter 600 14 px, 12 px radius, shadow.
  "3 selected" + "Delete selected" danger button + Dismiss ✕.

MOBILE: Table becomes card list. Each record is a full-width white card (same info,
stacked vertically). Actions become "⋮" menu bottom-right of each card.
```

---

## 28. Admin Create / Edit Form Modal

```
Design the create and edit form modal overlay for StayNG admin pages.
Used when creating or editing Hotels, Rooms, Facilities, and Companies.

MODAL OVERLAY:
  Full-screen dark overlay: rgba(15,36,68,0.60), backdrop-blur 4 px.
  Modal slides up from bottom on mobile / scales in from centre on desktop.

MODAL CONTAINER:
  White, 20 px radius, Elevated shadow, max-width 640 px, max-height 90 vh.
  Overflow-y auto (scrollable form).

MODAL HEADER (sticky top, white, border-bottom 1 px #E5E7EB, 20 px padding):
  Left: "Add New Hotel" Plus Jakarta Sans 700 22 px #0F2444.
  Right: ✕ close icon button (32×32, bg #F7F6F3, 8 px radius).
  Breadcrumb below header: "Hotels > Add new" Inter 400 13 px #9CA3AF.

MODAL BODY (24 px padding, 24 px gap between form sections):

  SECTION HEADER (used to group related fields):
    Thin amber left-border 3 px + label Inter 700 14 px uppercase #374151.
    E.g. "Basic Information" / "Location" / "Contact Details"

  FORM FIELDS (all using same input style from Design Token Sheet):
    Hotel Name — full width.
    Hotel Type — select dropdown with 5 options.
    Description — textarea 96 px tall.
    Address — full width.
    City + State — 2 columns.
    Contact Email + Contact Phone — 2 columns.
    Number of Rooms — number input with stepper.
    Terms & Conditions — textarea 80 px tall.

  IMAGE UPLOAD AREA (for hotels/rooms):
    Dashed border 2 px #D1D5DB, 12 px radius, 120 px tall, bg #F7F6F3.
    Upload icon 32 px #9CA3AF centred.
    "Drag & drop photos or click to browse" Inter 400 14 px #6B7280.
    "JPEG, PNG, WebP · Max 5 MB" Inter 400 12 px #9CA3AF below.
    Accepted file chips appear below dropzone after upload.

MODAL FOOTER (sticky bottom, white, border-top 1 px #E5E7EB, 20 px padding):
  2-button row flush right:
    "Cancel" ghost button 44 px (border #E5E7EB).
    "Save Hotel" amber primary button 44 px (or "Update Hotel" for edit mode).
    Loading state on Save: spinner + "Saving…"
    
  Left side: "* Required fields" Inter 400 12 px #9CA3AF.

VALIDATION: Inline field errors (slide-down 200 ms) matching Token Sheet error style.
Scrolls automatically to first error on submit.

MOBILE: Modal becomes full-screen sheet. Close button top-right. Footer buttons
stack to full-width.
```

---

## Prompt Usage Guide

| # | Screen / Section | Copy This Prompt When You Want To Design… |
|---|------------------|--------------------------------------------|
| 0 | Design Tokens | The shared colour, type, and component foundations |
| 1 | Navigation Bar | The top nav (logged-out and logged-in states) |
| 2 | Hero + Search | The home page hero and 4-field search widget |
| 3 | Stats Strip | The 4-metric counter row |
| 4 | Top Destinations | The 6-city photo grid |
| 5 | Top Deals Cards | The deal hotel card component |
| 6 | Why StayNG | The 3-feature trust section |
| 7 | Newsletter CTA | The email sign-up banner |
| 8 | Footer | The full 4-column footer |
| 9 | Listing Header + Tabs | The page header and category tab bar |
| 10 | Filter Sidebar | The 4-filter sidebar (desktop and mobile sheet) |
| 11 | Hotel Card | The individual hotel grid card |
| 12 | Hotel Detail Gallery | The photo gallery + identity header |
| 13 | Hotel Detail Content | Info, amenities, rooms, reviews (left column) |
| 14 | Booking Widget | The sticky price/booking sidebar (right column) |
| 15 | Search Results | The search results page |
| 16 | Auth Layout | The shared split-panel auth wrapper |
| 17 | Login | The login form |
| 18 | Register | The registration form with phone + strength bar |
| 19 | Password Recovery | Forgot password + reset password screens |
| 20 | Booking Page | The 4-step booking and payment form |
| 21 | Booking Confirmation | The QR pass confirmation card |
| 22 | My Reservations | The authenticated booking history list |
| 23 | Profile & Settings | User profile sidebar + settings content |
| 24 | Admin Dashboard | The KPI + charts admin overview |
| 25 | Front Desk — Search | The booking ID search state |
| 26 | Front Desk — Result | The guest card + check-in/out actions |
| 27 | Admin Data Table | Shared table pattern for all management pages |
| 28 | Create/Edit Modal | The form modal overlay |
