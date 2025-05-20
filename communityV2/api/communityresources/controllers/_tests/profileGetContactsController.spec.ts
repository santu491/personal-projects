import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockCommercialSvc, mockMedicaidSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ProfileGetContactsController } from '../profileGetContactsController';

describe('ProfileGetContactsController', () => {
  let ctrl: ProfileGetContactsController;
  beforeEach(() => {
    ctrl = new ProfileGetContactsController(
      <any>mockCommercialSvc,
      <any>mockMedicaidSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to get user contact numbers', async () => {
    const memberId = '318339267';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: ['9783949468']
      }
    };
    const res = await ctrl.getUserContactNumbers(memberId);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error while memberId not there', async () => {
    const memberId = '';
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
    const res = await ctrl.getUserContactNumbers(memberId);
    expect(res).toEqual(expRes);
  });

  it('Should be able to get recovery contact numbers', async () => {
    const usernm = '~SIT3SB457T97639';
    const memberType = 'CN=eMember'
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          phoneNbrDetails: {
            phoneTypeCd: {
              code: 'RECOVERY',
              desc: 'Recovery Number'
            },
            phoneNbr: '3392342721',
            phoneNbrUid: '28371'
          }
        }
      }
    };
    const res = await ctrl.getRecoveryContactNumbers(usernm, memberType);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error if usernm not there while get recovery contact', async () => {
    const usernm = '';
    const memberType = 'CN=eMember'
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '24fce46c-3396-bd7e-b9a4-965be9012ba8',
            errorCode: API_RESPONSE.statusCodes[500],
            title: API_RESPONSE.messages.noUserNameTitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getRecoveryContactNumbers(usernm, memberType);
    expect(res).toEqual(expRes);
  });
});
