import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../shared/src/models';
import { ScreenNames } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { useNavigationFromLogin } from '../useNavigationFromLogin';

jest.mock('../../../../../src/context/appContext');

describe('useNavigationFromLogin', () => {
  interface MockAppContext {
    navigateScreen: string | undefined;
    navigationHandler: {
      linkTo: jest.Mock;
    };
    serviceProvider: {
      callService: jest.Mock;
    };
    setMemberAppointStatus: jest.Mock;
    setNavigateScreen: jest.Mock;
  }

  let mockAppContext: MockAppContext;

  beforeEach(() => {
    mockAppContext = {
      setMemberAppointStatus: jest.fn(),
      setNavigateScreen: jest.fn(),
      navigateScreen: undefined,
      navigationHandler: {
        linkTo: jest.fn(),
      },
      serviceProvider: {
        callService: jest.fn(),
      },
    };
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
  });

  it('should navigate to home if navigateScreen is not SCHEDULE_APPOINTMENT', async () => {
    const { result } = renderHook(() => useNavigationFromLogin());

    await act(async () => {
      await result.current.navigationFromLogin();
    });

    expect(mockAppContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
    expect(mockAppContext.setNavigateScreen).toHaveBeenCalledWith(undefined);
  });

  it('should call providerMemberStatusAPI if navigateScreen is SCHEDULE_APPOINTMENT', async () => {
    mockAppContext.navigateScreen = ScreenNames.SCHEDULE_APPOINTMENT;
    const { result } = renderHook(() => useNavigationFromLogin());

    await act(async () => {
      await result.current.navigationFromLogin('test-iamguid');
    });

    expect(mockAppContext.serviceProvider.callService).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      null,
      expect.objectContaining({ iamguid: 'test-iamguid' })
    );
  });

  it('should handle successful providerMemberStatusAPI response', async () => {
    mockAppContext.navigateScreen = ScreenNames.SCHEDULE_APPOINTMENT;
    mockAppContext.serviceProvider.callService.mockResolvedValue({
      data: { success: true, data: [{ selectedProviders: [] }] },
    });
    const { result } = renderHook(() => useNavigationFromLogin());

    await act(async () => {
      await result.current.navigationFromLogin('test-iamguid');
    });

    expect(mockAppContext.setMemberAppointStatus).toHaveBeenCalledWith({
      isAppointmentConfirmed: false,
      isContinue: true,
      isPending: false,
      data: [],
    });
    expect(mockAppContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.SCHEDULE_APPOINTMENT });
  });

  it('should handle failed providerMemberStatusAPI response and call getAppointmentTabStatus', async () => {
    mockAppContext.navigateScreen = ScreenNames.SCHEDULE_APPOINTMENT;
    mockAppContext.serviceProvider.callService.mockResolvedValue({ data: { success: false } });
    const { result } = renderHook(() => useNavigationFromLogin());

    await act(async () => {
      await result.current.navigationFromLogin('test-iamguid');
    });

    expect(mockAppContext.serviceProvider.callService).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      null,
      expect.objectContaining({ isSecureToken: true })
    );
  });
});
