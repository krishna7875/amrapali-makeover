# Antigravity Prompt Workflow — Amrapali Makeover

Paste one prompt at a time. Do not proceed until the previous phase is reviewed and approved.

## Prompt 0 — Discovery only
Read `AGENTS.md` and `docs/SITE-PLAN.md` fully. Inspect the repository. Report existing framework/dependencies/scripts, reusable code, recommended Astro + React + TypeScript + Tailwind architecture for Cloudflare Pages, proposed folder structure/config schema, risks, unknown business facts/assets, and phase plan/test commands. Do not build, install packages or modify files until I approve. Explain any reason to deviate from the preferred stack.

## Prompt 1 — Design system
Implement only the design system and a style-guide page: colour tokens, typography including Devanagari, spacing, responsive grid, buttons, links, cards, forms, focus states and motion primitives. Luxury Indian bridal/editorial direction, not generic salon template. Use clearly labelled placeholders. Show desktop and mobile. No full site sections. Run checks and request approval.

## Prompt 2 — Shared shell
Implement only header, accessible mobile navigation, EN/HI/MR selector, footer and floating WhatsApp CTA. Read business data from config. Sticky/compact scroll behaviour only if subtle and usable. Test keyboard, Escape, focus, touch, reduced motion and breakpoints.

## Prompt 3 — Hero
Implement only the hero using approved design system. Communicate brand, services, Bhiwandi base and travel qualifier. Include WhatsApp primary CTA and portfolio secondary CTA. Use labelled temporary imagery until real assets arrive. Never imply stock/AI faces are real work. Headline and CTA visible on common mobile viewports. Test all languages and CTA URL.

## Prompt 4 — About
Implement only About. Use verified facts. If biography, portrait, experience or training are missing, use clearly marked placeholders and ask owner; do not invent. Editorial layout, subtle reveal, enquiry CTA. Test mobile and translations.

## Prompt 5 — Services
Implement only Bridal, Haldi, Engagement and Party Makeup. Content from config. Each CTA passes selected service into enquiry flow. Do not invent prices, packages, hairstyling, draping, HD, airbrush, trials or add-ons. Test responsive behaviour and service context.

## Prompt 6 — Booking process and service area
Implement only these sections. Explain enquiry, availability check, quotation and confirmation. State Bhiwandi base and Maharashtra travel enquiries subject to date/location/availability. No residential address or guaranteed statewide availability. Test all languages.

## Prompt 7 — Portfolio
Build portfolio from a content manifest. Categories All/Bridal/Haldi/Engagement/Party. Real photos and videos only with permission. Accessible filters and lightbox; Escape closes, focus managed, keyboard works. Video poster, no autoplay sound. Lazy-load and reserve dimensions. Label placeholders. Ask for assets and consent status. Test mobile, keyboard, modal and reduced motion.

## Prompt 8 — Reviews and FAQ
Use only authorised Google review source/embed. No fabricated rating, count, names or review text. If no integration, show “Read our Google reviews” link only. FAQ answers must be based on confirmed business policy; flag unknowns. Test keyboard and mobile.

## Prompt 9 — Contact and WhatsApp
Implement enquiry form: name, phone, occasion, date, event city/area, optional ready-by time and notes. Localise labels and WhatsApp message in EN/HI/MR. Read number from config. Validate, URL-encode and open wa.me. State this is an enquiry, not booking confirmation. No backend storage and no claim of server submission. Test valid/invalid inputs and all languages.

## Prompt 10 — Motion polish
Audit the site against AGENTS.md. Refine CTA hover/active/focus, selected scroll reveals, image transitions and click feedback. Consider small makeup-brush cursor only on fine-pointer desktop; never replace native pointer; disable touch/reduced-motion. No scroll hijacking, aggressive parallax, confetti, sound or blocking transitions. Check performance and justify each effect.

## Prompt 11 — Quality audit
Audit responsive sizes, keyboard/accessibility, reduced motion, translations, links/CTAs, WhatsApp output, portfolio/video, real review source, SEO, structured data, image performance/layout shift, console errors, lint/typecheck/build, privacy and address exposure. Create prioritised issue list. Fix only in-scope issues; ask before design/architecture changes. Do not claim unrun tests passed.

## Prompt 12 — Cloudflare deployment
Read current Cloudflare docs for the selected framework and deploy target. Configure Cloudflare Pages for static output unless approved architecture requires Workers. Create preview first. Verify build/output directory, routes, asset paths, headers/redirects and environment config. Do not buy a domain or change DNS. Provide exact account actions and production smoke-test checklist. Never expose secrets.
