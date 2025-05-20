import { KEYS, variableNames } from '@anthem/communityadminapi/common';

const fs = require('fs');

export function readEnvVar(varName: string) {
  const content = fs.readFileSync(variableNames.ENV_FILE_PATH, KEYS.UTF8);
  const vars = content
    .split('\n')
    .map((a) => a.trim())
    .filter((a) => a.indexOf(`${varName}`) >= 0);
  if (vars.length) {
    fs.writeFileSync('./variables/log', vars[0]);
    return vars[0].replace(`${varName}${variableNames.ASSIGNMENT}`, '');
  }

  return '';
}
