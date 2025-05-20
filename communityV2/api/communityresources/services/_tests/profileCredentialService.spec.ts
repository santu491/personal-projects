import { mockAccessTokenHelperSvc, mockMemberHelperSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ProfileCredentialsGateway } from 'api/communityresources/gateways/profileCredentialsGateway';
import { ProfileCredentialService } from '../profileCredentialService';

describe('ProfileCredentialService', () => {
  let svc: ProfileCredentialService;
  const mockGateway: Mockify<ProfileCredentialsGateway> = {
    commercialProfileCredentialUpdateApi: jest.fn()
  };

  beforeEach(() => {
    svc = new ProfileCredentialService(
      <any>mockResult,
      <any>mockMemberHelperSvc,
      <any>mockAccessTokenHelperSvc,
      mockGateway as any,
      <any>ProfileCredentialService,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should able to update new password from user profile', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          updateStatus: 'success'
        }
      }
    };
    const request = {
      memberId: '318339267',
      currentUsernm: '~SIT3SB457T97639',
      currentPassword: 'support1',
      newPassword: 'support2',
      confirmPassword: 'support2'
    };
    const resp = await svc.profileUpdatePassword(request);
    try {
      mockGateway.commercialProfileCredentialUpdateApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
