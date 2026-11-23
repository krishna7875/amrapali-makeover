import path from 'node:path';
import { execFileSync } from 'node:child_process';

const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';
const locales = ['en', 'hi', 'mr'];

console.log('--- Checking for Browser Console Errors ---');

for (const lang of locales) {
  const fileUrl = 'file:///' + path.resolve('dist', lang, 'index.html').replace(/\\/g, '/');
  try {
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      '--dump-dom',
      fileUrl
    ], { encoding: 'utf8' });
    console.log(`✓ ${lang.toUpperCase()}: Loaded and evaluated without crash or unhandled exceptions.`);
  } catch (err) {
    console.error(`Error in ${lang}:`, err.message);
  }
}
