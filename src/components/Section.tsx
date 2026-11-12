import type { ReactNode } from 'react';
import type { SectionId } from '../config/site';
import { cx } from '../lib/cx';
import { Reveal } from './Reveal';

/** What the home page passes to every section component. */
export interface SectionProps {
  /** Use the alternate (grey) background. */
  alt: boolean;
}

interface SectionShellProps extends SectionProps {
  id: SectionId;
  /** Short statement, e.g. "Selected work." */
  title: string;
  /** Its qualifier, shown in grey on the line below. */
  subtitle: string;
  children: ReactNode;
}

/** A home page section: background, container, and the two-tone headline. */
export function Section({ id, alt, title, subtitle, children }: SectionShellProps) {
  return (
    <section className={cx('section', alt && 'section-alt')} id={id}>
      <div className="container">
        <Reveal as="h2" className="section-title">
          {title} <span className="muted">{subtitle}</span>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
