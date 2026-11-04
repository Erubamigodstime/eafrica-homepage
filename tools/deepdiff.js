// Deep structural/style/motion diff: Assistantly (live) vs ours (:3000).
// flags: --vp=desk,mob --site=A,B --sections=nav,heroCopy --out=file.md  (B_URL env overrides ours)
// node deepdiff.js collect [vpName...]   -> cap/deep/<vp>/<site>.json
// node deepdiff.js report                -> cap/deep/report.md
const puppeteer = require('puppeteer-core');
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..', 'cap', 'deep');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITES = { A: 'https://www.assistantly.com/', B: process.env.B_URL || 'http://127.0.0.1:3000/' };
const VPS = { desk: [1440, 900], lap: [1280, 800], tab: [1024, 768], tabp: [768, 1024], mob: [390, 844] };
// section label -> selector evaluated in page (closest section of an inner marker where needed)
const SECTIONS = [
  ['nav', 'header.gnav'], ['heroCopy', '.hero > .w'], ['stage', '.stage'], ['nums', '.nums'], ['logos', '.logos2'],
  ['problem', 'section.problem'], ['bento', '@.bento'], ['tabs', '#ready'], ['how', '@ol.flow'], ['wall', 'section.wallsec'],
  ['tease', 'section.pp-tease'], ['pricing', '@.peq'], ['faq', '@.faq'], ['closer', 'section.closer'], ['footer', 'footer.foot2'],
];
const PROPS = ['display', 'position', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'text-align',
  'white-space', 'color', 'background-color', 'background-image', 'border-top-width', 'border-top-style', 'border-top-color', 'border-bottom-width',
  'border-radius', 'box-shadow', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-bottom', 'gap',
  'grid-template-columns', 'flex-direction', 'justify-content', 'align-items', 'max-width', 'opacity', 'transform', 'filter', 'backdrop-filter',
  'z-index', 'overflow', 'transition', 'animation', 'cursor', 'object-fit', 'text-decoration-line'];

// in-page instrumentation, installed before any site script
const INSTR = (SECTIONS, PROPS) => {
  const keyOf = new WeakMap();
  const sig = e => e.tagName.toLowerCase() + ((typeof e.className === 'string' && e.className.trim()) ? '.' + e.className.trim().split(/\s+/)[0] : (e.getAttribute && e.getAttribute('class') ? '.' + e.getAttribute('class').trim().split(/\s+/)[0] : ''));
  const roots = () => SECTIONS.map(([l, s]) => { const el = s[0] === '@' ? (document.querySelector(s.slice(1)) || {}).closest?.('section') : document.querySelector(s); return [l, el]; });
  let R = null;
  window.__key = e => {
    if (keyOf.has(e)) return keyOf.get(e);
    R = R && R.every(([, r]) => r && r.isConnected) ? R : roots();
    // innermost section root containing e (stage is inside hero etc.)
    let best = null; for (const [l, r] of R) if (r && r.contains(e) && (!best || best[1].contains(r))) best = [l, r];
    if (!best) return null;
    const parts = []; let n = e;
    while (n && n !== best[1]) { const s = sig(n); let i = 0, p = n; while ((p = p.previousElementSibling)) if (sig(p) === s) i++; parts.unshift(s + (i ? '[' + i + ']' : '')); n = n.parentElement; }
    const k = best[0] + ' > ' + (parts.join(' > ') || ':root');
    keyOf.set(e, k); return k;
  };
  window.__T0 = performance.now(); window.__log = [];
  const vpFrac = e => { const r = e.getBoundingClientRect(); return +((r.top) / innerHeight).toFixed(3); };
  const rec = (type, e, extra) => { try { const k = window.__key(e); if (k) window.__log.push({ type, k, t: Math.round(performance.now() - window.__T0), sy: Math.round(scrollY), f: vpFrac(e), ...extra }); } catch (_) {} };
  document.addEventListener('animationstart', ev => { const s = getComputedStyle(ev.target, ev.pseudoElement || null);
    rec('anim', ev.target, { name: ev.animationName, pseudo: ev.pseudoElement || '', dur: s.animationDuration, delay: s.animationDelay, ease: s.animationTimingFunction, iter: s.animationIterationCount, dir: s.animationDirection, fill: s.animationFillMode }); }, true);
  document.addEventListener('transitionrun', ev => { const s = getComputedStyle(ev.target, ev.pseudoElement || null);
    rec('trans', ev.target, { prop: ev.propertyName, pseudo: ev.pseudoElement || '', tr: s.transition.slice(0, 400) }); }, true);
  new MutationObserver(ms => { for (const m of ms) { if (m.type !== 'attributes' || !(m.target instanceof Element)) continue;
    const now = m.target.getAttribute('class') || ''; const old = (m.oldValue || '').split(/\s+/).filter(Boolean);
    const added = now.split(/\s+/).filter(c => c && !old.includes(c)); const removed = old.filter(c => !now.split(/\s+/).includes(c));
    if (added.length || removed.length) rec('cls', m.target, { add: added.join(' '), rm: removed.join(' ') }); } })
    .observe(document, { attributes: true, attributeFilter: ['class'], attributeOldValue: true, subtree: true });
  window.__snap = (mode) => { // mode 'init' => only motion-ish props
    const out = {}; const P = mode === 'init' ? ['opacity', 'transform', 'filter', 'clip-path', 'visibility', 'stroke-dashoffset', 'width', 'scale', 'translate'] : PROPS;
    for (const [l, r] of roots()) { if (!r) { out[l] = null; continue; }
      const rr = r.getBoundingClientRect(); const els = [r, ...r.querySelectorAll('*')].slice(0, 900);
      out[l] = { box: [Math.round(rr.width), Math.round(rr.height)], els: {} };
      for (const e of els) { if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue; const k = window.__key(e); if (!k) continue;
        const s = getComputedStyle(e); if (s.display === 'none' && mode !== 'init') { out[l].els[k] = { hidden: 1 }; continue; }
        const b = e.getBoundingClientRect(); const o = { x: Math.round(b.left - rr.left), y: Math.round(b.top - rr.top), w: Math.round(b.width), h: Math.round(b.height) };
        for (const p of P) o[p] = s.getPropertyValue(p);
        if (mode !== 'init') { const bf = getComputedStyle(e, '::before'), af = getComputedStyle(e, '::after');
          if (bf.content !== 'none' && bf.content !== 'normal') o['::before'] = [bf.content.slice(0, 20), bf.width, bf.height, bf.backgroundColor, bf.backgroundImage.slice(0, 120), bf.borderRadius, bf.animationName, bf.transform].join(' | ');
          if (af.content !== 'none' && af.content !== 'normal') o['::after'] = [af.content.slice(0, 20), af.width, af.height, af.backgroundColor, af.backgroundImage.slice(0, 120), af.borderRadius, af.animationName, af.transform].join(' | ');
          o.txt = (e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) ? 1 : 0; }
        out[l].els[k] = o; } }
    return out;
  };
};

async function collect(browser, site, vpName) {
  const [w, h] = VPS[vpName];
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(`(${INSTR})(${JSON.stringify(SECTIONS)}, ${JSON.stringify(PROPS)})`);
  await page.goto(SITES[site], { waitUntil: 'domcontentloaded', timeout: 90000 });
  // load-time sampling of hero (every 100ms for 3.5s)
  const loadSamples = [];
  for (let i = 0; i < 35; i++) { loadSamples.push(await page.evaluate(() => [...document.querySelectorAll('.hero > .w *')].filter(e => !e.closest('svg') || e.tagName === 'svg' || e.tagName === 'path').slice(0, 60).map(e => {
    const s = getComputedStyle(e); return [window.__key(e), +(+s.opacity).toFixed(2), s.transform, s.strokeDashoffset]; })).catch(() => [])); await sleep(100); }
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }).catch(() => {});
  const init = await page.evaluate(() => window.__snap('init'));
  const nav0 = await page.evaluate(() => { const n = document.querySelector('header.gnav'); const s = getComputedStyle(n); return { cls: n.className, h: n.offsetHeight, bg: s.backgroundColor, sh: s.boxShadow, bd: s.backdropFilter, pos: s.position, top: s.top }; });
  // fonts actually loaded
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`); });
  // breakpoints declared in CSS
  const bps = await page.evaluate(() => { const s = new Set(); for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (r.media) s.add(r.media.mediaText); } catch (_) {} } return [...s].sort(); });
  // steady scroll: 100px every 70ms (~1430 px/s), sampling nav at a few points
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const navStates = [];
  for (let y = 0; y <= H; y += 100) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    if ([0, 100, 300, 600, 1500, 4000].includes(y)) { await sleep(400); navStates.push(await page.evaluate(() => { const n = document.querySelector('header.gnav'); const s = getComputedStyle(n); const r = n.getBoundingClientRect();
      return { y: scrollY, cls: n.className, top: Math.round(r.top), h: Math.round(r.height), bg: s.backgroundColor, sh: s.boxShadow, bd: s.backdropFilter, tf: s.transform }; })); }
    await sleep(70);
  }
  // scroll up a bit to catch hide/show nav on scroll-up and reset behaviours
  const H2 = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), H2); await sleep(3000);
  for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy({ top: -120, behavior: 'instant' })); await sleep(70); }
  await sleep(500);
  navStates.push(await page.evaluate(() => { const n = document.querySelector('header.gnav'); const s = getComputedStyle(n); const r = n.getBoundingClientRect();
    return { y: scrollY, dir: 'up', cls: n.className, top: Math.round(r.top), h: Math.round(r.height), bg: s.backgroundColor, sh: s.boxShadow, bd: s.backdropFilter, tf: s.transform }; }));
  // final settled snapshot: scroll each section to centre, wait, snapshot all
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await sleep(1500);
  const fin = await page.evaluate(() => window.__snap('final'));
  const log = await page.evaluate(() => window.__log);
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.close();
  return { site, vpName, vp: [w, h], docH, overflowX, fonts, bps, nav0, navStates, loadSamples, init, fin, log };
}

// ---------------- report ----------------
const norm = v => (v || '').replace(/\s+/g, ' ').trim();
const num = v => parseFloat(v);
const COLORISH = ['color', 'background-color', 'border-top-color', 'background-image', 'box-shadow'];
function diffSnap(A, B, tolPx = 2) {
  const res = {};
  for (const [l] of SECTIONS) {
    const a = A[l], b = B[l]; const r = res[l] = { missing: !a ? 'A' : !b ? 'B' : '', box: a && b ? [a.box, b.box] : null, onlyA: [], onlyB: [], diffs: [] };
    if (!a || !b) continue;
    for (const k of Object.keys(a.els)) if (!(k in b.els)) r.onlyA.push(k);
    for (const k of Object.keys(b.els)) if (!(k in a.els)) r.onlyB.push(k);
    for (const k of Object.keys(a.els)) { if (!(k in b.els)) continue; const x = a.els[k], y = b.els[k];
      if (x.hidden || y.hidden) { if (!!x.hidden !== !!y.hidden) r.diffs.push([k, 'display', x.hidden ? 'none' : x.display, y.hidden ? 'none' : y.display]); continue; }
      for (const p of Object.keys(x)) { if (p === 'txt') continue; let u = norm(String(x[p])), v = norm(String(y[p]));
        if (u === v) continue;
        if (['x', 'y', 'w', 'h'].includes(p)) { if (Math.abs(+u - +v) <= tolPx) continue; if (x.txt || y.txt) { if (p === 'w' || p === 'h') continue; } }
        if (p === 'font-family') { u = u.split(',')[0]; v = v.split(',')[0]; if (u === v) continue; }
        r.diffs.push([k, p, u, v]); } }
  }
  return res;
}
function summarizeLog(log) { // per key: first time each class added / anim names
  const m = {};
  for (const e of log) { const o = m[e.k] ||= { cls: {}, anim: {}, trans: {} };
    if (e.type === 'cls') for (const c of e.add.split(' ').filter(Boolean)) o.cls[c] ||= { t: e.t, f: e.f, sy: e.sy };
    if (e.type === 'anim') o.anim[e.name + (e.pseudo || '')] ||= [e.dur, e.delay, e.ease, e.iter, e.dir, e.fill].join(' ');
    if (e.type === 'trans') o.trans[e.prop + (e.pseudo || '')] ||= e.tr; }
  return m;
}
let ONLY = null;
function report(out) {
  let md = '# Deep diff: Assistantly (A) vs E-Africa Next.js (B)\n\nColour/font-family differences are expected (brand). Everything else should match.\n';
  for (const vp of Object.keys(VPS)) {
    const fa = path.join(ROOT, vp, 'A.json'), fb = path.join(ROOT, vp, 'B.json'); if (!fs.existsSync(fa) || !fs.existsSync(fb)) continue;
    const A = JSON.parse(fs.readFileSync(fa)), B = JSON.parse(fs.readFileSync(fb));
    md += `\n\n## Viewport ${vp} ${A.vp.join('x')}\n- doc height A ${A.docH} / B ${B.docH}; horizontal overflow A ${A.overflowX} / B ${B.overflowX}\n`;
    md += `- fonts A: ${[...new Set(A.fonts)].join('; ')}\n- fonts B: ${[...new Set(B.fonts)].join('; ')}\n`;
    md += `- media queries A: ${A.bps.join(' | ')}\n- media queries B: ${B.bps.join(' | ')}\n`;
    md += `\n### Nav states\n| | A | B |\n|-|-|-|\n` + A.navStates.map((s, i) => `| y=${s.y}${s.dir ? ' ↑' : ''} | ${JSON.stringify(s)} | ${JSON.stringify(B.navStates[i] || {})} |`).join('\n') + '\n';
    for (const [mode, key] of [['FINAL (settled) computed style + geometry', 'fin'], ['INITIAL (pre-reveal) state at load', 'init']]) {
      const d = diffSnap(A[key], B[key]); md += `\n### ${mode}\n`;
      for (const [l, r] of Object.entries(d)) { if (ONLY && !ONLY.includes(l)) continue;
        md += `\n#### ${l} ${r.missing ? '(MISSING on ' + r.missing + ')' : ''} box A ${r.box && r.box[0]} / B ${r.box && r.box[1]}\n`;
        if (r.onlyA.length) md += `- only in A (${r.onlyA.length}): ${r.onlyA.slice(0, 60).map(s => s.replace(l + ' > ', '')).join(', ')}\n`;
        if (r.onlyB.length) md += `- only in B (${r.onlyB.length}): ${r.onlyB.slice(0, 60).map(s => s.replace(l + ' > ', '')).join(', ')}\n`;
        const nonColor = r.diffs.filter(x => !COLORISH.includes(x[1]) && x[1] !== 'font-family');
        const color = r.diffs.filter(x => COLORISH.includes(x[1]) || x[1] === 'font-family');
        if (nonColor.length) md += nonColor.slice(0, 250).map(([k, p, u, v]) => `- \`${k.replace(l + ' > ', '')}\` **${p}**: A \`${u.slice(0, 160)}\` | B \`${v.slice(0, 160)}\``).join('\n') + '\n';
        if (color.length) md += `<details><summary>${color.length} colour/font diffs</summary>\n\n` + color.slice(0, 150).map(([k, p, u, v]) => `- \`${k.replace(l + ' > ', '')}\` ${p}: A \`${u.slice(0, 140)}\` | B \`${v.slice(0, 140)}\``).join('\n') + '\n</details>\n';
      }
    }
    const la = summarizeLog(A.log), lb = summarizeLog(B.log);
    md += `\n### Motion timeline (class adds w/ viewport fraction at trigger, animations, transitions)\n`;
    const keys = [...new Set([...Object.keys(la), ...Object.keys(lb)])].sort();
    for (const k of keys) { if (ONLY && !ONLY.includes(k.split(' > ')[0])) continue; const a = la[k], b = lb[k]; const lines = [];
      if (!a) { lines.push(`only B: ${JSON.stringify(b).slice(0, 300)}`); }
      else if (!b) { lines.push(`only A: ${JSON.stringify(a).slice(0, 300)}`); }
      else {
        for (const c of new Set([...Object.keys(a.cls), ...Object.keys(b.cls)])) { const x = a.cls[c], y = b.cls[c];
          if (!x || !y) lines.push(`class .${c}: A ${x ? `t${x.t} f${x.f}` : '—'} | B ${y ? `t${y.t} f${y.f}` : '—'}`);
          else if (Math.abs(x.f - y.f) > 0.12) lines.push(`class .${c} trigger viewport-frac: A ${x.f} | B ${y.f}`); }
        for (const n of new Set([...Object.keys(a.anim), ...Object.keys(b.anim)])) if (a.anim[n] !== b.anim[n]) lines.push(`anim ${n}: A ${a.anim[n] || '—'} | B ${b.anim[n] || '—'}`);
        for (const n of new Set([...Object.keys(a.trans), ...Object.keys(b.trans)])) if (norm(a.trans[n]) !== norm(b.trans[n])) lines.push(`transition ${n}: A ${(a.trans[n] || '—').slice(0, 200)} | B ${(b.trans[n] || '—').slice(0, 200)}`);
      }
      if (lines.length) md += `- \`${k}\`\n` + lines.map(s => `  - ${s}`).join('\n') + '\n';
    }
    // load timeline of hero
    md += `\n### Hero load timeline (opacity per 100ms, first 12 keys)\n`;
    const series = (S) => { const m = {}; S.forEach((frame, i) => frame.forEach(([k, o]) => { (m[k] ||= [])[i] = o; })); return m; };
    const sa = series(A.loadSamples), sb = series(B.loadSamples);
    for (const k of Object.keys(sa).slice(0, 14)) md += `- \`${k}\`\n  - A ${(sa[k] || []).join(',')}\n  - B ${(sb[k] || []).join(',')}\n`;
  }
  const of = path.join(ROOT, out || 'report.md'); fs.writeFileSync(of, md); console.log('report', md.length, 'chars ->', of);
}

(async () => {
  const argv = process.argv.slice(2); const flag = n => (argv.find(a => a.startsWith('--' + n + '=')) || '').split('=')[1];
  const cmd = argv[0]; const pos = argv.slice(1).filter(a => !a.startsWith('--'));
  if (flag('sections')) ONLY = flag('sections').split(',');
  if (cmd === 'report') return report(flag('out'));
  const vps = (flag('vp') || Object.keys(VPS).join(',')).split(',');
  const sites = (flag('site') || 'A,B').split(',');
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 300000, args: ['--hide-scrollbars'] });
  for (const vp of vps) for (const site of sites) {
    const d = await collect(browser, site, vp); fs.mkdirSync(path.join(ROOT, vp), { recursive: true });
    fs.writeFileSync(path.join(ROOT, vp, site + '.json'), JSON.stringify(d)); console.log(vp, site, 'log', d.log.length, 'docH', d.docH);
  }
  await browser.close(); report(flag('out'));
})().catch(e => { console.error(e); process.exit(1); });
