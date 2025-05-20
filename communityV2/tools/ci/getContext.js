/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const { apis, formatContextRoot, hasApi, hasContextRoot, trimLeft, trimRight } = require('./utils');

const args = {
  api: argv.api
};

function getContextRoot(api) {
  const fPath = path.join(process.cwd(), `api/tcp/${api}/apiInfo.ts`);
  if (fs.existsSync(fPath)) {
    const apiInfo = fs.readFileSync(fPath, { encoding: 'utf-8' });
    const matches = apiInfo.match(/contextPath:\s\'(.*)\'/g);
    if (matches.length > 0) {
      return matches[0].replace('contextPath:', '').replace(/\'/g, '').trim();
    }
  }

  return null;
}

function start(api) {
  if (!api) {
    console.error('missing api or contextRoot arguments');
    process.exit(1);
  }

  if (!hasApi(api)) {
    console.error(`api ${api} not found`);
    process.exit(1);
  }

  const contextRoot = getContextRoot(api);
  if (!contextRoot) {
    console.error(`contextRoot not found for api ${api}`);
    process.exit(1);
  } else {
    console.log(contextRoot);
  }
}

start(args.api);

//node ./tools/ci/getContext.js --api=engage1
