import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { mockOutputScanner } from '@anthem/communityadminapi/security/mocks/mockOutputScanner';
import { OutputFilter } from './outputFilter';

describe('OutputFilter UTest', () => {
  beforeEach(() => {
    OutputFilter['_log'] = <any>mockILogger;
    OutputFilter['_scanner'] = <any>mockOutputScanner;
  });

  it('should scan json data', () => {
    OutputFilter.scanOutput({}, 500);
    expect(mockOutputScanner.scanInput.mock.calls[0][1]).toBe('500');
    OutputFilter.scanOutput([{}], 404);
    expect(mockOutputScanner.scanInput.mock.calls[1][1]).toBe('404');

    OutputFilter.scanOutput([{}], 0);
    expect(mockOutputScanner.scanInput.mock.calls[2][1]).toBe('0');
  });

  it('should scan non-json data as well', () => {
    OutputFilter.scanOutput('test', 500);
    expect(mockOutputScanner.scanInput.mock.calls.length).toBe(1);
  });

  afterEach(() => {
    mockOutputScanner.scanInput.mockReset();
  });
});
