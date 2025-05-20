import { ApiAdapter } from '../apiAdapter';
import { Service } from '../service';

jest.mock('../apiAdapter');

describe('Service', () => {
  let service: Service;

  beforeEach(() => {
    service = new Service();
  });

  it('should create an instance of Service', () => {
    expect(service).toBeInstanceOf(Service);
  });

  it('should lazily initialize and return serviceProvider', () => {
    const serviceProvider = service.serviceProvider;
    expect(serviceProvider).toBeInstanceOf(ApiAdapter);
    const serviceProviderAfterInit = service.serviceProvider;
    expect(serviceProviderAfterInit).toBe(serviceProvider);
  });

  it('should return the same serviceProvider instance on subsequent calls', () => {
    const firstCall = service.serviceProvider;
    const secondCall = service.serviceProvider;
    expect(firstCall).toBe(secondCall);
  });
});
