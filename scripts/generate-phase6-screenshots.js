import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');

const locales = ['en', 'hi', 'mr'];

console.log('--- Generating Phase 6 Booking Process & Service Area Screenshots ---');

for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');

  // Base stylesheet override with transitions disabled
  const baseStyled = originalHtml.replace(
    `<link rel="stylesheet" href="/_astro/${cssFile}">`,
    `<style>${cssContent}\n* { animation: none !important; transition: none !important; }</style>`
  );

  // =========================================================================
  // 1. Booking Process Desktop (1440px)
  // =========================================================================
  {
    const bpDeskHtml = baseStyled.replace(
      '</style>',
      '\n#hero, #about, #services, #service-area { display: none !important; }\n</style>'
    );
    const tempHtml = path.join(DIST, `${lang}/temp-bp-desk.html`);
    fs.writeFileSync(tempHtml, bpDeskHtml);
    const out = path.join(OUT_DIR, `booking-process-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,1080',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `booking-process-${lang}-desktop-1440.png`));
    console.log(`✓ booking-process-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
  }

  // =========================================================================
  // 2. Service Area Desktop (1440px)
  // =========================================================================
  {
    const saDeskHtml = baseStyled.replace(
      '</style>',
      '\n#hero, #about, #services, #booking-process { display: none !important; }\n</style>'
    );
    const tempHtml = path.join(DIST, `${lang}/temp-sa-desk.html`);
    fs.writeFileSync(tempHtml, saDeskHtml);
    const out = path.join(OUT_DIR, `service-area-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,1120',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `service-area-${lang}-desktop-1440.png`));
    console.log(`✓ service-area-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
  }

  // =========================================================================
  // 3. Combined Phase 6 Sections Desktop (1440px)
  // =========================================================================
  {
    const combDeskHtml = baseStyled.replace(
      '</style>',
      '\n#hero, #about, #services { display: none !important; }\n</style>'
    );
    const tempHtml = path.join(DIST, `${lang}/temp-comb-desk.html`);
    fs.writeFileSync(tempHtml, combDeskHtml);
    const out = path.join(OUT_DIR, `phase6-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,2100',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `phase6-${lang}-desktop-1440.png`));
    console.log(`✓ phase6-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
  }

  // =========================================================================
  // 4. Combined Phase 6 Sections Mobile (390px)
  // =========================================================================
  {
    const mobHtml = baseStyled
      .replace(
        '</style>',
        '\n#hero, #about, #services { display: none !important; }\n</style>'
      )
      .replace('<html lang="', `<html style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
      .replace('<body class="', `<body style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
    const tempHtml = path.join(DIST, `${lang}/temp-comb-mob.html`);
    fs.writeFileSync(tempHtml, mobHtml);
    const out = path.join(OUT_DIR, `phase6-${lang}-mobile-390.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=390,3850',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `phase6-${lang}-mobile-390.png`));
    console.log(`✓ phase6-${lang}-mobile-390.png: ${fs.statSync(out).size} bytes`);
  }
}

console.log('ALL PHASE 6 SCREENSHOTS GENERATED SUCCESSFULLY!');
