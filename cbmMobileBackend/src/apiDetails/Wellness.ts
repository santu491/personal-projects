import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const GetMonthlyResourcesSpec: OpenAPIParam = {
  summary: 'Get all the resources/topics updated in that month',
  description: 'Get all the resources/topics updated in that month',
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'query',
      name: 'month',
      required: true,
      schema: {
        type: 'string',
        example: '06',
      },
    },
  ],
};

export const GetTopicsSpec: OpenAPIParam = {
  summary: 'Get all the topics',
  description: 'Get all the topics',
  responses: {...RESPONSE},
};
