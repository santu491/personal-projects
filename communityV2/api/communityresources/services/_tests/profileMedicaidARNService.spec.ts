import {
  mockAccessTokenHelperSvc,
  mockLoginHelperSvc,
  mockMemberGateway,
  mockMemberHelperSvc,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { mockProfileUpdateArnGateway } from '@anthem/communityapi/utils/mocks/mockGateway';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ProfileUpdateARNGateway } from 'api/communityresources/gateways/profileUpdateARNGateway';
import { ProfileMedicaidARNService } from '../profileMedicaidARNService';

describe('ProfileMedicaidARNService', () => {
  let svc: ProfileMedicaidARNService;
  const mockGateway: Mockify<ProfileUpdateARNGateway> = {
    commercialRecoveryNumberApi: jest.fn(),
    commercialTelephoneNumberApi: jest.fn(),
    commercialTextNumberApi: jest.fn(),
    medicaidRecoveryNumberUpdateApi: jest.fn()
  };

  beforeEach(() => {
    svc = new ProfileMedicaidARNService(
      <any>mockResult,
      <any>mockAccessTokenHelperSvc,
      <any>mockMemberHelperSvc,
      <any>mockLoginHelperSvc,
      <any>mockProfileUpdateArnGateway,
      <any>mockGateway,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return medicaid contact details', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          recoveryNumbers: ['9783949469'],
          actualNumbers: ['7813825833']
        }
      }
    };

    const contactDetails = {
      hcId: 'YRK788779854',
      contactDetails: [
        {
          contactType: 'PHONE',
          contactSubType: 'TEXT',
          contactValue: '7813825833',
          effectiveDate: '2020-05-07T04:00:00Z',
          terminationDate: '2199-12-31T05:00:00Z',
          source: 'MEME',
          sourceDescription: 'Member Information from FACETS Schema'
        },
        {
          contactType: 'EMAIL',
          contactSubType: null,
          contactValue: 'ashwini.poonacha@anthem.com',
          effectiveDate: '2020-05-07T04:00:00Z',
          terminationDate: '2199-12-31T05:00:00Z',
          source: 'SBAD',
          sourceDescription: 'Subscriber Information from FACETS Schema'
        },
        {
          contactType: 'PHONE',
          contactSubType: 'VOICE',
          contactValue: '9783949469',
          effectiveDate: null,
          terminationDate: null,
          source: 'ARN',
          sourceDescription: 'Account Recovery Number from AGP Schema'
        }
      ]
    };
    const request = {
      usernm: '~TAJUANA46204',
      memberType: 'CN=gbdMSS'
    };
    const resp = await svc.gbdContactDetails(request);
    try {
      mockMemberGateway.memberGetContactsApi.mockReturnValue(contactDetails);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should update the medicaid recovery contact details', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          updatedStatus: 'Success'
        }
      }
    };
    const request = {
      usernm: '~TAJUANA46204',
      memberType: 'CN=gbdMSS',
      phoneType: 'VOICE',
      phoneNumber: '9783949468'
    };
    const resp = await svc.updateMedicaidRecoveryNumber(request);
    try {
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
