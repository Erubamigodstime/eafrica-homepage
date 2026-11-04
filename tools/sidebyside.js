// Section-by-section side-by-side: Assistantly (left, live) vs E-Africa Next.js (right), final animated state.
const puppeteer = require('puppeteer-core');
const fs = require('fs'); const path = require('path');
// usage: node sidebyside.js [width] [height] [labelFilterRegex]   e.g. node sidebyside.js 390 844 "Hero|Stats"
const W = +(process.argv[2] || 1440), H = +(process.argv[3] || 900), FILT = process.argv[4] ? new RegExp(process.argv[4], 'i') : null;
const OUT = path.join(__dirname, '..', 'cap', 'sbs', String(W)); fs.mkdirSync(OUT, { recursive: true });
const B_URL = process.env.B_URL || 'http://127.0.0.1:3000/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PAIRS = [ // [label, assistantly selector, ours selector]
  ['01 Hero copy', '.hero > .w', '.hero > .w'], ['02 Hero stage', '.stage', '.stage'], ['03 Stats', '.nums', '.nums'],
  ['04 Logo strip', '.logos2', '.logos2'], ['05 Problem', '.problem', '.problem'], ['06 Bento grid', '.bento', '.bento'],
  ['07 Talent tabs', '#ready', '#ready'], ['08 How it works', 'ol.flow', 'ol.flow'], ['09 Testimonials', '.wpanel', '.wpanel'],
  ['10 Dark CTA + peek', '.pp-tease', '.pp-tease'], ['11 Pricing', '.peq', '.peq'], ['12 FAQ', '.faq', '.faq'],
  ['13 Closer', '.closer', '.closer'], ['14 Footer + peek', 'footer.foot2', 'footer.foot2'],
];
async function grab(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, isMobile: W < 800, hasTouch: W < 800 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate(y => scrollTo(0, y), y); await sleep(450); }
  await sleep(2500); // let footer peek rise
  await page.addStyleTag({ content: 'header,.gnav{visibility:hidden!important}' });
  const out = {};
  for (const [label, a, b] of PAIRS) {
    if (FILT && !FILT.test(label)) continue;
    const sel = url.includes('assistantly') ? a : b;
    const el = await page.$(sel);
    if (!el) { out[label] = null; continue; }
    await el.evaluate(e => e.scrollIntoView({ block: 'center' })); await sleep(250);
    out[label] = await el.screenshot({ encoding: 'base64' });
  }
  await page.close();
  return out;
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 240000, args: ['--hide-scrollbars'] });
  const A = await grab(browser, 'https://www.assistantly.com/');
  const B = await grab(browser, B_URL);
  const sheet = await browser.newPage(); await sheet.setViewport({ width: W < 800 ? 900 : 1500, height: 900 });
  for (const [label] of PAIRS) {
    if (FILT && !FILT.test(label)) continue;
    const cell = (b64, who) => b64 ? `<div><p>${who}</p><img src="data:image/png;base64,${b64}"></div>` : `<div><p>${who}: not found</p></div>`;
    await sheet.setContent(`<style>body{margin:0;background:#222;font:600 18px sans-serif;color:#ff0;padding:8px}h1{font-size:22px;margin:0 0 6px}.r{display:grid;grid-template-columns:1fr 1fr;gap:10px}img{width:100%;display:block;background:#fff}p{margin:0 0 4px}</style>
      <h1>${label}</h1><div class="r">${cell(A[label], 'Assistantly')}${cell(B[label], 'E-Africa (Next.js)')}</div>`);
    await sheet.screenshot({ path: path.join(OUT, `${label.replace(/\W+/g, '_')}.png`), fullPage: true });
  }
  console.log('wrote', fs.readdirSync(OUT).length, 'pairs to', OUT);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
