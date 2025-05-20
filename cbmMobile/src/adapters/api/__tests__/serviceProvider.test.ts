import { ServiceProvider } from '../serviceProvider';

describe('ServiceProvider', () => {
  let serviceProvider: ServiceProvider;

  beforeEach(() => {
    serviceProvider = {
      callService: jest.fn(),
    };
  });

  it('should call the service with correct parameters', async () => {
    const endpoint = '/test-endpoint';
    const method = 'POST';
    const body = { key: 'value' };
    const headers = { 'Content-Type': 'application/json' };

    await serviceProvider.callService(endpoint, method, body, headers);

    expect(serviceProvider.callService).toHaveBeenCalledWith(endpoint, method, body, headers);
  });

  it('should handle null body correctly', async () => {
    const endpoint = '/test-endpoint';
    const method = 'GET';
    const body = null;

    await serviceProvider.callService(endpoint, method, body);

    expect(serviceProvider.callService).toHaveBeenCalledWith(endpoint, method, body);
  });

  it('should handle boolean headers correctly', async () => {
    const endpoint = '/test-endpoint';
    const method = 'DELETE';
    const body = null;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const headers = { Authorization: true };

    await serviceProvider.callService(endpoint, method, body, headers);

    expect(serviceProvider.callService).toHaveBeenCalledWith(endpoint, method, body, headers);
  });
});
