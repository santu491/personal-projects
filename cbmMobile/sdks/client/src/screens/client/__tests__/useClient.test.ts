import { act, renderHook } from '@testing-library/react-hooks';

import { getMockAppContext } from '../../../../../../src/__mocks__/appContext';
import { useAppContext } from '../../../../../../src/context/appContext';
import { useClientContext } from '../../../context/client.sdkContext';
import { useClient } from '../useClient';

jest.mock('../../../context/client.sdkContext');

jest.mock('../../../../../../src/util/storage');

jest.mock('../../../../../../src/context/appContext');

describe('useClient', () => {
  const mockServiceProvider = {
    callService: jest.fn(),
  };
  const mockClientContext = {
    ...getMockAppContext(),
    navigation: {
      navigate: jest.fn(),
    },
    navigationHandler: {
      linkTo: jest.fn(),
    },
    serviceProvider: mockServiceProvider,

    clientsListInfo: [
      {
        clientName: 'company-demo',
        clientUri: 'eap',
        source: 'eap',
        title: 'company-demo',
        id: '0',
      },
    ],
  };

  const mockAppContext = {
    setClient: jest.fn(),
    client: {
      groupId: '',
      logoUrl: '',
      subGroupName: '',
      supportNumber: '888-888-8888',
      userName: 'Company-demo',
    },
  };
  const clientResponse = {
    data: {
      data: mockClientContext.clientsListInfo,
    },
  };

  beforeEach(() => {
    (useClientContext as jest.Mock).mockReturnValue(mockClientContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);

    mockServiceProvider.callService.mockResolvedValue(clientResponse);
  });

  it('should initialize with default values', () => {
    mockServiceProvider.callService.mockResolvedValue(clientResponse);
    const { result } = renderHook(() => useClient());

    expect(result.current.showModel).toBe(false);
    expect(result.current.selectedClient).toBeUndefined();
    expect(result.current.searchText).toBe('');
    expect(result.current.clientsList).toEqual([]);
    expect(result.current.isClientFocused).toBe(false);
    expect(result.current.searchError).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set isClientFocused to true on onFocusClientInput', () => {
    const { result } = renderHook(() => useClient());

    act(() => {
      result.current.onFocusClientInput();
    });

    expect(result.current.isClientFocused).toBe(true);
  });

  it('should set isClientFocused to false on onBlurClientInput', () => {
    const { result } = renderHook(() => useClient());

    act(() => {
      result.current.onBlurClientInput();
    });

    expect(result.current.isClientFocused).toBe(false);
  });

  it('should set showModel to false on onPressGoBackButton', () => {
    const { result } = renderHook(() => useClient());

    act(() => {
      result.current.onPressGoBackButton();
    });

    expect(result.current.showModel).toBe(false);
  });

  it('should update clientsList and on  success autoClientSearchResults', async () => {
    const { result } = renderHook(() => useClient());

    (mockClientContext.serviceProvider.callService as jest.Mock).mockRejectedValue({ isSuccess: false });

    expect(result.current.isLoading).toBeFalsy();
  });

  it('should update clientsList and searchError on autoClientSearchResults', async () => {
    const { result } = renderHook(() => useClient());

    const searchText = 'company-demo';
    const clientResponse = {
      data: {
        success: true,
        clients: [
          {
            groupId: 'group1',
            clientId: 'client1',
            userName: 'user1',
            supportNumber: '1234567890',
            logoUrl: '',
            id: '12312',
            title: 'company-demo',
          },
        ],
      },
    };

    (mockClientContext.serviceProvider.callService as jest.Mock).mockResolvedValue(clientResponse);

    act(() => {
      result.current.onChangeClientName(searchText);
    });

    act(() => {
      result.current.onPressClientName(mockClientContext.clientsListInfo[0]);
    });

    expect(result.current.searchText).toEqual(searchText);
  });

  it('should update clientsList with success false', async () => {
    const { result } = renderHook(() => useClient());

    const searchText = 'user';
    const clientResponse = {
      data: {
        success: false,
      },
    };

    (mockClientContext.serviceProvider.callService as jest.Mock).mockResolvedValue(clientResponse);

    act(() => {
      result.current.onChangeClientName(searchText);
    });

    expect(result.current.clientsList).toEqual([]);
  });

  it('should handle error in autoClientSearchResults', async () => {
    const { result } = renderHook(() => useClient());
    const searchText = 'test';

    (mockClientContext.serviceProvider.callService as jest.Mock).mockRejectedValue(new Error('Network error'));

    act(() => {
      result.current.onChangeClientName(searchText);
    });

    expect(result.current.clientsList).toEqual([]);
    expect(result.current.searchError).toBe('client.errorMessage');
  });

  it('should update searchText with less than 3 characters', async () => {
    const { result } = renderHook(() => useClient());
    const searchText = 'te';

    act(() => {
      result.current.onChangeClientName(searchText);
    });

    expect(result.current.clientsList).toEqual([]);
  });

  it('should press onRequestModalClose', async () => {
    const { result } = renderHook(() => useClient());

    act(() => {
      result.current.onRequestModalClose();
    });

    expect(result.current.showModel).toBeFalsy();

    expect(result.current.drawerStep).toBe(0);
  });
});
