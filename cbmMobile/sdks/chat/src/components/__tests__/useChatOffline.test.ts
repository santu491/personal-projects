import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../shared/src/models';
import { callNumber } from '../../../../../shared/src/utils/utils';
import { useChatContext } from '../../context/chat.sdkContext';
import { useChatOffline } from '../useChatOffline';

jest.mock('../../context/chat.sdkContext');
jest.mock('../../../../../shared/src/utils/utils');

describe('useChatOffline', () => {
  const mockNavigationHandler = { linkTo: jest.fn() };

  beforeEach(() => {
    (useChatContext as jest.Mock).mockReturnValue({
      navigationHandler: mockNavigationHandler,
      client: { supportNumber: '1234567890' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set supportNumber from client details', async () => {
    const { result } = renderHook(() => useChatOffline());
    expect(result.current.supportNumber).toBe('1234567890');
  });

  it('should call navigationHandler.linkTo with correct action when naviagteToHomeScreen is called', () => {
    const { result } = renderHook(() => useChatOffline());

    act(() => {
      result.current.naviagteToHomeScreen();
    });

    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME_SDK });
  });

  it('should call callNumber with supportNumber when phoneNumberTapped is called', async () => {
    const { result } = renderHook(() => useChatOffline());
    act(() => {
      result.current.phoneNumberTapped();
    });

    expect(callNumber).toHaveBeenCalledWith('1234567890');
  });

  it('should not call callNumber when phoneNumberTapped is called and supportNumber is undefined', async () => {
    (useChatContext as jest.Mock).mockReturnValue({
      navigationHandler: mockNavigationHandler,
      client: { supportNumber: undefined },
    });
    const { result } = renderHook(() => useChatOffline());

    act(() => {
      result.current.phoneNumberTapped();
    });

    expect(callNumber).not.toHaveBeenCalled();
  });
});
