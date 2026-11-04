const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars'] });
  for (const url of ['https://www.assistantly.com/', 'http://127.0.0.1:3000/']) {
    const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
    await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
    const r = await p.evaluate(() => {
      const out = [];
      const vis = e => { const s = getComputedStyle(e); return s.display !== 'none' && e.getBoundingClientRect().height > 0; };
      const walk = (el, d) => { for (const c of el.children) { if (!vis(c) || ['SCRIPT','STYLE','LINK'].includes(c.tagName)) continue;
        const r = c.getBoundingClientRect(); const cls = (c.className && c.className.baseVal === undefined ? c.className : '').trim().split(/\s+/).slice(0,4).join('.');
        out.push(' '.repeat(d*2) + c.tagName.toLowerCase() + (c.id ? '#' + c.id : '') + (cls ? '.' + cls : '') + `  y=${Math.round(r.top+scrollY)} h=${Math.round(r.height)}`);
        if (d < 2 && !['SVG','svg'].includes(c.tagName)) walk(c, d + 1); } };
      walk(document.body, 0); return out.join('\n') + `\nTOTAL ${document.body.scrollHeight}`;
    });
    console.log('\n#### ' + url + '\n' + r); await p.close();
  }
  await b.close();
})();
