import { useRef, type ReactNode } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { Reveal } from '../Reveal';

export interface TimelineEntry {
  key: string;
  /** Left column: stays pinned under the nav while its entry scrolls past. */
  aside: ReactNode;
  content: ReactNode;
}

/**
 * A vertical timeline whose rail fills with a beam as the page scrolls.
 *
 * Adapted from Aceternity UI's Timeline (MIT), installed via 21st.dev:
 * https://21st.dev/@manuarora700/components/timeline
 * The scroll-linked beam is the original mechanism; the layout and colours
 * are this site's (`.timeline*` in style.css) rather than Tailwind classes.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  // 0 when the top of the timeline reaches 45% down the viewport, 1 when its
  // bottom reaches 60%, so the tip of the beam stays in the reading zone.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 45%', 'end 60%'],
  });

  // Written straight to the element: it changes every scroll frame, so it
  // stays out of React state. The beam fades in over the first tenth.
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const beam = beamRef.current;
    if (!beam) return;
    beam.style.height = `${progress * 100}%`;
    beam.style.opacity = String(Math.min(progress / 0.1, 1));
  });

  return (
    <div className="timeline" ref={trackRef}>
      {entries.map((entry) => (
        <Reveal as="article" className="timeline-entry" key={entry.key}>
          <div className="timeline-aside">
            <span className="timeline-dot" aria-hidden="true" />
            {entry.aside}
          </div>
          <div className="timeline-content">{entry.content}</div>
        </Reveal>
      ))}
      <div className="timeline-rail" aria-hidden="true">
        <div className="timeline-beam" ref={beamRef} />
      </div>
    </div>
  );
}
