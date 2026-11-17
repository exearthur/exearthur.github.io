import { Reveal } from '../components/Reveal';
import { Section, type SectionProps } from '../components/Section';
import { Timeline } from '../components/ui/Timeline';
import { features } from '../config/site';
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
      {features.experienceTimeline ? (
        <Timeline
          entries={experience.map((entry) => ({
            key: entry.title,
            aside: <EntryMeta entry={entry} />,
            content: <EntryBody entry={entry} />,
          }))}
        />
      ) : (
        <div className="rows">
          {experience.map((entry) => (
            <Reveal as="article" className="row" key={entry.title}>
              <EntryMeta entry={entry} />
              <EntryBody entry={entry} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

/** When and where. */
function EntryMeta({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="row-meta">
      <p className="row-when">{entry.when}</p>
      <p className="row-where">{entry.where}</p>
    </div>
  );
}

/** Title, organisation or roles, and what was done. */
function EntryBody({ entry }: { entry: ExperienceEntry }) {
  const { subtitle, roles, points, summary } = entry;
  return (
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
  );
}
