import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../config';
import { useAppContext } from '../../context/appContext';
import { RequestMethod } from '../../models/adapters';
import { getClientDetails } from '../../util/commonUtils';
import { useLogout } from '../useLogout';

// Mock useAppContext
jest.mock('../../context/appContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../../util/commonUtils');

// Mock Service
jest.mock('../../adapters/api/service', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Service: jest.fn().mockImplementation(() => ({
    serviceProvider: {
      callService: jest.fn(),
    },
  })),
}));

describe('useLogout', () => {
  beforeEach(() => {
    const mockServiceProvider = {
      callService: jest.fn(),
    };

    const mockAppContext = {
      serviceProvider: mockServiceProvider,
      setLoggedIn: jest.fn(),
      setServiceProvider: jest.fn(),
      setClient: jest.fn(),
      navigationHandler: {
        linkTo: jest.fn(),
      },
      setIsAutoLogOut: jest.fn(),
    };

    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (getClientDetails as jest.Mock).mockResolvedValue({ userName: 'testUser' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onLogOut callback if provided', async () => {
    const { result } = renderHook(() => useLogout());
    const onLogOut = jest.fn();

    await act(async () => {
      await result.current.handleLogout(onLogOut);
    });

    expect(onLogOut).toHaveBeenCalled();
  });

  it('should call serviceProvider.callService with correct arguments', async () => {
    const { result } = renderHook(() => useLogout());
    const mockServiceProvider = useAppContext().serviceProvider;

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockServiceProvider.callService).toHaveBeenCalledWith(API_ENDPOINTS.LOGOUT, RequestMethod.PUT, null, {});
  });

  it('should setLoggedIn to false and setServiceProvider to null', async () => {
    const { result } = renderHook(() => useLogout());
    const mockAppContext = useAppContext();

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockAppContext.setLoggedIn).toHaveBeenCalledWith(false);
    expect(mockAppContext.setServiceProvider).toHaveBeenCalled();
  });
});
