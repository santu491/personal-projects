import { render } from '@testing-library/react-native';
import React from 'react';

import { App } from '../app';
import { AppStatus } from '../screens/appInit/appInitContext';
import { useAppInitInner } from '../screens/appInit/useAppInitInner';

jest.mock('../screens/appInit/useAppInitInner', () => ({
  useAppInitInner: jest.fn(),
}));

it('renders correctly', () => {
  (useAppInitInner as jest.Mock).mockReturnValue({
    appStatus: AppStatus.READY,
    contextValue: {},
  });
  render(<App />);
});
