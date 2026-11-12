import type { Ref } from 'react';
import { Picture } from '../components/Picture';
import { features, site } from '../config/site';
import { images } from '../data/images';
import { profile } from '../data/profile';
import { external } from '../lib/cx';

interface HeroProps {
  /** Attached to the portrait so the nav knows when it has scrolled away. */
  portraitRef: Ref<HTMLElement>;
}

export function Hero({ portraitRef }: HeroProps) {
  return (
    <header className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">{profile.kicker}</p>
          <h1 className="hero-title">
            <span className="mask">
              <span className="mask-in">{site.name}</span>
            </span>
          </h1>
          <p className="hero-lead">{profile.lead}</p>
          <div className="actions">
            <a className="btn" href={site.resume} {...external}>
              View résumé
            </a>
            <a className="link-arrow" href={site.github.url} {...external}>
              GitHub
            </a>
          </div>
        </div>

        {/* The portrait is the top card of a small deck; the two cards behind
            it are the project screenshots shown further down, so they are
            decorative here and hidden from assistive tech. */}
        <div className="hero-deck">
          {features.heroDeck && (
            <>
              <Picture image={images.flightwatch} alt="" className="deck-card deck-card-a" hidden />
              <Picture image={images.cinemabook} alt="" className="deck-card deck-card-b" hidden />
            </>
          )}
          <figure className="hero-figure" ref={portraitRef}>
            <Picture
              image={images.headshot}
              alt={`Portrait of ${site.name}`}
              imgClassName="hero-photo"
              fetchPriority="high"
            />
          </figure>
        </div>
      </div>

      <div className="container">
        <dl className="facts">
          {profile.facts.map(({ label, value }) => (
            <div className="fact" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
