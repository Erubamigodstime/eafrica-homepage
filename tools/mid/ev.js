const puppeteer = require('puppeteer-core');
(async () => { const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
 const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
 await p.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2' });
 await p.evaluate(() => window.dispatchEvent(new CustomEvent('eafrica:select-tab', { detail: 'lang' }))); await new Promise(r=>setTimeout(r,500));
 console.log(await p.evaluate(() => ({ lang: !document.querySelector('#p-lang').hidden, imgs: document.querySelectorAll('#p-lang .pav img').length, chips: document.querySelectorAll('.chip').length })));
 await b.close(); })();
