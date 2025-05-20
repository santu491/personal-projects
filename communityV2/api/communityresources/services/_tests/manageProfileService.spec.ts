import {
  mockMongo, mockResult, mockSqsSvc
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ManageProfileService } from '../manageProfileService';

describe('ManageProfileService', () => {
  let service: ManageProfileService;

  beforeEach(() => {
    service = new ManageProfileService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockILogger,
      <any>mockSqsSvc
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('delete user profile - success', async () => {
    const key = '';
    const user = {
      id: '6009711ebb91ed000704a227',
      firstName: 'RAJA',
      lastName: 'BHARATHI',
      username: '~SIT3SB973932777',
      active: true,
      proxyId: null,
      hasAgreedToTerms: false,
      personId: '351771530'
    };
    mockMongo.readByID.mockReturnValueOnce(user);
    mockSqsSvc.addToNotificationQueue.mockReturnValueOnce(true);
    mockResult.createSuccess.mockReturnValue(key);
    await service.deleteProfile('6009711ebb91ed000704a227');
  });

  it('delete user profile - data not found', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: 'ab5d9974-a4ce-cc2f-c319-cc10efe48bfc',
          errorCode: 400,
          title: 'Bad data',
          detail: 'User does not exist',
        },
      },
    };
    mockMongo.readByID.mockReturnValueOnce(null);
    mockSqsSvc.addToNotificationQueue.mockReturnValueOnce(null);
    mockResult.createError.mockReturnValue(expRes);
    await service.deleteProfile('6009711ebb91ed000704a227');
  });

  it('delete user profile - server error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: 'ab5d9974-a4ce-cc2f-c319-cc10efe48bfc',
          errorCode: 400,
          title: 'Internal Server Error',
          detail: 'Please try again later',
        },
      },
    };
    mockMongo.readByID.mockReturnValueOnce({});
    mockSqsSvc.addToNotificationQueue.mockReturnValueOnce(false);
    mockResult.createError.mockReturnValue(expRes);
    await service.deleteProfile('6009711ebb91ed000704a227');
  });

  it('delete user profile - exception', async () => {
    mockILogger.error.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.deleteProfile('6009711ebb91ed000704a227');
  });
});
