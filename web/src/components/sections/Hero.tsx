'use client';
import { Fragment, type ReactNode } from 'react';
import { hero } from '@/lib/content';
import { Button, MoreLink } from '@/components/ui/primitives';
import { selectTab } from '@/lib/tabs';
import './Hero.css';

/** Hero copy block. Pass the visual stage as a child so it shares the section (as on the reference). */
export default function Hero({ children }: { children?: ReactNode }) {
  return (
    <section className="hero" id="top">
      <div className="w">
        <p className="kick rise r1">{hero.eyebrow}</p>
        <h1 className="rise r2">
          {hero.titleBefore}
          <em className="sw">
            {hero.titleUnderlined}
            <svg className="swoosh" viewBox="0 0 320 34" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 22 C 70 8, 150 4, 230 12 S 300 26, 316 10" />
            </svg>
          </em>
        </h1>
        <p className="big rise r3 hp2">
          {hero.lede.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <span className="ln">{l}</span>
            </Fragment>
          ))}
        </p>
        <div className="w pick rise r3">
          <p id="hf">{hero.pickTitle}</p>
          <div className="chips" role="group" aria-labelledby="hf">
            {hero.chips.map((c) => (
              <a key={c.label} href={c.href ?? '#ready'} onClick={() => c.tab && selectTab(c.tab)}>
                {c.label}
              </a>
            ))}
          </div>
          <p className="fine">{hero.fine}</p>
        </div>
        <div className="ctas rise r4">
          <Button href={hero.cta.href} variant="pinegrad" arrow>{hero.cta.label}</Button>
          <MoreLink href={hero.altCta.href}>{hero.altCta.label}</MoreLink>
        </div>
      </div>
      {children}
    </section>
  );
}
