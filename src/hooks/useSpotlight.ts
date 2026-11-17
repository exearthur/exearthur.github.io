import { useEffect } from 'react';

/** How far outside a card (px) the pointer still lights its edge. */
const REACH = 480;

/**
 * Feeds the pointer position to every `[data-spotlight]` element as the CSS
 * variables `--sx` / `--sy` (pixels from that element's top-left corner).
 * The glow itself is drawn in CSS (`[data-spotlight]` in style.css).
 *
 * Adapted from the Spotlight Card on 21st.dev:
 * https://21st.dev/@jahed/components/spotlight-card
 * The original tracks the pointer once per card and positions the glow with a
 * fixed background, which breaks on elements that move on hover. This uses one
 * listener for the page and positions relative to each card instead.
 *
 * Call once per page. Does nothing on touch devices.
 */
export function useSpotlight(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let pointerInPage = false;
    const lit = new Set<HTMLElement>();

    const update = () => {
      frame = 0;
      for (const el of document.querySelectorAll<HTMLElement>('[data-spotlight]')) {
        const box = el.getBoundingClientRect();
        const near =
          pointerInPage &&
          x > box.left - REACH &&
          x < box.right + REACH &&
          y > box.top - REACH &&
          y < box.bottom + REACH;

        if (near) {
          el.style.setProperty('--sx', `${Math.round(x - box.left)}px`);
          el.style.setProperty('--sy', `${Math.round(y - box.top)}px`);
          lit.add(el);
        } else if (lit.delete(el)) {
          // Back to the CSS default, which parks the glow off-card.
          el.style.removeProperty('--sx');
          el.style.removeProperty('--sy');
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      pointerInPage = true;
      schedule();
    };
    const onLeave = () => {
      pointerInPage = false;
      schedule();
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    // Cards move under a still pointer while scrolling.
    window.addEventListener('scroll', schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', schedule);
      for (const el of lit) {
        el.style.removeProperty('--sx');
        el.style.removeProperty('--sy');
      }
    };
  }, [enabled]);
}
