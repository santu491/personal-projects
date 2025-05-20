import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { useAppContext } from '../../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { useMenuContext } from '../../../context/menu.sdkContext';
import { useDeleteAccount } from '../useDeleteAccount';

jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../context/menu.sdkContext');
jest.mock('../../../../../../src/util/commonUtils');

const mockServiceProvider = { callService: jest.fn() };

describe('useDeleteAccount', () => {
  const mockAppContext = {
    navigationHandler: {
      requestHideTabBar: jest.fn(),
      linkTo: jest.fn(),
    },
    serviceProvider: mockServiceProvider,
    setLoggedIn: jest.fn(),
    setServiceProvider: jest.fn(),
  };

  const mockMenuContext = {
    navigation: {},
  };

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (useMenuContext as jest.Mock).mockReturnValue(mockMenuContext);
    (getClientDetails as jest.Mock).mockResolvedValue({ userName: 'testUser' });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useDeleteAccount());
    expect(result.current.showBottomSheet).toBe(false);
    expect(result.current.showAlert).toBe(false);
    expect(result.current.enableDeleteButton).toBe(false);
  });

  it('should handle cancel action', () => {
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.handleCancel();
    });
    expect(result.current.showBottomSheet).toBe(false);
  });

  it('should handle checkbox confirmation', () => {
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.handleCheckboxConfirmation();
    });
    expect(result.current.enableDeleteButton).toBe(true);
  });

  it('should handle delete account bottom sheet', () => {
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.handleDeleteAccountBottomSheet();
    });
    expect(result.current.showBottomSheet).toBe(true);
    expect(result.current.enableDeleteButton).toBe(false);
  });

  it('should handle delete account', async () => {
    mockAppContext.serviceProvider.callService.mockResolvedValue({});
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.handleCheckboxConfirmation();
    });
    await act(async () => {
      await result.current.handleDeleteAccount();
    });
    expect(mockAppContext.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.DELETE_ACCOUNT,
      RequestMethod.POST,
      null,
      {}
    );
    expect(mockAppContext.setLoggedIn).toHaveBeenCalledWith(false);
    expect(mockAppContext.setServiceProvider).toHaveBeenCalled();
  });

  it('should handle delete account error', async () => {
    mockAppContext.serviceProvider.callService.mockRejectedValue(new Error('Error'));
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.handleCheckboxConfirmation();
    });
    await act(async () => {
      await result.current.handleDeleteAccount();
    });
    expect(result.current.showAlert).toBe(false);
    expect(result.current.showBottomSheet).toBe(true);
  });

  it('should navigate to home', () => {
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.navigateToHome();
    });
    expect(result.current.showAlert).toBe(false);
  });
});
