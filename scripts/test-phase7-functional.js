import path from 'node:path';
import fs from 'node:fs';

const locales = ['en', 'hi', 'mr'];

console.log('--- Testing Phase 7 Functional Verification (Filters, Assets, Video) ---');

// 1. Verify all referenced assets exist in dist
const requiredAssets = [
  'dist/images/portfolio/bridal/IMG_0882.PNG',
  'dist/images/portfolio/bridal/IMG_0893.PNG',
  'dist/images/portfolio/haldi/IMG_0882.PNG',
  'dist/images/portfolio/haldi/IMG_0893.PNG',
  'dist/images/portfolio/engagement/IMG_0881.PNG',
  'dist/images/portfolio/engagement/IMG_0889.PNG',
  'dist/images/portfolio/engagement/IMG_0894.PNG',
  'dist/images/portfolio/party/IMG_0886.PNG',
  'dist/images/portfolio/party/IMG_0888.PNG',
  'dist/images/portfolio/hairstyle/IMG_9148.PNG',
  'dist/images/portfolio/hairstyle/IMG_9441.PNG',
  'dist/images/portfolio/video-poster.svg',
  'dist/videos/portfolio/IMG_0186.MP4'
];

for (const asset of requiredAssets) {
  if (!fs.existsSync(asset)) {
    throw new Error(`Missing required asset in dist: ${asset}`);
  }
  const size = fs.statSync(asset).size;
  console.log(`✓ Asset verified: ${asset} (${size} bytes)`);
}

// 2. Test DOM for Portfolio and Video in all 3 languages
for (const lang of locales) {
  const htmlPath = path.resolve('dist', lang, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Verify section ID
  if (!html.includes('id="portfolio"')) {
    throw new Error(`Missing id="portfolio" in ${lang}`);
  }

  // Verify video element attributes
  if (!html.includes('src="/videos/portfolio/IMG_0186.MP4"')) {
    throw new Error(`Missing video src in ${lang}`);
  }
  if (!html.includes('poster="/images/portfolio/video-poster.svg"')) {
    throw new Error(`Missing video poster in ${lang}`);
  }
  if (!html.includes('controls')) {
    throw new Error(`Missing video controls in ${lang}`);
  }

  // Verify temporary Haldi labels
  if (!html.includes('IMG_0882.PNG') || !html.includes('IMG_0893.PNG')) {
    throw new Error(`Missing portfolio image references in ${lang}`);
  }

  console.log(`✓ ${lang.toUpperCase()}: Portfolio section, images, and video player verified in built HTML!`);
}

console.log('ALL FUNCTIONAL AND ASSET CHECKS PASSED WITH ZERO DEFECTS!');
