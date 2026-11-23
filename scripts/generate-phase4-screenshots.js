import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');

const certImgBuf = fs.readFileSync('public/images/about/amrapali-certificate.png');
const certDataUri = 'data:image/png;base64,' + certImgBuf.toString('base64');

const artistSvg = fs.readFileSync('public/images/about/artist-placeholder.svg', 'utf8');
const artistDataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(artistSvg);

const locales = ['en', 'hi', 'mr'];

console.log('--- Generating Phase 4 About Section Focused Screenshots ---');

for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');

  // Inlined base HTML hiding hero so #about is prominently framed at top
  const baseInlined = originalHtml
    .replace(
      `<link rel="stylesheet" href="/_astro/${cssFile}">`,
      `<style>${cssContent}\n#hero { display: none !important; }\n* { animation: none !important; transition: none !important; }</style>`
    )
    .replace('src="/images/about/amrapali-certificate.png"', `src="${certDataUri}"`)
    .replace('src="/images/about/artist-placeholder.svg"', `src="${artistDataUri}"`);

  // 1. Desktop (1440px)
  {
    const tempHtml = path.join(DIST, `${lang}/temp-about-desk.html`);
    fs.writeFileSync(tempHtml, baseInlined);
    const out = path.join(OUT_DIR, `about-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,1150',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `about-${lang}-desktop-1440.png`));
    console.log(`✓ about-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
  }

  // 2. Mobile (390px)
  {
    const mobileHtml = baseInlined
      .replace('<html lang="', `<html style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
      .replace('<body class="', `<body style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
    const tempHtml = path.join(DIST, `${lang}/temp-about-mob.html`);
    fs.writeFileSync(tempHtml, mobileHtml);
    const out = path.join(OUT_DIR, `about-${lang}-mobile-390.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=390,1750',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `about-${lang}-mobile-390.png`));
    console.log(`✓ about-${lang}-mobile-390.png: ${fs.statSync(out).size} bytes`);
  }
}

console.log('ALL PHASE 4 ABOUT SCREENSHOTS CAPTURED CLEANLY!');
