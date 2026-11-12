import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = import.meta.dirname;

// Two real HTML pages (/, /contact.html), each with its own static <head> for
// crawlers and link previews. The server build (`vite build --ssr …`) supplies
// its own entry, so the page inputs only apply to the client build.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: isSsrBuild
    ? {}
    : {
        rolldownOptions: {
          input: {
            index: resolve(root, 'index.html'),
            contact: resolve(root, 'contact.html'),
          },
        },
      },
}));
