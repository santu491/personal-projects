'use strict';

/**
 * Sample request generator usage.
 * Contributed by jjohnsonvng:
 * https://github.com/alexfernandez/loadtest/issues/86#issuecomment-211579639
 */

const loadtest = require('loadtest');

const urlParams = [
  'E=0&S=0&D=0&J=2',
  'E=1&S=1&D=0&J=0',
  'E=2&S=2&D=0&J=1',
  'E=5&S=5&D=0&J=1',
  'E=10&S=10&D=0&J=1'
];

const urls = [
  '/member/secure/api/tcp/membership/member/perfmock?',
  '/member/secure/api/tcp/billpay/member/perfmock?',
  '/member/secure/api/tcp/claims/member/perfmock?',
  '/member/secure/api/tcp/engage/member/perfmock?',
  '/member/secure/api/tcp/idcard/member/perfmock?',
  '/member/secure/api/tcp/prescriptions/member/perfmock?',
  '/member/secure/api/tcp/profile/member/perfmock?',
  '/member/secure/api/tcp/provider/member/perfmock?',
  '/member/secure/api/tcp/securemessage/member/perfmock?',
  '/member/secure/api/tcp/spendingaccounts/member/perfmock?',
  '/member/secure/api/tcp/sso/member/perfmock?',
  '/member/secure/api/tcp/utility/member/perfmock?',
  '/member/secure/api/tcp/webaccount/member/perfmock?',
  '/member/secure/api/tcp/benefits/member/perfmock?'
];

const methods = [
  'POST',
  'GET'
];

const postBody = {};

const apiHost = 'api.dev1.awse1.rcp.anthem.com';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const errors = [];
const successes = [];

const options = {
  url: `https://${apiHost}`,
  concurrency: 50,
  requestsPerSecond: 50,
  maxSeconds: 60,
  insecure: true,
  contentType: 'application/json',
  //proxy: 'http://127.0.0.1:8080',
  requestGenerator: (params, options, client, callback) => {
    const message = JSON.stringify(postBody);
    options.method = methods[getRandomInt(2)];
    options.path = `${urls[getRandomInt(14)]}${urlParams[getRandomInt(5)]}`;
    const request = client(options, callback);
    if (options.method === 'POST') {
      request.write(message);
    }
    return request;
  },
  statusCallback: (error, result, latency) => {
    if (error) {
      if (result) {
        console.log(result)
        errors.push(result.headers['x-rid']);
      }
      console.log(error)
    }
    else {
      successes.push(result.headers['x-rid']);
    }
    return true;
  }
};

loadtest.loadTest(options, (error, results) => {
  if (error) {
    return console.error('Got an error: %s', error);
  }
  console.log(results);

  if (successes.length) {
    console.log('SUCCESS');
    successes.forEach((e) => {
      //console.log(e);
    });
  }

  if (errors.length) {
    console.log('ERRORS');
    errors.forEach((e) => {
      console.log(e);
    });
  }

});
