'use client';
import { useRef, useState } from 'react';
import { brand, footer } from '@/lib/content';
import { Brand } from '@/components/ui/primitives';
import Mascot from '@/components/ui/Mascot';
import { confetti } from '@/lib/confetti';
import { prefersReducedMotion, useInViewCallback } from '@/lib/motion';
import './Footer.css';

/**
 * Mascot that rises over the footer's top edge when the footer appears, bursts confetti and talks.
 * Its front paws (clipped copies of the same SVG) fade in on the edge once it has risen.
 * Resets when you scroll back up; click / Enter / Space cycles the lines.
 */
export function FooterPeek({ lines = footer.peekLines, watchRef }: { lines?: string[]; watchRef: React.RefObject<HTMLElement | null> }) {
  const cf = useRef<HTMLSpanElement>(null);
  const [up, setUp] = useState(false);
  const [talk, setTalk] = useState(false);
  const [line, setLine] = useState(lines[0]);
  const idx = useRef(0);
  const armed = useRef(true);
  const talkT = useRef<number | undefined>(undefined);

  const say = (t: string) => {
    setLine(t);
    setTalk(true);
    window.clearTimeout(talkT.current);
    talkT.current = window.setTimeout(() => setTalk(false), 3400);
  };
  const burst = (n: number) => confetti(cf.current, { n, spread: 0.8, base: 80, range: 170, emEvery: 6, cycle: true, spin: 270, dMin: 1.1, delay: 0, clear: true });

  useInViewCallback(watchRef, (e) => {
    if (e.isIntersecting && armed.current) {
      armed.current = false;
      idx.current = 0;
      setUp(true);
      setTimeout(() => { burst(40); say(lines[0]); }, prefersReducedMotion() ? 0 : 850);
    } else if (!e.isIntersecting && !armed.current && e.boundingClientRect.top > 0) {
      armed.current = true;
      setUp(false);
      setTalk(false);
    }
  }, { threshold: 0.15, once: false });

  const poke = () => {
    setUp(true);
    idx.current = (idx.current + 1) % lines.length;
    burst(34);
    say(lines[idx.current]);
  };

  return (
    <div
      className={`fpeek ${up ? 'up' : ''} ${talk ? 'talk' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Your E-Africa lion. Click for confetti."
      onClick={poke}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(); } }}
    >
      <span className="fpeek-bub" aria-live="polite">{line}</span>
      <span className="fp-hooves" aria-hidden="true"><Mascot className="fh l" title="" /><Mascot className="fh r" title="" /></span>
      <span className="fpeek-clip"><Mascot className="uni hx" title="" /></span>
      <span className="cf" ref={cf} aria-hidden="true" />
    </div>
  );
}

export default function Footer({ data = footer }: { data?: typeof footer }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <footer className="foot2" ref={ref}>
      <FooterPeek lines={data.peekLines} watchRef={ref} />
      <div className="w wide">
        <div className="ftop">
          <div className="fbrand">
            <Brand light />
            <p className="ftag"><span className="ftk">{data.tagline}</span><br /><span className="fts">{data.body}</span></p>
            <p className="flab">{data.contactLabel}</p>
            <a className="sub" href={`mailto:${brand.email}`}><span className="sub-in">{brand.email}</span><span className="btn primary">Email us</span></a>
            <p className="fmsg" aria-hidden="true" />
          </div>
          <div className="fcols">
            {data.cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h4>{c.title}</h4>
                <ul>{c.links.map(([l, h]) => <li key={l}><a href={h}>{l}</a></li>)}</ul>
              </nav>
            ))}
            <nav aria-label="Contact">
              <h4>Contact</h4>
              <ul>
                <li><span className="fco">Pan-African Operations</span></li>
                <li><a href={`tel:${brand.phone}`}>{brand.phoneDisplay}</a></li>
                <li><a href={`mailto:${brand.email}`}>{brand.email.split('@')[0]}@<wbr />{brand.email.split('@')[1]}</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="fbot"><p>{data.copyright}</p><span className="pow">Powered by <b>{data.poweredBy}</b></span></div>
      </div>
    </footer>
  );
}
