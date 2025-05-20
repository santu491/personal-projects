import { getApiArgument } from './args';

describe('args UTest', () => {
  beforeEach(() => {
    //nop
  });

  it('getApiArgument testing', () => {
    expect(getApiArgument('dummy')).toBe('');

    process.argv.push('--api=demo');
    console.log(process.argv)
    expect(getApiArgument('api')).toBe('demo');

    process.env['npm_config_env'] = 'local';
    expect(getApiArgument('env')).toBe('local');
  });
});
