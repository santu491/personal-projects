import {
  APIResponseCodes,
  AppointmentTypes,
  HeaderKeys,
  Messages,
  ServiceConstants,
} from '../constants';
import {
  AppointmentRequest,
  UpdateAppointmentRequest,
} from '../models/Appointment';
import {APP} from '../utils/app';
import {createGatewayResponse} from '../utils/common';
import {axiosGet, axiosPost, axiosPut} from '../utils/httpUtil';

export class AppointmentGateway {
  private host = APP.config.memberAuth.eap.host;
  private securePath = APP.config.memberAuth.eap.basePath.secure;

  // Function to create an appointment
  async createAppointment(
    request: AppointmentRequest,
    username: string,
    cookieToken: string,
    accessToken: string,
  ) {
    try {
      const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.create}`;

      const headers = {
        [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
        [HeaderKeys.SMUNIVERSALID]: username,
        [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${cookieToken}`,
        [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
        [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      };
      // Send a POST request to create appointment
      const response = await axiosPost(url, request, headers);

      return response.status === APIResponseCodes.SUCCESS
        ? createGatewayResponse(APIResponseCodes.SUCCESS, response.data)
        : createGatewayResponse(
            APIResponseCodes.BAD_REQUEST,
            Messages.appointmentError,
          );
    } catch (error: any) {
      return createGatewayResponse(
        error.response.status,
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message,
      );
    }
  }

  async getAssessmentRequired(iamguid: string, accessToken: string) {
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.assessmentRequired}`;

    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };
    const response = await axiosGet(url, headers, {iamguid});

    if (response.status === APIResponseCodes.SUCCESS) {
      return response.data;
    }

    return null;
  }

  async fetchAppointmentStatus(
    username: string,
    accessToken: string,
    cookieToken: string,
  ) {
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.tabStatus}`;

    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.SMUNIVERSALID]: username,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${cookieToken}`,
    };
    const response = await axiosGet(url, headers);

    if (response.status === APIResponseCodes.SUCCESS) {
      if (response.data._id) {
        response.data.id = response.data._id;
        delete response.data._id;
      }
      return response.data;
    }

    return null;
  }

  async fetchAppointment(
    username: string,
    accessToken: string,
    cookieToken: string,
    id: string,
  ) {
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.fetchById}`;

    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.SMUNIVERSALID]: username,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${cookieToken}`,
    };
    const response = await axiosGet(url, headers, {id});

    if (response.status === APIResponseCodes.SUCCESS) {
      if (response.data.data._id) {
        response.data.data.id = response.data.data._id;
        delete response.data.data._id;
      }

      return response.data.data;
    }

    return null;
  }

  async updateAppointment(
    username: string,
    secureToken: string,
    request: UpdateAppointmentRequest,
    accessToken: string,
  ) {
    try {
      const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.update}`;

      const headers = {
        [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
        [HeaderKeys.SMUNIVERSALID]: username,
        [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
        [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
        [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      };

      const response = await axiosPut(url, request, headers);

      return response.status === APIResponseCodes.SUCCESS
        ? createGatewayResponse(APIResponseCodes.SUCCESS, response.data)
        : createGatewayResponse(
            APIResponseCodes.BAD_REQUEST,
            Messages.updateAppointmentError,
          );
    } catch (error: any) {
      return createGatewayResponse(
        error.response.status,
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message,
      );
    }
  }

  async fetchQuestions(employerType: string, accessToken: string) {
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.questionnaire}`;

    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };
    const response = await axiosGet(url, headers, {employerType});

    if (response.status === APIResponseCodes.SUCCESS) {
      return response.data;
    }

    return null;
  }

  async fetchMemberStatus(
    userName: string,
    iamguid: string,
    secureToken: string,
    accessToken: string,
  ) {
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.memberStatus}`;

    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.SMUNIVERSALID]: userName,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
    };
    const response = await axiosGet(url, headers, {
      iamguid,
      appointmentType: AppointmentTypes.pf,
    });

    if (response.status === APIResponseCodes.SUCCESS) {
      return response.data;
    }

    return null;
  }

  async fetchMemberDashboardData(
    userName: string,
    iamguid: string,
    filterCondition: string,
    secureToken: string,
    accessToken: string,
  ) {
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.appointment.memberDashboard}`;

    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.SMUNIVERSALID]: userName,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
    };
    const response = await axiosGet(url, headers, {
      filterCondition,
      iamguid,
    });

    if (response.status === APIResponseCodes.SUCCESS) {
      response.data.data.map((appointment: any) => {
        if (appointment._id) {
          appointment.id = appointment._id;
          delete appointment._id;
        }
      });
      return response.data;
    }

    return null;
  }
}
