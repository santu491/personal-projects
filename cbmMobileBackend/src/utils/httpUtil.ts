import axios, {AxiosRequestConfig} from 'axios';
import {APIResponseCodes, AuditParam} from '../constants';
import logger from './logger';
import {AuditFilter} from './audit/auditFilter';
import {LogAudit} from './audit/logAudit';

const auditFilter = new AuditFilter();

// Create an Axios instance
const axiosInstance = axios.create({
  withCredentials: true,
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    audit(response);
    return response;
  },
  error => {
    audit(error, true);
    return Promise.reject(error);
  },
);

export const axiosPost = async (
  url: string,
  requestBody: unknown,
  headers: AxiosRequestConfig['headers'],
  thresholdStatus: number = APIResponseCodes.THRESHOLD_STATUS,
) => {
  return await axiosInstance.post(`${url}`, requestBody, {
    headers,
    validateStatus: function (status) {
      return status <= thresholdStatus;
    },
    withCredentials: true,
  });
};

export const axiosGet = async (
  url: string,
  headers: AxiosRequestConfig['headers'],
  params?: AxiosRequestConfig['params'],
) => {
  return await axiosInstance.get(`${url}`, {headers, params});
};

export const axiosPut = async (
  url: string,
  requestBody: unknown,
  headers: AxiosRequestConfig['headers'],
) => {
  return await axiosInstance.put(`${url}`, requestBody, {headers});
};

const audit = (api: any, isError = false) => {
  let resBody;
  if (
    api.status === APIResponseCodes.SUCCESS ||
    api.status === APIResponseCodes.CREATED
  ) {
    resBody = 'Response Body Skipped';
  } else {
    resBody = api?.response
      ? auditFilter.getAuditedBody(api?.response)
      : auditFilter.getAuditedBody(api);
  }

  const log = new LogAudit([
    {
      name: AuditParam.METHOD,
      value: api.request.method,
    },
    {
      name: AuditParam.STATUS,
      value: api.status,
    },
    {
      name: AuditParam.URL,
      value: auditFilter.getRequestUrl(api.config),
    },
    {
      name: AuditParam.REQ,
      value: auditFilter.getAuditedBody(api.config),
    },
    {
      name: AuditParam.RES,
      value: resBody,
    },
  ]);
  if (isError) {
    logger().error(log.getAuditMessage());
  } else {
    logger().info(log.getAuditMessage());
  }
};
