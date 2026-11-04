'use client';
import { Fragment, useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { talent, type Role } from '@/lib/content';
import { Button } from '@/components/ui/primitives';
import { TAB_EVENT } from '@/lib/tabs';
import { useInView } from '@/lib/motion';
import './TalentTabs.css';

/**
 * Above 860px the tab bar and panels are scaled to 90% (CSS `[data-shrink]`); this pulls the
 * following content up by the 10% of height the scale frees, exactly like the reference page.
 */
function useShrink(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.marginBottom = '';
    const base = parseFloat(getComputedStyle(el).marginBottom) || 0;
    const fix = () => { el.style.marginBottom = window.innerWidth > 860 ? `${base - Math.round(el.offsetHeight * 0.1)}px` : ''; };
    fix();
    window.addEventListener('resize', fix);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(fix) : null;
    ro?.observe(el);
    return () => { window.removeEventListener('resize', fix); ro?.disconnect(); };
  }, [ref]);
}

/** One role "profile" card. */
export function RoleCard({ role }: { role: Role }) {
  return (
    <article className="pc2 snip">
      <header>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="pav">{role.person.photo && <img src={role.person.photo} alt="" width={240} height={240} loading="lazy" />}</span>
        <div><h3>{role.title}</h3><p>{role.cat}</p></div>
      </header>
      <div className="xp">
        <span className="yrs3">Entry to expert</span>
        <span className="prv">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" /><path d="M4.6 8.3l2.2 2.2 4.6-4.9" /></svg>
          Pre-vetted
        </span>
      </div>
      <div className="proof"><p className="lab">The role</p><p className="pp">{role.body}</p></div>
      <div className="zg2"><p className="lab">Key skills</p><div className="ztags">{role.tags.map((t) => <span className="ztag" key={t}>{t}</span>)}</div></div>
      <p className="lock">
        <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeMiterlimit="2.6" aria-hidden="true">
          <rect x="4.8" y="10.4" width="14.4" height="9.6" rx="2.2" />
          <path d="M8 10.4V7.6a4 4 0 0 1 7.6-1.6" />
          <path d="M12 14.4V16.8" />
          <circle cx="12" cy="14.4" r="1.15" fill="currentColor" stroke="none" />
        </svg>
        Tested · assessed · interview-ready
      </p>
    </article>
  );
}

/** A tab panel: scroll-revealed (`.reveal` + `.vis`, delay = min(siblingIndex, 5) * 70ms) and 90%-scaled on desktop. */
function Panel({ id, hidden, delay, children }: { id: string; hidden: boolean; delay: number; children: ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  useShrink(ref);
  return (
    <div ref={ref} className={`cards3 reveal ${inView ? 'vis' : ''}`} role="tabpanel" id={`p-${id}`} aria-labelledby={`t-${id}`} hidden={hidden}
      data-shrink="" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * ARIA tabs with roving tabindex (arrow keys wrap). Panels are siblings of the tab bar, like the reference.
 * Listens for `selectTab(id)` so other components (hero chips, nav) can switch tabs.
 */
export default function TalentTabs({ data = talent }: { data?: typeof talent }) {
  const [active, setActive] = useState(data.tabs[0].id);
  const sec = useRef<HTMLElement>(null);
  const seg = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useShrink(seg);

  useEffect(() => {
    const onSel = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener(TAB_EVENT, onSel);
    return () => window.removeEventListener(TAB_EVENT, onSel);
  }, []);

  // Cards get `.in` once 35% visible, and immediately (30ms) when their tab is picked.
  useEffect(() => {
    const cards = Array.from(sec.current?.querySelectorAll<HTMLElement>('.pc2') ?? []);
    if (!('IntersectionObserver' in window)) { cards.forEach((c) => c.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.35 });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  const pick = (id: string) => {
    setActive(id);
    setTimeout(() => document.getElementById(`p-${id}`)?.querySelectorAll('.pc2').forEach((c) => c.classList.add('in')), 30);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const next = data.tabs[(i + d + data.tabs.length) % data.tabs.length].id;
    pick(next);
    tabRefs.current[next]?.focus();
    e.preventDefault();
  };

  return (
    <section ref={sec} className="sec alt" id="ready">
      <div className="w">
        <div className="hd c rdy">
          <p className="kick">{data.eyebrow}</p>
          <h2>{data.title.map((l, i) => <Fragment key={l}>{i > 0 && ' '}<span className="l1">{l}</span></Fragment>)}</h2>
          <p className="big sp">{data.sub}</p>
        </div>
        <div ref={seg} className="seg" role="tablist" aria-label="Service categories" data-shrink="">
          {data.tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[t.id] = el; }}
              type="button"
              role="tab"
              id={`t-${t.id}`}
              aria-controls={`p-${t.id}`}
              aria-selected={active === t.id}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => pick(t.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {data.tabs.map((t, i) => (
          <Panel key={t.id} id={t.id} hidden={active !== t.id} delay={Math.min(i + 2, 5) * 70}>
            {t.roles.map((r) => <RoleCard key={r.title} role={r} />)}
          </Panel>
        ))}
        <div className="c foot-r">
          <Button href={data.cta.href}>{data.cta.label}</Button>
          <p className="fine">{data.fine}</p>
        </div>
      </div>
    </section>
  );
}
