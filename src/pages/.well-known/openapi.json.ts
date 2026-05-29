import type { APIRoute } from 'astro';

import { SITE_ORIGIN } from '../../agentDiscovery';
import { jsonResponse } from '../../agentDiscovery';

export const GET: APIRoute = () => {
  return jsonResponse({
    openapi: '3.1.0',
    info: {
      title: 'Youssef Mzouri Site API',
      version: '1.0.0',
      description: 'Public discovery and status API for youssefmzouri.dev.'
    },
    servers: [
      {
        url: SITE_ORIGIN
      }
    ],
    paths: {
      '/api/status': {
        get: {
          summary: 'Get public site API status',
          operationId: 'getStatus',
          responses: {
            '200': {
              description: 'Current public status information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['status', 'service'],
                    properties: {
                      status: {
                        type: 'string',
                        enum: ['ok']
                      },
                      service: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
};
