import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const business = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/config/business.json'), 'utf8'));
const siteUrl = business.seo.siteUrl;

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

console.log(`\n--- 1. Testing robots.txt and sitemap.xml for ${siteUrl} ---`);
const robotsPath = path.join(distDir, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists in dist');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('User-agent: *'), 'robots.txt specifies User-agent: *');
assert(robotsContent.includes('Allow: /'), 'robots.txt allows root');
assert(robotsContent.includes('Disallow: /styleguide/'), 'robots.txt disallows /styleguide/');
assert(robotsContent.includes(`Sitemap: ${siteUrl}/sitemap.xml`), `robots.txt points to ${siteUrl}/sitemap.xml`);

const sitemapPath = path.join(distDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in dist');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes(`${siteUrl}/en/`), `sitemap includes ${siteUrl}/en/`);
assert(sitemapContent.includes(`${siteUrl}/hi/`), `sitemap includes ${siteUrl}/hi/`);
assert(sitemapContent.includes(`${siteUrl}/mr/`), `sitemap includes ${siteUrl}/mr/`);
assert(!sitemapContent.includes('/styleguide/'), 'sitemap strictly excludes /styleguide/');
assert(sitemapContent.includes('hreflang="x-default"'), 'sitemap includes x-default hreflang links');

console.log('\n--- 2. Testing Root Redirect (dist/index.html) ---');
const rootHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
assert(rootHtml.includes('content="noindex"'), 'root index.html has noindex robots');
assert(rootHtml.includes(`rel="canonical" href="${siteUrl}/en/"`), `root index.html has canonical to ${siteUrl}/en/`);

console.log('\n--- 3. Testing Internal Styleguide (dist/styleguide/index.html) ---');
const styleguideHtml = fs.readFileSync(path.join(distDir, 'styleguide/index.html'), 'utf8');
assert(styleguideHtml.includes('content="noindex, nofollow"'), 'styleguide has noindex, nofollow robots');
assert(styleguideHtml.includes(`href="${siteUrl}/styleguide/"`), `styleguide has canonical to ${siteUrl}/styleguide/`);
assert(!styleguideHtml.includes('hreflang='), 'styleguide has no hreflang tags');

console.log('\n--- 4. Testing Public Language Routes (en, hi, mr) ---');
const locales = [
  { lang: 'en', code: 'en_IN', expectedTitlePrefix: 'Amrapali Makeover — Luxury Bridal' },
  { lang: 'hi', code: 'hi_IN', expectedTitlePrefix: 'आम्रपाली मेकओवर — विशिष्ट ब्राइडल' },
  { lang: 'mr', code: 'mr_IN', expectedTitlePrefix: 'आम्रपाली मेकओव्हर — खास ब्राइडल' }
];

for (const loc of locales) {
  console.log(`\nChecking /${loc.lang}/...`);
  const htmlPath = path.join(distDir, loc.lang, 'index.html');
  assert(fs.existsSync(htmlPath), `dist/${loc.lang}/index.html exists`);
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Title & description
  assert(html.includes(`<title>${loc.expectedTitlePrefix}`), `Title starts with localized prefix (${loc.lang})`);
  assert(html.includes('name="description" content="'), `Meta description present (${loc.lang})`);
  
  // Robots & Canonical
  assert(html.includes('content="index, follow"'), `Robots is index, follow (${loc.lang})`);
  assert(html.includes(`rel="canonical" href="${siteUrl}/${loc.lang}/"`), `Canonical URL is absolute and derives from siteUrl (${loc.lang})`);

  // Hreflang alternates
  assert(html.includes(`rel="alternate" hreflang="en" href="${siteUrl}/en/"`), `Hreflang en present (${loc.lang})`);
  assert(html.includes(`rel="alternate" hreflang="hi" href="${siteUrl}/hi/"`), `Hreflang hi present (${loc.lang})`);
  assert(html.includes(`rel="alternate" hreflang="mr" href="${siteUrl}/mr/"`), `Hreflang mr present (${loc.lang})`);
  assert(html.includes(`rel="alternate" hreflang="x-default" href="${siteUrl}/en/"`), `Hreflang x-default present (${loc.lang})`);

  // Open Graph
  assert(html.includes('property="og:site_name" content="Amrapali Makeover"'), `og:site_name present (${loc.lang})`);
  assert(html.includes('property="og:type" content="website"'), `og:type website present (${loc.lang})`);
  assert(html.includes('property="og:title"'), `og:title present (${loc.lang})`);
  assert(html.includes('property="og:description"'), `og:description present (${loc.lang})`);
  assert(html.includes(`property="og:url" content="${siteUrl}/${loc.lang}/"`), `og:url matches canonical (${loc.lang})`);
  assert(html.includes(`property="og:image" content="${siteUrl}/images/hero/hero-bridal-0893.jpg"`), `og:image is absolute (${loc.lang})`);
  assert(html.includes(`property="og:locale" content="${loc.code}"`), `og:locale is ${loc.code} (${loc.lang})`);

  // Twitter cards
  assert(html.includes('name="twitter:card" content="summary_large_image"'), `twitter:card is summary_large_image (${loc.lang})`);
  assert(html.includes('name="twitter:title"'), `twitter:title present (${loc.lang})`);
  assert(html.includes(`name="twitter:image" content="${siteUrl}/images/hero/hero-bridal-0893.jpg"`), `twitter:image is absolute (${loc.lang})`);

  // Favicon & Theme Color & Preloads
  assert(html.includes('rel="icon" type="image/svg+xml" href="/favicon.svg"'), `favicon.svg linked (${loc.lang})`);
  assert(html.includes('name="theme-color" content="#2A1420"'), `theme-color is #2A1420 (${loc.lang})`);
  assert(html.includes('rel="preload" as="image" href="/images/hero/hero-bridal-0893.jpg" fetchpriority="high"'), `hero image preload tag with fetchpriority=high present (${loc.lang})`);

  // JSON-LD structured data
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert(!!jsonLdMatch, `JSON-LD script block exists (${loc.lang})`);
  if (jsonLdMatch) {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      assert(parsed['@context'] === 'https://schema.org', `JSON-LD @context is schema.org (${loc.lang})`);
      assert(parsed['@type'] === 'BeautySalon', `JSON-LD @type is BeautySalon (${loc.lang})`);
      assert(parsed.name === 'Amrapali Makeover', `JSON-LD name matches brand (${loc.lang})`);
      assert(parsed.url === siteUrl, `JSON-LD url matches central siteUrl (${loc.lang})`);
      assert(parsed.image === `${siteUrl}/images/hero/hero-bridal-0893.jpg`, `JSON-LD image derives from siteUrl (${loc.lang})`);
      assert(parsed.address && parsed.address.addressLocality === 'Bhiwandi', `JSON-LD locality is Bhiwandi without private street (${loc.lang})`);
      assert(parsed.telephone === '+91 83089 44456', `JSON-LD telephone is verified phone (${loc.lang})`);
      assert(Array.isArray(parsed.sameAs) && parsed.sameAs.length >= 2, `JSON-LD has verified social/maps links (${loc.lang})`);
      assert(parsed.hasOfferCatalog && Array.isArray(parsed.hasOfferCatalog.itemListElement), `JSON-LD lists confirmed services (${loc.lang})`);
      assert(parsed.hasOfferCatalog.itemListElement.length === 4, `JSON-LD strictly has 4 confirmed services (${loc.lang})`);
    } catch (e) {
      assert(false, `JSON-LD parsed valid JSON: ${e.message}`);
    }
  }
}

console.log(`\n========================================`);
console.log(`Total Passed: ${passedTests}`);
console.log(`Total Failed: ${failedTests}`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(`\nAll SEO tests for ${siteUrl} passed perfectly!`);
}
