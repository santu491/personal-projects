import { validateEmail, validateOTPCode } from '../validateInput';

describe('validateEmail', () => {
  it('should return true for a valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should return false for an invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('should return false for an email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('should return false for an email without "@" symbol', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });
});

describe('validateOTPCode', () => {
  it('should return true for a valid OTP code', () => {
    expect(validateOTPCode('123456')).toBe(true);
  });

  it('should return false for an OTP code with less than 6 digits', () => {
    expect(validateOTPCode('12345')).toBe(false);
  });

  it('should return false for an OTP code with more than 6 digits', () => {
    expect(validateOTPCode('1234567')).toBe(false);
  });

  it('should return false for an OTP code with non-numeric characters', () => {
    expect(validateOTPCode('12345a')).toBe(false);
  });
});
