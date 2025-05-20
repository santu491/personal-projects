import { getOsEnv, toBool, toNumber } from './utils';

describe('utils UTest', () => {

  beforeEach(() => {
    //nop
  });

  it('getOsEnv testing', () => {
    expect(getOsEnv('lakmal')).not.toBeDefined();
    process.env.dummy = 'test';
    expect(getOsEnv('dummy')).toBe('test')
  });

  it('toNumber testing', () => {
    expect(toNumber('1')).toBe(1);
    expect(toNumber('dummy')).toBe(NaN)
  });

  it('toBool testing', () => {
    expect(toBool('1')).toBeFalsy();
    expect(toBool('false')).toBeFalsy();
    expect(toBool('true')).toBeTruthy();
  });
});
