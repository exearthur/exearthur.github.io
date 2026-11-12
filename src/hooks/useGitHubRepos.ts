import { useEffect, useState } from 'react';
import { fetchRecentRepos, type Repo } from '../lib/github';

interface Cached {
  ts: number;
  repos: Repo[];
}

export type ReposState =
  /** Nothing decided yet: before hydration, and in the prerendered HTML. */
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; repos: Repo[] }
  /** The fetch failed and there is no cache to fall back on. */
  | { status: 'unavailable' };

function readCache(key: string): Cached | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Cached) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, repos: Repo[]): void {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), repos }));
  } catch {
    /* Storage unavailable (private mode, quota); skip caching. */
  }
}

/**
 * The user's most recently pushed public repos, cached in localStorage so
 * repeat visits don't re-hit the rate-limited public API. A failed fetch
 * falls back to a stale cache when there is one.
 */
export function useGitHubRepos(username: string, max: number, cacheMinutes: number): ReposState {
  const [state, setState] = useState<ReposState>({ status: 'idle' });

  useEffect(() => {
    const cacheKey = `gh-repos:${username}:${max}`;
    const cached = readCache(cacheKey);
    if (cached && Date.now() - cached.ts < cacheMinutes * 60_000) {
      setState({ status: 'ready', repos: cached.repos });
      return;
    }

    setState({ status: 'loading' });
    const controller = new AbortController();
    fetchRecentRepos(username, max, controller.signal)
      .then((repos) => {
        setState({ status: 'ready', repos });
        writeCache(cacheKey, repos);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        // Stale cache beats nothing.
        setState(cached ? { status: 'ready', repos: cached.repos } : { status: 'unavailable' });
      });
    return () => controller.abort();
  }, [username, max, cacheMinutes]);

  return state;
}
