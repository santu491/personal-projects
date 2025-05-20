import {
  API_RESPONSE,
  Result,
  Validation,
  cacheKey,
  memberInfo
} from '@anthem/communityapi/common';
import { EncryptionUtil } from '@anthem/communityapi/security';
import { Service } from 'typedi';
import { TokenGateway } from '../../gateways/onPremTokenGateway';
import {
  ForgotUserModel,
  IContactList,
  IEligibilityResponse,
  IGbdMemberContactResponse,
  IMemberLoginThreatResponse,
  IMemberTwoFALoginThreatResponse,
  IUser,
  IUserAccountSummary
} from '../../models/memberModel';
import { BaseResponse } from '../../models/resultModel';
import { User } from '../../models/userModel';
import { AccessTokenHelper } from '../helpers/accessTokenHelper';
import { LoginServiceHelper } from '../helpers/loginServiceHelper';
import { MemberServiceHelper } from '../helpers/memberServiceHelper';
import { LoginMedicaidService } from '../login/medicaidService';
import { MemberService } from '../memberService';

@Service()
export class ForgotUserMedicaidService {
  constructor(
    private result: Result,
    private memberService: MemberService,
    private memberServiceHelper: MemberServiceHelper,
    private loginServiceHelper: LoginServiceHelper,
    private validation: Validation,
    private medicaidService: LoginMedicaidService,
    private accessTokenHelper: AccessTokenHelper,
    private onPremTokenGateway: TokenGateway
  ) {}

  public async medicaidForgotUser(
    forgotUserModel: ForgotUserModel,
    onPremToken: string
  ): Promise<BaseResponse> {
    const user = new User();
    const summary = await this.memberServiceHelper.getGbdMemberSummary(
      forgotUserModel.hcid,
      (
        await this.onPremTokenGateway.psgbdTenantToken()
      ).access_token,
      true
    );

    if (!summary?.data?.isSuccess) {
      return summary;
    }
    const accountSummary = summary.data.value as IUserAccountSummary;
    const isDummy = await this.loginServiceHelper.isDemoUser(
      accountSummary.username
    );
    const eligibilityResponse = await this.medicaidService.getMemberEligibility(
      onPremToken,
      accountSummary.hcid,
      forgotUserModel.market,
      forgotUserModel.marketingBrand,
      true,
      isDummy
    );
    if (!eligibilityResponse.data.isSuccess) {
      return eligibilityResponse;
    }
    const eligibility = eligibilityResponse?.data
      ?.value as IEligibilityResponse;

    const searchUser = await this.memberService.searchMemberByWebguid(
      onPremToken,
      accountSummary.userUuid,
      true
    );
    const userResponse = searchUser.data.value as IUser;
    if (!userResponse?.username) {
      this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
      this.result.errorInfo.detail = API_RESPONSE.messages.userNotFound;
      return this.result.createError([this.result.errorInfo]);
    }
    user.username = userResponse.username;
    user.firstName =
      userResponse.firstName ??
      accountSummary.firstName ??
      forgotUserModel.fname;
    user.lastName =
      userResponse.lastName ?? accountSummary.lastName ?? forgotUserModel.lname;
    user.secretQuestionAnswers = userResponse.secretQuestionAnswers.map(
      (secretQues) => {
        return { question: secretQues.question };
      }
    );
    user.memberData = this.medicaidService.createMemberDataForGbd(
      eligibility.eligibilities[0],
      userResponse.iamGuid,
      accountSummary.type
    );
    const recoveryTreatDetails = await this.memberService.memberRecoveryTreat({
      model: memberInfo.loginTwoFAModel,
      usernm: accountSummary.username,
      hcid: accountSummary.hcid,
      metaIpaddress: forgotUserModel?.metaIpaddress,
      cookieValue: forgotUserModel?.cookie,
      marketingBrand: memberInfo.marketingBrand,
      memberType: forgotUserModel.memberType
    });
    const recoveryTreatData = recoveryTreatDetails.data
      .value as IMemberTwoFALoginThreatResponse;
    const recoveryThreatResponse = await this.memberService.loginTreatFormat(
      recoveryTreatData
    );
    user.recoveryTreatDetails = (recoveryThreatResponse ??
      {}) as IMemberLoginThreatResponse;
    const psgbdToken = await this.accessTokenHelper.getPSGBDTenantOAuthToken(
      cacheKey.psgbdToken
    );
    const contactDetails = await this.memberServiceHelper.getGBDContactDetails(
      psgbdToken?.access_token,
      forgotUserModel.hcid,
      isDummy
    );
    if (!contactDetails.data.isSuccess) {
      this.result.createError(contactDetails);
      user.contacts = [];
    } else {
      const contactList: IContactList[] = [];
      const contacts = contactDetails.data.value as IGbdMemberContactResponse;
      contacts.contactDetails.forEach((contact) => {
        contactList.push({
          channel: contact.contactSubType ?? contact.contactType,
          contactUid: EncryptionUtil.encrypt(
            contact.contactValue,
            'aes-symmetric'
          ),
          contactValue: this.validation.maskEmailAndPhone(
            contact.contactValue,
            contact.contactType
          )
        });
      });
      user.contacts = contactList;
    }
    return this.result.createSuccess(user);
  }
}
