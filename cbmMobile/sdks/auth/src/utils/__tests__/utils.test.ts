import { validateFirstLastName, validateSecret } from '../../utils';

describe('validateSecret', () => {
  it('should return true for a valid secret', () => {
    expect(validateSecret('Valid$123')).toBe(true);
  });

  it('should return false for a secret without lowercase letters', () => {
    expect(validateSecret('INVALID$123')).toBe(false);
  });

  it('should return false for a secret without uppercase letters', () => {
    expect(validateSecret('invalid$123')).toBe(false);
  });

  it('should return false for a secret without digits', () => {
    expect(validateSecret('Invalid$abc')).toBe(false);
  });

  it('should return false for a secret without special characters', () => {
    expect(validateSecret('Invalid123')).toBe(false);
  });

  it('should return false for a secret shorter than 8 characters', () => {
    expect(validateSecret('Val$1')).toBe(false);
  });
});

describe('validateFirstLastName', () => {
  it('should return true for a valid first or last name', () => {
    expect(validateFirstLastName('John')).toBe(true);
    expect(validateFirstLastName('Doe')).toBe(true);
    expect(validateFirstLastName('John-Doe')).toBe(true);
    expect(validateFirstLastName('John.Doe')).toBe(true);
    expect(validateFirstLastName('John,Doe')).toBe(true);
  });

  it('should return false for a name starting with a non-alphabetic character', () => {
    expect(validateFirstLastName('1John')).toBe(false);
    expect(validateFirstLastName('.Doe')).toBe(false);
  });

  it('should return false for a name containing invalid characters', () => {
    expect(validateFirstLastName('John@Doe')).toBe(false);
    expect(validateFirstLastName('John#Doe')).toBe(false);
  });
});
