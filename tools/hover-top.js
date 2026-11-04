// Compare hover deltas (computed style before/after page.hover) on A vs B for top-of-page elements.
const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const T = [ // [label, hoverSel, [inspectSel, props, pseudo?]...]
  ['nav link', '.gl > a:not(.si)', [['.gl > a:not(.si)', 'opacity,text-decoration-line,color']]],
  ['dropdown', '.ix-nav > a', [['.ix-menu', 'opacity,visibility,translate'], ['.ix-nav > a', 'opacity']]],
  ['dropdown item', '.ix-menu a', [['.ix-menu a', 'background-color']]],
  ['nav cta', '.gcta', [['.gcta', 'transform,box-shadow,filter'], ['.gcta', 'background-position', '::after']]],
  ['si-top', '.si-top', [['.si-top', 'opacity']]],
  ['chip', '.chips a', [['.chips a', 'transform,box-shadow,background-color,border-color']]],
  ['hero btn', '.hero .ctas .btn', [['.hero .ctas .btn', 'transform,box-shadow'], ['.hero .ctas .btn > span', 'transform'], ['.hero .ctas .btn', 'background-position', '::after']]],
  ['stat', '.nums .stat', [['.nums .stat', 'transform,box-shadow,border-color'], ['.nums .stat dd', 'transform,color']]],
  ['logo', '.lrow li', [['.lrow li .lg', 'transform,background-color,color'], ['.lrow li', 'animation-play-state']]],
  ['card', '.stage .pc2', [['.stage .pc2', 'transform,box-shadow']]],
  ['level pill', '.stage .bars li', [['.stage .bars em.lv', 'transform']]],
  ['note', '.note', [['.note', 'transform,box-shadow']]],
];
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const res = {};
  for (const [k, url] of [['A', 'https://www.assistantly.com/'], ['B', 'http://127.0.0.1:3000/']]) {
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); await sleep(3500);
    await page.evaluate(() => document.documentElement.style.scrollBehavior = 'auto');
    for (const [label, hs, ins] of T) {
      const get = () => page.evaluate((ins) => ins.map(([s, p, ps]) => { const e = document.querySelector(s); if (!e) return 'MISSING ' + s; const c = getComputedStyle(e, ps || null); return s + (ps || '') + ' ' + p.split(',').map(x => x + '=' + c.getPropertyValue(x)).join('; '); }), ins);
      try {
        await page.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); if (r.top < 120 || r.bottom > innerHeight) scrollTo(0, r.top + scrollY - 300); }, hs);
        await page.mouse.move(2, 890); await sleep(700);
        const before = await get(); await page.hover(hs); await sleep(900); const after = await get();
        res[label] = res[label] || {}; res[label][k] = before.map((b, i) => b === after[i] ? '(no change) ' + b : 'BEFORE ' + b + '\n        AFTER  ' + after[i]);
      } catch (e) { res[label] = res[label] || {}; res[label][k] = ['ERR ' + e.message]; }
    }
    await page.close();
  }
  for (const [l, v] of Object.entries(res)) { console.log('## ' + l); for (const k of ['A', 'B']) for (const x of (v[k] || [])) console.log('  ' + k + ' ' + x); }
  await browser.close();
})();
