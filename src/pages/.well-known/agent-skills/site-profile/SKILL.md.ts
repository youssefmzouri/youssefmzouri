import type { APIRoute } from 'astro';

import { AGENT_SKILL_MARKDOWN } from '../../../../agentDiscovery';

export const GET: APIRoute = () => {
  return new Response(AGENT_SKILL_MARKDOWN, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8'
    }
  });
};
