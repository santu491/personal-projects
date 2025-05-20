import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const NotificationSpec: OpenAPIParam = {
  summary: 'Handle notification actions like viewed, read, clearAll',
  description: 'Handle notification actions like viewed, read, clearAll',
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            notificationId: {
              type: 'string',
            },
            isRemoved: {
              type: 'boolean',
            },
            isCleared: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
