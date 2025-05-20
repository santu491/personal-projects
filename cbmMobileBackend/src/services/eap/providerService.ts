import {Messages} from '../../constants';
import {ProviderSearchGateway} from '../../gateway/providerSearchGateway';
import {
  ProvidersListRequest,
  SendEmailRequest,
} from '../../types/providersRequest';
import {getCache, setCache} from '../../utils/cacheUtil';
import {getAccessToken, replaceAll} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {AuditHelper} from '../helpers/auditHelper';
import {
  createProviderFilters,
  formatProvider,
  transformProvidersList,
} from '../helpers/providerHelper';

const result = new ResponseUtil();

export class ProviderService {
  private providerGateway = new ProviderSearchGateway();
  private Logger = logger();
  private className = this.constructor.name;
  auditHelper = new AuditHelper();

  async getProviderAddresses(addressString: string) {
    try {
      addressString = replaceAll(addressString, [{pattern: ',', value: ''}]);
      const addressList = await this.providerGateway.getProviderAddressesData(
        addressString,
        await getAccessToken(),
      );
      if (addressList) {
        return result.createSuccess(addressList);
      }
      return result.createException(Messages.addressError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getProviderAddresses :: ${error}`);
      return result.createException(
        error,
        error?.response?.status,
        Messages.addressError,
      );
    }
  }

  async getGeoCodeAddress(selectedAddress: string) {
    try {
      const geoCodeData = await this.providerGateway.getGeoCodeAddressInfo(
        selectedAddress,
        await getAccessToken(),
      );
      if (geoCodeData) {
        return result.createSuccess(geoCodeData);
      }
      return result.createException(Messages.addressError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getGeoCodeAddress :: ${error}`);
      return result.createException(
        error,
        error?.response?.status,
        Messages.addressError,
      );
    }
  }

  async fetchProvidersList(providersRequest: ProvidersListRequest) {
    try {
      const providersList = await this.providerGateway.getProvidersListData(
        providersRequest.data,
        await getAccessToken(),
      );
      if (providersList) {
        const formattedList = {
          providers: transformProvidersList(providersList?.hits?.hits),
          filters: createProviderFilters(providersList?.aggregations),
          total: providersList?.hits?.total?.value || 0,
        };

        return result.createSuccess(formattedList);
      }
      return result.createException(Messages.providersError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - fetchProvidersList :: ${error}`);
      return result.createException(
        error,
        error?.response?.status,
        Messages.providersError,
      );
    }
  }

  async getProviderDetails(data: string) {
    try {
      const providerData = await this.providerGateway.getProviderDetailsData(
        data,
        await getAccessToken(),
      );
      if (providerData) {
        return result.createSuccess({
          ...formatProvider(providerData),
          fields: providerData.fields,
        });
      }
      return result.createException(Messages.providersError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getProvidersList :: ${error}`);
      return result.createException(
        error,
        error?.response?.status,
        Messages.providersError,
      );
    }
  }

  async getProviderPublicAccessToken() {
    try {
      let accessToken = getCache('providerPublicAccessToken');
      if (!accessToken) {
        accessToken = await this.providerGateway.getAccessToken();
        if (accessToken) {
          setCache('providerPublicAccessToken', accessToken, 899);
        }
      }
      return accessToken;
    } catch (error) {
      this.Logger.error(
        `${this.className} - getProviderPublicAccessToken :: ${error}`,
      );
      return null;
    }
  }

  async sendEmailService(sendEmailPayload: SendEmailRequest) {
    try {
      const accessToken = await this.getProviderPublicAccessToken();
      if (!accessToken) {
        return result.createException(Messages.authorizationError);
      }
      const getProvidersDetailsData = await this.providerGateway.sendEmail(
        sendEmailPayload,
        accessToken,
      );
      if (getProvidersDetailsData) {
        return result.createSuccess(Messages.sendEmailSuccess);
      }
      return result.createException(Messages.sendEmailError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - sendEmailService :: ${error}`);
      return result.createException(
        error,
        error?.response?.status,
        Messages.sendEmailError,
      );
    }
  }
}
