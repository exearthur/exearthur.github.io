import { Picture } from '../components/Picture';
import { Reveal } from '../components/Reveal';
import { Section, type SectionProps } from '../components/Section';
import { Separated } from '../components/Separated';
import {
  projects,
  type FeatureProject,
  type Project,
  type TileMedia,
  type TileProject,
} from '../data/projects';
import { external } from '../lib/cx';

const featured = projects.filter((project) => project.layout === 'feature');
const tiles = projects.filter((project) => project.layout === 'tile');

export function Projects({ alt }: SectionProps) {
  return (
    <Section id="projects" alt={alt} title="Selected work." subtitle="Built, tested, and deployed.">
      {featured.map((project) => (
        <Feature project={project} key={project.title} />
      ))}
      {tiles.length > 0 && (
        <div className="tiles stagger">
          {tiles.map((project) => (
            <Tile project={project} key={project.title} />
          ))}
        </div>
      )}
    </Section>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <p className="meta">
      <Separated
        items={[
          project.live && (
            <span className="live">
              <span className="dot" aria-hidden="true" />
              Live
            </span>
          ),
          project.date,
          project.note,
        ]}
      />
    </p>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="stack" aria-label="Technology used">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Feature({ project }: { project: FeatureProject }) {
  const { primaryLink, secondaryLink, screenshot } = project;
  return (
    <Reveal as="article" className="feature">
      <div className="feature-head">
        <div className="feature-intro">
          <ProjectMeta project={project} />
          <h3 className="feature-title">{project.title}</h3>
          <p className="feature-desc">{project.description}</p>
        </div>
        <div className="feature-links">
          <a className="btn" href={primaryLink.href} {...external}>
            {primaryLink.label}
          </a>
          {secondaryLink && (
            <a className="link-arrow" href={secondaryLink.href} {...external}>
              {secondaryLink.label}
            </a>
          )}
        </div>
      </div>

      <div className="window">
        <div className="window-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Picture image={screenshot.image} alt={screenshot.alt} loading="lazy" />
      </div>

      <ul className="decisions">
        {project.decisions.map(({ title, body }) => (
          <li key={title}>
            <h4>{title}</h4>
            <p>{body}</p>
          </li>
        ))}
      </ul>

      <Stack items={project.stack} />
    </Reveal>
  );
}

function Tile({ project }: { project: TileProject }) {
  return (
    <Reveal as="article" className="tile">
      <div className="tile-copy">
        <ProjectMeta project={project} />
        <h3 className="tile-title">{project.title}</h3>
        <p className="tile-desc">{project.description}</p>
        <Stack items={project.stack} />
      </div>
      <TileMediaView media={project.media} />
    </Reveal>
  );
}

function TileMediaView({ media }: { media: TileMedia }) {
  if (media.kind === 'screenshot') {
    return (
      <div className="tile-media tile-media-shot">
        <Picture image={media.image} alt={media.alt} loading="lazy" />
      </div>
    );
  }
  return <CardScan />;
}

/** Business-card scan illustration: a card, a scan line, the parsed result. */
function CardScan() {
  return (
    <div className="tile-media tile-media-card" aria-hidden="true">
      <div className="bizcard">
        <div className="bizcard-line bizcard-name" />
        <div className="bizcard-line" />
        <div className="bizcard-line short" />
        <div className="scanline" />
      </div>
      <div className="bizcard-json">
        <span className="k">"name"</span>: <span className="v">"Jane Doe"</span>,<br />
        <span className="k">"company"</span>: <span className="v">"Acme Co."</span>,<br />
        <span className="k">"email"</span>: <span className="v">"jane@acme.co"</span>
      </div>
    </div>
  );
}
