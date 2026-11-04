'use client';
import { RefObject, useEffect, useRef, useState } from 'react';

/** True when the visitor asked the OS for reduced motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const [rm, setRm] = useState(false);
  useEffect(() => setRm(prefersReducedMotion()), []);
  return rm;
}

type InViewOpts = { threshold?: number; rootMargin?: string; once?: boolean };

/**
 * Calls `onChange` when `ref` enters (and, with once:false, leaves) the viewport.
 * The callback always sees the latest props via a ref, so callers don't need to memoise it.
 */
export function useInViewCallback<T extends Element>(
  ref: RefObject<T | null>,
  onChange: (entry: IntersectionObserverEntry) => void,
  { threshold = 0.3, rootMargin = '0px', once = true }: InViewOpts = {},
) {
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      cb.current({ isIntersecting: true, target: el, boundingClientRect: el.getBoundingClientRect() } as unknown as IntersectionObserverEntry);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (once) {
            if (e.isIntersecting) {
              io.unobserve(e.target);
              cb.current(e);
            }
          } else cb.current(e);
        }),
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
}

/** Returns [ref, inView]: inView flips to true once the element is seen (immediately under reduced motion). */
export function useInView<T extends Element>(opts: InViewOpts = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) setSeen(true);
  }, []);
  useInViewCallback(ref, () => setSeen(true), { ...opts, once: true });
  return [ref, seen];
}
