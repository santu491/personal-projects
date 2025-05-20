import {AxiosRequestConfig} from 'axios';
import {
  APIResponseCodes,
  HeaderKeys,
  ObjectKeys,
  ServiceConstants,
} from '../constants';
import {ChatInitPayload, UserBaseData} from '../models/Chat';
import {APP} from '../utils/app';
import {axiosPost} from '../utils/httpUtil';

export class ChatGateway {
  private host = APP.config.memberAuth.eap.host;
  private securePath = APP.config.memberAuth.eap.basePath.secure;
  private publicPath = APP.config.memberAuth.eap.basePath.public;

  async initChat(
    payload: ChatInitPayload,
    accessToken: string,
    userData: UserBaseData | null = null,
  ) {
    let url;
    let headers: AxiosRequestConfig['headers'] = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };
    if (userData) {
      url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.genesysChat.init}`;
      headers = {
        ...headers,
        [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${userData.secureToken}`,
        [HeaderKeys.SMUNIVERSALID]: userData.username,
      };
    } else {
      url = `${this.host}${this.publicPath}${APP.config.memberAuth.eap.genesysChat.init}`;
    }

    const response = await axiosPost(url, payload, headers);
    if (response.status === APIResponseCodes.SUCCESS) {
      response.data = {
        ...response.data,
        key: response.data[ObjectKeys.KEY],
      };
      delete response.data[ObjectKeys.KEY];
      return response.data;
    }

    return null;
  }

  public async getChatResources(
    clientName: string,
    accessToken: string,
    userName?: string,
    secureToken?: string,
  ) {
    const getdataURL = secureToken
      ? `${this.host}${this.securePath}${APP.config.memberAuth.eap.genesysChat.getData}`
      : `${this.host}${this.publicPath}${APP.config.memberAuth.eap.genesysChat.getData}`;

    const headers = secureToken
      ? {
          [HeaderKeys.SMUNIVERSALID]: userName,
          [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
          [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
          [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
        }
      : {
          [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
          [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
        };

    const response = await axiosPost(
      getdataURL,
      {
        clientUserName: clientName,
      },
      headers,
    );
    if (response.status === APIResponseCodes.SUCCESS) {
      const result = {
        isChatAvailable:
          response.data[ObjectKeys.CHAT_STATUS] === ObjectKeys.OPEN,
        config: response.data.Config,
      };
      return result;
    }

    return null;
  }
}
