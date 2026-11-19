import { useEffect, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { Section, type SectionProps } from '../components/Section';
import { ContributionSkyline, type PaletteInput } from '../components/ui/ContributionSkyline';
import { features, site } from '../config/site';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { cx, external } from '../lib/cx';
import { languageColor, timeAgo, type Repo } from '../lib/github';

const { username } = site.github;
const settings = features.github;

export function GitHubActivity({ alt }: SectionProps) {
  return (
    <Section id="github" alt={alt} title="On GitHub." subtitle="Recent public work, pulled live.">
      {settings.graph && (settings.skyline ? <Skyline /> : <ContributionGraph />)}
      {settings.repos && <RepoGrid />}
      <Reveal as="p" className="gh-more">
        <a className="link-arrow" href={`${site.github.url}?tab=repositories`} {...external}>
          All repositories on GitHub
        </a>
      </Reveal>
    </Section>
  );
}

/** The site accent (#0071e3) as four steps, lightest activity to heaviest. */
const skylinePalette: PaletteInput = {
  light: ['#b4d6fa', '#6aaef2', '#0071e3', '#004b97'],
  dark: ['#0b2c52', '#0f4d94', '#1f7ae0', '#6cb4ff'],
};

/**
 * Live contribution data as a heat map that rises into a 3D skyline when it
 * scrolls into view. Until the data arrives a placeholder holds the space;
 * if it can't be fetched (and nothing is cached) the plain image graph
 * stands in, so the section never comes up empty.
 */
function Skyline() {
  const state = useGitHubContributions(username, settings.cacheMinutes);
  if (state.status === 'unavailable') return <ContributionGraph />;

  return (
    <Reveal className="sky-wrap">
      {state.status === 'ready' ? (
        <ContributionSkyline
          data={state.days}
          palette={skylinePalette}
          headerExtra={
            <a className="sky-profile" href={site.github.url} {...external}>
              @{username}
            </a>
          }
        />
      ) : (
        <>
          <div className="sky sky-placeholder" aria-hidden="true" />
          <noscript>
            <img
              className="gh-graph"
              src={graphUrl}
              alt={`${site.name}'s GitHub contribution graph for the past year`}
              width={721}
              height={112}
            />
          </noscript>
        </>
      )}
    </Reveal>
  );
}

const graphUrl = `https://ghchart.rshah.org/${settings.graphColor}/${username}`;

function ContributionGraph() {
  // ghchart.rshah.org sends a 24h cache-control header, so a fixed URL can
  // show a day-stale graph. Once in the browser, append the current date so
  // a fresh image is fetched once per day.
  const [src, setSrc] = useState(graphUrl);
  useEffect(() => {
    setSrc(`${graphUrl}?_=${new Date().toISOString().slice(0, 10)}`);
  }, []);

  return (
    <Reveal className="gh-graph-wrap">
      <img
        className="gh-graph"
        src={src}
        alt={`${site.name}'s GitHub contribution graph for the past year`}
        width={721}
        height={112}
        loading="lazy"
      />
    </Reveal>
  );
}

/**
 * Cards for the most recently pushed repos. Hidden until the browser knows
 * whether it has a cached list; if the fetch fails with nothing cached it
 * stays hidden and the "All repositories" link below still does the job.
 */
function RepoGrid() {
  const state = useGitHubRepos(username, settings.maxRepos, settings.cacheMinutes);
  const ready = state.status === 'ready';

  // Cards mount at their hidden starting style; flipping this two frames
  // later lets the browser paint that first, so the fade-in actually runs.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!ready) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  return (
    <div
      className={cx('gh-repos', entered && 'is-loaded')}
      aria-live="polite"
      hidden={state.status === 'idle' || state.status === 'unavailable'}
    >
      {ready
        ? state.repos.map((repo) => <RepoCard repo={repo} key={repo.name} />)
        : Array.from({ length: settings.maxRepos }, (_, index) => (
            <div className="gh-repo gh-skeleton" aria-hidden="true" key={index} />
          ))}
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a className="gh-repo" href={repo.html_url} {...external} data-spotlight>
      <h3 className="gh-repo-name">{repo.name}</h3>
      {repo.description && <p className="gh-repo-desc">{repo.description}</p>}
      <p className="gh-repo-meta">
        {repo.language && (
          <>
            <span className="gh-lang-dot" style={{ background: languageColor(repo.language) }} />
            <span className="gh-lang">{repo.language}</span>
          </>
        )}
        <span className="gh-updated">Updated {timeAgo(repo.pushed_at)}</span>
      </p>
    </a>
  );
}
