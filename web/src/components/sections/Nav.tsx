'use client';
import { useState } from 'react';
import { brand, nav } from '@/lib/content';
import { Button } from '@/components/ui/primitives';
import { selectTab } from '@/lib/tabs';
import './Nav.css';

/** 20px line icons for the dropdown tiles (stroke = currentColor). */
const ICONS: Record<string, string> = {
  cx: 'M5 13.5v-2a7 7 0 0 1 14 0v2M5 13.5a1.6 1.6 0 0 1 1.6-1.6H8v5.6H6.6A1.6 1.6 0 0 1 5 15.9ZM19 13.5a1.6 1.6 0 0 0-1.6-1.6H16v5.6h1.4a1.6 1.6 0 0 0 1.6-1.6ZM16 17.5c0 1.6-1.6 2.5-4 2.5',
  ops: 'M4.5 7.5h15v11.5h-15ZM9 7.5V5.2h6v2.3M4.5 12.2h15',
  sales: 'M3.5 4.5v15h17M7.6 15.5V11M12 15.5V8.5M16.4 15.5V12.5',
  tech: 'M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.4 5.5l-2.8 13',
  lang: 'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8ZM3.6 12h16.8M12 3.6c2.4 2.4 3.4 5.2 3.4 8.4s-1 6-3.4 8.4c-2.4-2.4-3.4-5.2-3.4-8.4s1-6 3.4-8.4Z',
  how: 'M12 3.6 4.6 6.4V11c0 4.6 3.1 7.6 7.4 9 4.3-1.4 7.4-4.4 7.4-9V6.4ZM9 12l2.2 2.2L15 9',
};

export default function Nav() {
  const [menu, setMenu] = useState(false); // dropdown aria state
  const [shut, setShut] = useState(false); // force-closed after Esc / item click
  const [open, setOpen] = useState(false); // mobile menu
  const close = () => setOpen(false);

  return (
    <header className="gnav">
      <div className="w wide nr">
        <a className="logo" href="#top" aria-label={`${brand.name}${brand.suffix} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ol" src={brand.logo} alt="" width={34} height={34} />
          <span className="lw">{brand.name}<b>{brand.suffix}</b></span>
        </a>
        <nav className={`gl ${open ? 'open' : ''}`} id="gl" aria-label="Main">
          <span
            className={`ix-nav ${shut ? 'shut' : ''}`}
            onMouseEnter={() => setMenu(true)}
            onMouseLeave={() => { setMenu(false); setShut(false); }}
            onFocus={() => setMenu(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(false); }}
            onKeyDown={(e) => { if (e.key === 'Escape') { setShut(true); setMenu(false); } }}
          >
            <a href="#ready" aria-haspopup="true" aria-expanded={menu} onClick={close}>{nav.menuLabel}</a>
            <span className="ix-menu" aria-label={nav.menuLabel}>
              {nav.menu.map((m) => (
                <a key={m.title} href={m.href} onClick={() => { setShut(true); setMenu(false); close(); if (m.tab) selectTab(m.tab); }}>
                  <span className="ix-mi">
                    <svg width="20" height="20" viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false">
                      <path d={ICONS[m.tab ?? 'how']} />
                    </svg>
                  </span>
                  <span>{m.title}<em>{m.sub}</em></span>
                </a>
              ))}
              <a className="ix-all" href={nav.menuAll.href} onClick={() => { setShut(true); setMenu(false); close(); }}>{nav.menuAll.label}</a>
            </span>
          </span>
          {nav.links.map((l) => (
            <a key={l.label} href={l.href} onClick={close}>{l.label}</a>
          ))}
          <a className="si" href={nav.secondary.href} onClick={close}>{nav.secondary.label}</a>
        </nav>
        <div className="gright">
          <a className="si-top" href={nav.secondary.href}>{nav.secondary.label}</a>
          <Button href={nav.cta.href} size="sm" className="gcta">{nav.cta.label}</Button>
        </div>
        <button className="burger" id="burger" aria-expanded={open} aria-controls="gl" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}
