import {CommonConstants, Messages} from '../../constants';
import {EAPMemberProfileGateway} from '../../gateway/eapMemberProfileGateway';
import {TelehealthGateway} from '../../gateway/telehealthGateway';
import {MemberOAuthPayload} from '../../types/customRequest';
import {
  ClinicalQuestionsRequest,
  MdLiveAppointmentResponse,
} from '../../types/telehealthModel';
import {getAccessToken} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';

export class TelehealthService {
  private className = this.constructor.name;
  private Logger = logger();
  private result = new ResponseUtil();
  private eapMemberProfileGateway = new EAPMemberProfileGateway();
  private telehealthGateway = new TelehealthGateway();

  async createMdliveAppointmentService(
    memberPayload: MemberOAuthPayload,
    clinicalQuestions: ClinicalQuestionsRequest,
  ) {
    try {
      const accessToken = await getAccessToken();

      const userDetails =
        await this.eapMemberProfileGateway.getUserProfileDetails(
          memberPayload.userName!,
          accessToken,
        );

      // eslint-disable-next-line prefer-const
      let {redirectURl, cw_auth_token}: MdLiveAppointmentResponse =
        await this.telehealthGateway.createMdLiveAppointment(
          memberPayload,
          clinicalQuestions,
          userDetails,
          accessToken,
        );

      if (!(redirectURl && cw_auth_token)) {
        return this.result.createException(Messages.appointmentError);
      }

      redirectURl = redirectURl.startsWith(CommonConstants.https)
        ? redirectURl
        : `${CommonConstants.https}://${redirectURl}`;

      return this.result.createSuccess({
        uri: `${redirectURl}`,
        serviceToken: cw_auth_token,
      });
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - createMdliveAppointmentService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.appointmentError,
      );
    }
  }
}
