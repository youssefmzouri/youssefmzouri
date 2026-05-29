import type { APIRoute } from 'astro';

import { SITE_ORIGIN, jsonResponse } from '../../agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    status: 'ok',
    service: 'youssefmzouri.dev',
    resource: SITE_ORIGIN
  });
};
