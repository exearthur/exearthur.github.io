/**
 * The control panel for the site. Identity, section order and visibility,
 * and feature switches all live here; the copy itself lives in `src/data/`.
 */

export const site = {
  name: 'Arthur Pacheco',
  url: 'https://exearthur.github.io',
  email: 'arthur.amc.pacheco@gmail.com',
  phone: { display: '(678) 262‑8641', href: 'tel:+16782628641' },
  github: { username: 'exearthur', url: 'https://github.com/exearthur' },
  linkedin: {
    handle: 'arthur-amc-pacheco',
    url: 'https://www.linkedin.com/in/arthur-amc-pacheco',
  },
  resume: '/Arthur-Pacheco-Resume.pdf',
  copyrightYear: 2026,
} as const;

export const routes = {
  home: '/',
  contact: '/contact.html',
} as const;

/**
 * Height in px of the strip the floating nav pill sits in at the top of wider
 * screens. Keep in sync with `--nav-h` in style.css. (On phones the pill sits
 * at the bottom and takes no room at the top.)
 */
export const NAV_HEIGHT = 72;

export type SectionId = 'projects' | 'experience' | 'skills' | 'education' | 'github';

export interface SectionConfig {
  id: SectionId;
  /** Text of the nav link. */
  label: string;
  enabled: boolean;
}

/**
 * Home page sections, top to bottom. Reorder the entries to reorder the page,
 * or set `enabled: false` to drop one; the nav links and the alternating
 * section backgrounds follow automatically.
 */
export const sections: SectionConfig[] = [
  { id: 'projects', label: 'Projects', enabled: true },
  { id: 'experience', label: 'Experience', enabled: true },
  { id: 'skills', label: 'Skills', enabled: true },
  { id: 'education', label: 'Education', enabled: true },
  { id: 'github', label: 'GitHub', enabled: true },
];

export const enabledSections = sections.filter((section) => section.enabled);

export const features = {
  /** Fan the project screenshots out behind the hero portrait. */
  heroDeck: true,
  /** Fade sections in as they scroll into view. Off shows everything at once. */
  scrollReveal: true,
  /**
   * Show Experience as a timeline: a rail down the left with a beam that
   * fills as you scroll. Off falls back to plain rows divided by hairlines.
   */
  experienceTimeline: true,
  /** Cursor-following glow on cards (projects, education, repos, contact). */
  spotlight: true,
  /**
   * Home page welcome screen on a visitor's first load of the session:
   * greetings in several languages, then the panel lifts to reveal the hero.
   */
  intro: true,
  /** Contact headline: "hello" written out in one cursive stroke. Off shows plain text. */
  helloScript: true,
  github: {
    /** Contribution graph image. */
    graph: true,
    /** Hex colour (no #) the graph is drawn in. */
    graphColor: '0071e3',
    /** Live cards for the most recently pushed public repos. */
    repos: true,
    maxRepos: 4,
    /** How long a visitor's browser reuses the repo list before refetching. */
    cacheMinutes: 60,
  },
  analytics: {
    /**
     * Google Analytics 4 measurement ID (G-XXXXXXXXXX), from GA ->
     * Admin -> Data streams -> your web stream. Empty turns analytics off.
     */
    measurementId: 'G-7LTRB2K0GG',
  },
  contactForm: {
    enabled: true,
    endpoint: `https://formsubmit.co/${site.email}`,
    subject: 'New message from exearthur.github.io',
  },
};
