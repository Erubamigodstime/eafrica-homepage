// node shot-top.js <w> <h> <selector> <padTop> <padBottom> [wait]  -> cap/mine/<w>-<sel>-{A,B}.png (viewport-clip around element, incl. overflow)
const puppeteer = require('puppeteer-core'); const path = require('path');
const [W, H, SEL, PT = 150, PB = 100, WAIT = 4500] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars'] });
  for (const [k, url] of [['A', 'https://www.assistantly.com/'], ['B', 'http://127.0.0.1:3000/']]) {
    const page = await browser.newPage();
    await page.setViewport({ width: +W, height: +H, isMobile: +W < 800, hasTouch: +W < 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
    await page.evaluate(s => { const e = document.querySelector(s); document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, e.getBoundingClientRect().top + scrollY - 160); }, SEL);
    await sleep(+WAIT);
    const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: 0, y: b.top + scrollY, w: innerWidth, h: b.height, sy: scrollY }; }, SEL);
    const y = Math.max(0, r.y - +PT); const hh = r.h + +PT + +PB;
    await page.screenshot({ path: path.join(__dirname, '..', 'cap', 'mine', `${W}-${SEL.replace(/\W/g, '')}-${k}.png`), captureBeyondViewport: false });
    await page.close();
  }
  await browser.close();
})();
