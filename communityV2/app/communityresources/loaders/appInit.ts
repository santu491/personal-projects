import { configLoader, expressLoader, iocLoader } from '@anthem/communityapi/loaders';
import { LoggerFactory } from '@anthem/communityapi/logger';
import { APP, getApiArgument } from '@anthem/communityapi/utils';
import { bootstrapMicroframework } from 'microframework';

export const appInit = () => {
  return bootstrapMicroframework({
    loaders: [
      iocLoader,
      expressLoader,
      configLoader
    ]
  })
    .then(() => {
      LoggerFactory.getLogger(__filename).info(`App ${getApiArgument('api') || 'all'} started on ports ${APP.config.app.port} ${APP.config.app.httpsPort}!!!`);
    })
    .catch((error) => {
      LoggerFactory.getLogger(__filename).error(`App ${getApiArgument('api') || 'all'} crashed: ${error.stack || error.message || error}`);
    });
};
