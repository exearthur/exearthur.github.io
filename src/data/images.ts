/** Files live in `public/images/` and are served from `/images/…` unchanged. */
export interface ImageAsset {
  /** Fallback file every browser can show. */
  src: string;
  /** Smaller AVIF version, used when the browser supports it. */
  avif?: string;
  /** Intrinsic size, so the browser reserves space before the file loads. */
  width: number;
  height: number;
}

export const images = {
  headshot: {
    src: '/images/headshot-web.jpg',
    avif: '/images/headshot.avif',
    width: 933,
    height: 1400,
  },
  flightwatch: {
    src: '/images/project-flightwatch.png',
    avif: '/images/project-flightwatch.avif',
    width: 1600,
    height: 660,
  },
  cinemabook: {
    src: '/images/project-cinemabook.png',
    avif: '/images/project-cinemabook.avif',
    width: 1100,
    height: 590,
  },
} satisfies Record<string, ImageAsset>;
