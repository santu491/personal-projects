import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockCommercialSvc, mockMedicaidSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ProfileUpdateARNController } from '../profileUpdateARNController';

describe('ProfileUpdateARNController', () => {
  let ctrl: ProfileUpdateARNController;
  beforeEach(() => {
    ctrl = new ProfileUpdateARNController(
      <any>mockResult,
      <any>mockCommercialSvc,
      <any>mockMedicaidSvc,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to update recovery contact numbers', async () => {
    const request = {
      usernm: '~SIT3SB457T97639',
      data: {
        phoneNbrDetails: {
          phoneNbr: '3392342723'
        }
      }
    };
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
            phoneNbr: '3392342723',
            phoneNbrUid: '28371',
            countryCd: {
              code: '+1',
              name: 'United States'
            },
            lastUpdatedBy: 'SYDCOM',
            lastUpdTimeStamp: '2022-01-31'
          }
        }
      }
    };
    const res = await ctrl.updateRecoveryContactNumber(request);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error if usernm not there while update recovery contact', async () => {
    const request = {
      usernm: '',
      data: {
        phoneNbrDetails: {
          phoneNbr: '3392342723'
        }
      }
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '24fce46c-3396-bd7e-b9a4-965be9012ba8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.noUserNameTitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateRecoveryContactNumber(request);
    expect(res).toEqual(expRes);
  });

  it('Should be able to add recovery contact numbers', async () => {
    const request = {
      usernm: '~SIT3SB457T97639',
      data: {
        phoneNbrDetails: {
          phoneNbr: '3392342723'
        }
      }
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {}
      }
    };
    const res = await ctrl.addRecoveryContactNumber(request);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error if usernm not there while add recovery contact', async () => {
    const request = {
      usernm: '',
      data: {
        phoneNbrDetails: {
          phoneNbr: '3392342723'
        }
      }
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '91ae0e67-75b1-f93b-6947-964fe0bf57ed',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.noUserNameTitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.addRecoveryContactNumber(request);
    expect(res).toEqual(expRes);
  });
});
