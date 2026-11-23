import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');

// Read 4 SVG placeholders to embed as base64 data URIs
const bridalSvg = fs.readFileSync('public/images/services/service-bridal-placeholder.svg');
const bridalDataUri = 'data:image/svg+xml;base64,' + bridalSvg.toString('base64');

const haldiSvg = fs.readFileSync('public/images/services/service-haldi-placeholder.svg');
const haldiDataUri = 'data:image/svg+xml;base64,' + haldiSvg.toString('base64');

const engagementSvg = fs.readFileSync('public/images/services/service-engagement-placeholder.svg');
const engagementDataUri = 'data:image/svg+xml;base64,' + engagementSvg.toString('base64');

const partySvg = fs.readFileSync('public/images/services/service-party-placeholder.svg');
const partyDataUri = 'data:image/svg+xml;base64,' + partySvg.toString('base64');

const locales = ['en', 'hi', 'mr'];

console.log('--- Generating Phase 5 Services Section Focused Screenshots ---');

for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');

  // Inlined base HTML hiding hero and about so #services is framed cleanly at top
  const baseInlined = originalHtml
    .replace(
      `<link rel="stylesheet" href="/_astro/${cssFile}">`,
      `<style>${cssContent}\n#hero, #about { display: none !important; }\n* { animation: none !important; transition: none !important; }</style>`
    )
    .replace('src="/images/services/service-bridal-placeholder.svg"', `src="${bridalDataUri}"`)
    .replace('src="/images/services/service-haldi-placeholder.svg"', `src="${haldiDataUri}"`)
    .replace('src="/images/services/service-engagement-placeholder.svg"', `src="${engagementDataUri}"`)
    .replace('src="/images/services/service-party-placeholder.svg"', `src="${partyDataUri}"`);

  // 1. Desktop (1440px)
  {
    const tempHtml = path.join(DIST, `${lang}/temp-services-desk.html`);
    fs.writeFileSync(tempHtml, baseInlined);
    const out = path.join(OUT_DIR, `services-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,1260',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `services-${lang}-desktop-1440.png`));
    console.log(`✓ services-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
  }

  // 2. Mobile (390px)
  {
    const mobileHtml = baseInlined
      .replace('<html lang="', `<html style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
      .replace('<body class="', `<body style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
    const tempHtml = path.join(DIST, `${lang}/temp-services-mob.html`);
    fs.writeFileSync(tempHtml, mobileHtml);
    const out = path.join(OUT_DIR, `services-${lang}-mobile-390.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=390,2850',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `services-${lang}-mobile-390.png`));
    console.log(`✓ services-${lang}-mobile-390.png: ${fs.statSync(out).size} bytes`);
  }
}

console.log('ALL PHASE 5 SERVICES SCREENSHOTS CAPTURED SUCCESSFULLY!');
