import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const PORT = 4322;
const DIST = path.resolve('dist');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

// 1. Start Static Local Server
const server = http.createServer((req, res) => {
  let reqPath = req.url?.split('?')[0] || '/';
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/styleguide') reqPath = '/styleguide/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  if (!path.extname(reqPath)) reqPath += '/index.html';

  const cleanSubPath = reqPath.replace(/^\/+/, '');
  const filePath = path.join(DIST, cleanSubPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log(`✓ Local test server running on http://127.0.0.1:${PORT}`);

try {
  // 2. Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });
  console.log(`✓ Headless Chrome launched on port ${chrome.port}`);

  const targetUrl = `http://127.0.0.1:${PORT}/en/`;

  // --- Run Mobile Audit ---
  console.log('\nRunning Lighthouse Mobile Audit on /en/...');
  const mobileResult = await lighthouse(targetUrl, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
  }, {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false,
      },
      throttlingMethod: 'simulate',
    },
  });

  // --- Run Desktop Audit ---
  console.log('Running Lighthouse Desktop Audit on /en/...');
  const desktopResult = await lighthouse(targetUrl, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
  }, {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      throttlingMethod: 'simulate',
    },
  });

  chrome.kill();

  const mCat = mobileResult.lhr.categories;
  const mAud = mobileResult.lhr.audits;

  const dCat = desktopResult.lhr.categories;
  const dAud = desktopResult.lhr.audits;

  const report = {
    mobile: {
      scores: {
        performance: Math.round(mCat.performance.score * 100),
        accessibility: Math.round(mCat.accessibility.score * 100),
        bestPractices: Math.round(mCat['best-practices'].score * 100),
        seo: Math.round(mCat.seo.score * 100),
      },
      metrics: {
        fcp: mAud['first-contentful-paint']?.displayValue,
        lcp: mAud['largest-contentful-paint']?.displayValue,
        tbt: mAud['total-blocking-time']?.displayValue,
        cls: mAud['cumulative-layout-shift']?.displayValue,
        speedIndex: mAud['speed-index']?.displayValue,
      },
    },
    desktop: {
      scores: {
        performance: Math.round(dCat.performance.score * 100),
        accessibility: Math.round(dCat.accessibility.score * 100),
        bestPractices: Math.round(dCat['best-practices'].score * 100),
        seo: Math.round(dCat.seo.score * 100),
      },
      metrics: {
        fcp: dAud['first-contentful-paint']?.displayValue,
        lcp: dAud['largest-contentful-paint']?.displayValue,
        tbt: dAud['total-blocking-time']?.displayValue,
        cls: dAud['cumulative-layout-shift']?.displayValue,
        speedIndex: dAud['speed-index']?.displayValue,
      },
    },
  };

  console.log('\n========================================');
  console.log('LIGHTHOUSE AUDIT RESULTS');
  console.log('========================================');
  console.log(JSON.stringify(report, null, 2));

  fs.writeFileSync(
    path.resolve('docs/lighthouse-audit.json'),
    JSON.stringify(report, null, 2),
    'utf8'
  );

} finally {
  server.close();
  console.log('✓ Test server closed.');
}
