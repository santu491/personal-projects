import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const GetAddressSpec: OpenAPIParam = {
  summary: 'Get the list of addresses',
  description: 'Get the list of addresses',
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const GetProvidersListSpec: OpenAPIParam = {
  summary: 'Get the list of providers',
  description: 'Get the list of providers',
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                data: {
                  query: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const SendEmailRequestSpec: OpenAPIParam = {
  summary: 'Send email to the user',
  description: 'Send email to the user',
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        example: {
          type: 'string',
          criteria: 'string',
          recipient: 'string',
          disclaimer: 'string',
          token: 'string',
          txtValue: 'string',
          timestamp: 'string',
        },
      },
    },
  },
};
