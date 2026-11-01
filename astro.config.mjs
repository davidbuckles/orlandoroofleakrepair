import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import config from './site.config.json' with { type: 'json' };

// Writes Netlify's _redirects so www always 301s to the bare domain.
const netlifyRedirects = {
  name: 'netlify-redirects',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const domain = config.site.domain;
      const rules = [
        `http://www.${domain}/*  https://${domain}/:splat  301!`,
        `https://www.${domain}/*  https://${domain}/:splat  301!`,
      ];
      writeFileSync(fileURLToPath(new URL('_redirects', dir)), rules.join('\n') + '\n');
    },
  },
};

export default defineConfig({
  site: config.site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thank-you/') && !page.includes('/404') }),
    netlifyRedirects,
  ],
  vite: { plugins: [tailwindcss()] },
});
