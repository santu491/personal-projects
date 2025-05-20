import { Platform } from 'react-native';
import deviceInfo from 'react-native-device-info';
import { getLocales } from 'react-native-localize';

import { UNIQUE_CHARACTER } from '../constants/constants';
import { getDeviceInstallation, setDeviceInstallation } from './deviceInstallationStorage';

export const deviceDetails = () => {
  const deviceVersion = deviceInfo.getSystemVersion();
  const appVersion = deviceInfo.getVersion();

  const deviceObject = {
    metaDevice: {
      platform: Platform.OS,
      appVersion,
      osVersion: deviceVersion,
      locale: getLocales()[0].languageCode,
      timeZoneOffset: -330,
      badge: 0,
    },
  };

  return deviceObject;
};

// Function to generate a random string
export const generateRandomString = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += UNIQUE_CHARACTER.charAt(Math.floor(Math.random() * UNIQUE_CHARACTER.length));
  }
  return result;
};

// Improved function to get the installation ID
export const getDeviceInstallationId = async (): Promise<string> => {
  try {
    let installationId = await getDeviceInstallation();
    if (!installationId) {
      installationId = generateRandomString(32);
      await setDeviceInstallation(installationId);
    }
    return installationId;
  } catch (error) {
    console.error('Error getting installation ID:', error);
    throw new Error('Failed to get installation ID');
  }
};

// Function to generate a new session ID
export const generateSessionId = async (): Promise<string> => {
  try {
    const sessionID = generateRandomString(16);
    return sessionID;
  } catch (error) {
    console.error('Error generating session ID:', error);
    throw new Error('Failed to generate session ID');
  }
};
