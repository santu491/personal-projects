import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

const app = yargs.argv.app || process.env.npm_config_app || 'tcp';

const moduleAliases = `const moduleAlias = require("module-alias");
                  const dirPath = __dirname.replace('${`/app/${app}`}', '');
                  moduleAlias.addAliases({
                    '@anthem/communityadminapi'  : dirPath + '/libs',
                    '@tcp'  : dirPath + '/api/tcp'
                  });
                  moduleAlias();
                  `;

const data = fs.readFileSync(path.join(process.cwd(), `dist/app/${app}/main.js`), 'utf-8');
const newValue = moduleAliases + data;
fs.writeFileSync(path.join(process.cwd(), `dist/app/${app}/main.js`), newValue, 'utf-8');
