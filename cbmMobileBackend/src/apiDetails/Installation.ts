import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const SaveInstallationSpec: OpenAPIParam = {
  summary: 'Create a new installation details for user',
  requestBody: {
    content: {
      'application/json': {
        example: {
          appVersion: 'appVersion',
          locale: 'locale',
          platform: 'platform',
          deviceToken: 'deviceToken',
          timeZoneOffset: 0,
          osVersion: 'osVersion',
          badge: 0,
        },
      },
    },
  },
  responses: {...RESPONSE},
};

export const DeleteInstallationSpec: OpenAPIParam = {
  summary: 'Delete a device installation for a user',
  requestBody: {
    content: {
      'application/json': {
        example: {
          deviceToken: 'deviceToken',
        },
      },
    },
  },
  responses: {...RESPONSE},
};
