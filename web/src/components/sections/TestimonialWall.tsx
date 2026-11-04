'use client';
import { brand, testimonials } from '@/lib/content';
import { Avatar, Button } from '@/components/ui/primitives';
import { useInView } from '@/lib/motion';
import './TestimonialWall.css';

export function TestimonialCard({ cls, person, quote }: (typeof testimonials.items)[number]) {
  return (
    <figure className={`wl ${cls}`}>
      <figcaption><Avatar person={person} /><span><b>{person.name}</b>{person.role}</span></figcaption>
      <span className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</span>
      <blockquote>{quote}</blockquote>
    </figure>
  );
}

/** Fanned, rotated cards that pop in (centre first) then float; rotation and float compose via separate properties. */
export default function TestimonialWall({ data = testimonials }: { data?: typeof testimonials }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.25 });
  return (
    <section ref={ref} className={`sec wallsec ${inView ? 'in' : ''}`} id="reviews">
      <div className="w wide">
        <div className="wpanel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="gtile"><img src={brand.logo} alt="" /></span>
          <h2 className="mega">{data.title}</h2>
          <div className="wl-fan home">{data.items.map((t) => <TestimonialCard key={t.cls} {...t} />)}</div>
          <p className="wl-tag">{data.tagline[0]} <span aria-hidden="true">⚡</span> {data.tagline[1]}</p>
          <p className="c"><Button href={data.cta.href} variant="dark">{data.cta.label}</Button></p>
        </div>
      </div>
    </section>
  );
}
