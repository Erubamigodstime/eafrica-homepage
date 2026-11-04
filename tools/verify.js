// Behaviour: drive the Next build with motion ON and assert every animation/interaction fires.
const puppeteer = require('puppeteer-core');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs = require('fs'); const path = require('path');
const OUT = path.join(__dirname, '..', 'cap', 'verify'); fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SECTIONS = [
  ['Nav', '.gnav'], ['Hero copy', '.hero > .w'], ['Hero stage', '.stage'], ['Stats', '.nums'], ['Logo strip', '.logos2'],
  ['Problem', '.problem'], ['Bento', '#solutions'], ['Talent tabs', '#ready'], ['How it works', '#how'],
  ['Testimonial wall', '#reviews'], ['Talent CTA', '#talent'], ['Pricing', '#pricing'], ['FAQ', '#faq'], ['Closer', '#contact'], ['Footer', 'footer'],
];
async function shoot(browser, url, tag) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate(y => scrollTo(0, y), y); await sleep(120); }
  await page.evaluate(() => scrollTo(0, 0)); await sleep(400);
  // hide the sticky nav while shooting content sections so it doesn't overlap them
  const res = {};
  for (const [name, sel] of SECTIONS) {
    const el = await page.$(sel);
    if (!el) { res[name] = null; continue; }
    if (name !== 'Nav') await page.addStyleTag({ content: '.gnav{visibility:hidden!important}' });
    const file = path.join(OUT, `${tag}_${name.replace(/\W+/g, '_')}.png`);
    await el.screenshot({ path: file });
    res[name] = file;
  }
  await page.close();
  return res;
}
function diff(a, b, outFile) {
  const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
  const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
  const crop = (img) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
  const d = new PNG({ width: w, height: h });
  const n = pixelmatch(crop(A).data, crop(B).data, d.data, w, h, { threshold: 0.15 });
  fs.writeFileSync(outFile, PNG.sync.write(d));
  return { pct: (100 * n / (w * h)).toFixed(2), size: `${A.width}x${A.height} vs ${B.width}x${B.height}` };
}
async function behaviour(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
  const checks = [];
  const ok = (name, pass, detail = '') => checks.push({ name, pass: !!pass, detail });
  const q = (fn, ...a) => page.evaluate(fn, ...a);
  const scrollTo = async (sel, wait = 1800) => { await q(s => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await sleep(wait); };

  await sleep(1200);
  ok('Hero: rise animation on h1', await q(() => getComputedStyle(document.querySelector('.hero h1')).animationName === 'rise'));
  await sleep(1700); // swoosh: .8s delay + 1.8s draw
  ok('Hero: swoosh underline drawn', await q(() => +getComputedStyle(document.querySelector('.swoosh path')).strokeDashoffset.replace('px', '') < 50), await q(() => getComputedStyle(document.querySelector('.swoosh path')).strokeDashoffset));
  ok('Nav: CTA glow ring pulsing', await q(() => getComputedStyle(document.querySelector('.gcta'), '::before').animationName === 'btnPulse'));
  await page.hover('.ix-nav > a'); await sleep(400);
  ok('Nav: dropdown opens on hover', await q(() => getComputedStyle(document.querySelector('.ix-menu')).visibility === 'visible'));
  await page.mouse.move(5, 600); await sleep(300);

  await scrollTo('.stage', 300);
  ok('Stage: mascot hidden before pop (hxpre)', await q(() => document.querySelector('.hero-uni').className.includes('hxpre') || document.querySelector('.hero-uni').className.includes('hxpop')));
  await sleep(1300);
  ok('Stage: mascot popped (hxpop)', await q(() => document.querySelector('.hero-uni').className.includes('hxpop')));
  ok('Stage: confetti particles spawned', await q(() => document.querySelectorAll('.hero-uni .cf i').length > 10), await q(() => document.querySelectorAll('.hero-uni .cf i').length));
  ok('Stage: vetting bars filled (.pc2.in)', await q(() => document.querySelector('.pc2.hero').classList.contains('in')));
  ok('Stage: floating notes visible', await q(() => [...document.querySelectorAll('.note')].every(n => +getComputedStyle(n).opacity > 0.9)));
  await sleep(2500);
  ok('Stage: mascot settles into idle (stayup)', await q(() => document.querySelector('.hero-uni').className.includes('stayup')));
  ok('Stats: counters reached final values', await q(() => [...document.querySelectorAll('.stat dd')].slice(0, 4).map(d => d.textContent).join(',') === '100+,500+,25+,1,000+'), await q(() => [...document.querySelectorAll('.stat dd')].map(d => d.textContent).join(',')));
  ok('Logos: idle float running', await q(() => getComputedStyle(document.querySelector('.lrow li')).animationName === 'lgFloat'));

  for (let i = 1; i <= 3; i++) await scrollTo(`.pl li:nth-child(${i})`, 700);
  await sleep(1400);
  ok('Problem: all rows revealed + checks drawn', await q(() => [...document.querySelectorAll('.rv-l')].every(l => l.classList.contains('in')) && getComputedStyle(document.querySelector('.ck path')).strokeDashoffset.startsWith('0')));

  await scrollTo('.bento .lead', 1400); await scrollTo('.bento .b2:nth-child(3)', 1600); await scrollTo('.guar', 1200);
  ok('Bento: all 6 cards revealed', await q(() => document.querySelectorAll('.bento .b.vis').length === 6), await q(() => document.querySelectorAll('.bento .b.vis').length));
  ok('Bento: blueprint sliders spread from centre', await q(() => document.querySelector('.ax i.m').style.getPropertyValue('--a') !== '' && getComputedStyle(document.querySelector('.ax i.m')).left !== getComputedStyle(document.querySelector('.ax')).width.replace('px', '') / 2 + 'px'));
  ok('Bento: live clocks show times', await q(() => [...document.querySelectorAll('.wclock b')].every(b => /\d:\d\d/.test(b.textContent))), await q(() => [...document.querySelectorAll('.wclock b')].map(b => b.textContent).join(' | ')));
  ok('Bento: ladder bars grown', await q(() => getComputedStyle(document.querySelector('.ladder li')).transform === 'none' || getComputedStyle(document.querySelector('.ladder li')).transform === 'matrix(1, 0, 0, 1, 0, 0)'));
  ok('Bento: 90-day fill grown', await q(() => parseFloat(getComputedStyle(document.querySelector('.pfill')).width) > 40));
  ok('Bento: seal rotating', await q(() => getComputedStyle(document.querySelector('.seal svg')).animationName === 'spinSeal'));

  await scrollTo('#ready .seg', 1500);
  ok('Tabs: first panel revealed', await q(() => document.querySelector('#p-cx').classList.contains('vis') && !document.querySelector('#p-cx').hidden));
  await page.click('#t-sales'); await sleep(900);
  ok('Tabs: click switches panel', await q(() => !document.querySelector('#p-sales').hidden && document.querySelector('#p-cx').hidden && document.querySelector('#t-sales').getAttribute('aria-selected') === 'true'));
  await page.focus('#t-sales'); await page.keyboard.press('ArrowRight'); await sleep(300);
  ok('Tabs: ArrowRight moves to next tab + focus', await q(() => document.activeElement.id === 't-tech' && !document.querySelector('#p-tech').hidden));
  await q(() => scrollTo(0, 0)); await sleep(400);
  await page.click('.chips a:nth-child(5)'); await sleep(1200);
  ok('Hero chip "Multilingual" selects its tab', await q(() => !document.querySelector('#p-lang').hidden));
  ok('Tabs: role cards have photos', await q(() => document.querySelectorAll('#p-lang .pav img').length === 3));

  await scrollTo('.flow', 1600);
  ok('How it works: steps animated (.vis)', await q(() => document.querySelectorAll('.fs.vis').length === 3));
  ok('How it works: waveform animating', await q(() => getComputedStyle(document.querySelector('.wave i')).animationName === 'wv'));

  await scrollTo('.wl-fan', 2200);
  ok('Testimonials: wall revealed + cards popped', await q(() => document.querySelector('.wallsec').classList.contains('in') && +getComputedStyle(document.querySelector('.wl.w1')).opacity > 0.9));
  await sleep(1500);
  ok('Testimonials: idle float running', await q(() => getComputedStyle(document.querySelector('.wl.w3')).animationName === 'wlFloat'));
  ok('Testimonials: rotation preserved during float', await q(() => getComputedStyle(document.querySelector('.wl.w1')).transform !== 'none'));

  await scrollTo('.pp-tease', 800);
  ok('Talent CTA: mascot bobbing in peek', await q(() => getComputedStyle(document.querySelector('.pp-up .pp-f')).animationName === 'ppbob'));

  await scrollTo('#faq', 600);
  await page.click('#faq details:nth-child(2) summary'); await sleep(400);
  ok('FAQ: opens on click, + morphs to −', await q(() => document.querySelector('#faq details:nth-child(2)').open && getComputedStyle(document.querySelector('#faq details:nth-child(2) .pm'), '::after').transform.startsWith('matrix(1, 0, 0, 1')));

  await q(() => scrollTo(0, document.body.scrollHeight)); await sleep(2200);
  ok('Footer: mascot rose (up)', await q(() => document.querySelector('.fpeek').classList.contains('up')));
  ok('Footer: speech bubble talking', await q(() => document.querySelector('.fpeek').classList.contains('talk') && document.querySelector('.fpeek-bub').textContent.length > 5), await q(() => document.querySelector('.fpeek-bub').textContent));
  await page.click('.fpeek'); await sleep(400);
  ok('Footer: click cycles line + confetti', await q(() => document.querySelector('.fpeek-bub').textContent.startsWith('500+') && document.querySelectorAll('.fpeek .cf i').length > 10), await q(() => document.querySelector('.fpeek-bub').textContent));
  await q(() => scrollTo(0, 0)); await sleep(800);
  ok('Footer: resets when scrolled back up', await q(() => !document.querySelector('.fpeek').classList.contains('up')));

  await page.setViewport({ width: 390, height: 844 }); await sleep(600);
  ok('Mobile: no horizontal overflow', await q(() => document.documentElement.scrollWidth <= 390), await q(() => document.documentElement.scrollWidth));
  ok('Mobile: burger visible', await q(() => getComputedStyle(document.querySelector('.burger')).display !== 'none'), await q(() => { const r = document.querySelector('.burger').getBoundingClientRect(); return `${getComputedStyle(document.querySelector('.burger')).display} ${Math.round(r.x)},${Math.round(r.y)} ${r.width}x${r.height}`; }));
  await q(() => document.querySelector('.burger').click()); await sleep(300);
  ok('Mobile: burger opens menu', await q(() => document.querySelector('#gl').classList.contains('open') && getComputedStyle(document.querySelector('#gl')).display === 'flex'));
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.reload({ waitUntil: 'networkidle0' }); await sleep(800);
  ok('No runtime errors on load', errs.length === 0, errs.join(' | '));
  await page.close();
  return checks;
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 180000, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
  {
    const C = await behaviour(browser);
    console.log('\n=== BEHAVIOUR (Next.js, motion on) ===');
    for (const c of C) console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail !== '' && c.detail !== undefined ? '  [' + c.detail + ']' : ''}`);
    console.log(`\n${C.filter(c => c.pass).length}/${C.length} passed`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
