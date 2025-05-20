/* eslint-disable @typescript-eslint/naming-convention */

import {
  dimensionCheck,
  fetchDate,
  formatNumber,
  getClientDetails,
  getStringValue,
  isAndroid,
  isIOS,
  mergeAnalyticsDefaults,
  sortDays,
  toPascalCase,
} from '../commonUtils';
import { storage } from '../storage';

jest.mock('react-native-keychain', () => {
  return {
    getGenericPassword: jest.fn(),
    token: '',
  };
});

// Mock the storage and its methods
jest.mock('../storage', () => ({
  storage: jest.fn(() => ({
    getObject: jest.fn(),
  })),
  StorageNamespace: {
    ClientSDK: 'ClientSDK',
  },
}));

describe('Test for validators', () => {
  it('test isIOS ', () => {
    expect(isIOS()).toBeTruthy();
  });

  it('test isAndroid', () => {
    expect(isAndroid()).toBeFalsy();
  });

  it('test timestamp creation date', () => {
    expect(fetchDate('27-02-2020')).toBeDefined();
  });

  it('test Dimentions height true', () => {
    expect(dimensionCheck()).toBeDefined();
  });
});
describe('Test for toPascalCase', () => {
  it('should convert a string to PascalCase', () => {
    expect(toPascalCase('hello world')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(toPascalCase('')).toBe('');
  });

  it('should handle undefined', () => {
    expect(toPascalCase(undefined)).toBe('');
  });
});

describe('Test for formatNumber', () => {
  it('should format a number string correctly', () => {
    expect(formatNumber('1234567890')).toBe('123-456-7890');
  });

  it('should handle short number strings', () => {
    expect(formatNumber('123')).toBe('123--');
  });

  it('should handle empty string', () => {
    expect(formatNumber('')).toBe('--');
  });
});

describe('Test for sortDays', () => {
  it('should sort days correctly', () => {
    const schedule = [
      { day: 'WED', hours: [''] },
      { day: 'MON', hours: [''] },
      { day: 'FRI', hours: [''] },
    ];
    const sortedSchedule = sortDays(schedule);
    expect(sortedSchedule[0].day).toBe('MON');
    expect(sortedSchedule[1].day).toBe('WED');
    expect(sortedSchedule[2].day).toBe('FRI');
  });

  it('should handle empty schedule', () => {
    expect(sortDays([])).toEqual([]);
  });
});

describe('Test for getClientDetails', () => {
  it('should throw an error if client details are not found', async () => {
    const mockClientDetails = { id: '123', name: 'Test Client' };
    const mockGetObject = jest.fn().mockResolvedValue(mockClientDetails);
    const mockStorage = jest.fn(() => ({
      getObject: mockGetObject,
      setString: jest.fn(),
      getString: jest.fn(),
      setBool: jest.fn(),
      getBool: jest.fn(),
      setNumber: jest.fn(),
      getNumber: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      getAllKeys: jest.fn(),
      setInt: jest.fn(),
      getInt: jest.fn(),
      setObject: jest.fn(),
    }));
    // Mock the storage function to return the mock storage object
    jest.mocked(storage).mockImplementation(mockStorage);

    const result = await getClientDetails();
    expect(result).toEqual(mockClientDetails);
  });

  describe('Test for mergeAnalyticsDefaults', () => {
    it('should merge analytics defaults with provided data', () => {
      const inputData = { key1: 'value1', key2: 123, key3: true };
      const result = mergeAnalyticsDefaults(inputData);
      expect(result).toEqual({
        key1: 'value1',
        key2: '123',
        key3: 'true',
      });
    });

    it('should return an empty object if no data is provided', () => {
      const result = mergeAnalyticsDefaults();
      expect(result).toEqual({});
    });

    it('should handle empty input object', () => {
      const result = mergeAnalyticsDefaults({});
      expect(result).toEqual({});
    });
  });

  describe('Test for getStringValue', () => {
    it('should return the string value if input is a string', () => {
      expect(getStringValue('test')).toBe('test');
    });

    it('should return the JSON stringified value if input is not a string', () => {
      expect(getStringValue({ key: 'value' })).toBe('{"key":"value"}');
      expect(getStringValue(123)).toBe('123');
      expect(getStringValue(true)).toBe('true');
    });

    it('should return an empty string if input is undefined or null', () => {
      expect(getStringValue(undefined)).toBe('');
      expect(getStringValue(null)).toBe('');
    });
  });
});
