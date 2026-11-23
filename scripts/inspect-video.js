import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';
const targetFile = process.argv[2] || 'public/videos/portfolio/IMG_0186.MP4';
const videoPath = path.resolve(targetFile);

if (!fs.existsSync(videoPath)) {
  console.error('File not found:', videoPath);
  process.exit(1);
}

const stat = fs.statSync(videoPath);
console.log('Inspecting:', targetFile);
console.log('Video File Size:', stat.size, 'bytes (', (stat.size / (1024 * 1024)).toFixed(2), 'MiB)');

const html = `<!DOCTYPE html>
<html>
<body>
<video id="v" src="file:///${videoPath.replace(/\\/g, '/')}" preload="metadata" muted playsinline></video>
<script>
const v = document.getElementById('v');
v.addEventListener('loadedmetadata', () => {
  document.title = JSON.stringify({
    duration: v.duration,
    width: v.videoWidth,
    height: v.videoHeight
  });
  console.log('SUCCESS_METADATA: ' + document.title);
});
v.addEventListener('error', (e) => {
  document.title = 'ERROR: ' + (v.error ? v.error.message : 'unknown');
});
</script>
</body>
</html>`;

const tempHtml = path.resolve('temp-video-inspect.html');
fs.writeFileSync(tempHtml, html, 'utf8');

try {
  const dom = execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--virtual-time-budget=3000',
    '--dump-dom',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ], { encoding: 'utf8' });

  const match = dom.match(/<title>(.*?)<\/title>/);
  console.log('Metadata:', match ? match[1] : 'No title tag');
} catch (e) {
  console.error('Error running Chrome:', e.message);
} finally {
  if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
}
