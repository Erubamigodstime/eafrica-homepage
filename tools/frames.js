// Records painted frames via CDP screencast during load + scripted scroll; tiles into contact sheets.
// usage: node frames.js <url> <outdir>
const puppeteer = require('puppeteer-core');
const fs = require('fs'); const path = require('path');
const [url, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 180000, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const cdp = await page.createCDPSession();
  const frames = []; let label = 'load'; const t0 = Date.now();
  cdp.on('Page.screencastFrame', async f => {
    frames.push({ label: `${label} t=${Date.now() - t0}ms`, b64: f.data });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 55, maxWidth: 1440, maxHeight: 900, everyNthFrame: 3 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
  await sleep(2500);
  const targets = [700, 1500, 2200, 2900, 3300, 4700, 7100, 8000, 9000, 10100];
  for (const y of targets) {
    label = `y=${y}`;
    // smooth wheel-like scroll toward target over ~600ms
    await page.evaluate(async y => { const s = scrollY, d = y - s; for (let i = 1; i <= 20; i++) { scrollTo(0, s + d * i / 20); await new Promise(r => setTimeout(r, 30)); } }, y);
    await sleep(1800);
  }
  await cdp.send('Page.stopScreencast');
  // keep frames evenly sampled per label (max 6 each)
  const by = {}; for (const f of frames) { const k = f.label.split(' ')[0]; (by[k] = by[k] || []).push(f); }
  const picked = [];
  for (const k in by) { const a = by[k]; const n = Math.min(6, a.length); for (let i = 0; i < n; i++) picked.push(a[Math.floor(i * (a.length - 1) / Math.max(1, n - 1))]); }
  for (let p = 0; p * 6 < picked.length; p++) {
    const chunk = picked.slice(p * 6, p * 6 + 6);
    const html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(2,720px);gap:4px;font:14px sans-serif;color:#ff0">` +
      chunk.map(s => `<div><div>${s.label}</div><img width=720 src="data:image/jpeg;base64,${s.b64}"></div>`).join('') + '</body>';
    const sp = await browser.newPage(); await sp.setViewport({ width: 1444, height: 900 });
    await sp.setContent(html); await sp.screenshot({ path: path.join(out, `sheet_${String(p).padStart(2, '0')}.png`), fullPage: true }); await sp.close();
  }
  console.log('frames', frames.length, 'picked', picked.length, Object.fromEntries(Object.entries(by).map(([k, v]) => [k, v.length])));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
