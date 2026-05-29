import type { APIRoute } from 'astro';

import { AGENT_SKILL_MARKDOWN, SITE_ORIGIN, jsonResponse, sha256Digest } from '../../../agentDiscovery';

export const GET: APIRoute = async () => {
  return jsonResponse({
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [
      {
        name: 'site-profile',
        type: 'skill-md',
        description: 'Understand the public portfolio, discovery metadata, and status resources on youssefmzouri.dev.',
        url: `${SITE_ORIGIN}/.well-known/agent-skills/site-profile/SKILL.md`,
        digest: await sha256Digest(AGENT_SKILL_MARKDOWN)
      }
    ]
  });
};
