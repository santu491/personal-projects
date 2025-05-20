import {
  APIResponseCodes,
  HeaderKeys,
  ReplaceStringKeyWords,
} from '../constants';
import {APP} from '../utils/app';
import {replaceAll} from '../utils/common';
import {axiosGet} from '../utils/httpUtil';

// Function to get the EAP client information
export const getEAPClientInfo = async (
  client: string, // The client to be searched
  searchData: string, // The data to be searched
  accessToken: string, // The access token for the EAP service
) => {
  const url = `${APP.config.memberAuth.eap.host}${replaceAll(
    APP.config.memberAuth.eap.clientSearch,
    [
      {
        pattern: ReplaceStringKeyWords.client,
        value: client,
      },
      {
        pattern: ReplaceStringKeyWords.searchData,
        value: searchData,
      },
    ],
  )}`;
  // Define the headers for the request
  const headers = {
    [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
    [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
  };
  // Send a GET request to the URL with the headers
  const response = await axiosGet(url, headers);
  // If the response status is SUCCESS, return the response data
  if (response.status === APIResponseCodes.SUCCESS) {
    return response.data;
  }
  // If the response status is not SUCCESS, return null
  return null;
};
