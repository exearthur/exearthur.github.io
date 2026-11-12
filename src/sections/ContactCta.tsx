import { Reveal } from '../components/Reveal';
import type { SectionProps } from '../components/Section';
import { site } from '../config/site';
import { profile } from '../data/profile';
import { cx, external } from '../lib/cx';

/** Closing call to action at the foot of the home page. */
export function ContactCta({ alt }: SectionProps) {
  return (
    <section className={cx('section', alt && 'section-alt', 'cta')} id="contact">
      <div className="container cta-inner stagger">
        <Reveal as="h2" className="cta-title">
          {profile.cta.title}
        </Reveal>
        <Reveal as="p" className="cta-sub">
          {profile.cta.subtitle}
        </Reveal>
        <Reveal className="actions">
          <a className="btn" href={`mailto:${site.email}`}>
            Email me
          </a>
          <a className="link-arrow" href={site.linkedin.url} {...external}>
            LinkedIn
          </a>
        </Reveal>
      </div>
    </section>
  );
}
