import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\d6a6ca53-5eaf-4007-a77f-8aed16ddb585';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');
const DIST_URL = 'file:///' + DIST.replace(/\\/g, '/');

const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');

// Prep HTML focusing directly on the video viewer card
const modifiedHtml = enHtml
  .replace(
    `<link rel="stylesheet" href="/_astro/${cssFile}">`,
    `<style>${cssContent}\n#hero, #about, #services, #booking-process, #service-area, astro-island { display: none !important; }\n* { animation: none !important; transition: none !important; }</style>`
  )
  .replaceAll('/_astro/', `${DIST_URL}/_astro/`)
  .replaceAll('src="/images/', `src="${DIST_URL}/images/`)
  .replaceAll('src="/videos/', `src="${DIST_URL}/videos/`)
  .replaceAll('poster="/images/', `poster="${DIST_URL}/images/`);

const tempHtml = path.join(DIST, 'temp-video-card-test.html');
fs.writeFileSync(tempHtml, modifiedHtml, 'utf8');

const outDesktop = path.join(OUT_DIR, 'cloudflare-portfolio-video-desktop-1440.png');
const outMobile = path.join(OUT_DIR, 'cloudflare-portfolio-video-mobile-390.png');

execFileSync(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--allow-file-access-from-files',
  '--virtual-time-budget=4000',
  '--run-all-compositor-stages-before-draw',
  `--screenshot=${outDesktop}`,
  '--window-size=1458,1100',
  `file:///${tempHtml.replace(/\\/g, '/')}`
]);
fs.copyFileSync(outDesktop, path.join(BRAIN_DIR, 'cloudflare-portfolio-video-desktop-1440.png'));

execFileSync(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--allow-file-access-from-files',
  '--virtual-time-budget=4000',
  '--run-all-compositor-stages-before-draw',
  `--screenshot=${outMobile}`,
  '--window-size=408,1250',
  `file:///${tempHtml.replace(/\\/g, '/')}`
]);
fs.copyFileSync(outMobile, path.join(BRAIN_DIR, 'cloudflare-portfolio-video-mobile-390.png'));

if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
console.log('Video card screenshots captured successfully.');
