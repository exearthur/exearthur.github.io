/**
 * Progressive enhancements for the site. Everything here is optional:
 * the pages are fully readable with JavaScript disabled, and every
 * effect respects the user's reduced-motion preference.
 */
(function () {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;

  /**
   * Run `onEnter` once for each matched element the first time it scrolls
   * into view. Falls back to running immediately when observation isn't
   * possible or motion is reduced.
   */
  function onFirstView(selector, onEnter, options) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (reduceMotion || !canObserve) {
      elements.forEach(onEnter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        observer.unobserve(entry.target);
      });
    }, options);

    elements.forEach((el) => observer.observe(el));
  }

  /* Nav: show a soft shadow once the page has scrolled. */
  const nav = document.getElementById('nav');
  if (nav) {
    const update = () => nav.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Scroll reveal: elements fade and rise into place as they appear. */
  onFirstView('.reveal', (el) => el.classList.add('is-in'), {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1,
  });

  /* Stat counters: "68K+" counts up from 0 while keeping its suffix. */
  onFirstView('[data-count]', (el) => {
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match || reduceMotion) return;

    const target = Number(match[1]);
    const suffix = match[2];
    const duration = 1400;
    let start;

    const step = (now) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });

  /* Hero portrait: a subtle 3D tilt that follows a fine pointer. */
  const photo = document.querySelector('.hero-photo-wrap');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (photo && finePointer && !reduceMotion) {
    const hero = photo.closest('.hero');
    const maxTilt = 6;

    hero.addEventListener('mousemove', (e) => {
      const r = photo.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      photo.style.transform =
        `perspective(1200px) rotateY(${(x * maxTilt).toFixed(2)}deg) rotateX(${(-y * maxTilt).toFixed(2)}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      photo.style.transform = '';
    });
  }

  /* GitHub contribution graph: ghchart.rshah.org sends a 24h cache-control
     header, so a static <img src> can show a day-stale graph. Append the
     current date so the browser fetches a fresh image once per day. */
  const ghGraph = document.getElementById('gh-graph');
  if (ghGraph) {
    const today = new Date().toISOString().slice(0, 10);
    ghGraph.src = `${ghGraph.src}?_=${today}`;
  }

  /* GitHub activity: fetch top repos for the live section, with a
     1-hour cache so repeat visits don't re-hit the (rate-limited)
     public API, and a graceful link-out if the fetch ever fails. */
  const ghRepos = document.getElementById('gh-repos');
  if (ghRepos) {
    const username = 'exearthur';
    const cacheKey = 'gh-repos-cache-v1';
    const cacheTTL = 60 * 60 * 1000; // 1 hour
    const fallback = document.getElementById('gh-fallback');

    const langColors = {
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

    function timeAgo(dateStr) {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const days = Math.floor(diffMs / 86400000);
      if (days < 1) return 'today';
      if (days === 1) return 'yesterday';
      if (days < 30) return `${days}d ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months}mo ago`;
      return `${Math.floor(months / 12)}y ago`;
    }

    function readCache() {
      try {
        const raw = localStorage.getItem(cacheKey);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function writeCache(repos) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), repos }));
      } catch (e) {
        /* Storage unavailable (private mode, quota); skip caching. */
      }
    }

    function renderRepos(repos) {
      ghRepos.hidden = false;
      ghRepos.innerHTML = '';
      repos.forEach((repo) => {
        const card = document.createElement('a');
        card.className = 'gh-repo card lift';
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener';

        const nameEl = document.createElement('div');
        nameEl.className = 'gh-repo-head';

        const name = document.createElement('h3');
        name.className = 'gh-repo-name';
        name.textContent = repo.name;

        const stars = document.createElement('span');
        stars.className = 'gh-repo-stars';
        stars.innerHTML = '<svg class="icon-star-sm"><use href="#icon-star" /></svg>';
        stars.append(String(repo.stargazers_count || 0));

        nameEl.append(name, stars);

        const desc = document.createElement('p');
        desc.className = 'gh-repo-desc';
        desc.textContent = repo.description || 'No description yet.';

        const meta = document.createElement('div');
        meta.className = 'gh-repo-meta';
        if (repo.language) {
          const langDot = document.createElement('span');
          langDot.className = 'gh-lang-dot';
          langDot.style.background = langColors[repo.language] || '#8e8e93';
          const langName = document.createElement('span');
          langName.textContent = repo.language;
          meta.append(langDot, langName);
        }
        const updated = document.createElement('span');
        updated.textContent = `Updated ${timeAgo(repo.pushed_at)}`;
        meta.append(updated);

        card.append(nameEl, desc, meta);
        ghRepos.appendChild(card);
      });
      requestAnimationFrame(() => ghRepos.classList.add('is-loaded'));
    }

    function showFallback() {
      ghRepos.hidden = true;
      if (fallback) fallback.hidden = false;
    }

    const cached = readCache();
    if (cached && Date.now() - cached.ts < cacheTTL) {
      renderRepos(cached.repos);
    } else {
      ghRepos.hidden = false;
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`)
        .then((res) => {
          if (!res.ok) throw new Error('GitHub API error');
          return res.json();
        })
        .then((data) => {
          const repos = data
            .filter((r) => !r.fork && !r.private)
            .sort((a, b) => (b.stargazers_count - a.stargazers_count)
              || (new Date(b.pushed_at) - new Date(a.pushed_at)))
            .slice(0, 4);
          if (!repos.length) throw new Error('No public repos');
          renderRepos(repos);
          writeCache(repos);
        })
        .catch(() => {
          if (cached) {
            renderRepos(cached.repos); // Stale cache beats nothing.
          } else {
            showFallback();
          }
        });
    }
  }
})();
