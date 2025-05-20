import {StatusCodes} from 'http-status-codes';
import {CacheAuthTokenKeys, Messages} from '../../constants';
import {getEAPClientInfo} from '../../gateway/clientSearchGateway';
import {getCache, setCache} from '../../utils/cacheUtil';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {getAppConfig} from '../../utils/common';
import {Client} from '../../types/publicRequest';
import {ClientConfigurationService} from './clientConfigurationService';
import {EAPMemberProfileGateway} from '../../gateway/eapMemberProfileGateway';

const result = new ResponseUtil();

// Function to search for a client in the EAP service
export const searchEAPClient = async (
  client: string, // The client to be searched
  searchData: string, // The data to be searched
) => {
  try {
    // Get the access token for the EAP service
    const accessToken = await getEAPMemberProfileAccessToken();
    if (!accessToken) {
      return result.createException(
        Messages.memberEAPauthorizationError,
        StatusCodes.UNAUTHORIZED,
      );
    }
    // Get the client information from the EAP service
    const response = await getEAPClientInfo(client, searchData, accessToken);
    if (response) {
      const appConfig = await getAppConfig();

      if (!appConfig?.clients?.length) {
        return result.createException(Messages.allowedClientsError);
      }
      // Create a map of the allowed employers
      const allowedEmployersMap: Map<string, Client> = new Map(
        appConfig.clients.map((employer: Client) => [
          employer.userName,
          {
            logoUrl: employer?.logoUrl,
            supportNumber: employer?.supportNumber,
            enabled: employer?.enabled,
            userName: employer.userName,
          },
        ]),
      );
      // Filter the clients to only include the allowed employers
      response.clients = await filterAllowedClients(
        response.clients,
        allowedEmployersMap,
      );
      return result.createSuccess(response);
    }
    // If there is no response, return a client search error message
    return result.createException(
      Messages.clientSearchError,
      StatusCodes.BAD_REQUEST,
    );
  } catch (error: any) {
    logger().error(`ClientSearchService - searchEAPClient - error: ${error}`);
    return result.createException(
      Messages.clientSearchError,
      error?.response?.status,
    );
  }
};

// Function to get the EAP member profile access token
export const getEAPMemberProfileAccessToken = async () => {
  try {
    // Try to get the access token from the cache
    let accessToken = getCache(CacheAuthTokenKeys.eapClientSearchAccessToken);
    // If there is no access token in the cache
    if (!accessToken) {
      // Get the access token from the EAP service
      const memberProfileGateway = new EAPMemberProfileGateway();
      accessToken = await memberProfileGateway.getEAPAccessToken();
      // If an access token was received
      if (accessToken) {
        // Store the access token in the cache for 899 seconds
        setCache(
          CacheAuthTokenKeys.eapClientSearchAccessToken,
          accessToken,
          899,
        );
      }
    }
    // Return the access token
    return accessToken;
  } catch (error) {
    // If an error occurs, return null
    logger().error(
      `ClientSearchService - getEAPMemberProfileAccessToken :: ${error}`,
    );
    return null;
  }
};

async function filterAllowedClients(
  clients: any[],
  allowedEmployersMap: Map<string, Client>,
) {
  const filteredClients = [];
  for (const clientData of clients) {
    if (allowedEmployersMap.has(clientData.userName)) {
      const data = allowedEmployersMap.get(clientData.userName);
      if (data?.enabled) {
        clientData.logoUrl = await getClientLogo(data);
        clientData.supportNumber = data?.supportNumber;
        delete clientData?.createdBy;
        delete clientData?.updatedBy;
        filteredClients.push(clientData);
      }
    }
  }

  return filteredClients;
}

// Function to get the client logo
async function getClientLogo(data: Client) {
  try {
    let clientUri = data?.userName;
    let clientLogo = data?.logoUrl;
    if (data?.userName.toUpperCase().includes('DEMO')) {
      clientUri = 'company-demo';
    }
    const contentService = new ClientConfigurationService();
    const response = await contentService.getClientResources(clientUri);
    if (response?.data) {
      const responseData = response.data as {clientLogo?: string};
      if (responseData?.clientLogo) {
        clientLogo = responseData.clientLogo;
      }
    }
    return clientLogo;
  } catch (error) {
    return null;
  }
}
