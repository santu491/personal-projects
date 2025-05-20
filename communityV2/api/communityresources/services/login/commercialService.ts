import { API_RESPONSE, memberInfo, Result } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { MemberGateway } from '../../gateways/memberGateway';
import { Member } from '../../models/internalRequestModel';
import {
  IContactsDetail,
  IMemberTwoFAParameters
} from '../../models/memberModel';
import { BaseResponse } from '../../models/resultModel';
import { MemberData } from '../../models/userModel';
import { InternalService } from '../internalService';

@Service()
export class LoginCommercialService {
  constructor(
    private result: Result,
    private internalService: InternalService,
    private memberGateway: MemberGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async commercialMemberInfo(
    token: string,
    request: IMemberTwoFAParameters
  ): Promise<BaseResponse> {
    try {
      const memberInformation = await this.memberGateway.memberInformationApi(
        token,
        request
      );
      if (!memberInformation?.webguid) {
        return this.result.createError(memberInformation);
      }
      if (!memberInformation?.userNm) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        this.result.errorInfo.detail = API_RESPONSE.messages.userNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(memberInformation);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommercialMemberData(userName: string, token: string) {
    try {
      const memberInformation = await this.internalService.getMemberInfo(
        token,
        userName
      );
      return this.formatMemberData(memberInformation.member);
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(
        API_RESPONSE.statusCodes[500],
        API_RESPONSE.messages.memberDataFailure
      );
    }
  }

  public formatMemberData(member: Member) {
    try {
      let hcid: string;
      const memberData = new MemberData();
      memberData.userId = member.webGuid;
      if (member.reportingIndicators) {
        memberData.snappreferred =
          (member?.reportingIndicators || []).findIndex(
            (i: string) =>
              i.toUpperCase() === memberInfo.SNAP_PREFERRED_INDICATOR
          ) !== -1
            ? memberInfo.SNAP
            : memberInfo.PREFERRED;
        memberData.userType =
          memberData.snappreferred === memberInfo.SNAP
            ? memberInfo.SNAPUSER
            : memberInfo.PREFERRED;
      }
      if (member.eligibility && member.eligibility.length > 0) {
        const current = member.eligibility.find(
          (el) => el.statusCd.name === memberInfo.ACTIVE
        );
        hcid = current?.hcId;
        memberData.brand = current?.brandCd?.code;
        memberData.underState = current?.underwritingStateCd?.code;
        memberData.groupId = current?.groupId;
        memberData.subscriber = current?.relationshipCd?.code;
        memberData.sourceSys = current?.sourceSystemId;
        memberData.lob = current?.mbuCd?.code;
        if (current?.coverage && current?.coverage?.length > 0) {
          const coverage = current?.coverage?.find(
            (c) => c.statusCd.name === memberInfo.ACTIVE
          );
          if (coverage?.product && coverage?.product?.length > 0) {
            coverage?.product.map((pro) => {
              memberData.planType = pro?.healthcareArgmtCd?.code;
              memberData.subGroupId = pro?.subgroupId;
            });
          }
        }
      }
      return {
        memberData,
        dateOfBirth: member.dob,
        hcid,
        mcid: member.mbrUid,
        firstName: member.firstNm,
        lastName: member.lastNm
      };
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(
        API_RESPONSE.statusCodes[500],
        API_RESPONSE.messages.memberDataFailure
      );
    }
  }

  public async memberGetContacts(
    token: string,
    request: IMemberTwoFAParameters
  ): Promise<BaseResponse> {
    try {
      let contacts: IContactsDetail[];
      if (request.metaPersonType) {
        delete request.hcid;
        const snapContactDetails = await this.memberGateway.memberGetContactsApi(
          token,
          request
        );
        if (snapContactDetails.contact) {
          const snapContacts = (snapContactDetails.contact as unknown) as IContactsDetail[];
          contacts = [...snapContacts];
        }
      } else {
        delete request.metaPersonType;
        const memberContactDetails = await this.memberGateway.memberGetContactsApi(
          token,
          request
        );
        if (memberContactDetails.contact) {
          const memberContacts = (memberContactDetails.contact as unknown) as IContactsDetail[];
          contacts = [...memberContacts];
        }
      }
      return this.result.createSuccess(contacts);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
