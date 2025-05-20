import { APP, RequestContext } from '@anthem/communityadminapi/utils';
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
    filter = new JwtFilter(<any>mockILogger, <any>mockSecureJwtToken);
  });
  it('verify null', () => {
    expect(filter != null);
  });

  afterEach(() => {
    mockSecureJwtToken.verify.mockReset();
    mockPublicwtToken.verify.mockReset();
  });
});
