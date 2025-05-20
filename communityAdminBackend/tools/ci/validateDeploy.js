/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const { apis, formatContextRoot, hasApi, hasContextRoot, trimLeft, trimRight } = require('./utils');

const args = {
  api: argv.api,
  contextRoot: argv.contextRoot
};

function start(api, contextRoot) {
  contextRoot = formatContextRoot(contextRoot);

  if (!api || !contextRoot) {
    console.error('missing api or contextRoot arguments');
    process.exit(1);
  }

  if (!hasApi(api)) {
    console.error(`api ${api} not found`);
    process.exit(1);
  }

  if (!hasContextRoot(api, contextRoot)) {
    console.error(`contextRoot ${contextRoot} not found for api ${api}`);
    process.exit(1);
  } else {
    console.log('done');
  }
}

start(args.api, args.contextRoot);

//node ./tools/ci/validateDeploy.js --api=engage1 --contextRoot=/member/secure/api/tcp/xyz
