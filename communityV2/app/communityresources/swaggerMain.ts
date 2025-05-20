/* eslint-disable no-console */
import { DEFAULT_SECURITY } from '@anthem/communityapi/common';
import { getArgument, StringUtils } from '@anthem/communityapi/utils';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as fs from 'fs';
import * as path from 'path';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import('./loaders/appInit').then(
  async (a) => {
    // Load Config and Init App in local
    // const result = await loadConfig(path.resolve('./app/communityresources/config/config.local.json'));
    // appConfigInit(result, null);
    a.appInit().then(() => {
      const schemas: { [schema: string]: unknown } = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/'
      });

      // Parse routing-controllers classes into OpenAPI spec:
      const storage = getMetadataArgsStorage();
      const spec = routingControllersToSpec(
        storage,
        {
          controllers: [],
          routePrefix: ''
        },
        /* All Possible Servers */
        {
          servers: [
            {
              url: 'http://localhost:8082',
              description: 'local-DEV'
            },
            {
              url: 'https://dev.api.sydney-community.com',
              description: 'DEV'
            },
            {
              url: 'https://dev1.api.sydney-community.com',
              description: 'DEV1'
            },
            {
              url: 'https://dev2.api.sydney-community.com',
              description: 'DEV2'
            },
            {
              url: 'https://sit.api.sydney-community.com',
              description: 'SIT'
            },
            {
              url: 'https://sit1.api.sydney-community.com',
              description: 'SIT1'
            },
            {
              url: 'https://sit2.api.sydney-community.com',
              description: 'SIT2'
            },
            {
              url: 'https://uat.api.sydney-community.com',
              description: 'UAT'
            },
            {
              url: 'https://uat1.api.sydney-community.com',
              description: 'UAT1'
            },
            {
              url: 'https://uat2.api.sydney-community.com',
              description: 'UAT2'
            },
            {
              url: 'https://perf.api.sydney-community.com',
              description: 'PERF'
            },
            {
              url: 'https://prod.api.sydney-community.com',
              description: 'PROD'
            },
            {
              url: 'https://dr.api.sydney-community.com',
              description: 'DR'
            }
          ],
          components: {
            schemas,
            securitySchemes: {
              AccessToken: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT Token that is retrieved from Auth API'
              }
            }
          },
          info: {
            description: 'Generated with `routing-controllers-openapi`',
            title: `${StringUtils.toTitleCase(getArgument('api'))} API`,
            version: '2.0.0'
          },
          security: DEFAULT_SECURITY
        }
      );
      //console.log(storage)
      const path1 = path.join(process.cwd(), `./api/${process.env.npm_config_app}/swagger/swagger.json`);
      fs.writeFileSync(path1, JSON.stringify(spec), 'utf-8');
      // tslint:disable
      // eslint-disable-next-line no-console
      console.log(`swagger generate at ${path1}`);
      // tslint:enable
      process.exit(0);
    });
  },
  (error) => {
    // tslint:disable
    // eslint-disable-next-line no-console
    console.error(error);
    // tslint:enable
  }
);
