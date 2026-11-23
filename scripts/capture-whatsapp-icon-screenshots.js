import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');
const DIST_URL = 'file:///' + DIST.replace(/\\/g, '/');

function createPreppedHtml(langHtml, hideSelector = '') {
  const extraCss = hideSelector ? `${hideSelector} { display: none !important; }` : '';
  return langHtml
    .replace(
      `<link rel="stylesheet" href="/_astro/${cssFile}">`,
      `<style>${cssContent}\n${extraCss}\n* { animation: none !important; transition: none !important; }</style>`
    )
    .replaceAll('/_astro/', `${DIST_URL}/_astro/`)
    .replaceAll('src="/images/', `src="${DIST_URL}/images/`)
    .replaceAll('src="/videos/', `src="${DIST_URL}/videos/`)
    .replaceAll('poster="/images/', `poster="${DIST_URL}/images/`);
}

function capture(htmlContent, outFilename, width, height) {
  let modifiedHtml = htmlContent;
  if (width < 600) {
    modifiedHtml = modifiedHtml
      .replace('<html lang="', `<html style="width: ${width}px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
      .replace('<body class="', `<body style="width: ${width}px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
  }

  const tempHtml = path.join(DIST, `temp-shot-${outFilename}.html`);
  fs.writeFileSync(tempHtml, modifiedHtml, 'utf8');

  const outPath = path.join(OUT_DIR, outFilename);
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${outPath}`,
    `--window-size=${width + 18},${height}`,
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);

  if (fs.existsSync(tempHtml)) {
    fs.unlinkSync(tempHtml);
  }

  const brainPath = path.join(BRAIN_DIR, outFilename);
  fs.copyFileSync(outPath, brainPath);
  console.log(`✓ Captured: ${outFilename} (${width}x${height}, ${fs.statSync(outPath).size} bytes)`);
}

console.log('--- Capturing WhatsApp Icon Verification Screenshots (EN, HI, MR) ---');

const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
const hiHtml = fs.readFileSync(path.join(DIST, 'hi/index.html'), 'utf8');
const mrHtml = fs.readFileSync(path.join(DIST, 'mr/index.html'), 'utf8');

// 1. English Desktop & Mobile (Header, Hero CTA, Floating WhatsApp)
capture(createPreppedHtml(enHtml), 'whatsapp-icon-en-desktop-1440.png', 1440, 850);
capture(createPreppedHtml(enHtml), 'whatsapp-icon-en-mobile-390.png', 390, 850);

// 2. Hindi Desktop & Mobile
capture(createPreppedHtml(hiHtml), 'whatsapp-icon-hi-desktop-1440.png', 1440, 850);
capture(createPreppedHtml(hiHtml), 'whatsapp-icon-hi-mobile-390.png', 390, 850);

// 3. Marathi Desktop & Mobile
capture(createPreppedHtml(mrHtml), 'whatsapp-icon-mr-desktop-1440.png', 1440, 850);
capture(createPreppedHtml(mrHtml), 'whatsapp-icon-mr-mobile-390.png', 390, 850);

// 4. Contact Section with WhatsApp Card & Disclosure (Desktop & Mobile)
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area, #portfolio, #reviews, #faq'), 'whatsapp-icon-contact-desktop-1440.png', 1440, 1300);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area, #portfolio, #reviews, #faq'), 'whatsapp-icon-contact-mobile-390.png', 390, 1800);

console.log('--- All WhatsApp icon screenshots captured successfully ---');
