// usage: node capture.js <url> <outdir>
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const [url, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  // hero animation frames
  for (let i = 0; i < 8; i++) {
    await page.screenshot({ path: path.join(out, `hero_${i}.png`) });
    await sleep(600);
  }
  // scroll through viewport by viewport, screenshot each (captures scroll-triggered states)
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  let n = 0;
  for (let y = 0; y < h; y += 800) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await sleep(900);
    await page.screenshot({ path: path.join(out, `scroll_${String(n++).padStart(2, '0')}.png`) });
  }
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
  fs.writeFileSync(path.join(out, 'rendered.html'), await page.content());
  fs.writeFileSync(path.join(out, 'text.txt'), await page.evaluate(() => document.body.innerText));
  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.width, h: i.height }));
    const cs = e => { const s = getComputedStyle(e); return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, color: s.color, bg: s.backgroundColor }; };
    const pick = sel => [...document.querySelectorAll(sel)].slice(0, 4).map(e => ({ sel, text: e.innerText.slice(0, 80), ...cs(e) }));
    return { imgs, styles: [...pick('h1'), ...pick('h2'), ...pick('h3'), ...pick('p'), ...pick('a.btn, button, [class*=button]'), ...pick('body'), ...pick('header, nav')] };
  });
  fs.writeFileSync(path.join(out, 'info.json'), JSON.stringify(info, null, 1));
  console.log('height', h, 'shots', n);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
