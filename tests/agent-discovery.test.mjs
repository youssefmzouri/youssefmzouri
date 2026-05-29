import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, before, describe, it } from 'node:test';

const PORT = '4322';
const ORIGIN = `http://127.0.0.1:${PORT}`;
let preview;
let previewOutput = '';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${ORIGIN}/`);
      if (response.ok) return;
    } catch {
      await wait(250);
    }
  }

  throw new Error(`preview server did not start\n${previewOutput}`);
}

describe('agent discovery', () => {
  before(async () => {
    preview = spawn('npx', ['wrangler', 'pages', 'dev', 'dist', '--ip', '127.0.0.1', '--port', PORT], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    preview.stdout.on('data', (chunk) => {
      previewOutput += chunk;
    });
    preview.stderr.on('data', (chunk) => {
      previewOutput += chunk;
    });
    await waitForPreview();
  });

  after(() => {
    if (preview?.pid) {
      try {
        process.kill(-preview.pid);
      } catch {
        preview.kill();
      }
    }
  });

  it('publishes sitemap.xml and references it from robots.txt', async () => {
    const sitemap = await fetch(`${ORIGIN}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    assert.match(sitemap.headers.get('content-type') ?? '', /xml/);
    assert.match(await sitemap.text(), /<loc>https:\/\/youssefmzouri\.dev\/<\/loc>/);

    const robots = await fetch(`${ORIGIN}/robots.txt`);
    assert.equal(robots.status, 200);
    assert.match(await robots.text(), /Sitemap: https:\/\/youssefmzouri\.dev\/sitemap\.xml/);
  });

  it('adds agent discovery Link headers on the homepage', async () => {
    const response = await fetch(`${ORIGIN}/`);
    const link = response.headers.get('link') ?? '';

    assert.match(link, /<\/\.well-known\/api-catalog>; rel="api-catalog"/);
    assert.match(link, /<\/\.well-known\/agent-skills\/index\.json>; rel="describedby"/);
    assert.match(link, /<\/\.well-known\/openapi\.json>; rel="service-desc"/);
  });

  it('returns markdown when requested by agents', async () => {
    const response = await fetch(`${ORIGIN}/`, {
      headers: { Accept: 'text/markdown' }
    });

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') ?? '', /text\/markdown/);
    assert.match(response.headers.get('x-markdown-tokens') ?? '', /^\d+$/);
    assert.match(await response.text(), /^# /);
  });

  it('publishes API and auth discovery metadata', async () => {
    const catalog = await fetch(`${ORIGIN}/.well-known/api-catalog`);
    assert.equal(catalog.status, 200);
    assert.match(catalog.headers.get('content-type') ?? '', /application\/linkset\+json/);
    const catalogBody = await catalog.json();
    assert.ok(Array.isArray(catalogBody.linkset));
    assert.ok(catalogBody.linkset[0]['service-desc']);
    assert.ok(catalogBody.linkset[0]['service-doc']);
    assert.ok(catalogBody.linkset[0].status);

    for (const path of [
      '/.well-known/oauth-authorization-server',
      '/.well-known/oauth-protected-resource',
      '/.well-known/mcp/server-card.json',
      '/.well-known/agent-skills/index.json'
    ]) {
      const response = await fetch(`${ORIGIN}${path}`);
      assert.equal(response.status, 200, path);
      assert.match(response.headers.get('content-type') ?? '', /json/);
    }
  });

  it('loads WebMCP tool registration code on the homepage', async () => {
    const response = await fetch(`${ORIGIN}/`);
    const html = await response.text();

    assert.match(html, /modelContext/);
    assert.match(html, /registerTool|provideContext/);
  });
});
