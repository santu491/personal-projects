import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { useAppUnavailable } from '../appUnavailable/useAppUnavailable';

describe('useAppUnavailable', () => {
  const mockContextValue = {
    appStatus: 'unavailable',
    appUnavailableErrorContext: 'Network Error',
    appUpdateAvailable: true,
    reloadApp: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the correct appStatus', () => {
    const { result } = renderHook(() => useAppUnavailable());
    expect(result.current.appStatus).toBe(mockContextValue.appStatus);
  });

  it('should return the correct appUnavailableErrorContext', () => {
    const { result } = renderHook(() => useAppUnavailable());
    expect(result.current.appUnavailableErrorContext).toBe(mockContextValue.appUnavailableErrorContext);
  });

  it('should return the correct appUpdateAvailable', () => {
    const { result } = renderHook(() => useAppUnavailable());
    expect(result.current.appUpdateAvailable).toBe(mockContextValue.appUpdateAvailable);
  });

  it('should return the correct reloadApp function', () => {
    const { result } = renderHook(() => useAppUnavailable());
    expect(result.current.reloadApp).toBe(mockContextValue.reloadApp);
  });
});
