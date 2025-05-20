import { EndpointConfig, ServiceEndpoint } from '../serviceEndpoint';

describe('ServiceEndpoint', () => {
  const mockConfig: EndpointConfig = {
    testEndpoint: {
      endpoint: '/api/test/{id}',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      options: { noAuthentication: true },
      responseType: 'base64',
      timeout: 5000,
    },
  };

  let serviceEndpoint: ServiceEndpoint<typeof mockConfig>;

  beforeEach(() => {
    serviceEndpoint = new ServiceEndpoint('testEndpoint');
  });

  it('should check if endpoint exists', () => {
    expect(serviceEndpoint.hasEndpoint(mockConfig)).toBe(true);
  });

  it('should get the method of the endpoint', () => {
    expect(serviceEndpoint.getMethod(mockConfig)).toBe('GET');
  });

  it('should get the options of the endpoint', () => {
    expect(serviceEndpoint.getOptions(mockConfig)).toEqual({ noAuthentication: true });
  });

  it('should get the response type of the endpoint', () => {
    expect(serviceEndpoint.getResponseType(mockConfig)).toBe('base64');
  });

  it('should get the headers of the endpoint', () => {
    expect(serviceEndpoint.getHeaders(mockConfig)).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should get the endpoint URL with params', () => {
    serviceEndpoint.setParams({ id: '123' });
    expect(serviceEndpoint.getEndpoint(mockConfig)).toBe('/api/test/123');
  });

  it('should append query params if not defined in the URL', () => {
    serviceEndpoint.setParams({ id: '123', query: 'test' });
    expect(serviceEndpoint.getEndpoint(mockConfig)).toBe('/api/test/123?query=test');
  });

  it('should remove unset query params from the URL', () => {
    serviceEndpoint.setParams({ id: '123' });
    expect(serviceEndpoint.getEndpoint(mockConfig)).toBe('/api/test/123');
  });

  it('should return undefined if no params are set', () => {
    expect(serviceEndpoint.getParams()).toBeUndefined();
  });

  it('should set params correctly', () => {
    const params = { id: '123', query: 'test' };
    serviceEndpoint.setParams(params);
    expect(serviceEndpoint.getParams()).toEqual(new Map(Object.entries(params)));
  });
});
