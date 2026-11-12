import { Reveal } from '../components/Reveal';
import { Section, type SectionProps } from '../components/Section';
import { experience, type Experience as ExperienceEntry } from '../data/experience';
import { external } from '../lib/cx';

export function Experience({ alt }: SectionProps) {
  return (
    <Section
      id="experience"
      alt={alt}
      title="Experience."
      subtitle="Engineering work and campus leadership."
    >
      <div className="rows">
        {experience.map((entry) => (
          <Row entry={entry} key={entry.title} />
        ))}
      </div>
    </Section>
  );
}

/** Date rail on the left, detail on the right. */
function Row({ entry }: { entry: ExperienceEntry }) {
  const { subtitle, roles, points, summary } = entry;
  return (
    <Reveal as="article" className="row">
      <div className="row-meta">
        <p className="row-when">{entry.when}</p>
        <p className="row-where">{entry.where}</p>
      </div>
      <div className="row-body">
        <h3 className="row-title">{entry.title}</h3>
        {subtitle && (
          <p className="row-org">
            {subtitle.href ? (
              <a href={subtitle.href} {...external}>
                {subtitle.text}
              </a>
            ) : (
              subtitle.text
            )}
          </p>
        )}
        {roles && (
          <ul className="row-roles">
            {roles.map(({ title, period }) => (
              <li key={title}>
                {title} <span className="muted">{period}</span>
              </li>
            ))}
          </ul>
        )}
        {points && (
          <ul className="points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
        {summary && <p className="row-text">{summary}</p>}
      </div>
    </Reveal>
  );
}
