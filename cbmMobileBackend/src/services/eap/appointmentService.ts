import {StatusCodes} from 'http-status-codes';
import {APIResponseCodes, Messages, ObjectKeys} from '../../constants';
import {AppointmentGateway} from '../../gateway/appointmentGateway';
import {
  AppointmentRequest,
  UpdateAppointmentRequest,
} from '../../models/Appointment';
import {ServiceResponse} from '../../types/eapMemberProfileModel';
import {getAccessToken} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {EAPMemberProfileService} from './eapMemberProfileService';
import {MemberOAuthPayload} from '../../types/customRequest';
import {AuditHelper} from '../helpers/auditHelper';

export class AppointmentService {
  result = new ResponseUtil();
  appointmentGateway = new AppointmentGateway();
  memberService = new EAPMemberProfileService();
  private Logger = logger();
  private className = this.constructor.name;
  auditHelper = new AuditHelper();

  /**
   * Creates an appointment
   * @param appointmentRequest Appointment Data
   * @param username Username
   * @param cookieToken Secure token
   * @returns SUCCESS if appointment is created
   */
  async createAppointment(
    appointmentRequest: AppointmentRequest,
    memberOAuth: MemberOAuthPayload,
    cookieToken: string,
  ) {
    try {
      const user: ServiceResponse =
        await this.memberService.getUserDetailsService(memberOAuth);
      let userData = {};
      if (user?.statusCode && user?.statusCode === StatusCodes.OK) {
        userData = this.getUserDataForAppointment(
          (user?.data as any)[ObjectKeys.DATA],
        );
      } else {
        return this.result.createException(
          Messages.userNotFound,
          user?.statusCode || APIResponseCodes.BAD_REQUEST,
        );
      }

      const appointment = await this.appointmentGateway.createAppointment(
        {...userData, ...appointmentRequest},
        memberOAuth.userName!,
        cookieToken,
        await getAccessToken(),
      );

      return appointment.status === APIResponseCodes.SUCCESS
        ? this.result.createSuccess(appointment, APIResponseCodes.CREATED)
        : this.result.createException(appointment?.message, appointment.status);
    } catch (error: any) {
      this.Logger.error(`${this.className} - createAppointment :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.appointmentError,
      );
    }
  }

  /**
   * Checks if user needs to fill in basic assessment
   * @param guid GUID for user
   * @returns if assessment is required or not
   */
  async getAssessmentRequired(guid: string) {
    try {
      const assessmentRequired =
        await this.appointmentGateway.getAssessmentRequired(
          guid,
          await getAccessToken(),
        );
      if (assessmentRequired === null)
        return this.result.createException(
          Messages.assessmentFailed,
          APIResponseCodes.INTERNAL_SERVER_ERROR,
        );
      return this.result.createSuccess(assessmentRequired);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - getAssessmentRequired :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.assessmentFailed,
      );
    }
  }

  async getAppointmentStatus(username: string, cookieToken: string) {
    try {
      const appointmentStatus =
        await this.appointmentGateway.fetchAppointmentStatus(
          username,
          await getAccessToken(),
          cookieToken,
        );
      if (appointmentStatus)
        return this.result.createSuccess(appointmentStatus);

      return this.result.createException(Messages.fetchAppointmentStatusError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getAppointmentStatus :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchAppointmentStatusError,
      );
    }
  }

  async fetchAppointment(username: string, cookieToken: string, id: string) {
    try {
      const appointment = await this.appointmentGateway.fetchAppointment(
        username,
        await getAccessToken(),
        cookieToken,
        id,
      );
      if (appointment) {
        return this.result.createSuccess(appointment);
      }
      return this.result.createException(Messages.fetchAppointmentError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - fetchAppointment :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchAppointmentError,
      );
    }
  }

  async getAppointmentDetails(username: string, cookieToken: string) {
    try {
      const appointmentStatusDetails =
        await this.appointmentGateway.fetchAppointmentStatus(
          username,
          await getAccessToken(),
          cookieToken,
        );
      if (!appointmentStatusDetails)
        return this.result.createException(
          Messages.fetchAppointmentStatusError,
        );

      if (appointmentStatusDetails.id) {
        const appointment = await this.appointmentGateway.fetchAppointment(
          username,
          await getAccessToken(),
          cookieToken,
          appointmentStatusDetails.id,
        );

        if (!appointment)
          return this.result.createException(Messages.fetchAppointmentError);

        const memberAppointment = {
          ...appointmentStatusDetails,
          ...appointment,
        };

        return this.result.createSuccess(memberAppointment);
      }

      return this.result.createSuccess(null);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - getAppointmentDetails :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchAppointmentError,
      );
    }
  }

  async updateAppointment(
    username: string,
    secureToken: string,
    updateRequest: UpdateAppointmentRequest,
  ) {
    try {
      // to handle the mobile app lint issue.
      updateRequest._id = updateRequest.id;
      const appointment = await this.appointmentGateway.updateAppointment(
        username,
        secureToken,
        updateRequest,
        await getAccessToken(),
      );
      return appointment.status === APIResponseCodes.SUCCESS
        ? this.result.createSuccess(appointment.data)
        : this.result.createException(appointment.message);
    } catch (error: any) {
      this.Logger.error(`${this.className} - updateAppointment :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.updateAppointmentError,
      );
    }
  }

  async getQuestions(employerType: string) {
    try {
      const questions = await this.appointmentGateway.fetchQuestions(
        employerType,
        await getAccessToken(),
      );
      if (questions) {
        return this.result.createSuccess(questions);
      }
      return this.result.createException(
        Messages.fetchAppointmentQuestionsError,
      );
    } catch (error: any) {
      this.Logger.error(`${this.className} - getQuestions :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchAppointmentQuestionsError,
      );
    }
  }

  async getMemberStatus(
    username: string,
    iamguid: string,
    secureToken: string,
  ) {
    try {
      const accessToken = await getAccessToken();
      let memberStatus = await this.appointmentGateway.fetchMemberStatus(
        username,
        iamguid,
        secureToken,
        accessToken,
      );
      if (memberStatus) {
        if (!memberStatus.success) {
          const appointmentStatus =
            await this.appointmentGateway.fetchAppointmentStatus(
              username,
              accessToken,
              secureToken,
            );
          if (appointmentStatus) {
            if (appointmentStatus.isApproved && appointmentStatus.id) {
              const appointmentDetails =
                await this.appointmentGateway.fetchAppointment(
                  username,
                  accessToken,
                  secureToken,
                  appointmentStatus.id,
                );
              // memberStatus.appointmentDetails = appointmentDetails.data;
              memberStatus.appointmentScheduledDateAndTime =
                appointmentDetails?.data?.appointmentScheduledDateAndTime?.date;
            }
            memberStatus = {
              ...memberStatus,
              appointmentStatus,
            };
          }
        }
        return this.result.createSuccess(memberStatus);
      }
      return this.result.createException(Messages.fetchMemberStatusError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getQuestions :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchMemberStatusError,
      );
    }
  }

  async getMemberDashboardData(
    userName: string,
    iamguid: string,
    status: string,
    secureToken: string,
  ) {
    try {
      const memberDashboardFilter =
        await this.appointmentGateway.fetchMemberDashboardData(
          userName,
          iamguid,
          status,
          secureToken,
          await getAccessToken(),
        );
      if (memberDashboardFilter) {
        return this.result.createSuccess(memberDashboardFilter.data);
      }
      return this.result.createException(
        Messages.fetchMemberDashboardFilterError,
      );
    } catch (error: any) {
      this.Logger.error(`${this.className} - getQuestions :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchMemberDashboardFilterError,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getUserDataForAppointment(userData: any) {
    return userData
      ? {
          employerType: userData?.employerType,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.emailAddress,
          dob: userData?.dob,
          gender: userData?.gender,
          phone: userData?.communication?.mobileNumber,
          communication: userData?.address,
          clientName: userData?.clientName,
          groupId: userData?.clientGroupId,
          healthInsuranceCarrier: '',
          planName: '',
          appointmentType: 'pf',
        }
      : {};
  }
}
