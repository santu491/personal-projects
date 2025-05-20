import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { Storage } from '../../../../../../shared/src/utils/storage/storage';
import { storage } from '../../../../../../src/util/storage';
import { NOTIFICATION_INFO_TOOLTIP, useNotificationInfoTooltip } from '../useNotificationInfoTooltip';

jest.mock('../../../../../../src/util/storage');

describe('useNotificationInfoTooltip', () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = {
      getBool: jest.fn(),
      setBool: jest.fn(),
      setString: jest.fn(),
      getString: jest.fn(),
      setInt: jest.fn(),
      getInt: jest.fn(),
      setObject: jest.fn(),
      getObject: jest.fn(),
      removeItem: jest.fn(),
      setNumber: jest.fn(),
      getNumber: jest.fn(),
      getAllKeys: jest.fn(),
    };
    (storage as jest.Mock).mockReturnValue(mockStorage);
  });

  it('should set visible to true if notification tooltip is not shown', async () => {
    (mockStorage.getBool as jest.Mock).mockResolvedValueOnce(false);

    const { result } = renderHook(() => useNotificationInfoTooltip());

    await waitFor(() => {
      expect(result.current.visible).toBe(true);
    });
  });

  it('should set visible to false if notification tooltip is shown', async () => {
    (mockStorage.getBool as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useNotificationInfoTooltip());

    await waitFor(() => {
      expect(result.current.visible).toBe(false);
    });
  });

  it('should handle error and set visible to true if storage throws an error', async () => {
    (mockStorage.getBool as jest.Mock).mockRejectedValueOnce(new Error('error'));

    const { result } = renderHook(() => useNotificationInfoTooltip());

    await waitFor(() => {
      expect(result.current.visible).toBe(true);
    });
  });

  it('should set visible to false and call setNotificationToolTipShown on onPressCloseIcon', async () => {
    const { result } = renderHook(() => useNotificationInfoTooltip());

    await waitFor(() => {
      expect(result.current.visible).toBe(true);
    });

    act(() => {
      result.current.onPressCloseIcon();
    });

    await waitFor(() => {
      expect(result.current.visible).toBe(false);
      expect(mockStorage.setBool).toHaveBeenCalledWith(NOTIFICATION_INFO_TOOLTIP, true);
    });
  });
});
