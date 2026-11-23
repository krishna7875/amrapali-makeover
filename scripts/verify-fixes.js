import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';
const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');
const DIST_URL = 'file:///' + DIST.replace(/\\/g, '/');

console.log('===================================================================');
console.log('=== VERIFYING ISSUE 1: DESKTOP NAVIGATION OVERFLOW & WRAPPING   ===');
console.log('===================================================================');

const navInspectScript = `
window.addEventListener('load', () => {
  const header = document.querySelector('header');
  const nav = document.querySelector('header nav');
  const navLinks = Array.from(document.querySelectorAll('header nav a'));
  const actions = nav ? nav.nextElementSibling : null;
  
  const results = {
    innerWidth: window.innerWidth,
    headerHeight: header ? header.offsetHeight : null,
    navWidth: nav ? nav.offsetWidth : null,
    links: navLinks.map(a => ({
      text: a.textContent.trim(),
      width: a.offsetWidth,
      height: a.offsetHeight,
      wrapped: a.offsetHeight > 28
    })),
    navActionsGap: (nav && actions) ? actions.getBoundingClientRect().left - nav.getBoundingClientRect().right : null,
    overlap: (nav && actions) ? (nav.getBoundingClientRect().right > actions.getBoundingClientRect().left) : false
  };

  const d = document.createElement('div');
  d.id = 'nav-results';
  d.textContent = JSON.stringify(results);
  document.body.appendChild(d);
});
`;

let issue1Passed = true;

for (const lang of ['en', 'hi', 'mr']) {
  console.log(`\n--- Language: ${lang.toUpperCase()} ---`);
  const rawHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8')
    .replace(`<link rel="stylesheet" href="/_astro/${cssFile}">`, `<style>${cssContent}</style>`)
    .replaceAll('/_astro/', `${DIST_URL}/_astro/`)
    .replace('</body>', `<script>${navInspectScript}</script></body>`);

  for (const width of [1024, 1280, 1440, 1920]) {
    const tempHtml = path.join(DIST, `temp-verify-nav-${lang}-${width}.html`);
    fs.writeFileSync(tempHtml, rawHtml, 'utf8');

    try {
      const out = execFileSync(CHROME, [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--allow-file-access-from-files',
        '--virtual-time-budget=2000',
        `--window-size=${width + 18},900`,
        '--dump-dom',
        `file:///${tempHtml.replace(/\\/g, '/')}`
      ], { encoding: 'utf8' });

      const match = out.match(/<div id="nav-results">([\s\S]*?)<\/div>/);
      if (match) {
        const data = JSON.parse(match[1]);
        const anyWrapped = data.links.some(l => l.wrapped);
        const status = (!anyWrapped && !data.overlap && data.headerHeight <= 95) ? 'PASS' : 'FAIL';
        if (status === 'FAIL') issue1Passed = false;

        console.log(`[${status}] ${width}px: innerWidth=${data.innerWidth}px | headerHeight=${data.headerHeight}px | gapToActions=${data.navActionsGap?.toFixed(1)}px | anyWrapped=${anyWrapped} | overlap=${data.overlap}`);
        if (anyWrapped) {
          data.links.filter(l => l.wrapped).forEach(l => console.log(`   -> WRAPPED: "${l.text}" (w=${l.width}px, h=${l.height}px)`));
        }
      }
    } finally {
      if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    }
  }
}

console.log('\n===================================================================');
console.log('=== VERIFYING ISSUE 2: SECTION ANCHOR SCROLL OFFSET & SPACING   ===');
console.log('===================================================================');

const scrollInspectScript = (targetHash) => `
window.addEventListener('load', () => {
  const targetEl = document.querySelector('${targetHash}');
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'instant' });
  }
  setTimeout(() => {
    const header = document.querySelector('header');
    const headerBottom = header.getBoundingClientRect().bottom;
    const section = targetEl ? (targetEl.tagName.toLowerCase() === 'section' ? targetEl : targetEl.closest('section')) : null;
    const heading = section ? section.querySelector('h2') : null;
    const eyebrow = section ? section.querySelector('.inline-flex') : null;

    const data = {
      hash: '${targetHash}',
      headerBottom: headerBottom,
      gapNavbarToEyebrow: eyebrow ? eyebrow.getBoundingClientRect().top - headerBottom : null,
      gapNavbarToHeading: heading ? heading.getBoundingClientRect().top - headerBottom : null,
    };

    const d = document.createElement('div');
    d.id = 'anchor-results';
    d.textContent = JSON.stringify(data);
    document.body.appendChild(d);
  }, 100);
});
`;

let issue2Passed = true;
const targetList = ['#process', '#portfolio', '#reviews', '#contact', '#services', '#about', '#faq'];

for (const [wName, width, height] of [['Mobile 390px', 390, 844], ['Tablet 768px', 768, 1024], ['Desktop 1440px', 1440, 900]]) {
  console.log(`\n--- Viewport: ${wName} (${width}px) ---`);
  for (const target of targetList) {
    const html = fs.readFileSync('dist/en/index.html', 'utf8')
      .replace(`<link rel="stylesheet" href="/_astro/${cssFile}">`, `<style>${cssContent}</style>`)
      .replaceAll('/_astro/', `${DIST_URL}/_astro/`)
      .replace('</body>', `<script>${scrollInspectScript(target)}</script></body>`);

    const tempHtml = path.join(DIST, `temp-verify-scroll-${target.replace('#', '')}-${width}.html`);
    fs.writeFileSync(tempHtml, html, 'utf8');

    try {
      const out = execFileSync(CHROME, [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--allow-file-access-from-files',
        '--virtual-time-budget=2000',
        `--window-size=${width + 18},${height}`,
        '--dump-dom',
        `file:///${tempHtml.replace(/\\/g, '/')}`
      ], { encoding: 'utf8' });

      const match = out.match(/<div id="anchor-results">([\s\S]*?)<\/div>/);
      if (match) {
        const res = JSON.parse(match[1]);
        const gapEyebrow = res.gapNavbarToEyebrow;
        const gapHeading = res.gapNavbarToHeading;
        // Verify: Eyebrow must be >= 10px below navbar (no clipping) and <= 35px below navbar (no excessive whitespace)
        const isClean = gapEyebrow >= 10 && gapEyebrow <= 35;
        if (!isClean) issue2Passed = false;
        const status = isClean ? 'PASS' : 'FAIL';
        console.log(`[${status}] Target ${target.padEnd(12)}: gapToEyebrow=${gapEyebrow?.toFixed(1).padStart(5)}px | gapToHeading=${gapHeading?.toFixed(1).padStart(5)}px`);
      }
    } finally {
      if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    }
  }
}

console.log('\n===================================================================');
console.log(`OVERALL RESULTS:`);
console.log(`  Issue 1 (Desktop Navigation Overflow): ${issue1Passed ? 'PASSED 100%' : 'FAILED'}`);
console.log(`  Issue 2 (Section Anchor Scroll Offset): ${issue2Passed ? 'PASSED 100%' : 'FAILED'}`);
console.log('===================================================================');
