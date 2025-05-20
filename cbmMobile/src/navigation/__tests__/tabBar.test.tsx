/* eslint-disable @typescript-eslint/naming-convention */
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { render } from '@testing-library/react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppContext } from '../../context/appContext';
import { ChatInit } from '../../screens/chatInit/chatInit';
import { TabBar } from '../tabBar';
import { getActiveRoute } from '../utils/getActiveRoute';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('../utils/getActiveRoute', () => ({
  getActiveRoute: jest.fn(() => ({ params: { hideTabBar: true } })),
}));

jest.mock('../../context/appContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../../screens/chatInit/chatInit', () => ({
  ChatInit: jest.fn(() => null),
}));

describe('TabBar', () => {
  const defaultProps: BottomTabBarProps = {
    state: {
      index: 0,
      routes: [{ key: 'home', name: 'Home' }],
      key: '',
      routeNames: [],
      type: 'tab',
      stale: false,
      history: [],
    },
    descriptors: {},
    navigation: {
      dispatch: jest.fn(),
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
      isFocused: jest.fn(),
      canGoBack: jest.fn(),
      getParent: jest.fn(),
      getId: jest.fn(),
      getState: jest.fn(),
      emit: jest.fn(),
      setParams: jest.fn(),
    },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };
  const mockUseAppContext = useAppContext as jest.Mock;

  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ bottom: 0 });
    mockUseAppContext.mockReturnValue({ genesysChat: { enabled: true } });
  });

  it('renders correctly when visible', () => {
    (getActiveRoute as jest.Mock).mockReturnValueOnce({ params: { hideTabBar: false, hideChat: false } });
    const { getByTestId } = render(<TabBar {...defaultProps} />);
    expect(getByTestId('tab-bar')).toBeTruthy();
  });

  it('hides tab bar when HIDE_TAB_BAR_PARAM is true', () => {
    (getActiveRoute as jest.Mock).mockReturnValueOnce({ params: { hideTabBar: true } });
    const { queryByTestId } = render(<TabBar {...defaultProps} />);
    expect(queryByTestId('tab-bar')).toBeNull();
  });

  it('renders ChatInit component when genesysChat is enabled', () => {
    render(<TabBar {...defaultProps} />);
    expect(ChatInit).toHaveBeenCalled();
  });
});
