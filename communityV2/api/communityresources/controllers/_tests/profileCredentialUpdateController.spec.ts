import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ProfileCredentialService } from 'api/communityresources/services/profileCredentialService';
import { ProfileCredentialUpdateController } from '../profileCredentialUpdateController';

describe('ProfileCredentialUpdateController', () => {
  let ctrl: ProfileCredentialUpdateController;
  const mockSvc: Mockify<ProfileCredentialService> = {
    profileUpdatePassword: jest.fn()
  };

  beforeEach(() => {
    ctrl = new ProfileCredentialUpdateController(
      <any>mockSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to update new password from user profile for commercial', async () => {
    const requestObject = {
      memberId: '318339267',
      webguid: 'f1836021-4ead-4f81-ad65-aa99620db8bf',
      currentUsernm: '~SIT3SB457T97639',
      currentPassword: 'support1',
      newPassword: 'support2',
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          updateStatus: 'success'
        }
      }
    };
    const res = await ctrl.updateProfilePassword(requestObject);
    try {
      mockSvc.profileUpdatePassword.mockReturnValue(expRes);
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should be able to update new password from user profilefor medicaid', async () => {
    const requestObject = {
      currentUsernm: '~TAJUANA46204',
      currentPassword: 'Test1234!!',
      newPassword: 'Test1234!',
      memberType: 'CN=gbdMSS'
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          responseContext: {
            confirmationNumber: '172017002042nullY8I2Er1DAJ1Z'
          }
        }
      }
    };
    const res = await ctrl.updateProfilePassword(requestObject);
    try {
      mockSvc.profileUpdatePassword.mockReturnValue(expRes);
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error if webguid not available in request', async () => {
    const requestObject = {
      memberId: '318339267',
      webguid: '',
      currentUsernm: '~SIT3SB457T97639',
      currentPassword: 'support1',
      newPassword: 'support2',
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.mbrUidMissing
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateProfilePassword(requestObject);
    expect(res).toEqual(expRes);
  });

  it('Should return error if currentUsernm is not available in request', async () => {
    const requestObject = {
      currentUsernm: '',
      currentPassword: 'support1',
      newPassword: 'support2',
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateProfilePassword(requestObject);
    expect(res).toEqual(expRes);
  });

  it('Should return error if currentPassword is not available in request', async () => {
    const requestObject = {
      currentUsernm: 'SIT3SB457T97639',
      currentPassword: '',
      newPassword: 'support2',
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.noCurrentPasswordDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateProfilePassword(requestObject);
    expect(res).toEqual(expRes);
  });

  it('Should return error if currentPassword is not available in request', async () => {
    const requestObject = {
      currentUsernm: 'SIT3SB457T97639',
      currentPassword: 'support2',
      newPassword: '',
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.noNewPasswordDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateProfilePassword(requestObject);
    expect(res).toEqual(expRes);
  });
});
