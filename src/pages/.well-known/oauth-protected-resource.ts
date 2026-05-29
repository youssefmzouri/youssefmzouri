import type { APIRoute } from 'astro';

import { SITE_ORIGIN, jsonResponse } from '../../agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    resource: `${SITE_ORIGIN}/api`,
    authorization_servers: [SITE_ORIGIN],
    scopes_supported: ['site:read']
  });
};
