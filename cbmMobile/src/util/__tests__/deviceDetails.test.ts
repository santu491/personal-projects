import deviceInfo from 'react-native-device-info';

import { isIOS } from '../commonUtils';
import { deviceDetails } from '../deviceDetails';

jest.mock('react-native-device-info', () => ({
  getSystemVersion: jest.fn(),
  getVersion: jest.fn(),
}));

jest.mock('../commonUtils', () => ({
  isIOS: jest.fn(),
  isAndroid: jest.fn(),
}));

describe('deviceDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct device details for iOS', () => {
    (isIOS as jest.Mock).mockReturnValue(true);
    (deviceInfo.getSystemVersion as jest.Mock).mockReturnValue('14.4');
    (deviceInfo.getVersion as jest.Mock).mockReturnValue('1.0.0');

    const result = deviceDetails();

    expect(result).toEqual({
      metaDevice: {
        platform: 'ios',
        appVersion: '1.0.0',
        osVersion: '14.4',
        locale: 'en',
        timeZoneOffset: -330,
        badge: 0,
      },
    });
  });
});
