const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  for (const [k, url] of [['A', 'https://www.assistantly.com/'], ['B', 'http://127.0.0.1:3000/']]) {
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); await sleep(2500);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; const s = document.querySelector('.stage'); scrollTo(0, s.getBoundingClientRect().top + scrollY - 250); });
    const t0 = Date.now(); const rows = [];
    for (let i = 0; i < 26; i++) {
      rows.push(await page.evaluate((t) => { const h = document.querySelector('.hero-uni'), u = h.querySelector('.uni'), c = getComputedStyle(u); return `${t}ms [${h.className.replace('buddy hero-uni solo', '').trim()}] op=${(+c.opacity).toFixed(2)} tf=${c.transform.replace(/matrix\(([^)]*)\)/, (m, a) => a.split(',').map(x => (+x).toFixed(2)).join(','))} anim=${c.animationName} cf=${h.querySelectorAll('.cf i').length}`; }, Date.now() - t0));
      await sleep(120);
    }
    console.log('== ' + k); console.log(rows.filter((r, i) => i % 2 === 0 || i < 12).join('\n'));
    // tilt
    const box = await page.evaluate(() => { const r = document.querySelector('.stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    await sleep(2500);
    await page.mouse.move(box[0] + box[2] * 0.9, box[1] + 60); await sleep(600);
    console.log('tilt @90%:', await page.evaluate(() => { const u = document.querySelector('.hero-uni .uni'); return u.style.getPropertyValue('--rt') + ' tf=' + getComputedStyle(u).transform + ' anim=' + getComputedStyle(u).animationName; }));
    await page.close();
  }
  await browser.close();
})();
