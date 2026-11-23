import fs from 'node:fs';
import path from 'node:path';

console.log('--- Testing Phase 8 Functional Verification (Google Reviews & FAQ) ---');

// 1. Verify business config has the verified Google Business URL
const business = JSON.parse(fs.readFileSync('src/config/business.json', 'utf8'));
const expectedGoogleUrl = 'https://share.google/LOT7Ne1J7AtzPkc54';

if (business.reviews?.googleBusinessUrl !== expectedGoogleUrl) {
  throw new Error(`Expected business.reviews.googleBusinessUrl to be ${expectedGoogleUrl}, but got ${business.reviews?.googleBusinessUrl}`);
}
console.log(`✓ business.json reviews.googleBusinessUrl verified: ${business.reviews.googleBusinessUrl}`);

// 2. Verify all 3 language builds in dist
const locales = ['en', 'hi', 'mr'];

for (const lang of locales) {
  const htmlPath = path.resolve('dist', lang, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Check section anchors
  if (!html.includes('id="reviews"')) {
    throw new Error(`Missing id="reviews" in ${lang}`);
  }
  if (!html.includes('id="faq"')) {
    throw new Error(`Missing id="faq" in ${lang}`);
  }
  console.log(`✓ [${lang.toUpperCase()}] #reviews and #faq section anchors verified`);

  // Check Google Reviews link and attributes
  if (!html.includes(`href="${expectedGoogleUrl}"`)) {
    throw new Error(`Missing Google Reviews href in ${lang}`);
  }
  if (!html.includes('target="_blank"') || !html.includes('rel="noopener noreferrer"')) {
    throw new Error(`Missing safe external link attributes on Google Reviews link in ${lang}`);
  }
  console.log(`✓ [${lang.toUpperCase()}] Official Google Business Profile external link verified with safe target/rel`);

  // Check FAQ questions count
  const faqData = JSON.parse(fs.readFileSync(`src/content/translations/${lang}.json`, 'utf8'));
  const faqItems = faqData.faqSection.items;
  if (faqItems.length !== 8) {
    throw new Error(`Expected 8 FAQ items in ${lang}, got ${faqItems.length}`);
  }

  // Verify each FAQ item is present in HTML (normalize HTML entities for comparison)
  const normalizedHtml = html.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  for (const item of faqItems) {
    if (!normalizedHtml.includes(item.question)) {
      throw new Error(`Missing FAQ question "${item.question}" in ${lang}`);
    }
  }
  console.log(`✓ [${lang.toUpperCase()}] All 8 FAQ questions verified in built HTML`);

  // Check ARIA and accessibility attributes
  if (!html.includes('aria-expanded') || !html.includes('aria-controls') || !html.includes('role="region"')) {
    throw new Error(`Missing accordion accessibility attributes in ${lang}`);
  }
  console.log(`✓ [${lang.toUpperCase()}] Accordion accessibility attributes (aria-expanded, aria-controls, role="region") verified`);

  // Check WhatsApp enquiry button in FAQ
  if (!html.includes('https://wa.me/918308944456?text=')) {
    throw new Error(`Missing FAQ WhatsApp CTA in ${lang}`);
  }
  console.log(`✓ [${lang.toUpperCase()}] FAQ direct WhatsApp enquiry link verified`);
}

// 3. Verify specific Phase 8 content corrections
const enHtml = fs.readFileSync('dist/en/index.html', 'utf8');
if (!enHtml.includes('Public Google Reviews')) {
  throw new Error('Missing "Public Google Reviews" in dist/en/index.html');
}
if (enHtml.includes('100% Public &amp; Verified') || enHtml.includes('100% Public & Verified')) {
  throw new Error('Found deprecated "100% Public & Verified" in dist/en/index.html');
}
if (!enHtml.includes('Travel enquiries across Maharashtra are considered subject to event date, location, travel logistics and availability.')) {
  throw new Error('Missing corrected travel qualifier in dist/en/index.html');
}
console.log('✓ Phase 8 content corrections verified in dist/en/index.html:');
console.log('  - "Public Google Reviews" present');
console.log('  - Deprecated "100% Public & Verified" absent');
console.log('  - Qualified Maharashtra travel wording verified');

console.log('\nALL PHASE 8 FUNCTIONAL & ACCESSIBILITY TESTS PASSED WITH ZERO DEFECTS!');
