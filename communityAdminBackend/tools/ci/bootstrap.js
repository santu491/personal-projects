/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const copyfiles = require('copyfiles');
const { apis, formatContextRoot, hasApi, hasContextRoot, trimLeft, trimRight } = require('./utils');

const args = {
  api: argv.api,
  contextRoot: argv.contextRoot
};

function updateApiInfo(api, contextRoot) {
  const fPath = path.join(process.cwd(), `api/tcp/${api}/apiInfo.ts`);
  if (fs.existsSync(fPath)) {
    let apiInfo = fs.readFileSync(fPath, { encoding: 'utf-8' });
    apiInfo = apiInfo.replace('contextPath: \'\'', `contextPath: \'${contextRoot}\'`);
    apiInfo = apiInfo.replace('name: \'\'', `name: \'${api}\'`);
    fs.writeFileSync(fPath, apiInfo, 'utf-8');
  }
}

function updateApiMap(api, contextRoot) {
  const fPath = path.join(process.cwd(), 'api/tcp/map.json');
  if (fs.existsSync(fPath)) {
    const apiMap = JSON.parse(fs.readFileSync(fPath, { encoding: 'utf-8' }));
    if (!apiMap[contextRoot]) {
      apiMap[contextRoot] = {
        name: api
      };
      fs.writeFileSync(fPath, JSON.stringify(apiMap, null, 4), 'utf-8');
    } else {
      throw new Error(`${contextRoot} already used on map.json`);
    }
  }
}

function setupNewApiFolder(api, contextRoot) {
  const inGlob = './tools/base-code/**/*.*';
  const outPath = `./api/tcp/${api}`;
  copyfiles([inGlob, outPath], { all: true, up: 2 }, () => {
    updateApiInfo(api, contextRoot);
    updateApiMap(api, contextRoot);
    console.log('done');
  });
}

function start(api, contextRoot) {
  contextRoot = formatContextRoot(contextRoot);

  if (!api || !contextRoot) {
    console.error('missing api or contextRoot arguments');
    process.exit(1);
  } else if (hasApi(api)) {
    console.error(`api ${api} is already used`);
    process.exit(1);
  } else if (hasContextRoot(contextRoot)) {
    console.error(`contextRoot ${contextRoot} is already used`);
    process.exit(1);
  } else {
    setupNewApiFolder(api, contextRoot);
  }
}

start(args.api, args.contextRoot);

//node ./tools/ci/bootstrap.js --api=engage1 --contextRoot=/member/secure/api/tcp/xyz
