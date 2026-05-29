import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://youssefmzouri.dev",
  integrations: [preact()],
  adapter: cloudflare(),
});
