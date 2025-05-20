import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const TelehealthSpec: OpenAPIParam = {
  summary: 'Create MDLive Appointment',
  description: 'Create MDLive Appointment',
  security: [{bearerAuth: []}],
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        example: {
          questionnaire: {
            problemType: 'problemType',
          },
        },
      },
    },
  },
};
