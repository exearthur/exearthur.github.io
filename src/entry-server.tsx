/**
 * Build-time only: renders each page to an HTML string for
 * scripts/prerender.mjs. Never shipped to the browser.
 */
import { StrictMode, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';

/** Built HTML file -> the page rendered into it. Mirrors `src/entries/`. */
const pages: Record<string, ReactNode> = {
  'index.html': <HomePage />,
  'contact.html': <ContactPage />,
};

export const pageFiles = Object.keys(pages);

export function render(file: string): string {
  if (!(file in pages)) throw new Error(`No page registered for ${file}`);
  return renderToString(<StrictMode>{pages[file]}</StrictMode>);
}
