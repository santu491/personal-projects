import { RequestValidator } from './requestValidator';

describe('RequestValidator UTest', () => {
  let sanitizer: RequestValidator;

  beforeEach(() => {
    sanitizer = new RequestValidator();
  });

  it('should sanitize by regex', () => {
    expect(sanitizer.sanitize('test$hello$', /\$/ig)).toBe('testhello');
  });
});
