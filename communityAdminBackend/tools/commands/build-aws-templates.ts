import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import { getAwsDefinition } from './awd-def';
import { getYaml, Ref, Select, Sub, writeYaml } from './aws-yaml';

const app: any = yargs.argv.app || process.env.npm_config_app || 'tcp';
const file: any = yargs.argv.file || process.env.npm_config_file || '';
const file1: any = yargs.argv.file1 || process.env.npm_config_file1 || '';
const folder: any = yargs.argv.folder || process.env.npm_config_folder || '';

function main() {
  try {
    if (!file || !folder) {
      console.error('file path missing');
    } else {
      //getYaml('test.yml');
      //return;
      const awsDef = getAwsDefinition(app);
      const yamlObj = getYaml(file); //yaml.load(path.join(process.cwd(), file));
      //console.log(yamlObj)
      //console.log(awsDef)
      for (const def of awsDef) {
        const service = def.service;
        let serviceFound = false;
        for (const key in yamlObj.Resources) {
          if (service.name === key) {
            serviceFound = true;
            break;
          }
        }

        //console.log(service.name);
        //console.log(yamlObj.Resources[service.name]);
        if (!serviceFound) {
          yamlObj.Resources[service.name] = {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'services/node-api-service.yml',
              Parameters: {
                VPC: new Ref('VPC'),
                EnvironmentName: new Sub('${ApplicationName}-${EnvironmentName}-NODE'),
                ContainerName: service.ContainerName,
                ContainerPort: 443,
                HealthCheckPath: service.HealthCheckPath,
                Path: service.Path,
                LBListenerPriority: service.LBListenerPriority,
                DesiredCount: new Select(0, new Ref(service.parameters[1].name)),
                MemorySize: new Ref('MemorySize'),
                MemoryReservation: new Ref('MemoryReservation'),
                ImageName: new Ref(service.parameters[0].name),
                TargetGroupPort: 443,
                TargetGroupProtocol: 'HTTPS',
                HealthCheckProtocol: 'HTTPS',
                ServiceScalingRoleARN: new Ref('ServiceScalingRole'),
                ECSServiceRoleARN: new Ref('ECSServiceRole'),
                MetricType: 'CPUUtilization',
                MinCapacity: new Select(1, new Ref(`${service.parameters[1].name}`)),
                MaxCapacity: new Select(2, new Ref(`${service.parameters[1].name}`)),
                ApiName: service.ApiName
              }
            }
          };
        } else {
          yamlObj.Resources[service.name].Properties.Parameters.ContainerName = service.ContainerName;
          yamlObj.Resources[service.name].Properties.Parameters.HealthCheckPath = service.HealthCheckPath;
          yamlObj.Resources[service.name].Properties.Parameters.Path = service.Path;
          yamlObj.Resources[service.name].Properties.Parameters.LBListenerPriority = service.LBListenerPriority;
          yamlObj.Resources[service.name].Properties.Parameters.ApiName = service.ApiName;
        }

        for (const parameter of service.parameters || []) {
          let paramFound = false;
          for (const key in yamlObj.Parameters) {
            if (parameter.name === key) {
              paramFound = true;
            }
          }

          if (!paramFound) {
            yamlObj.Parameters[parameter.name] = {
              Description: parameter.Description,
              Type: parameter.Type
            };
          }
        }
        //console.log(yamlObj.Resources[service.name]);
      }

      fs.writeFileSync(path.join(process.cwd(), 'aws-definition.json'), JSON.stringify(awsDef, null, 4), 'utf-8');
      /*writeYaml.sync(path.join(process.cwd(), file), yamlObj, {
      indent: 4,
      skipInvalid: false,
      lineWidth: 150
    });*/
      writeYaml(yamlObj, file);

      const envDefs = [];
      fs.readdirSync(path.join(process.cwd(), `${folder}`)).forEach((fn: any) => {
        let fPath = path.join(process.cwd(), `${folder}/${fn}/${file1 || 'rcp-node-api-service-deploy'}.json`);
        if (fs.existsSync(fPath)) {
          envDefs.push({
            env: fn,
            path: fPath
          });
        }

        fPath = path.join(process.cwd(), `${folder}/${fn}/${file1 || 'rcp-node-api-service-deploy-84'}.json`);
        if (fs.existsSync(fPath)) {
          envDefs.push({
            env: fn,
            path: fPath
          });
        }
      });

      (envDefs || []).forEach((envDef: any) => {
        const envCommon = envDef.env.replace(/\d/g, '');
        const envParams: any = {
          parameters: []
        };
        for (const def of awsDef) {
          const eParams = def.environments[envDef.env] || def.environments[envCommon] || def.environments['default'];
          if (eParams && eParams.parameters) {
            envParams.parameters = [...envParams.parameters, ...eParams.parameters];
          }
        }

        const envJson = JSON.parse(fs.readFileSync(envDef.path, { encoding: 'utf-8' }));
        (envParams.parameters || []).forEach((envParam) => {
          let foundParam = false;
          for (const ej of envJson || []) {
            if (ej.ParameterKey === envParam.ParameterKey) {
              ej.ParameterValue = envParam.ParameterValue;
              foundParam = true;
              break;
            }
          }

          if (!foundParam) {
            envJson.push({
              ParameterKey: envParam.ParameterKey,
              ParameterValue: envParam.ParameterValue
            });
          }
        });
        //TODO: enable later
        fs.writeFileSync(envDef.path, JSON.stringify(envJson, null, 4), 'utf-8');
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main();
