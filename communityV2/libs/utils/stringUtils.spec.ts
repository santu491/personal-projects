import { StringUtils } from './stringUtils';

describe('StringUtils UTest', () => {

  beforeEach(() => {
    //nop
  });

  it('toTitleCase testing', () => {
    expect(StringUtils.toTitleCase('1test')).toBe('1test');
    expect(StringUtils.toTitleCase('first second')).toBe('First Second');
    expect(StringUtils.toTitleCase('firstsecond')).toBe('Firstsecond');
  });

  it('trimRight testing', () => {
    expect(StringUtils.trimRight('1test')).toBe('1test');
    expect(StringUtils.trimRight('first ')).toBe('first');
    expect(StringUtils.trimRight('firstsecond  ')).toBe('firstsecond');
    expect(StringUtils.trimRight(' firstsecond  ')).toBe(' firstsecond');
    expect(StringUtils.trimRight('firstX', 'X')).toBe('first');
  });

  it('trimLeft testing', () => {
    expect(StringUtils.trimLeft('1test')).toBe('1test');
    expect(StringUtils.trimLeft(' first')).toBe('first');
    expect(StringUtils.trimLeft('  firstsecond')).toBe('firstsecond');
    expect(StringUtils.trimLeft(' firstsecond  ')).toBe('firstsecond  ');
    expect(StringUtils.trimLeft('Xfirst', 'X')).toBe('first');
  });

  it('substitute Unicode Symbols testing', () => {
    expect(StringUtils.substituteUnicodeSymbols('test – abc')).toBe('test - abc');
    expect(StringUtils.substituteUnicodeSymbols('test’s')).toBe('test\'s');
  });
});
