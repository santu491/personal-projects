import { formatPhoneNumber, MfaOptions } from '../commonUtils';

describe('commonUtils', () => {
  it('should have correct enum values', () => {
    expect(MfaOptions.EMAIL).toBe('Email');
    expect(MfaOptions.TEXT).toBe('Text');
    expect(MfaOptions.VOICE).toBe('Voice');
  });

  it('should format phone number correctly', () => {
    const phoneNumber = '+11234567890';
    const formatted = formatPhoneNumber(phoneNumber);
    expect(formatted).toBe('+1 (123) 456-7890');
  });

  it('should return empty string if phone number is undefined', () => {
    const formatted = formatPhoneNumber(undefined);
    expect(formatted).toBe('');
  });

  it('should return empty string if phone number is empty', () => {
    const formatted = formatPhoneNumber('');
    expect(formatted).toBe('');
  });
});
