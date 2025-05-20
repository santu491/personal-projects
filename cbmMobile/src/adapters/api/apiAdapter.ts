import { parse as parseUrl } from 'url';

import DeviceInfo from 'react-native-device-info';
import { addSslPinningErrorListener } from 'react-native-ssl-public-key-pinning';

import { LoginSuccessResponseDTO } from '../../../sdks/auth/src/models/login';
import { ForgotResponseDTO } from '../../../sdks/auth/src/models/mfa';
import { API_ENDPOINTS, AppConfig, BASE_URL } from '../../config';
import { RequestMethod, TokenInfo } from '../../models/adapters';
import { generateSessionId, getDeviceInstallationId } from '../../util/deviceDetails';
import { hasProp } from '../../util/hasProp';
import { extractJwtFromCookies } from '../../util/jwt';
import { CustomError } from './customError';
import { ServiceProvider } from './serviceProvider';

export class ApiAdapter implements ServiceProvider {
  private static instance: ApiAdapter;
  protected baseURL: string;
  private isTokenLoading: boolean = false;
  protected tokenInfo: TokenInfo | undefined;
  protected secureToken: string | undefined; // will be available after login
  protected source: string = 'eap';

  constructor() {
    this.baseURL = BASE_URL;
  }

  public callService = async <T>(
    endpoint: string,
    method: string,
    body: object | null = null,
    headers: { [key: string]: string | boolean } = {}
  ): Promise<T> => {
    const token = await this.getAccessToken();
    const url = `${this.baseURL}${endpoint}`;
    if (headers.isSecureToken && this.secureToken) {
      headers.cookie = `secureToken=${this.secureToken}`;
      delete headers.isSecureToken;
    }
    if (headers.source) {
      this.source = headers.source as string;
    }
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        source: this.source,
        authorization: `Bearer ${token}`,
        ...headers,
      },
      credentials: 'omit',
      body: body ? JSON.stringify(body) : null,
    };
    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await this.handleResponse<T>(response);
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (error) {
      const { host } = parseUrl(url);
      if (error instanceof Error && error.message === 'Network request failed' && host && pinningErrorDomains[host]) {
        error.message = 'SSL certificate error';
      }
      throw error;
    }
  };

  private setAccessToken = async (jwt: string) => {
    const currentDate = Date.now;
    const time = this.secureToken ? 59 * 60 * 1000 : 14 * 60 * 1000;
    const tokenInfo = {
      token: jwt.toString(),
      expireTime: currentDate() + time,
    };
    this.tokenInfo = tokenInfo;
  };

  private isTokenInvalid(tokenInfo: TokenInfo | undefined) {
    return !this.isTokenLoading && (!tokenInfo || Date.now() > tokenInfo.expireTime);
  }

  private publicToken = async () => {
    await this.callService(API_ENDPOINTS.ACCESS_TOKEN, RequestMethod.POST, {
      clientId: AppConfig.CLIENT_ID,
      installationId: await getDeviceInstallationId(),
      sessionId: await generateSessionId(),
      deviceModel: DeviceInfo.getModel(),
      deviceOSVersion: DeviceInfo.getSystemVersion(),
      appVersion: DeviceInfo.getVersion(),
    });
  };

  private refreshToken = async () => {
    try {
      await this.callService(API_ENDPOINTS.REFRESH_TOKEN, RequestMethod.GET, null);
    } catch (error) {
      console.warn(error);
    }
  };

  private getAccessToken = async (): Promise<string> => {
    if (!this.secureToken && this.isTokenInvalid(this.tokenInfo)) {
      this.isTokenLoading = true;
      await this.publicToken();
    } else if (this.secureToken && this.isTokenInvalid(this.tokenInfo)) {
      this.isTokenLoading = true;
      await this.refreshToken();
    }
    this.isTokenLoading = false;
    return this.tokenInfo?.token ?? '';
  };

  protected async getResponseBody<T>(response: Response): Promise<T | undefined> {
    if (response.headers.get('content-length') === '0' || response.status === 204) {
      return undefined;
    }
    if (response.ok) {
      switch (response.headers.get('content-type')?.split(';')[0]) {
        case 'application/json':
          return response.json();
      }
    } else {
      throw await response.json();
    }
  }

  protected getSecureToken = <T>(response: Awaited<T> | undefined) => {
    if (hasProp(response, 'data')) {
      const { data } = response;
      const { secureToken } = data as LoginSuccessResponseDTO | ForgotResponseDTO;
      this.secureToken = secureToken;
    }
  };

  async handleResponse<T>(response: Response): Promise<T> {
    try {
      const responseBody = await this.getResponseBody<T>(response);
      const responseString = JSON.stringify(responseBody);
      if (responseString.includes('secureToken')) {
        this.getSecureToken(responseBody);
      }
      const jwt = extractJwtFromCookies(response.headers.get('Set-Cookie') as string);
      if (jwt) {
        this.setAccessToken(jwt);
      }
      return responseBody as T;
    } catch (error) {
      console.info('response body not parseable or something failed in session handler', error);
      console.info(`completed request: `, {
        status: response.status,
        headers: response.headers,
        url: response.url,
        bodyString: response.bodyUsed ? undefined : await response.text(),
      });
      throw new CustomError({
        status: response.status,
        error,
      });
    }
  }
}

const pinningErrorDomains: Record<string, boolean | undefined> = {};
addSslPinningErrorListener((error) => {
  // Triggered when an SSL pinning error occurs due to pin mismatch
  pinningErrorDomains[error.serverHostname] = true;
});
