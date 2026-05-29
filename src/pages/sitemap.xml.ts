import type { APIRoute } from 'astro';

import { SITE_ORIGIN } from '../agentDiscovery';

const pageModules = import.meta.glob('./**/*.astro');

function routeFromPagePath(path: string) {
  if (path.includes('[')) return null;

  const route = path
    .replace(/^\.\//, '/')
    .replace(/\/index\.astro$/, '/')
    .replace(/\.astro$/, '/');

  return route === '/index.astro' ? '/' : route;
}

const routes = Array.from(
  new Set(
    Object.keys(pageModules)
      .map(routeFromPagePath)
      .filter((route): route is string => Boolean(route))
  )
).sort();

export const GET: APIRoute = () => {
  const urls = routes
    .map((route) => {
      const loc = new URL(route, SITE_ORIGIN).toString();
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8'
    }
  });
};
