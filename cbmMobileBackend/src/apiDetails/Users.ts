import {RESPONSE} from '../utils/responseUtil';

export const ResetBadCountSpec = {
  description: 'This API will handle the PN badge count reset for IOS Devices',
  requestBody: {
    content: {
      'application/json': {
        example: {
          token: 'exampleToken123',
          deviceType: 'ios',
          badgeCount: 0,
        },
      },
    },
  },
  responses: {...RESPONSE},
};
