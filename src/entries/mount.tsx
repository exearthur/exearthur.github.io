import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '../styles/style.css';

/**
 * Start a page in the browser. The deployed HTML already contains the
 * prerendered markup, so React attaches to it (hydrates); under `npm run dev`
 * the root is empty and React renders from scratch.
 */
export function mount(page: ReactNode): void {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root element');

  const app = <StrictMode>{page}</StrictMode>;
  if (root.firstElementChild) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}
