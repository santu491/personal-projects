import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';
import * as yargs from 'yargs';
import { getAwsDefinition } from './awd-def';

const imageName = yargs.argv.image || process.env.npm_config_image || '';
const app: any = yargs.argv.app || process.env.npm_config_app || 'tcp';
const file: any = yargs.argv.file || process.env.npm_config_file || '';
const file1: any = yargs.argv.file1 || process.env.npm_config_file1 || '';
const svcs: any = ((yargs.argv.svcs || process.env.npm_config_svcs || '') as any);

// eslint-disable-next-line complexity
function main() {
  if (!file || !imageName || !file1) {
    console.error('file path or image name missing');
  } else {
    let affectedServices = svcs.split('|');
    if (!affectedServices.length || svcs.indexOf(',') >= 0) {
      affectedServices = svcs.split(',');
    }
    const awsDef = getAwsDefinition(app);
    let currentAwsDef: any;
    const fPath = path.join(process.cwd(), `${file1}`);
    if (fs.existsSync(fPath)) {
      currentAwsDef = JSON.parse(fs.readFileSync(fPath, { encoding: 'utf-8' }));
    }
    const imageDef = JSON.parse(fs.readFileSync(path.join(process.cwd(), `${file}`), { encoding: 'utf-8' }));

    const updatedImages = [];
    for (const def of awsDef) {
      const service = def.service;
      const oldService = (currentAwsDef || []).find((s) => {
        return s.service.name === service.name;
      });

      let updateImage = false;
      if ((oldService && semver.gt(service.version, oldService.service.version))) {
        updateImage = true;
      }

      if (!updateImage && affectedServices && (affectedServices.indexOf(service.name) >= 0 || affectedServices.indexOf(service.ApiName) >= 0 || affectedServices.indexOf('all') >= 0)) {
        updateImage = true;
      }

      if (updateImage) {
        updatedImages.push(service.name);
        let imageFound = false;
        for (const image of imageDef) {
          if (service.imageName === image.ParameterKey) {
            imageFound = true;
            image.ParameterValue = imageName;
            break;
          }
        }

        if (!imageFound) {
          imageDef.push({
            ParameterKey: service.imageName,
            ParameterValue: imageName
          });
        }
      }
    }

    if (updatedImages.length) {
      console.log(`images updated ${updatedImages.join('|')}`);
      fs.writeFileSync(fPath, JSON.stringify(awsDef, null, 4), 'utf-8');
      fs.writeFileSync(path.join(process.cwd(), `${file}`), JSON.stringify(imageDef, null, 4), 'utf-8');
    } else {
      console.log('no images found for update');
    }
  }
}

main();
