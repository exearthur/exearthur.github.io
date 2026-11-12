import { useEffect, useRef, useState } from 'react';

interface InViewOptions {
  rootMargin?: string;
  threshold?: number;
  /** Latch to `true` the first time the element is seen, then stop watching. */
  once?: boolean;
  /** Value before the observer has reported (also what the prerender uses). */
  initial?: boolean;
}

/**
 * Track whether an element is inside the viewport. Attach the returned ref to
 * the element. Where IntersectionObserver is missing, `once` elements are
 * treated as seen so nothing that is waiting to be revealed stays hidden.
 */
export function useInView<T extends Element>({
  rootMargin,
  threshold,
  once = false,
  initial = false,
}: InViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      if (once) setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView] as const;
}
