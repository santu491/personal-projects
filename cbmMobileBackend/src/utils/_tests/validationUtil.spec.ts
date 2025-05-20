import {ValidationUtil} from '../validationUtil';

describe('ValidationUtil', () => {
  let validationUtil: ValidationUtil;
  beforeEach(() => {
    validationUtil = new ValidationUtil();
  });

  describe('isNullOrEmpty', () => {
    it('should return true if value is null or empty', () => {
      expect(validationUtil.isNullOrEmpty('')).toBe(true);
    });

    it('should return false if value is not null or empty', () => {
      expect(validationUtil.isNullOrEmpty('test')).toBe(false);
    });
  });

  describe('isValidString', () => {
    it('should return true if value is valid string', () => {
      expect(validationUtil.isValidString('test')).toBe(true);
    });

    it('should return false if value is not valid string', () => {
      expect(validationUtil.isValidString('test@')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true if value is valid email', () => {
      expect(validationUtil.isValidEmail('bhjsdbj@gmail.com')).toBe(true);
    });
  });
});
