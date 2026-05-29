import { defineMiddleware } from 'astro:middleware';

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToMarkdown(html: string) {
  const title = html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.trim();
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const markdown = main
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const body = decodeEntities(markdown);
  return body.startsWith('# ') || !title ? body : `# ${decodeEntities(title)}\n\n${body}`;
}

function markdownTokenCount(markdown: string) {
  return String(markdown.split(/\s+/).filter(Boolean).length);
}

function wantsMarkdown(request: Request) {
  return request.headers.get('accept')?.toLowerCase().includes('text/markdown') ?? false;
}

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const response = await next();
  const headers = new Headers(response.headers);

  if (url.pathname === '/' || url.pathname === '/index.html') {
    headers.append('Link', '</.well-known/api-catalog>; rel="api-catalog"');
    headers.append('Link', '</.well-known/openapi.json>; rel="service-desc"; type="application/openapi+json"');
    headers.append('Link', '</docs/api>; rel="service-doc"; type="text/html"');
    headers.append('Link', '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"');
    headers.append('Link', '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"');
  }

  if (wantsMarkdown(request) && headers.get('content-type')?.includes('text/html')) {
    const markdown = htmlToMarkdown(await response.text());
    headers.set('content-type', 'text/markdown; charset=utf-8');
    headers.set('x-markdown-tokens', markdownTokenCount(markdown));

    return new Response(markdown, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
});
