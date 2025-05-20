import { mockProviderInfo } from '../../__mocks__/mockProviderInfo';
import { convertTo12Hour, getWorkHoursArray, toPascalCase, WeekDays } from '../commonUtils';

describe('commonUtils', () => {
  describe('toPascalCase', () => {
    it('should convert a string to Pascal case', () => {
      expect(toPascalCase('hello world')).toBe('Hello World');
      expect(toPascalCase('HELLO WORLD')).toBe('Hello World');
      expect(toPascalCase('hello')).toBe('Hello');
      expect(toPascalCase('')).toBe('');
      expect(toPascalCase(undefined)).toBe('');
    });
  });

  describe('getWorkHoursArray', () => {
    it('should return an array of work hours with correct format', () => {
      const expected = [
        { day: WeekDays.MON, hours: '7:00 AM - 9:00 PM', key: 0, key2: 0 },
        { day: WeekDays.TUE, hours: '7:00 AM - 9:00 PM', key: 1, key2: 1 },
        { day: WeekDays.WED, hours: '7:00 AM - 9:00 PM', key: 2, key2: 2 },
        { day: WeekDays.THU, hours: '7:00 AM - 9:00 PM', key: 3, key2: 3 },
        { day: WeekDays.FRI, hours: '7:00 AM - 9:00 PM', key: 4, key2: 4 },
        { day: WeekDays.SAT, hours: '7:00 AM - 9:00 PM', key: 5, key2: 5 },
        { day: WeekDays.SUN, hours: '7:00 AM - 9:00 PM', key: 6, key2: 6 },
      ];

      expect(getWorkHoursArray(mockProviderInfo)).toEqual(expected);
    });

    it('should return an empty array if no work hours are provided', () => {
      expect(getWorkHoursArray(undefined)).toEqual([]);
    });
  });

  describe('convertTo12Hour', () => {
    it('should convert military time to 12-hour format', () => {
      expect(convertTo12Hour(1200)).toBe('12:00 PM');
      expect(convertTo12Hour(1500)).toBe('3:00 PM');
      expect(convertTo12Hour(930)).toBe('9:30 AM');
    });
  });
});
