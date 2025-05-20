/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const apis = fs
  .readdirSync(path.join(process.cwd(), 'api/tcp'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name.toLowerCase());

exports.apis = apis;

function trimRight(value, charlist) {
  if (typeof charlist === 'undefined') {
    charlist = '\\s';
  }

  return (value || '').replace(new RegExp('[' + charlist + ']+$'), '');
}

exports.trimRight = trimRight;

function trimLeft(value, charlist) {
  if (typeof charlist === 'undefined') {
    charlist = '\\s';
  }

  return (value || '').replace(new RegExp('^[' + charlist + ']+'), '');
}

exports.trimLeft = trimLeft;

function hasApi(api) {
  return apis.indexOf(api.toLowerCase()) >= 0;
}

exports.hasApi = hasApi;

function formatContextRoot(contextRoot) {
  return `/${trimRight(trimLeft(contextRoot, '/'), '/')}`;
}

exports.formatContextRoot = formatContextRoot;

function hasContextRoot(contextRoot) {
  for (const api of apis) {
    const fPath = path.join(process.cwd(), `api/tcp/${api}/apiInfo.ts`);
    if (fs.existsSync(fPath)) {
      const apiInfo = fs.readFileSync(fPath, { encoding: 'utf-8' });
      if (apiInfo.indexOf(contextRoot) >= 0) {
        return true;
      }
    }
  }

  return false;
}

exports.hasContextRoot = hasContextRoot;
