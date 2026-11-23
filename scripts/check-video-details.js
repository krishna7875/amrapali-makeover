import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const CHROME = 'C:\\PROGRA~1\\Google\\Chrome\\Application\\chrome.exe';
const videoPath = path.resolve('public/videos/portfolio/IMG_0186.MP4');

const html = `<!DOCTYPE html>
<html>
<body>
<video id="v" src="file:///${videoPath.replace(/\\/g, '/')}" preload="auto" playsinline></video>
<script>
const v = document.getElementById('v');
v.addEventListener('loadeddata', () => {
  const hasAudio = Boolean(
    v.webkitAudioDecodedByteCount > 0 ||
    v.mozHasAudio ||
    (v.audioTracks && v.audioTracks.length > 0)
  );
  // Also check with AudioContext
  try {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    const source = actx.createMediaElementSource(v);
    document.title = JSON.stringify({
      duration: v.duration,
      width: v.videoWidth,
      height: v.videoHeight,
      hasAudioChannelCount: actx.destination.channelCount,
      readyState: v.readyState
    });
  } catch (err) {
    document.title = JSON.stringify({
      duration: v.duration,
      width: v.videoWidth,
      height: v.videoHeight,
      audioError: err.message
    });
  }
});
</script>
</body>
</html>`;

const tempHtml = path.resolve('temp-video-details.html');
fs.writeFileSync(tempHtml, html, 'utf8');

try {
  const dom = execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--virtual-time-budget=4000',
    '--dump-dom',
    `file:///${tempHtml.replace(/\\/g, '/')}`
  ], { encoding: 'utf8' });

  const match = dom.match(/<title>(.*?)<\/title>/);
  console.log('Video Audio Info:', match ? match[1] : 'No title');
} finally {
  if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
}
