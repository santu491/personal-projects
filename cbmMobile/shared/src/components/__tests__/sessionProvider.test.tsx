import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import { AppConfig } from '../../../../src/config';
import { useAppContext } from '../../../../src/context/appContext';
import { useLogout } from '../../../../src/hooks/useLogout';
import { SessionProvider } from '../sessionProvider';

// Mock useAppContext
jest.mock('../../../../src/context/appContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock useLogout
jest.mock('../../../../src/hooks/useLogout', () => ({
  useLogout: jest.fn(),
}));

describe('SessionProvider', () => {
  const mockAppContext = {
    loggedIn: true,
  };
  let mockHandleLogout: jest.Mock;

  beforeEach(() => {
    mockHandleLogout = jest.fn();

    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (useLogout as jest.Mock).mockReturnValue({ handleLogout: mockHandleLogout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not reset inactivity timeout if not logged in', () => {
    jest.useFakeTimers();

    mockAppContext.loggedIn = false;

    const { getByTestId } = render(
      <SessionProvider>
        <View testID="child-view" />
      </SessionProvider>
    );

    // Simulate touch event
    fireEvent(getByTestId('child-view'), 'startShouldSetResponder');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(AppConfig.SESSION_TIME_OUT * 1000);
    });

    // Ensure handleLogout has not been called
    expect(mockHandleLogout).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
