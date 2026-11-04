const puppeteer = require('puppeteer-core');
const site = process.argv[2] || 'A', W = +(process.argv[3] || 1440);
const URL = site === 'A' ? 'https://www.assistantly.com/' : 'http://127.0.0.1:3000/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: W, height: 900 });
  await p.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await p.evaluate(() => document.querySelector('#ready').scrollIntoView()); await sleep(1500);
  const state = () => p.evaluate(() => {
    const tabs = [...document.querySelectorAll('#ready [role=tab]')];
    const panels = [...document.querySelectorAll('#ready [role=tabpanel]')];
    const vp = panels.find(x => !x.hidden);
    const cs = vp && getComputedStyle(vp);
    return { sel: tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'), ti: tabs.map(t => t.tabIndex).join(''), focus: tabs.indexOf(document.activeElement),
      vis: panels.indexOf(vp), cls: vp && vp.className, op: cs && cs.opacity, tf: cs && cs.transform, scale: cs && cs.scale, mb: vp && vp.style.marginBottom, segmb: document.querySelector('#ready .seg').style.marginBottom,
      pcin: vp && [...vp.querySelectorAll('.pc2')].map(c => c.classList.contains('in') ? 1 : 0).join('') };
  });
  console.log('initial', JSON.stringify(await state()));
  await p.click('#ready [role=tab]:nth-child(2)'); await sleep(60); console.log('click2 +60ms', JSON.stringify(await state()));
  await sleep(1200); console.log('click2 +1.2s', JSON.stringify(await state()));
  await p.keyboard.press('ArrowRight'); await sleep(100); console.log('ArrowRight', JSON.stringify(await state()));
  await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); await sleep(100); console.log('Left x3 (wrap)', JSON.stringify(await state()));
  await p.keyboard.press('Home'); await sleep(100); console.log('Home', JSON.stringify(await state()));
  await b.close();
})();
