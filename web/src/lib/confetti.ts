import { prefersReducedMotion } from './motion';

const COLORS = ['#BDE5C8', '#7DC895', '#14432A', '#257F3F', '#E3F3E7', '#D94826', '#F4B73E'];
const EMOJI = ['🌍', '✨', '💚', '🎉', '⭐', '🌟'];

type Opts = {
  n?: number; spread?: number; base?: number; range?: number;
  /** every Nth particle is an emoji (default 5) */ emEvery?: number;
  /** alternate sq/ci and cycle colours by index instead of randomly */ cycle?: boolean;
  /** max spin in degrees, ± (default 540) */ spin?: number;
  /** min duration in s (default 1.2; range is +0.7) */ dMin?: number;
  /** max random start delay in s (default 0.12) */ delay?: number;
  /** empty the field before the burst */ clear?: boolean;
};

/**
 * Fires an upward fan of confetti from the centre of `container` (an element with class "cf").
 * Particles are plain <i> elements animated by the `cfly` keyframes in globals.css.
 */
export function confetti(container: HTMLElement | null, { n = 34, spread = 0.9, base = 110, range = 170, emEvery = 5, cycle = false, spin = 540, dMin = 1.2, delay = 0.12, clear = false }: Opts = {}) {
  if (!container || prefersReducedMotion()) return;
  if (clear) container.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    const a = -Math.PI * ((1 - spread) / 2 + spread * Math.random());
    const r = base + Math.random() * range;
    if (i % emEvery === 0) {
      p.className = 'em';
      p.textContent = EMOJI[i % EMOJI.length];
    } else {
      p.className = cycle ? (i % 2 ? 'sq' : 'ci') : Math.random() < 0.5 ? 'sq' : 'ci';
      p.style.background = COLORS[cycle ? i % COLORS.length : (Math.random() * COLORS.length) | 0];
    }
    p.style.setProperty('--x', `${Math.cos(a) * r}px`);
    p.style.setProperty('--y', `${Math.sin(a) * r}px`);
    p.style.setProperty('--r', `${(Math.random() * 2 * spin - spin) | 0}deg`);
    p.style.setProperty('--d', `${dMin + Math.random() * 0.7}s`);
    if (delay) p.style.animationDelay = `${Math.random() * delay}s`;
    container.appendChild(p);
  }
  const c = container as HTMLElement & { _cfT?: number };
  window.clearTimeout(c._cfT);
  c._cfT = window.setTimeout(() => (container.innerHTML = ''), 2400);
}
