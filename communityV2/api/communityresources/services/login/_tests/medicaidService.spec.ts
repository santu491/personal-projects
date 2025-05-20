import { API_RESPONSE } from '@anthem/communityapi/common';
import {
  mockAccessTokenHelperSvc,
  mockMemberGateway,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import * as moment from 'moment';
import { LoginMedicaidService } from '../medicaidService';

describe('MedicaidService', () => {
  let service: LoginMedicaidService;

  const eligibilityResponse = {
    eligibilities: [
      {
        mbuTypeCode: '',
        sbrUid: '795367350',
        classId: 'CD08',
        planId: 'INTNMG00',
        planDescription: 'IN TANF- MAGI TEENS/ADULT- PKG A',
        groupId: 'INMCDWP0',
        subgroupId: 'INSE',
        type: 'MEDICAID',
        healthCardId: { prefix: 'YRH', subscriberId: '893240946' },
        mcid: '',
        productId: 'INBASIC0',
        productName: 'INDIANA MEDICAID',
        productDescription: 'IN Medicaid - Hoosier Healthwise',
        dateEffective: '2017-06-01T04:00:00Z',
        dateTermination: '2199-12-31T05:00:00Z',
        brand: 'ANTHEM-WCSIN',
        medicaidId: '135109488172',
        medicareId: '',
        coverageTypeCode: 'M',
        coverageTypeDescription: 'Medical',
        tobaccoStatus: '',
        firstName: 'SAMMIE',
        lastName: 'FERRELL',
        dateOfBirth: new Date('1999-01-01T05:00:00Z'),
        lobdId: 'INHA',
        homeZip: '46204',
        eligibilityStatusCode: 'Y',
        activeStatus: 'Active',
        groupName: 'INDIANA MEDICAID',
        subGroupName: 'OHIO',
        subGroupEffectiveDate: '2015-01-01T05:00:00Z',
        subGroupTerminationDate: '9999-12-31T05:00:00Z',
        strategicBusinessTypeCode: 'MedicaidAGP',
        subGroupNbr: '0058',
        market: 'IN',
        sourceSystem: 'GBDFACETS',
        marketingBrand: 'ABCBS',
        dualCitizenshipDetails: [],
        vendorName: '',
        fundingTypeCd: '',
        planBenefitPackageID: '',
        productValueCode: '',
        componentDetails: [{ componentID: 'MED', componentDescription: null }],
        warningMessages: [],
        planEntryDate: '2017-06-01T04:00:00Z',
        eligRecordUpdatedDate: '2020-09-18T00:49:35Z',
        eligNotifyDate: null,
        memeCk: '795367350',
        groupPhoneNumber: '7324526000',
        cmscontractCode: ''
      }
    ],
    status: ''
  };

  beforeEach(() => {
    service = new LoginMedicaidService(
      <any>mockResult,
      mockAccessTokenHelperSvc as any,
      mockMemberGateway as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Call Eligibility API', async () => {
    const resp = await service.getMemberEligibility(
      'token',
      'YRH893240946',
      ['IN'],
      'ABCBS',
      false,
      false
    );
    try {
      await mockMemberGateway.memberEligibility.mockReturnValue(eligibilityResponse);
      expect(resp).toEqual(eligibilityResponse);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error when age is below 14', async () => {
    const expRes = {
      eligibilities: [
        {
          sbrUid: '795367350',
          classId: 'CD08',
          planId: 'INTNMG00',
          planDescription: 'IN TANF- MAGI TEENS/ADULT- PKG A',
          groupId: 'INMCDWP0',
          subgroupId: 'INSE',
          type: 'MEDICAID',
          healthCardId: { prefix: 'YRH', subscriberId: '893240946' },
          mcid: '',
          productId: 'INBASIC0',
          productName: 'INDIANA MEDICAID',
          productDescription: 'IN Medicaid - Hoosier Healthwise',
          dateEffective: '2017-06-01T04:00:00Z',
          dateTermination: '2199-12-31T05:00:00Z',
          brand: 'ANTHEM-WCSIN',
          medicaidId: '135109488172',
          medicareId: '',
          coverageTypeCode: 'M',
          coverageTypeDescription: 'Medical',
          tobaccoStatus: '',
          firstName: 'SAMMIE',
          lastName: 'FERRELL',
          dateOfBirth: '2014-01-01T05:00:00Z',
          lobdId: 'INHA',
          homeZip: '46204',
          eligibilityStatusCode: 'Y',
          activeStatus: 'Active',
          groupName: 'INDIANA MEDICAID',
          subGroupName: 'OHIO',
          subGroupEffectiveDate: '2015-01-01T05:00:00Z',
          subGroupTerminationDate: '9999-12-31T05:00:00Z',
          strategicBusinessTypeCode: 'MedicaidAGP',
          subGroupNbr: '0058',
          market: 'IN',
          sourceSystem: 'GBDFACETS',
          marketingBrand: 'ABCBS',
          dualCitizenshipDetails: [],
          vendorName: '',
          fundingTypeCd: '',
          planBenefitPackageID: '',
          productValueCode: '',
          componentDetails: [
            { componentID: 'MED', componentDescription: null }
          ],
          warningMessages: [],
          planEntryDate: '2017-06-01T04:00:00Z',
          eligRecordUpdatedDate: '2020-09-18T00:49:35Z',
          eligNotifyDate: null,
          memeCk: '795367350',
          groupPhoneNumber: '7324526000',
          cmscontractCode: ''
        }
      ],
      status: '200'
    };

    const errorRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579b754b2c',
          errorCode: API_RESPONSE.statusCodes[451],
          title: API_RESPONSE.messages.ageRestrictionTitle,
          detail: API_RESPONSE.messages.ageRestrictionDetail
        }
      }
    };

    const resp = await service.getMemberEligibility(
      'token',
      'YRH893240946',
      ['IN'],
      'ABCBS',
      false,
      false
    );
    try {
      mockMemberGateway.memberEligibility.mockReturnValue(expRes);
      (moment().diff as jest.MockedFunction<any>)
        .mockReturnValueOnce('2014-01-01T05:00:00Z')
        .mockReturnValueOnce('01–01-2014');
      expect(jest.isMockFunction(moment)).toBeTruthy();
      expect(jest.isMockFunction(moment().diff)).toBeTruthy();
      mockResult.errorInfo(errorRes.data.errors);
      mockResult.createError.mockReturnValue(errorRes);
      expect(resp).toEqual(errorRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('createMemberDataForGbd', async () => {
    const eligibility = eligibilityResponse.eligibilities[0];

    const expRes = {
      userId: '269cdb5f-d331-43bc-a638-3f747bb04c96',
      brand: eligibility.brand,
      underState: eligibility.market,
      groupId: eligibility.groupId,
      subscriber: 'SUBSCRIBER',
      sourceSys: eligibility.sourceSystem,
      lob: eligibility.lobdId,
      planType: eligibility.productName,
      subGroupId: eligibility.subgroupId
    };
    const resp = service.createMemberDataForGbd(
      eligibilityResponse.eligibilities[0],
      '269cdb5f-d331-43bc-a638-3f747bb04c96',
      'SUBSCRIBER'
    );
    try {
      mockMemberGateway.memberEligibility.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
