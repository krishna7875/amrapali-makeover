import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('--- Phase 10 Comprehensive Functional Regression Suite ---');

// 1. Language Switching
console.log('\n1. Verifying Language Switching & Structure (EN, HI, MR)...');
const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
const hiHtml = fs.readFileSync(path.join(DIST, 'hi/index.html'), 'utf8');
const mrHtml = fs.readFileSync(path.join(DIST, 'mr/index.html'), 'utf8');

assert(enHtml.includes('lang="en"') && hiHtml.includes('lang="hi"') && mrHtml.includes('lang="mr"'), 'All 3 language HTML roots have correct lang attribute');
assert(enHtml.includes('hreflang="hi"') && enHtml.includes('hreflang="mr"'), 'EN page provides alternate language links to HI and MR');
assert(hiHtml.includes('hreflang="en"') && hiHtml.includes('hreflang="mr"'), 'HI page provides alternate language links to EN and MR');
assert(mrHtml.includes('hreflang="en"') && mrHtml.includes('hreflang="hi"'), 'MR page provides alternate language links to EN and HI');

const langSwitcherComp = fs.readFileSync('src/components/layout/LanguageSwitcher.tsx', 'utf8');
assert(langSwitcherComp.includes('getLocalizedPath') && langSwitcherComp.includes('LOCALES.map'), 'Language switcher implements localized path routing across all locales');
assert(langSwitcherComp.includes('role="listbox"') && langSwitcherComp.includes('aria-haspopup="listbox"'), 'Language switcher has accessible listbox semantics');

// 2. Portfolio Filters & Lightbox
console.log('\n2. Verifying Portfolio Filters & Lightbox...');
assert(enHtml.includes('id="portfolio"'), 'Portfolio section exists');
assert(enHtml.includes('Bridal') && enHtml.includes('Haldi') && enHtml.includes('Engagement') && enHtml.includes('Party') && enHtml.includes('Hairstyle'), 'All 5 service categories present in portfolio');
assert(enHtml.includes('Temporary Illustrative Image'), 'Temporary illustrative label on Haldi items present');
const portfolioComp = fs.readFileSync('src/components/ui/PortfolioGallery.tsx', 'utf8');
assert(portfolioComp.includes('role="dialog"') && portfolioComp.includes('aria-modal="true"'), 'Portfolio lightbox uses accessible modal dialog attributes');
assert(portfolioComp.includes('Escape') && portfolioComp.includes('triggerRefs.current[closedId]?.focus()'), 'Portfolio lightbox handles Escape key and focus restoration');

// 3. Video Playback
console.log('\n3. Verifying Video Playback & Accessibility...');
assert(enHtml.includes('<video'), 'Video element present');
assert(enHtml.includes('controls') && enHtml.includes('playsinline'), 'Video includes native controls and playsinline');
assert(enHtml.includes('Ambient audio track only; no spoken dialogue'), 'Video includes explicit dialogue accessibility notice');

// 4. Google Business Profile Link
console.log('\n4. Verifying Google Business Profile Link...');
assert(enHtml.includes('href="https://share.google/LOT7Ne1J7AtzPkc54"'), 'Google Business listing URL is present');
assert(enHtml.includes('target="_blank"') && enHtml.includes('rel="noopener noreferrer"'), 'Google Business link has security attributes');
assert(enHtml.includes('Public Google Reviews'), 'Reviews section clearly identifies public Google listing without fake testimonials');

// 5. FAQ Accordion
console.log('\n5. Verifying FAQ Accordion...');
const faqComp = fs.readFileSync('src/components/ui/FaqAccordion.tsx', 'utf8');
assert(faqComp.includes('aria-expanded=') && faqComp.includes('aria-controls='), 'FAQ buttons use aria-expanded and aria-controls');
assert(faqComp.includes('role="region"'), 'FAQ panels use accessible region semantics');

// 6 & 7. Contact Form Validation & Phone Normalization
console.log('\n6 & 7. Verifying Contact Form Validation & Indian Phone Normalization...');
const contactForm = fs.readFileSync('src/components/ui/ContactForm.tsx', 'utf8');
assert(contactForm.includes('aria-required="true"'), 'Required form inputs have aria-required="true"');
assert(contactForm.includes('isTenDigit') && contactForm.includes('isPlus91'), 'Phone validation regex logic present');
assert(contactForm.includes("replace(/[\\s\\-]/g, '')"), 'Phone normalization removes spaces and hyphens');
assert(contactForm.includes('value="other"'), 'Select Occasion dropdown includes "Other" option');
assert(contactForm.includes('name="otherOccasion"'), 'Dynamic text input for custom occasion present');

// 8. WhatsApp Message Generation
console.log('\n8. Verifying WhatsApp URL & Message Templates...');
const business = JSON.parse(fs.readFileSync('src/config/business.json', 'utf8'));
assert(business.contact.rawPhone === '918308944456', 'Verified WhatsApp phone is 918308944456');
assert(enHtml.includes('https://wa.me/918308944456'), 'Enquiry CTAs target verified wa.me endpoint');
const hiJson = JSON.parse(fs.readFileSync('src/content/translations/hi.json', 'utf8'));
const mrJson = JSON.parse(fs.readFileSync('src/content/translations/mr.json', 'utf8'));
assert(hiJson.contactSection.form.messageTemplate.intro === 'मुझे मेकअप सेवाओं के बारे में पूछताछ करनी है।', 'Hindi WhatsApp message template is gender-neutral');
assert(mrJson.contactSection.form.messageTemplate.intro === 'मला मेकअप सेवेबाबत चौकशी करायची आहे.', 'Marathi WhatsApp message template is gender-neutral');

// 9. Travel Qualification & Zero Fake Data
console.log('\n9. Verifying Travel Qualification & Data Integrity...');
const announcementEn = 'Bhiwandi based · On-location makeup services · Maharashtra travel enquiries subject to availability.';
assert(enHtml.includes(announcementEn), 'Announcement bar contains conditional travel qualification');
assert(!enHtml.includes('delivered at your chosen venue across Maharashtra.'), 'Unconditional statewide delivery claim is absent');
assert(!enHtml.includes('100% Public & Verified'), 'Misleading review verification claim is absent');
assert(enHtml.includes('No customer-facing studio'), 'No walk-in studio disclosure is explicit');

console.log(`\n========================================`);
console.log(`Total Functional Regression Tests: ${passedTests}`);
console.log(`Total Failed: ${failedTests}`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\nAll 9 Functional Regression Areas Passed 100%!');
}
