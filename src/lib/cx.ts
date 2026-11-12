/** Join class names, skipping anything falsy: cx('nav', scrolled && 'is-scrolled'). */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** Spread onto links that leave the site. */
export const external = { target: '_blank', rel: 'noopener' } as const;
