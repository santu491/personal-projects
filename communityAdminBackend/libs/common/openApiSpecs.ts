export const DEFAULT_RESPONSES = {
  '200': {
    description: 'Success'
  },
  '401': {
    description: 'jwt token invalid/expired or missing'
  },
  '404': {
    description: 'data not found'
  },
  '500': {
    description: 'internal server error'
  },
  '503': {
    description: 'api timed out'
  }
};

export const DEFAULT_SECURITY: [{ [name: string]: string[] }] = [{ AccessToken: [] }];
