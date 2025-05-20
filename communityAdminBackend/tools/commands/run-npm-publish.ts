import { execSync } from 'child_process';
import * as yargs from 'yargs';

function runNpmPublish(cwd, pkgName, npmTag, npmVer, artifactory) {
  npmTag = npmTag || 'develop';
  let npmVersion = npmVer || '1.0.0';
  if (npmTag !== 'next' && npmTag !== 'latest') {
    npmVersion += `-${npmTag}.${getNpmTagVersion()}`;
  }

  const result = execSync(`"../tools/npm-publish" ${pkgName} ${npmTag} ${npmVersion} ${artifactory || ''}`, { cwd: cwd, stdio: 'inherit' }) || {};
}

function getNpmTagVersion() {
  let d = new Date();
  let yyyy = d.getFullYear().toString();
  let mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
  let dd = d.getDate().toString();
  let hh = d.getHours().toString();
  let min = d.getMinutes().toString();
  return mm + (dd[1] ? dd : '0' + dd) + yyyy + (hh[1] ? hh : '0' + hh) + (min[1] ? min : '0' + min);
}

runNpmPublish(yargs.argv.cwd, yargs.argv.pkgName, yargs.argv.npmTag, yargs.argv.npmVer, yargs.argv.artifactory);
