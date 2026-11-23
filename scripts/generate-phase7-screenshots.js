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

const locales = ['en', 'hi', 'mr'];

console.log('--- Generating Phase 7 Portfolio & Video Viewer Screenshots ---');

function createPreppedHtml(langHtml) {
  return langHtml
    .replace(
      `<link rel="stylesheet" href="/_astro/${cssFile}">`,
      `<style>${cssContent}\n#hero, #about, #services, #booking-process, #service-area { display: none !important; }\n* { animation: none !important; transition: none !important; }</style>`
    )
    .replaceAll('/_astro/', `${DIST_URL}/_astro/`)
    .replaceAll('src="/images/', `src="${DIST_URL}/images/`)
    .replaceAll('src="/videos/', `src="${DIST_URL}/videos/`)
    .replaceAll('poster="/images/', `poster="${DIST_URL}/images/`)
    .replace(
      '</head>',
      `<script>
        // Intercept runtime image src assignments from React components
        const originalSrcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          set: function(val) {
            if (typeof val === 'string' && val.startsWith('/images/')) {
              val = '${DIST_URL}' + val;
            }
            return originalSrcDesc.set.call(this, val);
          },
          get: function() {
            return originalSrcDesc.get.call(this);
          }
        });

        window.addEventListener('DOMContentLoaded', () => {
          document.querySelectorAll('img').forEach(img => {
            img.removeAttribute('loading');
            img.decoding = 'sync';
            if (img.src && img.getAttribute('src') && img.getAttribute('src').startsWith('/images/')) {
              img.src = '${DIST_URL}' + img.getAttribute('src');
            }
          });
        });
      </script></head>`
    );
}

// 1. Language Views (Desktop & Mobile)
for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');
  const baseStyled = createPreppedHtml(originalHtml);

  // Desktop (1440px)
  {
    const tempHtml = path.join(DIST, `${lang}/temp-portfolio-desk.html`);
    fs.writeFileSync(tempHtml, baseStyled);
    const out = path.join(OUT_DIR, `portfolio-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      '--virtual-time-budget=4000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,2400',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `portfolio-${lang}-desktop-1440.png`));
    console.log(`✓ portfolio-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
  }

  // Mobile (390px)
  {
    const mobHtml = baseStyled
      .replace('<html lang="', `<html style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
      .replace('<body class="', `<body style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" class="`)
      .replace(
        '</body>',
        `<script>
          window.addEventListener('load', () => {
            window.scrollTo(0, 3000);
            setTimeout(() => { window.scrollTo(0, 0); }, 300);
          });
        </script></body>`
      );
    const tempHtml = path.join(DIST, `${lang}/temp-portfolio-mob.html`);
    fs.writeFileSync(tempHtml, mobHtml);
    const out = path.join(OUT_DIR, `portfolio-${lang}-mobile-390.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      '--virtual-time-budget=7000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=390,6200',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `portfolio-${lang}-mobile-390.png`));
    console.log(`✓ portfolio-${lang}-mobile-390.png: ${fs.statSync(out).size} bytes`);
  }
}

// 2. Capture Lightbox Open Preview (EN Desktop)
{
  const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
  const enBaseStyled = createPreppedHtml(enHtml).replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          const btn = document.querySelector('button[aria-label^="View full image"]');
          if (btn) btn.click();
        }, 800);
      });
    </script></body>`
  );

  const tempHtml = path.join(DIST, 'en/temp-lightbox.html');
  fs.writeFileSync(tempHtml, enBaseStyled);
  const out = path.join(OUT_DIR, 'portfolio-lightbox-en-desktop-1440.png');
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${out}`,
    '--window-size=1440,900',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(tempHtml);
  fs.copyFileSync(out, path.join(BRAIN_DIR, 'portfolio-lightbox-en-desktop-1440.png'));
  console.log(`✓ portfolio-lightbox-en-desktop-1440.png: ${fs.statSync(out).size} bytes`);
}

// 3. Capture Haldi Filter Preview with Temporary Badge (EN Desktop)
{
  const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
  const enBaseStyled = createPreppedHtml(enHtml).replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          const buttons = Array.from(document.querySelectorAll('button[role="tab"]'));
          const haldiBtn = buttons.find(b => b.textContent && b.textContent.includes('Haldi'));
          if (haldiBtn) haldiBtn.click();
        }, 800);
      });
    </script></body>`
  );

  const tempHtml = path.join(DIST, 'en/temp-haldi.html');
  fs.writeFileSync(tempHtml, enBaseStyled);
  const out = path.join(OUT_DIR, 'portfolio-filter-haldi-en-desktop-1440.png');
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${out}`,
    '--window-size=1440,1100',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(tempHtml);
  fs.copyFileSync(out, path.join(BRAIN_DIR, 'portfolio-filter-haldi-en-desktop-1440.png'));
  console.log(`✓ portfolio-filter-haldi-en-desktop-1440.png: ${fs.statSync(out).size} bytes`);
}

console.log('ALL PHASE 7 SCREENSHOTS REGENERATED CLEANLY!');
