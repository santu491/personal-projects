import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { UrlHelper } from './../urlHelper';

export const mockUrlHelper: Mockify<UrlHelper> = {
  encodeUriSegment: jest.fn(),
  encodeUriQuery: jest.fn(),
  getUrlParam: jest.fn(),
  getAllUrlParameters: jest.fn(),
  getUrlParameter: jest.fn()
};
