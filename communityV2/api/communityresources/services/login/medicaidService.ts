import {
  API_RESPONSE,
  memberInfo,
  Result,
  unitOfTime
} from '@anthem/communityapi/common';
import * as moment from 'moment';
import { Service } from 'typedi';
import { MemberGateway } from '../../gateways/memberGateway';
import { IEligibility } from '../../models/memberModel';
import { MemberData } from '../../models/userModel';
import { AccessTokenHelper } from '../helpers/accessTokenHelper';

@Service()
export class LoginMedicaidService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private memberGateway: MemberGateway
  ) { }

  public async getMemberEligibility(
    token: string,
    hcid: string,
    market: string[],
    marketingBrand: string,
    fup: boolean,
    isDummy: boolean
  ) {
    token = isDummy ? await this.accessTokenHelper.getSyntheticToken() : token;
    const eligibility = isDummy
      ? await this.memberGateway.memberEligibilitySynthetic(token, hcid)
      : await this.memberGateway.memberEligibility(token, hcid);
    if (eligibility?.eligibilities?.length < 1 || eligibility?.status === API_RESPONSE.statusCodes[404] ) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.eligibilityFailure;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[470];
      return this.result.createError([this.result.errorInfo]);
    }

    if (
      !market.includes(eligibility?.eligibilities[0].market) ||
      eligibility.eligibilities[0].marketingBrand !== marketingBrand
    ) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail =
        API_RESPONSE.messages.userDoesNotExistInMarket;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[471];
      return this.result.createError([this.result.errorInfo]);
    }
    if (!fup) {
      const age = moment().diff(
        eligibility.eligibilities[0].dateOfBirth,
        unitOfTime.years,
        false
      );

      if (age <= memberInfo.RESTRICTED_AGE) {
        this.result.errorInfo.title = API_RESPONSE.messages.ageRestrictionTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.ageRestrictionDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[451];
        return this.result.createError([this.result.errorInfo]);
      }
    }

    /* Find the latest termination date from different plans */
    const eligibilities = eligibility.eligibilities.filter((value) =>
      value.type === memberInfo.PLAN_TYPE
    );
    const latestTerminationDate = eligibilities.reduce((a, b) => {
      return new Date(a.dateTermination) > new Date(b.dateTermination) ? a : b;
    });
    const terminationDate = moment(latestTerminationDate.dateTermination).add(2, unitOfTime.years).format(memberInfo.DATE_FORMAT);

    if (new Date(terminationDate) < new Date(moment().format(memberInfo.DATE_FORMAT))) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidOperationTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidOperationDetail;
      return this.result.createError(this.result.errorInfo);
    }

    return this.result.createSuccess(eligibility);
  }

  public createMemberDataForGbd(
    eligibility: IEligibility,
    webGuid: string,
    type: string
  ) {
    const memberData = new MemberData();
    memberData.userId = webGuid;
    memberData.brand = eligibility.brand;
    memberData.underState = eligibility.market;
    memberData.groupId = eligibility.groupId;
    memberData.subscriber = type;
    memberData.sourceSys = eligibility.sourceSystem;
    memberData.lob = eligibility.lobdId;
    memberData.planType = eligibility.productName;
    memberData.subGroupId = eligibility.subgroupId;
    return memberData;
  }
}
