import { OutputScanner } from './outputScanner';

describe('OutputScanner UTest', () => {
  let scanner = new OutputScanner(
    [
      'root.exceptionMsg',
      'root.errors.detail',
      'root.errors.message',
      'root.exceptionMsg.exceptions.message',
      'root.exceptionMsg.exceptions.detail',
      'root.exceptions.message',
      'root.exceptions.detail',
      'root.test.test2'
    ],
    {
      'root.exceptionMsg': 'Application Error',
      'root.errors.detail': "Sorry, looks like something isn't working. Please give us some time to fix it. Then, try again.",
      'root.errors.message': 'Application Error',
      'root.exceptionMsg.exceptions.detail': "Sorry, looks like something isn't working. Please give us some time to fix it. Then, try again.",
      'root.exceptionMsg.exceptions.message': 'Application Error',
      '400.root.exceptionMsg': '400 Bad Request',
      '404.root.exceptionMsg': '404 Data Not Found',
      '500.root.exceptionMsg': '500 Internal Server Error',
      '403.root.exceptionMsg': '403 Forbidden'
    },
    ['memberUid']
  );
  beforeEach(() => {
    //nop
  });

  it('should show default error when no error mapping available', () => {
    let result: any = scanner.scanInput({ test: 'test' }, '200');
    expect(result.test).toBe('test');

    result = scanner.scanInput(
      {
        test: [
          {
            test2: 'test'
          }
        ]
      },
      '500'
    );
    expect(result.test[0].test2).toBe('Application Error');
  });

  it('should not suppress properties not configured', () => {
    let result: any = scanner.scanInput({ test: 'test' }, '200');
    expect(result.test).toBe('test');

    result = scanner.scanInput(
      {
        errors: [
          {
            test2: 'test'
          }
        ],
        exceptionMsg: 'custom error'
      },
      '400'
    );
    expect(result.errors[0].test2).toBe('test');
    expect(result.exceptionMsg).toBe('400 Bad Request');

    result = scanner.scanInput(
      {
        exceptionMsg: { test: 'no error' }
      },
      '500'
    );
    expect(result.exceptionMsg).toBe('500 Internal Server Error');

    result = scanner.scanInput(
      {
        exceptionMsg: [{ test: 'no error' }]
      },
      '500'
    );
    expect(result.exceptionMsg).toBe('500 Internal Server Error');

    result = scanner.scanInput(
      {
        errors: [
          {
            test2: 'test',
            detail: 'test',
            message: { test: 'err msg' }
          }
        ]
      },
      '500'
    );
    expect(result.errors[0].detail).toBe("Sorry, looks like something isn't working. Please give us some time to fix it. Then, try again.");
    expect(result.errors[0].message).toBe('Application Error');

    result = scanner.scanInput('app error', '500');
    expect(result).toBe('app error');
  });
});
