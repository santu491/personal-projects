import { APP } from './app';
import { RequestUtil } from './requestUtil';

describe('RequestUtil UTest', () => {
  beforeEach(() => {
    //nop
  });

  it('getUsername testing', () => {
    APP.config.jwt.emulationUsername = '';
    expect(RequestUtil.getUsername({}, {})).toBe('');
    expect(RequestUtil.getUsername({ smuniversalid: '~testUser' }, {})).toBe('~testUser');
    expect(RequestUtil.getUsername({ smuniversalid: '~testUser', emulateuser: '~dummyUser' }, {})).toBe('~testUser');
    expect(RequestUtil.getUsername({ smuniversalid: '~testUser' }, { emulateuser: '~dummyUser' })).toBe('~testUser');
    APP.config.jwt.emulationUsername = '~noUser';
    expect(RequestUtil.getUsername({ smuniversalid: '~testUser' }, {})).toBe('~testUser');
    expect(RequestUtil.getUsername({ smuniversalid: '~testUser', emulateuser: '~dummyUser' }, {})).toBe('~testUser');
    expect(RequestUtil.getUsername({ smuniversalid: '~testUser' }, { emulateuser: '~dummyUser' })).toBe('~testUser');
    APP.config.jwt.emulationUsername = '~dummyuser';
    expect(RequestUtil.getUsername({ smuniversalid: '~dummyUser' }, {})).toBe('');
    expect(RequestUtil.getUsername({ smuniversalid: '~dummyUser', emulateuser: '~emUser' }, {})).toBe('~emUser');
    expect(RequestUtil.getUsername({ smuniversalid: '~dummyUser' }, { emulateuser: '~emUser' })).toBe('~emUser');
  });

  it('getAuthToken testing', () => {
    expect(RequestUtil.getAuthToken({}, {})).toBe('');
    expect(RequestUtil.getAuthToken({ authorization: '123' }, {})).toBe('123');
    expect(RequestUtil.getAuthToken({}, { authorization: '123' })).toBe('123');
    expect(RequestUtil.getAuthToken({}, { authorization: 'Bearer 123' })).toBe('123');
    expect(RequestUtil.getAuthToken({}, { authorization: 'Bearer123' })).toBe('123');
    expect(RequestUtil.getAuthToken({}, { authorization: 'Bearer' })).toBe('');

  });

  it('getWebGuid testing', () => {
    expect(RequestUtil.getWebGuid({}, {})).toBe('');
    expect(RequestUtil.getWebGuid({ webGuid: '123' }, {})).toBe('123');
    expect(RequestUtil.getWebGuid({}, { webGuid: '123' })).toBe('123');
  });
});
