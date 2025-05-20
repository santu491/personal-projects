import { DEFAULT_SECURITY } from '@anthem/communityadminapi/common';
import { getArgument, StringUtils } from '@anthem/communityadminapi/utils';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as fs from 'fs';
import * as path from 'path';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

export async function loadConfig(configPath: string) {
  try {
    let config;
    await import(configPath)
      .then((module) => (config = module))
      .catch((error) =>
        // eslint-disable-next-line no-console
        console.log(
          `config load error ${JSON.stringify(error)} ---> ${configPath}`
        )
      );
    return config;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `config load error ${JSON.stringify(error)} ---> ${configPath}`
    );
  }
  return {};
}

Promise.all([loadConfig('./config/config.common.json'), loadConfig('./config/config.default.common.json'), loadConfig(`./config/config.${getArgument('env').replace(/\d/g, '')}.common.json`), loadConfig(`./config/config.${ getArgument('env')}.json`)]).then(
  (result) => {
    // const appConfig = mergeConfigs(result[0].COMMON_CONFIG, result[1].DEFAULT_COMMON_CONFIG, result[2].ENV_COMMON_CONFIG, result[3].ENV_CONFIG);
    // appConfigInit(appConfig, null, null);
    import('./loaders/appInit').then(
      (a) => {
        a.appInit().then(() => {
          const schemas = validationMetadatasToSchemas({
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
            /**
             * All Possible Servers
             */
            {
              servers: [
                {
                  url: 'https://dev.admin.sydney-community.com',
                  description: 'DEV'
                },
                {
                  url: 'https://sit.admin.sydney-community.com',
                  description: 'SIT'
                },
                {
                  url: 'https://uat.admin.sydney-community.com',
                  description: 'UAT'
                },
                {
                  url: 'https://perf.admin.sydney-community.com',
                  description: 'PERF'
                },
                {
                  url: 'https://prod.admin.sydney-community.com',
                  description: 'PROD'
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
  },
  (error) => {
    // tslint:disable
    // eslint-disable-next-line no-console
    console.error(error);
    // tslint:enable
  }
);
