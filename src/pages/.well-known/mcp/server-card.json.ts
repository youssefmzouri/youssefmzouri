import type { APIRoute } from 'astro';

import { SITE_ORIGIN, jsonResponse } from '../../../agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    serverInfo: {
      name: 'youssefmzouri.dev',
      version: '1.0.0'
    },
    transport: {
      type: 'streamable-http',
      endpoint: `${SITE_ORIGIN}/mcp`
    },
    capabilities: {
      tools: {
        listChanged: false
      },
      resources: {
        subscribe: false,
        listChanged: false
      },
      prompts: {
        listChanged: false
      }
    }
  });
};
