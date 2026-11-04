// hover probe: node mid/hover.js [A|B] [width]
const puppeteer = require('puppeteer-core');
const site = process.argv[2] || 'A', W = +(process.argv[3] || 1440);
const URL = site === 'A' ? 'https://www.assistantly.com/' : 'http://127.0.0.1:3000/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TARGETS = [
  ['bento .b[0]', '.bento .b', ['transform', 'box-shadow', 'transition']],
  ['bento .b[2]', '.bento .b:nth-child(3)', ['transform', 'box-shadow', 'transition']],
  ['guar', '.bento .guar', ['transform', 'box-shadow']],
  ['pc2.snip', '#ready .cards3:not([hidden]) .pc2', ['transform', 'box-shadow', 'transition']],
  ['seg btn[1]', '#ready .seg button:nth-child(2)', ['background-color', 'box-shadow', 'transform']],
  ['seg btn[0] sel', '#ready .seg button:nth-child(1)', ['background-color', 'box-shadow']],
  ['fs[0] .fv', 'ol.flow li:nth-child(1)', ['@.fv:transform', '@.fv:box-shadow']],
  ['fs[1] img1', 'ol.flow li:nth-child(2)', ['@.fv img:nth-child(1),.fv .av:nth-child(1):transform', '@.fv img:nth-child(2),.fv .av:nth-child(2):transform']],
  ['more', 'ol.flow + p a.more', ['@.mt:text-decoration-line', '@.ma,span:last-child:transform']],
  ['problem li', '.pl li', ['transform', 'opacity']],
];
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars'] });
  const p = await b.newPage(); await p.setViewport({ width: W, height: 900 });
  await p.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await sleep(250); }
  await sleep(1500);
  const read = (sel, props) => p.evaluate((sel, props) => { const e = document.querySelector(sel); if (!e) return 'MISSING';
    return props.map(pr => { let el = e, name = pr; if (pr[0] === '@') { const [s, n] = pr.slice(1).split(/:(?=[a-z-]+$)/); el = e.querySelector(s); name = n; if (!el) return pr + '=MISSING'; }
      return name + '=' + getComputedStyle(el).getPropertyValue(name); }).join(' | '); }, sel, props);
  for (const [label, sel, props] of TARGETS) {
    const el = await p.$(sel); if (!el) { console.log(label, 'MISSING'); continue; }
    await el.evaluate(e => e.scrollIntoView({ block: 'center' })); await p.mouse.move(2, 2); await sleep(900);
    const before = await read(sel, props);
    await el.hover(); await sleep(1300);
    const after = await read(sel, props);
    console.log(`${label}\n  rest : ${before}\n  hover: ${after}`);
  }
  await b.close();
})();
