import * as fs from 'fs';
import * as path from 'path';

export function getAwsDefinition(app: string) {
  const awsDef = [];
  fs.readdirSync(path.join(process.cwd(), `api/${app}`)).forEach((fn: any) => {
    const fPath = path.join(process.cwd(), `api/${app}/${fn}/aws-definition.json`);
    if (fs.existsSync(fPath)) {
      awsDef.push(JSON.parse(fs.readFileSync(fPath, { encoding: 'utf-8' })));
    }
  });

  return awsDef;
}
