import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');

const bridalImgBuf = fs.readFileSync('public/images/hero/hero-bridal-0893.jpg');
const bridalDataUri = 'data:image/jpeg;base64,' + bridalImgBuf.toString('base64');

const locales = ['en', 'hi', 'mr'];

for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');

  // 1. Desktop
  const desktopInlined = originalHtml
    .replace(`<link rel="stylesheet" href="/_astro/${cssFile}">`, `<style>${cssContent}\n.hero-content-entrance, .hero-image-entrance { animation: none !important; opacity: 1 !important; transform: none !important; }</style>`)
    .replace('src="/images/hero/hero-bridal-0893.jpg"', `src="${bridalDataUri}"`);
  
  const desktopHtmlPath = path.join(DIST, `${lang}/temp-desktop.html`);
  fs.writeFileSync(desktopHtmlPath, desktopInlined, 'utf8');
  const desktopOut = path.join(OUT_DIR, `hero-${lang}-desktop-1440.png`);
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--virtual-time-budget=2000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${desktopOut}`,
    '--window-size=1440,1100',
    `file:///${desktopHtmlPath.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(desktopHtmlPath);
  fs.copyFileSync(desktopOut, path.join(BRAIN_DIR, `hero-${lang}-desktop-1440.png`));
  console.log(`✓ hero-${lang}-desktop-1440.png: ${fs.statSync(desktopOut).size} bytes`);

  // 2. Mobile
  const mobileInlined = originalHtml
    .replace(`<link rel="stylesheet" href="/_astro/${cssFile}">`, `<style>${cssContent}\n.hero-content-entrance, .hero-image-entrance { animation: none !important; opacity: 1 !important; transform: none !important; }</style>`)
    .replace('src="/images/hero/hero-bridal-0893.jpg"', `src="${bridalDataUri}"`)
    .replace('<html lang="', `<html style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
    .replace('<body class="', `<body style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
  
  const mobileHtmlPath = path.join(DIST, `${lang}/temp-mobile.html`);
  fs.writeFileSync(mobileHtmlPath, mobileInlined, 'utf8');
  const mobileOut = path.join(OUT_DIR, `hero-${lang}-mobile-390.png`);
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--virtual-time-budget=2000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${mobileOut}`,
    '--window-size=390,1400',
    `file:///${mobileHtmlPath.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(mobileHtmlPath);
  fs.copyFileSync(mobileOut, path.join(BRAIN_DIR, `hero-${lang}-mobile-390.png`));
  console.log(`✓ hero-${lang}-mobile-390.png: ${fs.statSync(mobileOut).size} bytes`);
}
