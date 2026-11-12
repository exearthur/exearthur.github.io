/**
 * Build step 3 of 3 (see "build" in package.json).
 *
 * The client build leaves an empty <div id="root"><!--app--></div> in each
 * page. This renders the matching React page to HTML and drops it into that
 * placeholder, so the deployed site paints immediately, reads fine without
 * JavaScript, and gives crawlers real content. The browser then hydrates the
 * same markup instead of rebuilding it.
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, 'dist-ssr');
const PLACEHOLDER = '<!--app-->';

const { pageFiles, render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

for (const file of pageFiles) {
  const path = resolve(dist, file);
  const html = await readFile(path, 'utf8');
  if (!html.includes(PLACEHOLDER)) {
    throw new Error(`${file}: missing ${PLACEHOLDER} placeholder inside #root`);
  }
  // Replacer function, so `$` sequences in the markup are never treated as patterns.
  await writeFile(path, html.replace(PLACEHOLDER, () => render(file)));
  console.log(`prerendered ${file}`);
}

await rm(ssrDir, { recursive: true, force: true });
