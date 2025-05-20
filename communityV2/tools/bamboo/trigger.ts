import { variableNames } from '@anthem/communityapi/common';
import { readEnvVar } from '../env/readEnvVar';

import request = require('request');

export function triggerBambooPlan(planID: string, username: string, secret: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    url: `https://bamboo.anthem.com/rest/api/latest/queue/${planID}`,
    method: 'POST'
  };
  options.auth = {
    user: username,
    password: secret
  };
  options.strictSSL = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(options, (error: any, response: any, body: any) => {
    if (error || (response.statusCode !== 200 && response.statusCode !== 201 && response.statusCode !== 204)) {
      // eslint-disable-next-line no-console
      console.log(error || response.body);
      process.exit(1);
      return;
    }

    // eslint-disable-next-line no-console
    console.log(response.body);
  });
}

triggerBambooPlan(process.env.npm_config_planId, process.env.npm_config_username, readEnvVar(variableNames.BAMBOO_SECRET));
