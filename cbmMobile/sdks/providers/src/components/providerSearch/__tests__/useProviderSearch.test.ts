import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { useAppContext } from '../../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { getProvidersMockContext } from '../../../__mocks__/providersContext';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useProviderSearch } from '../useProviderSearch';

jest.mock('lodash', () => ({
  debounce: jest.fn((fn) => fn),
}));

jest.mock('../../../context/provider.sdkContext');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../../../../src/util/commonUtils');

const providerContextMock = {
  ...getProvidersMockContext(),
  serviceProvider: {
    callService: jest.fn(),
  },
  navigation: { navigate: jest.fn() },
};

const appContextMock = {
  setMemberAppointStatus: jest.fn(),
};

describe('useProviderSearch', () => {
  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue(providerContextMock);
    (useAppContext as jest.Mock).mockReturnValue(appContextMock);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProviderSearch({ hasSearchButton: false }));
    expect(result.current.getCounselorName).toBe('');
    expect(result.current.searchedLocation).toBe('');
    expect(result.current.getLocations).toEqual([]);
    expect(result.current.isCounselorNameFocused).toBe(false);
    expect(result.current.isLocationFocused).toBe(false);
    expect(result.current.enableSearch).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should update location on change', async () => {
    const { result } = renderHook(() => useProviderSearch({ hasSearchButton: false }));
    await act(async () => {
      result.current.onChangeLocation('New York');
    });
    expect(result.current.searchedLocation).toBe('New York');
    expect(providerContextMock.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.PROVIDER_ADDRESS,
      RequestMethod.POST,
      { data: 'New York' }
    );
  });

  it('should update location on change with empty', async () => {
    const { result } = renderHook(() => useProviderSearch({ hasSearchButton: false }));
    await act(async () => {
      result.current.onChangeLocation('');
    });
    expect(result.current.searchedLocation).toBe('');
  });

  it('should handle dropdown item press', async () => {
    const { result } = renderHook(() => useProviderSearch({ hasSearchButton: false }));
    const item = { title: 'New York', id: '1' };
    await act(async () => {
      await result.current.onPressDropDownItem(item);
    });
    expect(result.current.searchedLocation).toBe('New York');
    expect(providerContextMock.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.GEOCODE_ADDRESS,
      RequestMethod.POST,
      { data: 'New York' },
      {}
    );
  });

  it('should handle search', async () => {
    const { result } = renderHook(() => useProviderSearch({ hasSearchButton: false }));
    await act(async () => {
      await result.current.handleSearch();
    });
    expect(providerContextMock.setSelectedProviders).toHaveBeenCalledWith([]);
    expect(providerContextMock.setProvidersListArray).toHaveBeenCalledWith([]);
    expect(providerContextMock.setPage).toHaveBeenCalledWith(0);
    expect(providerContextMock.setProvidersResultCount).toHaveBeenCalledWith(0);
    expect(providerContextMock.setProvidersFiltersInfo).toHaveBeenCalledWith([]);
    expect(providerContextMock.setProvidersFilterQueryInfo).toHaveBeenCalledWith([]);
    expect(providerContextMock.setCounselorName).toHaveBeenCalledWith('');
    expect(providerContextMock.setIsAddOrRemoveCounselorEnabled).toHaveBeenCalledWith(false);
    expect(appContextMock.setMemberAppointStatus).toHaveBeenCalledWith(undefined);
    expect(providerContextMock.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.GEOCODE_ADDRESS,
      RequestMethod.POST,
      { data: '' },
      {}
    );
  });

  it('should handle focus and blur events', () => {
    const { result } = renderHook(() => useProviderSearch({ hasSearchButton: false }));
    act(() => {
      result.current.onFocusCounselor();
    });
    expect(result.current.isCounselorNameFocused).toBe(true);

    act(() => {
      result.current.onBlurCounselor();
    });
    expect(result.current.isCounselorNameFocused).toBe(false);

    act(() => {
      result.current.onFocusLocation();
    });
    expect(result.current.isLocationFocused).toBe(true);

    act(() => {
      result.current.onBlurLocation();
    });
    expect(result.current.isLocationFocused).toBe(false);
  });
});
