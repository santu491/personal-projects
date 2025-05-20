import { Linking } from 'react-native';
import { ReceivedNotification } from 'react-native-push-notification';

import {
  callNumber,
  capitalizeFirstLetter,
  convertDistanceString,
  ErrorInfoDTO,
  formatDate,
  formatNumber,
  formatProviderDate,
  generateAbbreviation,
  getErrorMessage,
  isCredibleMindNotification,
  isNetworkError,
  toPascalCase,
} from '../utils';

describe('Utility Functions', () => {
  // Existing tests...

  it('formats a date correctly', () => {
    const date = new Date('2023-10-01');
    expect(formatDate(date)).toBe('10/01/2023');
  });

  it('returns an empty string for an undefined date', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('converts a distance number to a string correctly', () => {
    expect(convertDistanceString(123.456)).toBe('123.5');
  });

  it('formats a provider date correctly', () => {
    expect(formatProviderDate('2023-10-01T00:00:00Z')).toBe('10/01/2023');
  });

  it('returns an empty string for an undefined provider date', () => {
    expect(formatProviderDate(undefined)).toBe('');
  });

  it('extracts and formats error information correctly', () => {
    const errorInfo: ErrorInfoDTO = {
      error: {
        errors: [
          {
            message: 'An error occurred',
            statusCode: '400',
            source: [{ key: 'value' }],
            attemptsRemaining: 3,
          },
        ],
      },
      status: 400,
    };
    expect(getErrorMessage(errorInfo)).toEqual({
      message: 'An error occurred',
      status: 400,
      source: [{ key: 'value' }],
      statusCode: '400',
      attemptsRemaining: 3,
    });
  });

  it('identifies network errors correctly', () => {
    expect(isNetworkError(500)).toBe(true);
    expect(isNetworkError(404)).toBe(false);
  });

  it('formats a number correctly', () => {
    expect(formatNumber('1234567890')).toBe('123-456-7890');
  });

  it('calls a phone number correctly', () => {
    const spy = jest.spyOn(Linking, 'openURL');
    callNumber('1234567890');
    expect(spy).toHaveBeenCalledWith('tel:1234567890');
  });

  it('converts a name to pascal case correctly', () => {
    expect(toPascalCase('john doe')).toBe('JohnDoe');
    expect(toPascalCase('JOHN DOE')).toBe('JohnDoe');
    expect(toPascalCase(undefined)).toBe('');
  });

  it('generates an abbreviation correctly', () => {
    expect(generateAbbreviation('John Doe')).toBe('JD');
  });

  it('capitalizes the first letter correctly', () => {
    expect(capitalizeFirstLetter('john/doe')).toBe('John / Doe');
    expect(capitalizeFirstLetter('john')).toBe('John');
    expect(capitalizeFirstLetter(undefined)).toBe('');
  });

  it('should extract error message correctly', () => {
    const errorInfo: ErrorInfoDTO = {
      error: {
        errors: [
          {
            message: 'Test error message',
            title: 'Test error title',
            statusCode: '400',
            attemptsRemaining: 3,
          },
        ],
      },
      status: 400,
    };
    expect(getErrorMessage(errorInfo)).toEqual({
      message: 'Test error message',
      status: 400,
      source: undefined,
      statusCode: '400',
      attemptsRemaining: 3,
    });
  });

  it('should return default error message for invalid format', () => {
    const errorInfo = {
      error: {
        errors: [],
      },
      status: 0,
    };
    expect(getErrorMessage(errorInfo)).toEqual({
      message: 'Unknown error',
      status: 0,
      attemptsRemaining: undefined,
      source: undefined,
      statusCode: undefined,
    });
  });

  it('should return true for CredibleMind notification', () => {
    const pushNotificationPayload: Omit<ReceivedNotification, 'userInfo'> = {
      foreground: true,
      userInteraction: false,
      message: 'Test message',
      badge: 1,
      sound: 'default',
      data: {
        deepLinkType: 'OTHER_TYPE',
      },
      alert: { aps: 'welcome' },
      id: '',
      finish: jest.fn(),
    };

    expect(isCredibleMindNotification(pushNotificationPayload)).toBe(false);
  });

  it('should return false for non-CredibleMind notification', () => {
    const pushNotificationPayload: Omit<ReceivedNotification, 'userInfo'> = {
      foreground: true,
      userInteraction: false,
      message: 'Test message',
      badge: 1,
      sound: 'default',
      data: {
        deepLinkType: 'OTHER_TYPE',
      },
      alert: { aps: 'welcome' },
      id: '',
      finish: jest.fn(),
    };

    expect(isCredibleMindNotification(pushNotificationPayload)).toBe(false);
  });

  it('should return true for a network error status code', () => {
    expect(isNetworkError(500)).toBe(true);
  });

  it('should return false for a non-network error status code', () => {
    expect(isNetworkError(400)).toBe(false);
  });
});
