import type { APIRoute } from 'astro';

import { jsonResponse } from '../../lib/agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    keys: []
  });
};
