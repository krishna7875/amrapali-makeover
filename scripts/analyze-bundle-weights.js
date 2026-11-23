import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push({ path: fullPath, size: stat.size });
    }
  });
  return results;
}

const allFiles = getFiles(DIST);

// Group by category
const htmlFiles = allFiles.filter(f => f.path.endsWith('.html'));
const cssFiles = allFiles.filter(f => f.path.endsWith('.css'));
const jsFiles = allFiles.filter(f => f.path.endsWith('.js'));
const imageFiles = allFiles.filter(f => /\.(png|jpe?g|svg|webp)$/i.test(f.path));
const videoFiles = allFiles.filter(f => /\.(mp4|webm)$/i.test(f.path));

console.log('--- Static Assets & Bundle Weights Analysis ---');

console.log('\n1. HTML Routes:');
htmlFiles.forEach(f => {
  const rel = path.relative(DIST, f.path);
  console.log(`  - ${rel}: ${(f.size / 1024).toFixed(2)} KB (${f.size} bytes)`);
});

console.log('\n2. CSS Bundles:');
let totalCssBytes = 0;
cssFiles.forEach(f => {
  totalCssBytes += f.size;
  const rel = path.relative(DIST, f.path);
  console.log(`  - ${rel}: ${(f.size / 1024).toFixed(2)} KB (${f.size} bytes)`);
});
console.log(`  Total CSS: ${(totalCssBytes / 1024).toFixed(2)} KB`);

console.log('\n3. JavaScript Bundles:');
let totalJsBytes = 0;
jsFiles.sort((a, b) => b.size - a.size).forEach(f => {
  totalJsBytes += f.size;
  const rel = path.relative(DIST, f.path);
  console.log(`  - ${rel}: ${(f.size / 1024).toFixed(2)} KB (${f.size} bytes)`);
});
console.log(`  Total JS: ${(totalJsBytes / 1024).toFixed(2)} KB`);

console.log('\n4. Largest Image Assets (Top 10):');
imageFiles.sort((a, b) => b.size - a.size).slice(0, 10).forEach(f => {
  const rel = path.relative(DIST, f.path);
  console.log(`  - ${rel}: ${(f.size / 1024).toFixed(2)} KB (${f.size} bytes)`);
});

console.log('\n5. Video Assets:');
videoFiles.forEach(f => {
  const rel = path.relative(DIST, f.path);
  console.log(`  - ${rel}: ${(f.size / (1024 * 1024)).toFixed(2)} MB (${f.size} bytes)`);
});

const totalSiteBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
console.log(`\nTotal Static Distribution Size: ${(totalSiteBytes / (1024 * 1024)).toFixed(2)} MB`);
