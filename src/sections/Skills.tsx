import { Reveal } from '../components/Reveal';
import { Section, type SectionProps } from '../components/Section';
import { skills } from '../data/skills';

export function Skills({ alt }: SectionProps) {
  return (
    <Section id="skills" alt={alt} title="Skills." subtitle="The tools I build with.">
      <Reveal as="dl" className="specs">
        {skills.map(({ label, items }) => (
          <div className="spec" key={label}>
            <dt>{label}</dt>
            <dd>
              <ul className="chips">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
