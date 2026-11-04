const puppeteer = require('puppeteer-core');
(async () => { const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
 const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
 await p.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2' }); await new Promise(r=>setTimeout(r,2000));
 console.log(await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > 391 && r.width>0 && getComputedStyle(e).position!=='fixed'; }).slice(0,12).map(e => (e.closest('section,footer,header')?.className||'') + ' :: ' + e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right))));
 await b.close(); })();
