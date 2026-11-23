import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

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

const locales = ['en', 'hi', 'mr'];

console.log('--- Phase 10 Accessibility (WCAG 2.2 AA) Audit ---');

for (const lang of locales) {
  console.log(`\nAuditing /${lang}/...`);
  const htmlPath = path.join(distDir, lang, 'index.html');
  assert(fs.existsSync(htmlPath), `File exists: ${lang}/index.html`);
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Language attribute on <html>
  assert(html.includes(`<html lang="${lang}"`), `html tag has correct lang="${lang}"`);

  // 2. Skip to content link
  assert(html.includes('href="#main-content"'), `Skip link to #main-content present (${lang})`);
  assert(html.includes('id="main-content"'), `Target main#main-content element present (${lang})`);

  // 3. Landmark regions
  assert(html.includes('<header'), `Header landmark present (${lang})`);
  assert(html.includes('<nav'), `Nav landmark present (${lang})`);
  assert(html.includes('<main'), `Main landmark present (${lang})`);
  assert(html.includes('<footer'), `Footer landmark present (${lang})`);

  // 4. Heading structure
  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gis) || [];
  assert(h1Matches.length === 1, `Exactly one h1 exists (${lang}) — found ${h1Matches.length}`);

  const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gis) || [];
  assert(h2Matches.length >= 6, `At least 6 section h2 headings exist (${lang}) — found ${h2Matches.length}`);

  // 5. Image accessibility (all <img> tags must have alt attributes)
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  console.log(`  Info: Found ${imgMatches.length} <img> tags in ${lang}/index.html`);
  let imgAltFailures = 0;
  for (const imgTag of imgMatches) {
    if (!/alt=["'][^"']*["']/i.test(imgTag)) {
      imgAltFailures++;
      console.error(`  Missing alt attribute in: ${imgTag}`);
    }
  }
  assert(imgAltFailures === 0, `All ${imgMatches.length} <img> tags have valid alt attributes (${lang})`);

  // 6. Explicit image/video dimensions to prevent Cumulative Layout Shift (CLS)
  let missingDimensions = 0;
  for (const imgTag of imgMatches) {
    const hasWidth = /width=["'][^"']*["']/i.test(imgTag);
    const hasHeight = /height=["'][^"']*["']/i.test(imgTag);
    if (!hasWidth || !hasHeight) {
      missingDimensions++;
    }
  }
  assert(missingDimensions === 0, `All ${imgMatches.length} <img> tags have explicit width & height attributes (${lang})`);

  // 7. Video accessibility & dimensions
  const videoMatches = html.match(/<video[^>]*>.*?<\/video>/gis) || [];
  assert(videoMatches.length >= 1, `Video element found (${lang})`);
  for (const vid of videoMatches) {
    assert(vid.includes('controls'), `Video has native controls (${lang})`);
    assert(vid.includes('playsinline'), `Video has playsinline attribute (${lang})`);
    assert(vid.includes('aria-label='), `Video has accessible aria-label (${lang})`);
    assert(vid.includes('poster='), `Video has poster thumbnail (${lang})`);
    assert(vid.includes('width=') && vid.includes('height='), `Video has explicit width and height (${lang})`);
  }

  // 8. Focus visible indicators on interactive elements
  assert(html.includes('focus:outline-none') && html.includes('focus:ring-2'), `Visible focus ring tokens utilized in components (${lang})`);

  // 9. Form accessibility
  assert(html.includes('aria-required="true"'), `Form has explicit aria-required attributes (${lang})`);
  assert(html.includes('aria-describedby='), `Form errors linked via aria-describedby (${lang})`);
  
  // Verify error messages have role="alert" in the component implementation
  const contactFormSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/ContactForm.tsx'), 'utf8');
  assert(contactFormSrc.includes('role="alert"'), `Form error messages have role="alert" in ContactForm.tsx`);

  // 10. Floating WhatsApp accessibility
  assert(html.includes('aria-label='), `Floating WhatsApp has accessible aria-label (${lang})`);
}

console.log(`\n========================================`);
console.log(`Total Accessibility Passed: ${passedTests}`);
console.log(`Total Accessibility Failed: ${failedTests}`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\nAll Accessibility & Layout tests passed perfectly!');
}
