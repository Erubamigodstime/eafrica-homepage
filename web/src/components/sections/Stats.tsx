'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { stats } from '@/lib/content';
import { prefersReducedMotion, useInViewCallback } from '@/lib/motion';
import './Stats.css';

type Stat = (typeof stats.items)[number];

/** Stat tile. When `to` is set the figure counts up once (easeOutCubic, 1.7s) the first time it is 60% visible. */
export function StatCard({ label, value, to, suffix = '' }: Stat) {
  const ref = useRef<HTMLElement>(null);
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (to != null && !prefersReducedMotion() && 'IntersectionObserver' in window) setVal(`0${suffix}`);
  }, [to, suffix]);

  useInViewCallback(ref, () => {
    if (to == null || prefersReducedMotion()) return;
    let t0: number | undefined;
    const step = (t: number) => {
      t0 ??= t;
      const k = Math.min(1, (t - t0) / 1700);
      const e = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(to * e).toLocaleString('en-US') + suffix);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });

  return (
    <div className="stat">
      <dt>{label}</dt>
      <dd ref={ref}>{val}</dd>
    </div>
  );
}

/** Numbers band under the hero stage. Children (the partner logo wall) render inside the same container. */
export default function Stats({ children }: { children?: ReactNode }) {
  return (
    <section className="nums" aria-label="E-Africa in numbers">
      <div className="w wide">
        <dl className="sbox">
          {stats.items.map((s) => <StatCard key={s.label} {...s} />)}
          <div className="stat hub">
            <dt>{stats.hub.label}</dt>
            <dd><span className="gdot" aria-hidden="true" />{stats.hub.title}</dd>
          </div>
        </dl>
        {children}
      </div>
    </section>
  );
}
