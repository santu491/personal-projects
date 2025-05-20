import * as appRoot from 'app-root-path';
import * as fs from 'fs';
import { writeFileSync } from 'fs';
import { affectedProjects } from './affected-apps';
import { getProjectNodes, parseFiles } from './shared';

export function affected(app: string, sha1?: string, sha2?: string): any {
  try {
    let apis = [];
    let specOnly = false;
    const p = parseFiles(sha1, sha2);
    if (allApisAffected(p.files, app)) {
      apis.push('all');
    } else if (onlySpecsAffected(p.files, app)) {
      specOnly = true;
    } else {
      apis = apis.concat(affectedApis(p.files, app));
      apis = apis
        .map((api) => {
          return api.replace('virtual-', '');
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
    }

    console.log(apis);
    let variables = '';
    apis.forEach((api) => {
      variables += `api.${api}=true\r\n`;
    });
    if (specOnly) {
      variables += 'api.specOnly=true\r\n';
    }
    variables += `apilist=${apis.join(',')}\r\n`;
    writeFileSync(`${appRoot.path}/build.properties`, variables);
    return apis.join(',');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export function affectedApis(files: string[], app: string): string[] {
  const projects = getProjectNodes();
  const deps = affectedProjects(projects, (f) => fs.readFileSync(`${appRoot.path}/${f}`, 'utf-8'), files);
  const filDeps = deps
    .filter((dep) => {
      if (dep.name.indexOf(app) >= 0) {
        return true;
      }

      return false;
    })
    .map((dep) => {
      return dep.name.replace(`${app}-`, '');
    });

  if (filDeps.indexOf(`app-${app}`) >= 0) {
    return ['all'];
  } else {
    return filDeps;
  }
}

export function allApisAffected(files: string[], app: string): boolean {
  const filesAffectingAll = [
    `app/${app}`,
    'tools/',
    '.dockerignore',
    '.gitignore',
    '.gitattributes',
    'cert.prem',
    'key.prem',
    'npm-setup.sh',
    'package-scripts.js',
    'package.json',
    'process.yml',
    'process_caapm.yml',
    'tsconfig.build.json',
    'tsconfig.json',
    'tsconfig.tools.json',
    'tslint.json'
  ];

  for (const file of files) {
    for (const aFile of filesAffectingAll) {
      if (file.indexOf(aFile) >= 0) {
        return true;
      }
    }
  }

  return false;
}

export function onlySpecsAffected(files: string[], app: string) {
  for (const file of files) {
    if (file.indexOf('.spec.ts') < 0) {
      return false;
    }
  }

  return true;
}

if (process.env.npm_config_app) {
  affected(process.env.npm_config_app, process.env.npm_config_sha1, process.env.npm_config_sha2);
} else {
  console.error('missing app');
}
