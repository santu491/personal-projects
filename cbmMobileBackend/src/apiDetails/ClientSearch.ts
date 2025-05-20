import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const ClientSearch: OpenAPIParam = {
  summary: 'Search for clients',
  parameters: [
    {
      in: 'query',
      name: 'source',
      required: true,
      schema: {type: 'string'},
      description: 'The source of the request',
    },
    {
      in: 'query',
      name: 'client',
      schema: {type: 'string'},
      description: 'The client to be searched',
    },
    {
      in: 'query',
      name: 'searchData',
      required: true,
      schema: {type: 'string'},
      description: 'The data to be searched',
    },
  ],
  responses: {...RESPONSE},
};
