import { Linking } from 'react-native';

import { openDeviceSettings } from '../commonUtils';

// commonUtils.test.ts

jest.mock('react-native', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Linking: {
    openSettings: jest.fn(),
  },
}));

describe('openDeviceSettings', () => {
  it('should call Linking.openSettings', () => {
    openDeviceSettings();
    expect(Linking.openSettings).toHaveBeenCalled();
  });
});
