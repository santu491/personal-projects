import moment from 'moment';
import { Dimensions, Platform } from 'react-native';

import { CLIENT_STORAGE_KEY } from '../../sdks/client/src/constants/constants';
import { Client } from '../../sdks/client/src/model/client';
import { WorkHour } from '../../sdks/providers/src/model/providerSearchResponse';
import { PLATFORM } from '../models/common';
import { storage, StorageNamespace } from './storage';

export const fetchDate = (timestamp: string): string => {
  const createdDate = moment(timestamp).fromNow();
  return createdDate;
};

export const dimensionCheck = () => {
  const deviceHeight = Dimensions.get('window').height;
  if (deviceHeight < 770) {
    // iphone se height is 667
    // Android pixel 6 height is 761
    return true;
  }
  return false;
};

export const isIOS = () => {
  return Platform.OS === PLATFORM.IOS;
};

export const isAndroid = () => {
  return Platform.OS === PLATFORM.ANDROID;
};

// Convert the name to pascal case
export const toPascalCase = (name?: string) => {
  return (
    name?.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    }) ?? ''
  );
};

export const formatNumber = (number: string) => {
  // Convert the number to a string
  const numberStr = number.toString();
  // Split the first 6 digits into two groups of 3 and the rest as is
  return `${numberStr.substring(0, 3)}-${numberStr.substring(3, 6)}-${numberStr.substring(6)}`;
};

export const sortDays = (schedule: WorkHour[]): WorkHour[] => {
  const daysOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  return schedule.sort((a, b) => {
    return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
  });
};

export const getClientDetails = async () => {
  const clientStorage = storage(StorageNamespace.ClientSDK);
  const clientDetails: Client | undefined = await clientStorage.getObject(CLIENT_STORAGE_KEY);
  if (!clientDetails) {
    throw new Error('Client details not found');
  }
  return clientDetails;
};

export const mergeAnalyticsDefaults = (data?: Record<string, unknown>): Record<string, string> => {
  const extraData: Record<string, string> = {};
  if (data) {
    Object.keys(data).forEach((key) => {
      extraData[key] = getStringValue(data[key]);
    });
  }
  return { ...extraData };
};

export const getStringValue = (data: unknown): string => {
  return data ? (typeof data === 'string' ? data : JSON.stringify(data)) : '';
};
