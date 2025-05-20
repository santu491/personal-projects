import { APP } from '@anthem/communityapi/utils';
import 'reflect-metadata';

let config = '';

if (!(APP as any).origConfig) {
  for (let index = 0; index < 10; index++) {
    const element = process.env[`npm_config_appConfig${index}`];
    if (element) {
      config += element;
    }
    else {
      break;
    }
  }
  (APP as any).origConfig = config;
}

(APP as any).config = JSON.parse((APP as any).origConfig);

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise rejection:', error);
  process.exit(1);
});
