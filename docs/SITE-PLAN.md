# Amrapali Makeover — Website Section Plan

## Objective
A luxury, mobile-first makeup artist website for genuine portfolio presentation and WhatsApp enquiries. Languages: English, Hindi, Marathi. Pricing: enquiry-based. Business base: Bhiwandi, Maharashtra; travel enquiries subject to availability.

## Global design system
- Luxury Indian bridal/editorial beauty; burgundy, ivory, blush, restrained champagne gold.
- Display serif + readable sans-serif with Devanagari support.
- Generous whitespace, editorial image compositions, consistent grid and spacing.
- Scroll reveals and staggered entrances used selectively.
- Native smooth anchor scrolling; no scroll hijacking or forced scroll snap.
- Polished CTA hover/active/focus states.
- Optional makeup-brush cursor on fine-pointer desktop only; never replace native pointer; disable on touch/reduced motion.
- Subtle click feedback; no confetti, sound or blocking transitions.
- Persistent WhatsApp access without covering content.
- Accessibility, reduced-motion and mobile-first performance are mandatory.

## Required sections

### 1. Announcement strip (optional)
Short useful message about makeup services/base location. No fake urgency, discounts or auto-scrolling ticker. Remove if cluttered.

### 2. Header/navigation
Brand wordmark; Services, About, Portfolio, Reviews, Contact; EN/HI/MR switcher; WhatsApp CTA. Sticky/compact on scroll only if useful. Accessible mobile menu with focus handling and Escape-to-close.

### 3. Hero
Editorial headline, concise description, service scope, Bhiwandi base/travel qualifier, primary WhatsApp CTA, secondary portfolio CTA, strong real hero image/video. Subtle image/text reveal. Main CTA visible on common mobile viewports.

### 4. Verified trust band
Only verified facts: four services, Bhiwandi base, on-location service, other facts if confirmed. No fabricated client counts, awards or years.

### 5. About artist
Approved artist portrait, verified introduction, approach/philosophy, verified experience/training only, enquiry CTA. No invented credentials.

### 6. Services
Bridal, Haldi, Engagement and Party Makeup. Each has short verified description, optional real image and service-specific CTA that preselects enquiry context. No invented packages/prices or unconfirmed add-ons.

### 7. Booking process
3–4 steps: share occasion/date/location; check availability; discuss requirements/quotation; confirm under agreed terms. Sending a WhatsApp message does not itself confirm booking.

### 8. Portfolio gallery
Filters: All, Bridal, Haldi, Engagement, Party. Real client photos/videos with permission. Responsive gallery, accessible lightbox, keyboard/Escape/focus support, video posters/no autoplay sound, lazy loading and explicit media dimensions. Use a content manifest. Clearly label placeholders in development.

### 9. Video/transformations (optional)
Only when genuine clips are supplied. Optimised short video, poster, no autoplay sound, captions when needed, avoid heavy mobile background video.

### 10. Google reviews
Genuine reviews from authorised Google source or approved embed only. If no data integration, show a “Read our Google reviews” link. Never fabricate reviews, rating, names or counts.

### 11. Service area
Based in Bhiwandi, Thane, Maharashtra. Customer-location bookings considered across Maharashtra subject to date/location/availability. No home address or home map pin. CTA asks customer to share event location.

### 12. FAQ
Services, travel, availability, quotation, booking confirmation, details needed for enquiry. Answers must be owner-verified; ask rather than guess.

### 13. Contact/enquiry
Phone/WhatsApp, Instagram, verified Facebook only if supplied, base location wording. Form: name, phone, occasion, date, city/area, optional ready-by time and notes. Submit opens localised, URL-encoded WhatsApp message; clear note that it is not booking confirmation; direct WhatsApp fallback; no backend storage in v1.

### 14. Footer
Brand, descriptor, navigation, services, WhatsApp/phone, Instagram, verified Facebook if available, base location, copyright year, privacy link only if approved. Back-to-top control and clear focus/hover states.

## Reusable interaction components
- Language switcher
- WhatsApp CTA with optional service context
- Scroll reveal with reduced-motion fallback
- Primary/secondary/text buttons
- Gallery filter and accessible lightbox
- FAQ accordion
- Enquiry validation and WhatsApp message builder
- Mobile menu
- Back-to-top
- Optional desktop-only brush cursor

## Development gates
| Stage | Deliverable | Approval |
|---|---|---|
| 0 | Repository discovery and architecture decision | Required |
| 1 | Design tokens, typography, buttons, cards, motion demo | Required |
| 2 | Header, mobile nav, language selector, footer, WhatsApp float | Required |
| 3 | Hero | Required |
| 4 | About | Required |
| 5 | Services | Required |
| 6 | Booking process and service area | Required |
| 7 | Gallery and video viewer | Required |
| 8 | Google reviews and FAQ | Required |
| 9 | Contact form and WhatsApp | Required |
| 10 | SEO, accessibility, performance and responsive QA | Required |
| 11 | Cloudflare preview and production launch | Required |

## Acceptance checklist per section
- Matches approved design system.
- Mobile and desktop reviewed.
- No horizontal overflow.
- Keyboard, touch and focus states work.
- Reduced-motion respected.
- EN/HI/MR copy fits and works.
- CTA destinations and form context correct.
- No invented business facts, prices, portfolio or reviews.
- Lint, typecheck and production build pass.
- No console errors in changed scope.
