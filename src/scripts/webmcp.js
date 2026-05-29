(function registerWebMcpTools() {
  const modelContext = navigator.modelContext;

  if (!modelContext) return;

  const tools = [
    {
      name: 'get_site_summary',
      description: 'Return a concise summary of the public portfolio site.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {}
      },
      execute: async () => ({
        name: 'Youssef Mzouri',
        site: 'https://youssefmzouri.dev/',
        resources: [
          '/.well-known/api-catalog',
          '/.well-known/openapi.json',
          '/api/status',
          '/sitemap.xml'
        ]
      })
    },
    {
      name: 'get_public_resource',
      description: 'Fetch a public discovery resource from this site.',
      inputSchema: {
        type: 'object',
        required: ['path'],
        additionalProperties: false,
        properties: {
          path: {
            type: 'string',
            enum: [
              '/.well-known/api-catalog',
              '/.well-known/openapi.json',
              '/api/status',
              '/sitemap.xml',
              '/robots.txt'
            ]
          }
        }
      },
      execute: async ({ path }) => {
        const response = await fetch(path, {
          headers: {
            Accept: path.endsWith('.xml') || path.endsWith('.txt') ? 'text/plain' : 'application/json'
          }
        });

        return {
          status: response.status,
          contentType: response.headers.get('content-type'),
          body: await response.text()
        };
      }
    }
  ];

  const controller = new AbortController();
  const options = { signal: controller.signal };

  for (const tool of tools) {
    if (typeof modelContext.registerTool === 'function') {
      modelContext.registerTool(tool, options);
    } else if (typeof modelContext.provideContext === 'function') {
      modelContext.provideContext({ tools: [tool] }, options);
    }
  }
})();
