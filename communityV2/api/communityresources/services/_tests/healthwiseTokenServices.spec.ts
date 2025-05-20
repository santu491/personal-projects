import { mockHealthwiseGateway } from '@anthem/communityapi/utils/mocks/mockHealthwise';
jest.useFakeTimers();

describe('HealthwiseTokenServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    mockHealthwiseGateway.postAuth.mockReturnValue(expRes);
    const data = await mockHealthwiseGateway.postAuth();
    expect(data).toEqual(expRes);
  });
});
