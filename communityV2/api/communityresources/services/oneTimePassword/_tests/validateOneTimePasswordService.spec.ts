import {
  mockAccessTokenHelperSvc,
  mockMemberGateway,
  mockMemberHelperSvc,
  mockMongo,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ValidateOneTimePasswordService } from '../validateOneTimePasswordService';

describe('ValidateOneTimePasswordService', () => {
  let service: ValidateOneTimePasswordService;

  beforeEach(() => {
    service = new ValidateOneTimePasswordService(
      <any>mockResult,
      mockAccessTokenHelperSvc as any,
      mockMemberGateway as any,
      mockMongo as any,
      mockMemberHelperSvc as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('commercialValidateOtp', async () => {

    const validateOtpModel = {
      otp: '643757',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '~SIT3GQH812584146',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=eMember',
      isLogin: false
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          secureAuthResponse: {
            _links: {
              self: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb/users/203ef9e2-70bf-4074-ae9b-56500b035183/devices/15fb8fdb-30a6-4641-96f4-a6a7ab79c774'
              },
              environment: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb'
              },
              user: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb/users/ebca6d61-6945-4c28-89a6-bd9e461edbad'
              }
            },
            id: '4f30bfca-43fd-49da-93dc-c9331b417ce8',
            environment: {
              id: 'c669a557-00eb-43c2-8ac1-9080c7dcebfb'
            },
            user: {
              id: 'ebca6d61-6945-4c28-89a6-bd9e461edbad'
            },
            type: 'EMAIL',
            status: 'ACTIVE',
            createdAt: '2021-11-03T12:58:13.565Z',
            updatedAt: '2021-11-03T13:00:38.171Z',
            email: 'shyamkumar.nallaguntla@anthem.com'
          },
          valid: 'true'
        }
      }
    };
    const resp = await service.commercialValidateOtp(validateOtpModel);
    try {
      mockMemberGateway.loginValidateOtpApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('medicaidValidateOtp', async () => {

    const validateOtpModel = {
      otp: '643757',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '~SIT3GQH812584146',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=eMember',
      isLogin: false
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          secureAuthResponse: {
            _links: {
              self: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb/users/203ef9e2-70bf-4074-ae9b-56500b035183/devices/15fb8fdb-30a6-4641-96f4-a6a7ab79c774'
              },
              environment: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb'
              },
              user: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb/users/ebca6d61-6945-4c28-89a6-bd9e461edbad'
              }
            },
            id: '4f30bfca-43fd-49da-93dc-c9331b417ce8',
            environment: {
              id: 'c669a557-00eb-43c2-8ac1-9080c7dcebfb'
            },
            user: {
              id: 'ebca6d61-6945-4c28-89a6-bd9e461edbad'
            },
            type: 'EMAIL',
            status: 'ACTIVE',
            createdAt: '2021-11-03T12:58:13.565Z',
            updatedAt: '2021-11-03T13:00:38.171Z',
            email: 'shyamkumar.nallaguntla@anthem.com'
          },
          valid: 'true'
        }
      }
    };
    const resp = await service.medicaidValidateOtp(validateOtpModel);
    try {
      mockMemberGateway.medicaidValidateOtpApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

});
