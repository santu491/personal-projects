import { act, renderHook } from '@testing-library/react-hooks';

import { AppUpdateResponseDTO } from '../../models/versionUpdate';
import { AppStatus } from '../appInit/appInitContext';
import { AppInitInnerProps, useAppInitInner } from '../appInit/useAppInitInner';

jest.mock('react-native', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Linking: {
    openURL: jest.fn(),
  },
}));

describe('useAppInitInner', () => {
  const mockAppUpdateAvailable = jest.fn<Promise<AppUpdateResponseDTO>, []>();
  const mockReloadApp = jest.fn();

  const setup = (props: Partial<AppInitInnerProps> = {}) => {
    return renderHook(() =>
      useAppInitInner({
        appUpdateAvailable: mockAppUpdateAvailable,
        reloadApp: mockReloadApp,
        ...props,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set appStatus to READY if update is not forced', async () => {
    const response: AppUpdateResponseDTO = {
      data: { isForceUpdate: false, platform: 'https://example.com' },
    };
    mockAppUpdateAvailable.mockResolvedValue(response);

    const { result, waitFor } = setup();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    await waitFor(() => result.current.appStatus !== undefined);
    // Ensure no state updates are causing re-renders
    await act(async () => {});

    expect(result.current.appStatus).toBe(AppStatus.READY);
    expect(result.current.contextValue.appStatus).toBe(AppStatus.READY);
  });

  it('should set appStatus to ERROR if appUpdateAvailable throws an error', async () => {
    mockAppUpdateAvailable.mockRejectedValue(new Error('Network error'));

    const { result, waitForNextUpdate } = setup();

    await waitForNextUpdate();

    expect(result.current.appStatus).toBe(AppStatus.ERROR);
    expect(result.current.contextValue.appStatus).toBe(AppStatus.ERROR);
  });

  it('should set appStatus to ERROR if the device is rooted', async () => {
    jest.mock('jail-monkey', () => jest.fn(() => ({ isJailBroken: true })));

    const { result, waitFor } = setup();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    await waitFor(() => result.current.appStatus !== undefined);
    await act(async () => {});

    expect(result.current.appStatus).toBe(AppStatus.ERROR);
    expect(result.current.contextValue.appStatus).toBe(AppStatus.ERROR);
  });
});
