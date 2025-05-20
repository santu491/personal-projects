import * as fs from 'fs';
import * as path from 'path';
import {getMetadataArgsStorage} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {getArgument} from './utils/common';

const handleServers = () => {
  const env = getArgument('env');
  const server = {
    url: '',
    description: '',
  };
  switch (env) {
    case 'dev1':
      server.url = 'https://dev1.api.mobile.carelon.com';
      server.description = 'DEV1';
      break;
    case 'dev2':
      server.url = 'https://dev2.api.mobile.carelon.com';
      server.description = 'DEV2';
      break;
    case 'sit1':
      server.url = 'https://sit1.api.mobile.carelon.com';
      server.description = 'SIT1';
      break;
    case 'sit2':
      server.url = 'https://sit2.api.mobile.carelon.com';
      server.description = 'SIT2';
      break;
    case 'uat1':
      server.url = 'https://uat1.api.mobile.carelon.com';
      server.description = 'UAT1';
      break;
    case 'uat2':
      server.url = 'https://uat2.api.mobile.carelon.com';
      server.description = 'UAT2';
      break;
    case 'prod':
    case 'dr':
      server.url = 'https://api.mobile.carelonbehavioralhealth.com';
      server.description = 'PROD';
      break;
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
  return server;
};

export const swaggerLoader = () => {
  const server = handleServers();
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(
    storage,
    {},
    {
      info: {
        title: 'Carelon Mobile APIs',
        version: '1.0.0',
      },
      servers: [
        server,
        {
          url: 'http://localhost:3000',
          description: 'Local',
        },
      ],
      components: {
        securitySchemes: {
          jwtAuth: {
            type: 'http',
            scheme: 'bearer',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
      security: [
        {
          jwtAuth: [],
        },
      ],
    },
  );
  const path1 = path.join(process.cwd(), `./swagger.json`);
  fs.writeFileSync(path1, JSON.stringify(spec, null, 4), 'utf-8');
  console.log(`Swagger Open API Spec generate at: ${path1}`);
};
