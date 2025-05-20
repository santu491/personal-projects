'use strict';

/**
 * Sample request generator usage.
 * Contributed by jjohnsonvng:
 * https://github.com/alexfernandez/loadtest/issues/86#issuecomment-211579639
 */

const loadtest = require('loadtest');

const options = {
  //url: 'https://localhost:8443/member/public/api/tcp/webaccount/v2/login',
  //url: 'https://www.anthem.com/member/public/api/tcp/webaccount/v2/login',
  //url: 'https://www.anthem.com/member/public/api/webacct/v2/login',
  //url: 'https://localhost:8443/member/secure/api/tcp/securemessage/member/MmEtVfoF0lo4yi_y3392Hg/message/YNYrlVtsS3gKZGzqE_uoHfZDHhduDeQaifoBOHhTy_M/file/1293990?fileNm=Screen%20Shot%202019-05-13%20at%2012.07.53%20PM.png&contentType=image/png&Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJHdWlkIjoiOGE0ZWY3MGYxYjJmNzY4MGQ5MDBhZmQ5NDIxMTc1NDZkMmExNDI4YjNiYzFkMmFkYTQ4NGMwZGZhYjM0MGNhMzhkZjljZTA0Y2UwMzliZTY5ZmM1ZDVlZWQ4NjI2ZjU0YjRjYTY1MjA2ZDU5NTU2MmE2MzVlMDY5M2QzNGFmNjYiLCJlbXVsYXRpb25JbmQiOiI2ZTUwODA2MjgwNjdlYTgxMjY0NWVhNDA1YmY4NTRjZmIwYTZiNGQwYTNlZjJmOTFhNzA4YzM1YjkzOWM1ZWQ1IiwidXNlclJvbGUiOiJiZjU2ZDczN2E4YWFhNjU5NDdmNDgxNGM4ZjY4NjM0ZThhYzEzODUwODMyMjM3NGUwZmNjZmYzZjBlMjA2YmEzIiwiaG91c2VBY2NvdW50SW5kIjoiNjZlZjFhNGRjZGM5ZWRhMzMxMGY2NGFlNDZiZTg2YmFkYTNjYTVhODNmN2QwOTI3MDMxODUyNGFhZjEyMDUxMCIsImlhdCI6MTU2NDA4NjI2NywiZXhwIjoxNTY0MDg5ODY3LCJzdWIiOiJ-bWxha21hbCIsImp0aSI6IjIxNzdkM2IzZTI3N2M0NjFiYzIzNTU3NTJjZmMxMjM5MzYxMTYyNTcyODdlYmRiNGMzMmUwMWJjZmRmOWI5YzAifQ.sOQSI7vZqyPeiKoDYCjfiVduh2nPXCHuux1iZnQ5XjA',
  //url: 'https://membersecure.dev1.awse1.anthem.com/member/secure/api/tcp/securemessage/member/SmeO-WbgPRne6EJHhgXjEg/messages?folder=inbox',
  //url: 'https://localhost:8443/member/secure/api/tcp/membership/member/metadata?cached=false&isRead=true',
  url: 'https://api.dev1.awse1.rcp.anthem.com/member/secure/api/tcp/membership/member/metadata?cached=false',
  concurrency: 1,
  //method: 'POST',
  method: 'GET',
  body: '',
  requestsPerSecond: 1,
  maxSeconds: 2,
  insecure: true,
  proxy: 'http://127.0.0.1:8080',
  headers: {
    'SMUNIVERSALID': '~PERF1SB629T91904AN'
    //'Authorization': ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJHdWlkIjoiZDk4MzFlMzUyNWUwNzJjZTBjYzJjNjViYjI3MGEzNDQzZGMxYjQ4MDczZTRhNmIzMjg2ODAzMmNmN2NjMmQ4MjcyYTEwOTEyNDYwYWFiMjQ3NzQ0MGQ5MTQ5OTAyMWMwIiwiZW11bGF0aW9uSW5kIjoiMDU5YTgyOWU0MjU4ZDliOGJkM2EyM2E5YWFjN2EwNTc3NDAzYzgxZmJlZTU1MjEyOTk4Mjk2NTdhODA0MzBkNCIsInVzZXJSb2xlIjoiMzQ4MWZjMjQ2MjI1MTAyNmU2MjAzZTE1ZTgyNDFkYzdmYTI3MmMwNzc5ZDI1YmM1YmZlYmM5ZDY5ZDViNzUwNCIsImhvdXNlQWNjb3VudEluZCI6IjQwNjMwZDA1Mjc5YjQ1MmY1OTk5NDk1MGE1YTFmMGY2YTQ3NDdhZjVkMWUzNTdiYmVjNjQ4MmFlYzZiNmRjOWUiLCJpYXQiOjE1NjQxMjA1ODAsImV4cCI6MTU2NDEyNDE4MCwic3ViIjoifkRldjVzdWI4NjlBNjI3NTciLCJqdGkiOiI2NzY0NzE1OGM5MTEyZjFjZjUzZjhhNGM3MmQwM2U4NTA5OTExYTExMTBlOTY2ODg0Yzk4NDljNDAwYzE5NGVhIn0.1wRgYvkNMgYClNur4-J3xmJPcGAz_htblm77wj_OxBA'
  },
  contentType: 'application/json'
  /*body: {
    usernm: 'PERF1SB629T91904AN',
    secret: 'support1',
    brand: 'ABCBS',
    fingerprint: {
      uaBrowser: { name: 'Chrome', version: '75.0.3770.142', major: '75' },
      uaString: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
      uaDevice: { model: null, type: null, vendor: null },
      uaEngine: { name: 'WebKit', version: '537.36' },
      uaOS: { name: 'Mac OS', version: '10.14.6' },
      uaCPU: { architecture: null },
      language: 'en-US',
      availableScreenResolution: '1920x1057',
      localStorage: true,
      sessionStorage: true,
      cpuClass: null,
      doNotTrack: null,
      cookieSupport: true
    },
    dplid: '',
    proxyId: 'd9c7d50b-7362-4e54-ba92-656cdeed8d3b'
  }/*,
  requestGenerator: (params, options, client, callback) => {
    //const message = '{"hi": "ho"}';
    //options.headers['Content-Length'] = message.length;
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify({
      usernm: 'mlakmal',
      secret: 'support1',
      brand: 'ABCBS',
      fingerprint: {
        uaBrowser: { name: 'Chrome', version: '75.0.3770.142', major: '75' },
        uaString: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
        uaDevice: { model: null, type: null, vendor: null },
        uaEngine: { name: 'WebKit', version: '537.36' },
        uaOS: { name: 'Mac OS', version: '10.14.6' },
        uaCPU: { architecture: null },
        language: 'en-US',
        availableScreenResolution: '1920x1057',
        localStorage: true,
        sessionStorage: true,
        cpuClass: null,
        doNotTrack: null,
        cookieSupport: true
      },
      dplid: '',
      proxyId: 'd9c7d50b-7362-4e54-ba92-656cdeed8d3b'
    });
    //options.path = 'YourURLPath';
    const request = client(options, callback);
    //request.write(message);
    return request;
  }*/
};

loadtest.loadTest(options, (error, results) => {
  if (error) {
    return console.error('Got an error: %s', error);
  }
  console.log(results);
  console.log('Tests run successfully');
});
