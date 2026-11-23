import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');
const DIST_URL = 'file:///' + DIST.replace(/\\/g, '/');

console.log('--- Generating Phase 10 Comprehensive QA Screenshots ---');

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
    .replaceAll('poster="/images/', `poster="${DIST_URL}/images/`)
    .replace(
      '</head>',
      `<script>
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
      </script></head>`
    );
}

function captureScreenshot(htmlContent, outFilename, width, height, scrollY = 0) {
  let modifiedHtml = htmlContent;
  if (width < 600) {
    modifiedHtml = modifiedHtml
      .replace('<html lang="', `<html style="width: ${width}px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
      .replace('<body class="', `<body style="width: ${width}px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
  }

  if (scrollY > 0) {
    modifiedHtml = modifiedHtml.replace(
      '</body>',
      `<script>
        window.addEventListener('load', () => {
          setTimeout(() => { window.scrollTo(0, ${scrollY}); }, 300);
        });
      </script></body>`
    );
  }

  const tempHtml = path.join(DIST, `temp-${outFilename}.html`);
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
    `--window-size=${width},${height}`,
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);

  if (fs.existsSync(tempHtml)) {
    fs.unlinkSync(tempHtml);
  }

  const brainPath = path.join(BRAIN_DIR, outFilename);
  fs.copyFileSync(outPath, brainPath);
  console.log(`✓ ${outFilename} [${width}x${height}]: ${fs.statSync(outPath).size} bytes`);
}

// 1. Homepage EN Desktop (1440px)
const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
const enPrepped = createPreppedHtml(enHtml);
captureScreenshot(enPrepped, 'homepage-en-desktop-1440.png', 1440, 2400);

// 2. Homepage EN Mobile (390px)
captureScreenshot(enPrepped, 'homepage-en-mobile-390.png', 390, 2400);

// 3. Homepage HI Mobile (390px)
const hiHtml = fs.readFileSync(path.join(DIST, 'hi/index.html'), 'utf8');
const hiPrepped = createPreppedHtml(hiHtml);
captureScreenshot(hiPrepped, 'homepage-hi-mobile-390.png', 390, 2400);

// 4. Homepage MR Mobile (390px)
const mrHtml = fs.readFileSync(path.join(DIST, 'mr/index.html'), 'utf8');
const mrPrepped = createPreppedHtml(mrHtml);
captureScreenshot(mrPrepped, 'homepage-mr-mobile-390.png', 390, 2400);

// 5. Portfolio Desktop (1440px) — Focused Section
const portfolioHideSelector = '#hero, #about, #services, #booking-process, #service-area, #reviews, #faq, #contact';
const portfolioPrepped = createPreppedHtml(enHtml, portfolioHideSelector);
captureScreenshot(portfolioPrepped, 'portfolio-desktop-1440.png', 1440, 1600);

// 6. Portfolio Mobile (390px) — Focused Section
captureScreenshot(portfolioPrepped, 'portfolio-mobile-390.png', 390, 2000);

// 7. Contact Desktop (1440px) — Focused Section
const contactHideSelector = '#hero, #about, #services, #booking-process, #service-area, #portfolio, #reviews, #faq';
const contactPrepped = createPreppedHtml(enHtml, contactHideSelector);
captureScreenshot(contactPrepped, 'contact-desktop-1440.png', 1440, 1600);

// 8. Contact Mobile (390px) — Focused Section
captureScreenshot(contactPrepped, 'contact-mobile-390.png', 390, 2600);

console.log('\nAll 8 Phase 10 screenshots generated and synchronized successfully!');
