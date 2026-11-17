import { Fragment } from 'react';
import { Reveal } from '../components/Reveal';
import { Section, type SectionProps } from '../components/Section';
import { Separated } from '../components/Separated';
import { coursework, honors, schools } from '../data/education';

export function Education({ alt }: SectionProps) {
  return (
    <Section id="education" alt={alt} title="Education." subtitle="Two campuses, one degree.">
      <div className="edu-grid stagger">
        {schools.map((school) => (
          <Reveal as="article" className="edu card" key={school.name} data-spotlight>
            <p className="meta">{school.period}</p>
            <h3 className="edu-school">{school.name}</h3>
            <p className="edu-degree">{school.degree}</p>
            <p className="edu-detail">
              <Separated items={[school.location, `GPA ${school.gpa}`]} />
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal as="dl" className="specs">
        <div className="spec">
          <dt>Coursework</dt>
          <dd>{coursework.join(', ')}</dd>
        </div>
        <div className="spec">
          <dt>Honors</dt>
          <dd>
            {honors.map(({ name, terms }, index) => (
              <Fragment key={name}>
                {index > 0 && <br />}
                {name} <span className="muted">({terms})</span>
              </Fragment>
            ))}
          </dd>
        </div>
      </Reveal>
    </Section>
  );
}
