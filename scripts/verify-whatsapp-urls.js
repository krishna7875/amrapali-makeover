import fs from 'node:fs';

const locales = ['en', 'hi', 'mr'];

console.log('--- Verifying WhatsApp URLs in Production Build ---');

for (const lang of locales) {
  const html = fs.readFileSync(`dist/${lang}/index.html`, 'utf8');
  const urls = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map(m => m[1]);
  console.log(`\n=== ${lang.toUpperCase()} (Total WhatsApp Links: ${urls.length}) ===`);
  for (const url of urls) {
    const decoded = decodeURIComponent(url);
    if (!decoded.startsWith('https://wa.me/918308944456')) {
      throw new Error(`Invalid phone number in URL: ${url}`);
    }
    const msg = decoded.split('?text=')[1] || '(no prefill message)';
    console.log(`✓ 918308944456 | Msg: ${msg.replace(/\n/g, ' ')}`);
  }
}

console.log('\nALL WHATSAPP URLS ROUTE CORRECTLY TO +91 83089 44456!');
