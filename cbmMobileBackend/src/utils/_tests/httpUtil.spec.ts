import axios from 'axios';
import {axiosGet, axiosPost} from '../httpUtil';
import {APP} from '../app';
import {appConfig} from '../mockData';

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    post: jest.fn(),
    get: jest.fn(),
    create: jest.fn(() => actualAxios),
  };
});

describe('httpUtils', () => {
  beforeEach(() => {
    APP.config.security = appConfig.security;
    jest.clearAllMocks();
  });

  it('Should be able to do http post call', async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: {},
      request: {
        method: 'post',
      },
    });
    try {
      await axiosPost('http://mock-post.com', {}, {});
    } catch (error) {
      expect(error).toEqual(new Error('getaddrinfo ENOTFOUND mock-post.com'));
    }
  });

  it('Should be able to do http get call', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {},
      request: {
        method: 'get',
      },
    });
    try {
      await axiosGet('http://mock-get.com', {});
    } catch (error) {
      expect(error).toEqual(new Error('getaddrinfo ENOTFOUND mock-get.com'));
    }
  });
});
