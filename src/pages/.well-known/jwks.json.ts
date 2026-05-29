import type { APIRoute } from 'astro';

import { jsonResponse } from '../../agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    keys: []
  });
};
