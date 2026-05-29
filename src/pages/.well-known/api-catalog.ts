import type { APIRoute } from 'astro';

import { API_ANCHOR, SITE_ORIGIN } from '../../lib/agentDiscovery';

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify(
      {
        linkset: [
          {
            anchor: API_ANCHOR,
            'service-desc': [
              {
                href: `${SITE_ORIGIN}/.well-known/openapi.json`,
                type: 'application/openapi+json'
              }
            ],
            'service-doc': [
              {
                href: `${SITE_ORIGIN}/docs/api`,
                type: 'text/html'
              }
            ],
            status: [
              {
                href: `${SITE_ORIGIN}/api/status`,
                type: 'application/json'
              }
            ]
          }
        ]
      },
      null,
      2
    ),
    {
      headers: {
        'content-type': 'application/linkset+json; charset=utf-8'
      }
    }
  );
};
