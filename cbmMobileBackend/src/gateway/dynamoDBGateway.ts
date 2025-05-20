import {AxiosRequestConfig} from 'axios';
import {DB_PATH} from '../constants';
import {APP} from '../utils/app';
import {decrypt} from '../utils/security/encryptionHandler';
import {axiosPost, axiosPut} from '../utils/httpUtil';

export class DynamoDBGateway {
  private host = APP.config.database.host;
  private securePath = APP.config.database.basePath.secure;

  private getHeaders = (headers: AxiosRequestConfig['headers'] = {}) => {
    return headers
      ? {
          ...headers,
          apikey: decrypt(APP.config.database.apikey),
        }
      : {
          apikey: decrypt(APP.config.database.apikey),
        };
  };

  getRecords = async (query: unknown) => {
    const url = `${this.host}${this.securePath}${DB_PATH.records}${DB_PATH.get}`;
    const response = await axiosPost(url, query, this.getHeaders());

    if (response.status !== 200) {
      return null;
    }

    return response.data;
  };

  getAllRecords = async (payload: unknown) => {
    const url = `${this.host}${this.securePath}${DB_PATH.scanTable}`;
    const response = await axiosPost(url, payload, this.getHeaders());

    return response.data.data;
  };

  getMultipleRecords = async (payload: unknown) => {
    try {
      const url = `${this.host}${this.securePath}${DB_PATH.records}${DB_PATH.all}`;
      const response = await axiosPost(url, payload, this.getHeaders());

      return response.data;
    } catch (error) {
      return null;
    }
  };

  queryTable = async (query: unknown) => {
    const url = `${this.host}${this.securePath}${DB_PATH.queryTable}`;
    const response = await axiosPost(url, query, this.getHeaders());

    return response.data;
  };

  /**
   * Adds value if id does not exist else updates the value
   * @param record Data to be added
   * @returns data object if succeeds
   */
  upsertRecord = async (record: unknown) => {
    const url = `${this.host}${this.securePath}${DB_PATH.records}`;
    const response = await axiosPost(url, record, this.getHeaders());

    return response.data;
  };

  updateRecord = async (record: unknown) => {
    const url = `${this.host}${this.securePath}${DB_PATH.records}`;
    const response = await axiosPut(url, record, this.getHeaders());

    return response.data;
  };

  deleteRecord = async (record: unknown) => {
    const url = `${this.host}${this.securePath}${DB_PATH.records}${DB_PATH.delete}`;
    const response = await axiosPut(url, record, this.getHeaders());

    return response.data;
  };
}
