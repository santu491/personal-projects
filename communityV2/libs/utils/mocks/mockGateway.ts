import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { BingGateway } from 'api/communityresources/gateways/bingGateway';
import { MemberGateway } from 'api/communityresources/gateways/memberGateway';
import { ProfileUpdateARNGateway } from 'api/communityresources/gateways/profileUpdateARNGateway';

export const mockBingGateway: Mockify<BingGateway> = {
  getLocationDetails: jest.fn(),
  getPointLocationDetails: jest.fn()
};

export const memberGateway: Mockify<MemberGateway> = {
  webUserSearch: jest.fn(),
  webUserAuthenticate: jest.fn(),
  commercialMemberAuthenticate: jest.fn(),
  memberEligibility: jest.fn(),
  memberGetContactsApi: jest.fn(),
  memberLoginThreatApi: jest.fn(),
  loginValidateOtpApi: jest.fn(),
  medicaidValidateOtpApi: jest.fn(),
  memberSendOtp: jest.fn(),
  loginSaveCookieApi: jest.fn(),
  loginValidateQaApi: jest.fn(),
  memberInformationApi: jest.fn(),
  memberRecoveryThreatApi: jest.fn(),
  generatePasswordApi: jest.fn(),
  updateNewPasswordApi: jest.fn(),
  getGbdMemberContacts: jest.fn(),
  memberRecoveryContactApi: jest.fn(),
  memberEligibilitySynthetic: jest.fn(),
  onPremSyntheticToken: jest.fn(),
  authToken: jest.fn()
};

export const mockProfileUpdateArnGateway: Mockify<ProfileUpdateARNGateway> = {
  commercialTelephoneNumberApi: jest.fn(),
  commercialTextNumberApi: jest.fn(),
  commercialRecoveryNumberApi: jest.fn(),
  medicaidRecoveryNumberUpdateApi: jest.fn()
};
