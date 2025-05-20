import {
  API_RESPONSE,
  cacheKey,
  memberInfo,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { MemberGateway } from '../../gateways/memberGateway';
import {
  ForgotUserModel,
  IContactsDetail,
  IMemberInformation,
  IMemberLoginThreatResponse,
  IMemberTwoFALoginThreatResponse,
  IMemberTwoFAParameters,
  IUser
} from '../../models/memberModel';
import { BaseResponse } from '../../models/resultModel';
import { User } from '../../models/userModel';
import { AccessTokenHelper } from '../helpers/accessTokenHelper';
import { MemberServiceHelper } from '../helpers/memberServiceHelper';
import { LoginCommercialService } from '../login/commercialService';
import { MemberService } from '../memberService';

@Service()
export class ForgotUserCommercialService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private memberService: MemberService,
    private memberServiceHelper: MemberServiceHelper,
    private loginCommercialService: LoginCommercialService,
    private memberGateway: MemberGateway,
    @LoggerParam(__filename) private log: ILogger
  ) {}

  public async commercialForgotUser(
    forgotUserModel: ForgotUserModel,
    onPremToken: string
  ): Promise<BaseResponse> {
    try {
      const user = new User();
      const sydneyMemberTenantToken =
        await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
          cacheKey.sydneyMemberToken
        );
      const authToken = await this.memberGateway.authToken();
      const memberInfoRequest = this.formatFupMemberRequest(
        forgotUserModel,
        true
      );
      // const onPremToken = await this.accessTokenHelper.getOauthToken(
      //   cacheKey.onPremToken,
      //   true
      // );
      const memberInfoDetails =
        await this.loginCommercialService.commercialMemberInfo(
          authToken?.access_token,
          memberInfoRequest
        );
      if (!memberInfoDetails.data.isSuccess) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        this.result.errorInfo.detail = API_RESPONSE.messages.userNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      const memberData = memberInfoDetails.data.value as IMemberInformation;
      const searchUser = await this.memberService.searchMemberByWebguid(
        onPremToken,
        memberData?.webguid,
        false
      );
      const userResponse = searchUser.data.value as IUser;
      if (!userResponse?.username) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        this.result.errorInfo.detail = API_RESPONSE.messages.userNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      const member = await this.loginCommercialService.getCommercialMemberData(
        userResponse.username,
        sydneyMemberTenantToken.access_token
      );
      user.username = userResponse.username;
      user.firstName =
        userResponse.firstName ?? member.firstName ?? forgotUserModel.fname;
      user.lastName =
        userResponse.lastName ?? member.lastName ?? forgotUserModel.lname;
      user.secretQuestionAnswers = userResponse.secretQuestionAnswers.map(
        (secretQues) => {
          return { question: secretQues.question };
        }
      );
      user.memberData = member.memberData;
      const recoveryTreatDetails = await this.memberService.memberRecoveryTreat(
        {
          webguid: member.memberData.userId,
          model: memberInfo.loginTwoFAModel,
          usernm: userResponse.username,
          metaIpaddress: forgotUserModel?.metaIpaddress,
          cookieValue: forgotUserModel?.cookie,
          marketingBrand: memberInfo.APPLICATION,
          memberType: forgotUserModel.memberType
        }
      );
      const recoveryTreatData = recoveryTreatDetails.data
        .value as IMemberTwoFALoginThreatResponse;
      const recoveryThreatResponse = await this.memberService.loginTreatFormat(
        recoveryTreatData
      );
      user.recoveryTreatDetails = (recoveryThreatResponse ??
        {}) as IMemberLoginThreatResponse;
      const memberContactRequest = this.memberServiceHelper.formatMemberRequest(
        userResponse.username,
        member.firstName,
        member.lastName,
        member.hcid,
        member.dateOfBirth,
        member.memberData.snappreferred,
        false
      );

      const sydneyMemberToken =
        await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
          cacheKey.sydneyMemberToken
        );
      const contactDetails =
        await this.loginCommercialService.memberGetContacts(
          sydneyMemberToken?.access_token,
          memberContactRequest
        );
      user.contacts = contactDetails.data.value as IContactsDetail[];
      return this.result.createSuccess(user);
    } catch (error) {
      this.log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public formatFupMemberRequest(
    forgotUserModel: ForgotUserModel,
    isMemberInfo: boolean
  ) {
    const memberRequest: IMemberTwoFAParameters = {
      firstNm: forgotUserModel.fname,
      lastNm: forgotUserModel.lname,
      dob: forgotUserModel.dob
    };
    if (isMemberInfo) {
      memberRequest.hcId = forgotUserModel.hcid ?? forgotUserModel.studentId;
      memberRequest.email = forgotUserModel.email;
      memberRequest.employeeId = forgotUserModel.employeeId;
    } else {
      memberRequest.hcid = forgotUserModel.hcid;
    }
    return memberRequest;
  }
}
