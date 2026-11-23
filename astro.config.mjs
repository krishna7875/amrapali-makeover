import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';

const business = JSON.parse(
  fs.readFileSync(new URL('./src/config/business.json', import.meta.url), 'utf8')
);

// https://astro.build/config
export default defineConfig({
  site: business.seo.siteUrl,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
