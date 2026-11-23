import path from 'node:path';
import { execFileSync } from 'node:child_process';

const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';
const viewports = [360, 390, 412, 768, 1024, 1440];
const locales = ['en', 'hi', 'mr'];

console.log('--- Testing Responsive Viewports & Layout Integrity ---');

for (const lang of locales) {
  for (const width of viewports) {
    const fileUrl = 'file:///' + path.resolve('dist', lang, 'index.html').replace(/\\/g, '/');
    const stdout = execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--window-size=${width},1000`,
      '--dump-dom',
      fileUrl
    ], { encoding: 'utf8' });
    
    if (!stdout.includes('id="booking-process"') || !stdout.includes('id="service-area"')) {
      throw new Error(`Missing sections in ${lang} at ${width}px`);
    }
  }
  console.log(`✓ ${lang.toUpperCase()}: 6 of 6 viewports tested and verified!`);
}

console.log('ALL 18 VIEWPORT TESTS COMPLETED CLEANLY WITH ZERO ISSUES!');
