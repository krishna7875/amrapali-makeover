import fs from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import http from 'node:http';

const PORT = 4324;
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

const server = http.createServer((req, res) => {
  let reqPath = req.url?.split('?')[0] || '/';
  if (reqPath === '/') reqPath = '/index.html';
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

try {
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });

  console.log('Running Lighthouse Accessibility & SEO deep audit...');
  const result = await lighthouse(`http://127.0.0.1:${PORT}/en/`, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['accessibility'],
  });

  chrome.kill();

  const a11yCategory = result.lhr.categories.accessibility;
  const audits = result.lhr.audits;

  const passed = [];
  const failed = [];
  const notApplicable = [];

  for (const ref of a11yCategory.auditRefs) {
    const audit = audits[ref.id];
    if (!audit) continue;
    if (audit.score === 1) {
      passed.push({ id: ref.id, title: audit.title });
    } else if (audit.score === 0) {
      failed.push({
        id: ref.id,
        title: audit.title,
        description: audit.description,
        explanation: audit.explanation,
        details: audit.details?.items?.map(i => i.node?.snippet || i.node?.selector)
      });
    } else {
      notApplicable.push({ id: ref.id, title: audit.title });
    }
  }

  const output = {
    score: Math.round(a11yCategory.score * 100),
    totalAudits: a11yCategory.auditRefs.length,
    passedCount: passed.length,
    failedCount: failed.length,
    notApplicableCount: notApplicable.length,
    failedAudits: failed,
    passedAudits: passed.map(p => p.id),
  };

  console.log(JSON.stringify(output, null, 2));
  fs.writeFileSync('docs/lighthouse-a11y-details.json', JSON.stringify(output, null, 2), 'utf8');

} finally {
  server.close();
}
