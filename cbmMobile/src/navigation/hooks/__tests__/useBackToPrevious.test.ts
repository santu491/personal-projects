import { useNavigation, useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-hooks';

import { useBackToPrevious } from '../useBackToPrevious';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
  goBack: jest.fn(),
  popToTop: jest.fn(),
}));

describe('useBackToPrevious', () => {
  const addListenerMock = jest.fn();
  const dispatchMock = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      addListener: addListenerMock,
      dispatch: dispatchMock,
    });
    (useRoute as jest.Mock).mockReturnValue({
      params: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add beforeRemove listener on mount', () => {
    renderHook(() => useBackToPrevious());
    expect(addListenerMock).toHaveBeenCalledWith('beforeRemove', expect.any(Function));
  });

  it('should not prevent default behavior if BACK_TO_PREVIOUS_PARAM is not set', () => {
    renderHook(() => useBackToPrevious());
    const callback = addListenerMock.mock.calls[0][1];
    const preventDefaultMock = jest.fn();
    callback({ preventDefault: preventDefaultMock, data: { action: { type: 'NAVIGATE' } } });
    expect(preventDefaultMock).not.toHaveBeenCalled();
  });

  it('should not prevent default behavior if action type is REPLACE or RESET', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { BACK_TO_PREVIOUS_PARAM: 'some_value' },
    });
    renderHook(() => useBackToPrevious());
    const callback = addListenerMock.mock.calls[0][1];
    const preventDefaultMock = jest.fn();
    callback({ preventDefault: preventDefaultMock, data: { action: { type: 'REPLACE' } } });
    expect(preventDefaultMock).not.toHaveBeenCalled();
    callback({ preventDefault: preventDefaultMock, data: { action: { type: 'RESET' } } });
    expect(preventDefaultMock).not.toHaveBeenCalled();
  });
});
