import { hasProp, isUnknownObject } from '../hasProp';

describe('hasProp', () => {
  it('should return true if the object has the specified property', () => {
    const obj = { a: 1, b: 2 };
    expect(hasProp(obj, 'a')).toBe(true);
    expect(hasProp(obj, 'b')).toBe(true);
  });

  it('should return false if the object does not have the specified property', () => {
    const obj = { a: 1, b: 2 };
    expect(hasProp(obj, 'c')).toBe(false);
  });

  it('should return false if the input is not an object', () => {
    expect(hasProp(null, 'a')).toBe(false);
    expect(hasProp(undefined, 'a')).toBe(false);
    expect(hasProp(42, 'a')).toBe(false);
    expect(hasProp('string', 'a')).toBe(false);
  });
});

describe('isUnknownObject', () => {
  it('should return true if the input is an object', () => {
    expect(isUnknownObject({})).toBe(true);
    expect(isUnknownObject({ a: 1 })).toBe(true);
  });

  it('should return false if the input is not an object', () => {
    expect(isUnknownObject(null)).toBe(false);
    expect(isUnknownObject(undefined)).toBe(false);
    expect(isUnknownObject(42)).toBe(false);
    expect(isUnknownObject('string')).toBe(false);
  });
});
