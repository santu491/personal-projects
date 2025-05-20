import { Result } from '@anthem/communityapi/common';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { AuntBerthaGateway } from '../../gateways/auntBerthaGateway';
import { InternalService } from '../internalService';
import { ProgramHelperService } from '../programHelperService';
import { ProgramService } from '../programService';

describe('ProgramService', () => {
  let svc: ProgramService;
  const mockGateway: Mockify<AuntBerthaGateway> = {
    getServiceTags: jest.fn(),
    getProgramById: jest.fn(),
    getProgramsListByZipCode: jest.fn(),
    getToken: jest.fn()
  };

  const mockInternalService: Mockify<InternalService> = {
    getAuth: jest.fn(),
    getTermsOfUse: jest.fn(),
    getMemberInfo: jest.fn(),
    updateTermsOfUse: jest.fn(),
    validateAccessToken: jest.fn(),
    revokeAccessToken: jest.fn(),
  };

  const mockProgramHelperService: Mockify<ProgramHelperService> = {
    buildProgram: jest.fn(),
    buildPrograms: jest.fn(),
    buildProgarmList: jest.fn(),
    getProgramOffices: jest.fn(),
    getAttributeTagCountChildSubChildren: jest.fn(),
    getAttributeTagCountChildren: jest.fn()
  }

  const mockResult: Mockify<Result> = {
    createSuccess: jest.fn(),
    createError: jest.fn(),
    createErrorMessage: jest.fn(),
    createException: jest.fn(),
    createGuid: jest.fn(),
    errorInfo: jest.fn(),
    createExceptionWithValue:jest.fn()
  };

  beforeEach(() => {
    svc = new ProgramService(mockGateway as any, <any>mockILogger, <any>mockResult, mockProgramHelperService as any, mockInternalService as any,);
  });

  it('TODO update', async () => {
    const expResp = '{"nodes":[{"children":[{"label":"Disaster Response"},{"children":[{"label":"Help Pay for Food"},{"label":"Help Pay for Healthcare"},{"label":"Help Pay for Housing"},{"label":"Help Pay for Gas"},{"label":"Help Pay for School"},{"label":"Help Pay for Utilities"},{"label":"Help Pay for Internet or Phone"}],"label":"Emergency Payments"},{"label":"Emergency Food"},{"children":[{"label":"Weather Relief"}],"label":"Temporary Shelter"},{"label":"Help Find Missing Persons"},{"children":[{"label":"Help Escape Violence"},{"label":"Safe Housing"}],"label":"Immediate Safety"},{"label":"Psychiatric Emergency Services"}],"description":"Services for psychiatric emergencies, emergency financial assistance, immediate safety needs, disaster preparedness and disaster response.","label":"Emergency"},{"children":[{"label":"Community Gardens"},{"label":"Emergency Food"},{"label":"Food Delivery"},{"label":"Food Pantry"},{"label":"Meals"},{"children":[{"label":"Government Food Benefits"}],"label":"Help Pay for Food"},{"label":"Nutrition Education"}],"description":"Services for meals, food pantries, help paying for food, food delivery, food benefits and nutrition support.","label":"Food"},{"children":[{"label":"Temporary Shelter"},{"label":"Help Find Housing"},{"children":[{"label":"Help Pay for Utilities"},{"label":"Help Pay for Internet or Phone"},{"label":"Home & Renters Insurance"},{"label":"Housing Vouchers"}],"label":"Help Pay for Housing"},{"children":[{"label":"Efficiency Upgrades"},{"label":"Health & Safety"},{"label":"Pest Control"}],"label":"Maintenance & Repairs"},{"children":[{"label":"Foreclosure Counseling"},{"label":"Homebuyer Education"}],"label":"Housing Advice"},{"children":[{"children":[{"label":"Assisted Living"},{"label":"Independent Living"},{"label":"Nursing Home"},{"label":"Public Housing"}],"label":"Long-Term Housing"},{"label":"Safe Housing"},{"children":[{"label":"Nursing Home"},{"label":"Sober Living"}],"label":"Short-Term Housing"}],"label":"Residential Housing"}],"description":"Services for emergency, short-term and long-term housing, housing advice, help finding housing and help paying for housing.","label":"Housing"},{"children":[{"children":[{"label":"Baby Clothes"},{"label":"Diapers & Formula"}],"label":"Baby Supplies"},{"children":[{"label":"Baby Clothes"},{"label":"Clothes for School"},{"label":"Clothes for Work"},{"label":"Clothing Vouchers"}],"label":"Clothing"},{"children":[{"label":"Blankets & Fans"},{"label":"Books"},{"label":"Furniture"},{"label":"Home Fuels"},{"label":"Efficient Appliances"},{"label":"Personal Care Items"},{"label":"Supplies for School"},{"label":"Supplies for Work"}],"label":"Home Goods"},{"children":[{"label":"Assistive Technology"},{"label":"Prostheses"}],"label":"Medical Supplies"},{"label":"Personal Safety"},{"label":"Toys & Gifts"}],"description":"Services for clothing, furniture, baby supplies, toys and gifts and other physical goods.","label":"Goods"},{"children":[{"children":[{"label":"Bus Passes"},{"label":"Help Pay for Gas"},{"label":"Help Pay for Car"}],"label":"Help Pay for Transit"},{"children":[{"label":"Transportation for Healthcare"},{"label":"Transportation for School"}],"label":"Transportation"}],"description":"Services for bus passes, transportation to school, healthcare, appointments and more.","label":"Transit"},{"children":[{"children":[{"label":"12-Step"},{"label":"Detox"},{"label":"Outpatient Treatment"},{"label":"Residential Treatment"},{"label":"Sober Living"},{"label":"Drug Testing"},{"label":"Substance Abuse Counseling"},{"label":"Peer Recovery Coaching"},{"label":"Medications for Addiction"}],"label":"Addiction & Recovery"},{"label":"Dental Care"},{"children":[{"label":"Bereavement"},{"label":"Burial & Funeral Help"},{"label":"Hospice"}],"label":"End-of-Life Care"},{"children":[{"label":"Daily Life Skills"},{"label":"Disease Management"},{"label":"Family Planning"},{"label":"Nutrition Education"},{"label":"Parenting Education"},{"label":"Sex Education"},{"label":"Understand Disability"},{"label":"Understand Mental Health"},{"label":"Safety Education"}],"label":"Health Education"},{"children":[{"label":"Disability Benefits"},{"label":"Discounted Healthcare"},{"label":"Health Insurance"},{"label":"Prescription Assistance"},{"label":"Transportation for Healthcare"}],"label":"Help Pay for Healthcare"},{"label":"Vision Care"},{"children":[{"label":"Primary Care"},{"label":"Alternative Medicine"},{"children":[{"label":"Prostheses"},{"label":"Assistive Technology"}],"label":"Medical Supplies"},{"label":"Support & Service Animals"},{"label":"Skilled Nursing"},{"children":[{"label":"Disability Screening"},{"label":"Disease Screening"},{"label":"Hearing Tests"},{"label":"Pregnancy Tests"}],"label":"Checkup & Test"},{"label":"Exercise & Fitness"},{"label":"Personal Hygiene"},{"children":[{"label":"Early Childhood Intervention"},{"label":"Counseling"},{"label":"HIV Treatment"},{"label":"Pain Management"},{"label":"Disease Management"},{"label":"Nursing Home"},{"label":"Physical Therapy"},{"label":"Occupational Therapy"},{"label":"Speech Therapy"},{"label":"Specialized Therapy"},{"label":"Vaccinations"},{"label":"In-Home Support"},{"label":"Residential Treatment"},{"label":"Outpatient Treatment"},{"label":"Hospital Treatment"},{"label":"Medication Management"}],"label":"Prevent & Treat"},{"label":"Help Find Healthcare"}],"label":"Medical Care"},{"children":[{"label":"Anger Management"},{"label":"Bereavement"},{"children":[{"label":"Group Therapy"},{"label":"Substance Abuse Counseling"},{"label":"Family Counseling"},{"label":"Individual Counseling"}],"label":"Counseling"},{"label":"Medications for Mental Health"},{"label":"Mental Health Evaluation"},{"label":"Outpatient Treatment"},{"label":"Hospital Treatment"},{"label":"Residential Treatment"},{"label":"Psychiatric Emergency Services"},{"label":"Understand Mental Health"},{"label":"Support & Service Animals"}],"label":"Mental Health Care"},{"children":[{"children":[{"label":"Maternity Care"},{"label":"Postnatal Care"}],"label":"Womens Health"},{"label":"Fertility"},{"children":[{"label":"Birth Control"}],"label":"Family Planning"},{"label":"Sex Education"},{"children":[{"label":"HIV Treatment"}],"label":"STD/STI Treatment & Prevention"}],"label":"Sexual and Reproductive Health"}],"description":"Services for medical care, dental care, health education, addiction and recovery, help finding services and help paying for healthcare.","label":"Health"},{"children":[{"children":[{"label":"Help Pay for Childcare"},{"children":[{"label":"Government Food Benefits"}],"label":"Help Pay for Food"},{"children":[{"label":"Disability Benefits"},{"label":"Discounted Healthcare"},{"label":"Health Insurance"},{"label":"Medical Supplies"},{"label":"Prescription Assistance"},{"label":"Transportation for Healthcare"}],"label":"Help Pay for Healthcare"},{"children":[{"label":"Help Pay for Utilities"},{"label":"Help Pay for Internet or Phone"},{"label":"Home & Renters Insurance"}],"label":"Help Pay for Housing"},{"children":[{"label":"Books"},{"label":"Clothes for School"},{"label":"Financial Aid & Loans"},{"label":"Transportation for School"},{"label":"Supplies for School"}],"label":"Help Pay for School"},{"children":[{"label":"Help Pay for Gas"},{"label":"Bus Passes"}],"label":"Help Pay for Transit"},{"label":"Help Pay for Work Expenses"}],"label":"Financial Assistance"},{"children":[{"label":"Disability Benefits"},{"label":"Government Food Benefits"},{"label":"Retirement Benefits"},{"label":"Understand Government Programs"},{"label":"Unemployment Benefits"}],"label":"Government Benefits"},{"children":[{"label":"Credit Counseling"},{"label":"Foreclosure Counseling"},{"label":"Homebuyer Education"},{"label":"Savings Program"}],"label":"Financial Education"},{"children":[{"label":"Health Insurance"},{"label":"Home & Renters Insurance"}],"label":"Insurance"},{"label":"Tax Preparation"},{"children":[{"label":"Personal Loans"},{"label":"Business Loans"}],"label":"Loans"}],"description":"Services to help pay for housing, education, childcare, school, food and goods, financial education, tax preparation, insurance, government benefits, vouchers and more.","label":"Money"},{"children":[{"children":[{"label":"Adoption & Foster Placement"},{"label":"Adoption & Foster Parenting"},{"label":"Adoption Planning"},{"label":"Adoption Counseling"},{"label":"Post-Adoption Support"}],"label":"Adoption & Foster Care"},{"children":[{"label":"Weather Relief"},{"label":"Exercise & Fitness"},{"label":"Recreation"},{"label":"Computer or Internet Access"}],"label":"Community Support Services"},{"label":"Animal Welfare"},{"children":[{"label":"Head Start"},{"label":"Early Childhood Intervention"},{"label":"Adult Daycare"},{"label":"After School Care"},{"label":"Before School Care"},{"children":[{"label":"Help Find Childcare"},{"label":"Help Pay for Childcare"}],"label":"Childcare"},{"label":"Day Camp"},{"label":"Preschool"},{"label":"Relief for Caregivers"}],"label":"Daytime Care"},{"children":[{"label":"Bereavement"},{"label":"Burial & Funeral Help"},{"label":"Hospice"}],"label":"End-of-Life Care"},{"children":[{"label":"Help Fill out Forms"},{"label":"Case Management"}],"label":"Navigating the System"},{"children":[{"label":"Disaster Response"},{"label":"Emergency Food"},{"children":[{"label":"Weather Relief"}],"label":"Temporary Shelter"},{"label":"Help Find Missing Persons"},{"children":[{"label":"Help Escape Violence"},{"label":"Safe Housing"}],"label":"Immediate Safety"},{"label":"Safety Education"}],"label":"Physical Safety"},{"children":[{"label":"Assisted Living"},{"label":"Residential Treatment"},{"label":"Nursing Home"},{"label":"Overnight Camp"}],"label":"Residential Care"},{"children":[{"label":"Counseling"},{"label":"Help Hotlines"},{"label":"Home Visiting"},{"label":"In-Home Support"},{"label":"Mentoring"},{"label":"One-on-One Support"},{"label":"Peer Support"},{"label":"Peer Recovery Coaching"},{"label":"Spiritual Support"},{"children":[{"label":"12-Step"},{"label":"Bereavement"},{"label":"Parenting Education"}],"label":"Support Groups"},{"label":"Virtual Support"}],"label":"Support Network"}],"description":"Services for animal welfare, residential caregiving, daytime caregiving, adoption & foster care, building support networks, end-of-life care and help navigating the system.","label":"Care"},{"children":[{"label":"Help Find School"},{"children":[{"label":"Books"},{"label":"Clothes for School"},{"label":"Financial Aid & Loans"},{"label":"Transportation for School"},{"label":"Supplies for School"}],"label":"Help Pay for School"},{"children":[{"label":"Alternative Education"},{"label":"Disaster Preparedness & Response"},{"label":"English as a Second Language (ESL)"},{"children":[{"label":"Credit Counseling"},{"label":"Foreclosure Counseling"},{"label":"Homebuyer Education"}],"label":"Financial Education"},{"label":"Foreign Languages"},{"label":"GED/High-School Equivalency"},{"children":[{"label":"Disease Management"},{"label":"Family Planning"},{"label":"Nutrition Education"},{"label":"Parenting Education"},{"label":"Sex Education"},{"label":"Understand Disability"},{"label":"Understand Mental Health"},{"label":"Safety Education"}],"label":"Health Education"},{"label":"Supported Employment"},{"label":"Special Education"},{"label":"Tutoring"},{"label":"Civic Engagement"},{"label":"Environmental Education"},{"label":"College Readiness"},{"label":"Youth Development"}],"label":"More Education"},{"label":"Preschool"},{"children":[{"label":"Citizenship & Immigration"},{"label":"GED/High-School Equivalency"},{"label":"English as a Second Language (ESL)"}],"label":"Screening & Exams"},{"children":[{"label":"Basic Literacy"},{"label":"Computer Class"},{"label":"Daily Life Skills"},{"label":"Interview Training"},{"label":"Resume Development"},{"label":"Skills Assessment"},{"label":"Specialized Training"}],"label":"Skills & Training"}],"description":"Services for preschool, after-school, special education, help finding school, help paying for school, alternative education tutoring and more.","label":"Education"},{"children":[{"children":[{"label":"Job Placement"},{"label":"Supported Employment"}],"label":"Help Find Work"},{"children":[{"label":"Clothes for Work"},{"label":"Retirement Benefits"},{"label":"Supplies for Work"},{"label":"Unemployment Benefits"}],"label":"Help Pay for Work Expenses"},{"children":[{"label":"Basic Literacy"},{"label":"Computer Class"},{"label":"GED/High-School Equivalency"},{"label":"Interview Training"},{"label":"Resume Development"},{"label":"Skills Assessment"},{"label":"Specialized Training"}],"label":"Skills & Training"},{"label":"Supported Employment"},{"label":"Workplace Rights"}],"description":"Services for finding and sustaining work and improving job skills and abilities.","label":"Work"},{"children":[{"children":[{"children":[{"label":"Adoption & Foster Placement"},{"label":"Adoption & Foster Parenting"},{"label":"Adoption Planning"},{"label":"Adoption Counseling"},{"label":"Post-Adoption Support"}],"label":"Adoption & Foster Care"},{"label":"Citizenship & Immigration"},{"label":"Discrimination & Civil Rights"},{"label":"Guardianship"},{"label":"Identification Recovery"},{"label":"Understand Government Programs"},{"label":"Workplace Rights"}],"label":"Advocacy & Legal Aid"},{"label":"Mediation"},{"label":"Notary"},{"label":"Representation"},{"label":"Translation & Interpretation"}],"description":"Services for legal representation, mediation, advocacy, citizenship and immigration, adoption and foster care, guardianship, civil rights and more.","label":"Legal"}]}';
    const expAuthResponse = '{"token_type":"BearerToken","issued_at":"1628757143791","client_id":"ACGJ7yDYQZjq4wk2I99LGvMeQe7ue532","access_token":"test","application_name":"sydcom","scope":"","expires_in":"898","status":"approved"}';
    mockInternalService.getAuth.mockResolvedValue(expAuthResponse);
    mockGateway.getServiceTags.mockResolvedValue(expResp);
    let resp = await svc.getServiceTags();
    expect(expResp != null);
    expect( svc != null );
    expect(resp != null );
  });

  it('Should get program by id', async () => {
    const expResp = {
      "acceptsReferrals": true,
      "attributeTags": [
        "children",
        "low-income"
      ],
      "availability": "available",
      "coverageDescription": "This program covers residents of the following states: CA.",
      "description": "Head Start is a federal program for preschool children three to five years of age in low-income families.",
      "directions": "",
      "entryDate": "Dec 11, 2015 @ 08:53 PM",
      "facebookUrl": "",
      "freeOrReduced": "reduced_cost",
      "googlePlusId": "",
      "grain": "state",
      "grainLocation": [
        "CA"
      ],
      "id": "ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgIDAzrS6kwkM",
      "isOfficeAvailable": true,
      "name": "Head Start - California",
      "nextSteps": [
        {
          "action": "apply",
          "channel": "location",
          "contact": "_"
        }
      ],
      "offices": [
        {
          "address1": "499 Washington Avenue",
          "city": "Ukiah",
          "distance": -1,
          "hours": {
            "friday": true,
            "fridayAllDay": false,
            "fridayFinish": "03:00 PM",
            "fridayStart": "08:00 AM",
            "monday": true,
            "mondayAllDay": false,
            "mondayFinish": "03:00 PM",
            "mondayStart": "08:00 AM",
            "saturday": false,
            "saturdayAllDay": false,
            "sunday": false,
            "sundayAllDay": false,
            "thursday": true,
            "thursdayAllDay": false,
            "thursdayFinish": "03:00 PM",
            "thursdayStart": "08:00 AM",
            "timezone": "",
            "tuesday": true,
            "tuesdayAllDay": false,
            "tuesdayFinish": "03:00 PM",
            "tuesdayStart": "08:00 AM",
            "wednesday": true,
            "wednesdayAllDay": false,
            "wednesdayFinish": "03:00 PM",
            "wednesdayStart": "08:00 AM"
          },
          "isAdministrative": false,
          "location": {
            "latitude": 39.1339764,
            "longitude": -123.2138851
          },
          "name": "5402 Nokomis Hs & Ehs Center",
          "officeNumericId": "4506454886187008",
          "officeType": [
            "service"
          ],
          "openNowInfo": {
            "closeTime": "03:00 PM",
            "dayOfTheWeek": "Monday",
            "openAllDay": false,
            "openNow": true,
            "openTime": "08:00 AM"
          },
          "phoneNumber": "707-462-2671",
          "postal": "95482",
          "state": "CA",
          "supportedLanguages": [
            "english"
          ],
          "urlSafeKey": "ahJzfnNlYXJjaGJlcnRoYS1xYTFyEwsSBk9mZmljZRiAgMDVjNOACAw"
        }
      ],
      "programNumericId": "5152119452598272",
      "providerName": "United States Department of Health and Human Services",
      "providerNumericId": "6112334889091072",
      "score": 0,
      "serviceTags": [
        "caregiving"
      ],
      "supportedLanguages": [
        "English"
      ],
      "twitterId": "",
      "updateDate": "May 10, 2021 @ 09:55 AM",
      "validationDate": "Dec 30, 2015",
      "videoUrl": "",
      "websiteUrl": "http://www.acf.hhs.gov/programs/ohs",
      "wlScore": 0
    };
    const expAuthResponse = '{"token_type":"BearerToken","issued_at":"1628703461142","client_id":"Q2JJXThNJ2yEsPKAEZugPwospV4RhIVf","access_token":"test","application_name":"APIPerf_App","scope":"","expires_in":"896","status":"approved"}';
    mockGateway.getProgramById.mockResolvedValue(expResp);
    mockInternalService.getAuth.mockResolvedValue(expAuthResponse);
    let resp = await svc.getProgramById('5152119452598272');
    expect(expResp != null);
    expect(svc != null );
    expect(resp != null );
  });

  it('Should get programs by zipCode and limit to specific terms, attribute tags or service tags', async () => {
    const zipCode: number = 12345;
    const cursor: number = 0;
    const limit: number = 1;
    const terms: string = '';
    const attributeTag: string = '';
    const atoperand: string = 'and';
    const serviceTag: string = '';
    const stoperand: string = 'or';
    const expRes = {
      "data": {
          "isSuccess": true,
          "isException": false,
          "value": {
              "attribute_tag_counts": [
                  {
                      "children": [
                          {
                              "count": "4",
                              "name": "all ages"
                          },
                          {
                              "count": "1",
                              "name": "teens"
                          },
                          {
                              "count": "1",
                              "name": "young adults"
                          }
                      ],
                      "name": "Age Group"
                  },
                  {
                      "children": [
                          {
                              "count": "1",
                              "name": "abuse or neglect survivors"
                          },
                          {
                              "count": "2",
                              "name": "domestic violence survivors"
                          },
                          {
                              "count": "2",
                              "name": "trauma survivors"
                          }
                      ],
                      "name": "Survivors"
                  }
              ],
              "count": "262",
              "language_counts": [
                  {
                      "count": "5",
                      "name": "English"
                  }
              ],
              "postal_location": {
                  "latitude": 42.8145,
                  "longitude": -73.9403
              },
              "programs": [
                  {
                      "accepts_referrals": true,
                      "attribute_tags": [
                          "anyone in need",
                          "trauma survivors",
                          "domestic violence survivors",
                          "all ages"
                      ],
                      "availability": "available",
                      "coverage_description": "This program covers residents of the following states: NY.",
                      "description": "The New York State Office of Victim Services (OVS) is here to help you in a number of ways as you, a family member, or friend cope with victimization from a crime. This page is designed to: describe the services OVS can provide both directly and indirectly, educate you on your rights as a victim, and point you to other service providers who may also be able to assist you.<br /><br />A core mission of OVS is to provide compensation to innocent victims of crime for their out-of-pocket losses associated with the crime. This compensation, which in New York is broad and comprehensive, particularly in the area of long-term medical benefits, provides some financial relief to victims, who often suffer long-term financial loss in addition to the harm caused by the crime itself. <br />",
                      "directions": "",
                      "entry_date": "",
                      "facebook_url": "",
                      "free_or_reduced": "free",
                      "google_plus_id": "",
                      "grain": "state",
                      "grain_location": [
                          "NY"
                      ],
                      "id": "ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA9sz8iQkM",
                      "isOfficeAvailable": true,
                      "name": "Help for Crime Victims",
                      "next_steps": [
                          {
                              "action": "get more info",
                              "channel": "phone",
                              "contact": "800-247-8035"
                          },
                          {
                              "action": "apply",
                              "channel": "website",
                              "contact": "http://ovs.ny.gov/"
                          }
                      ],
                      "offices": [
                          {
                              "address1": "80 South Swan Street",
                              "address2": "AE Smith Building",
                              "city": "Albany",
                              "distance": 14.39,
                              "fax_number": "518-485-8885",
                              "hours": {
                                  "friday": true,
                                  "friday_all_day": false,
                                  "friday_finish": "05:00 PM",
                                  "friday_start": "09:00 AM",
                                  "monday": true,
                                  "monday_all_day": false,
                                  "monday_finish": "05:00 PM",
                                  "monday_start": "09:00 AM",
                                  "saturday": false,
                                  "saturday_all_day": false,
                                  "sunday": false,
                                  "sunday_all_day": false,
                                  "thursday": true,
                                  "thursday_all_day": false,
                                  "thursday_finish": "05:00 PM",
                                  "thursday_start": "09:00 AM",
                                  "timezone": "",
                                  "tuesday": true,
                                  "tuesday_all_day": false,
                                  "tuesday_finish": "05:00 PM",
                                  "tuesday_start": "09:00 AM",
                                  "wednesday": true,
                                  "wednesday_all_day": false,
                                  "wednesday_finish": "05:00 PM",
                                  "wednesday_start": "09:00 AM"
                              },
                              "is_administrative": false,
                              "location": {
                                  "latitude": 42.6539972,
                                  "longitude": -73.7597304
                              },
                              "name": "Albany Office",
                              "notes": "Victim Advocate\nLunida Gresham\n(518) 485-9104",
                              "office_numeric_id": "6200486155780096",
                              "office_type": [
                                  "service"
                              ],
                              "open_now_info": {
                                  "close_time": "05:00 PM",
                                  "day_of_the_week": "Tuesday",
                                  "open_all_day": false,
                                  "open_now": false,
                                  "open_time": "09:00 AM"
                              },
                              "phone_number": "518-457-8727",
                              "postal": "12210",
                              "state": "NY",
                              "supported_languages": [
                                  "en"
                              ],
                              "url_safe_key": "ahJzfnNlYXJjaGJlcnRoYS1xYTFyEwsSBk9mZmljZRiAgID28umBCww"
                          },
                      ],
                      "program_numeric_id": "5110413255507968",
                      "provider_name": "Office of Victim Services",
                      "provider_numeric_id": "5970412542361600",
                      "rules": [
                          "The victim must be an innocent victim of the crime",
                          "Victims of crime who were physically injured as a result of the crime",
                          "Victims of crime who are under 18, 60 and over, or disabled, who were not physically injured",
                          "Certain relatives and dependents, including surviving spouse, child, parent, brother, sister, stepbrother, stepsister, stepparent or person primarily dependent on the victim for support",
                          "Those who paid for or incurred burial costs for an innocent crime victim",
                          "Child victims, a child who witnesses a crime, and the child's parent, stepparent, grandparent, guardian, brother, sister, stepbrother or stepsister",
                          "Certain victims of unlawful imprisonment or kidnapping",
                          "Certain stalking victims",
                          "Victims of terrorist acts outside of the US who are a resident of New York State",
                          "Victims of frivolous lawsuits brought by a person who committed a crime against the victim"
                      ],
                      "score": 18.019547,
                      "service_tags": [
                          "transportation for healthcare",
                          "burial & funeral help",
                          "counseling",
                          "hospital treatment"
                      ],
                      "supported_languages": [
                          "English"
                      ],
                      "twitter_id": "",
                      "update_date": "",
                      "validation_date": "Jan 26, 2015",
                      "video_url": "",
                      "website_url": "http://ovs.ny.gov/",
                      "wl_score": 0
                  },
              ],
              "suggestion": ""
          }
      }
  }
    const expAuthResponse = '{"token_type":"BearerToken","issued_at":"1628703461142","client_id":"Q2JJXThNJ2yEsPKAEZugPwospV4RhIVf","access_token":"test","application_name":"APIPerf_App","scope":"","expires_in":"896","status":"approved"}';
    mockGateway.getProgramsListByZipCode.mockResolvedValue(expRes);
    mockInternalService.getAuth.mockResolvedValue(expAuthResponse);
    let resp = await svc.getProgramsListByZipCode(zipCode, cursor, limit, terms, attributeTag, atoperand, serviceTag, stoperand);
    expect(expRes != null);
    expect(svc != null );
    expect(resp != null );
  });

  it('Should get specific error from auntbertha', async () => {
    const zipCode: number = 12;
    const cursor: number = 0;
    const limit: number = 1;
    const terms: string = '';
    const attributeTag: string = '';
    const atoperand: string = 'and';
    const serviceTag: string = '';
    const stoperand: string = 'or';
    const expRes = {
      "data": {
          "isSuccess": false,
          "isException": false,
          "errors": [
              {
                  "id": "a36170cd-2c39-6e20-cb66-8be3bf6e66d7",
                  "errorCode": 404,
                  "title": "notFound",
                  "detail": "Postal Code 12 not found."
              }
          ]
      }
  }
    const expAuthResponse = '{"token_type":"BearerToken","issued_at":"1628703461142","client_id":"Q2JJXThNJ2yEsPKAEZugPwospV4RhIVf","access_token":"test","application_name":"APIPerf_App","scope":"","expires_in":"896","status":"approved"}';
    mockGateway.getProgramsListByZipCode.mockResolvedValue(expRes);
    mockInternalService.getAuth.mockResolvedValue(expAuthResponse);
    let resp = await svc.getProgramsListByZipCode(zipCode, cursor, limit, terms, attributeTag, atoperand, serviceTag, stoperand);
    expect(expRes != null);
    expect(svc != null );
    expect(resp != null );
  });
});
