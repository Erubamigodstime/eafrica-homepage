import type { ReactNode } from 'react';
import type { Person } from '@/lib/content';
import { brand } from '@/lib/content';

/* ---------- Button / link styled as a pill ---------- */
type BtnVariant = 'primary' | 'pinegrad' | 'ghost' | 'dark';
export function Button({ href, variant = 'primary', size, arrow, className = '', children }: { href: string; variant?: BtnVariant; size?: 'sm'; arrow?: boolean; className?: string; children: ReactNode }) {
  return (
    <a className={`btn ${variant} ${size ?? ''} ${className}`.trim()} href={href}>
      {children}
      {arrow && <span aria-hidden="true">›</span>}
    </a>
  );
}

/** Underlining text link with a sliding chevron. */
export function MoreLink({ href, caps, children }: { href: string; caps?: boolean; children: ReactNode }) {
  return (
    <a className={`more ${caps ? 'caps' : ''}`} href={href}>
      <span className="mt">{children}</span> <span aria-hidden="true">›</span>
    </a>
  );
}

/* ---------- Avatar: photo when available, otherwise coloured initials ---------- */
export function Avatar({ person, className = '' }: { person: Pick<Person, 'name' | 'photo' | 'initials' | 'tone'>; className?: string }) {
  if (person.photo) {
    return (
      <span className={`av photo ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={person.photo} alt="" loading="lazy" />
      </span>
    );
  }
  const initials = person.initials ?? person.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
  return <span className={`av ${person.tone ?? 'a1'} ${className}`}>{initials}</span>;
}

/* ---------- Brand lockup ---------- */
export function Brand({ light }: { light?: boolean }) {
  return (
    <a className={`brand ${light ? 'light' : ''}`} href="#top" aria-label={`${brand.name}${brand.suffix} home`}>
      <span className="brand-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt="" />
      </span>
      <span className="brand-name">
        {brand.name}
        <b>{brand.suffix}</b>
      </span>
    </a>
  );
}

/* ---------- Small icons ---------- */
export const CheckDot = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 18 18" width={size} height={size} aria-hidden="true">
    <circle cx="9" cy="9" r="9" />
    <path d="M5.2 9.3l2.4 2.4 5-5" />
  </svg>
);

export const Kicker = ({ children, className = '' }: { children: ReactNode; className?: string }) => <p className={`kick ${className}`}>{children}</p>;

/** Glassy pill chips with a dot, used on dark backgrounds. */
export const DotChips = ({ items, center }: { items: string[]; center?: boolean }) => (
  <div className={`gchips ${center ? 'c' : ''}`}>
    {items.map((t) => (
      <span key={t}>
        <i />
        {t}
      </span>
    ))}
  </div>
);
