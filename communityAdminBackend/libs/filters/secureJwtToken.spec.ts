import { mockJwtTokenUtil } from '@anthem/communityadminapi/security/mocks/mockJwtTokenUtil';
import { APP } from '@anthem/communityadminapi/utils';
import { SecureJwtToken } from './secureJwtToken';

describe('SecureJwtToken UTest', () => {
  let jwt: SecureJwtToken;

  beforeEach(() => {
    jwt = new SecureJwtToken();
    jwt['_tokenUtil'] = <any>mockJwtTokenUtil;
  });

  it('should allow generating token', () => {
    APP.config.jwt.expiration = 1000;
    jwt.generateToken('id', 'subject', {
      name: { value: 'name', encrypt: false },
      id: { value: 'id', encrypt: false },
      firstName: { value: 'firstName', encrypt: false },
      lastName: { value: 'lastName', encrypt: false },
      role: { value: 'scadmin', encrypt: false },
      accessToken: { value: 'accessToken', encrypt: false },
      active: { value: true , encrypt: false },
      isDevLogin: { value: true , encrypt: false}
    });
    expect(mockJwtTokenUtil.generateToken.mock.calls.length).toBe(1);
    expect(mockJwtTokenUtil.generateToken.mock.calls[0][0]).toBe('id');
    expect(mockJwtTokenUtil.generateToken.mock.calls[0][1]).toBe('subject');
    expect(mockJwtTokenUtil.generateToken.mock.calls[0][2]).toBe(1000);
    expect(mockJwtTokenUtil.generateToken.mock.calls[0][3].name.value).toBe('name');
  });

  it('should allow generating gbd token', () => {
    APP.config.jwt.expiration = 1000;
    jwt.generategbdToken('id', 'subject');
    expect(mockJwtTokenUtil.generateToken.mock.calls.length).toBe(1);
    expect(mockJwtTokenUtil.generateToken.mock.calls[0][0]).toBe('id');
    expect(mockJwtTokenUtil.generateToken.mock.calls[0][1]).toBe('subject');
  });

  it('should throw error if id or subject is missing while generating token', () => {
    try {
      jwt.generateToken(undefined, 'subject', {
        name: { value: 'name', encrypt: false },
        id: { value: 'id', encrypt: false },
        firstName: { value: 'firstName', encrypt: false },
        lastName: { value: 'lastName', encrypt: false },
        role: { value: 'scadmin', encrypt: false },
        accessToken: { value: 'accessToken', encrypt: false },
        active: { value: true, encrypt: false },
        isDevLogin: { value: true , encrypt: false}
      });
    } catch (e) {
      expect((e as Error).message.indexOf('Missing id') >= 0).toBeTruthy();
    }
  });

  it('should throw error if id or subject is missing while generating gbd token', () => {
    try {
      jwt.generategbdToken(undefined, 'subject');
    } catch (e) {
      expect((e as Error).message.indexOf('Missing id') >= 0).toBeTruthy();
    }
  });

  it('should allow verifying token', () => {
    jwt.verify('token', { test: { encrypt: false } }, 'id', 'subject');
    expect(mockJwtTokenUtil.verify.mock.calls.length).toBe(1);
    expect(mockJwtTokenUtil.verify.mock.calls[0][0]).toBe('token');
    expect(mockJwtTokenUtil.verify.mock.calls[0][1].test.encrypt).toBeFalsy();
  });

  afterEach(() => {
    mockJwtTokenUtil.generateToken.mockReset();
    mockJwtTokenUtil.verify.mockReset();
  });
});
