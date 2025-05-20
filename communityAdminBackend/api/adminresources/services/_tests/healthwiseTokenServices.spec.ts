
import { mockHealthWiseGatewaySvc, mockLogger } from '@anthem/communityadminapi/common/baseTest';
import { HealthwiseTokenService } from '../healthwiseTokenService';

describe('HealthwiseTokenServices', () => {
  let service;

  beforeEach(() => {
    service = new HealthwiseTokenService(
      <any>mockHealthWiseGatewaySvc,
      <any>mockLogger
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('PostAuth Call should return token', async () => {
    const expRes = {
      access_token: 'test',
      token_type: 'barer',
      expires_in: 1000
    };
    mockHealthWiseGatewaySvc.postAuth.mockReturnValue(expRes);
    const data = await service.postAuth();
    expect(data).toEqual(expRes);
  });
});
