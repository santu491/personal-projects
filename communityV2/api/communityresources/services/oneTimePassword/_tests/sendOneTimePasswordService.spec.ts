import {
  mockAccessTokenHelperSvc, mockMemberGateway,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { SendOneTimePasswordService } from '../sendOneTimePasswordService';

describe('SendOneTimePasswordService', () => {
  let service: SendOneTimePasswordService;
  beforeEach(() => {
    service = new SendOneTimePasswordService(
      <any>mockResult,
      mockAccessTokenHelperSvc as any,
      mockMemberGateway as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('memberSendOtp -> success response for commercial', async () => {
    const sendOtpModel = {
      channel: 'EMAIL',
      contactUid: 'profile~1574762953519010230011810',
      userName: '~SIT3GQH812584146',
      model: 'Member',
      metaBrandCode: 'AGP-TX',
      memberType: 'CN=eMember'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          secureAuthResponse: {
            adhocOTPAudit: {
              status: 'ACTIVATION_REQUIRED'
            }
          },
          pingDeviceId: '4f30bfca-43fd-49da-93dc-c9331b417ce8',
          pingUserId: 'ebca6d61-6945-4c28-89a6-bd9e461edbad'
        }
      }
    }
    const resp = await service.memberSendOtp(sendOtpModel);
    try {
      mockMemberGateway.memberSendOtp.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('memberSendOtp -> success response for GBD', async () => {
    const sendOtpModel = {
      channel: 'EMAIL',
      contactUid: 'profile~1574762953519010230011810',
      userName: '~SIT3GQH812584146',
      model: 'Member',
      metaBrandCode: 'AGP-TX',
      memberType: 'CN=gbdMSS'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          secureAuthResponse: {
            adhocOTPAudit: {
              status: 'ACTIVATION_REQUIRED'
            }
          },
          pingDeviceId: '4f30bfca-43fd-49da-93dc-c9331b417ce8',
          pingUserId: 'ebca6d61-6945-4c28-89a6-bd9e461edbad'
        }
      }
    }
    const resp = await service.memberSendOtp(sendOtpModel);
    try {
      mockMemberGateway.memberSendOtp.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

});
