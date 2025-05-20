import * as jsonfile from 'jsonfile';
import * as path from 'path';
import * as yargs from 'yargs';

const tsconfig = require('../../tsconfig.json');

const app = yargs.argv.app || process.env.npm_config_app || 'irx';
const env = yargs.argv.env || process.env.npm_config_env || 'local';
const api = yargs.argv.api || process.env.npm_config_api || '';
const content: any = tsconfig;
content.include = ['lib/**/*', 'libs/middleware/**/*', 'workers/**/*', `app/${app}/**/*`, `api/${app}/**/*`];
if (env.indexOf('dev') >= 0) {
  content.include.push(`api/virtual-${app}/**/*`);
}
content.exclude = ['**/*.spec.ts', '**/*mocks.ts'];
content.compilerOptions.outDir = 'dist';

const filePath = path.join(process.cwd(), 'tsconfig.build.json');
jsonfile.writeFile(filePath, content, { spaces: 2 }, (err) => {
  if (err === null) {
    process.exit(0);
  } else {
    console.error('Failed to generate the tsconfig.build.json', err);
    process.exit(1);
  }
});
