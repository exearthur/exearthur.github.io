import { useEffect, useState } from 'react';
import { fetchContributions, type ContributionDay } from '../lib/github';

interface Cached {
  ts: number;
  days: ContributionDay[];
}

export type ContributionsState =
  /** Nothing decided yet: before hydration, and in the prerendered HTML. */
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; days: ContributionDay[] }
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

function writeCache(key: string, days: ContributionDay[]): void {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), days }));
  } catch {
    /* Storage unavailable (private mode, quota); skip caching. */
  }
}

/**
 * A year of daily contribution counts, cached in localStorage like the repo
 * list. A failed fetch falls back to a stale cache when there is one.
 */
export function useGitHubContributions(username: string, cacheMinutes: number): ContributionsState {
  const [state, setState] = useState<ContributionsState>({ status: 'idle' });

  useEffect(() => {
    const cacheKey = `gh-contrib:${username}`;
    const cached = readCache(cacheKey);
    if (cached && Date.now() - cached.ts < cacheMinutes * 60_000) {
      setState({ status: 'ready', days: cached.days });
      return;
    }

    setState({ status: 'loading' });
    const controller = new AbortController();
    fetchContributions(username, controller.signal)
      .then((days) => {
        setState({ status: 'ready', days });
        writeCache(cacheKey, days);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState(cached ? { status: 'ready', days: cached.days } : { status: 'unavailable' });
      });
    return () => controller.abort();
  }, [username, cacheMinutes]);

  return state;
}
