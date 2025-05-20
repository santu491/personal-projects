import { JwtAlgorithms } from './jwtAlgorithms';
import { JwtTokenUtil } from './jwtTokenUtil';

describe('JwtTokenUtil UTest', () => {
  let util: JwtTokenUtil;

  beforeEach(() => {
    //let c = crypto.createCipher('aes256', '123456');
    //util = new JwtTokenUtil(JwtAlgorithms.HS256, 'd6F3Efeq');
  });

  it('should verify valid token', () => {
    util = new JwtTokenUtil(
      JwtAlgorithms.HS256,
      {
        secret: 'decaffeinated',
        salt: 'Sn43R28*893bnheDJf79L43_',
        iv: '72&r_SwC'
      },
      'dev/keystore2.jceks',
      '02MqhVXVOjXfeAnUPeaHUQ=='
    );

    let token = util.generateToken('123W456', 'user123', 30, {
      test1: {
        value: 'test1',
        encrypt: true
      },
      test2: {
        value: 'test2',
        encrypt: false
      }
    });
    //console.log(token);
    try {
      util.verify(token, { test1: { encrypt: true }, test2: {}, subject: {}, id: { encrypt: true } });
    }
    catch (e) {
      console.error(e);
      expect(true).toBeFalsy();
    }
    expect(true).toBeTruthy();
  });

  it('should throw error for invalid signature token', () => {
    util = new JwtTokenUtil(
      JwtAlgorithms.HS256,
      {
        secret: 'decaffeinated',
        salt: 'Sn43R28*893bnheDJf79L43_',
        iv: '72&r_SwC'
      },
      'dev/keystore2.jceks',
      '02MqhVXVOjXfeAnUPeaHUQ=='
    );

    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ-bWxha21hbCIsImp0aSI6ImJkZjZmYmYyYzg2MTIyZjAyMGQyMWJiMTBmNThlODQxMDE4ZWZjMDVmYjUxYjljOWExY2Q0NzExMDNkZDFmZTIiLCJ3ZWJHdWlkIjoiODJlN2JiM2RiYzQzNGQ4ODI2NjE2ODA2NDhkYWQ5OTA1MDhmNWE3MzcwOTA5YjY3OTk0NGI1ZTY2M2ZiNmE1NWQ3ZTM4YjliYzRlMzQ2ODZlZGZlYjI3YTM0MGI1ODBkZjM3MWY2MzI5YzA0ZDZjODZkOGIxZjFmYjhiMDA5YzgiLCJ1c2VyUm9sZSI6IjdmZTljN2M5NTFkMTgxMjg0NGJhNTJmZjg3ZWUxNzFlZjg2Zjc3MmUzZTUxZDdmMzZiNWZlODY4NDZhODNhYTMiLCJob3VzZUFjY291bnRJbmQiOiJmMmU5OTFkNDA1NjY1NGM5M2Y0YzRkN2ZkNGVhMGY0OTA3YWRlOTVlZGUyMTUxNDExNDQ3ZmI0OTBmZWNhOTdlIiwiaWF0IjoxNTMyMzUyMzA2LCJleHAiOjE1MzIzNTU5MDZ9.jPOt_EDJy8KQgC2elkqddkyv52HOjInpTy8uYVESg7s';
    //console.log(token);
    try {
      util.verify(token, { test1: { encrypt: true }, test2: {}, subject: {}, id: { encrypt: true } });
    }
    catch (e) {
      expect(e.message.indexOf('invalid signature') >= 0).toBeTruthy();
    }
  });

  it('should throw error for expired token', () => {
    util = new JwtTokenUtil(
      JwtAlgorithms.HS256,
      {
        secret: 'decaffeinated',
        salt: 'Sn43R28*893bnheDJf79L43_',
        iv: '72&r_SwC'
      },
      'dev/keystore2.jceks',
      '02MqhVXVOjXfeAnUPeaHUQ=='
    );

    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ-c2l0M1NCNTIxVDY1NTE2IiwianRpIjoiZjNhM2Q4ZDkyNzIxMmJjYzk5NzMzNzA5YzM1NjM2MTA5ZmI5MTEyZGIyZWI1NTJmYzFjYjU1M2ZkMzk1NDg2ZCIsIndlYkd1aWQiOiJmYTFiMTkwZGI2YWNkNmE1OTQ2MzJiMDZiODIwZTIwOGJmMjk5OWRhODk2ZWVmOWZlMzY4YzMwZTk5NWQ0NTNhZmVmYWVlNGQ0NDhjNDI3NzM5MDFjMTE4NWY3ZWMxZTQwYTlkZTJjMTQ1MjZlNTM1MDA2ZjhkNDNjNWZhNGFmYiIsInVzZXJSb2xlIjoiN2YxZWUxMWUwMDljM2IzYzUwZTU2NjczNmFiZjQzYTgyMDYxNDJjMDBkZGRhMzhiY2IyNTI3ZGEyODg2ZWRlZSIsImlhdCI6MTUzMjM1MjA1MywiZXhwIjoxNTMyMzUyOTUzfQ.3jpiYRxjM0fqtVuz7tJkXwzEt-hFcZJDQKqhZLXIFd8';
    //console.log(token);
    try {
      util.verify(token, { test1: { encrypt: true }, test2: {}, subject: {}, id: { encrypt: true } });
    }
    catch (e) {
      expect(e.message.indexOf('jwt expired') >= 0).toBeTruthy();
    }
  });

  it('should allow reading encrypted and unrencrypted claim values', () => {
    util = new JwtTokenUtil(
      JwtAlgorithms.HS256,
      {
        secret: 'decaffeinated',
        salt: 'Sn43R28*893bnheDJf79L43_',
        iv: '72&r_SwC'
      },
      'dev/keystore2.jceks',
      '02MqhVXVOjXfeAnUPeaHUQ=='
    );

    let token = util.generateToken('123W456', 'user123', 30, {
      test1: {
        value: 'test1',
        encrypt: true
      },
      test2: {
        value: 'test2',
        encrypt: false
      }
    });
    //console.log(token);
    let claims: any = util.verify(token, { test1: { encrypt: true }, test2: {}, subject: {}, id: { encrypt: true } });
    //console.log(claims)
    expect(claims.test1).toBe('test1');
    expect(claims.test2).toBe('test2');
  });
});
