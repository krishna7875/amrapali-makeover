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

console.log('--- Generating Phase 9 Contact Form & WhatsApp Integration Screenshots ---');

function createPreppedHtml(langHtml) {
  return langHtml
    .replace(
      `<link rel="stylesheet" href="/_astro/${cssFile}">`,
      `<style>${cssContent}\n#hero, #about, #services, #booking-process, #service-area, #portfolio, #reviews, #faq { display: none !important; }\n* { animation: none !important; transition: none !important; }</style>`
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
      </script></head>`
    );
}

// 1. Language Views (Desktop & Mobile)
for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');
  const baseStyled = createPreppedHtml(originalHtml);

  // Desktop (1440px)
  {
    const tempHtml = path.join(DIST, `${lang}/temp-phase9-desk.html`);
    fs.writeFileSync(tempHtml, baseStyled);
    const out = path.join(OUT_DIR, `contact-${lang}-desktop-1440.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      '--virtual-time-budget=4000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=1440,1600',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `contact-${lang}-desktop-1440.png`));
    console.log(`✓ contact-${lang}-desktop-1440.png: ${fs.statSync(out).size} bytes`);
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
            window.scrollTo(0, 1500);
            setTimeout(() => { window.scrollTo(0, 0); }, 300);
          });
        </script></body>`
      );
    const tempHtml = path.join(DIST, `${lang}/temp-phase9-mob.html`);
    fs.writeFileSync(tempHtml, mobHtml);
    const out = path.join(OUT_DIR, `contact-${lang}-mobile-390.png`);
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      '--virtual-time-budget=5000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`,
      '--window-size=390,2800',
      `file:///${tempHtml.replace(/\\/g, '/')}`
    ]);
    fs.unlinkSync(tempHtml);
    fs.copyFileSync(out, path.join(BRAIN_DIR, `contact-${lang}-mobile-390.png`));
    console.log(`✓ contact-${lang}-mobile-390.png: ${fs.statSync(out).size} bytes`);
  }
}

// 2. Capture Form Validation Error State Preview (EN Desktop - Empty Submission)
{
  const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
  const enBaseStyled = createPreppedHtml(enHtml).replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          // Attempt submit without filling required fields
          const submitBtn = document.querySelector('#contact form button[type="submit"]');
          if (submitBtn) {
            submitBtn.click();
          }
        }, 1000);
      });
    </script></body>`
  );

  const tempHtml = path.join(DIST, 'en/temp-contact-validation.html');
  fs.writeFileSync(tempHtml, enBaseStyled);
  const out = path.join(OUT_DIR, 'contact-form-validation-en-desktop-1440.png');
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${out}`,
    '--window-size=1440,1600',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(tempHtml);
  fs.copyFileSync(out, path.join(BRAIN_DIR, 'contact-form-validation-en-desktop-1440.png'));
  console.log(`✓ contact-form-validation-en-desktop-1440.png: ${fs.statSync(out).size} bytes`);
}

// 3. Capture Invalid Phone Error State Preview (EN Desktop)
{
  const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
  const enBaseStyled = createPreppedHtml(enHtml).replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          const setInputValue = (el, val) => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          };

          // Fill Name
          const nameInput = document.querySelector('input[name="name"]');
          if (nameInput) setInputValue(nameInput, 'Priya Sharma');

          // Fill Invalid Phone (with letters)
          const phoneInput = document.querySelector('input[name="phone"]');
          if (phoneInput) setInputValue(phoneInput, '98200abc12');

          // Select Occasion
          const occSelect = document.querySelector('select[name="occasion"]');
          if (occSelect) {
            occSelect.value = 'bridal';
            occSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Fill Future Date (accepted without 3-month restriction)
          const dateInput = document.querySelector('input[name="eventDate"]');
          if (dateInput) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 45);
            setInputValue(dateInput, futureDate.toISOString().slice(0, 10));
          }

          // Fill Venue
          const venueInput = document.querySelector('input[name="venue"]');
          if (venueInput) setInputValue(venueInput, 'Bhiwandi Banquet Hall');

          // Submit
          setTimeout(() => {
            const submitBtn = document.querySelector('#contact form button[type="submit"]');
            if (submitBtn) {
              submitBtn.click();
            }
          }, 400);
        }, 1000);
      });
    </script></body>`
  );

  const tempHtml = path.join(DIST, 'en/temp-contact-phone-val.html');
  fs.writeFileSync(tempHtml, enBaseStyled);
  const out = path.join(OUT_DIR, 'contact-invalid-phone-en-desktop-1440.png');
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--virtual-time-budget=5000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${out}`,
    '--window-size=1440,1600',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(tempHtml);
  fs.copyFileSync(out, path.join(BRAIN_DIR, 'contact-invalid-phone-en-desktop-1440.png'));
  console.log(`✓ contact-invalid-phone-en-desktop-1440.png: ${fs.statSync(out).size} bytes`);
}

// 4. Capture "Other" Occasion Selected with Custom Text Input (EN Desktop)
{
  const enHtml = fs.readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
  const enBaseStyled = createPreppedHtml(enHtml).replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          const setInputValue = (el, val) => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          };

          // Fill Name
          const nameInput = document.querySelector('input[name="name"]');
          if (nameInput) setInputValue(nameInput, 'Priya Sharma');

          // Fill Phone
          const phoneInput = document.querySelector('input[name="phone"]');
          if (phoneInput) setInputValue(phoneInput, '+91 98200 12345');

          // Select "other" Occasion
          const occSelect = document.querySelector('select[name="occasion"]');
          if (occSelect) {
            occSelect.value = 'other';
            occSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Fill Custom Occasion
          setTimeout(() => {
            const otherOccInput = document.querySelector('input[name="otherOccasion"]');
            if (otherOccInput) {
              setInputValue(otherOccInput, 'Baby Shower & Traditional Draping');
            }
          }, 200);
        }, 1000);
      });
    </script></body>`
  );

  const tempHtml = path.join(DIST, 'en/temp-contact-other-occ.html');
  fs.writeFileSync(tempHtml, enBaseStyled);
  const out = path.join(OUT_DIR, 'contact-occasion-other-en-desktop-1440.png');
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--virtual-time-budget=5000',
    '--run-all-compositor-stages-before-draw',
    `--screenshot=${out}`,
    '--window-size=1440,1600',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(tempHtml);
  fs.copyFileSync(out, path.join(BRAIN_DIR, 'contact-occasion-other-en-desktop-1440.png'));
  console.log(`✓ contact-occasion-other-en-desktop-1440.png: ${fs.statSync(out).size} bytes`);
}

console.log('ALL PHASE 9 SCREENSHOTS GENERATED CLEANLY!');
