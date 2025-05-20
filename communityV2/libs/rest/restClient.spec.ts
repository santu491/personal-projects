import { BufferStream, HttpMethod, IHttpHeader } from '@anthem/communityapi/http';
import { mockHttpClient } from '@anthem/communityapi/http/mocks/mockHttpClient';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ResponseType } from './interfaces/iRestRequest';
import { mockJsonTransformer } from './mocks/mockJsonTransformer';
import { RestClient } from './restClient';

export class XTest {}

describe('RestClient UTest', () => {
  let client: RestClient;

  beforeEach(() => {
    client = new RestClient(<any>mockHttpClient, <any>mockILogger, mockJsonTransformer);
  });

  it('should handle binary response', () => {
    mockHttpClient.request.mockReturnValue(
      new Promise((resolve, reject) => {
        resolve({
          status: 200,
          body: Buffer.from('test', 'utf-8'),
          headers: {},
          requestUrl: 'test'
        });
      })
    );
    client
      .invoke({
        url: 'test',
        method: HttpMethod.Get,
        responseType: ResponseType.BINARY
      })
      .then(
        (result) => {
          expect(result instanceof BufferStream).toBeTruthy();
        },
        (error) => {
          expect(true).toBeFalsy();
        }
      );
  });

  it('should transform json responses to typescript class definitions if class types is given', () => {
    mockHttpClient.request.mockReturnValue(
      new Promise((resolve, reject) => {
        resolve({
          status: 201,
          body: { test: 'test reply' },
          headers: {},
          requestUrl: 'test'
        });
      })
    );
    mockJsonTransformer.jsonToClass.mockReturnValue({ test1: 'transformed response' });
    client
      .invoke(
        {
          url: 'test',
          method: HttpMethod.Get,
          responseType: ResponseType.JSON
        },
        XTest
      )
      .then(
        (result) => {
          let auditCall: { parameters: IHttpHeader[] } = mockILogger.audit.mock.calls[0][0];
          expect(auditCall.parameters.find((h) => h.name === 'HttpMethod').value).toBe('GET');
          expect(auditCall.parameters.find((h) => h.name === 'ResponseStatus').value).toBe(201);
          expect(auditCall.parameters.find((h) => h.name === 'OutUrl').value).toBe('test');
          expect(auditCall.parameters.find((h) => h.name === 'Request').value).toBe('');
          expect(JSON.parse(auditCall.parameters.find((h) => h.name === 'Response').value).test).toBe('test reply');
          expect((result as any).test1).toBe('transformed response');
        },
        (error) => {
          expect(true).toBeFalsy();
        }
      );
  });

  it('should handle api errors', async () => {
    mockHttpClient.request.mockReturnValue(
      new Promise((resolve, reject) => {
        reject({
          status: 500,
          body: { errors: [{ detail: 'api error' }] },
          headers: {},
          requestUrl: 'test'
        });
      })
    );

    try {
      await client.invoke({
        url: 'test',
        method: HttpMethod.Get,
        responseType: ResponseType.JSON
      });
      expect(true).toBeFalsy();
    } catch (error) {
      let auditCall: { parameters: IHttpHeader[] } = mockILogger.audit.mock.calls[0][0];
      expect(auditCall.parameters.find((h) => h.name === 'HttpMethod').value).toBe('GET');
      expect(auditCall.parameters.find((h) => h.name === 'ResponseStatus').value).toBe(500);
      expect(auditCall.parameters.find((h) => h.name === 'OutUrl').value).toBe('test');
      expect(auditCall.parameters.find((h) => h.name === 'Request').value).toBe('');
      expect(JSON.parse(auditCall.parameters.find((h) => h.name === 'Response').value).errors[0].detail).toBe('api error');
      expect(error.httpCode).toBe(500);
    }
  });

  it('should handle api success for json response', () => {
    mockHttpClient.request.mockReturnValue(
      new Promise((resolve, reject) => {
        resolve({
          status: 201,
          body: { test: 'test reply' },
          headers: {},
          requestUrl: 'test'
        });
      })
    );

    client
      .invoke({
        url: 'test',
        method: HttpMethod.Get,
        responseType: ResponseType.JSON
      })
      .then(
        (result) => {
          let auditCall: { parameters: IHttpHeader[] } = mockILogger.audit.mock.calls[0][0];
          expect(auditCall.parameters.find((h) => h.name === 'HttpMethod').value).toBe('GET');
          expect(auditCall.parameters.find((h) => h.name === 'ResponseStatus').value).toBe(201);
          expect(auditCall.parameters.find((h) => h.name === 'OutUrl').value).toBe('test');
          expect(auditCall.parameters.find((h) => h.name === 'Request').value).toBe('');
          expect(JSON.parse(auditCall.parameters.find((h) => h.name === 'Response').value).test).toBe('test reply');
        },
        (error) => {
          expect(true).toBeFalsy();
        }
      );
  });

  afterEach(() => {
    mockHttpClient.request.mockReset();
    mockILogger.audit.mockReset();
    mockJsonTransformer.jsonToClass.mockReset();
  });
});
