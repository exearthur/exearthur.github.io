import { useEffect, useState } from 'react';

/**
 * The id of the section currently crossing the middle of the viewport, or
 * null when none is (for example while the hero is on screen).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(' ');

  useEffect(() => {
    if (!key || !('IntersectionObserver' in window)) return;

    // The margins collapse the observed area to a line 45% down the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { id } = entry.target;
          setActive((current) => {
            if (entry.isIntersecting) return id;
            return current === id ? null : current;
          });
        }
      },
      { rootMargin: '-45% 0px -55% 0px' },
    );

    for (const id of key.split(' ')) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
