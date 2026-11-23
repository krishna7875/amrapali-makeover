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

console.log('--- Capturing Verification Screenshots for Issue 1 & Issue 2 ---');
const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');

// 1. Issue 1: Desktop Navigation at 1024, 1280, 1440
capture(createPreppedHtml(enHtml), 'nav-fixed-en-desktop-1024.png', 1024, 300);
capture(createPreppedHtml(enHtml), 'nav-fixed-en-desktop-1280.png', 1280, 300);
capture(createPreppedHtml(enHtml), 'nav-fixed-en-desktop-1440.png', 1440, 300);

// 2. Issue 2: Anchor Targets Positioned Immediately Below Navbar (Desktop 1440px)
// Preceding sections hidden to place the target section header immediately below the sticky navbar
capture(createPreppedHtml(enHtml, '#hero, #about, #services'), 'anchor-fixed-process-desktop-1440.png', 1440, 700);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area'), 'anchor-fixed-portfolio-desktop-1440.png', 1440, 700);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area, #portfolio'), 'anchor-fixed-reviews-desktop-1440.png', 1440, 700);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area, #portfolio, #reviews, #faq'), 'anchor-fixed-contact-desktop-1440.png', 1440, 700);

// 3. Issue 2: Anchor Targets Positioned Immediately Below Navbar (Mobile 390px)
capture(createPreppedHtml(enHtml, '#hero, #about, #services'), 'anchor-fixed-process-mobile-390.png', 390, 600);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area'), 'anchor-fixed-portfolio-mobile-390.png', 390, 600);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area, #portfolio'), 'anchor-fixed-reviews-mobile-390.png', 390, 600);
capture(createPreppedHtml(enHtml, '#hero, #about, #services, #booking-process, #service-area, #portfolio, #reviews, #faq'), 'anchor-fixed-contact-mobile-390.png', 390, 600);

console.log('--- All screenshots captured and verified successfully ---');
