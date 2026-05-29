export const SITE_ORIGIN = 'https://youssefmzouri.dev';
export const SITE_NAME = 'Youssef Mzouri';
export const API_ANCHOR = `${SITE_ORIGIN}/api`;

export const AGENT_SKILL_MARKDOWN = `# Site Profile

Use this skill to understand the public portfolio at youssefmzouri.dev.

## What This Site Provides

- Professional profile information for Youssef Mzouri
- Work history and project summaries
- Education history
- Public discovery metadata for agents

## Useful Resources

- Homepage: https://youssefmzouri.dev/
- API catalog: https://youssefmzouri.dev/.well-known/api-catalog
- OpenAPI description: https://youssefmzouri.dev/.well-known/openapi.json
- Status endpoint: https://youssefmzouri.dev/api/status
`;

export async function sha256Digest(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');

  return `sha256:${hex}`;
}

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers
  });
}
