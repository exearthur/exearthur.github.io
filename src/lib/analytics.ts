import { features, site } from '../config/site';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * Google Analytics 4. Page views, scroll depth, outbound clicks (project,
 * GitHub, LinkedIn links) and file downloads come from GA4's Enhanced
 * Measurement; the listeners below add the events it can't see on its own.
 *
 * Only runs on the deployed site, so `npm run dev` and `npm run preview`
 * never pollute the numbers.
 */
export function initAnalytics(): void {
  const { measurementId } = features.analytics;
  if (!measurementId || !import.meta.env.PROD) return;
  if (location.hostname !== new URL(site.url).hostname) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  // gtag.js expects the real `arguments` object, not an array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  document.addEventListener('click', onClick, { capture: true });
  document.addEventListener('submit', onSubmit, { capture: true });
}

export function track(event: string, params?: Record<string, unknown>): void {
  window.gtag?.('event', event, params);
}

function onClick(e: MouseEvent): void {
  const link = (e.target as Element | null)?.closest?.('a[href]');
  if (!(link instanceof HTMLAnchorElement)) return;
  const href = link.getAttribute('href') ?? '';

  if (href.startsWith('mailto:')) track('contact_click', { method: 'email' });
  else if (href.startsWith('tel:')) track('contact_click', { method: 'phone' });
  else if (link.pathname === site.resume) track('resume_open', { link_text: link.textContent?.trim() });
}

function onSubmit(e: SubmitEvent): void {
  const form = e.target;
  if (form instanceof HTMLFormElement && form.action === features.contactForm.endpoint) {
    // A key event in GA4; sent via sendBeacon so it survives the page navigating away.
    track('generate_lead', { method: 'contact_form' });
  }
}
