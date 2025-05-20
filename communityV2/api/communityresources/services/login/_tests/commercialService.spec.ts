import {
  mockInternalService,
  mockMemberGateway,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { IMemberTwoFAParameters } from 'api/communityresources/models/memberModel';
import { LoginCommercialService } from '../commercialService';

describe('CommercialService', () => {
  let service: LoginCommercialService;
  beforeEach(() => {
    service = new LoginCommercialService(
      <any>mockResult,
      mockInternalService as any,
      mockMemberGateway as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get commercial member information', async () => {
    const request: IMemberTwoFAParameters = {
      firstNm: 'GUERRERO',
      lastNm: 'HOWELL',
      dob: '1980-01-01',
      hcId: 'GQH812584146',
      mbrGenericId: '',
      employeeId: '',
      metaPersonType: 'preferred',
      usernm: 'SIT3GQH812584146',
      email: ''
    };
    const expRes = {
      mcId: '322767413',
      userNm: 'SIT3GQH812584146',
      webguid: '4f2b6bfd-757d-4b8d-9d10-c7994ef9f56c',
      iamGuid: '73bb998b-9bd2-4d71-8109-35abbd4f4bcd',
      enforceStrict2FA: 'false',
      personType: 'ANTM'
    };
    const resp = await service.commercialMemberInfo('token', request);
    try {
      mockMemberGateway.memberInformationApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error when webguid is not present in commercial member information', async () => {
    const request: IMemberTwoFAParameters = {
      firstNm: 'GUERRERO',
      lastNm: 'HOWELL',
      dob: '1980-01-01',
      hcId: 'GQH812584146',
      mbrGenericId: '',
      employeeId: '',
      metaPersonType: 'preferred',
      usernm: 'SIT3GQH812584146',
      email: ''
    };
    const expRes = {
      mcId: '322767413',
      userNm: 'SIT3GQH812584146',
      iamGuid: '73bb998b-9bd2-4d71-8109-35abbd4f4bcd',
      enforceStrict2FA: 'false',
      personType: 'ANTM'
    };
    const resp = await service.commercialMemberInfo('token', request);
    try {
      mockMemberGateway.memberInformationApi.mockReturnValue(expRes);
      mockResult.createError.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should get commercial member data', async () => {
    const expResp = {
      memberData: {
        userId: "d52ae79d-56c5-40bb-8b5c-fdb843cf0b5a",
        brand: "BCBSGA",
        underState: "GA",
        groupId: "A68690",
        subscriber: "SCRBR",
        sourceSys: "STAR",
        lob: "SM",
        planType: "PPO",
        subGroupId: "1Q4Q00",
      },
      dateOfBirth: "1978-11-02",
      hcid: "750T60596",
      mcid: "700203802",
      firstName: "GA",
      lastName: "JONES",
    };
    const memberInfo = {
      member: {
        mbrUid: '700203802',
        userNm: '~SIT3GAJONES',
        webGuid: 'd52ae79d-56c5-40bb-8b5c-fdb843cf0b5a',
        firstNm: 'GA',
        middleNm: 'N',
        lastNm: 'JONES',
        dob: '1978-11-02',
        genderCd: { code: 'M', name: 'Male', description: 'Male' },
        registrationTypeCd: 'MEMBER',
        eligibility: [
          {
            contractUid: '83B0AB6506FEACC5F6EF7FB4C21668B6',
            hcId: '750T60596',
            relationshipCd: {
              code: 'SCRBR',
              name: 'Subscriber',
              description: 'Subscriber'
            },
            planIndicators: [
              'OFF_EXCHANGE',
              'MY_HEALTH_RECORDS',
              'HAS_GA_CONTENT',
              'SUPPRESS_AUTHSREFERRALS'
            ],
            statusCd: { code: 'A', name: 'Active', description: 'Active' },
            effectiveDt: '2014-07-01',
            mbrSequenceNbr: '10',
            contractId: '750T60596',
            contractDataSource: 'EHUB',
            brandCd: {
              code: 'BCBSGA',
              name: 'BLUE CROSS AND BLUE SHIELD OF GA',
              description: 'BLUE CROSS AND BLUE SHIELD OF GA'
            },
            underwritingStateCd: { code: 'GA', name: 'Georgia' },
            sourceSystemId: 'STAR',
            groupNm: 'CR10',
            groupId: 'A68690',
            mbuCd: { code: 'SM', name: 'Small Group' },
            subscriberId: '456702009',
            residentialStateCd: {
              code: 'GA',
              name: 'GA',
              description: 'GEORGIA'
            },
            enrollmentTypeCd: {
              code: 'SBSCR',
              name: 'Male subscriber only',
              description:
                'Indicates that the coverage is for male subscriber only'
            },
            coverage: [
              {
                coverageKey: '1Q4Q-20220101-20221231-DEN',
                statusCd: { code: 'A', name: 'Active', description: 'Active' },
                effectiveDt: '2022-01-01',
                terminationDt: '2022-12-31',
                product: [
                  {
                    productId: '1Q4Q',
                    subgroupId: '1Q4Q00',
                    planNm: 'Small Group Plan 28',
                    healthcareArgmtCd: {
                      code: 'PPO',
                      name: 'Preferred Provider Organization'
                    },
                    coverageType: [
                      {
                        coverageTypeCd: {
                          code: 'DEN',
                          name: 'Dental',
                          description: 'Dental'
                        },
                        coverageProgram: [{ vendorNm: 'WDS' }]
                      }
                    ]
                  }
                ]
              },
              {
                coverageKey: '1Q4Q-20210101-20211231-DEN',
                statusCd: {
                  code: 'I',
                  name: 'Inactive',
                  description: 'Inactive'
                },
                effectiveDt: '2021-01-01',
                terminationDt: '2021-12-31',
                product: [
                  {
                    productId: '1Q4Q',
                    subgroupId: '1Q4Q00',
                    planNm: 'Small Group Plan 28',
                    healthcareArgmtCd: {
                      code: 'PPO',
                      name: 'Preferred Provider Organization'
                    },
                    coverageType: [
                      {
                        coverageTypeCd: {
                          code: 'DEN',
                          name: 'Dental',
                          description: 'Dental'
                        },
                        coverageProgram: [{ vendorNm: 'WDS' }]
                      }
                    ]
                  }
                ]
              },
              {
                coverageKey: '1Q4Q-20200101-20201231-DEN',
                statusCd: {
                  code: 'I',
                  name: 'Inactive',
                  description: 'Inactive'
                },
                effectiveDt: '2020-01-01',
                terminationDt: '2020-12-31',
                product: [
                  {
                    productId: '1Q4Q',
                    subgroupId: '1Q4Q00',
                    planNm: 'Small Group Plan 28',
                    healthcareArgmtCd: {
                      code: 'PPO',
                      name: 'Preferred Provider Organization'
                    },
                    coverageType: [
                      {
                        coverageTypeCd: {
                          code: 'DEN',
                          name: 'Dental',
                          description: 'Dental'
                        },
                        coverageProgram: [{ vendorNm: 'WDS' }]
                      }
                    ]
                  }
                ]
              }
            ],
            omeEnabled: 'FALSE',
            oeEnabled: 'FALSE',
            renewalDt: '9999-07-01',
            fundgTypeCd: 'FI'
          }
        ]
      }
    };
    mockInternalService.getMemberInfo.mockReturnValue(memberInfo);
    const resp = await service.getCommercialMemberData('token', '~sit3gajones');
    expect(resp).toEqual(expResp);
  });

  it('Should format commercial member data', async () => {
    const expResp = {
      mbrUid: '700203802',
      userNm: '~SIT3GAJONES',
      webGuid: 'd52ae79d-56c5-40bb-8b5c-fdb843cf0b5a',
      firstNm: 'GA',
      middleNm: 'N',
      lastNm: 'JONES',
      dob: '1978-11-02',
      genderCd: { code: 'M', name: 'Male', description: 'Male' },
      registrationTypeCd: 'MEMBER',
      eligibility: [
        {
          contractUid: '83B0AB6506FEACC5F6EF7FB4C21668B6',
          hcId: '750T60596',
          relationshipCd: {
            code: 'SCRBR',
            name: 'Subscriber',
            description: 'Subscriber'
          },
          planIndicators: [
            'OFF_EXCHANGE',
            'MY_HEALTH_RECORDS',
            'HAS_GA_CONTENT',
            'SUPPRESS_AUTHSREFERRALS'
          ],
          statusCd: { code: 'A', name: 'Active', description: 'Active' },
          effectiveDt: '2014-07-01',
          mbrSequenceNbr: '10',
          contractId: '750T60596',
          contractDataSource: 'EHUB',
          brandCd: {
            code: 'BCBSGA',
            name: 'BLUE CROSS AND BLUE SHIELD OF GA',
            description: 'BLUE CROSS AND BLUE SHIELD OF GA'
          },
          underwritingStateCd: { code: 'GA', name: 'Georgia' },
          sourceSystemId: 'STAR',
          groupNm: 'CR10',
          groupId: 'A68690',
          mbuCd: { code: 'SM', name: 'Small Group' },
          subscriberId: '456702009',
          residentialStateCd: {
            code: 'GA',
            name: 'GA',
            description: 'GEORGIA'
          },
          enrollmentTypeCd: {
            code: 'SBSCR',
            name: 'Male subscriber only',
            description:
              'Indicates that the coverage is for male subscriber only'
          },
          coverage: [
            {
              coverageKey: '1Q4Q-20220101-20221231-DEN',
              statusCd: { code: 'A', name: 'Active', description: 'Active' },
              effectiveDt: '2022-01-01',
              terminationDt: '2022-12-31',
              product: [
                {
                  productId: '1Q4Q',
                  subgroupId: '1Q4Q00',
                  planNm: 'Small Group Plan 28',
                  healthcareArgmtCd: {
                    code: 'PPO',
                    name: 'Preferred Provider Organization'
                  },
                  coverageType: [
                    {
                      coverageTypeCd: {
                        code: 'DEN',
                        name: 'Dental',
                        description: 'Dental'
                      },
                      coverageProgram: [{ vendorNm: 'WDS' }]
                    }
                  ]
                }
              ]
            },
            {
              coverageKey: '1Q4Q-20210101-20211231-DEN',
              statusCd: {
                code: 'I',
                name: 'Inactive',
                description: 'Inactive'
              },
              effectiveDt: '2021-01-01',
              terminationDt: '2021-12-31',
              product: [
                {
                  productId: '1Q4Q',
                  subgroupId: '1Q4Q00',
                  planNm: 'Small Group Plan 28',
                  healthcareArgmtCd: {
                    code: 'PPO',
                    name: 'Preferred Provider Organization'
                  },
                  coverageType: [
                    {
                      coverageTypeCd: {
                        code: 'DEN',
                        name: 'Dental',
                        description: 'Dental'
                      },
                      coverageProgram: [{ vendorNm: 'WDS' }]
                    }
                  ]
                }
              ]
            },
            {
              coverageKey: '1Q4Q-20200101-20201231-DEN',
              statusCd: {
                code: 'I',
                name: 'Inactive',
                description: 'Inactive'
              },
              effectiveDt: '2020-01-01',
              terminationDt: '2020-12-31',
              product: [
                {
                  productId: '1Q4Q',
                  subgroupId: '1Q4Q00',
                  planNm: 'Small Group Plan 28',
                  healthcareArgmtCd: {
                    code: 'PPO',
                    name: 'Preferred Provider Organization'
                  },
                  coverageType: [
                    {
                      coverageTypeCd: {
                        code: 'DEN',
                        name: 'Dental',
                        description: 'Dental'
                      },
                      coverageProgram: [{ vendorNm: 'WDS' }]
                    }
                  ]
                }
              ]
            }
          ],
          omeEnabled: 'FALSE',
          oeEnabled: 'FALSE',
          renewalDt: '9999-07-01',
          fundgTypeCd: 'FI'
        }
      ]
    };
    const resp = service.formatMemberData(expResp);
    try {
      mockInternalService.getMemberInfo.mockReturnValue(expResp);
      expect(resp).toEqual(expResp);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('memberGetContacts', async () => {
    const expRes = [
      {
        contactUid: 'recovery~1968592',
        contactValue: '***-***-9417',
        channel: 'TEXT'
      },
      {
        contactUid: 'recovery~1968592',
        contactValue: '***-***-9417',
        channel: 'VOICE'
      },
      {
        contactUid: 'profile~1638530602496001240021310',
        contactValue: 'P**********@LEGATO.COM',
        channel: 'EMAIL'
      }
    ];

    const request = {
      model: 'Member',
      metaIpaddress: '11.22.33.44',
      memberType: 'CN=eMember',
      firstNm: 'DHANA',
      lastNm: 'MANI',
      dob: '1988-01-01',
      hcid: 'BYM215T95543'
    };
    const resp = await service.memberGetContacts('token', request);
    try {
      mockMemberGateway.memberGetContactsApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return commercial snap user contact details', async () => {
    const expRes = [
      {
        contactUid: 'recovery~1968592',
        contactValue: '***-***-9417',
        channel: 'TEXT'
      },
      {
        contactUid: 'recovery~1968592',
        contactValue: '***-***-9417',
        channel: 'VOICE'
      },
      {
        contactUid: 'profile~1638530602496001240021310',
        contactValue: 'P**********@LEGATO.COM',
        channel: 'EMAIL'
      }
    ];

    const request = {
      model: 'Member',
      metaIpaddress: '11.22.33.44',
      memberType: 'CN=eMember',
      firstNm: 'DHANA',
      lastNm: 'MANI',
      dob: '1988-01-01',
      hcid: 'BYM215T95543',
      metaPersonType: 'SNAP'
    };
    const token = 'abcdefgh';
    const resp = await service.memberGetContacts(token, request);
    try {
      mockMemberGateway.memberGetContactsApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
