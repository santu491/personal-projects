import { mockAccessTokenHelperSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ProfileUpdateARNGateway } from 'api/communityresources/gateways/profileUpdateARNGateway';
import { ProfileCommercialARNService } from '../profileCommercialARNService';

describe('ProfileCommercialARNService', () => {
  let svc: ProfileCommercialARNService;
  const mockGateway: Mockify<ProfileUpdateARNGateway> = {
    commercialTelephoneNumberApi: jest.fn(),
    commercialTextNumberApi: jest.fn(),
    commercialRecoveryNumberApi: jest.fn(),
    medicaidRecoveryNumberUpdateApi: jest.fn()
  };

  beforeEach(() => {
    svc = new ProfileCommercialARNService(
      <any>mockResult,
      <any>mockAccessTokenHelperSvc,
      <any>mockGateway,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get the user contact numbers for commercial users', async () => {
    const memberId = '349289384';
    const token = 'token';
    const primaryContact = {
      telephone: [
        {
          phoneTypeCd: {
            code: 'HOME',
            name: 'Home Telephone',
            description: 'Home Telephone'
          },
          phoneNbr: '9999999999',
          phoneNbrExtension: '0000',
          telephoneUid: '1614169510082014500038410',
          preferred: true
        }
      ]
    };
    const textContact = {
      textNumberDetails: [
        {
          deviceTypeCd: {
            code: 'MOBILEPHONE',
            name: 'Mobile Phone',
            desc: 'Mobile Phone'
          },
          deviceNumber: '7472636630',
          textNumberUid: '1618348581113001250078010',
          deviceStatusCd: {
            code: 'EXPD',
            name: 'Expired',
            desc: 'Expired'
          },
          preferred: false,
          origin: {
            code: '100240',
            name: 'CONSUMER MEMBER PORTAL',
            desc:
              'CONSUMER MEMBER PORTAL is an origination source for systems: ACES,CS90,CHIPS,FACETS'
          }
        }
      ]
    };
    const expRes = {
      actualNumbers: [
        {
          phoneNbr: '9999999999',
          phoneType: 'VOICE'
        },
        {
          phoneNbr: '7472636630',
          phoneType: 'TEXT'
        }
      ]
    };
    const resp = await svc.getUserContactNumbers(memberId);
    const contactsResp = await svc.getCommercialPhoneNumbers(token, memberId);
    try {
      mockGateway.commercialTelephoneNumberApi.mockReturnValue(primaryContact);
      mockGateway.commercialTextNumberApi.mockReturnValue(textContact);
      expect(contactsResp).toEqual(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return the user recovery contact number for commercial', async () => {
    const contactDetails = {
      phoneNbrDetails: {
        phoneTypeCd: {
          code: 'RECOVERY',
          desc: 'Recovery Number'
        },
        phoneNbr: '7472636979',
        phoneNbrUid: '1895343'
      }
    };
    const expRes = {
      recoveryNumbers: [
        {
          phoneNbr: '7472636979',
          phoneType: 'VOICE/TEXT'
        }
      ]
    };
    const request = {
      usernm: '~SIT3SUB770T95829',
      memberType: 'CN=eMember'
    };
    const resp = await svc.recoveryContactNumber(request, 'get');
    try {
      mockGateway.commercialRecoveryNumberApi.mockReturnValue(contactDetails);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should able to update recovery contact number', async () => {
    const expRes = {
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
        lastUpdTimeStamp: '2022-02-01'
      }
    };
    const request = {
      data: {
        phoneNbrDetails: {
          phoneNbr: '3392342723'
        }
      },
      usernm: '~SIT3SB457T97639'
    };
    const resp = await svc.recoveryContactNumber(request, 'put');
    try {
      mockGateway.commercialRecoveryNumberApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should able to add new recovery contact number', async () => {
    const expRes = {};
    const request = {
      data: {
        phoneNbrDetails: {
          phoneNbr: '3392342721'
        }
      },
      usernm: '~SIT3SB457T97639'
    };
    const resp = await svc.recoveryContactNumber(request, 'post');
    try {
      mockGateway.commercialRecoveryNumberApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
