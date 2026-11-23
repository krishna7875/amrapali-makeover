# Amrapali Makeover — Antigravity Project Instructions

This is the persistent project rulebook. Read it and `docs/SITE-PLAN.md` before every implementation task.

## 1. Project goal
Build a premium, conversion-focused, mobile-first website for Amrapali Makeover, an individual makeup artist based in Bhiwandi, Thane, Maharashtra. The site presents genuine work, builds trust, and converts visitors into WhatsApp enquiries. Languages: English, Hindi and Marathi. Pricing: enquiry-based.

This is a marketing/enquiry website, not a booking platform. Do not add accounts, payments, a database, CMS or admin dashboard in v1 unless explicitly approved.

## 2. Verified business facts — never invent
- Brand: Amrapali Makeover
- Business: individual makeup artist
- Base: Bhiwandi, Thane, Maharashtra, India
- No customer-facing studio/storefront. Customers do not visit the artist's home.
- Services are delivered at customer locations, subject to availability.
- Travel enquiries may be considered across Maharashtra; never promise availability everywhere.
- Services: Bridal Makeup, Haldi Makeup, Engagement Makeup, Party Makeup.
- Phone/WhatsApp: +91 83089 44456
- WhatsApp: https://wa.me/918308944456
- Instagram: https://www.instagram.com/amrapali_makeover_139/
- Instagram handle: @amrapali_makeover_139
- Facebook URL: not supplied; keep hidden until verified.
- Domain: not selected.
- Pricing: enquiry-based; never invent prices.
- Experience, qualifications, product brands, service inclusions and client counts: use only after owner verification.
- Google rating/reviews: use only a verified authorised source or approved embed. Never fabricate reviews, names, dates, ratings or counts.

Never expose a private residential address or add a map pin to the artist's home.

## 3. Required workflow
Work in small phases. Do not build the whole site from one prompt.

For every phase:
1. Read this file and relevant project docs.
2. Inspect the current repository before editing.
3. State scope, proposed files, dependencies and risks.
4. Ask concise questions when missing facts materially affect the work.
5. Wait for approval before major architecture changes or advancing phases.
6. Implement only the approved scope with small, reviewable diffs.
7. Run relevant lint, typecheck, build and browser checks.
8. Inspect desktop and mobile in a real browser.
9. Report files changed, commands run, test results, known issues and next approval needed.
10. Never claim tests passed unless they were run. Never silently skip failures.

### Phase gates
0. Discovery and architecture; no full build.
1. Design system and style guide.
2. Shared shell: header, navigation, language selector, footer, floating WhatsApp.
3. Hero.
4. About.
5. Services.
6. Booking process and service area.
7. Portfolio gallery and video viewer.
8. Google reviews and FAQ.
9. Contact form and WhatsApp integration.
10. SEO, accessibility, performance and responsive QA.
11. Cloudflare preview deployment and production verification.

Each phase requires explicit owner approval before the next phase.

## 4. Technical architecture
Preferred starting stack:
- Astro, static output
- React for interactive components/islands only
- TypeScript with strict settings
- Tailwind CSS plus central CSS design tokens
- Motion for React for component and scroll transitions
- GSAP only if a specific effect cannot be implemented cleanly with CSS/Motion
- Lucide icons
- Zod or equivalent validation for config data where useful
- Cloudflare Pages for static deployment

Do not choose Next.js by default. This site is primarily static content with limited interactions. Do not add a server runtime or database without a concrete requirement. Before adding dependencies, verify current compatibility and explain why they are needed. Keep dependencies lean.

Suggested structure (adapt to framework conventions):
```text
/
├── AGENTS.md
├── README.md
├── docs/
│   ├── SITE-PLAN.md
│   ├── DESIGN-SYSTEM.md
│   ├── CONTENT-ASSETS.md
│   └── IMPLEMENTATION-LOG.md
├── public/
│   ├── images/{hero,artist,portfolio}/
│   ├── videos/
│   └── icons/
└── src/
    ├── components/{layout,sections,ui,effects}/
    ├── config/{business,services,social,navigation}.json
    ├── content/{en,hi,mr}/
    ├── layouts/
    ├── pages/
    ├── styles/
    ├── utils/
    └── types/
```

## 5. Configuration and content
Create one source of truth for public business information. Keep editable data in JSON and define TypeScript types/schema validation.

Config should cover brand name/descriptor, display and international phone, WhatsApp number and language-specific messages, Instagram, optional Facebook, base location wording, service area wording, services, enquiry-based pricing mode, SEO metadata, social preview image and optional section feature flags.

Do not duplicate phone numbers, social URLs or brand name across components. Components read from config. Never put secrets/API keys in public JSON or client code.

Keep EN/HI/MR copy structured and complete: visible UI strings, form labels, validation, CTA, navigation and accessibility labels. Ensure Devanagari font support. Language switching must work across the whole site.

## 6. Visual identity
Art direction: luxury Indian bridal/editorial beauty. Refined, tactile, premium and confident. Not a generic salon template. Avoid loud gradients, excessive gold, clutter, generic template cards and overused glassmorphism.

Starting palette:
- Burgundy `#4B1728`
- Dark plum `#2A1420`
- Warm ivory `#FBF8F4`
- Soft blush `#F2E5E2`
- Muted rose `#C58F91`
- Champagne gold `#B99561`
- Ink `#24191B`
- Muted text `#74686A`

Gold is an accent, not a dominant background. Maintain WCAG AA contrast. Use an elegant display serif plus legible sans-serif. Use a font with proper Devanagari glyphs for Hindi/Marathi. Limit weights and font files. Use generous whitespace, strong editorial hierarchy, carefully cropped genuine photography, consistent grids and spacing. Mobile is a first-class layout.

## 7. Motion and interactions
Motion should feel graceful and restrained. It must never obstruct content or conversion.

- Native smooth anchor scrolling; no scroll hijacking or forced snap.
- Subtle opacity/short vertical reveal for selected section headings, images and cards.
- Light stagger for related cards only.
- Restrained parallax only if smooth and useful; disable for reduced motion.
- Respect `prefers-reduced-motion`.
- No long pinned sequences, excessive parallax, scroll hijacking or animation on every paragraph.
- CTA buttons need default, hover, focus-visible, active and disabled states. Use subtle lift/colour/underline/shine; no aggressive bounce.
- Essential content must not depend on hover.
- Optional makeup-brush cursor: fine-pointer desktop only; tiny and subtle, never hide native pointer, never obstruct text/controls, `pointer-events:none`, disabled on touch, keyboard/reduced-motion. Do not harm text selection or precision clicking.
- Click feedback can be a subtle ripple/soft sparkle/pressed state. No confetti, sound or blocking overlay. Never delay navigation/WhatsApp.
- No full-screen loading animation for this static site. Reserve image/video dimensions to prevent layout shift.

## 8. Header and hero
Header: brand, Services/About/Portfolio/Reviews/Contact links, language switcher and WhatsApp CTA. Sticky/compact-on-scroll only if it improves usability. Mobile menu needs accessible labels, focus management, Escape-to-close and touch support.

Hero must quickly communicate business, services, Bhiwandi base and travel qualifier. Include primary WhatsApp CTA and secondary portfolio CTA. Use a real supplied hero photo/video when available. Until then use clearly labelled placeholders. Never depict AI/stock faces as real clients or the artist. Headline and CTA must be visible immediately on common mobile viewports.

## 9. About and services
About content must be verified. Do not invent biography, experience, certificates or claims such as “best”, “No. 1” or “certified expert”. Use approved artist portrait only.

List only the four confirmed services. Do not imply hairstyling, draping, HD, airbrush, trials, product brands or add-ons unless confirmed. Pricing remains enquiry-based. Each service CTA should pass selected service into the enquiry flow.

## 10. Portfolio and video
Portfolio is a core trust feature:
- Categories: Bridal, Haldi, Engagement, Party, plus All.
- Real customer photos/videos only, with permission.
- Use a content manifest (asset path, category, alt text, optional approved caption, media type).
- Accessible filters and lightbox/modal; Escape closes, focus is managed/restored, keyboard works.
- Video uses poster thumbnails, no autoplay sound.
- Lazy-load below-fold media, use AVIF/WebP where supported, responsive sizes and explicit dimensions.
- Alt text describes visible content without inventing identity/story.
- Clearly mark temporary assets in development; replace before launch.
- Never fabricate before/after results or client work.

## 11. Google reviews and trust
Use only genuine reviews from an authorised Google source or approved embed. Do not scrape Google Maps or bypass API terms. Do not hardcode invented review content, names, dates, ratings or counts. If no approved integration exists, show a clear “Read our Google reviews” link only. Do not call a rating current unless its source is current.

## 12. Contact, WhatsApp and social
WhatsApp should be accessible from header, hero, service CTAs, contact, footer and a non-obstructive floating action.

Enquiry fields: customer name, phone, occasion, event date, city/area, optional ready-by time and optional notes. Validate required fields and sensible date values. Build a URL-encoded message in the selected language and open the configured wa.me URL. Explain that this is an enquiry and not a confirmed booking. Do not claim form data is stored or sent to a server. Provide direct WhatsApp fallback.

Instagram uses supplied URL. Facebook remains hidden until official URL is supplied and verified. Avoid heavy live Instagram feeds by default; curated portfolio with Instagram link is preferable.

## 13. Service area and FAQ
State that the business is based in Bhiwandi, Maharashtra and considers on-location bookings across Maharashtra subject to date, location and availability. No private home address or home map pin. Mention specific additional cities only after owner approval.

FAQ topics may include services, travel, availability, quotation, booking confirmation and information needed for enquiry. Answers must reflect actual policies; ask the owner when unknown.

## 14. Accessibility, SEO, performance, privacy
- Semantic HTML, logical headings, keyboard support, visible focus, labelled forms, contrast, meaningful alt text, reduced motion.
- Test at 360, 390, 768, 1024 and 1440px; no horizontal overflow.
- Unique title/meta description, canonical once domain exists, Open Graph, sitemap, robots, clean URLs.
- Structured data only with verified facts; do not publish home address.
- Correct language metadata. Use hreflang only if language URL structure supports it.
- Optimise images/video; lazy-load noncritical media; preload only justified critical assets/fonts.
- Avoid unnecessary third-party scripts and trackers.
- No secrets in source. No unnecessary data collection. Do not expose home address.
- Privacy/terms pages only with accurate reviewed content.

## 15. Definition of done
A phase is done only when design is reviewed, mobile/desktop checked, controls work by mouse/keyboard/touch, reduced motion checked, translations checked, CTAs correct, no fake claims/reviews/assets added, no console errors in changed scope, lint/typecheck/build pass, and implementation log is updated.

Before launch: replace placeholders; verify phone, WhatsApp, Instagram, Facebook if supplied, review source, services and location wording; configure domain/Cloudflare; test production URL on real mobile devices.

## 16. Agent behaviour
Act as senior frontend engineer and art director, not autonomous product owner. Ask when facts are missing. Never invent business facts, assets, prices or reviews. Do not advance beyond approved phase. Explain trade-offs before complexity. Prefer maintainability, accessibility and performance over flashy demos. Implement only the requested section and necessary shared dependencies. End every phase with a concise completion report and owner approval checklist.
