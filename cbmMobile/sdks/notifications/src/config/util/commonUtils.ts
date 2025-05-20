// commonUtils.ts
import { Linking } from 'react-native';

export const openDeviceSettings = () => {
  Linking.openSettings();
};
