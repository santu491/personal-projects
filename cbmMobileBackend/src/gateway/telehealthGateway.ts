import {HeaderKeys, ServiceConstants} from '../constants';
import {MemberOAuthPayload} from '../types/customRequest';
import {UserProfileResponse} from '../types/eapMemberProfileModel';
import {
  ClinicalQuestionsRequest,
  MdLiveAppointmentResponse,
} from '../types/telehealthModel';
import {APP} from '../utils/app';
import {axiosPost} from '../utils/httpUtil';

export class TelehealthGateway {
  private host = APP.config.memberAuth.eap.host;
  private secureBasePath = APP.config.memberAuth.eap.basePath.secure;

  async createMdLiveAppointment(
    memberPayload: MemberOAuthPayload,
    clinicalQuestions: ClinicalQuestionsRequest,
    userProfileData: {data: UserProfileResponse; secureToken: string},
    accessToken: string,
  ): Promise<MdLiveAppointmentResponse> {
    const url = `${this.host}${this.secureBasePath}${APP.config.memberAuth.eap.telehealth.mdLiveAppointment}`;

    const headers = {
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${userProfileData.secureToken}`,
      [HeaderKeys.SMUNIVERSALID]: userProfileData?.data?.emailAddress,
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
    };

    const res = await axiosPost(
      url,
      this.createMdLiveAppointmentRequest(
        memberPayload,
        clinicalQuestions,
        userProfileData.data,
      ),
      headers,
    );
    return res.data;
  }

  private createMdLiveAppointmentRequest(
    memberPayload: MemberOAuthPayload,
    clinicalQuestions: ClinicalQuestionsRequest,
    userDetails: UserProfileResponse,
  ) {
    return {
      iamguid: memberPayload.iamguid,
      username: userDetails.mdLiveOU,
      parent_code: userDetails.parentCode,
      benefit_package: userDetails.benefitPackage,
      group_number: userDetails.clientGroupId,
      isPrivacyConsent: userDetails?.isPrivacyConsent,
      clinicalQuestions,
    };
  }
}
