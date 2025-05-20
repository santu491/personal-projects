import {HeaderKeys} from '../constants';
import {
  ProviderDetailRequest,
  SendEmailRequest,
} from '../types/providersRequest';
import {APP} from '../utils/app';
import {axiosPost} from '../utils/httpUtil';

export class ProviderSearchGateway {
  private host = APP.config.memberAuth.eap.host;
  private basePath = APP.config.memberAuth.eap.basePath.provider;

  async getProviderAddressesData(addressString: string, accessToken: string) {
    const url = `${this.host}${this.basePath}${APP.config.memberAuth.eap.provider.addresses}`;
    const headers = {
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
    };
    const res = await axiosPost(url, {data: addressString}, headers);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  }

  async getGeoCodeAddressInfo(selectedAddress: string, accessToken: string) {
    const url = `${this.host}${this.basePath}${APP.config.memberAuth.eap.provider.geocode}`;
    const headers = {
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
    };
    const res = await axiosPost(url, {data: selectedAddress}, headers);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  }

  getProvidersListData = async (
    providersRequest: ProviderDetailRequest,
    accessToken: string,
  ) => {
    const url = `${this.host}${this.basePath}${APP.config.memberAuth.eap.provider.providerList}`;
    const headers = {
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
    };
    const res = await axiosPost(url, {data: providersRequest}, headers);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  };

  getProviderDetailsData = async (providerId: string, accessToken: string) => {
    const url = `${this.host}${this.basePath}${APP.config.memberAuth.eap.provider.providerDetails}`;
    const headers = {
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
    };
    const res = await axiosPost(url, {data: providerId}, headers);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  };

  getAccessToken = async () => {
    const url = APP.config.providerSearchDetails.getAccessToken;
    const data = new URLSearchParams({
      scope: 'public',
      grant_type: 'client_credentials',
    }).toString();

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    const res = await axiosPost(url, data, headers);
    if (res.status === 200) {
      return res.data.access_token;
    }
    return null;
  };

  sendEmail = async (
    sendEmailPayload: SendEmailRequest,
    accessToken: string,
  ) => {
    const url = APP.config.providerSearchDetails.sendEmail;
    const headers = {
      Authorization: `${HeaderKeys.BEARER} ${accessToken}`,
    };
    const res = await axiosPost(url, sendEmailPayload, headers);
    if (res.status === 200 || res.status == 201) {
      return true;
    }
    return null;
  };
}
