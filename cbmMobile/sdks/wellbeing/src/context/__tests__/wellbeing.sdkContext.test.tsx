import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { useWithNavigation } from '../../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { getMockAppContext } from '../../../../../src/__mocks__/appContext';
import { useWellbeingContext, WellbeingContext } from '../wellbeing.sdkContext';

jest.mock('../../../../../shared/src/commonui/src/navigation/useWithNavigation');

describe('useWellbeingContext', () => {
  const mockUseWithNavigation = useWithNavigation as jest.MockedFunction<typeof useWithNavigation>;

  it('should throw an error if used outside of WellbeingContextProvider', () => {
    const { result } = renderHook(() => useWellbeingContext());
    expect(result.error).toEqual(new Error('useWellbeingContext must be used within a WellbeingContextProvider'));
  });

  it('should return context value when used within WellbeingContextProvider', () => {
    const mockContextValue = getMockAppContext();
    const expected = {
      ...mockContextValue,
      navigation: {
        navigate: jest.fn(),
        dispatch: jest.fn(),
        reset: jest.fn(),
        goBack: jest.fn(),
        isFocused: jest.fn(),
        canGoBack: jest.fn(),
        getParent: jest.fn(),
        getId: jest.fn(),
        getState: jest.fn(),
        setParams: jest.fn(),
        setOptions: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    };
    mockUseWithNavigation.mockReturnValue(expected);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WellbeingContext.Provider value={mockContextValue}>{children}</WellbeingContext.Provider>
    );

    const { result } = renderHook(() => useWellbeingContext(), { wrapper });
    expect(result.current).toEqual(expected);
  });
});
