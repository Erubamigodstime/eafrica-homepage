'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { heroStage } from '@/lib/content';
import { Avatar } from '@/components/ui/primitives';
import Mascot from '@/components/ui/Mascot';
import { confetti } from '@/lib/confetti';
import { prefersReducedMotion, useInView, useInViewCallback } from '@/lib/motion';
import './HeroStage.css';

/** Vetting "profile card" with bars that fill when scrolled into view. Reusable anywhere. */
export function VettingCard({ card = heroStage.card }: { card?: typeof heroStage.card }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.35 });
  return (
    <article ref={ref} className={`pc2 hero ${inView ? 'in' : ''}`}>
      <header>
        <span className="pav">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.photo} alt="" loading="lazy" />
        </span>
        <div>
          <h3>{card.title}</h3>
          <p>{card.sub}</p>
        </div>
      </header>
      <div className="pc-row">
        <span className="d1">{card.badge}</span>
        <span className="gm"><i />{card.status}</span>
      </div>
      <p className="lab">{card.barsLabel}</p>
      <ul className="bars">
        {card.bars.map((b) => (
          <li key={b.label}>
            <span>{b.label}</span>
            <b><i style={{ ['--v' as string]: `${b.v}%` }} /></b>
            <em className={`lv ${b.tone}`}>{b.level}</em>
          </li>
        ))}
      </ul>
      <div className="tin">
        <p className="lab">{card.handleLabel}</p>
        <p className="tt">{card.handle}</p>
      </div>
      <p className="lab">{card.fitLabel}</p>
      <div className="cset">
        {card.fit.map((f) => <span key={f}>{f}</span>)}
      </div>
      <p className="introp"><span className="plb" aria-hidden="true" />{card.intro.label}</p>
    </article>
  );
}

/**
 * Stage mascot, timed like the reference hero buddy: hidden (hxpre) until 30% visible, pops 500ms
 * later with confetti 450ms after that; when 40% visible it bucks after 900ms, then idles (stayup).
 * `tiltRef` (the stage) drives a small cursor-follow tilt.
 */
export function StageMascot({ tiltRef }: { tiltRef?: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const uni = useRef<SVGSVGElement | null>(null);
  const cf = useRef<HTMLSpanElement>(null);
  const [pre, setPre] = useState(false);
  const [pop, setPop] = useState(false);
  const [buck, setBuck] = useState(false);
  const [stay, setStay] = useState(false);
  const busy = useRef(false);
  const seen = useRef(false);

  useEffect(() => {
    if (!prefersReducedMotion()) setPre(true);
  }, []);

  // cursor tilt over the whole stage
  useEffect(() => {
    const st = tiltRef?.current;
    const u = ref.current?.querySelector<SVGSVGElement>('.uni');
    uni.current = u ?? null;
    if (!st || !u || !matchMedia('(pointer:fine)').matches) return;
    const move = (e: MouseEvent) => {
      const r = st.getBoundingClientRect();
      u.style.setProperty('--rt', `${(((e.clientX - r.left) / r.width - 0.3) * 8).toFixed(2)}deg`);
    };
    const leave = () => u.style.setProperty('--rt', '0deg');
    st.addEventListener('mousemove', move);
    st.addEventListener('mouseleave', leave);
    return () => { st.removeEventListener('mousemove', move); st.removeEventListener('mouseleave', leave); };
  }, [tiltRef]);

  // the reference confetti() empties the burst field before each burst
  const burst = (n: number) => {
    if (cf.current) cf.current.innerHTML = '';
    confetti(cf.current, { n });
  };

  const act = () => {
    if (busy.current) return;
    busy.current = true;
    setBuck(false);
    requestAnimationFrame(() => setBuck(true));
    burst(38);
    setTimeout(() => setBuck(false), 950);
    setTimeout(() => (busy.current = false), 1400);
  };

  useInViewCallback(ref, () => {
    if (prefersReducedMotion()) return;
    setTimeout(() => {
      setPre(false);
      setPop(true);
      setTimeout(() => burst(40), 450);
    }, 500);
  }, { threshold: 0.3 });

  useInViewCallback(ref, (e) => {
    if (prefersReducedMotion()) return;
    if (e.isIntersecting && !seen.current) {
      seen.current = true;
      setTimeout(() => { act(); setTimeout(() => setStay(true), 1000); }, 900);
    } else if (!e.isIntersecting && seen.current && e.boundingClientRect.top > 0) seen.current = false;
  }, { threshold: 0.4, once: false });

  const cls = ['buddy hero-uni solo', pre && 'hxpre', pop && 'hxpop', buck && 'bucking', stay && 'stayup'].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={cls} aria-hidden="true">
      <Mascot className="uni hx" fit="xMidYMax meet" />
      <span className="floor" />
      <span className="cf" ref={cf} />
    </div>
  );
}

export default function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <div className="w wide">
      <div className="stage" ref={stage} aria-label="Example finalists">
        <span className="grid" aria-hidden="true" />
        <span className="glow" aria-hidden="true" />
        <StageMascot tiltRef={stage} />
        {heroStage.notes.map((n) => (
          <div key={n.cls} className={`note ${n.cls}`}>
            <Avatar person={n.person} className="pic" />
            <div><b>{n.person.name}</b><span>{n.person.role}</span></div>
            <span className="tg">{n.tag}</span>
          </div>
        ))}
        <div className="hero-card"><VettingCard /></div>
      </div>
    </div>
  );
}
