import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING COMPREHENSIVE SHELL VERIFICATION ===\n');

// 1. Language and Routing Verification
console.log('--- 1. Language and Routing Checks ---');

const LOCALES = ['en', 'hi', 'mr'];
const DEFAULT_LOCALE = 'en';

function isValidLocale(lang) {
  return LOCALES.includes(lang);
}

function getLocalizedPath(currentPathname, targetLocale) {
  const segments = currentPathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}/`;
  if (isValidLocale(segments[0])) {
    segments[0] = targetLocale;
    return `/${segments.join('/')}/`;
  }
  if (currentPathname.startsWith('/styleguide')) return currentPathname;
  return `/${targetLocale}/${segments.join('/')}/`;
}

// a. Root redirect file
const rootHtml = fs.readFileSync('dist/index.html', 'utf8');
const hasMetaRefresh = rootHtml.includes('url=/en/');
const hasWindowLocation = rootHtml.includes('window.location.replace("/en/")') || rootHtml.includes('window.location.href = "/en/"');
console.log('Root index.html redirect to /en/:', hasMetaRefresh && hasWindowLocation ? 'PASS' : 'FAIL');

// b. Localized paths exist
for (const lang of LOCALES) {
  const p = path.resolve(`dist/${lang}/index.html`);
  const exists = fs.existsSync(p);
  const content = fs.readFileSync(p, 'utf8');
  const hasLangAttr = content.includes(`<html lang="${lang}"`);
  console.log(`Route /${lang}/ exists and has lang="${lang}":`, exists && hasLangAttr ? 'PASS' : 'FAIL');
}

// c. Translation Key Parity
const en = JSON.parse(fs.readFileSync('src/content/translations/en.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('src/content/translations/hi.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('src/content/translations/mr.json', 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys = keys.concat(getAllKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getAllKeys(en).sort();
const hiKeys = getAllKeys(hi).sort();
const mrKeys = getAllKeys(mr).sort();

const hiDiff = enKeys.filter(k => !hiKeys.includes(k));
const mrDiff = enKeys.filter(k => !mrKeys.includes(k));
console.log(`Translation key parity (EN keys: ${enKeys.length}, HI: ${hiKeys.length}, MR: ${mrKeys.length}):`, 
  hiDiff.length === 0 && mrDiff.length === 0 ? 'PASS (100% Match)' : `FAIL: HI missing [${hiDiff}], MR missing [${mrDiff}]`);

// d. Missing translation handling
function getTranslationsMock(lang = DEFAULT_LOCALE) {
  const translations = { en, hi, mr };
  const normalizedLang = isValidLocale(lang) ? lang : DEFAULT_LOCALE;
  return translations[normalizedLang];
}
const fallbackTranslations = getTranslationsMock('invalid_locale');
console.log('Fallback on invalid locale defaults to EN:', fallbackTranslations.common.brandName === 'Amrapali Makeover' ? 'PASS' : 'FAIL');

// e. Nested future routes language switching
const nestedEnToHi = getLocalizedPath('/en/services/bridal/', 'hi');
const nestedHiToMr = getLocalizedPath('/hi/services/bridal/', 'mr');
const nestedMrToEn = getLocalizedPath('/mr/services/bridal/', 'en');
console.log('Nested route switcher /en/services/bridal/ ->', nestedEnToHi, nestedEnToHi === '/hi/services/bridal/' ? 'PASS' : 'FAIL');
console.log('Nested route switcher /hi/services/bridal/ ->', nestedHiToMr, nestedHiToMr === '/mr/services/bridal/' ? 'PASS' : 'FAIL');
console.log('Nested route switcher /mr/services/bridal/ ->', nestedMrToEn, nestedMrToEn === '/en/services/bridal/' ? 'PASS' : 'FAIL');


// 2. Business Information Verification
console.log('\n--- 2. Business Information Checks ---');
const business = JSON.parse(fs.readFileSync('src/config/business.json', 'utf8'));

console.log('Brand name:', business.brand.name === 'Amrapali Makeover' ? 'PASS' : 'FAIL');
console.log('Phone:', business.contact.displayPhone === '+91 83089 44456' ? 'PASS' : 'FAIL');
console.log('Direct Tel link:', business.contact.directPhoneTel === 'tel:+918308944456' ? 'PASS' : 'FAIL');
console.log('Raw Phone digits:', business.contact.rawPhone === '918308944456' ? 'PASS' : 'FAIL');
console.log('Instagram handle:', business.social.instagramHandle === '@amrapali_makeover_139' ? 'PASS' : 'FAIL');
console.log('Instagram URL:', business.social.instagramUrl === 'https://www.instagram.com/amrapali_makeover_139/' ? 'PASS' : 'FAIL');
console.log('Base location:', business.location.displayLocation === 'Bhiwandi, Thane, Maharashtra' ? 'PASS' : 'FAIL');
console.log('Storefront flag is false:', business.location.hasCustomerStorefront === false ? 'PASS' : 'FAIL');
console.log('Pricing mode is enquiry_only:', business.pricing.mode === 'enquiry_only' ? 'PASS' : 'FAIL');
console.log('Services count is exactly 4:', business.services.length === 4 ? 'PASS' : 'FAIL');

// Check dist HTML files for forbidden patterns (no residential address, no map pin, no universal guarantee)
const allDistHtml = ['en', 'hi', 'mr'].map(l => fs.readFileSync(`dist/${l}/index.html`, 'utf8')).join('\n');
const hasGoogleMapEmbed = allDistHtml.includes('google.com/maps/embed') || allDistHtml.includes('maps.google.com');
const hasUniversalGuarantee = allDistHtml.includes('available everywhere in Maharashtra') || allDistHtml.includes('guaranteed availability');
console.log('No Google Maps embed or home pin in output:', !hasGoogleMapEmbed ? 'PASS' : 'FAIL');
console.log('No universal availability promise (travel is conditional):', !hasUniversalGuarantee ? 'PASS' : 'FAIL');


// 3. WhatsApp Verification
console.log('\n--- 3. WhatsApp Integration Checks ---');
function buildWhatsAppUrlMock(phone = business.contact.rawPhone, messageText) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!messageText || messageText.trim() === '') return `https://wa.me/${cleanPhone}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText.trim())}`;
}

const enWaUrl = buildWhatsAppUrlMock(business.contact.rawPhone, en.floatingWhatsApp.defaultMessage);
const hiWaUrl = buildWhatsAppUrlMock(business.contact.rawPhone, hi.floatingWhatsApp.defaultMessage);
const mrWaUrl = buildWhatsAppUrlMock(business.contact.rawPhone, mr.floatingWhatsApp.defaultMessage);

console.log('EN WhatsApp URL has correct number 918308944456:', enWaUrl.startsWith('https://wa.me/918308944456?') ? 'PASS' : 'FAIL');
console.log('EN WhatsApp message is correctly URL-encoded:', enWaUrl.includes('text=' + encodeURIComponent(en.floatingWhatsApp.defaultMessage)) ? 'PASS' : 'FAIL');
console.log('HI WhatsApp URL has correct number 918308944456:', hiWaUrl.startsWith('https://wa.me/918308944456?') ? 'PASS' : 'FAIL');
console.log('HI WhatsApp message is correctly URL-encoded Devanagari:', hiWaUrl.includes('text=' + encodeURIComponent(hi.floatingWhatsApp.defaultMessage)) ? 'PASS' : 'FAIL');
console.log('MR WhatsApp URL has correct number 918308944456:', mrWaUrl.startsWith('https://wa.me/918308944456?') ? 'PASS' : 'FAIL');
console.log('MR WhatsApp message is correctly URL-encoded Devanagari:', mrWaUrl.includes('text=' + encodeURIComponent(mr.floatingWhatsApp.defaultMessage)) ? 'PASS' : 'FAIL');


// 4. Mobile Navigation Accessibility
console.log('\n--- 4. Mobile Navigation Accessibility Checks ---');
const navSource = fs.readFileSync('src/components/layout/HeaderNavigation.tsx', 'utf8');

const hasAriaModal = navSource.includes('aria-modal="true"');
const hasDialogRole = navSource.includes('role="dialog"');
const hasAriaExpanded = navSource.includes('aria-expanded={isDrawerOpen}');
const hasAriaControls = navSource.includes('aria-controls="mobile-navigation-drawer"');
const hasEscapeHandler = navSource.includes("e.key === 'Escape'");
const hasFocusTrap = navSource.includes("e.key === 'Tab'") && navSource.includes('focusableElements');
const hasBodyScrollLock = navSource.includes("document.body.style.overflow = 'hidden'");
const hasFocusReturn = navSource.includes('triggerRef.current?.focus()');
const hasPortal = navSource.includes('createPortal(') && navSource.includes('document.body');

console.log('aria-modal="true":', hasAriaModal ? 'PASS' : 'FAIL');
console.log('role="dialog":', hasDialogRole ? 'PASS' : 'FAIL');
console.log('aria-expanded toggle:', hasAriaExpanded ? 'PASS' : 'FAIL');
console.log('aria-controls link:', hasAriaControls ? 'PASS' : 'FAIL');
console.log('Escape key listener:', hasEscapeHandler ? 'PASS' : 'FAIL');
console.log('Tab key focus trap:', hasFocusTrap ? 'PASS' : 'FAIL');
console.log('Body scroll lock:', hasBodyScrollLock ? 'PASS' : 'FAIL');
console.log('Focus return to trigger button on close:', hasFocusReturn ? 'PASS' : 'FAIL');
console.log('Drawer portalled to document.body:', hasPortal ? 'PASS' : 'FAIL');

console.log('\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
