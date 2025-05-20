import { InputScanner } from './inputScanner';

describe('InputScanner UTest', () => {
  let scanner: InputScanner;

  beforeEach(() => {
    scanner = new InputScanner(
      ['root.testMask', 'testMaskAll'],
      ['root.arr.testEncode', 'testEncodeAll'],
      ['root.test.testPassthrough'],
      {
        'root.test.testWhitelist': '^[a-zA-Z0-9\\-_\\$]{1,32}$',
      },
      {
        allowedTags: ['b', 'h4'],
        allowedAttributes: {
          '*': ['href', 'alt'],
        },
      },
      ['memberUid']
    );
  });

  it('should sanitize properties by default for html', () => {
    let result: any = scanner.scanInput({
      testSanitize: 'test<b>password</b>hello<script>scary</script>',
      test: {
        testSanitize: 'test<b>password</b>hello<script>scary</script>',
      },
    });
    expect(result.testSanitize).toBe('test<b>password</b>hello<script>scary</script>');
    expect(result.test.testSanitize).toBe('test<b>password</b>hello<script>scary</script>');
  });

  it('should throw error when charachter whitelist not adhered', () => {
    try {
      scanner.scanInput({
        testWhitelist: 'test~password',
        test: {
          testWhitelist: 'test~password',
        },
      });
    } catch (e) {
      expect(
        (e as Error).message.indexOf(
          'Invalid whitelist characters on root.test.testWhitelist'
        ) >= 0
      ).toBeTruthy();
    }

    let result: any = scanner.scanInput({
      testWhitelist: 'test~password',
      test: {
        testWhitelist: 'testpassword',
      },
    });
    expect(result.testWhitelist).toBe('test~password');
  });

  it('should mask senstive properties with full property path defined', () => {
    let result: any = scanner.scanInput({
      testMask: '****',
      test: {
        testMask: '****',
      },
    });
    expect(result.testMask).toBe('****');
    expect(result.test.testMask).toBe('****');
  });

  it('should not encode, mask or sanitize passthorugh properties', () => {
    let result: any = scanner.scanInput({
      testEncodeAll: 'test<script>password</script>hello',
      test: {
        testPassthrough: 'test<script>password</script>hello',
      },
    });
    expect(result.testEncodeAll).toBe(
      'test&lt;script&gt;password&lt;&#x2f;script&gt;hello'
    );
    expect(result.test.testPassthrough).toBe(
      'test<script>password</script>hello'
    );
  });

  it('should encode or sanitize senstive properties with full property path defined', () => {
    let result: any = scanner.scanInput({
      arr: [
        {
          testEncode: 'test<script>password</script>hello',
        },
      ],
      test: {
        testEncode: 'test<script>password</script>hello',
      },
    });
    expect(result.arr[0].testEncode).toBe(
      'test&lt;script&gt;password&lt;&#x2f;script&gt;hello'
    );
    expect(result.test.testEncode).toBe('test<script>password</script>hello');
  });

  it('should encode senstive properties with property name defined', () => {
    let result: any = scanner.scanInput({
      testEncodeAll: 'test<script>password</script>hello',
      test: {
        testEncodeAll: 'test<script>password</script>hello',
      },
    });
    expect(result.testEncodeAll).toBe(
      'test&lt;script&gt;password&lt;&#x2f;script&gt;hello'
    );
    expect(result.test.testEncodeAll).toBe(
      'test&lt;script&gt;password&lt;&#x2f;script&gt;hello'
    );
  });

  it('should mask senstive properties with property name defined', () => {
    let result: any = scanner.scanInput({
      testMaskAll: '****',
      test: {
        testMaskAll: '****',
      },
    });
    expect(result.testMaskAll).toBe('****');
    expect(result.test.testMaskAll).toBe('****');
  });

  it('should mask senstive properties in url', () => {
    let result = scanner.scanUrlParams(
      'http://www.anthem.com/api/test/123/test?test=123&testMaskAll=****'
    );
    expect(result).toBe(
      'http://www.anthem.com/api/test/123/test?test=123&testMaskAll=****'
    );

    result = scanner.scanUrlParams(
      'http://www.anthem.com/api/test/123/test?testMaskAll=456&test=123'
    );
    expect(result).toBe(
      'http://www.anthem.com/api/test/123/test?testMaskAll=****&test=123'
    );
  });
});
