/**
 * The control panel for the site. Identity, section order and visibility,
 * and feature switches all live here; the copy itself lives in `src/data/`.
 */

export const site = {
  name: 'Arthur Pacheco',
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

/** Height of the sticky nav in px. Keep in sync with `--nav-h` in style.css. */
export const NAV_HEIGHT = 48;

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
  contactForm: {
    enabled: true,
    endpoint: `https://formsubmit.co/${site.email}`,
    subject: 'New message from exearthur.github.io',
  },
};
