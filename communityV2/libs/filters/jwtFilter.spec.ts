import { APP, RequestContext } from '@anthem/communityapi/utils';
import { mockMongo } from '../common/baseTest';
import { mockILogger } from '../logger/mocks/mockILogger';
import { JwtFilter } from './jwtFilter';
import { mockPublicwtToken } from './mocks/mockPublicJwtToken';
import { mockSecureJwtToken } from './mocks/mockSecureJwtToken';

describe('JwtFilter UTest', () => {
  let filter: JwtFilter;

  beforeEach(() => {
    APP.config.env = 'test';
    APP.config.jwt.optionalUrls = ['^(GET)\\..*(test-optional)', '^(POST)\\..*(test-optional)'];
    RequestContext.setContextItem = jest.fn();
    filter = new JwtFilter(<any>mockILogger, <any>mockSecureJwtToken, <any>mockMongo, <any>mockPublicwtToken);
  });
  it('verify null', () => {
    expect(filter != null);
  });

  afterEach(() => {
    mockSecureJwtToken.verify.mockReset();
    mockPublicwtToken.verify.mockReset();
  });
});
