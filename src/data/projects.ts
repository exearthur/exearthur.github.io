import { images, type ImageAsset } from './images';

export interface ProjectLink {
  label: string;
  href: string;
}

interface ProjectBase {
  title: string;
  date: string;
  /** Shows the green "Live" marker before the date. */
  live?: boolean;
  /** Extra context shown after the date, e.g. where it was deployed. */
  note?: string;
  description: string;
  stack: string[];
}

/** Full-width case study: links, a framed screenshot, and design decisions. */
export interface FeatureProject extends ProjectBase {
  layout: 'feature';
  primaryLink: ProjectLink;
  secondaryLink?: ProjectLink;
  screenshot: { image: ImageAsset; alt: string };
  decisions: { title: string; body: string }[];
}

export type TileMedia =
  | { kind: 'screenshot'; image: ImageAsset; alt: string }
  /** The animated business-card scan illustration. */
  | { kind: 'card-scan' };

/** Half-width tile: short description above a piece of media. */
export interface TileProject extends ProjectBase {
  layout: 'tile';
  media: TileMedia;
}

export type Project = FeatureProject | TileProject;

/** Feature projects render first, then tiles in a two-column grid. */
export const projects: Project[] = [
  {
    layout: 'feature',
    title: 'LiveFlightWatch',
    date: 'September 2026',
    live: true,
    description:
      'A full‑stack flight tracker modeled on airport departure boards. Live departures and arrivals for airports worldwide, plus lookup by flight number.',
    primaryLink: { label: 'Open live demo', href: 'https://live-flight-watch.vercel.app' },
    secondaryLink: {
      label: 'Source on GitHub',
      href: 'https://github.com/exearthur/LiveFlightWatch',
    },
    screenshot: {
      image: images.flightwatch,
      alt: 'LiveFlightWatch showing live departures from JFK with airline, destination, times, gate, and status columns',
    },
    decisions: [
      {
        title: 'A backend that can change providers',
        body: 'The FastAPI backend is a thin adapter layer over the AviationStack API, so the upstream data source can be swapped without touching a route handler. An in‑memory TTL cache cuts redundant third‑party calls.',
      },
      {
        title: 'Failure modes handled on purpose',
        body: 'On HTTP 429 the app enters a dedicated quota‑reached state and pauses polling instead of showing a generic error. Other provider failures pass through as a 502.',
      },
      {
        title: 'Searches you can share',
        body: 'The React 19 and TypeScript client uses TanStack Query for data and keeps filters in the URL, so any search is shareable and browser history works as expected.',
      },
      {
        title: 'Tested on every push',
        body: 'pytest covers the API and Vitest covers the client. GitHub Actions runs both suites on every push and pull request.',
      },
    ],
    stack: [
      'React 19',
      'TypeScript',
      'TanStack Query',
      'Tailwind CSS',
      'Python',
      'FastAPI',
      'pytest',
      'Vitest',
      'GitHub Actions',
      'Vercel',
      'Render',
    ],
  },
  {
    layout: 'tile',
    title: 'Movie Ticket Booking System',
    date: 'December 2025',
    description:
      'A Java backend with MongoDB that handles seat reservation and the full booking workflow, validated with test cases across varied input scenarios.',
    stack: ['Java', 'MongoDB'],
    media: {
      kind: 'screenshot',
      image: images.cinemabook,
      alt: 'Athens CinemaBook movie listing with search, genre filter, and showtimes',
    },
  },
  {
    layout: 'tile',
    title: 'AI‑Powered Business Card Scanner',
    date: 'July 2024',
    note: 'Deployed at IRC Consulting',
    description:
      'A Python script that uses the OpenAI API to extract and structure contact details from scanned business cards. Used internally to enter trade show leads without manual typing.',
    stack: ['Python', 'OpenAI API'],
    media: { kind: 'card-scan' },
  },
];
