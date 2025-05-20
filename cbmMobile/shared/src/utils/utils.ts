import { Dimensions, Linking, Platform } from 'react-native';
import { ReceivedNotification } from 'react-native-push-notification';

import { NotificationPayloadType } from '../../../src/models/common';

export interface ErrorInfoDTO {
  error: ErrorResponseDTO;
  status: number;
}

export interface ErrorResponseDTO {
  errors: ErrorContentDTO[];
}

export interface ErrorContentDTO {
  attemptsRemaining?: number;
  code?: string;
  errorType?: string;
  httpStatus?: string;
  message?: string;
  source?: SourceInfo[];
  status?: string;
  statusCode?: string;
  title?: string;
  type?: string;
}

export interface ErrorInfo {
  attemptsRemaining?: number;
  message: string;
  source?: SourceInfo[];
  status: number;
  statusCode?: string;
}

export interface SourceInfo {
  [key: string]: string;
}

export const formatNumber = (number: string) => {
  // Convert the number to a string
  const numberStr = number.toString();
  // Split the first 6 digits into two groups of 3 and the rest as is
  return `${numberStr.substring(0, 3)}-${numberStr.substring(3, 6)}-${numberStr.substring(6)}`;
};

export const formatPhoneNumber = (phone: string) => {
  return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
};

export const callNumber = (phone: string) => {
  const phoneNumber = `tel:${phone}`;
  Linking.openURL(phoneNumber);
};

export const sendSMS = (phone: string) => {
  const phoneNumber = `sms:${phone}`;
  Linking.openURL(phoneNumber);
};

// Convert the name to pascal case
export const toPascalCase = (name?: string) => {
  return (
    name
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') ?? ''
  );
};

export const generateAbbreviation = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

export const convertCapitalizeFirstLetter = (label?: string) => {
  return (label && label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()) ?? '';
};

export const capitalizeFirstLetter = (name?: string) => {
  return name && name.split('/').length > 1
    ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (name
        .split('/')
        .map((word) => convertCapitalizeFirstLetter(word))
        .join(' / ') ?? '')
    : convertCapitalizeFirstLetter(name);
};

export const formatDate = (date: Date | undefined) => {
  if (date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  return '';
};

export const convertDistanceString = (distanceString: number): string => {
  const roundedDistance = Math.round(distanceString * 10) / 10;
  return `${roundedDistance}`; // Return original string if no numeric part found
};

export const formatProviderDate = (dateTimeString?: string): string => {
  if (dateTimeString) {
    const date = new Date(dateTimeString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
  return '';
};

export const formatTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const timeValue = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hours}:${formattedMinutes} ${timeValue}`;
};

export const formatTo24Hour = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const month = months[date.getUTCMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const getErrorMessage = (errorInfo: ErrorInfoDTO): ErrorInfo => {
  try {
    const message = errorInfo.error.errors[0]?.message ?? errorInfo.error.errors[0]?.title ?? 'Unknown error';
    const status = errorInfo.status;
    const source = errorInfo.error.errors[0]?.source;
    const statusCode = errorInfo.error.errors[0]?.statusCode;
    const attemptsRemaining = errorInfo.error.errors[0]?.attemptsRemaining;
    return { message, status, source, statusCode, attemptsRemaining };
  } catch (e) {
    console.error('Failed to parse error message:', e);
    return { message: 'Invalid error format', status: 0 };
  }
};

export const isCredibleMindNotification = (pushNotificationPayload?: Omit<ReceivedNotification, 'userInfo'>) => {
  if (pushNotificationPayload) {
    return (
      pushNotificationPayload.data.deepLinkType.toLowerCase() === NotificationPayloadType.CREDIBLEMIND.toLowerCase()
    );
  }
  return false;
};

export const isNetworkError = (statusCode: number) => {
  return statusCode >= 500;
};

export enum ContactType {
  ADDRESS = 'ADDRESS',
  CALL = 'call',
  CHAT = 'chat',
  EMAIL = 'EMAIL',
  FAX = 'FAX',
  PHONE = 'PHONE',
  TEXT = 'text',
  WEBSITE = 'WEBSITE',
}

export const isAndroidTablet = () => {
  return Dimensions.get('window').width > 550;
};

export const openMap = (lat: number, lon: number) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${lat},${lon}`,
    android: `geo:0,0?q=${lat},${lon}`,
  });
  Linking.openURL(url || '').catch((err) => {
    console.error('Failed to open maps:', err);
  });
};

export const convertPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, ''); // Remove non-numeric characters
  const match = cleaned.match(/^1?(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    const intlCode = '+1 ';
    const part1 = match[1] ? `(${match[1]}` : '';
    const part2 = match[2] ? `) ${match[2]}` : '';
    const part3 = match[3] ? `-${match[3]}` : '';
    return `${intlCode}${part1}${part2}${part3}`.trim();
  }
  return phone;
};
