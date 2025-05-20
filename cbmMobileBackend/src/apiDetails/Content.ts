import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const GetContentSpec: OpenAPIParam = {
  summary: 'Get content details',
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'path',
      name: 'contentKey',
      required: true,
      schema: {
        type: 'string',
      },
    },
    {
      in: 'path',
      name: 'language',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
};
