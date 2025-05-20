import { render } from '@testing-library/react-native';
import React from 'react';
import NetworkLogger from 'react-native-network-logger';

import { MainHeaderComponent } from '../../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { NetworkWatchLogger } from '../networkWatchLogger';

jest.mock('../../../../../../shared/src/components/mainHeader/mainHeaderComponent', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MainHeaderComponent: jest.fn(() => null),
}));

jest.mock('react-native-network-logger', () => jest.fn(() => null));

jest.mock('../useNetworkWatchLogger', () => ({
  useNetworkWatchLogger: jest.fn(() => ({
    onPressLeftArrow: jest.fn(),
  })),
}));

describe('NetworkWatchLogger', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<NetworkWatchLogger />);

    expect(getByTestId('menu.networkLogger')).toBeTruthy();
    expect(MainHeaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        onPressLeftArrow: expect.any(Function),
        isImmediateAssistanceVisible: false,
        hideLogin: true,
      }),
      {}
    );
    expect(NetworkLogger).toHaveBeenCalled();
  });
});
