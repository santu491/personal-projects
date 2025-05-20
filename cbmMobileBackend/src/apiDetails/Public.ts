import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const PublicAuthSpec: OpenAPIParam = {
  summary: 'Public Access Token for the Client',
  requestBody: {
    content: {
      'application/json': {
        example: {
          clientId: 'clientId',
        },
      },
    },
  },
  responses: {...RESPONSE},
};

export const NotifySpec: OpenAPIParam = {
  summary: 'Manually trigger PN for Users',
  requestBody: {
    content: {
      'application/json': {
        example: {
          test: 'yes/no',
          env: 'dev1',
        },
      },
    },
  },
  responses: {...RESPONSE},
};

export const ForceAppUpdateSpec: OpenAPIParam = {
  summary: 'Check if app update is required',
  description: 'Check if app update is required',
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'header',
      name: 'version',
      required: true,
      schema: {
        type: 'string',
      },
    },
    {
      in: 'header',
      name: 'platform',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
};

export const EncryptSpec: OpenAPIParam = {
  summary: 'Encrypt data',
  requestBody: {
    content: {
      'application/json': {
        example: {
          text: 'text',
        },
      },
    },
  },
  responses: {...RESPONSE},
};

export const DecryptSpec: OpenAPIParam = {
  summary: 'Decrypt data',
  requestBody: {
    content: {
      'application/json': {
        example: {
          encryptedText: 'encryptedText',
        },
      },
    },
  },
  responses: {...RESPONSE},
};
