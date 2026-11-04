// Horizontal-overflow sweep: both sites, many widths, at load and after a full scroll.  node sweep.js
const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const W = [320, 360, 390, 414, 480, 600, 700, 768, 820, 900, 1024, 1180, 1440];
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 300000 });
  for (const [name, url] of [...(process.env.ONLY_B ? [] : [['A', 'https://www.assistantly.com/']]), ['B', process.env.B_URL || 'http://127.0.0.1:3000/']]) {
    const row = [];
    for (const w of W) {
      const p = await b.newPage(); await p.setViewport({ width: w, height: 900 });
      await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
      const m = () => p.evaluate(() => { const sw = document.documentElement.scrollWidth - innerWidth; if (sw <= 0) return 0;
        const e = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).filter(e => { let a = e.parentElement; while (a && a !== document.body) { if (getComputedStyle(a).overflowX !== 'visible') return false; a = a.parentElement; } return true; });
        return sw + '(' + (e[0] ? e[0].tagName + '.' + e[0].getAttribute('class') : '?') + ')'; });
      const load = await m();
      const H = await p.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < H; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await sleep(120); }
      await sleep(1500); const end = await m();
      row.push(`${w}:${load}/${end}`); await p.close();
    }
    console.log(name, row.join('  '));
  }
  await b.close();
})();
