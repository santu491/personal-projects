import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { HttpClient } from './../httpClient';

export const mockHttpClient: Mockify<HttpClient> = {
  request: jest.fn(),
  addRequestInterceptor: jest.fn(),
  addResponseInterceptor: jest.fn(),
  mockHttp: jest.fn()
};
