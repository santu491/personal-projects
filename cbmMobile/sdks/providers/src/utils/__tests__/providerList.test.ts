import { getClientDetails } from '../../../../../src/util/commonUtils';
import { getProviderListPayload, ProvidersPayload } from '../providerList';

jest.mock('../../../../../src/util/commonUtils');

describe('getProviderListPayload', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('should return the correct payload', () => {
    const mockPayload: ProvidersPayload = {
      latitude: 40.7127753,
      longitude: -74.0059728,
      state: 'NY',
      counselorName: 'John Doe',
      page: 1,
      sort: { name: 'asc' },
    };

    const { filterQuery, providersPayload } = getProviderListPayload(mockPayload);

    // Check that the filterQuery is correct
    expect(filterQuery).toBeInstanceOf(Array);

    // Check that the providersPayload is correct
    expect(providersPayload).toHaveProperty('data');
    expect(providersPayload.data).toHaveProperty('query');
    expect(providersPayload.data.query).toHaveProperty('bool');
    expect(providersPayload.data.query.bool).toHaveProperty('should');
    expect(providersPayload.data.query.bool.should).toBeInstanceOf(Array);
    expect(providersPayload.data.query.bool).toHaveProperty('filter');
    expect(providersPayload.data.query.bool.filter).toHaveProperty('bool');
    expect(providersPayload.data.query.bool.filter.bool).toHaveProperty('must');
    expect(providersPayload.data.query.bool.filter.bool.must).toBeInstanceOf(Array);
    expect(providersPayload.data).toHaveProperty('sort');
    expect(providersPayload.data.sort).toBeInstanceOf(Array);
    expect(providersPayload.data).toHaveProperty('size');
    expect(providersPayload.data.size).toBe(10);
    expect(providersPayload.data).toHaveProperty('from');
    expect(providersPayload.data.from).toBe(mockPayload.page * 10);
  });
});
