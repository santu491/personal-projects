import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const ChatInit: OpenAPIParam = {
  description: 'Initiate a chat session',
  responses: {...RESPONSE},
  requestBody: {
    description: 'Chat initiation request object',
    required: true,
    content: {
      'application/json': {
        example: {
          Email: 'test@email.com',
          firstName: 'fName',
          lastName: 'lName',
          phone: '1234567890',
          lob: 'lob',
          latitude: '1111.00',
          longitude: '22232.00',
          ip: '127.0.0.0',
          browser: '',
          region: '',
          timezone: '',
          websiteorgin: '',
          websitetitle: '',
          gc_route: '',
        },
      },
    },
  },
};
