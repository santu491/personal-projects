import { HttpMethod } from './enums/httpMethodEnum';
import { HttpClient } from './httpClient';
import { UrlHelper } from './urlHelper';

describe('HttpClient UTest', () => {
  let client: HttpClient;
  let http: any = jest.fn();

  beforeEach(() => {
    client = new HttpClient(new UrlHelper());
    client.mockHttp(http);
  });

  it('should run request interceptors', () => {
    client.addRequestInterceptor({
      transform: (o: any) => {
        o.data.test1 = 'test1';
        return o;
      }
    });
    client.request({
      url: 'http://test/mock/v1/url',
      method: HttpMethod.Post,
      data: {},
      urlParams: [],
      requestInterceptors: [
        {
          transform: (o) => {
            (o.data as any).test2 = 'test2';
            return o;
          }
        }
      ]
    });

    expect(http.mock.calls[0][0].body).toBe('{"test2":"test2","test1":"test1"}');
    http.mock.calls[0][1](undefined, { statusCode: 200 });
  });

  it('should trim spaces from url params and request json body', () => {
    client.request({
      url: 'http://test/mock/v1/url',
      method: HttpMethod.Post,
      data: {
        'test ': ' TestVal ',
        test2: {
          test: ' TestVal '
        }
      },
      urlParams: [
        {
          name: 'testParam1',
          value: ' TestParam ',
          isQueryParam: false
        },
        {
          name: 'testQParam1',
          value: ' TestQParam ',
          isQueryParam: true
        }
      ],
      trimSpaces: true
    });

    expect(http.mock.calls[0][0].url).toBe('http://test/mock/v1/url?testQParam1=TestQParam');
    expect(http.mock.calls[0][0].body).toBe('{"test":"TestVal","test2":{"test":"TestVal"}}');
    http.mock.calls[0][1](undefined, { statusCode: 200 });
  });

  it('should add url and query params properly to url', () => {
    client.request({
      url: 'http://test/mock/v1/:testParam1/url',
      method: HttpMethod.Get,
      urlParams: [
        {
          name: 'testParam1',
          value: ' TestParam ',
          isQueryParam: false
        },
        {
          name: 'testQParam1',
          value: 'TestQParam ',
          isQueryParam: true
        }
      ]
    });

    expect(http.mock.calls[0][0].url).toBe('http://test/mock/v1/%20TestParam%20/url?testQParam1=TestQParam%20');
    http.mock.calls[0][1](undefined, { statusCode: 200 });
  });

  it('should not json stringify multipart requests', () => {
    client.request({
      url: 'http://test/mock/v1/url',
      method: HttpMethod.Post,
      data: { test: 'test1' },
      isMultiPartRequest: true
    });

    expect(http.mock.calls[0][0].body).not.toBeDefined();
    expect(http.mock.calls[0][0].multipart.data.test).toBe('test1');
    http.mock.calls[0][1](undefined, { statusCode: 200 });
  });

  it('should json stringify none multipart requests', () => {
    client.request({
      url: 'http://test/mock/v1/url',
      method: HttpMethod.Post,
      data: { test: 'test1' },
      isMultiPartRequest: false
    });

    expect(http.mock.calls[0][0].body).toBe('{"test":"test1"}');
    expect(http.mock.calls[0][0].multipart).not.toBeDefined();
    http.mock.calls[0][1](undefined, { statusCode: 200 });
  });

  it('should reject promise if http response status is not 200', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get
      })
      .then(
        (r) => {
          expect(true).toBeFalsy();
        },
        (e) => {
          expect(e.status).toBe(400);
        }
      );

    http.mock.calls[0][1](undefined, { statusCode: 400 });
  });

  it('should parse json response with json header', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get
      })
      .then(
        (r) => {
          expect((r.body as any).test).toBe('test1');
        },
        (e) => {
          expect(true).toBeFalsy();
        }
      );

    http.mock.calls[0][1](undefined, { statusCode: 200, headers: { 'content-type': 'application/json' }, body: '{"test":"test1"}' });
  });

  it('should remove newlines from text/html responses', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get
      })
      .then(
        (r) => {
          expect(r.body).toBe('<div></div><div></div>');
        },
        (e) => {
          expect(true).toBeFalsy();
        }
      );

    http.mock.calls[0][1](undefined, { statusCode: 200, headers: { 'content-type': 'text/html' }, body: '<div></div>\n<div></div>\r\n' });
  });

  it('should not parse response body for undefined content type headers', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get
      })
      .then(
        (r) => {
          expect(r.body).toBe('<div></div>\n<div></div>\r\n');
        },
        (e) => {
          expect(true).toBeFalsy();
        }
      );

    http.mock.calls[0][1](undefined, { statusCode: 200, headers: { 'content-type': 'text/xhtml' }, body: '<div></div>\n<div></div>\r\n' });
  });

  it('should run response interceptors', () => {
    client.addResponseInterceptor({
      transform: (r) => {
        (r.body as any).test3 = 'test3';
        return r;
      }
    });
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get,
        responseInterceptors: [
          {
            transform: (r) => {
              (r.body as any).test2 = 'test2';
              return r;
            }
          }
        ]
      })
      .then(
        (r) => {
          expect((r.body as any).test).toBe('test1');
          expect((r.body as any).test2).toBe('test2');
          expect((r.body as any).test3).toBe('test3');
        },
        (e) => {
          expect(true).toBeFalsy();
        }
      );

    http.mock.calls[0][1](undefined, { statusCode: 200, headers: { 'content-type': 'application/json' }, body: '{"test":"test1"}' });
  });

  it('should set http headers to outgoing request', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get,
        headers: [
          {
            name: 'test-header',
            value: 'test-value'
          },
          {
            name: 'test-undefined',
            value: undefined
          }
        ]
      })
      .then(
        (r) => {},
        (e) => {
          expect(true).toBeFalsy();
        }
      );

    http.mock.calls[0][1](undefined, { statusCode: 200 });
    expect(http.mock.calls[0][0].headers['test-header']).toBe('test-value');
    expect(http.mock.calls[0][0].headers['test-undefined']).not.toBeDefined();
  });

  it('should return error data when response status not 200 or 201', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get
      })
      .then(
        (r) => {
        expect(true).toBeFalsy();
      },
      (e) => {
        expect(e.status).toBe(400);
        expect(e.body.error).toBe('error message');
        }
      );

    http.mock.calls[0][1]({ error: 'error message' }, { statusCode: 400 });
  });

  it('should return undefined status if raw response is null', () => {
    client
      .request({
        url: 'http://test/mock/v1/url',
        method: HttpMethod.Get
      })
      .then(
        (r) => {
        expect(true).toBeFalsy();
      },
      (e) => {
        expect(e.status).not.toBeDefined();
        expect(e.body.error).toBe('error message');
        }
      );

    http.mock.calls[0][1]({ error: 'error message' }, null);
  });

  afterEach(() => {
    http.mockReset();
  });
});
