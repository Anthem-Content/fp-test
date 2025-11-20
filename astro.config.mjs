// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Set base path for GitHub Pages deployment
  // For local dev, this is ignored. For production, paths will be prefixed with /fp-test/
  site: 'https://anthem-content.github.io',
  base: '/fp-test',

  content: {
    collections: ['examples'],
  },
});
