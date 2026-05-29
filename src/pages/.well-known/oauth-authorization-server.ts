import type { APIRoute } from 'astro';

import { SITE_ORIGIN, jsonResponse } from '../../agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    issuer: SITE_ORIGIN,
    authorization_endpoint: `${SITE_ORIGIN}/oauth/authorize`,
    token_endpoint: `${SITE_ORIGIN}/oauth/token`,
    jwks_uri: `${SITE_ORIGIN}/.well-known/jwks.json`,
    grant_types_supported: ['authorization_code', 'client_credentials'],
    response_types_supported: ['code'],
    scopes_supported: ['site:read']
  });
};
