/* eslint-disable @typescript-eslint/naming-convention */
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { RequestMethod } from '../../../models/adapters';
import { ApiAdapter } from '../apiAdapter';
import { CustomError } from '../customError';

const responseData = {
  status: 201,
  data: {
    isSuccess: true,
    isException: false,
    value: {
      firstName: 'Test',
      lastName: 'Test',
      email: 'kaspar.rani@example.com',
    },
  },
  headers: {},
};

jest.mock('../../../util/commonUtils', () => ({
  tokenIntegration: () => Promise.resolve('token'),
  isIOS: () => true,
  isAndroid: () => jest.fn(),
  dimensionCheck: () => true,
  RequestMethod: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
  convertApiResponse: () =>
    Promise.resolve({
      status: 201,
      data: responseData.data,

      headers: {
        get: () => ({
          'content-type': 'application/json',
        }),
      },
    }),
}));

describe('ApiAdapter', () => {
  let apiAdapter: ApiAdapter;
  beforeEach(() => {
    apiAdapter = new ApiAdapter();
    global.fetch = jest.fn();
  });

  it('should make a GET request', async () => {
    const endpoint = '/users';
    jest.spyOn(apiAdapter, 'callService').mockImplementationOnce(() => {
      return Promise.resolve(responseData);
    });

    const result = await apiAdapter.callService(endpoint, RequestMethod.GET, null);
    expect(result).toEqual(responseData);
  });

  it('should make a POST request', async () => {
    const endpoint = '/users';
    const body = { name: 'John Doe' };
    jest.spyOn(apiAdapter, 'callService').mockImplementationOnce(() => {
      return Promise.resolve(responseData);
    });
    const result = await apiAdapter.callService(endpoint, RequestMethod.POST, body);
    expect(result).toEqual(responseData);
  });

  it('should make a PUT request', async () => {
    const endpoint = '/users/1';
    const body = { name: 'John Doe' };
    jest.spyOn(apiAdapter, 'callService').mockImplementationOnce(() => {
      return Promise.resolve(responseData);
    });

    const result = await apiAdapter.callService(endpoint, RequestMethod.PUT, body);
    expect(result).toEqual(responseData);
  });

  it('should make a DELETE request', async () => {
    const endpoint = '/users/1';
    jest.spyOn(apiAdapter, 'callService').mockImplementationOnce(() => {
      return Promise.resolve(responseData);
    });

    const result = await apiAdapter.callService(endpoint, RequestMethod.DELETE, null);
    expect(result).toEqual(responseData);
  });

  it('should call callService', async () => {
    jest.spyOn(apiAdapter, 'callService').mockImplementationOnce(() => {
      return Promise.resolve(responseData);
    });

    const payload = {
      email: 'kaspar.rani@example.com',
      secret: 'Support@1',
    };
    const responseObj = await apiAdapter.callService(API_ENDPOINTS.LOGIN, 'POST', payload, {});
    expect(responseObj).toEqual(responseData);
  });

  it('should handle a successful JSON response', async () => {
    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'content-type': 'application/json', 'content-length': 'data' },
    });
    const result = await apiAdapter.handleResponse(response);
    expect(result).toEqual(responseData);
  });

  it('should handle a response with secureToken', async () => {
    const secureResponseData = {
      ...responseData,
      data: {
        ...responseData.data,
        secureToken: 'secureToken123',
      },
    };
    const response = new Response(JSON.stringify(secureResponseData), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    const result = await apiAdapter.handleResponse(response);
    expect(result).toEqual(secureResponseData);
  });

  it('should handle a response with JWT in Set-Cookie header', async () => {
    const jwt = 'jwtToken123';
    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Set-Cookie': `jwt=${jwt}`,
      },
    });
    const result = await apiAdapter.handleResponse(response);
    expect(result).toEqual(responseData);
  });

  it('should throw CustomError on non-OK response', async () => {
    const errorResponse = new Response(JSON.stringify({ error: 'error' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
    await expect(apiAdapter.handleResponse(errorResponse)).rejects.toThrow(CustomError);
  });

  it('should throw error if response body is not parseable', async () => {
    const invalidJsonResponse = new Response('Invalid JSON', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    await expect(apiAdapter.handleResponse(invalidJsonResponse)).rejects.toThrow();
  });
});
