/** The fields of a GitHub repo the cards use; kept small so the cache is too. */
export interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
}

interface ApiRepo extends Repo {
  fork: boolean;
  private: boolean;
  archived: boolean;
}

const FALLBACK_LANGUAGE_COLOR = '#8e8e93';

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Jupyter Notebook': '#da5b0b',
  Shell: '#89e051',
};

export function languageColor(language: string): string {
  return languageColors[language] ?? FALLBACK_LANGUAGE_COLOR;
}

export function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? 'last month' : `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? 'last year' : `${years} years ago`;
}

/**
 * A user's own public, non-archived repos: described ones first, then most
 * recently pushed. Rejects on any API error or when there is nothing to show.
 */
export async function fetchRecentRepos(
  username: string,
  max: number,
  signal?: AbortSignal,
): Promise<Repo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
    { signal },
  );
  if (!response.ok) throw new Error('GitHub API error');
  const data = (await response.json()) as ApiRepo[];

  const repos = data
    .filter((repo) => !repo.fork && !repo.private && !repo.archived)
    .sort(
      (a, b) =>
        Number(Boolean(b.description)) - Number(Boolean(a.description)) ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    .slice(0, max)
    .map(({ name, html_url, description, language, pushed_at }) => ({
      name,
      html_url,
      description,
      language,
      pushed_at,
    }));

  if (!repos.length) throw new Error('No public repos');
  return repos;
}
