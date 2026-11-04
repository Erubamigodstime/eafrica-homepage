'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { steps } from '@/lib/content';
import { useInView } from '@/lib/motion';
import './HowItWorks.css';

/** A numbered step; `.vis` lands 300ms after 40% of it is in view (drives the tick draw). */
export function Step({ n, title, body, children }: { n: number; title: string; body: string; children: ReactNode }) {
  const [ref, inView] = useInView<HTMLLIElement>({ threshold: 0.4 });
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setVis(true), 300);
    return () => clearTimeout(t);
  }, [inView]);
  return (
    <li ref={ref} className={`fs${vis ? ' vis' : ''}`}>
      <span className="fn">{String(n).padStart(2, '0')}</span>
      {children}
      <h3>{title}</h3>
      <p>{body}</p>
    </li>
  );
}

export const CallTile = ({ label, tag = 'Free' }: { label: string; tag?: string }) => (
  <div className="fv call">
    <span className="cdot" />
    <b>{label}</b>
    <span className="wave" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
    <em>{tag}</em>
  </div>
);

export const TrioTile = ({ photos, label }: { photos: string[]; label: string }) => (
  <div className="fv trio">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <span className="fan3">{photos.map((p) => <img key={p} src={p} alt="" />)}</span>
    <span className="tpill"><i />{label}</span>
  </div>
);

export const DoneTile = ({ items }: { items: string[] }) => (
  <div className="fv done">
    <ul>{items.map((t) => <li key={t}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4l2.8 2.8 6.2-6.6" /></svg>{t}</li>)}</ul>
  </div>
);

export default function HowItWorks({ data = steps }: { data?: typeof steps }) {
  const [a, b, c] = data.items;
  return (
    <section className="sec" id="how">
      <div className="w">
        <div className="hd c hiw3">
          <p className="kick">{data.eyebrow}</p>
          <h2>{data.title}</h2>
        </div>
        <ol className="flow">
          <Step n={1} {...a}><CallTile label={data.callLabel} /></Step>
          <Step n={2} {...b}><TrioTile photos={data.trio} label={data.trioLabel} /></Step>
          <Step n={3} {...c}><DoneTile items={data.done} /></Step>
        </ol>
        <p className="c">
          <a className="more" href={data.more.href}><span className="mt">{data.more.label}</span><span className="ma" aria-hidden="true">›</span></a>
        </p>
      </div>
    </section>
  );
}
