import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = path.resolve('dist');
const OUT_DIR = path.resolve('docs/screenshots');
const BRAIN_DIR = 'C:\\Users\\Krishna\\.gemini\\antigravity\\brain\\f471c6d4-1fa2-4ae6-89f7-03689f339d61';
const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';

const cssFile = fs.readdirSync(path.join(DIST, '_astro')).find(f => f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(DIST, '_astro', cssFile), 'utf8');

const business = JSON.parse(fs.readFileSync('src/config/business.json', 'utf8'));
const locales = ['en', 'hi', 'mr'];

function getDrawerHtml(lang) {
  const t = JSON.parse(fs.readFileSync(`src/content/translations/${lang}.json`, 'utf8'));
  const homeUrl = `/${lang}/`;
  const whatsAppHref = `https://wa.me/${business.contact.rawPhone}?text=${encodeURIComponent(t.floatingWhatsApp.defaultMessage)}`;

  const navLinks = [
    { href: `${homeUrl}#services`, label: t.nav.services },
    { href: `${homeUrl}#about`, label: t.nav.about },
    { href: `${homeUrl}#process`, label: t.nav.process },
    { href: `${homeUrl}#portfolio`, label: t.nav.portfolio },
    { href: `${homeUrl}#reviews`, label: t.nav.reviews },
    { href: `${homeUrl}#faq`, label: t.nav.faq },
    { href: `${homeUrl}#contact`, label: t.nav.contact },
  ];

  return `
    <div class="fixed inset-0 z-50 lg:hidden" style="width: 390px; left: 0;">
      <div class="fixed inset-0 bg-[#1E0D16]/60 backdrop-blur-xs transition-opacity duration-200" style="width: 390px; left: 0;" aria-hidden="true"></div>
      <div id="mobile-navigation-drawer" role="dialog" aria-modal="true" aria-label="${t.nav.drawerTitle}" class="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FBF8F4] border-l border-[#DFC8C2] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto" style="left: auto; right: calc(100vw - 390px);">
        <div>
          <div class="flex items-center justify-between border-b border-[#DFC8C2] pb-4">
            <div class="flex flex-col text-left">
              <span class="font-serif text-xl font-medium text-[#2A1420]">${t.common.brandName}</span>
              <span class="text-[10px] uppercase tracking-wider text-[#B99561]">${business.location.displayLocation}</span>
            </div>
            <button type="button" aria-label="${t.nav.menuClose}" class="p-2 rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#F2E5E2] hover:text-[#4B1728] transition-colors focus-visible:ring-2 focus-visible:ring-[#B99561]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>

          <nav aria-label="Mobile Navigation" class="mt-6 flex flex-col space-y-1">
            ${navLinks.map(l => `
              <a href="${l.href}" class="flex items-center justify-between px-3 py-2.5 rounded-[4px] text-base font-medium text-[#24191B] hover:bg-[#F2E5E2] hover:text-[#4B1728] transition-colors">
                <span>${l.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4 text-[#C58F91]"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
            `).join('')}
          </nav>

          <div class="mt-6 p-3 rounded-[4px] bg-[#F2E5E2] border border-[#DFC8C2] text-xs text-[#524245] leading-relaxed text-left">
            <p class="font-semibold text-[#4B1728] mb-0.5">${t.common.onLocationService}</p>
            <p>${t.common.noStudioNotice}</p>
          </div>
        </div>

        <div class="border-t border-[#DFC8C2] pt-6 mt-8 space-y-3">
          <a href="${whatsAppHref}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-[4px] bg-[#4B1728] text-[#FBF8F4] border border-[#4B1728] hover:bg-[#642037] hover:border-[#642037] text-sm px-4 py-2.5 gap-2 w-full uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle w-4 h-4"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path></svg>
            <span>${t.nav.enquireButton}</span>
          </a>

          <div class="grid grid-cols-2 gap-2">
            <a href="${business.contact.directPhoneTel}" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#FBF8F4] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone w-3.5 h-3.5 text-[#B99561]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>Call</span>
            </a>
            <a href="${business.social.instagramUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#FBF8F4] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-[#C58F91]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

console.log('Capturing verified screenshots for EN, HI, MR...');

for (const lang of locales) {
  const originalHtml = fs.readFileSync(path.join(DIST, `${lang}/index.html`), 'utf8');

  // 1. Desktop (1440px)
  const desktopInlined = originalHtml.replace(
    `<link rel="stylesheet" href="/_astro/${cssFile}">`,
    `<style>${cssContent}</style>`
  );
  const desktopHtmlPath = path.join(DIST, `${lang}/snap-desktop.html`);
  fs.writeFileSync(desktopHtmlPath, desktopInlined, 'utf8');
  const desktopOut = path.join(OUT_DIR, `shell-${lang}-desktop-1440.png`);
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--screenshot=${desktopOut}`,
    '--window-size=1440,1200',
    `file:///${desktopHtmlPath.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(desktopHtmlPath);
  fs.copyFileSync(desktopOut, path.join(BRAIN_DIR, `shell-${lang}-desktop-1440.png`));
  console.log(`✓ shell-${lang}-desktop-1440.png (${fs.statSync(desktopOut).size} bytes)`);

  // 2. Mobile (390px)
  const mobileInlined = originalHtml
    .replace(`<link rel="stylesheet" href="/_astro/${cssFile}">`, `<style>${cssContent}</style>`)
    .replace('<html lang="', `<html style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" lang="`)
    .replace('<body class="', `<body style="width: 390px; margin: 0; padding: 0; overflow-x: hidden;" class="`);
  const mobileHtmlPath = path.join(DIST, `${lang}/snap-mobile.html`);
  fs.writeFileSync(mobileHtmlPath, mobileInlined, 'utf8');
  const mobileOut = path.join(OUT_DIR, `shell-${lang}-mobile-390.png`);
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--screenshot=${mobileOut}`,
    '--window-size=390,1400',
    `file:///${mobileHtmlPath.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(mobileHtmlPath);
  fs.copyFileSync(mobileOut, path.join(BRAIN_DIR, `shell-${lang}-mobile-390.png`));
  console.log(`✓ shell-${lang}-mobile-390.png (${fs.statSync(mobileOut).size} bytes)`);

  // 3. Mobile Open Drawer (390px)
  const drawerInlined = mobileInlined
    .replace('</body>', `${getDrawerHtml(lang)}</body>`)
    .replace('overflow-x: hidden;', 'overflow: hidden;');
  const drawerHtmlPath = path.join(DIST, `${lang}/snap-drawer.html`);
  fs.writeFileSync(drawerHtmlPath, drawerInlined, 'utf8');
  const drawerOut = path.join(OUT_DIR, `shell-${lang}-mobile-drawer-open-390.png`);
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--screenshot=${drawerOut}`,
    '--window-size=390,844',
    `file:///${drawerHtmlPath.replace(/\\/g, '/')}`
  ]);
  fs.unlinkSync(drawerHtmlPath);
  fs.copyFileSync(drawerOut, path.join(BRAIN_DIR, `shell-${lang}-mobile-drawer-open-390.png`));
  console.log(`✓ shell-${lang}-mobile-drawer-open-390.png (${fs.statSync(drawerOut).size} bytes)`);
}

console.log('ALL VERIFICATION SCREENSHOTS SAVED AND COPIED TO BRAIN!');
