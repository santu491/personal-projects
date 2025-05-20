import {MemberOAuthPayload} from '../../types/customRequest';
import {mockEapMemberProfileService} from '../baseTest';
import {
  capitalizeStr,
  createGatewayResponse,
  getAccessToken,
  getArgument,
  handleErrorMessage,
  randomString,
  replaceAll,
  timeDiffInMinutes,
  validateMemberOAuthPayload,
} from '../common';

jest.mock('../../services/eap/eapMemberProfileService', () => ({
  EAPMemberProfileService: jest.fn(() => mockEapMemberProfileService),
}));

describe('timeDiffInMinutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Should return minutes difference between time', async () => {
    const time1 = new Date('2024-03-15T09:59:25.238Z');
    const time2 = new Date('2024-03-15T10:59:25.238Z');

    const response1 = timeDiffInMinutes(time1, time2);
    const response2 = timeDiffInMinutes(time2, time1);

    expect(response1).toEqual(60);
    expect(response2).toEqual(60);
  });
});

describe('capitalizeStr', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Should return capitalised string', async () => {
    const response = capitalizeStr('testuser');

    expect(response).toEqual('Testuser');
  });

  describe('getArgument', () => {
    process.argv = ['--test=123'];

    it('Should return empty if value not present in argument', async () => {
      const response = getArgument('test1');

      expect(response).toEqual('');
    });
  });
});

describe('replaceAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Should return replaced string', async () => {
    const response = replaceAll(
      'A test consists of multiple scenarios. Every tests is important',
      [
        {
          pattern: 'test',
          value: 'unit',
        },
        {
          pattern: 'multiple',
          value: 'many',
        },
      ],
    );

    expect(response).toEqual(
      'A unit consists of many scenarios. Every units is important',
    );
  });
});

describe('getAccessToken', () => {
  it('Should return access token', async () => {
    mockEapMemberProfileService.getEAPMemberAuthAccessToken.mockResolvedValue(
      'accessToken',
    );

    const response = await getAccessToken();

    expect(response).toEqual('accessToken');
  });

  it('Should throw error if access token is not present', async () => {
    mockEapMemberProfileService.getEAPMemberAuthAccessToken.mockResolvedValue(
      '',
    );

    await expect(getAccessToken()).rejects.toThrow();
  });
});

describe('handleErrorMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return error message', async () => {
    const response = handleErrorMessage(
      new Error('Error Message'),
      'Default Message',
    );

    expect(response).toEqual('Error Message');
  });

  it('Should return default message if error is not instance of Error', async () => {
    const response = handleErrorMessage('Error Message', 'Default Message');

    expect(response).toEqual('Default Message');
  });
});

describe('createGatewayResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return success response', async () => {
    const response = createGatewayResponse(200, 'Success');

    expect(response).toEqual({status: 200, data: 'Success'});
  });

  it('Should return error response', async () => {
    const response = createGatewayResponse(400, 'Error');

    expect(response).toEqual({status: 400, message: 'Error'});
  });
});

describe('validateMemberOAuthPayload', () => {
  it('Should validate member oauth payload', async () => {
    const payload: MemberOAuthPayload = {
      clientId: '',
      userName: 'userName',
      iamguid: 'iamguid',
      clientName: '',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    expect(() => validateMemberOAuthPayload(payload)).toThrow();
  });
});

describe('randomString', () => {
  it('Should return random string', async () => {
    const response = randomString(10);

    expect(response).toHaveLength(10);
  });
});
