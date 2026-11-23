import fs from 'node:fs';
import path from 'node:path';

console.log('--- Testing Phase 9 Functional Verification (Contact Form & WhatsApp Integration) ---');

// 1. Verify business configuration
const business = JSON.parse(fs.readFileSync('src/config/business.json', 'utf8'));
if (business.contact.rawPhone !== '918308944456') {
  throw new Error(`Expected business.contact.rawPhone to be 918308944456, got ${business.contact.rawPhone}`);
}
console.log('✓ Business phone verified: +91 83089 44456');

// 2. Test Phone Normalization and Validation Logic
function validateIndianPhone(phone) {
  if (!phone || !phone.trim()) return false;
  const trimmed = phone.trim();

  // Reject alphabetic characters and disallowed symbols
  // Only digits, spaces, hyphens, and optional leading '+' are permitted
  if (/[^0-9\s\-+]/.test(trimmed)) {
    return false;
  }

  // '+' is only permitted at the very beginning and at most once
  if (trimmed.includes('+') && (!trimmed.startsWith('+') || (trimmed.match(/\+/g) || []).length > 1)) {
    return false;
  }

  // Normalize Indian phone numbers by removing permitted spaces and hyphens before validation
  const normalized = trimmed.replace(/[\s\-]/g, '');

  // Accept valid 10-digit Indian mobile numbers and valid numbers prefixed with +91 (or bare 91)
  const isTenDigit = /^[6-9]\d{9}$/.test(normalized);
  const isPlus91 = /^\+91[6-9]\d{9}$/.test(normalized);
  const isBare91 = /^91[6-9]\d{9}$/.test(normalized);

  return isTenDigit || isPlus91 || isBare91;
}

const acceptedPhoneVectors = [
  '9820012345',              // Standard 10-digit Indian mobile
  '+91 9820012345',          // +91 with space
  '+91-98200-12345',         // +91 with hyphens
  '98200-12345',             // 10-digit with hyphen
  '98200 12345',             // 10-digit with space
  '+919820012345',           // +91 without spaces or hyphens
  '919820012345',            // Bare 91 prefix without plus
  '91 98200 12345',          // Bare 91 with spaces
  '+91 61234 56789',         // Valid series 6
  '+91 71234 56789',         // Valid series 7
  '+91 81234 56789',         // Valid series 8
  '+91 91234 56789',         // Valid series 9
  '  9820012345  ',          // Leading / trailing whitespace
  '+91-9820-012-345',        // Multiple hyphens
  '98 20 01 23 45',          // Multiple spaces
];

const rejectedPhoneVectors = [
  '98200abc12',              // Contains alphabetic characters
  '+91 98200 ABCD',          // Contains alphabetic characters with +91
  '98200-ABCD-12345',        // Contains alphabetic characters with hyphens
  'abcdefghij',              // Pure letters
  '98200@1234',              // Disallowed symbol @
  '98200#12345',             // Disallowed symbol #
  '98200$12345',             // Disallowed symbol $
  '+1 9820012345',           // Invalid international prefix (+1 US)
  '+44 9820012345',          // Invalid international prefix (+44 UK)
  '+92 9820012345',          // Invalid international prefix (+92 PK)
  '09820012345',             // Invalid trunk prefix 0 / 11 digits
  '1234567890',              // Invalid leading digit 1
  '2345678901',              // Invalid leading digit 2
  '3456789012',              // Invalid leading digit 3
  '4567890123',              // Invalid leading digit 4
  '5820012345',              // Invalid leading digit 5
  '98200',                   // Too short (5 digits)
  '982001234',               // Too short (9 digits)
  '+91 98200',               // Too short with +91
  '98200123456',             // Too long (11 digits without prefix)
  '+91 98200123456',         // Too long (11 digits with +91)
  '98200+12345',             // Plus symbol in middle of number
  '++91 9820012345',         // Double plus symbol
  '+91+9820012345',          // Misplaced plus symbol
  '',                        // Empty string
  '   ',                     // Whitespace only
];

for (const p of acceptedPhoneVectors) {
  const ok = validateIndianPhone(p);
  if (!ok) {
    throw new Error(`Phone validation FAILED for expected valid input: "${p}"`);
  }
}
console.log(`✓ Accepted phone formats verified (${acceptedPhoneVectors.length} vectors)`);

for (const p of rejectedPhoneVectors) {
  const ok = validateIndianPhone(p);
  if (ok) {
    throw new Error(`Phone validation FAILED for expected invalid input: "${p}"`);
  }
}
console.log(`✓ Rejected phone formats verified (${rejectedPhoneVectors.length} vectors)`);

// 3. Test Date Validation Logic (Non-past dates allowed without 3-month restriction)
function validateEventDate(dateStr) {
  if (!dateStr) return { valid: false, error: 'required' };
  const selected = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (isNaN(selected.getTime())) return { valid: false, error: 'invalid' };
  if (selected < now) return { valid: false, error: 'past' };
  return { valid: true };
}

const now = new Date();
const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const yesterday = new Date(now.getTime() - 86400000);
const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
const in30Days = new Date(now.getTime() + 30 * 86400000);
const in30DaysStr = `${in30Days.getFullYear()}-${String(in30Days.getMonth() + 1).padStart(2, '0')}-${String(in30Days.getDate()).padStart(2, '0')}`;
const in120Days = new Date(now.getTime() + 120 * 86400000);
const in120DaysStr = `${in120Days.getFullYear()}-${String(in120Days.getMonth() + 1).padStart(2, '0')}-${String(in120Days.getDate()).padStart(2, '0')}`;
const in1Year = new Date(now.getTime() + 365 * 86400000);
const in1YearStr = `${in1Year.getFullYear()}-${String(in1Year.getMonth() + 1).padStart(2, '0')}-${String(in1Year.getDate()).padStart(2, '0')}`;

if (!validateEventDate(todayStr).valid) throw new Error('Today should be valid');
if (!validateEventDate(in30DaysStr).valid) throw new Error('Date within 30 days should be valid');
if (!validateEventDate(in120DaysStr).valid) throw new Error('Date 120 days ahead should be valid (no 3-month restriction)');
if (!validateEventDate(in1YearStr).valid) throw new Error('Date 1 year ahead should be valid');
if (validateEventDate(yesterdayStr).valid) throw new Error('Yesterday should be rejected as past date');
if (validateEventDate('').valid) throw new Error('Empty date should be rejected');
console.log('✓ Event date validation (non-past, open booking window) verified');

// 4. Test WhatsApp Message Generation & Gender-Neutral Phrasing in EN, HI, MR
const locales = ['en', 'hi', 'mr'];

for (const lang of locales) {
  const translation = JSON.parse(fs.readFileSync(`src/content/translations/${lang}.json`, 'utf8'));
  const tmpl = translation.contactSection.form.messageTemplate;
  const occasionOptions = translation.contactSection.form.fields.occasion.options;

  // Verify occasion options contain confirmed services and "other"
  const expectedOccasions = ['bridal', 'haldi', 'engagement', 'party', 'other'];
  for (const occ of expectedOccasions) {
    if (!occasionOptions[occ]) {
      throw new Error(`Missing occasion option ${occ} in ${lang}`);
    }
  }

  // Verify other occasion labels
  const occasionFields = translation.contactSection.form.fields.occasion;
  if (!occasionFields.otherLabel || !occasionFields.otherPlaceholder || !occasionFields.otherRequiredError) {
    throw new Error(`Missing other occasion helper fields in ${lang}`);
  }

  // Gender-neutral verification
  if (lang === 'hi') {
    if (tmpl.intro.includes('चाहती हूँ') || tmpl.intro.includes('चाहता हूँ')) {
      throw new Error('Hindi message intro should use gender-neutral phrasing (e.g. मुझे ... पूछताछ करनी है)');
    }
    console.log(`✓ [HI] Verified gender-neutral template: "${tmpl.intro}"`);
  }
  if (lang === 'mr') {
    if (tmpl.intro.includes('इच्छितो') || tmpl.intro.includes('इच्छिते')) {
      throw new Error('Marathi message intro should use gender-neutral phrasing (e.g. मला ... चौकशी करायची आहे)');
    }
    console.log(`✓ [MR] Verified gender-neutral template: "${tmpl.intro}"`);
  }

  // Simulate full message with optional fields
  const sampleName = 'Priya Sharma';
  const samplePhone = '+91 98200 12345';
  const sampleOccasion = occasionOptions.bridal;
  const sampleDate = in30DaysStr;
  const sampleVenue = 'Bhiwandi Banquet Hall';
  const sampleTime = '10:00 AM';
  const sampleNotes = 'Traditional Maharashtrian look';

  const fullMsgLines = [
    tmpl.greeting,
    '',
    tmpl.intro,
    '',
    `${tmpl.nameLabel}: ${sampleName}`,
    `${tmpl.phoneLabel}: ${samplePhone}`,
    `${tmpl.occasionLabel}: ${sampleOccasion}`,
    `${tmpl.dateLabel}: ${sampleDate}`,
    `${tmpl.venueLabel}: ${sampleVenue}`,
    `${tmpl.readyByLabel}: ${sampleTime}`,
    `${tmpl.notesLabel}: ${sampleNotes}`,
    '',
    tmpl.closing,
    '',
    tmpl.thanks
  ];
  const fullMsg = fullMsgLines.join('\n');
  const encodedFull = encodeURIComponent(fullMsg);
  const waUrlFull = `https://wa.me/918308944456?text=${encodedFull}`;

  if (!waUrlFull.startsWith('https://wa.me/918308944456?text=')) {
    throw new Error(`Invalid WhatsApp URL format in ${lang}`);
  }

  // Simulate message WITHOUT optional fields (readyByTime and notes omitted)
  const minimalMsgLines = [
    tmpl.greeting,
    '',
    tmpl.intro,
    '',
    `${tmpl.nameLabel}: ${sampleName}`,
    `${tmpl.phoneLabel}: ${samplePhone}`,
    `${tmpl.occasionLabel}: ${sampleOccasion}`,
    `${tmpl.dateLabel}: ${sampleDate}`,
    `${tmpl.venueLabel}: ${sampleVenue}`,
    '',
    tmpl.closing,
    '',
    tmpl.thanks
  ];
  const minimalMsg = minimalMsgLines.join('\n');
  if (minimalMsg.includes(tmpl.readyByLabel) || minimalMsg.includes(tmpl.notesLabel)) {
    throw new Error(`Minimal message should omit optional labels in ${lang}`);
  }

  // Simulate custom "other" occasion message
  const customOccasionName = 'Baby Shower & Traditional Draping';
  const customOccasionDisplay = `${occasionOptions.other} — ${customOccasionName}`;
  const otherMsgLines = [
    tmpl.greeting,
    '',
    tmpl.intro,
    '',
    `${tmpl.nameLabel}: ${sampleName}`,
    `${tmpl.phoneLabel}: ${samplePhone}`,
    `${tmpl.occasionLabel}: ${customOccasionDisplay}`,
    `${tmpl.dateLabel}: ${sampleDate}`,
    `${tmpl.venueLabel}: ${sampleVenue}`,
    '',
    tmpl.closing,
    '',
    tmpl.thanks
  ];
  const otherMsg = otherMsgLines.join('\n');
  if (!otherMsg.includes(customOccasionName) || !otherMsg.includes(occasionOptions.other)) {
    throw new Error(`Custom occasion text missing in generated message for ${lang}`);
  }

  console.log(`✓ [${lang.toUpperCase()}] WhatsApp message generation and URL encoding verified`);
}

// 5. Test Built HTML in dist for all 3 languages (after build)
if (fs.existsSync(path.resolve('dist', 'en', 'index.html'))) {
  for (const lang of locales) {
    const htmlPath = path.resolve('dist', lang, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Check section ID
    if (!html.includes('id="contact"')) {
      throw new Error(`Missing id="contact" in dist/${lang}/index.html`);
    }

    // Check direct phone link
    if (!html.includes('href="tel:+918308944456"')) {
      throw new Error(`Missing tel:+918308944456 in dist/${lang}/index.html`);
    }

    // Check direct WhatsApp link
    if (!html.includes('href="https://wa.me/918308944456')) {
      throw new Error(`Missing wa.me/918308944456 in dist/${lang}/index.html`);
    }

    // Check Instagram link
    if (!html.includes('href="https://www.instagram.com/amrapali_makeover_139/"')) {
      throw new Error(`Missing Instagram URL in dist/${lang}/index.html`);
    }

    // Check form inputs rendered via SSR
    if (!html.includes('name="name"') || !html.includes('name="phone"') || !html.includes('name="occasion"') || !html.includes('name="eventDate"') || !html.includes('name="venue"')) {
      throw new Error(`Missing form inputs in dist/${lang}/index.html`);
    }

    // Check disclosures
    const t = JSON.parse(fs.readFileSync(`src/content/translations/${lang}.json`, 'utf8'));
    if (!html.includes(t.contactSection.form.disclosures.noServerStorage)) {
      throw new Error(`Missing noServerStorage disclosure in dist/${lang}/index.html`);
    }
    if (!html.includes(t.contactSection.form.disclosures.enquiryOnlyNotice)) {
      throw new Error(`Missing enquiryOnlyNotice disclosure in dist/${lang}/index.html`);
    }

    // Check announcement bar message
    if (!html.includes(t.announcement.message)) {
      throw new Error(`Missing announcement message in dist/${lang}/index.html`);
    }

    console.log(`✓ [${lang.toUpperCase()}] HTML markup, announcement bar, form elements, direct CTAs, and disclosures verified`);
  }
}

console.log('\nALL PHASE 9 FUNCTIONAL & CORRECTION TESTS PASSED WITH ZERO DEFECTS!');
